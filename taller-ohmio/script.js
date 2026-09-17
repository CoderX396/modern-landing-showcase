// Taller Ohmio — reparaciones, diagnóstico guiado por WhatsApp y catálogo de controles.
// Demo de portafolio: negocio, precios y número son de relleno.

const WHATSAPP = '18090000000';
const enlaceWhatsApp = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
const rd = (n) => 'RD$' + n.toLocaleString('es-DO');

// Íconos de línea (se pintan con currentColor).
const ICONOS = {
  tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  microondas: '<rect x="2" y="5" width="20" height="14" rx="2"/><rect x="5" y="8" width="10" height="8" rx="1"/><path d="M18 9v.01M18 12v.01M18 15v.01"/>',
  bocina: '<rect x="6" y="2" width="12" height="20" rx="3"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="6.5" r="1.3"/>',
  freidora: '<path d="M6 8h12l-1 12H7z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/><path d="M10 13h4"/>',
  otro: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
};

const EQUIPOS = [
  { id: 'tv', nombre: 'Smart TV', icono: 'tv', sintomas: ['Tiene sonido pero la pantalla está negra', 'No enciende o la luz parpadea', 'Líneas o manchas en la pantalla', 'No reconoce el HDMI'] },
  { id: 'microondas', nombre: 'Microondas', icono: 'microondas', sintomas: ['Enciende pero no calienta', 'Hace chispas o ruidos extraños', 'El panel o los botones no responden'] },
  { id: 'bocina', nombre: 'Bocina Bluetooth', icono: 'bocina', sintomas: ['El puerto de carga está flojo o roto', 'La batería dura muy poco', 'Suena distorsionado o no conecta'] },
  { id: 'freidora', nombre: 'Freidora de aire', icono: 'freidora', sintomas: ['No calienta o no sopla aire', 'Se apaga a los pocos minutos', 'Muestra un código de error'] },
  { id: 'otro', nombre: 'Otro equipo', icono: 'otro', sintomas: ['Cafetera, tostadora o plancha de pelo', 'Abanico o motor pequeño', 'Otra falla (la explico abajo)'] },
];

const CONTROLES = [
  { id: 'lg-magic', marca: 'LG', nombre: 'LG Magic Remote con puntero', compatible: 'LG Smart TV OLED, NanoCell y UHD (2019–2024)', precio: 1250, color: '#a50034', insignia: 'Más vendido' },
  { id: 'samsung-smart', marca: 'Samsung', nombre: 'Samsung Smart TV', compatible: 'Series TU, AU, Crystal UHD y QLED', precio: 900, color: '#1428a0', insignia: 'Popular' },
  { id: 'sony-bravia', marca: 'Sony', nombre: 'Sony Bravia / Google TV', compatible: 'Sony LED, OLED y Google TV', precio: 1100, color: '#111827' },
  { id: 'fire-tv', marca: 'Fire TV', nombre: 'Fire TV con voz', compatible: 'Fire TV Stick Lite, 4K y 4K Max', precio: 950, color: '#ff9900', insignia: 'Con voz' },
  { id: 'roku', marca: 'Roku', nombre: 'Roku TV', compatible: 'Televisores con Roku integrado', precio: 700, color: '#6c3c97' },
  { id: 'universal', marca: 'Universal', nombre: 'Universal para Android TV', compatible: 'TCL, Hisense, Philips y otras con Android TV', precio: 650, color: '#0e7490' },
];

const svgIcono = (clave) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[clave]}</svg>`;

// Control dibujado en SVG, del color de la marca.
const svgControl = (color) => `
  <svg viewBox="0 0 64 150" aria-hidden="true">
    <rect x="6" y="2" width="52" height="146" rx="22" fill="#1f2937"/>
    <circle cx="32" cy="22" r="6" fill="${color}"/>
    <circle cx="32" cy="52" r="14" fill="#374151"/><circle cx="32" cy="52" r="6" fill="#4b5563"/>
    <rect x="18" y="80" width="12" height="7" rx="3.5" fill="#4b5563"/><rect x="34" y="80" width="12" height="7" rx="3.5" fill="#4b5563"/>
    <rect x="18" y="94" width="12" height="7" rx="3.5" fill="#4b5563"/><rect x="34" y="94" width="12" height="7" rx="3.5" fill="#4b5563"/>
    <rect x="18" y="112" width="28" height="9" rx="4.5" fill="${color}"/>
  </svg>`;

// ---- Reparaciones ----
document.getElementById('servicios-lista').innerHTML = EQUIPOS.map((e) => `
  <li class="servicio">
    <div class="servicio-icono">${svgIcono(e.icono)}</div>
    <h3>${e.nombre}</h3>
    <ul>${e.sintomas.map((s) => `<li>${s}</li>`).join('')}</ul>
    <a class="boton boton-borde" href="#diagnostico" data-equipo="${e.id}">Diagnosticar mi ${e.nombre.toLowerCase()}</a>
  </li>`).join('');

document.getElementById('servicios-lista').addEventListener('click', (ev) => {
  const enlace = ev.target.closest('[data-equipo]');
  if (enlace) elegirEquipo(enlace.dataset.equipo);
});

// ---- Diagnóstico guiado ----
const cajaEquipos = document.getElementById('equipos');
const cajaSintomas = document.getElementById('sintomas');
const campoModelo = document.getElementById('modelo');
const campoDetalle = document.getElementById('detalle');
const vistaPrevia = document.getElementById('vista-previa');
const botonEnviar = document.getElementById('enviar-diagnostico');

cajaEquipos.innerHTML = EQUIPOS.map((e, i) => `
  <label class="opcion"><input type="radio" name="equipo" value="${e.id}" ${i === 0 ? 'checked' : ''} /><span>${e.nombre}</span></label>`).join('');

function equipoActual() {
  const id = document.querySelector('input[name="equipo"]:checked').value;
  return EQUIPOS.find((e) => e.id === id);
}

function pintarSintomas() {
  cajaSintomas.innerHTML = equipoActual().sintomas.map((s, i) => `
    <label class="opcion"><input type="radio" name="sintoma" value="${s}" ${i === 0 ? 'checked' : ''} /><span>${s}</span></label>`).join('');
}

function elegirEquipo(id) {
  const radio = cajaEquipos.querySelector(`input[value="${id}"]`);
  if (!radio) return;
  radio.checked = true;
  pintarSintomas();
  actualizarMensaje();
}

function actualizarMensaje() {
  const equipo = equipoActual();
  const sintoma = document.querySelector('input[name="sintoma"]:checked')?.value ?? '';
  const entrega = document.querySelector('input[name="entrega"]:checked').value;
  const modelo = campoModelo.value.trim();
  const detalle = campoDetalle.value.trim();

  const lineas = [
    'Hola Taller Ohmio, quiero un diagnóstico.',
    `Equipo: ${equipo.nombre}${modelo ? ` (${modelo})` : ''}`,
    `Falla: ${sintoma}`,
    detalle && `Detalle: ${detalle}`,
    `Entrega: ${entrega}`,
    entrega === 'Lo llevo al taller' ? '¿Cuándo puedo llevarlo?' : '¿Cuándo pueden recogerlo?',
  ].filter(Boolean);

  const texto = lineas.join('\n');
  vistaPrevia.textContent = texto;
  botonEnviar.href = enlaceWhatsApp(texto);
}

document.getElementById('formulario').addEventListener('change', (e) => {
  if (e.target.name === 'equipo') pintarSintomas();
  actualizarMensaje();
});
document.getElementById('formulario').addEventListener('input', actualizarMensaje);
document.getElementById('formulario').addEventListener('submit', (e) => e.preventDefault());

pintarSintomas();
actualizarMensaje();

// ---- Controles ----
const listaControles = document.getElementById('controles-lista');
const filtros = document.getElementById('filtros');
const marcas = ['Todas', ...new Set(CONTROLES.map((c) => c.marca))];
let marcaActual = 'Todas';

filtros.innerHTML = marcas.map((m) => `<button type="button" class="filtro" data-marca="${m}" aria-pressed="${m === marcaActual}">${m}</button>`).join('');
filtros.addEventListener('click', (e) => {
  const boton = e.target.closest('.filtro');
  if (!boton) return;
  marcaActual = boton.dataset.marca;
  filtros.querySelectorAll('.filtro').forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
  pintarControles();
});

function pintarControles() {
  const visibles = marcaActual === 'Todas' ? CONTROLES : CONTROLES.filter((c) => c.marca === marcaActual);
  listaControles.innerHTML = visibles.map((c) => `
    <li class="control">
      ${c.insignia ? `<span class="control-insignia">${c.insignia}</span>` : ''}
      <div class="control-figura">${svgControl(c.color)}</div>
      <div class="control-cuerpo">
        <h3>${c.nombre}</h3>
        <p class="control-compatible">${c.compatible}</p>
        <div class="control-pie">
          <span class="control-precio">${rd(c.precio)}</span>
          <a class="boton boton-principal" target="_blank" rel="noopener"
             href="${enlaceWhatsApp(`Hola Taller Ohmio, quiero el control ${c.nombre} (${rd(c.precio)}). ¿Lo tienen disponible? Mi televisor es: `)}">Pedir</a>
        </div>
      </div>
    </li>`).join('');
}
pintarControles();

document.getElementById('whatsapp-flotante').href = enlaceWhatsApp('Hola Taller Ohmio, tengo una consulta.');

// El botón flotante se esconde donde ya hay botones de WhatsApp, para no taparlos.
const flotante = document.getElementById('whatsapp-flotante');
const zonasConBoton = new Set();
const vigia = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => (e.isIntersecting ? zonasConBoton.add(e.target) : zonasConBoton.delete(e.target)));
  flotante.classList.toggle('oculto', zonasConBoton.size > 0);
}, { rootMargin: '-15% 0px -15% 0px' });
['diagnostico', 'controles'].forEach((id) => vigia.observe(document.getElementById(id)));

// ---- Tema, menú y cabecera ----
const botonTema = document.getElementById('tema');
function etiquetaTema() {
  const oscuro = document.documentElement.classList.contains('oscuro');
  botonTema.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}
botonTema.addEventListener('click', () => {
  const oscuro = document.documentElement.classList.toggle('oscuro');
  try { localStorage.setItem('ohmio-tema', oscuro ? 'oscuro' : 'claro'); } catch (e) {}
  etiquetaTema();
});
etiquetaTema();

const menu = document.getElementById('menu');
const menuBoton = document.getElementById('menu-boton');
menuBoton.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierto');
  menuBoton.setAttribute('aria-expanded', String(abierto));
  menuBoton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});
menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    menu.classList.remove('abierto');
    menuBoton.setAttribute('aria-expanded', 'false');
  }
});

const cabecera = document.getElementById('cabecera');
window.addEventListener('scroll', () => cabecera.classList.toggle('con-borde', window.scrollY > 10), { passive: true });
