// Titanium Fit contact endpoint — runs entirely on Cloudflare Pages Functions.
//
// EN: The form used to be relayed to a Google Apps Script living in a free
//     Gmail account. That account was disabled and the form died with it. Now
//     validation, Turnstile verification, rate limiting and both emails happen
//     here, so the form no longer depends on any Google account.
// ES: Antes el formulario se reenviaba a un Google Apps Script que vivía en
//     una cuenta gratuita de Gmail. Esa cuenta fue inhabilitada y el formulario
//     murió con ella. Ahora la validación, Turnstile, el límite de envíos y los
//     dos correos se hacen aquí: el formulario ya no depende de Google.
//
// Required configuration (Cloudflare Pages -> Settings):
//   Bindings              KV namespace bound as LEADS (rate-limit records only;
//                         it stores a hash of email+phone, never the lead)
//   TURNSTILE_SECRET_KEY  (secret) Cloudflare Turnstile secret key
//   RESEND_API_KEY        (secret) Resend API key
//   MAIL_FROM             sender on a verified domain, e.g. titanium@arielfyblabs.com.do
//   ADMIN_EMAIL           where the admin notification goes
// Until all of them exist, POST answers 503 and the page shows its generic
// "could not send" message. See README.md.

const SETTINGS = Object.freeze({
  SENDER_NAME: 'Titanium Fit | Ariel FyB Labs',
  CENTRAL_PORTFOLIO_URL: 'https://arielfyblabs.com.do/',
  GITHUB_URL: 'https://github.com/CoderX396/modern-landing-showcase',
  FIVERR_URL: 'https://es.fiverr.com/s/qDE81rd',
  MAX_REQUEST_CHARS: 15_000,
  MIN_COMMENT_CHARS: 100,
  MAX_COMMENT_CHARS: 1000,
  MAX_SUBMISSIONS: 3,
  RATE_WINDOW_MS: 24 * 60 * 60 * 1000,
  // Every accepted lead sends two emails. This caps the whole site per day,
  // whoever is submitting: a demo has no reason to send more than this.
  MAX_LEADS_PER_DAY: 30,
  ALLOWED_HOSTNAMES: ['titanium-fitness.pages.dev'],
});

const PLAN_LABELS = Object.freeze({
  base: 'Base Plan / Plan Base',
  vip: 'Total VIP Plan / Plan VIP Total',
});

const GOAL_LABELS = Object.freeze({
  fat_loss: 'Body recomposition (Fat loss) / Recomposición corporal',
  muscle: 'Hypertrophy (Build muscle) / Hipertrofia',
  health: 'Aerobic capacity / General health / Capacidad aeróbica / Salud general',
});

const isConfigured = (env) =>
  !!(env.LEADS && env.TURNSTILE_SECRET_KEY && env.RESEND_API_KEY && env.MAIL_FROM && env.ADMIN_EMAIL);

export function onRequestGet({ env }) {
  return json({
    ok: true,
    service: 'Titanium Fit contact form',
    backend: isConfigured(env) ? 'configured' : 'not_configured',
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const requestOrigin = request.headers.get('Origin');
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return json({ error: 'forbidden_origin' }, 403);
  }

  if (!isConfigured(env)) return json({ error: 'not_configured' }, 503);

  let payload;
  try {
    const rawBody = await request.text();
    if (!rawBody || rawBody.length > SETTINGS.MAX_REQUEST_CHARS) {
      return json({ error: 'invalid_request' }, 400);
    }
    payload = JSON.parse(rawBody);
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }

  try {
    const validation = validateLead(payload);
    if (!validation.ok) return json({ error: validation.code }, 400);
    const lead = validation.lead;

    const turnstile = await verifyTurnstile(lead.turnstileToken, request, env);
    if (!turnstile.ok) return json({ error: 'captcha_failed' }, 400);

    const reservation = await reserveSubmission(lead, env);
    if (!reservation.ok) {
      if (reservation.code === 'quota_exceeded') return json({ error: 'quota_exceeded' }, 503);
      return json({ error: 'rate_limited', remaining: 0, resetAt: reservation.resetAt }, 429);
    }
    if (reservation.duplicate) {
      return json({ success: true, duplicate: true, remaining: reservation.remaining, resetAt: reservation.resetAt });
    }

    try {
      await sendLeadEmails(lead, env);
    } catch (error) {
      // The attempt is given back: the visitor did nothing wrong.
      console.error('Titanium Fit email delivery failed', error);
      await releaseSubmission(reservation, env);
      return json({ error: 'delivery_failed' }, 502);
    }

    return json({ success: true, remaining: reservation.remaining, resetAt: reservation.resetAt });
  } catch (error) {
    console.error('Titanium Fit submission failed', error);
    return json({ error: 'delivery_failed' }, 502);
  }
}

function validateLead(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, code: 'invalid_request' };
  }

  const lead = {
    submissionId: stringValue(payload.submissionId).trim(),
    firstName: stringValue(payload.firstName).trim(),
    lastName: stringValue(payload.lastName).trim(),
    email: stringValue(payload.email).trim().toLowerCase(),
    phone: stringValue(payload.phone).trim(),
    plan: stringValue(payload.plan).trim(),
    goal: stringValue(payload.goal).trim(),
    comment: stringValue(payload.comment).trim(),
    turnstileToken: stringValue(payload.turnstileToken).trim(),
  };

  if (!/^[A-Za-z0-9-]{8,100}$/.test(lead.submissionId)) {
    return { ok: false, code: 'invalid_request' };
  }
  if (!validTextLength(lead.firstName, 1, 60) || !validTextLength(lead.lastName, 1, 60)) {
    return { ok: false, code: 'invalid_name' };
  }
  if (lead.email.length > 254 ||
      !/^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/.test(lead.email)) {
    return { ok: false, code: 'invalid_email' };
  }

  const phoneDigits = lead.phone.replace(/\D/g, '');
  if (lead.phone.length > 40 || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return { ok: false, code: 'invalid_phone' };
  }
  if (!Object.prototype.hasOwnProperty.call(PLAN_LABELS, lead.plan)) {
    return { ok: false, code: 'invalid_plan' };
  }
  if (!Object.prototype.hasOwnProperty.call(GOAL_LABELS, lead.goal)) {
    return { ok: false, code: 'invalid_goal' };
  }
  if (!validTextLength(lead.comment, SETTINGS.MIN_COMMENT_CHARS, SETTINGS.MAX_COMMENT_CHARS)) {
    return { ok: false, code: 'invalid_comment' };
  }
  if (!lead.turnstileToken || lead.turnstileToken.length > 2048) {
    return { ok: false, code: 'captcha_failed' };
  }

  return { ok: true, lead };
}

async function verifyTurnstile(token, request, env) {
  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) body.set('remoteip', ip);

    const response = await fetch(
      env.TURNSTILE_API || 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body },
    );
    const result = await response.json();
    if (!response.ok || result.success !== true) {
      console.error('Turnstile rejected the token:', JSON.stringify(result['error-codes'] || []));
      return { ok: false };
    }

    // The token must have been issued for this site, not harvested elsewhere.
    const allowed = [...SETTINGS.ALLOWED_HOSTNAMES, new URL(request.url).hostname.toLowerCase()];
    const verifiedHostname = stringValue(result.hostname).toLowerCase();
    if (!verifiedHostname || !allowed.includes(verifiedHostname)) return { ok: false };

    return { ok: true };
  } catch (error) {
    console.error('Turnstile verification failed', error);
    return { ok: false };
  }
}

// KV has no locks or transactions: two submissions landing in the same instant
// could both be counted as one. For a brake against abuse that is fine.
async function reserveSubmission(lead, env) {
  const now = Date.now();
  const identity = `${lead.email}|${lead.phone.replace(/\D/g, '')}`;
  const rateKey = `rate:${await sha256Hex(identity)}`;
  const dayKey = `day:${new Date(now).toISOString().slice(0, 10)}`;

  let record = await env.LEADS.get(rateKey, 'json');
  if (!record || !record.resetAt || record.resetAt <= now || !Array.isArray(record.submissionIds)) {
    record = { count: 0, resetAt: now + SETTINGS.RATE_WINDOW_MS, submissionIds: [] };
  }

  if (record.submissionIds.includes(lead.submissionId)) {
    return {
      ok: true,
      duplicate: true,
      remaining: Math.max(0, SETTINGS.MAX_SUBMISSIONS - record.count),
      resetAt: record.resetAt,
    };
  }

  if (record.count >= SETTINGS.MAX_SUBMISSIONS) {
    return { ok: false, code: 'rate_limited', resetAt: record.resetAt };
  }

  const today = Number(await env.LEADS.get(dayKey)) || 0;
  if (today >= SETTINGS.MAX_LEADS_PER_DAY) return { ok: false, code: 'quota_exceeded' };

  record.count += 1;
  record.submissionIds = [...record.submissionIds, lead.submissionId].slice(-SETTINGS.MAX_SUBMISSIONS);

  // Expired records delete themselves: KV needs a TTL of at least 60 seconds.
  const ttl = Math.max(60, Math.ceil((record.resetAt - now) / 1000));
  await env.LEADS.put(rateKey, JSON.stringify(record), { expirationTtl: ttl });
  await env.LEADS.put(dayKey, String(today + 1), { expirationTtl: 2 * 24 * 60 * 60 });

  return {
    ok: true,
    duplicate: false,
    remaining: SETTINGS.MAX_SUBMISSIONS - record.count,
    resetAt: record.resetAt,
    rateKey,
    record,
    submissionId: lead.submissionId,
  };
}

async function releaseSubmission(reservation, env) {
  try {
    const record = {
      ...reservation.record,
      count: Math.max(0, reservation.record.count - 1),
      submissionIds: reservation.record.submissionIds.filter((id) => id !== reservation.submissionId),
    };
    const ttl = Math.max(60, Math.ceil((record.resetAt - Date.now()) / 1000));
    await env.LEADS.put(reservation.rateKey, JSON.stringify(record), { expirationTtl: ttl });
  } catch (error) {
    console.error('Could not release the reserved attempt', error);
  }
}

async function sendLeadEmails(lead, env) {
  const fullName = `${lead.firstName} ${lead.lastName}`.trim();
  const safeSubjectName = fullName.replace(/[\r\n]+/g, ' ').slice(0, 80);
  const planLabel = PLAN_LABELS[lead.plan];
  const goalLabel = GOAL_LABELS[lead.goal];
  const from = `${SETTINGS.SENDER_NAME} <${env.MAIL_FROM}>`;

  // The admin notification goes first: if it fails, the visitor is told the
  // request did not go through instead of receiving a confirmation for a lead
  // nobody will see.
  await sendEmail(env, {
    from,
    to: [env.ADMIN_EMAIL],
    reply_to: lead.email,
    subject: `[Titanium Fit] New lead / Nuevo lead — ${safeSubjectName}`,
    text: adminPlainText(lead, fullName, planLabel, goalLabel),
    html: adminHtml(lead, fullName, planLabel, goalLabel),
  });

  await sendEmail(env, {
    from,
    to: [lead.email],
    reply_to: env.ADMIN_EMAIL,
    subject: 'Titanium Fit — Request received / Solicitud recibida',
    text: autoresponderPlainText(lead, fullName, planLabel, goalLabel),
    html: autoresponderHtml(lead, fullName, planLabel, goalLabel),
  });
}

async function sendEmail(env, message) {
  const response = await fetch(`${env.RESEND_API || 'https://api.resend.com'}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Email provider answered ${response.status}: ${detail.slice(0, 200)}`);
  }
}

function adminHtml(lead, fullName, planLabel, goalLabel) {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;background:#ffffff;">
  <div style="background:#111827;padding:45px 30px;text-align:center;">
    <h1 style="margin:0;font-size:38px;font-weight:900;letter-spacing:1px;"><span style="color:#ffffff;">TITANIUM</span><span style="color:#FF7A1A;">FIT</span></h1>
    <p style="margin:15px 0 0;color:#CBD5E1;font-size:16px;">Admin Notification / Notificación para el Administrador</p>
    <p style="margin:5px 0 0;color:#94A3B8;font-size:14px;">New Contact Lead / Nuevo Lead de Contacto</p>
  </div>
  <div style="padding:40px;">
    <h2 style="color:#FF7A1A;margin-top:0;margin-bottom:20px;">🚀 New Lead Received / 🚀 Nuevo Lead Recibido</h2>
    <p style="font-size:16px;color:#475569;line-height:1.8;"><strong>EN:</strong> A new contact request has been submitted through the Titanium Fit website. The following information was provided by the lead.<br><br><strong>ES:</strong> Se ha enviado una nueva solicitud de contacto desde el sitio web de Titanium Fit. El cliente proporcionó la siguiente información.</p>
    <table style="width:100%;border-collapse:collapse;margin-top:30px;">
      ${adminRow('Name / Nombre', fullName)}
      ${adminRow('Email / Correo Electrónico', lead.email)}
      ${adminRow('WhatsApp', lead.phone)}
      ${adminRow('Selected Plan / Plan Seleccionado', planLabel)}
      ${adminRow('Goal / Objetivo', goalLabel)}
      ${adminRow('Comment / Comentario', lead.comment)}
    </table>
    <div style="margin-top:24px;padding:16px;background:#FFF7ED;border-left:4px solid #FF7A1A;border-radius:4px;">
      <strong style="color:#9A3412;">Action Required / Acción Requerida</strong>
      <p style="margin:8px 0 0;color:#7C2D12;line-height:1.6;"><strong>EN:</strong> Please contact this lead as soon as possible to continue the sales process and maximize the opportunity for conversion.<br><br><strong>ES:</strong> Ponte en contacto con este cliente lo antes posible para continuar el proceso de venta y maximizar la oportunidad de conversión.</p>
    </div>
  </div>
</div>`;
}

function adminRow(label, value) {
  return `<tr>
    <td style="padding:10px;border-bottom:1px solid #eee;vertical-align:top;"><strong>${escapeHtml(label)}</strong></td>
    <td style="padding:10px;border-bottom:1px solid #eee;white-space:pre-wrap;word-break:break-word;">${escapeHtml(value)}</td>
  </tr>`;
}

function autoresponderHtml(lead, fullName, planLabel, goalLabel) {
  return `
<div style="max-width:700px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
  <div style="background:#111827;padding:45px 30px;text-align:center;">
    <h1 style="margin:0;font-size:38px;font-weight:900;letter-spacing:1px;"><span style="color:#ffffff;">TITANIUM</span><span style="color:#FF7A1A;">FIT</span></h1>
    <p style="margin:15px 0 0;color:#CBD5E1;font-size:16px;">Professional Fitness Landing Page / Landing Page Profesional de Fitness</p>
    <p style="margin:5px 0 0;color:#94A3B8;font-size:14px;">HTML • CSS • JavaScript • Cloudflare Pages Functions</p>
  </div>
  <div style="padding:40px;">
    <h2 style="margin-top:0;color:#111827;">Hello / Hola ${escapeHtml(lead.firstName)} 👋</h2>
    <p style="font-size:16px;color:#475569;line-height:1.8;"><strong>EN:</strong> Thank you for contacting Titanium Fit. Your request has been received successfully.<br><br><strong>ES:</strong> Gracias por contactar con Titanium Fit. Hemos recibido tu solicitud correctamente.</p>
    <p style="font-size:16px;color:#475569;line-height:1.8;"><strong>EN:</strong> Our team will review your request and contact you as soon as possible.<br><br><strong>ES:</strong> Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo lo antes posible.</p>
    <p style="font-size:16px;color:#475569;line-height:1.8;"><strong>EN:</strong> We also received your comments about the page — thank you for taking the time to share your thoughts with us.<br><br><strong>ES:</strong> También recibimos tu comentario sobre la página — gracias por tomarte el tiempo de compartirnos tu opinión.</p>
    <table style="width:100%;border-collapse:collapse;margin-top:30px;">
      ${replyRow('Name / Nombre', fullName)}
      ${replyRow('Email / Correo', lead.email)}
      ${replyRow('Phone / Teléfono', lead.phone)}
      ${replyRow('Plan', planLabel)}
      ${replyRow('Fitness Goal / Objetivo', goalLabel)}
    </table>
    <div style="margin-top:35px;padding:25px;background:#F8FAFC;border-left:5px solid #FF7A1A;">
      <h3 style="margin-top:0;color:#111827;">About this project / Sobre este proyecto</h3>
      <p style="margin-bottom:0;color:#475569;line-height:1.8;"><strong>EN:</strong> This email is part of a live portfolio demonstration by Ariel FyB Labs. The Titanium Fit landing page showcases:<br><br><strong>ES:</strong> Este correo forma parte de una demostración en vivo de Ariel FyB Labs. La landing page Titanium Fit incluye:</p>
      <ul style="color:#475569;line-height:1.9;">
        <li>Responsive Design / Diseño Responsivo</li>
        <li>Serverless Contact Form / Formulario sin servidor (Cloudflare Pages Functions)</li>
        <li>Automatic Email Confirmation / Confirmación Automática</li>
        <li>Turnstile Spam Protection / Protección Antispam Turnstile</li>
        <li>WhatsApp Integration / Integración con WhatsApp</li>
        <li>Dark / Light Mode</li>
        <li>SEO Optimized / Optimizado para SEO</li>
      </ul>
    </div>
    <div style="margin-top:20px;padding:25px;background:#F8FAFC;border-left:5px solid #22C55E;">
      <p style="margin:0;color:#475569;line-height:1.8;font-weight:bold;"><strong>EN:</strong> Ready to scale your business with a professional landing page? Visit my Fiverr profile to discuss your project.<br><br><strong>ES:</strong> ¿Listo para impulsar tu negocio con una landing page profesional? Visita mi perfil de Fiverr para hablar sobre tu proyecto.</p>
    </div>
    ${emailButton(SETTINGS.FIVERR_URL, '#22C55E', 'Hire me on Fiverr')}
    ${emailButton(SETTINGS.GITHUB_URL, '#111827', 'View GitHub Portfolio')}
    ${emailButton(SETTINGS.CENTRAL_PORTFOLIO_URL, '#FF7A1A', 'Visit Main Portfolio / Visitar Portafolio Principal')}
    <hr style="margin:45px 0;border:none;border-top:1px solid #E2E8F0;">
    <p style="font-size:13px;color:#94A3B8;text-align:center;line-height:1.8;">Ariel FyB Labs<br>Custom Landing Pages • HTML • CSS • JavaScript • Cloudflare Pages</p>
  </div>
</div>`;
}

function replyRow(label, value) {
  return `<tr>
    <td style="background:#F8FAFC;padding:12px;font-weight:bold;border:1px solid #E2E8F0;">${escapeHtml(label)}</td>
    <td style="padding:12px;border:1px solid #E2E8F0;word-break:break-word;">${escapeHtml(value)}</td>
  </tr>`;
}

function emailButton(url, background, label) {
  return `<div style="text-align:center;margin-top:20px;"><a href="${escapeHtml(url)}" style="display:inline-block;background:${background};color:white;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;margin:8px;">${escapeHtml(label)}</a></div>`;
}

function adminPlainText(lead, fullName, planLabel, goalLabel) {
  return [
    'New Lead Received / Nuevo Lead Recibido',
    '',
    `Name / Nombre: ${fullName}`,
    `Email / Correo: ${lead.email}`,
    `WhatsApp: ${lead.phone}`,
    `Plan: ${planLabel}`,
    `Goal / Objetivo: ${goalLabel}`,
    'Comment / Comentario:',
    lead.comment,
  ].join('\n');
}

function autoresponderPlainText(lead, fullName, planLabel, goalLabel) {
  return [
    `Hello / Hola ${lead.firstName}`,
    '',
    'Thank you for contacting Titanium Fit. Your request was received.',
    'Gracias por contactar con Titanium Fit. Hemos recibido tu solicitud.',
    '',
    `Name / Nombre: ${fullName}`,
    `Email / Correo: ${lead.email}`,
    `Phone / Teléfono: ${lead.phone}`,
    `Plan: ${planLabel}`,
    `Goal / Objetivo: ${goalLabel}`,
    '',
    `Main Portfolio / Portafolio Principal: ${SETTINGS.CENTRAL_PORTFOLIO_URL}`,
  ].join('\n');
}

function validTextLength(value, min, max) {
  return typeof value === 'string' && value.length >= min && value.length <= max;
}

function stringValue(value) {
  return typeof value === 'string' ? value : '';
}

function escapeHtml(value) {
  return stringValue(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sha256Hex(value) {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
