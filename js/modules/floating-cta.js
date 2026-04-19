/* ============================================================
   Floating CTA — appears after the user scrolls past hero
   ============================================================ */

export function initFloatingCTA() {
  const cta = document.getElementById("floating-cta");
  const hero = document.getElementById("hero");
  const finalCta = document.getElementById("final-cta");
  if (!cta || !hero) return;

  const update = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const scrolledPastHero = heroBottom < 120;

    // Hide when user reaches the final CTA (no need for floating button there)
    let overFinalCta = false;
    if (finalCta) {
      const r = finalCta.getBoundingClientRect();
      overFinalCta = r.top < window.innerHeight * 0.7 && r.bottom > 0;
    }

    if (scrolledPastHero && !overFinalCta) {
      cta.classList.add("is-visible");
    } else {
      cta.classList.remove("is-visible");
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}
