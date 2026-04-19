/* ============================================================
   Counters — count up to data-counter value on first view
   ============================================================ */

const DURATION = 1400;

export function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  if (!("IntersectionObserver" in window)) {
    counters.forEach(run);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => io.observe(el));
}

function run(el) {
  const target = parseFloat(el.dataset.counter);
  if (!Number.isFinite(target)) return;

  // Preserve the unit span if present
  const unitEl = el.querySelector(".readout__unit, .stat__unit");
  const unitHTML = unitEl ? unitEl.outerHTML : "";

  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.innerHTML = value + unitHTML;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
