# Ariel FyB Labs — demos

Demos de páginas web para negocios pequeños en República Dominicana.
Cada carpeta es un sitio independiente que se despliega como su propio
proyecto de Cloudflare Pages.

| Carpeta | Qué es | En vivo |
|---|---|---|
| `/` (raíz) | Página central que enlaza a todos los demos | ariel-fyb-labs-demos.pages.dev |
| `nova-barber/` | Barbería — reservas en el navegador, ticket, WhatsApp | nova-barber.pages.dev |
| `titanium-fitness/` | Gimnasio — formulario real con Turnstile y autorespuesta | titanium-fitness.pages.dev |
| `brasas-del-caribe/` | Restaurante — carta, reserva de mesa, pedido por WhatsApp | brasas-del-caribe.pages.dev |
| `sylax-bio-robotics/` | Proyecto académico de Talendig — Bootstrap 5, multipágina | sylax-bio-robotics.pages.dev |

Todos los negocios son **inventados**. Nombres, direcciones, teléfonos y precios
son de relleno. Cada demo tiene su `privacidad.html` y su `terminos.html`.

## Indexación

Lee **[INDEXACION.md](INDEXACION.md)**. Explica por qué los demos no salían en
Google y qué hacer. Resumen: les faltaban enlaces entrantes y Search Console,
no archivos.

Para avisar a Bing/Yandex de un cambio:

```bash
node avisar-indexnow.mjs
```

Google no usa IndexNow — ahí toca Search Console a mano.

## Al agregar un demo nuevo

1. Carpeta nueva con su `robots.txt`, `sitemap.xml`, `privacidad.html` y `terminos.html`.
2. Añádelo a la rejilla de `index.html` (raíz). Si no lo enlazas desde ahí,
   Google no lo va a encontrar.
3. Añádelo a `sitemap-index.xml` y a la lista `SITIOS` de `avisar-indexnow.mjs`.
4. Copia el `.txt` de la clave de IndexNow a la carpeta nueva.
