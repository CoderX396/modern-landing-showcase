/**
 * ========================================================
 * SylaxBioRobotics — lógica compartida por las 4 páginas
 * --------------------------------------------------------
 * Se carga en index, divisiones, solicitudes y labs.
 * Cada bloque comprueba que su elemento exista antes de
 * engancharse, así el mismo archivo sirve para todas.
 * ========================================================
 */

/* ---------- Funciones puras (fáciles de probar) ---------- */

// Texto del botón según el tema activo
function getTextoBoton(esOscuro) {
  return esOscuro ? 'Modo Claro' : 'Modo Oscuro';
}

// Validación de correo. La anterior solo miraba si había una "@"
// y más de 5 caracteres, así que "a@b" pasaba.
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(String(email).trim());
}

// Nombre y apellido: al menos dos palabras de 3+ letras
function validarNombre(valor) {
  const partes = String(valor).trim().split(/\s+/).filter(Boolean);
  return partes.length >= 2 && partes.every(p => p.length >= 3);
}

function formatearContador(longitud, maximo) {
  return 'Caracteres escritos: ' + longitud + '/' + maximo;
}

/* ---------- Arranque ---------- */

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;

  /* =====================================================
     TEMA CLARO / OSCURO
     El tema ya se aplicó en el <head> antes de pintar;
     aquí solo se maneja el botón y se guarda la elección.
     ===================================================== */
  const boton = document.getElementById('btn-tema');

  const sincronizarBoton = () => {
    if (!boton) return;
    const esOscuro = html.classList.contains('modo-contraste');
    boton.textContent = getTextoBoton(esOscuro);
    boton.setAttribute('aria-pressed', esOscuro ? 'true' : 'false');
  };

  sincronizarBoton();

  if (boton) {
    boton.addEventListener('click', () => {
      const esOscuro = html.classList.toggle('modo-contraste');
      try {
        localStorage.setItem('sylax_tema', esOscuro ? 'oscuro' : 'claro');
      } catch (e) {
        // Navegación privada o almacenamiento bloqueado: el tema
        // funciona igual, solo no se recuerda entre páginas.
      }
      sincronizarBoton();
    });
  }

  /* =====================================================
     FORMULARIO DE SOLICITUDES (solo en solicitudes.html)
     ===================================================== */
  const form = document.getElementById('formSolicitud');
  if (!form) return;

  const MAX_CARACTERES = 500;

  const campoNombre   = document.getElementById('nombre');
  const campoEmail    = document.getElementById('email');
  const campoDivision = document.getElementById('division');
  const campoMensaje  = document.getElementById('mensaje');
  const campoAcepto   = document.getElementById('acepto');
  const contador      = document.getElementById('contador-caracteres');
  const mensajeExito  = document.getElementById('mensajeExito');

  /* ---- Contador de caracteres ---- */
  if (campoMensaje && contador) {
    const pintarContador = () => {
      const n = campoMensaje.value.length;
      contador.textContent = formatearContador(n, MAX_CARACTERES);
      contador.classList.toggle('limite-cerca', n >= MAX_CARACTERES * 0.9 && n < MAX_CARACTERES);
      contador.classList.toggle('limite-pasado', n >= MAX_CARACTERES);
    };
    campoMensaje.addEventListener('input', pintarContador);
    pintarContador();
  }

  /* ---- Errores en línea ----
     Antes esto eran alert(), que bloquean la página, no se
     pueden leer con lector de pantalla y se ven de los 90.
     Ahora el error sale debajo del campo que falla. */
  function limpiarError(campo) {
    if (!campo) return;
    campo.classList.remove('campo-error');
    campo.removeAttribute('aria-invalid');
    const previo = campo.parentElement.querySelector('.mensaje-error');
    if (previo) previo.remove();
  }

  function marcarError(campo, texto) {
    if (!campo) return;
    limpiarError(campo);
    campo.classList.add('campo-error');
    campo.setAttribute('aria-invalid', 'true');
    const aviso = document.createElement('p');
    aviso.className = 'mensaje-error';
    aviso.setAttribute('role', 'alert');
    aviso.textContent = texto;
    campo.parentElement.appendChild(aviso);
  }

  // Al corregir un campo se le quita el error de inmediato
  [campoNombre, campoEmail, campoDivision, campoMensaje, campoAcepto].forEach(campo => {
    if (!campo) return;
    const evento = campo.tagName === 'SELECT' || campo.type === 'checkbox' ? 'change' : 'input';
    campo.addEventListener(evento, () => limpiarError(campo));
  });

  /* ---- Envío ---- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let primerFallo = null;
    const fallar = (campo, texto) => {
      marcarError(campo, texto);
      if (!primerFallo) primerFallo = campo;
    };

    if (campoNombre && !validarNombre(campoNombre.value)) {
      fallar(campoNombre, 'Escribe nombre y apellido, con al menos 3 letras cada uno.');
    }
    if (campoEmail && !validarEmail(campoEmail.value)) {
      fallar(campoEmail, 'Introduce un correo electrónico válido (ejemplo: prueba@correo.com).');
    }
    if (campoDivision && !campoDivision.value) {
      fallar(campoDivision, 'Selecciona una división.');
    }
    if (campoMensaje && campoMensaje.value.trim().length < 20) {
      fallar(campoMensaje, 'Cuéntanos un poco más: mínimo 20 caracteres.');
    }
    if (campoAcepto && !campoAcepto.checked) {
      fallar(campoAcepto, 'Debes confirmar que entiendes que es un proyecto académico.');
    }

    if (primerFallo) {
      primerFallo.focus();
      primerFallo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Nada se envía a ningún servidor: es una demostración académica.
    form.classList.add('d-none');
    if (mensajeExito) {
      mensajeExito.classList.remove('d-none');
      mensajeExito.focus?.();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
