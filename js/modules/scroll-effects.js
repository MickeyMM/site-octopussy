/* ============================================================
   Scroll effects — parallax on the octopus + ambient orbs
   ============================================================ */

export function initScrollEffects() {
  const octopus = document.querySelector(".octopus");
  const orbs = document.querySelectorAll(".ambient-glow__orb");
  const heroGrid = document.querySelector(".hero__grid");

  if (!octopus && !orbs.length && !heroGrid) return;

  let ticking = false;
  let lastY = window.scrollY;

  const onScroll = () => {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  // Проверяем режим pin — если он активен на десктопе,
  // parallax на октопусе/сетке отключается, чтобы не конфликтовать с GSAP pin.
  const pinActive =
    typeof window.matchMedia === "function" &&
    !window.matchMedia("(hover: none), (pointer: coarse)").matches &&
    window.innerWidth >= 900;

  const update = () => {
    const y = lastY;

    // Hero grid — лёгкий parallax оставляем только в мобильном режиме (без pin)
    if (heroGrid && !pinActive) {
      heroGrid.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
    }

    // Orbs — всегда работают, визуально создают глубину
    orbs.forEach((orb, i) => {
      const rate = i === 0 ? 0.12 : -0.08;
      orb.style.transform = `translate3d(0, ${y * rate}px, 0)`;
    });

    ticking = false;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}
