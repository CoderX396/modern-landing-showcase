# Titanium Fitness

Landing page estática con formulario conectado a Google Apps Script. EmailJS fue
eliminado por completo. Google Apps Script envía:

1. una notificación administrativa a `fyblabs.web@gmail.com`; y
2. una respuesta automática al visitante.

El diseño, los idiomas, el tema claro/oscuro, el video, WhatsApp y las tarjetas
de planes se conservan.

## Configuración obligatoria

### 1. Crear el proyecto de Apps Script

Inicia sesión con **fyblabs.web@gmail.com** y crea un proyecto en
[Google Apps Script](https://script.google.com/). Es importante usar esa cuenta:
el remitente real de los correos será la cuenta que posee y despliega el script.

Copia estos dos archivos al proyecto:

- `google-apps-script/Code.gs`
- `google-apps-script/appsscript.json`

Para mostrar el manifiesto en el editor: **Project Settings → Show
"appsscript.json" manifest file in editor**.

### 2. Guardar el secreto de Turnstile

En **Project Settings → Script Properties**, crea:

| Propiedad | Valor |
|---|---|
| `TURNSTILE_SECRET_KEY` | La clave secreta del widget Turnstile |
| `ADMIN_EMAIL` | `fyblabs.web@gmail.com` (opcional; ya es el valor predeterminado) |
| `ALLOWED_HOSTNAMES` | `titanium-fitness.pages.dev` |

Nunca copies `TURNSTILE_SECRET_KEY` a `config.js`, GitHub o el HTML.

En Cloudflare Turnstile, confirma que el widget público
`0x4AAAAAADvRe6FetZaglr7o` permita el dominio donde publicarás Titanium Fitness.

### 3. Desplegar el Web App

En Apps Script:

1. **Deploy → New deployment → Web app**
2. **Execute as:** Me
3. **Who has access:** Anyone
4. Autoriza y despliega.
5. Copia la URL que termina en `/exec`.

Cada vez que modifiques `Code.gs`, crea una versión nueva del deployment.

### 4. Conectar Cloudflare Pages con Apps Script

En **Workers & Pages → titanium-fitness → Settings → Variables and Secrets**,
crea esta variable:

| Variable | Valor |
|---|---|
| `APPS_SCRIPT_WEB_APP_URL` | La URL del Web App que termina en `/exec` |

La URL no es una contraseña, pero mantenerla en la configuración evita
hardcodearla. La Function `functions/api/lead.js` actúa únicamente como puente
same-origin: sigue el redirect seguro de Apps Script y devuelve al navegador el
resultado real. No envía correos ni almacena leads.

### 5. Publicar en Cloudflare Pages

- Build command: vacío / none
- Build output directory: `.`

El archivo `_headers` añade CSP y otros encabezados de seguridad. El botón
principal de portafolio dirige a:
`https://ariel-fyb-labs.pages.dev/`.

## Controles de seguridad incluidos

- Turnstile validado en servidor y restringido por hostname.
- Validación server-side de todos los campos y listas permitidas.
- Escape HTML en las dos plantillas para impedir inyección.
- Protección contra cabeceras de correo manipuladas.
- Honeypot contra bots básicos.
- Máximo de 3 envíos por correo + teléfono cada 24 horas.
- Idempotencia para evitar correos duplicados al reintentar.
- Comprobación de cuota antes de enviar.
- Secreto almacenado únicamente en Script Properties.
- Puente same-origin que evita depender de CORS o de respuestas optimistas.
- CSP, `nosniff`, anti-iframe y políticas de permisos en Cloudflare Pages.

## Prueba final

1. Abre la URL `/exec` en el navegador: debe mostrar JSON con `"ok": true`.
2. Publica la landing y envía el formulario con un correo de prueba real.
3. Comprueba la notificación en `fyblabs.web@gmail.com`.
4. Comprueba el autoresponder en el correo de prueba.
5. Verifica que el botón **Main Portfolio / Portafolio Principal** abra la
   centralita.
