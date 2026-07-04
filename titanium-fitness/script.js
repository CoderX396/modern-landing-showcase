/* ============================================
   TITANIUM FITNESS — MAIN SCRIPT
   1. Translations (EN/ES)
   2. Dark/Light toggle
   3. EmailJS lead form (comment field, min/max length, phone auto-format,
      split first/last name, server-side rate-limit with a live countdown)
   4. Auto-fill plan from pricing cards
 
   EN: Comments throughout this file are bilingual (EN/ES) for the GitHub
       portfolio so any reader can follow the "why", not just the "what".
   ES: Los comentarios de este archivo son bilingües (EN/ES) para el
       portfolio de GitHub, así cualquiera puede seguir el "por qué" y no
       solo el "qué".
   ============================================ */
 
// =====================
// 1. TRANSLATIONS (EN / ES)
// =====================
const html = document.documentElement;
const themeBtn = document.getElementById('btn-tema');
const langBtn = document.getElementById('btn-idioma');
const waLink = document.querySelector('.whatsapp-float');
 
const translations = {
    en: {
        page_title: "Titanium Fitness | Forge Your Absolute Power",
        nav_equipment: "Equipment",
        nav_plans: "Memberships",
        nav_contact: "Free Pass",
        lang_btn_aria: "Switch language",
        theme_btn_aria: "Toggle theme",
        theme_dark: "🌙 Dark",
        theme_light: "☀️ Light",
        hero_title: "Forge Your<br><span>Absolute Power</span>",
        hero_subtitle: "High-performance facilities, 5,000kg in free weights, and certified coaches ready to break your plateau.",
        hero_cta: "Claim Your Free Day Pass",
        hero_img_alt: "Rack of dumbbells in a modern gym",
        video_title: "See Titanium Fitness in Action",
        video_iframe_title: "Titanium Fitness gym footage",
        services_title: "Physical Engineering",
        service1_title: "Strength Zone",
        service1_desc: "Olympic-calibrated power racks, dumbbells up to 60kg, and impact-absorbing lifting platforms.",
        service2_title: "Cross & Hybrid",
        service2_desc: "25m synthetic turf for sled work, assault bikes, Concept2 rowers, and a professional gymnastics rig.",
        service3_title: "Recovery",
        service3_desc: "Programmable ice immersion tubs and percussion massage guns, free to use in the locker rooms.",
        plans_title: "Invest in Your Biology",
        plan_base_title: "Base Plan",
        per_month: "/mo",
        plan_base_f1: "Access 6:00 AM – 4:00 PM",
        plan_base_f2: "Weights and cardio area",
        plan_base_f3: "Showers and lockers",
        plan_base_cta: "Select Base",
        plan_vip_badge: "Recommended",
        plan_vip_title: "Total VIP Plan",
        plan_vip_f1: "24/7 access with biometric scan",
        plan_vip_f2: "All group classes included",
        plan_vip_f3: "1 InBody body scan per month",
        plan_vip_f4: "Guest pass every Friday",
        plan_vip_cta: "Select VIP",
        contact_title: "Claim Your Free Pass Today",
        contact_subtitle: "Enter your details and we'll email you your access pass.",
        contact_demo_notice: "This is a portfolio demo — feel free to use fictional data, no need to enter anything real.",
        form_name_ph: "Full name",
        form_firstname_ph: "First name",
        form_lastname_ph: "Last name",
        form_email_ph: "Your email address",
        form_phone_ph: "WhatsApp number",
        form_plan_ph: "Which plan interests you?",
        form_goal_ph: "What's your main goal?",
        form_goal_fatloss: "Body recomposition (Fat loss)",
        form_goal_muscle: "Hypertrophy (Build muscle)",
        form_goal_health: "Aerobic capacity / General health",
        form_submit: "Generate My Pass",
        form_submit_sending: "Sending...",
        form_submit_error: "Error: Could not send. Try again.",
        form_submit_network_error: "Network error. Check connection.",
        form_submit_rate_limited: "You've reached the submission limit for now. Please try again later, or reach us directly on WhatsApp.",
        lead_attempts_left: "You have {n} submission(s) left today.",
        lead_reset_in: "You can try again in {time}.",
        form_comment_ph: "What do you think of this page, or is there anything you'd like to tell us?",
        form_comment_chars: "characters",
        form_comment_min_hint: "(min. 200)",
        form_comment_error_missing: "Please tell us your comment before submitting.",
        form_comment_error_too_short: "Please write at least {min} characters so we can understand your comment.",
        form_comment_error_too_long: "1000 characters max — please shorten your comment.",
        success_title: "Request received!",
        success_sub: "Check your email — we've sent your selection. We'll be in touch soon. See you at the gym.",
        footer_text: "© 2026 <span>TitaniumFit</span>. All rights reserved. — Built by <span>ArielSyncLabs</span>",
        whatsapp_aria: "Chat on WhatsApp",
        whatsapp_message: "Hi! I'd like to know more about Titanium Fitness",
        fiverr_button: "Hire Me on Fiverr",
        github_button: "View GitHub Portfolio",
        livedemo_button: "Live Demo (Cloudflare)",
        fiverr_header_button: "Fiverr",
        fiverr_header_aria: "See my services on Fiverr",
    },
    es: {
        page_title: "Titanium Fitness | Forja Tu Poder Absoluto",
        nav_equipment: "Equipamiento",
        nav_plans: "Membresías",
        nav_contact: "Pase Gratis",
        lang_btn_aria: "Cambiar idioma",
        theme_btn_aria: "Cambiar tema",
        theme_dark: "🌙 Oscuro",
        theme_light: "☀️ Claro",
        hero_title: "Forja Tu<br><span>Poder Absoluto</span>",
        hero_subtitle: "Instalaciones de alto rendimiento, 5.000 kg en pesas libres y entrenadores certificados listos para romper tu estancamiento.",
        hero_cta: "Reclama Tu Pase Gratis de Un Día",
        hero_img_alt: "Estante de mancuernas en un gimnasio moderno",
        video_title: "Mira Titanium Fitness en Acción",
        video_iframe_title: "Imágenes del gimnasio Titanium Fitness",
        services_title: "Ingeniería Física",
        service1_title: "Zona de Fuerza",
        service1_desc: "Racks de potencia calibrados olímpicamente, mancuernas de hasta 60kg y plataformas de levantamiento que absorben impacto.",
        service2_title: "Cross e Híbrido",
        service2_desc: "25m de césped sintético para trabajo con trineo, bicicletas assault, remos Concept2 y un rig profesional de gimnasia.",
        service3_title: "Recuperación",
        service3_desc: "Tinas de inmersión en hielo programables y pistolas de masaje por percusión, de uso gratuito en los vestidores.",
        plans_title: "Invierte en Tu Biología",
        plan_base_title: "Plan Base",
        per_month: "/mes",
        plan_base_f1: "Acceso 6:00 AM – 4:00 PM",
        plan_base_f2: "Área de pesas y cardio",
        plan_base_f3: "Duchas y casilleros",
        plan_base_cta: "Elegir Base",
        plan_vip_badge: "Recomendado",
        plan_vip_title: "Plan VIP Total",
        plan_vip_f1: "Acceso 24/7 con escaneo biométrico",
        plan_vip_f2: "Todas las clases grupales incluidas",
        plan_vip_f3: "1 escaneo corporal InBody al mes",
        plan_vip_f4: "Pase de invitado cada viernes",
        plan_vip_cta: "Elegir VIP",
        contact_title: "Reclama Tu Pase Gratis Hoy",
        contact_subtitle: "Ingresa tus datos y te enviaremos tu pase de acceso por correo electrónico.",
        contact_demo_notice: "Esto es un demo de portfolio — podés usar datos ficticios, no hace falta que sean reales.",
        form_name_ph: "Nombre completo",
        form_firstname_ph: "Nombre",
        form_lastname_ph: "Apellido",
        form_email_ph: "Tu correo electrónico",
        form_phone_ph: "Número de WhatsApp",
        form_plan_ph: "¿Qué plan te interesa?",
        form_goal_ph: "¿Cuál es tu objetivo principal?",
        form_goal_fatloss: "Recomposición corporal (Pérdida de grasa)",
        form_goal_muscle: "Hipertrofia (Ganar músculo)",
        form_goal_health: "Capacidad aeróbica / Salud general",
        form_submit: "Generar Mi Pase",
        form_submit_sending: "Enviando...",
        form_submit_error: "Error: No se pudo enviar. Intenta de nuevo.",
        form_submit_network_error: "Error de red. Revisa tu conexión.",
        form_submit_rate_limited: "Alcanzaste el límite de envíos por ahora. Intenta más tarde, o escríbenos directo por WhatsApp.",
        lead_attempts_left: "Te quedan {n} envío(s) hoy.",
        lead_reset_in: "Podrás intentar de nuevo en {time}.",
        form_comment_ph: "¿Qué te pareció esta página, o hay algo que quieras contarnos?",
        form_comment_chars: "caracteres",
        form_comment_min_hint: "(mín. 200)",
        form_comment_error_missing: "Contanos tu comentario antes de enviar.",
        form_comment_error_too_short: "Escribí al menos {min} caracteres para que podamos entender tu comentario.",
        form_comment_error_too_long: "Máximo 1000 caracteres — acorta tu comentario.",
        success_title: "¡Solicitud recibida!",
        success_sub: "Revisa tu correo — te enviamos tu selección. Nos pondremos en contacto pronto. ¡Nos vemos en el gimnasio!",
        footer_text: "© 2026 <span>TitaniumFit</span>. Todos los derechos reservados. — Creado por <span>ArielSyncLabs</span>",
        whatsapp_aria: "Chatear por WhatsApp",
        whatsapp_message: "¡Hola! Me gustaría saber más sobre Titanium Fitness",
        fiverr_button: "Contrátame en Fiverr",
        github_button: "Ver Portafolio en GitHub",
        livedemo_button: "Demo en Vivo (Cloudflare)",
        fiverr_header_button: "Fiverr",
        fiverr_header_aria: "Ver mis servicios en Fiverr",
    }
};
 
function applyTranslations(lang) {
    const t = translations[lang];
 
    html.lang = lang;
    document.title = t.page_title;
 
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key] !== undefined) el.innerHTML = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) el.placeholder = t[key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
        const key = el.getAttribute('data-i18n-alt');
        if (t[key] !== undefined) el.alt = t[key];
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (t[key] !== undefined) el.title = t[key];
    });
 
    // Theme button label depends on the language AND the active theme
    const isDark = html.getAttribute('data-theme') === 'dark';
    themeBtn.textContent = isDark ? t.theme_light : t.theme_dark;
 
    // Language button always shows the language you'd switch TO
    langBtn.textContent = lang === 'en' ? '🌐 ES' : '🌐 EN';
 
    // WhatsApp deep-link message follows the active language too
    if (waLink) waLink.href = `https://wa.me/15550123456?text=${encodeURIComponent(t.whatsapp_message)}`;
 
    // Update new buttons
    const fiverrBtn = document.getElementById('fiverr-btn');
    const githubBtn = document.getElementById('github-btn');
    const livedemoBtn = document.getElementById('livedemo-btn');
    if (fiverrBtn) fiverrBtn.textContent = t.fiverr_button;
    if (githubBtn) githubBtn.textContent = t.github_button;
    if (livedemoBtn) livedemoBtn.textContent = t.livedemo_button;
 
    // The CSS for nav a (min-width, text-align) should handle layout stability.
    // No need for inline styles here.
}
 
let currentLang = localStorage.getItem('titanium_lang') || 'en';
 
langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem('titanium_lang', currentLang);
    applyTranslations(currentLang);
});
 
// =====================
// 2. DARK / LIGHT TOGGLE
// =====================
const savedTheme = localStorage.getItem('titanium_theme') || 'dark';
 
html.setAttribute('data-theme', savedTheme);
 
themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('titanium_theme', next);
    applyTranslations(currentLang); // re-apply so the button label stays in the active language
});
 
// First paint, now that the theme attribute + DOM refs are ready
applyTranslations(currentLang);
 
// =====================
// 3. EMAILJS (ARQUITECTURA UNIFICADA)
// =====================
const EMAILJS_PUBLIC_KEY  = 'RDMUeLcSb6keXwqhG';
const EMAILJS_SERVICE_ID  = 'service_93mh7mj';
const EMAILJS_TEMPLATE_ID = 'template_hh14ehp'; // Ya trae admin notification + auto-reply al cliente
 
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
 
const MAX_COMMENT_CHARS = 1000;
// EN: Minimum length so the comment is actually useful feedback and not a stray
//     keystroke. Adjust this single constant if a different floor is wanted.
// ES: Longitud mínima para que el comentario sea feedback útil y no una tecla
//     suelta. Ajustá esta única constante si se quiere otro piso.
const MIN_COMMENT_CHARS = 200;
const commentInput = document.getElementById('comment');
const commentCharCount = document.getElementById('comment-char-count');
const commentMinHint = document.getElementById('comment-min-hint');
 
if (commentInput) {
    // EN: BUG FIX — this used to only run on the 'input' event, so if the
    //     browser restored a previously-typed comment on reload (form
    //     autofill / back-forward cache), the counter still showed "0"
    //     until the visitor typed a new character. Pulling the logic into
    //     a named function and calling it once immediately fixes that: the
    //     counter now always reflects whatever is actually in the box.
    // ES: FIX DEL BUG — esto antes solo corría en el evento 'input', así
    //     que si el navegador restauraba un comentario ya escrito al
    //     recargar (autocompletado del form / back-forward cache), el
    //     contador seguía mostrando "0" hasta que el visitante tipeaba un
    //     caracter nuevo. Sacar la lógica a una función con nombre y
    //     llamarla una vez de entrada arregla esto: el contador ahora
    //     siempre refleja lo que realmente hay en la caja.
    const updateCommentCounter = () => {
        const chars = commentInput.value.trim().length;
        commentCharCount.textContent = chars;
        // EN: red once over the max, amber while under the min, default color in between.
        //     The "(min. 200)" hint stays visible (not just color) until the min is met,
        //     then disappears — a second, non-color signal for the same state.
        // ES: rojo al pasar el máximo, ámbar mientras no llega al mínimo, color normal en el medio.
        //     El texto "(mín. 200)" queda visible (no solo el color) hasta llegar al mínimo,
        //     y después desaparece — una segunda señal, no solo de color, para el mismo estado.
        if (chars > MAX_COMMENT_CHARS) {
            commentCharCount.parentElement.style.color = '#ef4444';
        } else if (chars > 0 && chars < MIN_COMMENT_CHARS) {
            commentCharCount.parentElement.style.color = '#f59e0b';
        } else {
            commentCharCount.parentElement.style.color = '';
        }
        if (commentMinHint) {
            commentMinHint.style.display = chars >= MIN_COMMENT_CHARS ? 'none' : '';
        }
    };
 
    commentInput.addEventListener('input', updateCommentCounter);
    // EN: run once on load — covers the browser-restored-value case above.
    // ES: se ejecuta una vez al cargar — cubre el caso de valor restaurado
    //     por el navegador de arriba.
    updateCommentCounter();
}
 
// =====================
// PHONE AUTO-FORMAT — (XXX) XXX-XXXX WHILE TYPING
// =====================
// EN: No library needed for this — we just strip non-digits on every keystroke
//     and re-insert the parentheses/dash at the right positions. Caps at 10
//     digits (US/CA style); if someone pastes a longer international number
//     the extra digits are simply appended after the formatted block instead
//     of being dropped, so we never destroy real data.
// ES: No hace falta librería — en cada tecla se sacan los caracteres que no
//     son dígitos y se reinsertan los paréntesis/guion en su lugar. Tope de
//     10 dígitos (estilo US/CA); si alguien pega un número internacional más
//     largo, los dígitos extra simplemente se agregan después del bloque
//     formateado en vez de perderse, para no destruir el dato real.
function formatPhoneInput(value) {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    const rest = value.replace(/\D/g, '').slice(10);
    const len = digits.length;
 
    let formatted;
    if (len === 0) {
        formatted = '';
    } else if (len < 4) {
        formatted = `(${digits}`;
    } else if (len < 7) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return rest ? `${formatted} ${rest}` : formatted;
}
 
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', () => {
        const cursorWasAtEnd = phoneInput.selectionEnd === phoneInput.value.length;
        phoneInput.value = formatPhoneInput(phoneInput.value);
        // EN: keep the caret at the end — simplest behavior that doesn't fight the
        //     user while they're typing forward (editing mid-string is rare for phone fields).
        // ES: mantener el cursor al final — el comportamiento más simple que no
        //     pelea con el usuario mientras escribe hacia adelante (editar en
        //     medio del número es poco común en campos de teléfono).
        if (cursorWasAtEnd) {
            phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
        }
    });
}
 
function showLeadError(message, formContainer, formSuccess) {
    const existing = formContainer.querySelector('.form-error-message');
    if (existing) existing.remove();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.style.color = 'red';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.marginTop = '1rem';
    errorDiv.textContent = message;
    formContainer.insertBefore(errorDiv, formSuccess);
}
 
// =====================
// CONTADOR DE INTENTOS RESTANTES
// =====================
let countdownInterval = null;
 
function formatTimeLeft(ms) {
    // EN: BUG FIX — this used to floor everything to whole minutes (ms / 60000),
    //     so seconds never appeared no matter how long the reset window was.
    //     Working from total seconds instead makes "Xs" show up correctly
    //     once the countdown drops under a minute.
    // ES: FIX DEL BUG — antes se redondeaba todo a minutos enteros (ms / 60000),
    //     así que los segundos nunca aparecían sin importar cuán larga fuera
    //     la ventana. Al partir de segundos totales, el "Xs" aparece bien
    //     cuando la cuenta regresiva baja de un minuto.
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
 
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}
 
function renderLimitInfo(remaining, resetAt) {
    const el = document.getElementById('lead-limit-info');
    if (!el) return;
 
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
 
    if (remaining > 0) {
        el.textContent = translations[currentLang].lead_attempts_left.replace('{n}', remaining);
        el.classList.remove('limit-warning');
        return;
    }
 
    // remaining === 0: cuenta regresiva en vivo
    el.classList.add('limit-warning');
    const update = () => {
        const msLeft = resetAt - Date.now();
        if (msLeft <= 0) {
            clearInterval(countdownInterval);
            el.textContent = '';
            el.classList.remove('limit-warning');
            return;
        }
        el.textContent = translations[currentLang].lead_reset_in.replace('{time}', formatTimeLeft(msLeft));
    };
    update();
    // EN: was 60000 (once a minute) — that's also why seconds felt "frozen" even
    //     after the formatTimeLeft fix. 1000ms keeps the last minute of the
    //     countdown genuinely live.
    // ES: antes era 60000 (una vez por minuto) — por eso los segundos se sentían
    //     "congelados" incluso después de arreglar formatTimeLeft. 1000ms hace
    //     que el último minuto de la cuenta regresiva se vea realmente en vivo.
    countdownInterval = setInterval(update, 1000);
}
 
// Consulta el estado al cargar la página (no gasta intento)
fetch('/api/lead')
    .then(res => res.json())
    .then(data => renderLimitInfo(data.remaining, data.resetAt))
    .catch(() => {}); // si falla, simplemente no se muestra el contador
 
document.getElementById('lead-form').addEventListener('submit', async function (e) {
    e.preventDefault();
 
    const btn = document.getElementById('btn-submit');
    const formSuccess = document.getElementById('form-success');
    const formContainer = document.querySelector('.form-container'); // Use formContainer to show error below it
    const originalBtnText = translations[currentLang].form_submit;
 
    // Remove any previous error messages
    const existingError = formContainer.querySelector('.form-error-message');
    if (existingError) {
        existingError.remove();
    }
 
    const commentEl = document.getElementById('comment');
    const comment = commentEl.value.trim();
 
    if (!comment) {
        showLeadError(translations[currentLang].form_comment_error_missing, formContainer, formSuccess);
        return;
    }
    if (comment.length < MIN_COMMENT_CHARS) {
        showLeadError(
            translations[currentLang].form_comment_error_too_short.replace('{min}', MIN_COMMENT_CHARS),
            formContainer, formSuccess
        );
        return;
    }
    if (comment.length > MAX_COMMENT_CHARS) {
        showLeadError(translations[currentLang].form_comment_error_too_long, formContainer, formSuccess);
        return;
    }
 
    btn.textContent = translations[currentLang].form_submit_sending;
    btn.classList.add('btn-loading');
    btn.disabled = true;
 
    // EN: firstName/lastName travel separately (so an EmailJS template can address
    //     the lead by first name only) plus a combined "name" for templates/logs
    //     that still expect one full-name string. Update your EmailJS template
    //     to use {{firstName}} / {{lastName}} directly if you want that.
    // ES: firstName/lastName viajan separados (para que una plantilla de EmailJS
    //     pueda saludar solo con el nombre) más un "name" combinado para
    //     plantillas/logs que todavía esperan un string de nombre completo.
    //     Actualizá tu plantilla de EmailJS para usar {{firstName}} / {{lastName}}
    //     directamente si querés eso.
    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
 
    const params = {
        firstName: firstName,
        lastName:  lastName,
        name:      `${firstName} ${lastName}`.trim(),
        email:     document.getElementById('email').value,
        phone:     document.getElementById('phone').value,
        plan:      document.getElementById('plan').value,
        goal:      document.getElementById('goal').value,
        comment:   comment,
    };
 
    // Paso 1: chequeo de rate-limit server-side (3 envíos / 24h por IP,
    // ver functions/api/lead.js). Esto evita que alguien gaste la cuota
    // mensual de EmailJS mandando el formulario en loop — el navegador
    // solo no puede aplicar este límite de forma confiable.
    try {
        const rateRes = await fetch('/api/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
 
        const rateData = await rateRes.clone().json().catch(() => null);
        // EN: BUG FIX — only render the counter/countdown when the response
        //     actually carries numeric remaining/resetAt. A validation error
        //     (400) has no such fields, and calling renderLimitInfo with
        //     undefined values used to produce "You can try again in NaNs."
        // ES: FIX DEL BUG — solo renderizar el contador/cuenta regresiva
        //     cuando la respuesta trae remaining/resetAt numéricos de
        //     verdad. Un error de validación (400) no tiene esos campos, y
        //     llamar a renderLimitInfo con valores undefined generaba
        //     "You can try again in NaNs."
        if (rateData && typeof rateData.remaining === 'number') {
            renderLimitInfo(rateData.remaining, rateData.resetAt);
        }
 
        if (rateRes.status === 429) {
            showLeadError(translations[currentLang].form_submit_rate_limited, formContainer, formSuccess);
            btn.textContent = originalBtnText;
            btn.classList.remove('btn-loading');
            btn.disabled = false;
            return;
        }
        // Si /api/lead devuelve otro error (400, etc.) igual seguimos:
        // el problema más probable ahí es de validación server-side
        // redundante, no queremos perder un lead real por eso.
    } catch (rateError) {
        // Si el endpoint no responde (caída puntual de la Function),
        // dejamos pasar el envío: preferimos arriesgarnos a perder el
        // rate-limit por un rato antes que perder un lead real por un
        // problema de infraestructura ajeno al visitante.
        console.warn('Lead rate-limit check failed, proceeding anyway:', rateError);
    }
 
    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
        document.getElementById('lead-form').style.display = 'none';
        formSuccess.classList.add('visible');
    } catch (error) {
        console.error('EmailJS error:', error);
        let errorMessage = translations[currentLang].form_submit_error;
 
        // Quota exceeded (EmailJS free plan: 200/month)
        if (error && (error.status === 429 || (error.text && error.text.toLowerCase().includes('limit')))) {
            errorMessage = currentLang === 'es'
                ? 'El formulario ha alcanzado su límite mensual. Contáctanos directamente por WhatsApp.'
                : 'The contact form has reached its monthly limit. Please reach us directly via WhatsApp.';
        } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            errorMessage = translations[currentLang].form_submit_network_error;
        } else if (error && error.status) {
            errorMessage += ` (Status: ${error.status})`;
        } else if (error && error.text) {
            errorMessage += ` (${error.text})`;
        }
 
 
        // Display error message to the user
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.marginTop = '1rem';
        errorDiv.textContent = errorMessage;
        formContainer.insertBefore(errorDiv, formSuccess); // Insert before success message
 
        btn.textContent = originalBtnText; // Revert to original text
        btn.classList.remove('btn-loading');
        btn.disabled = false;
    }
});
 
// =====================
// 6. AUTO-FILL PLAN FROM PRICING CARDS
// =====================
// Clicking "Select Base" / "Select VIP" pre-fills the Plan field in the
// form below, so the visitor only has to type the rest.
document.querySelectorAll('[data-plan]').forEach(button => {
    button.addEventListener('click', () => {
        const planField = document.getElementById('plan');
        planField.value = button.getAttribute('data-plan');
 
        // Restart the highlight animation even on a repeat click
        // (double rAF instead of reading offsetWidth — avoids a forced synchronous reflow)
        planField.classList.remove('campo-autocompletado');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                planField.classList.add('campo-autocompletado');
            });
        });
 
        // Smooth scroll to the contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


