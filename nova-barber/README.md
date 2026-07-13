# Nova Barber Studio — Basic bilingual landing demo

## English

### What this project is

Nova Barber Studio is a fictional portfolio landing page created by **Ariel FyB Labs** to demonstrate a custom-coded Fiverr Basic website. It is built with separate HTML, CSS and JavaScript files and is ready to upload as the `nova-barber` project folder to GitHub and Cloudflare Pages.

### What problem it solves

Many local barbershops lose potential customers because visitors cannot quickly understand the offer, see the atmosphere, or find a direct way to book. This page solves that by presenting the services clearly, showing the brand experience visually and sending visitors directly to WhatsApp or email without adding a complicated booking system.

### Included

- Three sections: hero, services and direct booking/contact.
- Responsive, mobile-first layout.
- English/Spanish language switch.
- Bilingual height reservation that prevents service cards and main content blocks from jumping when the language changes.
- Automatic and manual Auto → Light → Dark theme.
- Direct WhatsApp, email and social CTAs.
- Clickable service cards that scroll to the booking section.
- Demo prices: $35 precision cut, $55 fade + beard and $25 express clean-up.
- Smooth 900 ms local AOS.js scroll animations (`assets/aos`) that work without CDN access, safe `file://` storage handling, a built-in IntersectionObserver failsafe and subtle pointer tilt interactions.
- Fictional Brooklyn, New York map location clearly marked as a demo.
- YouTube barbershop iframe with a local `file://` fallback.
- Basic and expanded on-page SEO: canonical, Open Graph, Twitter Card, `WebPage` JSON-LD, `robots.txt` and `sitemap.xml`.

### Basic package boundaries

This demo intentionally does not include a contact form, EmailJS, autoresponder, Turnstile/CAPTCHA, analytics, comments, hosting configuration or backend. Those features belong to higher packages or a separate portfolio contact page.

### Files

- `index.html` — page structure, bilingual SEO metadata, structured data and direct CTAs.
- `styles.css` — theme system, responsive layout, animations, map/video frames and interactive cards.
- `script.js` — language switch, theme control, mobile menu, AOS initialization and pointer interactions.
- `assets/aos/` — local AOS 2.3.4 files and MIT license; no CDN or Cloudflare dependency is required for scroll animation.
- `robots.txt` and `sitemap.xml` — indexing files for `https://nova-barber.pages.dev/`.
- `favicon.svg` and `apple-touch-icon.png` — brand icons.
- `nova-barber-demo.mp4` — previous local gallery animation kept as backup; the page currently uses the iframe video.

### Before publishing

1. Replace the fictional name, phone, email, social links, prices, image, video and map with approved client information.
2. Replace `https://nova-barber.pages.dev/` in `index.html`, `robots.txt` and `sitemap.xml` if Cloudflare assigns another Pages URL.
3. Use an owned or licensed video and photo for a real client.
4. Upload the contents of this folder to the root of the GitHub repository used by Cloudflare Pages.

## Español

### Qué es este proyecto

Nova Barber Studio es una landing page ficticia de portafolio creada por **Ariel FyB Labs** para demostrar un sitio personalizado del paquete Basic de Fiverr. Está construida con archivos separados de HTML, CSS y JavaScript y está lista para subir como la carpeta `nova-barber` a GitHub y Cloudflare Pages.

### Qué problema resuelve

Muchas barberías locales pierden clientes porque las personas no entienden rápidamente la oferta, no pueden ver el ambiente del negocio o no encuentran una forma directa de reservar. Esta página resuelve eso mostrando los servicios con claridad, transmitiendo la experiencia visual de la marca y enviando al visitante directamente a WhatsApp o al correo, sin un sistema de reservas complicado.

### Incluye

- Tres secciones: hero, servicios y reserva/contacto directo.
- Diseño responsive y mobile-first.
- Cambio de idioma inglés/español.
- Reserva automática de altura bilingüe para que las tarjetas y los bloques principales no salten al cambiar de idioma.
- Tema automático y control manual Auto → Claro → Oscuro.
- CTAs directos de WhatsApp, correo y redes sociales.
- Tarjetas de servicio presionables que bajan a la sección de reserva.
- Precios ficticios: corte $35, fade + barba $55 y retoque express $25.
- Animaciones AOS.js locales y suaves de 900 ms (`assets/aos`) que funcionan sin CDN, protección para `file://`, respaldo IntersectionObserver y movimiento 3D sutil con el puntero.
- Mapa ficticio de Brooklyn, Nueva York, marcado claramente como demo.
- Video de barbería mediante iframe y respaldo para apertura local con `file://`.
- SEO básico y ampliado: canonical, Open Graph, Twitter Card, datos estructurados `WebPage`, `robots.txt` y `sitemap.xml`.

### Límites del paquete Basic

Este demo deliberadamente no incluye formulario de contacto, EmailJS, autorespuesta, Turnstile/CAPTCHA, analíticas, comentarios, configuración de hosting ni backend. Esas funciones pertenecen a paquetes superiores o a una página central independiente de portafolio.

### Archivos

- `index.html` — estructura, metadatos SEO bilingües, datos estructurados y CTAs directos.
- `styles.css` — temas, diseño responsive, animaciones, mapa/video y tarjetas interactivas.
- `script.js` — idiomas, temas, menú móvil, AOS y movimiento del puntero.
- `assets/aos/` — archivos locales de AOS 2.3.4 y licencia MIT; la animación no depende de CDN ni de Cloudflare.
- `robots.txt` y `sitemap.xml` — archivos de indexación para `https://nova-barber.pages.dev/`.
- `favicon.svg` y `apple-touch-icon.png` — iconos de marca.
- `nova-barber-demo.mp4` — animación anterior de galería conservada como respaldo; actualmente se usa el video iframe.

### Antes de publicar

1. Sustituye el nombre ficticio, teléfono, correo, redes, precios, imagen, video y mapa por información aprobada del cliente.
2. Cambia `https://nova-barber.pages.dev/` en `index.html`, `robots.txt` y `sitemap.xml` si Cloudflare asigna otra URL.
3. Usa una foto y un video propios o con licencia para un cliente real.
4. Sube el contenido de esta carpeta a la raíz del repositorio de GitHub conectado a Cloudflare Pages.

### Local preview / Vista previa local

When opening `index.html` directly with `file://`, YouTube may show error 153 because the iframe has no web origin. The page hides that error state and provides a direct YouTube button. / Al abrir `index.html` directamente con `file://`, YouTube puede mostrar el error 153 porque el iframe no recibe un origen web. La página oculta ese estado y muestra un botón directo a YouTube.
