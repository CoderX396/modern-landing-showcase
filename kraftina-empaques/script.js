// Kraftina Empaques — catálogo con precio al detalle y por mayor, y cotización por WhatsApp.
// Demo de portafolio: negocio, precios y número son de relleno.

const WHATSAPP = '18090000000';
const MINIMO_MAYOR = 12;

// mayor = precio de la docena. Por unidad sale mayor / 12.
const PRODUCTOS = [
  { id: 'kraft-s', categoria: 'Bolsas kraft', nombre: 'Bolsa kraft pequeña', medida: '18 × 10 × 22 cm', detalle: 25, mayor: 240, figura: 'bolsa', color: '#c8955f', oscuro: '#7a5230' },
  { id: 'kraft-m', categoria: 'Bolsas kraft', nombre: 'Bolsa kraft mediana', medida: '25 × 12 × 30 cm', detalle: 35, mayor: 360, figura: 'bolsa', color: '#b98653', oscuro: '#6e4726' },
  { id: 'kraft-l', categoria: 'Bolsas kraft', nombre: 'Bolsa kraft grande', medida: '32 × 15 × 40 cm', detalle: 50, mayor: 540, figura: 'bolsa', color: '#a8754a', oscuro: '#5e3b1f' },
  { id: 'color-mate', categoria: 'Bolsas de color', nombre: 'Bolsa de color mate', medida: '20 × 10 × 25 cm · rosa, verde o negro', detalle: 45, mayor: 480, figura: 'bolsa', color: '#2f5d62', oscuro: '#16302f' },
  { id: 'color-fiesta', categoria: 'Bolsas de color', nombre: 'Bolsa estampada de fiesta', medida: '26 × 12 × 32 cm', detalle: 60, mayor: 660, figura: 'bolsa', color: '#e98aa6', oscuro: '#9c3f5c' },
  { id: 'caja-tapa', categoria: 'Cajas de regalo', nombre: 'Caja con tapa', medida: '20 × 20 × 10 cm', detalle: 150, mayor: 1620, figura: 'caja', color: '#f3e3cc', oscuro: '#c9a577' },
  { id: 'caja-corazon', categoria: 'Cajas de regalo', nombre: 'Caja corazón con ventana', medida: '24 × 22 × 9 cm', detalle: 275, mayor: 3000, figura: 'caja', color: '#e98aa6', oscuro: '#9c3f5c' },
  { id: 'papel-seda', categoria: 'Papel y cintas', nombre: 'Papel de seda', medida: 'Paquete de 10 pliegos', detalle: 60, mayor: 600, figura: 'papel', color: '#f6d6de', oscuro: '#b0697d' },
  { id: 'cinta-satin', categoria: 'Papel y cintas', nombre: 'Cinta satinada', medida: '2.5 cm × 20 m', detalle: 95, mayor: 1020, figura: 'cinta', color: '#f2c14e', oscuro: '#9b7218' },
  { id: 'rosa-cupula', categoria: 'Detalles', nombre: 'Rosa preservada en cúpula', medida: 'Altura 20 cm', detalle: 950, mayor: 10800, figura: 'detalle', color: '#d9534f', oscuro: '#8d2723' },
];

const rd = (n) => 'RD$' + Math.round(n).toLocaleString('es-DO');
const porUnidad = (p, cantidad) => (cantidad >= MINIMO_MAYOR ? p.mayor / 12 : p.detalle);
const enlaceWhatsApp = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

// ---- Estado de la cotización (se guarda en el navegador de quien la arma) ----
const CLAVE = 'kraftina-cotizacion';
let cotizacion = {};
try { cotizacion = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { cotizacion = {}; }

function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(cotizacion)); } catch (e) {}
}

function cambiarCantidad(id, cantidad) {
  const n = Math.max(0, Math.min(9999, Math.floor(Number(cantidad) || 0)));
  if (n === 0) delete cotizacion[id]; else cotizacion[id] = n;
  guardar();
  pintarTodo();
}

// ---- Catálogo ----
const lista = document.getElementById('productos');
const filtros = document.getElementById('filtros');
const categorias = ['Todo', ...new Set(PRODUCTOS.map((p) => p.categoria))];
let categoriaActual = 'Todo';

filtros.innerHTML = categorias
  .map((c) => `<button type="button" class="filtro" data-categoria="${c}" aria-pressed="${c === categoriaActual}">${c}</button>`)
  .join('');

filtros.addEventListener('click', (e) => {
  const boton = e.target.closest('.filtro');
  if (!boton) return;
  categoriaActual = boton.dataset.categoria;
  filtros.querySelectorAll('.filtro').forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
  pintarCatalogo();
});

function selector(p, cantidad) {
  return `
    <div class="selector">
      <button type="button" data-accion="menos" data-id="${p.id}" aria-label="Quitar uno de ${p.nombre}">−</button>
      <input type="number" inputmode="numeric" min="0" max="9999" value="${cantidad}" data-id="${p.id}" aria-label="Cantidad de ${p.nombre}" />
      <button type="button" data-accion="mas" data-id="${p.id}" aria-label="Agregar uno de ${p.nombre}">+</button>
    </div>`;
}

function avisoMayor(cantidad) {
  if (cantidad >= MINIMO_MAYOR) return 'Precio de mayor aplicado';
  return `Faltan ${MINIMO_MAYOR - cantidad} para precio de mayor`;
}

function pintarCatalogo() {
  const visibles = categoriaActual === 'Todo' ? PRODUCTOS : PRODUCTOS.filter((p) => p.categoria === categoriaActual);
  lista.innerHTML = visibles
    .map((p) => {
      const cantidad = cotizacion[p.id] || 0;
      return `
      <li class="producto">
        <div class="producto-figura" style="--c:${p.color};--c-oscuro:${p.oscuro};--lazo:#d9534f">
          <svg viewBox="0 0 120 120" role="img" aria-label="${p.nombre}"><use href="#fig-${p.figura}"/></svg>
        </div>
        <div class="producto-cuerpo">
          <p class="producto-categoria">${p.categoria}</p>
          <h3>${p.nombre}</h3>
          <p class="producto-medida">${p.medida}</p>
          <div class="precios">
            <div class="precio"><span>Detalle</span><strong>${rd(p.detalle)}</strong></div>
            <div class="precio precio-mayor"><span>Mayor (12+) c/u</span><strong>${rd(p.mayor / 12)}</strong></div>
          </div>
          <div class="producto-accion">
            ${cantidad === 0
              ? `<button type="button" class="boton boton-principal" data-accion="agregar" data-id="${p.id}">Agregar a cotización</button>`
              : `${selector(p, cantidad)}<p class="selector-aviso">${avisoMayor(cantidad)}</p>`}
          </div>
        </div>
      </li>`;
    })
    .join('');
}

// Un solo manejador para botones de todas las tarjetas y del panel.
document.addEventListener('click', (e) => {
  const boton = e.target.closest('[data-accion]');
  if (!boton) return;
  const id = boton.dataset.id;
  const actual = cotizacion[id] || 0;
  if (boton.dataset.accion === 'agregar') cambiarCantidad(id, 1);
  if (boton.dataset.accion === 'mas') cambiarCantidad(id, actual + 1);
  if (boton.dataset.accion === 'menos') cambiarCantidad(id, actual - 1);
  if (boton.dataset.accion === 'quitar') cambiarCantidad(id, 0);
});

document.addEventListener('change', (e) => {
  const campo = e.target.closest('.selector input');
  if (campo) cambiarCantidad(campo.dataset.id, campo.value);
});

// ---- Barra, panel y mensaje ----
const barra = document.getElementById('barra');
const panel = document.getElementById('panel');
const panelLista = document.getElementById('panel-lista');

function lineas() {
  return PRODUCTOS.filter((p) => cotizacion[p.id]).map((p) => {
    const cantidad = cotizacion[p.id];
    const unidad = porUnidad(p, cantidad);
    return { p, cantidad, unidad, subtotal: unidad * cantidad, mayor: cantidad >= MINIMO_MAYOR };
  });
}

function mensaje(items, total) {
  const detalle = items
    .map((l) => `- ${l.cantidad} × ${l.p.nombre} (${l.p.medida}) a ${rd(l.unidad)} c/u${l.mayor ? ', mayor' : ''} = ${rd(l.subtotal)}`)
    .join('\n');
  return `Hola Kraftina, quiero cotizar:\n${detalle}\n\nTotal estimado: ${rd(total)}\n¿Tienen disponible y cuánto sale el envío?`;
}

function pintarCotizacion() {
  const items = lineas();
  const total = items.reduce((s, l) => s + l.subtotal, 0);
  const cantidad = items.reduce((s, l) => s + l.cantidad, 0);

  barra.hidden = items.length === 0;
  document.getElementById('barra-cantidad').textContent = cantidad.toLocaleString('es-DO');
  document.getElementById('barra-total').textContent = rd(total);
  document.getElementById('panel-total').textContent = rd(total);
  document.getElementById('enviar-cotizacion').href = enlaceWhatsApp(mensaje(items, total));

  panelLista.innerHTML = items.length
    ? items
        .map((l) => `
        <li>
          <div class="linea-cabeza"><span>${l.p.nombre}</span><span>${rd(l.subtotal)}</span></div>
          <p class="linea-detalle">${l.p.medida} · ${rd(l.unidad)} c/u${l.mayor ? ' (mayor)' : ''}</p>
          ${selector(l.p, l.cantidad)}
          <button type="button" class="enlace" data-accion="quitar" data-id="${l.p.id}">Quitar</button>
        </li>`)
        .join('')
    : '<li>Tu cotización está vacía.</li>';

  if (items.length === 0 && panel.open) panel.close();
}

function pintarTodo() {
  pintarCatalogo();
  pintarCotizacion();
}

document.getElementById('abrir-cotizacion').addEventListener('click', () => panel.showModal());
document.getElementById('cerrar-cotizacion').addEventListener('click', () => panel.close());
panel.addEventListener('click', (e) => { if (e.target === panel) panel.close(); });
document.getElementById('vaciar').addEventListener('click', () => {
  cotizacion = {};
  guardar();
  pintarTodo();
});

document.getElementById('escribir').href = enlaceWhatsApp('Hola Kraftina, quiero información sobre sus empaques.');
document.getElementById('cotizar-logo').href = enlaceWhatsApp('Hola Kraftina, tengo un negocio y quiero cotizar bolsas con mi logo. Cantidad aproximada: ');

// ---- Tema, menú y cabecera ----
const botonTema = document.getElementById('tema');
function etiquetaTema() {
  const oscuro = document.documentElement.classList.contains('oscuro');
  botonTema.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}
botonTema.addEventListener('click', () => {
  const oscuro = document.documentElement.classList.toggle('oscuro');
  try { localStorage.setItem('kraftina-tema', oscuro ? 'oscuro' : 'claro'); } catch (e) {}
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

pintarTodo();
