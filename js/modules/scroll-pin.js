/* ============================================================
   Scroll-Pin — эффект "блоки прилетают к зрителю"
   Каждая секция pin'ится на время анимации её контента.
   ============================================================ */

export function initScrollPin() {
  console.log("[scroll-pin] init…");

  if (typeof window.gsap === "undefined") {
    console.error("[scroll-pin] ❌ GSAP не загружен — проверь CDN / интернет");
    return;
  }
  if (typeof window.ScrollTrigger === "undefined") {
    console.error("[scroll-pin] ❌ ScrollTrigger не загружен");
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add("gsap-ready");

  console.log("[scroll-pin] ✅ GSAP + ScrollTrigger готовы, v" + gsap.version);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Lenis — плавный скролл с инерцией (если CDN загрузился)
  if (window.Lenis && !reducedMotion) initLenis(gsap, ScrollTrigger);

  // Упрощённый режим на мобилках / touch / reduced-motion
  const isMobile =
    window.innerWidth < 900 ||
    window.matchMedia("(hover: none), (pointer: coarse)").matches ||
    reducedMotion;

  if (isMobile) {
    console.log("[scroll-pin] mobile mode — используем простой reveal");
    initMobileReveal(gsap);
    return;
  }

  initDesktop(gsap, ScrollTrigger);
}

function initLenis(gsap, ScrollTrigger) {
  const lenis = new window.Lenis({
    lerp: 0.12,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.1,
    touchMultiplier: 2,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
  console.log("[scroll-pin] ✅ Lenis активен (инерция скролла)");
}

/* ------------------------------------------------------------
   Desktop: pin каждой секции + анимация контента
   ------------------------------------------------------------ */
function initDesktop(gsap, ScrollTrigger) {
  const sections = [
    { sel: "#hero",         anim: animateHero         },
    { sel: "#diagnosis",    anim: animateDiagnosis    },
    { sel: "#capture",      anim: animateCapture      },
    { sel: "#intelligence", anim: animateIntelligence },
    { sel: "#authority",    anim: animateAuthority    },
    { sel: "#final-cta",    anim: animateFinalCTA     },
  ];

  sections.forEach(({ sel, anim }) => {
    const section = document.querySelector(sel);
    if (!section) {
      console.warn("[scroll-pin] section not found:", sel);
      return;
    }
    section.classList.add("scroll-pin");

    // Анимация въезда контента (fire один раз при входе в viewport)
    anim(gsap, section);

    // Анимация ухода — секция "растворяется" когда уходит вверх
    gsap.to(section, {
      opacity: 0.15,
      scale: 0.92,
      filter: "blur(8px)",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "bottom 80%",   // когда низ секции в 80% viewport
        end: "bottom 20%",     // до 20% viewport
        scrub: true,
      },
    });
  });

  // Refresh после загрузки шрифтов/картинок
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("load", () => ScrollTrigger.refresh());

  console.log("[scroll-pin] desktop anims bound for", sections.length, "sections");
}

/* ------------------------------------------------------------
   Анимации каждой секции
   ------------------------------------------------------------ */
function animateHero(gsap, section) {
  const items = [
    section.querySelector(".hero__meta"),
    section.querySelector(".hero__title"),
    section.querySelector(".hero__subtitle"),
    section.querySelector(".hero__module"),
    section.querySelector(".hero__cta-row"),
    section.querySelector(".hero__readouts"),
  ].filter(Boolean);

  gsap.from(items, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.14,
  });
}

function animateDiagnosis(gsap, section) {
  const head = section.querySelector(".section__head");
  const cards = section.querySelectorAll(".diag-card");
  const footer = section.querySelector(".diagnosis__footer");
  const trigger = enterTrigger(section);

  if (head) gsap.from(head, { y: 40, opacity: 0, duration: 0.8, ease: "power2.out", scrollTrigger: trigger });
  if (cards[0]) gsap.from(cards[0], { x: -150, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: trigger });
  if (cards[1]) gsap.from(cards[1], { x: 150, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: trigger });
  if (footer) gsap.from(footer, { y: 30, opacity: 0, duration: 0.8, delay: 0.4, ease: "power2.out", scrollTrigger: trigger });
}

function animateCapture(gsap, section) {
  const head = section.querySelector(".section__head");
  const rows = section.querySelectorAll(".feat-row");
  const trigger = enterTrigger(section);

  if (head) gsap.from(head, { y: 40, opacity: 0, duration: 0.8, ease: "power2.out", scrollTrigger: trigger });
  if (rows.length) gsap.from(rows, {
    y: 80, opacity: 0, duration: 0.9, ease: "power3.out",
    stagger: 0.2, scrollTrigger: trigger,
  });
}

function animateIntelligence(gsap, section) {
  const head = section.querySelector(".section__head");
  const cards = section.querySelectorAll(".intel-card");
  const trigger = enterTrigger(section);

  if (head) gsap.from(head, { y: 40, opacity: 0, duration: 0.8, ease: "power2.out", scrollTrigger: trigger });
  if (cards.length) gsap.from(cards, {
    y: -80, opacity: 0, scale: 0.9, duration: 1, ease: "power3.out",
    stagger: 0.17, scrollTrigger: trigger,
  });
}

function animateAuthority(gsap, section) {
  const content = section.querySelector(".authority__content");
  const meta = section.querySelector(".authority__meta");
  const stats = section.querySelectorAll(".stat");
  const trigger = enterTrigger(section);

  if (meta) gsap.from(meta, { x: -60, opacity: 0, duration: 0.9, ease: "power2.out", scrollTrigger: trigger });
  if (content) gsap.from(content, { x: 60, opacity: 0, duration: 1, ease: "power2.out", scrollTrigger: trigger });
  if (stats.length) gsap.from(stats, {
    y: 40, opacity: 0, duration: 0.7, stagger: 0.12, delay: 0.5,
    ease: "power2.out", scrollTrigger: trigger,
  });
}

function animateFinalCTA(gsap, section) {
  const inner = section.querySelector(".final-cta__inner");
  const btn = section.querySelector(".btn");
  const trigger = enterTrigger(section);

  if (inner) gsap.from(inner, {
    scale: 0.8, opacity: 0, duration: 1.2, ease: "power3.out",
    scrollTrigger: trigger,
  });
  if (btn) gsap.from(btn, {
    scale: 0.6, opacity: 0, duration: 0.9, delay: 0.5,
    ease: "back.out(1.8)", scrollTrigger: trigger,
  });
}

/* ------------------------------------------------------------
   Хелперы
   ------------------------------------------------------------ */
function enterTrigger(section) {
  return {
    trigger: section,
    start: "top 75%",
    toggleActions: "play none none reverse",
  };
}

function initMobileReveal(gsap) {
  const blocks = document.querySelectorAll(
    ".section__head, .diag-card, .feat-row, .intel-card, .authority__content, .final-cta__inner, .stat"
  );
  blocks.forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
    });
  });
}
