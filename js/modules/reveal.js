/* ============================================================
   Reveal on scroll — applies .is-visible to section content
   ============================================================ */

export function initReveal() {
  // Auto-tag commonly revealed blocks
  const targets = document.querySelectorAll(
    ".section__head, .diag-card, .feat-row, .intel-card, .stat, .final-cta__inner, .authority__content, .hero__readouts"
  );

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", `${(i % 6) * 80}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((el) => io.observe(el));
}
