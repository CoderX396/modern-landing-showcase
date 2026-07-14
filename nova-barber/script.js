/*
 * ES: Interacciones de la demo: idioma, tema, menú, AOS y tarjetas inclinables.
 * EN: Demo interactions: language, theme, menu, AOS and tilt-enabled cards.
 *
 * ES: El Basic mantiene contacto directo; no hay formulario ni backend.
 * EN: Basic keeps direct contact; there is no form or backend.
 */
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const languageToggle = document.getElementById("language-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.getElementById("site-navigation");
const description = document.querySelector('meta[name="description"]');

const THEME_KEY = "nova-barber-theme";
const LANGUAGE_KEY = "nova-barber-language";
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

/*
 * ES: Evita que el modo file:// detenga todo el JavaScript si bloquea localStorage.
 * EN: Prevents file:// mode from stopping all JavaScript when localStorage is blocked.
 */
const safeStorage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* ES: La preferencia dura solo durante esta vista. EN: Preference lasts for this view only. */
    }
  }
};

const copy = {
  en: {
    htmlLang: "en",
    title: "Nova Barber Studio | Basic Booking Demo",
    description: "Nova Barber Studio is a fictional bilingual barber landing page with a browser-based appointment selector, downloadable ticket and direct confirmation links.",
    skip: "Skip to content",
    navHome: "Home",
    navServices: "Services",
    navBooking: "Book now",
    headerFiverr: "Hire on Fiverr",
    heroEyebrow: "Fictional barber studio · Portfolio concept",
    heroTitle: "Sharp cuts.<br /><span>Zero guesswork.</span>",
    heroText: "A focused neighborhood studio for clean fades, precise beard work, and an appointment that starts on time.",
    heroServices: "Choose a service <span aria-hidden=\"true\">↓</span>",
    heroReserve: "Open appointment selector",
    detailLocation: "📍 Brooklyn, NY",
    detailHours: "🕘 Mon–Sat",
    detailWalkins: "✂ Walk-ins welcome",
    visualTitle: "Precision in every detail",
    visualKicker: "Local barber studio",
    visualBadge: "Studio 01",
    visualText: "Haircuts · Beard care · Full grooming",
    visualAlt: "Barber giving a precision haircut",
    servicesEyebrow: "Signature services",
    servicesTitle: "Everything you need.<br />Nothing you don’t.",
    servicesText: "Clear service cards help visitors understand the offer before they contact the business.",
    serviceOneTitle: "Precision cut",
    serviceOneText: "Consultation, tailored cut, styling, and finishing.",
    serviceOnePrice: "From $35",
    serviceOneLink: "Book a precision cut",
    serviceTwoTitle: "Fade + beard",
    serviceTwoText: "Clean fade, beard shaping, and a precise line-up.",
    serviceTwoPrice: "From $55",
    serviceTwoLink: "Book a fade and beard service",
    serviceThreeTitle: "Express clean-up",
    serviceThreeText: "Neckline, edges, and beard detail between cuts.",
    serviceThreePrice: "From $25",
    serviceThreeLink: "Book an express clean-up",
    bookingEyebrow: "Appointment flow",
    bookingTitle: "Choose a service. Keep your ticket.",
    bookingText: "Select a service, date, and time. The browser creates a local appointment-request ticket before showing WhatsApp or email.",
    reservationEyebrow: "Step 1 · Choose your appointment",
    reservationTitle: "Choose a service, date, and available time.",
    reservationBadge: "Browser demo",
    reservationText: "Service cards bring visitors here with the service already selected. Confirming creates a ticket stored only in this browser.",
    reservationNameLabel: "Your name",
    reservationNamePlaceholder: "Example: Alex Rivera",
    reservationServiceLabel: "Service",
    reservationServicePrompt: "Select a service",
    reservationDateLabel: "Date",
    reservationTimeLabel: "Available times",
    reservationAvailable: "Available",
    reservationSelected: "Selected",
    reservationUnavailable: "Unavailable",
    reservationStatusTitle: "Choose an available time.",
    reservationStatusText: "Nothing leaves this browser until you choose a contact option.",
    reservationConfirm: "Create appointment ticket",
    reservationReset: "Reset local demo",
    reservationNote: "Stored with localStorage in this browser, not by IP. Availability is not shared with other devices without a backend.",
    reservationSelectedMessage: "Selected time",
    reservationMissing: "Complete your name, service, date, and time.",
    reservationConfirmedTitle: "Appointment-request ticket created.",
    reservationConfirmedMessage: "Save it and contact the studio for final confirmation.",
    reservationResetTitle: "Local demo reset.",
    reservationResetMessage: "All locally stored reservations and the last ticket were removed.",
    reservationTakenTitle: "That time is no longer available.",
    reservationTakenMessage: "Choose another available time.",
    reservationWhatsApp: "Send ticket by WhatsApp ↗",
    reservationEmail: "Send ticket by email ↗",
    ticketEyebrow: "Step 2 · Your ticket",
    ticketTitle: "Appointment request ready",
    ticketIntro: "Save the ticket and send it to the studio to request final confirmation.",
    ticketPending: "Pending studio confirmation",
    ticketDocumentType: "Appointment request ticket",
    ticketCodeLabel: "Ticket",
    ticketNameLabel: "Name",
    ticketServiceLabel: "Service",
    ticketDateLabel: "Date",
    ticketTimeLabel: "Time",
    ticketLocationLabel: "Location",
    ticketPunctuality: "Please arrive 10 minutes early. The appointment is final only after the studio confirms it.",
    ticketDownload: "Download PNG ticket",
    ticketPrint: "Print ticket",
    ticketContactTitle: "Confirm it with the studio",
    ticketContactText: "The ticket becomes a real appointment only after the studio accepts the request.",
    ticketDownloadError: "The ticket image could not be generated in this browser.",
    scopeEyebrow: "Basic package boundary",
    scopeTitle: "A polished browser flow, without backend complexity.",
    scopeText: "The selector and ticket run entirely in the browser. Shared real-time availability and automatic confirmations require a backend.",
    videoEyebrow: "Barbershop atmosphere",
    videoTitle: "Real barbering. Just press play.",
    videoText: "A real barbershop B-roll video with music gives the page a stronger sense of place than a static banner.",
    videoNote: "Replace this embed with a licensed video supplied by the client.",
    videoFallback: "Your browser does not support the video element.",
    videoLabel: "Cinematic barbershop video",
    videoLocalTitle: "Local preview detected",
    videoLocalText: "YouTube needs a web origin to load inside an iframe.",
    videoOpen: "Open video on YouTube ↗",
    locationEyebrow: "Visit the studio",
    locationTitle: "A simple route to a sharper look.",
    locationText: "Fictional demo location in Brooklyn, New York. Replace the map and address with the client's real details.",
    mapLabel: "Fictional demo location",
    footerCopy: "Fictional portfolio concept by Ariel FyB Labs. Basic scope: 3 sections, responsive design, browser-only appointment selector, downloadable ticket, direct confirmation links, basic SEO, and clean source code.",
    footerFiverr: "Hire on Fiverr",
    footerGitHub: "View GitHub Portfolio",
    // TODO PÁGINA CENTRAL: cambiar después este texto a "Main Portfolio" si corresponde.
    footerCloudflare: "Cloudflare Demo",
    floatingBooking: "Open appointment selector",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    switchLanguage: "Cambiar a español",
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    themeAutoAria: "Theme set to automatic. Change theme.",
    themeLightAria: "Theme set to light. Change theme.",
    themeDarkAria: "Theme set to dark. Change theme."
  },
  es: {
    htmlLang: "es",
    title: "Nova Barber Studio | Demo Basic de Reservas",
    description: "Nova Barber Studio es una landing page ficticia y bilingüe para barbería con reservador local, ticket descargable y enlaces de confirmación directa.",
    skip: "Ir al contenido",
    navHome: "Inicio",
    navServices: "Servicios",
    navBooking: "Reservar",
    headerFiverr: "Contrátame en Fiverr",
    heroEyebrow: "Estudio de barbería ficticio · Concepto de portafolio",
    heroTitle: "Cortes precisos.<br /><span>Sin improvisar.</span>",
    heroText: "Un estudio local enfocado en fades limpios, barba detallada y citas que empiezan a tiempo.",
    heroServices: "Elegir un servicio <span aria-hidden=\"true\">↓</span>",
    heroReserve: "Abrir el reservador",
    detailLocation: "📍 Brooklyn, NY",
    detailHours: "🕘 Lun–Sáb",
    detailWalkins: "✂ Atención sin cita",
    visualTitle: "Precisión en cada detalle",
    visualKicker: "Estudio de barbería local",
    visualBadge: "Estudio 01",
    visualText: "Cortes · Cuidado de barba · Grooming completo",
    visualAlt: "Barbero realizando un corte de precisión",
    servicesEyebrow: "Servicios principales",
    servicesTitle: "Todo lo que necesitas.<br />Nada de más.",
    servicesText: "Las tarjetas claras ayudan a entender la oferta antes de contactar al negocio.",
    serviceOneTitle: "Corte de precisión",
    serviceOneText: "Consulta, corte personalizado, estilizado y acabado final.",
    serviceOnePrice: "Desde $35",
    serviceOneLink: "Reservar corte de precisión",
    serviceTwoTitle: "Fade + barba",
    serviceTwoText: "Fade limpio, diseño de barba y contornos precisos.",
    serviceTwoPrice: "Desde $55",
    serviceTwoLink: "Reservar fade y barba",
    serviceThreeTitle: "Retoque express",
    serviceThreeText: "Nuca, contornos y detalle de barba entre cortes.",
    serviceThreePrice: "Desde $25",
    serviceThreeLink: "Reservar retoque express",
    bookingEyebrow: "Flujo de reserva",
    bookingTitle: "Elige un servicio. Conserva tu ticket.",
    bookingText: "Selecciona servicio, fecha y hora. El navegador crea un ticket local de solicitud antes de mostrar WhatsApp o correo.",
    reservationEyebrow: "Paso 1 · Elige tu cita",
    reservationTitle: "Elige servicio, fecha y una hora disponible.",
    reservationBadge: "Demo en navegador",
    reservationText: "Las tarjetas de servicio traen al visitante hasta aquí con el servicio seleccionado. Al confirmar se crea un ticket guardado solo en este navegador.",
    reservationNameLabel: "Tu nombre",
    reservationNamePlaceholder: "Ejemplo: Alex Rivera",
    reservationServiceLabel: "Servicio",
    reservationServicePrompt: "Selecciona un servicio",
    reservationDateLabel: "Fecha",
    reservationTimeLabel: "Horas disponibles",
    reservationAvailable: "Disponible",
    reservationSelected: "Seleccionada",
    reservationUnavailable: "No disponible",
    reservationStatusTitle: "Elige una hora disponible.",
    reservationStatusText: "Nada sale de este navegador hasta que elijas una opción de contacto.",
    reservationConfirm: "Crear ticket de cita",
    reservationReset: "Restablecer demo local",
    reservationNote: "Se guarda con localStorage en este navegador, no por IP. Sin backend, la disponibilidad no se comparte con otros dispositivos.",
    reservationSelectedMessage: "Hora seleccionada",
    reservationMissing: "Completa tu nombre, servicio, fecha y hora.",
    reservationConfirmedTitle: "Ticket de solicitud creado.",
    reservationConfirmedMessage: "Guárdalo y contacta al estudio para la confirmación final.",
    reservationResetTitle: "Demo local restablecida.",
    reservationResetMessage: "Se eliminaron las reservas guardadas y el último ticket de este navegador.",
    reservationTakenTitle: "Esa hora ya no está disponible.",
    reservationTakenMessage: "Elige otra hora disponible.",
    reservationWhatsApp: "Enviar ticket por WhatsApp ↗",
    reservationEmail: "Enviar ticket por correo ↗",
    ticketEyebrow: "Paso 2 · Tu ticket",
    ticketTitle: "Solicitud de cita preparada",
    ticketIntro: "Guarda el ticket y envíalo al estudio para solicitar la confirmación final.",
    ticketPending: "Pendiente de confirmación del estudio",
    ticketDocumentType: "Ticket de solicitud de cita",
    ticketCodeLabel: "Ticket",
    ticketNameLabel: "Nombre",
    ticketServiceLabel: "Servicio",
    ticketDateLabel: "Fecha",
    ticketTimeLabel: "Hora",
    ticketLocationLabel: "Lugar",
    ticketPunctuality: "Llega 10 minutos antes. La cita solo es definitiva cuando el estudio la confirma.",
    ticketDownload: "Descargar ticket PNG",
    ticketPrint: "Imprimir ticket",
    ticketContactTitle: "Confírmalo con el estudio",
    ticketContactText: "El ticket se convierte en una cita real únicamente cuando el estudio acepta la solicitud.",
    ticketDownloadError: "Este navegador no pudo generar la imagen del ticket.",
    scopeEyebrow: "Límite del paquete Basic",
    scopeTitle: "Un flujo pulido en el navegador, sin la complejidad de un backend.",
    scopeText: "El selector y el ticket funcionan completamente en el navegador. La disponibilidad compartida y las confirmaciones automáticas requieren backend.",
    videoEyebrow: "Ambiente de barbería",
    videoTitle: "Barbería real. Solo dale play.",
    videoText: "Un video real de barbería con música transmite mucho mejor el ambiente que un banner estático.",
    videoNote: "Sustituye este embed por un video con licencia suministrado por el cliente.",
    videoFallback: "Tu navegador no admite el elemento de video.",
    videoLabel: "Video cinematográfico de barbería",
    videoLocalTitle: "Vista local detectada",
    videoLocalText: "YouTube necesita un origen web para cargar dentro de un iframe.",
    videoOpen: "Abrir video en YouTube ↗",
    locationEyebrow: "Visita el estudio",
    locationTitle: "Una ruta sencilla hacia un look más limpio.",
    locationText: "Ubicación ficticia en Brooklyn, Nueva York. Sustituye el mapa y la dirección por los datos reales del cliente.",
    mapLabel: "Ubicación ficticia del demo",
    footerCopy: "Concepto ficticio de portafolio por Ariel FyB Labs. Alcance Basic: 3 secciones, diseño responsive, reservador local, ticket descargable, confirmación directa, SEO básico y código fuente limpio.",
    footerFiverr: "Contrátame en Fiverr",
    footerGitHub: "Ver portafolio en GitHub",
    // TODO PÁGINA CENTRAL: cambiar después este texto a "Portafolio central" si corresponde.
    footerCloudflare: "Demo en Cloudflare",
    floatingBooking: "Abrir el reservador",
    openMenu: "Abrir navegación",
    closeMenu: "Cerrar navegación",
    switchLanguage: "Switch to English",
    themeAuto: "Auto",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeAutoAria: "Tema automático activado. Cambiar tema.",
    themeLightAria: "Tema claro activado. Cambiar tema.",
    themeDarkAria: "Tema oscuro activado. Cambiar tema."
  }
};

function getSystemTheme() {
  return systemTheme.matches ? "dark" : "light";
}

function applyTheme(preference) {
  const actualTheme = preference === "auto" ? getSystemTheme() : preference;
  root.dataset.theme = actualTheme;
  root.dataset.themePreference = preference;
  safeStorage.set(THEME_KEY, preference);
  updateThemeButton();
}

function updateThemeButton() {
  const language = root.dataset.language || "en";
  const text = copy[language];
  const preference = root.dataset.themePreference || "auto";
  const icon = preference === "dark" ? "☾" : preference === "light" ? "☀" : "◐";
  const label = preference === "dark" ? text.themeDark : preference === "light" ? text.themeLight : text.themeAuto;
  const aria = preference === "dark" ? text.themeDarkAria : preference === "light" ? text.themeLightAria : text.themeAutoAria;

  themeToggle.innerHTML = `<span aria-hidden="true" class="theme-icon">${icon}</span><span class="theme-label">${label}</span>`;
  themeToggle.setAttribute("aria-label", aria);
  themeToggle.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
}

function applyLanguage(language) {
  const text = copy[language];
  root.lang = text.htmlLang;
  root.dataset.language = language;
  document.title = text.title;
  description.setAttribute("content", text.description);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = text[element.dataset.i18n];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = text[element.dataset.i18nHtml];
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", text[element.dataset.i18nAria]);
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.setAttribute("alt", text[element.dataset.i18nAlt]);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", text[element.dataset.i18nPlaceholder]);
  });

  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.setAttribute("title", text[element.dataset.i18nTitle]);
  });

  const isSpanish = language === "es";
  languageToggle.querySelector(".language-label").textContent = isSpanish ? "EN" : "ES";
  languageToggle.setAttribute("aria-label", text.switchLanguage);
  menuToggle.setAttribute("aria-label", menuToggle.getAttribute("aria-expanded") === "true" ? text.closeMenu : text.openMenu);
  updateThemeButton();
  safeStorage.set(LANGUAGE_KEY, language);
  window.refreshBookingDemoLanguage?.();
}

/*
 * ES: Reserva la altura mayor entre inglés y español para evitar saltos de diseño.
 * EN: Reserves the larger English/Spanish height to prevent layout shifts.
 */
function stabilizeBilingualLayout() {
  const currentLanguage = root.dataset.language || "en";

  document.querySelectorAll("[data-i18n-stable]").forEach((element) => {
    const textKey = element.dataset.i18n;
    const htmlKey = element.dataset.i18nHtml;
    const key = textKey || htmlKey;
    if (!key) return;

    element.style.removeProperty("min-height");
    let largestHeight = 0;

    ["en", "es"].forEach((language) => {
      if (htmlKey) element.innerHTML = copy[language][key];
      else element.textContent = copy[language][key];
      largestHeight = Math.max(largestHeight, Math.ceil(element.getBoundingClientRect().height));
    });

    if (htmlKey) element.innerHTML = copy[currentLanguage][key];
    else element.textContent = copy[currentLanguage][key];
    element.style.minHeight = `${largestHeight}px`;
  });
}

const savedLanguage = safeStorage.get(LANGUAGE_KEY);
const browserLanguage = (navigator.language || "en").toLowerCase();
const startingLanguage = savedLanguage || (browserLanguage.startsWith("es") ? "es" : "en");
const savedTheme = safeStorage.get(THEME_KEY) || "auto";

applyLanguage(startingLanguage);
applyTheme(savedTheme);
stabilizeBilingualLayout();

let layoutTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(layoutTimer);
  layoutTimer = window.setTimeout(() => {
    stabilizeBilingualLayout();
    if (window.AOS) AOS.refreshHard();
  }, 160);
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
 * ES: Respaldo local para animar al entrar en pantalla si AOS no carga.
 * EN: Local fallback that reveals elements when AOS does not load.
 */
function startScrollFallback() {
  const revealTargets = document.querySelectorAll("[data-aos]");
  root.classList.add("scroll-fallback");

  revealTargets.forEach((element) => {
    const delay = Number(element.dataset.aosDelay || 0);
    element.style.setProperty("--scroll-delay", `${delay}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-scroll-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-scroll-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -48px" });

  revealTargets.forEach((element) => revealObserver.observe(element));
}

/*
 * ES: Segunda garantía: activa la misma clase de AOS al entrar en pantalla.
 * EN: Second guarantee: activates the same AOS class when an item enters the viewport.
 */
function startAosFailsafe() {
  const revealTargets = document.querySelectorAll("[data-aos]");

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("aos-animate"));
    return;
  }

  const aosObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("aos-animate");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -24px" });

  revealTargets.forEach((element) => aosObserver.observe(element));
}

/*
 * ES: Inicia AOS local y recalcula posiciones después de cargar imágenes y video.
 * EN: Starts local AOS and refreshes positions after images and video load.
 */
if (window.AOS) {
  try {
    root.classList.add("aos-ready");
    AOS.init({
      duration: 900,
      easing: "ease-out-quart",
      offset: 90,
      once: true
    });
    startAosFailsafe();

    const refreshAos = () => AOS.refreshHard();
    if (document.readyState === "complete") {
      requestAnimationFrame(refreshAos);
    } else {
      window.addEventListener("load", refreshAos, { once: true });
    }
  } catch (error) {
    root.classList.remove("aos-ready");
    startScrollFallback();
  }
} else if (!prefersReducedMotion) {
  startScrollFallback();
}

if (window.location.protocol === "file:") {
  document.querySelector(".video-frame")?.classList.add("is-local");
}

if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-x", `${(y * -5).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

themeToggle.addEventListener("click", () => {
  const current = root.dataset.themePreference || "auto";
  const next = current === "auto" ? "light" : current === "light" ? "dark" : "auto";
  applyTheme(next);
});

languageToggle.addEventListener("click", () => {
  applyLanguage((root.dataset.language || "en") === "en" ? "es" : "en");
});

systemTheme.addEventListener("change", () => {
  if ((root.dataset.themePreference || "auto") === "auto") {
    root.dataset.theme = getSystemTheme();
    updateThemeButton();
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  const text = copy[root.dataset.language || "en"];
  menuToggle.setAttribute("aria-label", isOpen ? text.closeMenu : text.openMenu);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", copy[root.dataset.language || "en"].openMenu);
  });
});

/*
 * ES: Reservador y ticket local. No usa IP, backend ni base de datos.
 * EN: Local appointment selector and ticket. It uses no IP, backend or database.
 */
(() => {
  const form = document.getElementById("reservation-form");
  if (!form) return;

  const nameInput = document.getElementById("reservation-name");
  const serviceInput = document.getElementById("reservation-service");
  const dateInput = document.getElementById("reservation-date");
  const slotsContainer = document.getElementById("time-slots");
  const statusBox = document.getElementById("reservation-status");
  const resetButton = document.getElementById("reset-reservations");
  const ticketPanel = document.getElementById("ticket-panel");
  const whatsappButton = document.getElementById("reservation-whatsapp");
  const emailButton = document.getElementById("reservation-email");
  const downloadButton = document.getElementById("download-ticket");
  const printButton = document.getElementById("print-ticket");

  const ticketCode = document.getElementById("ticket-code");
  const ticketName = document.getElementById("ticket-name");
  const ticketService = document.getElementById("ticket-service");
  const ticketDate = document.getElementById("ticket-date");
  const ticketTime = document.getElementById("ticket-time");
  const ticketLocation = document.getElementById("ticket-location");

  const RESERVATION_KEY = "nova-barber-demo-reservations-v3";
  const LAST_TICKET_KEY = "nova-barber-demo-last-ticket-v2";
  const phoneNumber = "15550123456";
  const studioEmail = "hello@novabarber.example";
  const studioLocation = "125 Atlantic Ave, Brooklyn, NY";
  const times = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "13:00",
    "13:30", "14:00", "14:30", "15:00",
    "15:30", "16:00", "16:30", "17:00"
  ];
  const fixedUnavailable = new Set(["10:30", "14:00"]);

  let selectedTime = "";
  let lastTicket = loadLastTicket();

  function text() {
    return copy[root.dataset.language || "en"];
  }

  function readJson(key, fallback) {
    const raw = safeStorage.get(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function getReservations() {
    const reservations = readJson(RESERVATION_KEY, {});
    return reservations && typeof reservations === "object" ? reservations : {};
  }

  function saveReservations(reservations) {
    safeStorage.set(RESERVATION_KEY, JSON.stringify(reservations));
  }

  function loadLastTicket() {
    const ticket = readJson(LAST_TICKET_KEY, null);
    return ticket && ticket.code && ticket.name ? ticket : null;
  }

  function saveLastTicket(ticket) {
    safeStorage.set(LAST_TICKET_KEY, ticket ? JSON.stringify(ticket) : "");
  }

  function inputDate(date) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function setDefaultDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    dateInput.min = inputDate(today);
    if (!dateInput.value) dateInput.value = inputDate(tomorrow);
  }

  function displayDate(value) {
    if (!value) return "—";
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat(root.dataset.language === "es" ? "es-DO" : "en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function reservedForDate(date) {
    return new Set(getReservations()[date] || []);
  }

  function unavailable(time) {
    return fixedUnavailable.has(time) || reservedForDate(dateInput.value).has(time);
  }

  function setStatus(title, message, state = "") {
    statusBox.className = `reservation-status${state ? ` is-${state}` : ""}`;
    statusBox.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  }

  function serviceLabel(value) {
    const option = serviceInput.querySelector(`option[value="${value}"]`);
    return option ? option.textContent.trim() : value;
  }

  function ticketId() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let random = "";

    if (window.crypto?.getRandomValues) {
      const bytes = new Uint8Array(6);
      window.crypto.getRandomValues(bytes);
      bytes.forEach((byte) => {
        random += alphabet[byte % alphabet.length];
      });
    } else {
      for (let index = 0; index < 6; index += 1) {
        random += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }

    return `NB-${new Date().getFullYear().toString().slice(-2)}-${random}`;
  }

  function contactMessage(ticket) {
    const service = serviceLabel(ticket.service);
    const date = displayDate(ticket.date);
    const lines = root.dataset.language === "es"
      ? [
          "Hola Nova Barber. Quiero solicitar la confirmación de esta cita:",
          "",
          `Ticket: ${ticket.code}`,
          `Nombre: ${ticket.name}`,
          `Servicio: ${service}`,
          `Fecha: ${date}`,
          `Hora: ${ticket.time}`,
          `Lugar: ${studioLocation}`
        ]
      : [
          "Hi Nova Barber. I would like to request confirmation for this appointment:",
          "",
          `Ticket: ${ticket.code}`,
          `Name: ${ticket.name}`,
          `Service: ${service}`,
          `Date: ${date}`,
          `Time: ${ticket.time}`,
          `Location: ${studioLocation}`
        ];

    return lines.join("\n");
  }

  function updateContactLinks(ticket) {
    if (!ticket) return;

    const subject = root.dataset.language === "es"
      ? `Solicitud de cita ${ticket.code}`
      : `Appointment request ${ticket.code}`;
    const message = contactMessage(ticket);

    whatsappButton.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    emailButton.href =
      `mailto:${studioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }

  function renderTicket(ticket) {
    if (!ticket) {
      ticketPanel.hidden = true;
      return;
    }

    ticketCode.textContent = ticket.code;
    ticketName.textContent = ticket.name;
    ticketService.textContent = serviceLabel(ticket.service);
    ticketDate.textContent = displayDate(ticket.date);
    ticketTime.textContent = ticket.time;
    ticketLocation.textContent = studioLocation;
    updateContactLinks(ticket);
    ticketPanel.hidden = false;
  }

  function renderSlots() {
    slotsContainer.innerHTML = "";
    const languageText = text();

    times.forEach((time) => {
      const isUnavailable = unavailable(time);
      const isSelected = selectedTime === time && !isUnavailable;
      const button = document.createElement("button");

      button.type = "button";
      button.className = "time-slot";
      button.textContent = time;
      button.disabled = isUnavailable;
      button.setAttribute("aria-pressed", String(isSelected));

      if (isUnavailable) {
        button.classList.add("is-unavailable");
        button.setAttribute("aria-label", `${time} · ${languageText.reservationUnavailable}`);
      } else if (isSelected) {
        button.classList.add("is-selected");
        button.setAttribute("aria-label", `${time} · ${languageText.reservationSelected}`);
      } else {
        button.setAttribute("aria-label", `${time} · ${languageText.reservationAvailable}`);
      }

      button.addEventListener("click", () => {
        selectedTime = time;
        renderSlots();
        setStatus(languageText.reservationSelectedMessage, time, "selected");
      });

      slotsContainer.appendChild(button);
    });
  }

  function restoreStatus() {
    const languageText = text();

    if (lastTicket) {
      setStatus(
        languageText.reservationConfirmedTitle,
        `${lastTicket.code} · ${languageText.reservationConfirmedMessage}`,
        "success"
      );
    } else if (selectedTime) {
      setStatus(languageText.reservationSelectedMessage, selectedTime, "selected");
    } else {
      setStatus(languageText.reservationStatusTitle, languageText.reservationStatusText);
    }
  }

  function wrapText(context, value, x, y, maxWidth, lineHeight, maxLines = 2) {
    const words = String(value).split(/\s+/);
    let line = "";
    let lineIndex = 0;

    words.forEach((word, index) => {
      if (lineIndex >= maxLines) return;
      const trial = line ? `${line} ${word}` : word;

      if (context.measureText(trial).width > maxWidth && line) {
        context.fillText(line, x, y + lineIndex * lineHeight);
        line = word;
        lineIndex += 1;
      } else {
        line = trial;
      }

      if (index === words.length - 1 && lineIndex < maxLines) {
        context.fillText(line, x, y + lineIndex * lineHeight);
      }
    });
  }

  function ticketCanvas(ticket) {
    const languageText = text();
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 860;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.fillStyle = "#0e172a";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#f7eee1";
    context.fillRect(70, 65, 1260, 730);
    context.fillStyle = "#f15a2a";
    context.fillRect(70, 65, 18, 730);

    context.fillStyle = "#172033";
    context.font = "900 58px Arial, sans-serif";
    context.fillText("NOVA", 135, 155);
    context.fillStyle = "#f15a2a";
    context.fillText("BARBER", 325, 155);

    context.fillStyle = "#5b6473";
    context.font = "700 24px Arial, sans-serif";
    context.fillText(languageText.ticketDocumentType.toUpperCase(), 138, 198);

    context.fillStyle = "#172033";
    context.font = "900 42px monospace";
    context.textAlign = "right";
    context.fillText(ticket.code, 1260, 150);
    context.fillStyle = "#5b6473";
    context.font = "700 20px Arial, sans-serif";
    context.fillText(languageText.ticketPending.toUpperCase(), 1260, 190);
    context.textAlign = "left";

    const fields = [
      [languageText.ticketNameLabel, ticket.name],
      [languageText.ticketServiceLabel, serviceLabel(ticket.service)],
      [languageText.ticketDateLabel, displayDate(ticket.date)],
      [languageText.ticketTimeLabel, ticket.time],
      [languageText.ticketLocationLabel, studioLocation]
    ];

    let y = 300;
    fields.forEach(([label, value], index) => {
      context.fillStyle = "#b2452a";
      context.font = "900 20px Arial, sans-serif";
      context.fillText(label.toUpperCase(), 140, y);
      context.fillStyle = "#172033";
      context.font = index === fields.length - 1
        ? "700 30px Arial, sans-serif"
        : "800 34px Arial, sans-serif";
      wrapText(context, value, 140, y + 45, 1080, 38, index === fields.length - 1 ? 2 : 1);
      y += index === fields.length - 1 ? 125 : 100;
    });

    context.fillStyle = "#112447";
    context.fillRect(118, 660, 1165, 92);
    context.fillStyle = "#fff9ee";
    context.font = "800 25px Arial, sans-serif";
    wrapText(context, languageText.ticketPunctuality, 155, 704, 1085, 31, 2);

    return canvas;
  }

  function downloadTicket() {
    if (!lastTicket) return;

    const canvas = ticketCanvas(lastTicket);
    if (!canvas) {
      setStatus(text().ticketDownloadError, text().reservationStatusText, "error");
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = `nova-barber-${lastTicket.code}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    }, "image/png");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const languageText = text();
    const name = nameInput.value.trim();
    const service = serviceInput.value;
    const date = dateInput.value;

    if (!name || !service || !date || !selectedTime) {
      setStatus(languageText.reservationMissing, languageText.reservationStatusText, "error");
      return;
    }

    if (unavailable(selectedTime)) {
      selectedTime = "";
      renderSlots();
      setStatus(languageText.reservationTakenTitle, languageText.reservationTakenMessage, "error");
      return;
    }

    const reservations = getReservations();
    const day = new Set(reservations[date] || []);
    day.add(selectedTime);
    reservations[date] = [...day].sort();
    saveReservations(reservations);

    lastTicket = {
      code: ticketId(),
      name,
      service,
      date,
      time: selectedTime,
      createdAt: new Date().toISOString()
    };
    saveLastTicket(lastTicket);

    selectedTime = "";
    renderSlots();
    renderTicket(lastTicket);
    restoreStatus();
    ticketPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  resetButton.addEventListener("click", () => {
    const languageText = text();
    safeStorage.set(RESERVATION_KEY, "{}");
    safeStorage.set(LAST_TICKET_KEY, "");
    selectedTime = "";
    lastTicket = null;
    renderTicket(null);
    renderSlots();
    setStatus(languageText.reservationResetTitle, languageText.reservationResetMessage, "success");
  });

  dateInput.addEventListener("change", () => {
    selectedTime = "";
    renderSlots();
    restoreStatus();
  });

  downloadButton.addEventListener("click", downloadTicket);
  printButton.addEventListener("click", () => {
    if (lastTicket) window.print();
  });

  document.querySelectorAll("[data-booking-service]").forEach((card) => {
    card.addEventListener("click", () => {
      serviceInput.value = card.dataset.bookingService || "";
      window.setTimeout(() => serviceInput.focus({ preventScroll: true }), 450);
    });
  });

  window.refreshBookingDemoLanguage = () => {
    renderSlots();
    renderTicket(lastTicket);
    restoreStatus();
  };

  setDefaultDate();

  if (lastTicket) {
    nameInput.value = lastTicket.name || "";
    serviceInput.value = lastTicket.service || "";
    dateInput.value = lastTicket.date || dateInput.value;
  }

  renderSlots();
  renderTicket(lastTicket);
  restoreStatus();
})();

