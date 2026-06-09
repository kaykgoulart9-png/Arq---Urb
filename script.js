/* ========================
   ARQ & URB — JAVASCRIPT
   ======================== */

'use strict';

// ============================================================
// 1. DARK MODE TOGGLE
// ============================================================
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleIcon = document.getElementById('toggleIcon');
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('arq-urb-theme', theme);
}

// Load saved preference
const savedTheme = localStorage.getItem('arq-urb-theme') || 'light';
applyTheme(savedTheme);

darkModeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ============================================================
// 2. NAVBAR — scroll behavior
// ============================================================
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

// ============================================================
// 3. HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen.toString());
});

// Close menu on nav link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// 4. SMOOTH SCROLL — hero buttons & nav links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ============================================================
// 5. SCROLL REVEAL ANIMATION
// ============================================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger delay for sibling elements
      const siblings = Array.from(entry.target.parentElement?.children || []);
      const siblingIndex = siblings.indexOf(entry.target);
      const delay = Math.min(siblingIndex * 80, 400);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ============================================================
// 6. COUNTERS ANIMATION (Stats Section)
// ============================================================
const statNumbers = document.querySelectorAll('.stat-number');
const statBars = document.querySelectorAll('.stat-bar-fill');

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNumbers.forEach(el => animateCounter(el));
      statBars.forEach(bar => {
        bar.style.width = bar.style.width; // trigger reflow
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('indicadores');
if (statsSection) statsObserver.observe(statsSection);

// ============================================================
// 7. GALLERY FILTER
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const filter = this.getAttribute('data-filter');

    galleryItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        item.classList.remove('hidden');
        // Re-trigger reveal animation
        item.classList.remove('visible');
        setTimeout(() => item.classList.add('visible'), 50);
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ============================================================
// 8. CONTACT FORM VALIDATION & SUBMISSION
// ============================================================
const form = document.getElementById('contactForm');

function validateField(field) {
  const errorEl = document.getElementById('error' + capitalize(field.name));
  let errorMsg = '';

  if (!field.value.trim()) {
    errorMsg = 'Este campo é obrigatório.';
  } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    errorMsg = 'Por favor, insira um e-mail válido.';
  }

  if (errorEl) errorEl.textContent = errorMsg;
  field.classList.toggle('error', !!errorMsg);
  return !errorMsg;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

if (form) {
  const fields = form.querySelectorAll('input, textarea, select');

  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    fields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) return;

    // Simulate submission
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const formSuccess = document.getElementById('formSuccess');

    submitBtn.disabled = true;
    submitText.textContent = 'Enviando...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitText.textContent = 'Enviar Mensagem';
      formSuccess.classList.add('visible');
      form.reset();
      fields.forEach(f => f.classList.remove('error'));
      document.querySelectorAll('.form-error').forEach(e => (e.textContent = ''));

      setTimeout(() => formSuccess.classList.remove('visible'), 6000);
    }, 1500);
  });
}

// ============================================================
// 9. BACK TO TOP BUTTON
// ============================================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 10. ACTIVE NAV LINK ON SCROLL
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-cta)');

function updateActiveNavLink() {
  const scrollY = window.scrollY;
  const navHeight = 80;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navHeight - 40;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      navLinkEls.forEach(link => link.classList.remove('active-link'));
      const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (activeLink) activeLink.classList.add('active-link');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// ============================================================
// 11. TIMELINE CONNECTOR ANIMATION
// ============================================================
const timelineSteps = document.querySelectorAll('.timeline-step');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 200);
    }
  });
}, { threshold: 0.2 });

timelineSteps.forEach(step => timelineObserver.observe(step));

// ============================================================
// 12. PARALLAX EFFECT ON HERO ORBS
// ============================================================
const orbs = document.querySelectorAll('.hero-orb');

window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;

  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 0.4;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
}, { passive: true });

// ============================================================
// 13. SECTION-DARK STYLES FIX FOR LIGHT/DARK MODE
// ============================================================
function updateSectionTheme() {
  const theme = html.getAttribute('data-theme');
  document.querySelectorAll('.section-dark .section-title').forEach(el => {
    el.style.color = theme === 'dark' ? 'var(--text-primary)' : 'var(--text-primary)';
  });
}

const themeObserver = new MutationObserver(updateSectionTheme);
themeObserver.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
updateSectionTheme();

console.log(
  '%c Arq & Urb %c v1.0 ',
  'background:#1F3A5F; color:#fff; padding:4px 8px; border-radius:4px 0 0 4px; font-weight:bold;',
  'background:#5C8A4B; color:#fff; padding:4px 8px; border-radius:0 4px 4px 0;'
);
