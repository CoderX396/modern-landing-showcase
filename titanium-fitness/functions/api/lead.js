// Same-origin bridge between the public form and Google Apps Script.
// Validation, Turnstile verification, rate limiting and email delivery live in
// Code.gs. The Web App URL is an endpoint, not a credential; keeping it here
// removes the Cloudflare environment-variable failure mode.

const MAX_REQUEST_CHARS = 15_000;
const APPS_SCRIPT_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbxnbn7QU4A00B6f5NiRzNmRtk4v_k_t-57o2uOCMQjNbU5fPc0nrF5LbV4I1XYcB9Qh/exec';

export function onRequestGet() {
  return json({
    ok: true,
    service: 'Titanium Fit lead bridge',
    backend: 'configured',
  });
}

export async function onRequestPost(context) {
  const { request } = context;

  const requestOrigin = request.headers.get('Origin');
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return json({ error: 'forbidden_origin' }, 403);
  }

  let rawBody;
  try {
    rawBody = await request.text();
    if (!rawBody || rawBody.length > MAX_REQUEST_CHARS) {
      return json({ error: 'invalid_request' }, 400);
    }
    JSON.parse(rawBody);
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }

  let upstream;
  try {
    upstream = await fetch(APPS_SCRIPT_WEB_APP_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'text/plain;charset=UTF-8',
      },
      body: rawBody,
      redirect: 'follow',
    });
  } catch {
    return json({ error: 'delivery_failed' }, 502);
  }

  let result;
  try {
    result = JSON.parse(await upstream.text());
  } catch {
    return json({ error: 'invalid_upstream_response' }, 502);
  }

  if (!upstream.ok) {
    return json({ error: 'delivery_failed' }, 502);
  }

  if (result.ok === true) {
    return json({
      success: true,
      remaining: Number.isFinite(result.remaining) ? result.remaining : undefined,
      duplicate: result.duplicate === true || undefined,
    });
  }

  const code = typeof result.code === 'string' ? result.code : 'delivery_failed';
  if (code === 'rate_limited') {
    const retryAfterSeconds = Number.isFinite(result.retryAfterSeconds)
      ? Math.max(1, result.retryAfterSeconds)
      : 24 * 60 * 60;
    return json({
      error: 'rate_limited',
      remaining: 0,
      resetAt: Date.now() + retryAfterSeconds * 1000,
    }, 429);
  }

  if (code === 'captcha_failed' || code === 'invalid_hostname') {
    return json({ error: 'captcha_failed' }, 400);
  }

  if (code.startsWith('invalid_')) {
    return json({ error: code }, 400);
  }

  if (code === 'quota_exceeded' || code === 'server_busy') {
    return json({ error: code }, 503);
  }

  return json({ error: 'delivery_failed' }, 502);
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
