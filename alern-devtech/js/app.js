// Alern DevTech — lógica compartida de las 3 páginas.
// Demo de portafolio: academia ficticia.

const CURSOS = [
  { id: 'html-css', nombre: 'HTML y CSS desde cero', nivel: 'Principiante', duracion: '8 semanas', modalidad: 'Presencial y virtual', precio: 6500 },
  { id: 'javascript', nombre: 'JavaScript moderno', nivel: 'Principiante', duracion: '10 semanas', modalidad: 'Virtual', precio: 8500 },
  { id: 'tailwind', nombre: 'Diseño web con Tailwind CSS', nivel: 'Intermedio', duracion: '6 semanas', modalidad: 'Virtual', precio: 7000 },
  { id: 'react', nombre: 'React: aplicaciones web', nivel: 'Intermedio', duracion: '12 semanas', modalidad: 'Presencial y virtual', precio: 12500 },
  { id: 'python', nombre: 'Python para análisis de datos', nivel: 'Intermedio', duracion: '10 semanas', modalidad: 'Presencial', precio: 11000 },
  { id: 'node', nombre: 'Backend con Node.js y bases de datos', nivel: 'Avanzado', duracion: '14 semanas', modalidad: 'Virtual', precio: 15500 },
];

const pesos = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 });
const COLOR_NIVEL = {
  Principiante: 'bg-emerald-100 text-emerald-800',
  Intermedio: 'bg-amber-100 text-amber-800',
  Avanzado: 'bg-rose-100 text-rose-800',
};

// ---------- Todas las páginas ----------
const botonMenu = document.querySelector('#boton-menu');
const menu = document.querySelector('#menu');
if (botonMenu && menu) {
  botonMenu.addEventListener('click', () => {
    const abierto = menu.classList.toggle('hidden') === false;
    botonMenu.setAttribute('aria-expanded', String(abierto));
  });
}
document.querySelectorAll('[data-anio]').forEach((el) => (el.textContent = new Date().getFullYear()));

// ---------- cursos.html: tabla con filtro ----------
const cuerpoTabla = document.querySelector('#tabla-cursos');
if (cuerpoTabla) {
  const filtros = document.querySelector('#filtros-nivel');
  const buscador = document.querySelector('#buscar-curso');
  const sinResultados = document.querySelector('#sin-resultados');
  let nivelActual = 'Todos';

  const normalizar = (t) => t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  function pintarTabla() {
    const texto = normalizar(buscador.value.trim());
    const visibles = CURSOS.filter(
      (c) => (nivelActual === 'Todos' || c.nivel === nivelActual) && normalizar(c.nombre).includes(texto),
    );

    cuerpoTabla.replaceChildren(
      ...visibles.map((curso) => {
        const fila = document.createElement('tr');
        fila.className = 'border-b border-gray-100 last:border-0 hover:bg-blue-50/50';

        const celdas = [
          ['Curso', curso.nombre, 'font-semibold text-gray-900'],
          ['Nivel', curso.nivel, ''],
          ['Duración', curso.duracion, 'text-gray-600'],
          ['Modalidad', curso.modalidad, 'text-gray-600'],
          ['Inversión', pesos.format(curso.precio), 'font-semibold whitespace-nowrap'],
        ];

        celdas.forEach(([etiqueta, valor, clases], i) => {
          const celda = document.createElement(i === 0 ? 'th' : 'td');
          if (i === 0) celda.scope = 'row';
          celda.dataset.etiqueta = etiqueta;
          celda.className = `px-4 py-3 text-left ${clases}`;
          if (etiqueta === 'Nivel') {
            const insignia = document.createElement('span');
            insignia.className = `inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${COLOR_NIVEL[curso.nivel]}`;
            insignia.textContent = valor;
            celda.appendChild(insignia);
          } else {
            celda.textContent = valor;
          }
          fila.appendChild(celda);
        });

        const accion = document.createElement('td');
        accion.className = 'px-4 py-3 text-right';
        const enlace = document.createElement('a');
        enlace.href = `contacto.html?curso=${curso.id}`;
        enlace.className = 'inline-block rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700';
        enlace.textContent = 'Inscribirme';
        accion.appendChild(enlace);
        fila.appendChild(accion);
        return fila;
      }),
    );

    sinResultados.classList.toggle('hidden', visibles.length > 0);
  }

  filtros.addEventListener('click', (e) => {
    const boton = e.target.closest('button[data-nivel]');
    if (!boton) return;
    nivelActual = boton.dataset.nivel;
    filtros.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
    pintarTabla();
  });
  buscador.addEventListener('input', pintarTabla);
  pintarTabla();
}

// ---------- contacto.html: formulario de inscripción ----------
const formulario = document.querySelector('#form-inscripcion');
if (formulario) {
  const selectCurso = document.querySelector('#curso');
  const exito = document.querySelector('#inscripcion-exito');

  CURSOS.forEach((curso) => {
    const opcion = document.createElement('option');
    opcion.value = curso.id;
    opcion.textContent = `${curso.nombre} · ${pesos.format(curso.precio)}`;
    selectCurso.appendChild(opcion);
  });

  // Si viene de la tabla de cursos (contacto.html?curso=react), se preselecciona
  const cursoElegido = new URLSearchParams(location.search).get('curso');
  if (CURSOS.some((c) => c.id === cursoElegido)) selectCurso.value = cursoElegido;

  const reglas = {
    nombre: (v) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,}$/.test(v.trim()) || 'Escribe tu nombre (al menos 3 letras, sin números).',
    correo: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Escribe un correo válido.',
    telefono: (v) => v.trim() === '' || /^[0-9\s()+-]{10,15}$/.test(v.trim()) || 'Escribe un teléfono de 10 dígitos, por ejemplo 809-555-0123.',
    curso: (v) => v !== '' || 'Escoge un curso.',
    acepto: (_, input) => input.checked || 'Debes aceptar para continuar.',
  };

  function validarCampo(nombre) {
    const input = formulario.elements[nombre];
    const resultado = reglas[nombre](input.value, input);
    const mensaje = document.querySelector(`#error-${nombre}`);
    const ok = resultado === true;
    mensaje.textContent = ok ? '' : resultado;
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  Object.keys(reglas).forEach((nombre) => {
    const input = formulario.elements[nombre];
    input.addEventListener(input.type === 'checkbox' ? 'change' : 'blur', () => validarCampo(nombre));
  });

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const resultados = Object.keys(reglas).map(validarCampo);
    if (resultados.includes(false)) {
      formulario.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const datos = new FormData(formulario);
    const curso = CURSOS.find((c) => c.id === datos.get('curso'));
    document.querySelector('#exito-nombre').textContent = datos.get('nombre').trim().split(/\s+/)[0];
    document.querySelector('#exito-curso').textContent = curso.nombre;
    document.querySelector('#exito-detalle').textContent = `${datos.get('modalidad')} · ${datos.get('horario')}`;

    formulario.classList.add('hidden');
    exito.classList.remove('hidden');
    exito.focus();
  });

  document.querySelector('#otra-inscripcion').addEventListener('click', () => {
    formulario.reset();
    formulario.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    exito.classList.add('hidden');
    formulario.classList.remove('hidden');
    formulario.elements.nombre.focus();
  });
}
