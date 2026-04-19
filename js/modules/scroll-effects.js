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

  const update = () => {
    const y = lastY;

    // Octopus — slower than scroll (parallax)
    if (octopus) {
      octopus.style.transform = `translate3d(0, ${y * -0.18}px, 0)`;
    }

    // Hero grid — slight parallax
    if (heroGrid) {
      heroGrid.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
    }

    // Orbs — each moves at different rate for depth
    orbs.forEach((orb, i) => {
      const rate = i === 0 ? 0.12 : -0.08;
      orb.style.transform = `translate3d(0, ${y * rate}px, 0)`;
    });

    ticking = false;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}
