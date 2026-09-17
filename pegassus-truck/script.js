// Pegassus Truck — cotización al contado o con financiamiento.
// Demo de portafolio: manipulación del DOM, eventos y funciones.

// 1. Constantes financieras
const ITBIS = 0.18;               // En República Dominicana el impuesto se llama ITBIS
const TASA_INTERES_ANUAL = 0.08;  // Interés simple de referencia

// 2. Datos de los modelos: una sola fuente para la tabla, el selector y los precios
const MODELOS = [
  { id: 'B-One', nombre: 'Pegassus B-One', capacidad: '10 toneladas', aplicacion: 'Distribución urbana', precio: 85000 },
  { id: 'Aero-Haul', nombre: 'Pegassus Aero-Haul', capacidad: '18 toneladas', aplicacion: 'Transporte interestatal', precio: 125000 },
  { id: 'Titan-X', nombre: 'Pegassus Titan-X', capacidad: '30 toneladas', aplicacion: 'Minería y extracción', precio: 190000 },
];

const dinero = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'USD' });

// 3. Función de cálculo: devuelve un objeto con el desglose completo
function calcularDesgloseFinal(precio, tipoPago, meses) {
  const itbis = precio * ITBIS;
  const subtotal = precio + itbis;
  const interes = tipoPago === 'financiamiento' ? subtotal * TASA_INTERES_ANUAL * (meses / 12) : 0;
  const total = subtotal + interes;

  return {
    precioBase: precio,
    itbis,
    interes,
    totalFinal: total,
    pagoMensual: tipoPago === 'financiamiento' ? total / meses : 0,
  };
}

// 4. Selección de nodos del DOM
const formulario = document.querySelector('#formulario');
const selectorCamion = document.querySelector('#camion');
const tablaModelos = document.querySelector('#tabla-modelos');
const inputNombre = document.querySelector('#nombre');
const inputEmail = document.querySelector('#email');
const radioFinanciamiento = document.querySelector('#financiamiento');
const radioContado = document.querySelector('#contado');
const divOpcionesFinanciamiento = document.querySelector('#opciones-financiamiento');
const divResultado = document.querySelector('#resultado-cotizacion');
const ticketVacio = divResultado.querySelector('.ticket-vacio');

// 5. Construir la tabla y el selector con createElement
MODELOS.forEach((modelo) => {
  const fila = document.createElement('tr');
  const ETIQUETAS = ['Modelo', 'Capacidad', 'Aplicación', 'Precio desde'];
  [modelo.nombre, modelo.capacidad, modelo.aplicacion, dinero.format(modelo.precio)].forEach((texto, i) => {
    const celda = document.createElement(i === 0 ? 'th' : 'td');
    if (i === 0) celda.scope = 'row';
    celda.dataset.etiqueta = ETIQUETAS[i]; // En el celular la tabla se ve como tarjetas y usa esta etiqueta
    celda.textContent = texto;
    fila.appendChild(celda);
  });

  const celdaAccion = document.createElement('td');
  const botonCotizar = document.createElement('button');
  botonCotizar.type = 'button';
  botonCotizar.className = 'boton boton-pequeno';
  botonCotizar.textContent = 'Cotizar';
  botonCotizar.addEventListener('click', () => {
    selectorCamion.value = modelo.id;
    document.querySelector('#cotizacion').scrollIntoView({ behavior: 'smooth' });
    inputNombre.focus({ preventScroll: true });
  });
  celdaAccion.appendChild(botonCotizar);
  fila.appendChild(celdaAccion);
  tablaModelos.appendChild(fila);

  const opcion = document.createElement('option');
  opcion.value = modelo.id;
  opcion.textContent = `${modelo.nombre} · ${modelo.capacidad}`;
  selectorCamion.appendChild(opcion);
});

// 6. Validaciones
const nombreValido = () => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,}$/.test(inputNombre.value.trim());
const emailValido = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail.value.trim());

function marcar(input, valido) {
  input.classList.toggle('valido', valido);
  input.classList.toggle('invalido', !valido);
  document.querySelector(`#error-${input.id}`).classList.toggle('visible', !valido);
}

// EVENTO input: validación en tiempo real
inputNombre.addEventListener('input', () => marcar(inputNombre, nombreValido()));
inputEmail.addEventListener('input', () => marcar(inputEmail, emailValido()));

// EVENTO keydown: no deja escribir números en el nombre
inputNombre.addEventListener('keydown', (evento) => {
  if (/^[0-9]$/.test(evento.key)) evento.preventDefault();
});

// EVENTO change: al escoger financiamiento se crea el selector de plazo
radioFinanciamiento.addEventListener('change', () => {
  divOpcionesFinanciamiento.innerHTML = '';

  const etiqueta = document.createElement('label');
  etiqueta.htmlFor = 'plazo-meses';
  etiqueta.textContent = 'Plazo';

  const selectMeses = document.createElement('select');
  selectMeses.id = 'plazo-meses';
  selectMeses.innerHTML = `
    <option value="12">1 año (12 meses)</option>
    <option value="36">3 años (36 meses)</option>
    <option value="60">5 años (60 meses)</option>
  `;

  divOpcionesFinanciamiento.append(etiqueta, selectMeses);
});

radioContado.addEventListener('change', () => {
  divOpcionesFinanciamiento.innerHTML = '';
});

// Crea una línea "concepto ........ monto" del ticket
function lineaTicket(concepto, monto, clase = '') {
  const li = document.createElement('li');
  if (clase) li.className = clase;
  const texto = document.createElement('span');
  texto.textContent = concepto;
  const valor = document.createElement('strong');
  valor.textContent = monto;
  li.append(texto, valor);
  return li;
}

// EVENTO submit: calcular y mostrar la factura proforma
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  marcar(inputNombre, nombreValido());
  marcar(inputEmail, emailValido());
  if (!nombreValido() || !emailValido()) {
    (nombreValido() ? inputEmail : inputNombre).focus();
    return;
  }

  const modelo = MODELOS.find((m) => m.id === selectorCamion.value);
  const tipoPago = radioFinanciamiento.checked ? 'financiamiento' : 'contado';
  const selectPlazo = document.querySelector('#plazo-meses');
  const meses = tipoPago === 'financiamiento' ? parseInt(selectPlazo?.value ?? '12', 10) : 0;
  const desglose = calcularDesgloseFinal(modelo.precio, tipoPago, meses);

  // Se arma con textContent: lo que escribe el usuario nunca se interpreta como HTML
  const ticket = document.createElement('article');
  ticket.className = 'ticket';

  const titulo = document.createElement('h3');
  titulo.textContent = 'Factura proforma';
  const cliente = document.createElement('p');
  cliente.className = 'ticket-cliente';
  cliente.textContent = `${inputNombre.value.trim()} · ${modelo.nombre}`;

  const lista = document.createElement('ul');
  lista.append(
    lineaTicket('Precio base', dinero.format(desglose.precioBase)),
    lineaTicket('ITBIS (18%)', dinero.format(desglose.itbis)),
  );
  if (tipoPago === 'financiamiento') {
    lista.append(
      lineaTicket('Plazo', `${meses} meses`),
      lineaTicket('Intereses (8% anual)', dinero.format(desglose.interes)),
      lineaTicket('Cuota mensual estimada', dinero.format(desglose.pagoMensual), 'ticket-cuota'),
    );
  }

  const total = document.createElement('p');
  total.className = 'ticket-total';
  total.textContent = `Total: ${dinero.format(desglose.totalFinal)}`;

  // EVENTO click: descartar la cotización con .remove()
  const botonEliminar = document.createElement('button');
  botonEliminar.type = 'button';
  botonEliminar.className = 'boton boton-peligro';
  botonEliminar.textContent = 'Descartar cotización';
  botonEliminar.addEventListener('click', () => {
    ticket.remove();
    divResultado.replaceChildren(ticketVacio);
    formulario.reset();
    divOpcionesFinanciamiento.innerHTML = '';
    [inputNombre, inputEmail].forEach((input) => {
      input.classList.remove('valido', 'invalido');
      document.querySelector(`#error-${input.id}`).classList.remove('visible');
    });
    inputNombre.focus();
  });

  ticket.append(titulo, cliente, lista, total, botonEliminar);
  divResultado.replaceChildren(ticket);
  if (window.matchMedia('(max-width: 860px)').matches) ticket.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#anio').textContent = new Date().getFullYear();
