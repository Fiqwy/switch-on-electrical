/* ==========================================================
   SWITCH ON ELECTRICAL — Safety Quiz
   5 questions, score 0–15, mapped to risk tier + tailored CTA.
   ========================================================== */

(function () {
  'use strict';

  const quiz = document.querySelector('.quiz');
  if (!quiz) return;

  const steps = quiz.querySelectorAll('.quiz-step');
  const progress = quiz.querySelectorAll('.quiz-progress span');
  const resultEl = quiz.querySelector('[data-result]');
  const scoreEl = quiz.querySelector('[data-score]');
  const titleEl = quiz.querySelector('[data-result-title]');
  const bodyEl = quiz.querySelector('[data-result-body]');
  const ctaEl = quiz.querySelector('[data-result-cta]');
  const restartBtn = quiz.querySelector('[data-restart]');
  const ringFg = quiz.querySelector('.ring-fg');

  let answers = [];
  let current = 0;
  const MAX = 5 * 3; // 15

  // ----- result tiers -----
  const tiers = [
    {
      min: 12,
      title: 'Low risk — nicely done',
      body: 'Your home electrical setup is in solid shape against current QLD standards. We\'d recommend a 5-year compliance check to keep it that way — and we\'re happy to come and quote that for free if you\'d like a second opinion.',
      cta: 'Book a 5-year safety check',
      service: 'Safety switches / RCDs',
    },
    {
      min: 8,
      title: 'Medium risk — a few things to tidy up',
      body: 'Your setup is functional, but there are a few items worth attending to — likely a safety switch upgrade, smoke alarm compliance, or a lighting refresh. Nothing alarming, but worth a quote before something becomes an inconvenience.',
      cta: 'Get a tailored quote',
      service: 'Not sure yet',
    },
    {
      min: 0,
      title: 'Higher risk — worth getting eyes on it',
      body: 'A few of your answers suggest the electrical setup is well behind current QLD standards — old switchboard, no RCDs, halogen lighting, or no recent inspection. We\'d strongly recommend a free on-site assessment so we can show you exactly what\'s safe, what\'s not, and what it\'d cost to put right.',
      cta: 'Book a free safety check',
      service: 'Switchboard upgrade',
    },
  ];

  const tierFor = (score) => tiers.find((t) => score >= t.min);

  // ----- show step -----
  const showStep = (idx) => {
    steps.forEach((s, i) => s.classList.toggle('active', i === idx));
    progress.forEach((p, i) => {
      p.classList.toggle('active', i === idx);
      p.classList.toggle('completed', i < idx);
    });
    current = idx;
  };

  // ----- show result -----
  const showResult = () => {
    const score = answers.reduce((a, b) => a + b, 0);
    const pct = Math.round((score / MAX) * 100);
    const tier = tierFor(score);

    steps.forEach((s) => s.classList.remove('active'));
    progress.forEach((p) => p.classList.add('completed'));
    resultEl.classList.add('show');

    scoreEl.textContent = `${pct}%`;
    titleEl.textContent = tier.title;
    bodyEl.textContent = tier.body;
    ctaEl.textContent = tier.cta + ' →';
    ctaEl.href = `?service=${encodeURIComponent(tier.service)}#contact`;

    // Animate the ring (circumference = 2π × 52 ≈ 326.7)
    if (ringFg) {
      const circ = 2 * Math.PI * 52;
      const offset = circ - (circ * pct) / 100;
      requestAnimationFrame(() => {
        ringFg.style.strokeDasharray = circ;
        ringFg.style.strokeDashoffset = offset;
      });
    }
  };

  // ----- bind options -----
  steps.forEach((step, stepIdx) => {
    step.querySelectorAll('.quiz-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        const value = parseInt(opt.dataset.value, 10);
        answers[stepIdx] = value;

        // Visual selected state
        step.querySelectorAll('.quiz-option').forEach((o) => o.classList.remove('selected'));
        opt.classList.add('selected');

        // Advance after 350ms so the selected state is felt
        setTimeout(() => {
          if (stepIdx + 1 < steps.length) {
            showStep(stepIdx + 1);
          } else {
            showResult();
          }
        }, 350);
      });
    });
  });

  // ----- restart -----
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      answers = [];
      resultEl.classList.remove('show');
      progress.forEach((p) => p.classList.remove('completed', 'active'));
      quiz.querySelectorAll('.quiz-option.selected').forEach((o) => o.classList.remove('selected'));
      if (ringFg) {
        const circ = 2 * Math.PI * 52;
        ringFg.style.strokeDashoffset = circ;
      }
      showStep(0);
    });
  }

  // ----- keyboard nav within steps -----
  quiz.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const focused = document.activeElement;
    if (focused?.classList.contains('quiz-option')) {
      e.preventDefault();
      focused.click();
    }
  });

  // init
  showStep(0);
})();
