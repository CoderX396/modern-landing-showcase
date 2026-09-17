# Ariel FyB Labs — demos

Demos de páginas web para negocios pequeños en República Dominicana.
**Una carpeta = un sitio = un proyecto de Cloudflare Pages.** Nada se comparte
entre carpetas: cada demo es independiente y se puede borrar sin romper el resto.

| Carpeta | Qué es | En vivo |
|---|---|---|
| `nova-barber/` | Barbería — reservas en el navegador, ticket, WhatsApp | nova-barber.pages.dev |
| `titanium-fitness/` | Gimnasio — formulario real con Turnstile y autorespuesta | titanium-fitness.pages.dev |
| `brasas-del-caribe/` | Restaurante — carta, reserva de mesa, pedido por WhatsApp | brasas-del-caribe.pages.dev |
| `sylax-bio-robotics/` | Proyecto académico de Talendig — Bootstrap 5, multipágina | sylax-bio-robotics.pages.dev |
| `kraftina-empaques/` | Tienda de empaques — catálogo con precio al detalle y por mayor, cotización por WhatsApp | kraftina-empaques.pages.dev |
| `taller-ohmio/` | Taller de electrónica — diagnóstico guiado por WhatsApp y catálogo de controles | taller-ohmio.pages.dev |
| `pegassus-truck/` | Concesionario de camiones — tabla de modelos y cotización al contado o financiada | pegassus-truck.pages.dev |
| `alern-devtech/` | Academia de programación — multipágina con Tailwind, cursos con filtro e inscripción | alern-devtech.pages.dev |

> La **página central / portafolio** no vive en este repo. Tiene el suyo aparte.

Todos los negocios son **inventados**. Nombres, direcciones, teléfonos y precios
son de relleno. Los demos con formulario (Nova, Titanium, Brasas y Sylax) tienen
su `privacidad.html` y su `terminos.html`, porque recogen datos personales.
Kraftina, Ohmio, Pegassus y Alern no envían datos a ningún lado: Kraftina y Ohmio
arman un mensaje que el visitante decide mandar por su WhatsApp, y Pegassus y Alern
procesan el formulario solo en el navegador. Por eso no llevan esas dos páginas.

## Qué hay en la raíz y por qué

La raíz son las 4 carpetas y **solo dos archivos**. Si vas a añadir algo aquí,
que tenga una razón igual de concreta:

- **`README.md`** — GitHub solo muestra el README si está en la raíz del repo.
  No puede ir en una subcarpeta.
- **`avisar-indexnow.mjs`** — no pertenece a ningún demo (les avisa a los cuatro
  a la vez) y se ejecuta desde la raíz. Meterlo en una carpeta de un demo sería
  mentir sobre a quién pertenece.

Todo lo demás va **dentro** de la carpeta de su sitio: `robots.txt`,
`sitemap.xml`, la clave de IndexNow, imágenes, hojas de estilo, funciones.
Esos archivos tienen que servirse desde la raíz de **su dominio**, que es la
carpeta del demo, no la del repo.

## Qué lleva cada carpeta

```
<demo>/
├── index.html          la página
├── privacidad.html     obligatoria: hay formulario
├── terminos.html       obligatoria: hay formulario
├── robots.txt          tiene que estar en la raíz del dominio
├── sitemap.xml         declarado dentro de robots.txt
├── <clave>.txt         clave de IndexNow, raíz del dominio
└── estilos, scripts, imágenes...
```

## Indexación

Los demos **no salen en Google**, y no es un bug: comprobado con
`site:nova-barber.pages.dev`, no están en el índice. Las razones reales:

1. **Nadie los enlaza.** Google descubre páginas siguiendo enlaces. Un sitemap
   es una sugerencia, no una orden — no reemplaza tener enlaces entrantes.
2. **`.pages.dev` es un subdominio gratis sin autoridad.** Google recibe millones
   de sitios de prueba en dominios así.
3. **No están en Search Console.**
4. **Los nombres chocan con negocios reales.** "Nova Barber" compite contra
   barberías reales con años y reseñas; "Titanium Fitness" contra un gimnasio
   real en Florida. Un demo inventado no le gana a eso, y no le va a ganar.

Y lo importante: **los demos no son para posicionar.** Quien busca "Nova Barber"
quiere cortarse el pelo, no contratarte. Los demos son para enseñárselos tú a un
cliente desde el celular. Lo que debe salir en Google es tu negocio
("Ariel FyB Labs", "páginas web Santo Domingo Este"), y eso se juega en
`arielfyblabs.com.do`, no aquí.

### Avisar a los buscadores de un cambio

```bash
node avisar-indexnow.mjs
```

Le avisa a Bing, Yandex, Seznam y DuckDuckGo; responden en horas. Requiere que
el archivo de clave esté publicado en la raíz de cada dominio — ya está en cada
carpeta y se sube solo al desplegar.

**Google no usa IndexNow.** Lo evaluó y no lo adoptó. Para Google la única vía
rápida es Search Console → Inspección de URLs → Solicitar indexación, a mano.
No existe ningún archivo que se lo salte.

No lo corras en bucle sin cambios reales: es spam y te ignoran.

## Al agregar un demo nuevo

1. Carpeta nueva con su `index.html`, `robots.txt`, `sitemap.xml` y una copia
   del `.txt` de la clave de IndexNow. Si recoge datos en un formulario, también
   `privacidad.html` y `terminos.html`.
2. Añádelo a la lista `SITIOS` de `avisar-indexnow.mjs`.
3. Añádelo a la tabla de arriba.
4. Enlázalo desde la página central (otro repo) — si no, Google no lo encuentra.
