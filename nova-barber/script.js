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
    title: "Nova Barber Studio | Basic Landing Page Demo",
    description: "Nova Barber Studio is a fictional, bilingual, responsive barber landing page concept with direct contact CTAs.",
    skip: "Skip to content",
    navHome: "Home",
    navServices: "Services",
    navBooking: "Book now",
    headerFiverr: "Hire on Fiverr",
    heroEyebrow: "Fictional barber studio · Portfolio concept",
    heroTitle: "Sharp cuts.<br /><span>Zero guesswork.</span>",
    heroText: "A focused neighborhood studio for clean fades, precise beard work, and an appointment that starts on time.",
    heroWhatsApp: "Book on WhatsApp <span aria-hidden=\"true\">↗</span>",
    heroEmail: "Email the studio",
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
    bookingEyebrow: "Direct contact",
    bookingTitle: "Ready when you are.",
    bookingText: "Choose the contact channel that works for you. This Basic demo keeps booking direct: WhatsApp, email, and social links.",
    bookingWhatsApp: "Message on WhatsApp <span aria-hidden=\"true\">↗</span>",
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
    footerCopy: "Fictional portfolio concept by Ariel FyB Labs. Basic scope: 3 sections, responsive design, direct-contact CTAs, social links, basic on-page SEO, and clean source code.",
    footerFiverr: "Hire on Fiverr",
    footerGitHub: "View GitHub Portfolio",
    footerCloudflare: "Cloudflare Demo",
    floatingWhatsApp: "Book through WhatsApp",
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
    title: "Nova Barber Studio | Demo de Landing Page Basic",
    description: "Nova Barber Studio es un concepto ficticio de landing page bilingüe y responsive para barbería con CTAs de contacto directo.",
    skip: "Ir al contenido",
    navHome: "Inicio",
    navServices: "Servicios",
    navBooking: "Reservar",
    headerFiverr: "Contrátame en Fiverr",
    heroEyebrow: "Estudio de barbería ficticio · Concepto de portafolio",
    heroTitle: "Cortes precisos.<br /><span>Sin improvisar.</span>",
    heroText: "Un estudio local enfocado en fades limpios, barba detallada y citas que empiezan a tiempo.",
    heroWhatsApp: "Reservar por WhatsApp <span aria-hidden=\"true\">↗</span>",
    heroEmail: "Escribir al estudio",
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
    bookingEyebrow: "Contacto directo",
    bookingTitle: "Listo cuando tú lo estés.",
    bookingText: "Elige el canal que prefieras. Este demo Basic mantiene la reserva directa: WhatsApp, correo y enlaces sociales.",
    bookingWhatsApp: "Escribir por WhatsApp <span aria-hidden=\"true\">↗</span>",
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
    footerCopy: "Concepto ficticio de portafolio por Ariel FyB Labs. Alcance Basic: 3 secciones, diseño responsive, CTAs de contacto directo, enlaces sociales, SEO básico en la página y código fuente limpio.",
    footerFiverr: "Contrátame en Fiverr",
    footerGitHub: "Ver portafolio en GitHub",
    footerCloudflare: "Demo en Cloudflare",
    floatingWhatsApp: "Reservar por WhatsApp",
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

  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.setAttribute("title", text[element.dataset.i18nTitle]);
  });

  const isSpanish = language === "es";
  languageToggle.querySelector(".language-label").textContent = isSpanish ? "EN" : "ES";
  languageToggle.setAttribute("aria-label", text.switchLanguage);
  menuToggle.setAttribute("aria-label", menuToggle.getAttribute("aria-expanded") === "true" ? text.closeMenu : text.openMenu);
  updateThemeButton();
  safeStorage.set(LANGUAGE_KEY, language);
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
