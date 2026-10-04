# Titanium Fitness

Demostración de portfolio desarrollada por **Ariel FyB Labs**.

Landing page bilingüe de Titanium Fit, publicada en Cloudflare Pages. El formulario de contacto corre entero en una función de Cloudflare: no depende de ninguna cuenta de Google.

## Arquitectura

```text
Formulario del navegador
        |
        v
Cloudflare Pages Function: /api/lead
   valida, verifica Turnstile y limita los envíos (KV)
        |
        v
Resend (servicio de envío de correo)
        |
        +--> Notificación para el administrador
        |
        +--> Autorespuesta para el cliente
```

Antes la función reenviaba a un Google Apps Script publicado desde una cuenta
gratuita de Gmail. Esa cuenta fue inhabilitada y el formulario dejó de
funcionar. `google-apps-script/Code.gs` se conserva solo como referencia.

## Configuración necesaria

Todo va en Cloudflare, en el proyecto de Pages `titanium-fitness`. Mientras
falte algo, `/api/lead` contesta 503 y la página muestra su mensaje de "no se
pudo enviar".

### 1. KV para el límite de envíos

1. **Storage & Databases → KV → Create**. Nombre: `titanium-leads`.
2. **Workers & Pages → titanium-fitness → Settings → Bindings → Add → KV
   namespace**. Variable name: `LEADS`.

Ahí no se guarda la consulta: solo una huella (SHA-256) del correo y el
teléfono, con cuántos envíos lleva, y se borra sola a las 24 horas.

### 2. Variables y secretos

En **Settings → Variables and Secrets** (Production):

| Variable | Tipo | Valor |
|---|---|---|
| `TURNSTILE_SECRET_KEY` | secreto | la clave secreta de Cloudflare Turnstile |
| `RESEND_API_KEY` | secreto | llave de Resend con permiso de envío |
| `MAIL_FROM` | normal | remitente en un dominio verificado en Resend, por ejemplo `titanium@arielfyblabs.com.do` |
| `ADMIN_EMAIL` | normal | bandeja donde llega la notificación |

La clave secreta de Turnstile está en Cloudflare → Turnstile → el widget →
Settings. La pública, que usa el navegador, es:

```text
0x4AAAAAADvRe6FetZaglr7o
```

Ninguna clave secreta debe aparecer en GitHub, `index.html`, `script.js`,
`wrangler.jsonc` ni en una captura pública.

### 3. Volver a desplegar

Un binding o una variable nueva no entra hasta el siguiente despliegue:
**Deployments → el último → Retry deployment**.

Comprobación: `https://titanium-fitness.pages.dev/api/lead` debe decir
`"backend":"configured"`.

El dominio permitido para Turnstile y las dos plantillas HTML —notificación
administrativa y autorespuesta— están en `functions/api/lead.js`.

## Archivos

- `index.html`, `styles.css`, `script.js`: interfaz y formulario.
- `functions/api/lead.js`: validación, Turnstile, límite de envíos y correos.
- `google-apps-script/`: la versión anterior, ya sin uso.
- `_headers`: cabeceras de seguridad para Cloudflare Pages.
- `robots.txt`, `sitemap.xml`: rastreo e indexación a largo plazo.
- `wrangler.jsonc`: configuración del proyecto de Pages.
- `Video/` y `apple-touch-icon.png`: recursos visuales del sitio.

## Seguridad incluida

- Validación y límites de longitud en el navegador y en la función.
- Verificación de Cloudflare Turnstile en la función, comprobando que el token
  se emitió para este sitio.
- Límite de tres solicitudes por 24 horas para la combinación de correo y
  teléfono, y de 30 solicitudes diarias en total.
- Si el correo no sale, se devuelve el intento: el visitante no pierde uno por
  un fallo que no es suyo.
- Solo se leen los campos esperados; las respuestas JSON no llevan datos sensibles.
- Escape HTML en las plantillas de correo.
- Protección contra reenvíos duplicados inmediatos.
