/* ============================================================
   MAR & BRASA — main.js
   Handles: theme, language, mobile menu, scroll reveal, form
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. THEME ── */
  const html        = document.documentElement;
  const themeBtn    = document.getElementById('theme-toggle');
  const THEME_KEY   = 'mb-theme';

  function applyTheme(theme, animate) {
    const set = () => {
      html.dataset.theme = theme;
      localStorage.setItem(THEME_KEY, theme);
    };
    if (animate && document.startViewTransition) {
      document.startViewTransition(set);
    } else {
      set();
    }
  }

  // Init from storage or system preference
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    applyTheme(storedTheme, false);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light', false);
  }

  themeBtn && themeBtn.addEventListener('click', () => {
    applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });


  /* ── 2. LANGUAGE ── */
  const LANG_KEY  = 'mb-lang';
  const btnES     = document.getElementById('btn-es');
  const btnEN     = document.getElementById('btn-en');
  let currentLang = 'es';

  function applyLang(lang, animate) {
    const savedScroll = window.scrollY;

    const set = () => {
      html.lang = lang;
      html.classList.add('lang-switching');

      // Update all data-es / data-en elements
      document.querySelectorAll('[data-es]').forEach(el => {
        const val = el.dataset[lang];
        if (val !== undefined) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = val;
          } else if (el.tagName === 'OPTION') {
            el.textContent = val;
          } else {
            el.textContent = val;
          }
        }
      });

      // Update lang buttons aria + active class
      [btnES, btnEN].forEach(btn => {
        if (!btn) return;
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });

      localStorage.setItem(LANG_KEY, lang);
      currentLang = lang;
    };

    if (animate && document.startViewTransition) {
      document.startViewTransition(() => {
        set();
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedScroll, behavior: 'auto' });
          requestAnimationFrame(() => html.classList.remove('lang-switching'));
        });
      });
    } else {
      set();
      window.scrollTo({ top: savedScroll, behavior: 'auto' });
      requestAnimationFrame(() => html.classList.remove('lang-switching'));
    }
  }

  // Init language
  const storedLang = localStorage.getItem(LANG_KEY);
  if (storedLang === 'es' || storedLang === 'en') {
    applyLang(storedLang, false);
  } else {
    const browser = navigator.language?.toLowerCase() || '';
    applyLang(browser.startsWith('es') ? 'es' : 'en', false);
  }

  btnES && btnES.addEventListener('click', () => { if (currentLang !== 'es') applyLang('es', true); });
  btnEN && btnEN.addEventListener('click', () => { if (currentLang !== 'en') applyLang('en', true); });


  /* ── 3. MOBILE MENU ── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger && hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    if (mobileMenu) mobileMenu.hidden = isOpen;
  });

  // Close when a mobile link is clicked
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMobileMenu)
  );

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });


  /* ── 4. SCROLL REVEAL ── */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el    = entry.target;
          const delay = parseInt(el.dataset.revealDelay || '0', 10);
          setTimeout(() => el.classList.add('revealed'), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
  }


  /* ── 5. NAVBAR SHADOW ON SCROLL ── */
  const nav = document.getElementById('nav');
  const fab = document.getElementById('fab-reserve');
  const hero = document.getElementById('hero');

  if (nav || fab) {
    const onScroll = () => {
      const scrolled = window.scrollY;
      // Nav shadow
      if (nav) nav.style.boxShadow = scrolled > 10 ? '0 2px 20px rgba(0,0,0,0.25)' : '';
      // FAB: show after scrolling past ~80% of hero height
      if (fab && hero) {
        const threshold = hero.offsetHeight * 0.8;
        fab.classList.toggle('visible', scrolled > threshold);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on load
    onScroll();
  }


  /* ── 6. RESERVATION FORM ── */
  const form        = document.getElementById('reserva-form');
  const successBox  = document.getElementById('reserva-success');
  const submitBtn   = document.getElementById('submit-btn');

  if (form) {
    // Set min date to today
    const dateInput = document.getElementById('fecha');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    form.addEventListener('submit', e => {
      e.preventDefault();

      // Honeypot check
      if (form.elements.website && form.elements.website.value) return;

      // Basic validation
      let valid = true;
      ['nombre', 'telefono', 'fecha', 'personas'].forEach(name => {
        const field = form.elements[name];
        if (!field || !field.value.trim()) {
          valid = false;
          field && field.focus();
        }
      });
      if (!valid) return;

      // Simulate sending (portfolio demo)
      submitBtn.disabled = true;
      const originalText = submitBtn.querySelector('.btn-text');
      const lang = currentLang;
      if (originalText) {
        originalText.textContent = lang === 'es' ? 'Enviando…' : 'Sending…';
      }

      setTimeout(() => {
        form.hidden  = true;
        if (successBox) successBox.hidden = false;

        // Apply current language to success box
        if (successBox) {
          successBox.querySelectorAll('[data-es]').forEach(el => {
            const val = el.dataset[lang];
            if (val !== undefined) el.textContent = val;
          });
        }
      }, 1200);
    });
  }

  /* ── 7. PARTICLES ── */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const container = document.getElementById('hero-particles');
    if (container) {
      const count = window.innerWidth < 640 ? 8 : 16;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 2;
        p.style.cssText = [
          `width:${size}px`, `height:${size}px`,
          `left:${Math.random() * 100}%`,
          `top:${50 + Math.random() * 50}%`,
          `--dur:${7 + Math.random() * 8}s`,
          `--delay:${Math.random() * 10}s`,
          `opacity:0`
        ].join(';');
        container.appendChild(p);
      }
    }
  }

})();
