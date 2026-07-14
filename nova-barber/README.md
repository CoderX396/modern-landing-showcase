# Nova Barber Studio — Basic booking demo

## Español

Esta versión conserva la estructura original preparada para GitHub y Cloudflare Pages:

```text
nova-barber/
├── index.html
├── styles.css
├── script.js
├── favicon.svg
├── apple-touch-icon.png
├── nova-barber-basic-gallery.png
├── nova-barber-demo.mp4
├── README.md
├── robots.txt
├── sitemap.xml
└── assets/
    └── aos/
        ├── aos.css
        ├── aos.js
        └── LICENSE
```

### Cambios realizados

- El CTA principal abre servicios o el reservador, no WhatsApp directamente.
- Cada tarjeta selecciona su servicio antes de bajar al reservador.
- El visitante elige nombre, servicio, fecha y hora.
- Se crea un código de ticket aleatorio.
- El ticket puede descargarse como PNG o imprimirse.
- WhatsApp y correo aparecen después de crear el ticket.
- El ticket recuerda puntualidad, lugar y que la cita sigue pendiente de confirmación.
- Las reservas se recuerdan con `localStorage` en el mismo navegador.
- El favicon ahora representa herramientas de barbería.
- El bloque de video original mediante YouTube permanece sin cambios.
- `nova-barber-demo.mp4` permanece en la raíz como respaldo, igual que antes.

### Límite del paquete Basic

No usa IP, EmailJS, backend ni base de datos. La disponibilidad no se comparte entre
clientes o dispositivos. El ticket es una solicitud y necesita confirmación directa del negocio.

### Archivos que debes sustituir en GitHub

Solo necesitas reemplazar estos seis archivos:

```text
index.html
styles.css
script.js
favicon.svg
apple-touch-icon.png
README.md
```

No necesitas cambiar:

```text
robots.txt
sitemap.xml
assets/aos/
nova-barber-basic-gallery.png
nova-barber-demo.mp4
```

## English

This version keeps the original GitHub/Cloudflare structure and the existing YouTube
video block. It adds a browser-only appointment selector, downloadable ticket and
post-ticket WhatsApp/email confirmation without adding a backend.

## Enlace que se cambiará después por la página central

La página visible no fue modificada. Dejé marcado internamente el enlace exacto que
deberás cambiar cuando publiques el portafolio central.

En `index.html`, busca:

```html
class="creator-cloudflare"
```

Actualmente apunta a:

```text
https://titanium-fitness.pages.dev/
```

Más adelante cambia **solo el valor de `href` de ese botón** por la URL del portafolio
central.

También puedes cambiar posteriormente estos dos textos en `script.js`:

```text
footerCloudflare: "Cloudflare Demo"
footerCloudflare: "Demo en Cloudflare"
```

No debes apuntar a la página central estas direcciones, porque pertenecen al SEO propio
de Nova Barber:

```text
canonical
og:url
JSON-LD url
robots.txt
sitemap.xml
```

Esas direcciones solo se cambian si cambia el dominio público de la propia demo
`nova-barber`.

## Corrección visual de horarios y caché

- Los horarios deshabilitados ahora usan una raya CSS dibujada sobre el botón, además de
  `text-decoration`, para que se vean tachados de forma consistente en Chromium y Firefox.
- `index.html` usa `?v=3` en `styles.css`, `script.js`, `favicon.svg` y
  `apple-touch-icon.png` para evitar que el navegador conserve versiones antiguas.

