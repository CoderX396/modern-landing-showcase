/**
 * Titanium Fit contact endpoint.
 *
 * Deploy this project from fyblabs.web@gmail.com as a Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Required Script Property:
 *   TURNSTILE_SECRET_KEY = Cloudflare Turnstile secret key
 */

const SETTINGS = Object.freeze({
  ADMIN_EMAIL: 'fyblabs.web@gmail.com',
  SENDER_NAME: 'Titanium Fit',
  CENTRAL_PORTFOLIO_URL: 'https://ariel-fyb-labs.pages.dev/',
  GITHUB_URL: 'https://github.com/CoderX396/modern-landing-showcase',
  FIVERR_URL: 'https://es.fiverr.com/s/qDE81rd',
  MAX_REQUEST_BYTES: 15000,
  MIN_COMMENT_CHARS: 200,
  MAX_COMMENT_CHARS: 1000,
  MAX_SUBMISSIONS: 3,
  RATE_WINDOW_MS: 24 * 60 * 60 * 1000,
  ALLOWED_HOSTNAMES: [
    'titanium-fitness.pages.dev',
  ],
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

function doGet() {
  return jsonResponse_({
    ok: true,
    service: 'Titanium Fit contact form',
  });
}

function doPost(event) {
  try {
    const rawBody = event && event.postData ? event.postData.contents : '';
    if (!rawBody || rawBody.length > SETTINGS.MAX_REQUEST_BYTES) {
      return jsonResponse_({ ok: false, code: 'invalid_request' });
    }

    const payload = JSON.parse(rawBody);

    // Honeypot: pretend success so simple bots do not learn how to bypass it.
    if (stringValue_(payload.website).trim()) {
      return jsonResponse_({ ok: true });
    }

    const validation = validateLead_(payload);
    if (!validation.ok) {
      return jsonResponse_({ ok: false, code: validation.code });
    }
    const lead = validation.lead;

    const turnstile = verifyTurnstile_(lead.turnstileToken);
    if (!turnstile.ok) {
      return jsonResponse_({ ok: false, code: turnstile.code });
    }

    // Each accepted lead sends two messages: admin notification + autoresponder.
    if (MailApp.getRemainingDailyQuota() < 2) {
      return jsonResponse_({ ok: false, code: 'quota_exceeded' });
    }

    const reservation = reserveSubmission_(lead);
    if (!reservation.ok) {
      return jsonResponse_({
        ok: false,
        code: reservation.code,
        retryAfterSeconds: reservation.retryAfterSeconds || undefined,
      });
    }
    if (reservation.duplicate) {
      return jsonResponse_({ ok: true, duplicate: true });
    }

    sendLeadEmails_(lead);

    return jsonResponse_({
      ok: true,
      remaining: reservation.remaining,
    });
  } catch (error) {
    console.error('Titanium Fit submission failed', error);
    return jsonResponse_({ ok: false, code: 'server_error' });
  }
}

function validateLead_(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, code: 'invalid_request' };
  }

  const lead = {
    submissionId: stringValue_(payload.submissionId).trim(),
    firstName: stringValue_(payload.firstName).trim(),
    lastName: stringValue_(payload.lastName).trim(),
    email: stringValue_(payload.email).trim().toLowerCase(),
    phone: stringValue_(payload.phone).trim(),
    plan: stringValue_(payload.plan).trim(),
    goal: stringValue_(payload.goal).trim(),
    comment: stringValue_(payload.comment).trim(),
    turnstileToken: stringValue_(payload.turnstileToken).trim(),
  };

  if (!/^[A-Za-z0-9-]{8,100}$/.test(lead.submissionId)) {
    return { ok: false, code: 'invalid_request' };
  }
  if (!validTextLength_(lead.firstName, 1, 60) ||
      !validTextLength_(lead.lastName, 1, 60)) {
    return { ok: false, code: 'invalid_name' };
  }
  if (lead.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) ||
      /[\r\n]/.test(lead.email)) {
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
  if (!validTextLength_(lead.comment, SETTINGS.MIN_COMMENT_CHARS, SETTINGS.MAX_COMMENT_CHARS)) {
    return { ok: false, code: 'invalid_comment' };
  }
  if (!lead.turnstileToken || lead.turnstileToken.length > 2048) {
    return { ok: false, code: 'captcha_failed' };
  }

  return { ok: true, lead: lead };
}

function verifyTurnstile_(token) {
  const properties = PropertiesService.getScriptProperties();
  const secret = stringValue_(
    properties.getProperty('TURNSTILE_SECRET_KEY')
  ).trim();
  if (!secret) {
    console.error('Missing TURNSTILE_SECRET_KEY Script Property.');
    return { ok: false, code: 'server_error' };
  }

  try {
    const response = UrlFetchApp.fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'post',
        payload: { secret: secret, response: token },
        muteHttpExceptions: true,
      }
    );
    const result = JSON.parse(response.getContentText());
    if (response.getResponseCode() !== 200 || result.success !== true) {
      console.error(
        'Turnstile rejected the token: ' +
        JSON.stringify(result['error-codes'] || [])
      );
      return { ok: false, code: 'captcha_failed' };
    }

    const allowedHostnames = SETTINGS.ALLOWED_HOSTNAMES.map(function (hostname) {
      return hostname.trim().toLowerCase();
    }).filter(Boolean);

    const verifiedHostname = stringValue_(result.hostname).toLowerCase();
    if (!verifiedHostname || allowedHostnames.indexOf(verifiedHostname) === -1) {
      return { ok: false, code: 'invalid_hostname' };
    }

    return { ok: true };
  } catch (error) {
    console.error('Turnstile verification failed', error);
    return { ok: false, code: 'captcha_failed' };
  }
}

function reserveSubmission_(lead) {
  const identity = lead.email + '|' + lead.phone.replace(/\D/g, '');
  const rateKey = 'RATE_' + sha256Hex_(identity);
  const now = Date.now();
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(5000);
  } catch (error) {
    return { ok: false, code: 'server_busy' };
  }

  try {
    const properties = PropertiesService.getScriptProperties();
    if (Math.random() < 0.05) {
      cleanupExpiredRateKeys_(properties, now);
    }
    let record = null;
    const stored = properties.getProperty(rateKey);
    if (stored) {
      try {
        record = JSON.parse(stored);
      } catch (ignored) {
        record = null;
      }
    }

    if (!record || !record.resetAt || record.resetAt <= now) {
      record = {
        count: 0,
        resetAt: now + SETTINGS.RATE_WINDOW_MS,
        submissionIds: [],
      };
    }

    if (record.submissionIds.indexOf(lead.submissionId) !== -1) {
      return {
        ok: true,
        duplicate: true,
        remaining: Math.max(0, SETTINGS.MAX_SUBMISSIONS - record.count),
      };
    }

    if (record.count >= SETTINGS.MAX_SUBMISSIONS) {
      return {
        ok: false,
        code: 'rate_limited',
        retryAfterSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
      };
    }

    record.count += 1;
    record.submissionIds.push(lead.submissionId);
    record.submissionIds = record.submissionIds.slice(-SETTINGS.MAX_SUBMISSIONS);
    properties.setProperty(rateKey, JSON.stringify(record));

    return {
      ok: true,
      duplicate: false,
      remaining: SETTINGS.MAX_SUBMISSIONS - record.count,
    };
  } finally {
    lock.releaseLock();
  }
}

function cleanupExpiredRateKeys_(properties, now) {
  const allProperties = properties.getProperties();
  Object.keys(allProperties).forEach(function (key) {
    if (key.indexOf('RATE_') !== 0) return;
    try {
      const record = JSON.parse(allProperties[key]);
      if (!record.resetAt || record.resetAt <= now) {
        properties.deleteProperty(key);
      }
    } catch (ignored) {
      properties.deleteProperty(key);
    }
  });
}

function sendLeadEmails_(lead) {
  const adminEmail = SETTINGS.ADMIN_EMAIL;

  const fullName = (lead.firstName + ' ' + lead.lastName).trim();
  const safeSubjectName = fullName.replace(/[\r\n]+/g, ' ').slice(0, 80);
  const planLabel = PLAN_LABELS[lead.plan];
  const goalLabel = GOAL_LABELS[lead.goal];

  MailApp.sendEmail({
    to: adminEmail,
    subject: '[Titanium Fit] New lead / Nuevo lead — ' + safeSubjectName,
    body: adminPlainText_(lead, fullName, planLabel, goalLabel),
    htmlBody: adminHtml_(lead, fullName, planLabel, goalLabel),
    name: SETTINGS.SENDER_NAME,
    replyTo: lead.email,
  });

  MailApp.sendEmail({
    to: lead.email,
    subject: 'Titanium Fit — Request received / Solicitud recibida',
    body: autoresponderPlainText_(lead, fullName, planLabel, goalLabel),
    htmlBody: autoresponderHtml_(lead, fullName, planLabel, goalLabel),
    name: SETTINGS.SENDER_NAME,
    replyTo: adminEmail,
  });
}

function adminHtml_(lead, fullName, planLabel, goalLabel) {
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
      ${adminRow_('Name / Nombre', fullName)}
      ${adminRow_('Email / Correo Electrónico', lead.email)}
      ${adminRow_('WhatsApp', lead.phone)}
      ${adminRow_('Selected Plan / Plan Seleccionado', planLabel)}
      ${adminRow_('Goal / Objetivo', goalLabel)}
      ${adminRow_('Comment / Comentario', lead.comment)}
    </table>
    <div style="margin-top:24px;padding:16px;background:#FFF7ED;border-left:4px solid #FF7A1A;border-radius:4px;">
      <strong style="color:#9A3412;">Action Required / Acción Requerida</strong>
      <p style="margin:8px 0 0;color:#7C2D12;line-height:1.6;"><strong>EN:</strong> Please contact this lead as soon as possible to continue the sales process and maximize the opportunity for conversion.<br><br><strong>ES:</strong> Ponte en contacto con este cliente lo antes posible para continuar el proceso de venta y maximizar la oportunidad de conversión.</p>
    </div>
  </div>
</div>`;
}

function adminRow_(label, value) {
  return `<tr>
    <td style="padding:10px;border-bottom:1px solid #eee;vertical-align:top;"><strong>${escapeHtml_(label)}</strong></td>
    <td style="padding:10px;border-bottom:1px solid #eee;white-space:pre-wrap;word-break:break-word;">${escapeHtml_(value)}</td>
  </tr>`;
}

function autoresponderHtml_(lead, fullName, planLabel, goalLabel) {
  return `
<div style="max-width:700px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
  <div style="background:#111827;padding:45px 30px;text-align:center;">
    <h1 style="margin:0;font-size:38px;font-weight:900;letter-spacing:1px;"><span style="color:#ffffff;">TITANIUM</span><span style="color:#FF7A1A;">FIT</span></h1>
    <p style="margin:15px 0 0;color:#CBD5E1;font-size:16px;">Professional Fitness Landing Page / Landing Page Profesional de Fitness</p>
    <p style="margin:5px 0 0;color:#94A3B8;font-size:14px;">HTML • CSS • JavaScript • Google Apps Script</p>
  </div>
  <div style="padding:40px;">
    <h2 style="margin-top:0;color:#111827;">Hello / Hola ${escapeHtml_(lead.firstName)} 👋</h2>
    <p style="font-size:16px;color:#475569;line-height:1.8;"><strong>EN:</strong> Thank you for contacting Titanium Fit. Your request has been received successfully.<br><br><strong>ES:</strong> Gracias por contactar con Titanium Fit. Hemos recibido tu solicitud correctamente.</p>
    <p style="font-size:16px;color:#475569;line-height:1.8;"><strong>EN:</strong> Our team will review your request and contact you as soon as possible.<br><br><strong>ES:</strong> Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo lo antes posible.</p>
    <p style="font-size:16px;color:#475569;line-height:1.8;"><strong>EN:</strong> We also received your comments about the page — thank you for taking the time to share your thoughts with us.<br><br><strong>ES:</strong> También recibimos tu comentario sobre la página — gracias por tomarte el tiempo de compartirnos tu opinión.</p>
    <table style="width:100%;border-collapse:collapse;margin-top:30px;">
      ${replyRow_('Name / Nombre', fullName)}
      ${replyRow_('Email / Correo', lead.email)}
      ${replyRow_('Phone / Teléfono', lead.phone)}
      ${replyRow_('Plan', planLabel)}
      ${replyRow_('Fitness Goal / Objetivo', goalLabel)}
    </table>
    <div style="margin-top:35px;padding:25px;background:#F8FAFC;border-left:5px solid #FF7A1A;">
      <h3 style="margin-top:0;color:#111827;">About this project / Sobre este proyecto</h3>
      <p style="margin-bottom:0;color:#475569;line-height:1.8;"><strong>EN:</strong> This email is part of a live portfolio demonstration. The Titanium Fit landing page showcases:<br><br><strong>ES:</strong> Este correo forma parte de una demostración en vivo de mi portafolio. La landing page Titanium Fit incluye:</p>
      <ul style="color:#475569;line-height:1.9;">
        <li>Responsive Design / Diseño Responsivo</li>
        <li>Google Apps Script Contact Form / Formulario con Google Apps Script</li>
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
    ${emailButton_(SETTINGS.FIVERR_URL, '#22C55E', 'Hire me on Fiverr')}
    ${emailButton_(SETTINGS.GITHUB_URL, '#111827', 'View GitHub Portfolio')}
    ${emailButton_(SETTINGS.CENTRAL_PORTFOLIO_URL, '#FF7A1A', 'Visit Main Portfolio / Visitar Portafolio Principal')}
    <hr style="margin:45px 0;border:none;border-top:1px solid #E2E8F0;">
    <p style="font-size:13px;color:#94A3B8;text-align:center;line-height:1.8;">Landing Studio<br>Custom Landing Pages • HTML • CSS • JavaScript • Google Apps Script</p>
  </div>
</div>`;
}

function replyRow_(label, value) {
  return `<tr>
    <td style="background:#F8FAFC;padding:12px;font-weight:bold;border:1px solid #E2E8F0;">${escapeHtml_(label)}</td>
    <td style="padding:12px;border:1px solid #E2E8F0;word-break:break-word;">${escapeHtml_(value)}</td>
  </tr>`;
}

function emailButton_(url, background, label) {
  return `<div style="text-align:center;margin-top:20px;"><a href="${escapeHtml_(url)}" style="display:inline-block;background:${background};color:white;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;margin:8px;">${escapeHtml_(label)}</a></div>`;
}

function adminPlainText_(lead, fullName, planLabel, goalLabel) {
  return [
    'New Lead Received / Nuevo Lead Recibido',
    '',
    'Name / Nombre: ' + fullName,
    'Email / Correo: ' + lead.email,
    'WhatsApp: ' + lead.phone,
    'Plan: ' + planLabel,
    'Goal / Objetivo: ' + goalLabel,
    'Comment / Comentario:',
    lead.comment,
  ].join('\n');
}

function autoresponderPlainText_(lead, fullName, planLabel, goalLabel) {
  return [
    'Hello / Hola ' + lead.firstName,
    '',
    'Thank you for contacting Titanium Fit. Your request was received.',
    'Gracias por contactar con Titanium Fit. Hemos recibido tu solicitud.',
    '',
    'Name / Nombre: ' + fullName,
    'Email / Correo: ' + lead.email,
    'Phone / Teléfono: ' + lead.phone,
    'Plan: ' + planLabel,
    'Goal / Objetivo: ' + goalLabel,
    '',
    'Main Portfolio / Portafolio Principal: ' + SETTINGS.CENTRAL_PORTFOLIO_URL,
  ].join('\n');
}

function validTextLength_(value, min, max) {
  return typeof value === 'string' && value.length >= min && value.length <= max;
}

function stringValue_(value) {
  return typeof value === 'string' ? value : '';
}

function escapeHtml_(value) {
  return stringValue_(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sha256Hex_(value) {
  return Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8
  ).map(function (byte) {
    return ((byte + 256) % 256).toString(16).padStart(2, '0');
  }).join('');
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
