// functions/api/lead.js
// Chequeo de rate-limit server-side para el formulario de contacto
// (ahora el formulario incluye también el campo de comentario/opinión,
// así que este endpoint reemplaza al viejo functions/api/comments.js —
// borralo de tu carpeta de Functions en Cloudflare Pages si todavía está).
//
//   POST /api/lead -> valida los datos mínimos y aplica el límite de
//   3 envíos cada 24h por IP. Si pasa, el frontend recién ahí dispara
//   el correo de EmailJS (que ya maneja tanto la notificación al admin
//   como el auto-reply al cliente, dentro de la misma plantilla).
//
// ¿Por qué un paso server-side si el envío de email sigue siendo
// client-side vía el SDK de EmailJS? Porque el navegador no puede
// aplicar un límite real por IP por su cuenta — el visitante podría
// borrar localStorage o abrir una pestaña de incógnito y mandar 100
// formularios. Este endpoint es el único lugar donde de verdad se
// conoce la IP real (header CF-Connecting-IP, que solo ve el servidor)
// y se puede frenar un abuso ANTES de gastar la cuota mensual de
// EmailJS (200 envíos/mes en el plan gratis).
//
// Requiere el mismo KV namespace binding que ya tenías configurado:
//   Settings -> Functions -> KV namespace bindings -> COMMENTS_KV
// (dejo el nombre del binding igual a propósito, para que no tengas
// que tocar nada en el dashboard de Cloudflare Pages).

const MAX_SUBMISSIONS_PER_IP = 3;
const BLOCK_SECONDS = 24 * 60 * 60; // 24 horas
const MAX_COMMENT_CHARS = 1000;
const MAX_STORED_LEADS = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/lead -> solo consulta el estado (no gasta intento).
// Lo usa el frontend al cargar la página para mostrar "te quedan X".
export async function onRequestGet(context) {
  const { request, env } = context;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rateKey = `lead-rate:${ip}`;
  const now = Date.now();

  const current = await env.COMMENTS_KV.get(rateKey);
  const data = current ? JSON.parse(current) : null;

  if (!data || data.resetAt <= now) {
    return json({ remaining: MAX_SUBMISSIONS_PER_IP, resetAt: null });
  }

  const remaining = Math.max(0, MAX_SUBMISSIONS_PER_IP - data.count);
  return json({ remaining, resetAt: data.resetAt });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rateKey = `lead-rate:${ip}`;
  const now = Date.now();

  const current = await env.COMMENTS_KV.get(rateKey);
  let data = current ? JSON.parse(current) : null;

  // Si no hay ventana activa (o ya venció), arranca una nueva de 24h
  if (!data || data.resetAt <= now) {
    data = { count: 0, resetAt: now + BLOCK_SECONDS * 1000 };
  }

  if (data.count >= MAX_SUBMISSIONS_PER_IP) {
    return json({ error: 'rate_limited', remaining: 0, resetAt: data.resetAt }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const name = (body.name || '').trim().slice(0, 120);
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim().slice(0, 40);
  const plan = (body.plan || '').trim();
  const goal = (body.goal || '').trim();
  const comment = (body.comment || '').trim();

  if (!name || !email || !phone || !plan || !goal || !comment) {
    return json({ error: 'missing_fields' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: 'invalid_email' }, 400);
  }
  if (comment.length > MAX_COMMENT_CHARS) {
    return json({ error: 'too_long' }, 400);
  }

  data.count += 1;
  const ttlSeconds = Math.max(60, Math.ceil((data.resetAt - now) / 1000));
  await env.COMMENTS_KV.put(rateKey, JSON.stringify(data), { expirationTtl: ttlSeconds });

  try {
    const raw = await env.COMMENTS_KV.get('leads:list');
    const leads = raw ? JSON.parse(raw) : [];
    leads.push({ name, email, phone, plan, goal, comment, timestamp: now });
    await env.COMMENTS_KV.put('leads:list', JSON.stringify(leads.slice(-MAX_STORED_LEADS)));
  } catch {
    // no bloquea el lead si falla el log
  }

  return json({
    success: true,
    remaining: MAX_SUBMISSIONS_PER_IP - data.count,
    resetAt: data.resetAt,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
