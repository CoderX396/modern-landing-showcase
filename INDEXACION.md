# Por qué tus demos no salen en Google (y qué hacer)

## Lo que comprobé

Busqué `site:nova-barber.pages.dev` en Google. **No devuelve nada.** No es que
salgas de último: es que **no estás en el índice**.

El sitio en sí está bien. Lo revisé en vivo:

| Comprobación | Resultado |
|---|---|
| ¿Carga? | Sí |
| `<meta name="robots">` | `index, follow` — correcto |
| Canonical | Correcto |
| sitemap.xml | Existe |
| robots.txt | Permite el rastreo |

O sea: no tienes un bug. Tienes un problema de descubrimiento y de autoridad.

## Las cuatro razones reales

**1. Nadie enlaza a tus demos.** Esta es la grande. Google descubre páginas
siguiendo enlaces desde páginas que ya conoce. Tus cuatro demos están sueltos en
internet, sin que nada apunte a ellos. Un sitemap **no reemplaza** esto: el
sitemap es una sugerencia, no una orden. Google lo lee y decide si vale la pena.

**2. `.pages.dev` no tiene autoridad.** Es un subdominio gratis. Google recibe
millones de sitios de prueba en dominios así y los trata con desconfianza por
defecto. Tu `arielfyblabs.com.do`, que ya compraste, vale infinitamente más para
esto que cualquier `.pages.dev`.

**3. Nunca los subiste a Search Console.** Si un sitio nuevo, sin enlaces, en un
dominio gratis, nunca se declara en Search Console, lo normal es que Google
tarde meses o simplemente no lo indexe nunca.

**4. El nombre.** Esto es lo que estás viendo cuando dices "aparece otro nombre
que se parece". Busqué "Nova Barber" y compites contra:

- Nova Barbers (Wilmington, Massachusetts) — negocio real con dominio propio
- Nova The Barber — negocio real
- BARBERNOVA — marca de tijeras
- Varias páginas de Facebook de barberías reales

Con "Titanium Fitness" pasa lo mismo: hay un gimnasio real en Palm Harbor,
Florida, con `titaniumfitnessfl.com`, y un Titanium Fitness LLC en Casper.

Son negocios reales, con años, reseñas, Google Business Profile y gente que los
enlaza. Un demo de un negocio inventado, en un subdominio gratis, con cero
enlaces, no le gana a eso. Y no le va a ganar.

## La parte incómoda

**Estás optimizando lo que no es.**

Piénsalo: si alguien busca "Nova Barber" en Google, está buscando una barbería
para cortarse el pelo. No es un cliente tuyo. Aunque lograras posicionar el demo
—que no vas a lograr— te traería visitas inútiles.

Los demos no son para que los encuentren desconocidos. Son para **enseñárselos
tú** a un dueño de negocio, desde el celular, cuando estés parado en su local.
Para eso funcionan perfecto ya.

Lo que sí debe salir en Google es **tu negocio**:

- "Ariel FyB Labs"
- "páginas web Santo Domingo Este"
- "diseño web República Dominicana"
- "hacer página web para mi negocio RD"

Ahí no compites contra barberías de Massachusetts. Compites contra otros
freelancers dominicanos, que es una pelea que sí puedes ganar. Y eso se juega en
`arielfyblabs.com.do`, no en los demos.

---

# Qué te dejé montado

## 1. `index.html` en la raíz del repo — la página central

**Este es el arreglo de verdad**, y de paso es la "página central" que tú mismo
dejaste apuntada como TODO en el código de Nova Barber.

Es una sola página que enlaza a los cuatro demos. Con eso:

- Google tiene por fin **un camino** para llegar a los cuatro.
- Los demos dejan de ser páginas huérfanas.
- Tienes un solo link que mandar por WhatsApp a un cliente, en vez de cuatro.
- Lleva JSON-LD de `ProfessionalService` con tu nombre, tu correo y tu zona:
  eso es lo que quieres que Google entienda.

Súbela como un proyecto de Cloudflare Pages más, apuntando a la raíz del repo.

## 2. IndexNow — el archivo especial que preguntabas

Sí existe, y te lo dejé puesto: `73138609b38ea93df41cb44185061624.txt` en la raíz de
cada demo, más el script `avisar-indexnow.mjs`.

Funciona así: publicas el archivo con la clave, corres el script, y le avisas de
golpe a Bing, Yandex, Seznam y DuckDuckGo que tus URLs existen. Responden en
minutos u horas.

    node avisar-indexnow.mjs

**La trampa: Google no usa IndexNow.** Lo evaluó y no lo adoptó. Así que este
archivo te sirve para Bing y compañía, no para Google. No hay ningún archivo que
haga que Google te indexe rápido — si alguien te dice lo contrario, te está
vendiendo humo.

## 3. `sitemap-index.xml` — un sitemap para todos

Lo más parecido a "un archivo para todas" en el lado de Google. Es un índice que
apunta a los sitemaps de los cuatro demos, para subir uno solo en Search Console
en vez de cuatro.

**Condición:** solo funciona si tienes los cinco dominios verificados en la misma
cuenta de Search Console. Si no, Google lo ignora. Está explicado dentro del
propio archivo.

Honestamente: verificar los cinco y subir cuatro sitemaps sueltos es la misma
cantidad de trabajo y falla menos. El índice úsalo cuando tengas diez demos.

---

# Qué hacer tú, en orden

1. **Sube la página central** a Cloudflare Pages, apuntando a la raíz del repo.
2. **Enlaza los demos desde `ariel-fyb-labs.pages.dev`** (tu portafolio) y desde
   tu Instagram y tu Fiverr. Enlaces reales desde sitios que Google ya conoce.
   Esto vale más que todo lo demás junto.
3. **Search Console**: agrega las cinco propiedades, verifica por archivo HTML
   (ya tienes `google9c41d89a0c874875.html` en tres demos, reúsalo), sube cada
   sitemap y usa **Inspección de URLs → Solicitar indexación** en cada home.
   Eso es lo único que mete una URL en Google en horas en vez de meses.
4. **Corre `node avisar-indexnow.mjs`** cada vez que publiques cambios.
5. **Mete `arielfyblabs.com.do` en Search Console.** Ahí es donde te conviene
   posicionar, no en los `.pages.dev`.

## Lo que NO va a funcionar

- Esperar a que el sitemap solo haga el trabajo. No lo hace.
- Repetir "Nova Barber" en el texto para posicionar ese nombre. Compites contra
  negocios reales y pierdes.
- Correr IndexNow en bucle. Sin cambios reales es spam y te ignoran.
- Comprar backlinks. Penalización, y en un dominio gratis ni siquiera te sirve.
