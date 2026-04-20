/* ============================================================
   Scroll effects — минимальные эффекты, не связанные с GSAP.
   Орбы и hero__grid теперь анимируются через ScrollTrigger
   в scroll-pin.js — здесь только fallback, если GSAP не загрузился.
   ============================================================ */

export function initScrollEffects() {
  // Если GSAP доступен — паралакс орбов/сетки управляется в scroll-pin.js
  if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
    return;
  }

  // Fallback: простой параллакс на нативном скролле
  const orbs = document.querySelectorAll(".ambient-glow__orb");
  const heroGrid = document.querySelector(".hero__grid");
  if (!orbs.length && !heroGrid) return;

  let ticking = false;
  let lastY = window.scrollY;

  const onScroll = () => {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  const update = () => {
    const y = lastY;
    if (heroGrid) heroGrid.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
    orbs.forEach((orb, i) => {
      const rate = i === 0 ? 0.12 : -0.08;
      orb.style.transform = `translate3d(0, ${y * rate}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}
