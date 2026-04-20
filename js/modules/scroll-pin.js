/* ============================================================
   Scroll animations — ВЕСЬ эффект привязан к скроллу (scrub):
   - вход блоков: элементы плывут на место по мере приближения
   - выход: растворяются в блюр по мере ухода вверх
   - фон: орбы двигаются медленнее скролла (параллакс глубины)
   ============================================================ */

export function initScrollPin() {
  console.log("[scroll] init…");

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const Lenis = window.Lenis;

  if (!gsap || !ScrollTrigger) {
    console.error("[scroll] ❌ GSAP/ScrollTrigger не загружены");
    document.body.classList.add("gsap-fallback");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add("gsap-ready");
  console.log("[scroll] ✅ GSAP v" + gsap.version);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) Lenis — плавный скролл с инерцией
  if (Lenis && !reducedMotion) initLenis(gsap, ScrollTrigger, Lenis);

  // 2) Hero — анимация на загрузке страницы
  animateHeroOnLoad(gsap);

  // 3) Все остальные секции — scrub-анимации (вход + выход)
  animateDiagnosis(gsap);
  animateCapture(gsap);
  animateIntelligence(gsap);
  animateAuthority(gsap);
  animateFinalCTA(gsap);

  // 4) Фоновый паралакс — орбы, сетка
  addBackgroundParallax(gsap);

  // 5) Рефреш после полной загрузки
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

/* ------------------------------------------------------------
   Lenis — плавный скролл с инерцией
   ------------------------------------------------------------ */
function initLenis(gsap, ScrollTrigger, Lenis) {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 1,
    lerp: 0.1,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  window.__lenis = lenis;
  console.log("[scroll] ✅ Lenis активен (инерция скролла)");
}

/* ------------------------------------------------------------
   Hero — анимация на загрузке
   ------------------------------------------------------------ */
function animateHeroOnLoad(gsap) {
  const section = document.querySelector('[data-anim="hero"]');
  if (!section) return;
  gsap.set(section, { opacity: 1 });

  const items = [
    section.querySelector(".hero__meta"),
    section.querySelector(".hero__title"),
    section.querySelector(".hero__subtitle"),
    section.querySelector(".hero__module"),
    section.querySelector(".hero__cta-row"),
    section.querySelector(".hero__readouts"),
  ].filter(Boolean);

  gsap.fromTo(
    items,
    { opacity: 0, y: 70 },
    { opacity: 1, y: 0, duration: 1.1, ease: "power4.out", stagger: 0.13, delay: 0.15 }
  );
}

/* ------------------------------------------------------------
   Хелперы — вход и выход со scrub
   ------------------------------------------------------------ */
// Элемент плывёт на место по мере появления в viewport
function scrubEntry(gsap, el, fromState) {
  if (!el) return;
  gsap.fromTo(
    el,
    fromState,
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      filter: "blur(0px)",
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",   // элемент только появился снизу
        end: "top 65%",        // доплыл до 65% viewport
        scrub: 1,
        invalidateOnRefresh: true,
      },
    }
  );
}

// Элемент улетает вверх и размывается при уходе.
// Используем top-anchored старт, чтобы гарантировать —
// вход ВСЕГДА завершается раньше, чем выход начинается
// (особенно важно для коротких блоков).
function scrubExit(gsap, el, toState) {
  if (!el) return;
  gsap.to(el, {
    ...toState,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top 15%",      // элемент уже в верхней четверти экрана — время читать закончилось
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
}

/* ------------------------------------------------------------
   Диагноз — заголовок, две карточки, итог
   ------------------------------------------------------------ */
function animateDiagnosis(gsap) {
  const section = document.querySelector('[data-anim="diagnosis"]');
  if (!section) return;
  gsap.set(section, { opacity: 1 });

  const head = section.querySelector(".section__head");
  const cards = section.querySelectorAll(".diag-card");
  const footer = section.querySelector(".diagnosis__footer");

  scrubEntry(gsap, head, { opacity: 0, y: 80, scale: 0.95 });
  scrubEntry(gsap, cards[0], { opacity: 0, x: -180, y: 60, scale: 0.9, rotateY: -12 });
  scrubEntry(gsap, cards[1], { opacity: 0, x: 180, y: 60, scale: 0.9, rotateY: 12 });
  scrubEntry(gsap, footer, { opacity: 0, y: 50, scale: 0.95 });

  scrubExit(gsap, head, { opacity: 0, y: -40, filter: "blur(6px)" });
  scrubExit(gsap, cards[0], { opacity: 0.15, y: -80, scale: 0.95, filter: "blur(8px)" });
  scrubExit(gsap, cards[1], { opacity: 0.15, y: -110, scale: 0.95, filter: "blur(8px)" });
  scrubExit(gsap, footer, { opacity: 0, y: -60, filter: "blur(6px)" });
}

/* ------------------------------------------------------------
   Capture — заголовок + 3 строки
   ------------------------------------------------------------ */
function animateCapture(gsap) {
  const section = document.querySelector('[data-anim="capture"]');
  if (!section) return;
  gsap.set(section, { opacity: 1 });

  const head = section.querySelector(".section__head");
  const rows = section.querySelectorAll(".feat-row");

  scrubEntry(gsap, head, { opacity: 0, y: 80, scale: 0.95 });
  rows.forEach((row, i) => {
    scrubEntry(gsap, row, {
      opacity: 0,
      y: 120 + i * 30,           // нижние строки идут с бóльшего расстояния
      x: i % 2 === 0 ? -60 : 60, // поочерёдно слева/справа
      scale: 0.92,
    });
  });

  scrubExit(gsap, head, { opacity: 0, y: -40, filter: "blur(6px)" });
  rows.forEach((row, i) => {
    scrubExit(gsap, row, {
      opacity: 0.15,
      y: -70 - i * 20,           // разная скорость ухода — паралакс
      scale: 0.94,
      filter: "blur(7px)",
    });
  });
}

/* ------------------------------------------------------------
   Intelligence — 3 карточки "падают" сверху
   ------------------------------------------------------------ */
function animateIntelligence(gsap) {
  const section = document.querySelector('[data-anim="intelligence"]');
  if (!section) return;
  gsap.set(section, { opacity: 1 });

  const head = section.querySelector(".section__head");
  const cards = section.querySelectorAll(".intel-card");

  scrubEntry(gsap, head, { opacity: 0, y: 80, scale: 0.95 });
  cards.forEach((card, i) => {
    scrubEntry(gsap, card, {
      opacity: 0,
      y: -150 - (i === 1 ? 50 : 0),   // центральная падает с большей высоты
      scale: 0.85,
      rotateX: -15,
    });
  });

  scrubExit(gsap, head, { opacity: 0, y: -40, filter: "blur(6px)" });
  cards.forEach((card, i) => {
    scrubExit(gsap, card, {
      opacity: 0.15,
      y: -90 - (i === 1 ? 40 : 0),
      scale: 0.94,
      filter: "blur(8px)",
    });
  });
}

/* ------------------------------------------------------------
   Authority — мета слева, контент справа, статы снизу
   ------------------------------------------------------------ */
function animateAuthority(gsap) {
  const section = document.querySelector('[data-anim="authority"]');
  if (!section) return;
  gsap.set(section, { opacity: 1 });

  const meta = section.querySelector(".authority__meta");
  const content = section.querySelector(".authority__content");
  const stats = section.querySelectorAll(".stat");

  scrubEntry(gsap, meta, { opacity: 0, x: -120, y: 40, scale: 0.95 });
  scrubEntry(gsap, content, { opacity: 0, x: 100, y: 60, scale: 0.95 });
  stats.forEach((stat, i) => {
    scrubEntry(gsap, stat, {
      opacity: 0,
      y: 80 + i * 20,
      scale: 0.9,
    });
  });

  scrubExit(gsap, meta, { opacity: 0, y: -60, filter: "blur(7px)" });
  scrubExit(gsap, content, { opacity: 0.2, y: -90, scale: 0.96, filter: "blur(8px)" });
  stats.forEach((stat, i) => {
    scrubExit(gsap, stat, { opacity: 0, y: -40 - i * 15, filter: "blur(5px)" });
  });
}

/* ------------------------------------------------------------
   Final CTA — центральный zoom + кнопка
   ------------------------------------------------------------ */
function animateFinalCTA(gsap) {
  const section = document.querySelector('[data-anim="final-cta"]');
  if (!section) return;
  gsap.set(section, { opacity: 1 });

  const inner = section.querySelector(".final-cta__inner");
  const title = section.querySelector(".final-cta__title");
  const text = section.querySelector(".final-cta__text");
  const btn = section.querySelector(".btn");

  scrubEntry(gsap, inner, { opacity: 0, y: 100, scale: 0.85 });
  scrubEntry(gsap, title, { opacity: 0, y: 60, scale: 0.95 });
  scrubEntry(gsap, text, { opacity: 0, y: 40 });
  scrubEntry(gsap, btn, { opacity: 0, y: 50, scale: 0.7 });

  // Выход — финальный блок, улетает меньше (пользователь обычно не пролистывает дальше)
  scrubExit(gsap, inner, { opacity: 0.3, y: -60, scale: 0.95, filter: "blur(6px)" });
}

/* ------------------------------------------------------------
   Фоновый паралакс — орбы и декоративные слои
   двигаются медленнее/быстрее скролла, создавая глубину
   ------------------------------------------------------------ */
function addBackgroundParallax(gsap) {
  // Золотые орбы (ambient glow)
  const orbs = document.querySelectorAll(".ambient-glow__orb");
  orbs.forEach((orb, i) => {
    gsap.to(orb, {
      y: i === 0 ? -400 : 300,
      x: i === 0 ? 80 : -60,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });
  });

  // Hero сетка — лёгкий дрейф при скролле
  const heroGrid = document.querySelector(".hero__grid");
  if (heroGrid) {
    gsap.to(heroGrid, {
      y: 200,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  }
}
