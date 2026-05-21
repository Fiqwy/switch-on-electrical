/* ==========================================================
   SWITCH ON ELECTRICAL — Hero lightning canvas
   Canvas 2D (intentionally — much lighter than WebGL for this effect,
   60fps on iPhone, and looks just as electric).
   Random branching lightning bolts strike across the hero canvas,
   accent-colour particles drift in the background.
   ========================================================== */

(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('hero-lightning');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // ---------- sizing / DPR (mobile-aware cap to keep redraws cheap) ----------
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  let w = 0, h = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  // ---------- ambient particles (fewer = cheaper per frame) ----------
  const PARTICLE_COUNT = isMobile ? 14 : 22;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.6 + 0.4,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    a: Math.random() * 0.5 + 0.15,
  }));

  // ---------- lightning bolts ----------
  // Each bolt is a chain of points from start → end with mid-jitter,
  // plus a few branches at random points. Bolts fade quickly.
  const bolts = [];

  const generateBolt = () => {
    // Start position — anywhere along top
    const x0 = Math.random() * w;
    const y0 = -8;
    // End position — somewhere lower
    const x1 = x0 + (Math.random() - 0.5) * w * 0.5;
    const y1 = h * (0.5 + Math.random() * 0.5);
    // Chain points (more segments = jagged)
    const segs = 10 + Math.floor(Math.random() * 6);
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const baseX = x0 + (x1 - x0) * t;
      const baseY = y0 + (y1 - y0) * t;
      const jitter = (Math.random() - 0.5) * 60 * Math.sin(t * Math.PI);
      pts.push({ x: baseX + jitter, y: baseY });
    }
    // Branches: 1–2 small forks off mid-points
    const branches = [];
    const branchCount = 1 + Math.floor(Math.random() * 2);
    for (let b = 0; b < branchCount; b++) {
      const startIdx = 2 + Math.floor(Math.random() * (pts.length - 4));
      const start = pts[startIdx];
      const branch = [start];
      const dir = (Math.random() < 0.5 ? -1 : 1);
      let bx = start.x, by = start.y;
      const blen = 3 + Math.floor(Math.random() * 4);
      for (let k = 0; k < blen; k++) {
        bx += dir * (15 + Math.random() * 30);
        by += 20 + Math.random() * 20;
        branch.push({ x: bx + (Math.random() - 0.5) * 20, y: by });
      }
      branches.push(branch);
    }
    return {
      pts, branches,
      life: 1,
      flicker: Math.random() * 0.4 + 0.6,
    };
  };

  let nextBoltAt = performance.now() + 600 + Math.random() * 2000;

  // ---------- draw ----------
  const drawPath = (points, alpha, width) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.lineWidth = width;
    ctx.strokeStyle = `rgba(143, 203, 58, ${alpha})`;
    ctx.shadowBlur = 14;
    ctx.shadowColor = `rgba(143, 203, 58, ${alpha * 0.9})`;
    ctx.stroke();
  };

  const drawBolt = (bolt) => {
    const flick = bolt.flicker * bolt.life;
    // Outer glow (thick, low alpha)
    drawPath(bolt.pts, 0.18 * flick, 8);
    // Core bright bolt
    drawPath(bolt.pts, 0.95 * flick, 1.4);
    // Branches
    bolt.branches.forEach((br) => {
      drawPath(br, 0.55 * flick, 0.9);
    });
  };

  const drawParticles = () => {
    // No shadow on particles (we get glow from globalCompositeOperation='lighter' below).
    // shadowBlur per-particle was ~3ms/frame for negligible visual gain.
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -5) p.x = w + 5;
      if (p.x > w + 5) p.x = -5;
      if (p.y < -5) p.y = h + 5;
      if (p.y > h + 5) p.y = -5;
      ctx.beginPath();
      ctx.fillStyle = `rgba(143, 203, 58, ${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // ---------- loop ----------
  let lastFrame = performance.now();
  let rafId = null;
  let isRunning = false;

  const tick = (now) => {
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;

    // Clear with very slight fade so particles trail subtly
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(10, 10, 10, 0.20)';
    ctx.fillRect(0, 0, w, h);

    // Composite for glow
    ctx.globalCompositeOperation = 'lighter';
    drawParticles();

    // Spawn bolts
    if (now > nextBoltAt) {
      bolts.push(generateBolt());
      // Sometimes a quick second strike
      if (Math.random() < 0.35) bolts.push(generateBolt());
      nextBoltAt = now + 1100 + Math.random() * 3400;
    }

    // Update + draw bolts
    for (let i = bolts.length - 1; i >= 0; i--) {
      const b = bolts[i];
      // Flicker decay
      b.flicker = Math.max(0.1, b.flicker - dt * 0.6);
      b.life -= dt * 1.6;
      if (b.life <= 0) {
        bolts.splice(i, 1);
        continue;
      }
      drawBolt(b);
    }

    ctx.globalCompositeOperation = 'source-over';
    if (isRunning) rafId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (isRunning) return;
    isRunning = true;
    lastFrame = performance.now();
    rafId = requestAnimationFrame(tick);
  };
  const stop = () => {
    isRunning = false;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  };

  // Only animate when the hero is in view. Saves ~6–10ms per frame everywhere else
  // on the page (the rest is GSAP scrubs + Lenis, which need the headroom).
  const hero = document.querySelector('.hero') || canvas.parentElement;
  if (hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0 }
    );
    io.observe(hero);
  } else {
    start();
  }

  // Pause when tab hidden to save battery
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && hero && hero.getBoundingClientRect().bottom > 0) {
      start();
    } else if (document.visibilityState !== 'visible') {
      stop();
    }
  });
})();
