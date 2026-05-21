/* ==========================================================
   SWITCH ON ELECTRICAL — main script.js
   Lenis, GSAP, nav, FAQ, form, magnetic CTAs, before/after, sticky CTA
   ========================================================== */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

  // Enable JS-based reveal hiding. Without this class, [data-reveal] elements stay visible (safe fallback).
  if (!reduceMotion) document.documentElement.classList.add('has-js');

  /* ---------- Lenis smooth scroll ----------
     IMPORTANT: only one raf driver. If GSAP is present, the gsap.ticker block
     below drives lenis.raf(). Otherwise we run our own raf loop here.
     Driving Lenis from two rAFs (the bug v1 had) caused the "glitchy" scroll. */
  let lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
      autoRaf: false,
    });
    if (!window.gsap || !window.ScrollTrigger) {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- nav: scroll state + burger + smooth anchor ---------- */
  const nav = document.getElementById('nav');
  const navMobile = document.getElementById('navMobile');
  const burger = document.getElementById('navBurger');

  const setNavState = () => {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  setNavState();
  window.addEventListener('scroll', setNavState, { passive: true });

  // Burger menu
  if (burger && navMobile) {
    burger.addEventListener('click', () => {
      const open = navMobile.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      navMobile.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
      if (lenis) (open ? lenis.stop() : lenis.start());
    });
    navMobile.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navMobile.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      }
    });
  }

  // Smooth anchor scrolling via Lenis
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -72, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- reveal animations via IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      } else {
        io.observe(el);
      }
    });
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  // Failsafe: any reveal still hidden 1.5s after load gets shown anyway if near the viewport.
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.2) el.classList.add('revealed');
      });
    }, 1500);
  });

  /* ---------- GSAP enhancements ----------
     Single raf driver: GSAP ticker drives Lenis when GSAP is present (see Lenis block above). */
  if (!reduceMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Hero content gentle lift + fade — kept everywhere (cheap, always-on)
    gsap.to('.hero-content', {
      yPercent: -10,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom 30%',
        scrub: true,
      },
    });

    // Heavy parallax effects only on desktop — mobile gets a static layout.
    // gsap.matchMedia() cleans the triggers up automatically when the breakpoint changes.
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      // Gallery tiles micro parallax
      gsap.utils.toArray('.gallery-tile img').forEach((img) => {
        gsap.fromTo(img, { y: -8 }, {
          y: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.5,
          },
        });
      });

      // Service image parallax (only the photo ones — icon panels don't need it)
      gsap.utils.toArray('.service-img img').forEach((img) => {
        gsap.fromTo(img, { y: -12 }, {
          y: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.5,
          },
        });
      });

      // About image parallax
      const aboutImg = document.querySelector('.about-img img');
      if (aboutImg) {
        gsap.fromTo(aboutImg, { y: -16 }, {
          y: 16,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutImg.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.5,
          },
        });
      }
    });
  }

  /* ---------- before / after slider ---------- */
  document.querySelectorAll('[data-ba]').forEach((frame) => {
    const afterImg = frame.querySelector('.ba-after');
    const handle = frame.querySelector('.ba-handle');
    if (!afterImg || !handle) return;

    let pointerActive = false;

    const setPos = (clientX) => {
      const rect = frame.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      afterImg.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = `${pct}%`;
    };

    const onMove = (e) => {
      if (!pointerActive) return;
      setPos(e.clientX ?? e.touches?.[0]?.clientX);
    };
    const onDown = (e) => {
      pointerActive = true;
      setPos(e.clientX ?? e.touches?.[0]?.clientX);
      if (lenis) lenis.stop();
    };
    const onUp = () => {
      pointerActive = false;
      if (lenis) lenis.start();
    };

    frame.addEventListener('mousedown', onDown);
    frame.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    // Hover preview: as the cursor enters/moves over the frame (no need to click)
    frame.addEventListener('mousemove', (e) => {
      if (!pointerActive) setPos(e.clientX);
    });

    // Initialise at 50/50
    setPos(frame.getBoundingClientRect().left + frame.getBoundingClientRect().width / 2);
  });

  /* ---------- sticky mobile CTA bar ---------- */
  const stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    const updateSticky = () => {
      // show after first viewport scrolled, hide near footer
      const footer = document.querySelector('.footer');
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
      const showThreshold = window.innerHeight * 0.6;
      const nearFooter = footerTop < window.innerHeight * 0.9;
      if (window.scrollY > showThreshold && !nearFooter) {
        stickyCta.classList.add('show');
      } else {
        stickyCta.classList.remove('show');
      }
    };
    updateSticky();
    window.addEventListener('scroll', updateSticky, { passive: true });
  }

  /* ---------- custom cursor (desktop only) ---------- */
  if (isDesktop && !reduceMotion) {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
      let mx = 0, my = 0, cx = 0, cy = 0;
      window.addEventListener('mousemove', (e) => {
        mx = e.clientX - 16;
        my = e.clientY - 16;
        cursor.style.opacity = '1';
      });
      const animate = () => {
        cx += (mx - cx) * 0.18;
        cy += (my - cy) * 0.18;
        cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        requestAnimationFrame(animate);
      };
      animate();

      const hoverables = 'a, button, .btn, .service-img, .gallery-tile, .ba-frame, .faq-item summary, .quiz-option, .area-pill, input, textarea, select, label';
      document.querySelectorAll(hoverables).forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
      document.addEventListener('mouseleave', () => (cursor.style.opacity = '0'));
    }
  }

  /* ---------- FAQ — single-open accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  /* ---------- contact form (Web3Forms) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRx = /^[\d\s\-\+\(\)]{8,}$/;

  const setStatus = (msg, kind) => {
    if (!status) return;
    status.textContent = msg;
    status.className = `form-status ${kind || ''}`.trim();
  };
  const setError = (input, msg) => {
    if (input) {
      input.style.borderColor = '#FF8B7A';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
    }
    setStatus(msg, 'error');
  };
  const clearError = (input) => {
    if (!input) return;
    input.style.borderColor = '';
    input.removeAttribute('aria-invalid');
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus('', '');

      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const phone = (fd.get('phone') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const service = (fd.get('service') || '').toString().trim();

      if (!name) return setError(form.querySelector('[name="name"]'), 'Please add your name.');
      if (!phoneRx.test(phone)) return setError(form.querySelector('[name="phone"]'), 'Please add a contactable phone number.');
      if (email && !emailRx.test(email)) return setError(form.querySelector('[name="email"]'), 'Please check the email looks right.');
      if (!service) return setError(form.querySelector('[name="service"]'), 'Pick a service so Locky knows what you need.');

      form.querySelectorAll('input,select,textarea').forEach(clearError);

      const btn = form.querySelector('button[type="submit"]');
      const originalBtnHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: fd,
          headers: { Accept: 'application/json' },
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success !== false) {
          form.reset();
          setStatus('Thanks! Locky will be in touch shortly — usually same day.', 'success');
        } else {
          throw new Error('submit_failed');
        }
      } catch (err) {
        setStatus('', '');
        if (status) {
          status.innerHTML = "Couldn't send right now. Please call Locky on <a href='tel:0475365373' style='color:var(--accent)'>0475 365 373</a>.";
          status.className = 'form-status error';
        }
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalBtnHTML;
      }
    });

    // Clear errors as user types
    form.querySelectorAll('input,select,textarea').forEach((field) => {
      field.addEventListener('input', () => clearError(field));
    });

    // Prefill service from quiz CTA via ?service= param
    const params = new URLSearchParams(window.location.search);
    const preService = params.get('service');
    if (preService) {
      const select = form.querySelector('[name="service"]');
      if (select) {
        const opt = Array.from(select.options).find(o => o.value === preService);
        if (opt) select.value = preService;
      }
    }
  }

  /* ---------- magnetic primary CTAs (desktop only) ---------- */
  if (isDesktop && !reduceMotion) {
    document.querySelectorAll('.btn-primary').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.18;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.18;
        btn.style.transform = `translate(${dx}px, ${dy - 2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- area-map: Leaflet handles its own clicks via service-areas-map.js ---------- */
})();
