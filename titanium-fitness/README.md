# Titanium Fitness

Demostración de portfolio desarrollada por **Ariel FyB Labs**.

Landing page bilingüe de Titanium Fit, publicada en Cloudflare Pages y conectada a Google Apps Script para recibir contactos.

## Arquitectura

```text
Formulario del navegador
        |
        v
Cloudflare Pages Function: /api/lead
        |
        v
Google Apps Script Web App
        |
        +--> Notificación para fyblabs.web@gmail.com
        |
        +--> Autorespuesta para el cliente
```

La URL `/exec` de Apps Script está configurada únicamente en
`functions/api/lead.js`. No es una contraseña y no necesita guardarse como
secreto de Cloudflare.

## Configuración necesaria

### Google Apps Script

1. Copia `google-apps-script/Code.gs` en el proyecto **Titanium Fit FeedBack**.
2. Conserva `google-apps-script/appsscript.json` como manifiesto del proyecto.
3. En **Configuración del proyecto > Propiedades de la secuencia de comandos**,
   crea solamente:

   - `TURNSTILE_SECRET_KEY`: la clave secreta vigente de Cloudflare Turnstile.

4. Implementa como aplicación web:

   - Ejecutar como: **Yo (fyblabs.web@gmail.com)**
   - Usuarios con acceso: **Cualquiera**

5. Al actualizar la implementación existente, selecciona una versión nueva. La
   URL `/exec` seguirá siendo la misma.

El correo administrativo y el dominio permitido están fijados en `Code.gs`:

- Destinatario: `fyblabs.web@gmail.com`
- Dominio: `titanium-fitness.pages.dev`

Las dos plantillas HTML —notificación administrativa y autorespuesta— también
están integradas en `Code.gs`.

### Cloudflare Pages

Esta versión no necesita variables de entorno, secretos, KV ni bases de datos.
La clave pública de Turnstile usada por el navegador es:

```text
0x4AAAAAADvRe6FetZaglr7o
```

La clave secreta de Turnstile nunca debe aparecer en GitHub, `index.html`,
`script.js`, `wrangler.jsonc` ni en una captura pública. Solo va en las
propiedades privadas de Google Apps Script.

Si se crea una implementación de Apps Script completamente nueva y cambia la
URL `/exec`, actualiza `APPS_SCRIPT_WEB_APP_URL` dentro de
`functions/api/lead.js`.

## Archivos

- `index.html`, `styles.css`, `script.js`: interfaz y formulario.
- `functions/api/lead.js`: puente privado del formulario hacia Apps Script.
- `google-apps-script/Code.gs`: validación, Turnstile, límite de envíos y correo.
- `google-apps-script/appsscript.json`: permisos y configuración de Apps Script.
- `_headers`: cabeceras de seguridad para Cloudflare Pages.
- `robots.txt`, `sitemap.xml`: rastreo e indexación a largo plazo.
- `wrangler.jsonc`: configuración del proyecto de Pages.
- `Video/` y `apple-touch-icon.png`: recursos visuales del sitio.

## Seguridad incluida

- Validación y límites de longitud en el navegador, Pages Function y Apps Script.
- Verificación de Cloudflare Turnstile en Apps Script.
- Límite de tres solicitudes por 24 horas para la combinación de correo y teléfono.
- Bloqueo de nombres de campos inesperados y respuestas JSON sin datos sensibles.
- Escape HTML en las plantillas de correo.
- Protección contra reenvíos duplicados inmediatos.
