/* ============================================
   TITANIUM FITNESS — MAIN SCRIPT
   1. Translations (EN/ES)
   2. Dark/Light toggle
   3. EmailJS lead form with advanced feedback
   4. Auto-fill plan from pricing cards
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
        contact_subtitle: "Enter your details and we'll send your access pass via WhatsApp.",
        form_name_ph: "Full name",
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
        success_title: "Request received!",
        success_sub: "Check your email — we've sent your selection. We'll be in touch soon. See you at the gym.",
        footer_text: "© 2026 <span>TitaniumFit</span>. All rights reserved. — Built by <span>ArielSyncLabs</span>",
        whatsapp_aria: "Chat on WhatsApp",
        whatsapp_message: "Hi! I'd like to know more about Titanium Fitness",
        fiverr_button: "Hire Me on Fiverr",
        github_button: "View GitHub Portfolio",
        livedemo_button: "Live Demo (Cloudflare)",
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
        contact_subtitle: "Ingresa tus datos y te enviaremos tu pase de acceso por WhatsApp.",
        form_name_ph: "Nombre completo",
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
        success_title: "¡Solicitud recibida!",
        success_sub: "Revisa tu correo — te enviamos tu selección. Nos pondremos en contacto pronto. ¡Nos vemos en el gimnasio!",
        footer_text: "© 2026 <span>TitaniumFit</span>. Todos los derechos reservados. — Creado por <span>ArielSyncLabs</span>",
        whatsapp_aria: "Chatear por WhatsApp",
        whatsapp_message: "¡Hola! Me gustaría saber más sobre Titanium Fitness",
        fiverr_button: "Contrátame en Fiverr",
        github_button: "Ver Portafolio en GitHub",
        livedemo_button: "Demo en Vivo (Cloudflare)",
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
const EMAILJS_TEMPLATE_ID = 'template_hh14ehp'; // Already updated as per your files

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

document.getElementById('lead-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.getElementById('btn-submit');
    const formSuccess = document.getElementById('form-success');
    const formContainer = document.querySelector('.form-container'); // Use formContainer to show error below it
    const originalBtnText = translations[currentLang].form_submit;

    btn.textContent = translations[currentLang].form_submit_sending;
    btn.classList.add('btn-loading');
    btn.disabled = true;

    // Remove any previous error messages
    const existingError = formContainer.querySelector('.form-error-message');
    if (existingError) {
        existingError.remove();
    }

    const params = {
        name:  document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        plan:  document.getElementById('plan').value,
        goal:  document.getElementById('goal').value,
    };

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
// 4. AUTO-FILL PLAN FROM PRICING CARDS
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



