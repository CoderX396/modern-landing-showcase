#!/usr/bin/env node
/**
 * avisar-indexnow.mjs
 * =========================================================================
 * Le avisa a Bing, Yandex, Seznam y DuckDuckGo que estas URLs existen o
 * cambiaron. Responden en minutos u horas, no en semanas.
 *
 * GOOGLE NO USA INDEXNOW. Google lo evaluó y no lo adoptó. Para Google la
 * única vía rápida sigue siendo Search Console -> Inspección de URLs ->
 * Solicitar indexación, a mano. No hay archivo que se lo salte.
 *
 * CÓMO SE USA:
 *   node avisar-indexnow.mjs
 *
 * REQUISITO: el archivo 73138609b38ea93df41cb44185061624.txt tiene que estar
 * publicado en la raíz de cada dominio. Ya está en cada carpeta; se sube
 * solo cuando despliegues.
 *
 * CUÁNDO CORRERLO: cada vez que publiques cambios. No lo corras en bucle
 * sin cambios reales — es spam y te pueden ignorar.
 * =========================================================================
 */

const CLAVE = '73138609b38ea93df41cb44185061624';

// Solo los demos de ESTE repo. La pagina central vive en otro repo
// y se avisa desde alli, con su propia clave.
// Cuando agregues un demo nuevo, agregalo aqui tambien.
const SITIOS = {
  'nova-barber.pages.dev':          ['/', '/privacidad.html', '/terminos.html'],
  'titanium-fitness.pages.dev':     ['/', '/privacidad.html', '/terminos.html'],
  'brasas-del-caribe.pages.dev':    ['/', '/privacidad.html', '/terminos.html'],
  'sylax-bio-robotics.pages.dev':   ['/', '/divisiones.html', '/labs.html', '/solicitudes.html', '/privacidad.html', '/terminos.html'],
  'kraftina-empaques.pages.dev':    ['/'],
  'taller-ohmio.pages.dev':         ['/'],
  'pegassus-truck.pages.dev':       ['/'],
  'alern-devtech.pages.dev':        ['/', '/cursos.html', '/contacto.html'],
};

const PUNTO = 'https://api.indexnow.org/indexnow';

for (const [host, rutas] of Object.entries(SITIOS)) {
  const cuerpo = {
    host,
    key: CLAVE,
    keyLocation: `https://${host}/${CLAVE}.txt`,
    urlList: rutas.map(r => `https://${host}${r}`),
  };

  try {
    const res = await fetch(PUNTO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(cuerpo),
    });
    // 200 = aceptado. 202 = aceptado, clave aún por verificar.
    // 403 = no encuentra el archivo de clave en la raíz del dominio.
    // 422 = las URLs no coinciden con el host. 429 = demasiadas veces.
    const estado = { 200: 'OK', 202: 'aceptado (verificando clave)', 400: 'petición mal formada',
                     403: 'NO encuentra el archivo de clave en la raíz', 422: 'URL no coincide con el host',
                     429: 'demasiadas peticiones, espera' }[res.status] || 'respuesta inesperada';
    console.log(`${res.status}  ${host.padEnd(34)} ${rutas.length} URLs  — ${estado}`);
  } catch (e) {
    console.log(`ERR  ${host.padEnd(34)} ${e.message}`);
  }
}

console.log('\nRecuerda: esto NO afecta a Google. Para Google usa Search Console.');
