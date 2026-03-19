/* ═══════════════════════════════════════════════
   IRON PULSE FITNESS  ·  script.js  ·  v2.0
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Supabase Configuration
  const SUPABASE_URL = 'https://otbffeyswsfhbxnqmnaa.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_cYkIPH3uIduhgJfjwKTBGg_PY3mxy8O';
  const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

  /* ─────────────────────────────────────────
     1.  NAVBAR — sticky + active link
  ───────────────────────────────────────── */
  const nav     = document.getElementById('nav');
  const burger  = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  const allNavA  = navLinks.querySelectorAll('a');

  // Sticky effect
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 50);
    highlightNav();
    toggleBackTop();
  }, { passive: true });

  // Mobile menu
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  allNavA.forEach(a => a.addEventListener('click', closeMenu));

  function closeMenu() {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Highlight active section link
  function highlightNav() {
    const sections = document.querySelectorAll('section[id]');
    const y = window.scrollY + 120;
    sections.forEach(sec => {
      const link = navLinks.querySelector(`a[href="#${sec.id}"]`);
      if (!link) return;
      const inView = y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight;
      link.classList.toggle('active', inView);
    });
  }


  /* ─────────────────────────────────────────
     2.  SMOOTH SCROLL (respects nav offset)
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────
     3.  SCROLL REVEAL
  ───────────────────────────────────────── */
  // Mark elements for reveal
  const revealSels = [
    '.svc', '.why__card', '.testi', '.plan',
    '.cinfo', '.sh', '.cta-banner__body',
    '.footer__col', '.footer__brand'
  ];
  document.querySelectorAll(revealSels.join(',')).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 5) * 75}ms`;
  });

  // Left / right for split sections
  const whyImg     = document.querySelector('.why__img-col');
  const whyContent = document.querySelector('.why__content');
  if (whyImg)     whyImg.classList.add('reveal-l');
  if (whyContent) whyContent.classList.add('reveal-r');

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => {
    revealObs.observe(el);
  });


  /* ─────────────────────────────────────────
     4.  HERO PARALLAX (subtle)
  ───────────────────────────────────────── */
  const heroBg = document.querySelector('.hero__bg');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight && heroBg) {
      heroBg.style.transform = `scale(1.04) translateY(${window.scrollY * 0.22}px)`;
    }
  }, { passive: true });


  /* ─────────────────────────────────────────
     5.  HERO STAT COUNTERS
  ───────────────────────────────────────── */
  const counters = [
    { el: document.getElementById('s1'), end: 1200, suffix: '+', prefix: '' },
    { el: document.getElementById('s2'), end: 15,   suffix: '+', prefix: '' },
    { el: document.getElementById('s3'), end: 8,    suffix: '+', prefix: '' },
  ];

  counters.forEach(({ el, end, suffix, prefix }) => {
    if (!el) return;
    setTimeout(() => {
      const dur = 1800;
      const t0  = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        const v = Math.round(easeOut(p) * end);
        el.innerHTML = `${prefix}${v.toLocaleString()}<span class="red">${suffix}</span>`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 700);
  });

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }


  /* ─────────────────────────────────────────
     6.  PRICING TOGGLE — Monthly / Annual
  ───────────────────────────────────────── */
  const toggleEl = document.getElementById('billing-toggle');
  const lblMo    = document.getElementById('lbl-mo');
  const lblYr    = document.getElementById('lbl-yr');
  const amounts  = document.querySelectorAll('.plan__amt');
  let annual = false;

  toggleEl.addEventListener('click', () => {
    annual = !annual;
    toggleEl.classList.toggle('yr', annual);
    lblMo.classList.toggle('on', !annual);
    lblYr.classList.toggle('on', annual);

    amounts.forEach(el => {
      const from = parseInt(el.textContent);
      const to   = parseInt(annual ? el.dataset.yr : el.dataset.mo);
      animNum(el, from, to);
    });
  });

  // default active state
  lblMo.classList.add('on');

  function animNum(el, from, to, dur = 420) {
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(from + (to - from) * easeOut(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }


  /* ─────────────────────────────────────────
     7.  CONTACT FORM
  ───────────────────────────────────────── */
  const form    = document.getElementById('contact-form');
  const btnText = document.getElementById('btn-text');
  const btnLoad = document.getElementById('btn-loader');
  const success = document.getElementById('form-success');
  const submitB = document.getElementById('form-submit');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate required fields
    const reqs = form.querySelectorAll('[required]');
    let ok = true;
    reqs.forEach(f => {
      f.style.borderColor = '';
      const empty = !f.value.trim();
      const badEmail = f.type === 'email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
      if (empty || badEmail) { f.style.borderColor = '#f87171'; ok = false; }
    });

    if (!ok) { shake(form); return; }

    // Send to Supabase
    btnText.hidden = true;
    btnLoad.hidden = false;
    submitB.disabled = true;

    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      const formData = new FormData(form);
      const data = {
        first_name: formData.get('fname'),
        last_name: formData.get('lname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        interest: formData.get('interest'),
        message: formData.get('msg'),
      };

      const { error } = await supabase.from('contacts').insert([data]);

      if (error) throw error;

      form.reset();
      success.hidden = false;
      setTimeout(() => { success.hidden = true; }, 6000);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Oops! Something went wrong. Please try again or call us directly.');
    } finally {
      btnText.hidden = false;
      btnLoad.hidden = true;
      submitB.disabled = false;
    }
  });

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function shake(el) {
    const kf = [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-7px)' },
      { transform: 'translateX(7px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' },
    ];
    el.animate(kf, { duration: 380, easing: 'ease' });
  }


  /* ─────────────────────────────────────────
     8.  BACK TO TOP
  ───────────────────────────────────────── */
  const backBtn = document.getElementById('back-top');
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  function toggleBackTop() {
    backBtn.classList.toggle('on', window.scrollY > 500);
  }


  /* ─────────────────────────────────────────
     9.  SERVICE CARD — cursor glow
  ───────────────────────────────────────── */
  document.querySelectorAll('.svc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });


  /* ─────────────────────────────────────────
     10. SCROLL INDICATOR — hide on scroll
  ───────────────────────────────────────── */
  const sd = document.getElementById('scroll-down');
  window.addEventListener('scroll', () => {
    if (sd) sd.style.opacity = window.scrollY > 100 ? '0' : '1';
  }, { passive: true });

});
