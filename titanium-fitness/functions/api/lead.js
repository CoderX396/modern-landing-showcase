// functions/api/lead.js
//
// EN: Comments in this file are bilingual (EN/ES) — it ships to a public
//     GitHub repo as a portfolio piece, so it should read clearly for both
//     Spanish- and English-speaking reviewers.
// ES: Los comentarios de este archivo son bilingües (EN/ES) — se sube a un
//     repo público de GitHub como pieza de portfolio, así que debe leerse
//     claro tanto para revisores de habla inglesa como española.
const MAX_SUBMISSIONS_PER_IP = 3;
const BLOCK_SECONDS = 24 * 60 * 60; // 24 horas
const MAX_COMMENT_CHARS = 1000;
// EN: Keep this in sync with MIN_COMMENT_CHARS in script.js — this is the
//     server-side backstop in case someone bypasses the client validation
//     (disabled JS, direct API call, etc).
// ES: Mantener sincronizado con MIN_COMMENT_CHARS en script.js — este es el
//     respaldo del lado servidor por si alguien evita la validación del
//     cliente (JS deshabilitado, llamada directa a la API, etc).
const MIN_COMMENT_CHARS = 200;
const MAX_STORED_LEADS = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// EN: BUG FIX — the old PHONE_RE required the string to START with a digit
//     or "+", but script.js auto-formats the phone as "(555) 123-4567",
//     which starts with "(". That regex NEVER matched, so every submission
//     was silently rejected as invalid_phone (see onRequestPost below) —
//     that's also why the rate-limit counter never seemed to increment.
//     Fix: strip everything but digits and just check the digit COUNT,
//     so it doesn't care about parentheses, dashes, spaces, or "+".
// ES: FIX DEL BUG — el PHONE_RE anterior exigía que el string EMPIECE con
//     un dígito o "+", pero script.js formatea el teléfono como
//     "(555) 123-4567", que empieza con "(". Ese regex NUNCA matcheaba,
//     entonces todo envío se rechazaba en silencio como invalid_phone (ver
//     onRequestPost más abajo) — por eso también parecía que el contador de
//     límite nunca se incrementaba.
//     Fix: se descarta todo lo que no sea dígito y se valida la CANTIDAD
//     de dígitos, así no importa si hay paréntesis, guiones, espacios o "+".
function isValidPhone(raw) {
  const digits = raw.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}
 
// EN: CLOUDFLARE TURNSTILE — server-side verification.
//     The widget in index.html gets a token from the visitor's browser; that
//     token means nothing on its own — anyone could fake a random string.
//     This function is what actually asks Cloudflare "is this token real and
//     did it come from this site", using the SECRET key (never the site key).
//     The secret key is NOT written here — it's read from env.TURNSTILE_SECRET_KEY,
//     which you set once in the Cloudflare Pages dashboard:
//     Workers & Pages -> your project -> Settings -> Variables and secrets ->
//     Add variable -> name it exactly TURNSTILE_SECRET_KEY, paste the secret
//     key as the value, mark it as "Secret" (encrypted), save, and redeploy.
//     That keeps it out of the GitHub repo entirely.
// ES: CLOUDFLARE TURNSTILE — verificación del lado servidor.
//     El widget en index.html le da al visitante un token desde su navegador;
//     ese token no significa nada por sí solo — cualquiera podría inventar un
//     string al azar. Esta función es la que realmente le pregunta a
//     Cloudflare "¿este token es real y vino de este sitio?", usando la clave
//     SECRETA (nunca la clave del sitio). La clave secreta NO está escrita
//     acá — se lee desde env.TURNSTILE_SECRET_KEY, que configurás una vez en
//     el dashboard de Cloudflare Pages: Workers & Pages -> tu proyecto ->
//     Settings -> Variables and secrets -> Add variable -> nombre exacto
//     TURNSTILE_SECRET_KEY, pegás la clave secreta como valor, la marcás como
//     "Secret" (encriptada), guardás, y redesplegás. Así queda totalmente
//     fuera del repo de GitHub.
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
 
async function verifyTurnstile(token, secret, ip) {
  if (!token || !secret) return false;
  try {
    const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const result = await verifyRes.json();
    return result.success === true;
  } catch {
    // EN: if Cloudflare's verify endpoint itself fails/times out, treat it as
    //     a failed check (fail closed) rather than letting the lead through —
    //     this endpoint is very reliable, a failure here is more likely a
    //     real problem than legitimate traffic.
    // ES: si el endpoint de verificación de Cloudflare falla/da timeout, se
    //     trata como verificación fallida (fail closed) en vez de dejar
    //     pasar el lead — este endpoint es muy confiable, una falla acá es
    //     más probable que sea un problema real que tráfico legítimo.
    return false;
  }
}
 
 
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
 
  // EN: Turnstile check happens first, before spending a rate-limit slot or
  //     validating any other field — if the token doesn't check out, nothing
  //     else about this request matters.
  // ES: La verificacion de Turnstile va primero, antes de gastar un intento
  //     de rate-limit o validar cualquier otro campo — si el token no es
  //     valido, nada mas de este request importa.
  const turnstileOk = await verifyTurnstile(body.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!turnstileOk) {
    return json({ error: 'captcha_failed' }, 400);
  }
 
  // EN: firstName/lastName are the source of truth now; "name" is only kept
  //     as a combined fallback for older callers/logs.
  // ES: firstName/lastName son ahora la fuente de verdad; "name" se
  //     mantiene solo como respaldo combinado para llamadores/logs viejos.
  const firstName = (body.firstName || '').trim().slice(0, 60);
  const lastName = (body.lastName || '').trim().slice(0, 60);
  const name = (body.name || `${firstName} ${lastName}`).trim().slice(0, 120);
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim().slice(0, 40);
  const plan = (body.plan || '').trim();
  const goal = (body.goal || '').trim();
  const comment = (body.comment || '').trim();
 
  if (!firstName || !lastName || !email || !phone || !plan || !goal || !comment) {
    return json({ error: 'missing_fields' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: 'invalid_email' }, 400);
  }
  if (!isValidPhone(phone)) {
    return json({ error: 'invalid_phone' }, 400);
  }
  if (comment.length < MIN_COMMENT_CHARS) {
    return json({ error: 'too_short' }, 400);
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
    leads.push({ firstName, lastName, name, email, phone, plan, goal, comment, timestamp: now });
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

 
