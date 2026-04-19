/* ============================================================
   Octopus interactions — mouse-follow eyes, tentacle drift
   ============================================================ */

const EYE_MAX_OFFSET = 6;         // px, how far pupils can translate
const HIGHLIGHT_OFFSET = 4;       // px, slightly less for highlight

export function initOctopusInteractions() {
  const stage = document.getElementById("octopus-stage");
  if (!stage) return;

  const eyes = stage.querySelectorAll(".eye");
  if (!eyes.length) return;

  // Track mouse position relative to viewport, then compute per-eye vector
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  const onMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateEyes();
  };

  const updateEyes = () => {
    eyes.forEach((eye) => {
      const rect = eye.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.hypot(dx, dy);
      const factor = dist === 0 ? 0 : 1;
      const nx = (dx / (dist || 1));
      const ny = (dy / (dist || 1));

      const pupil = eye.querySelector(".eye__pupil");
      const highlight = eye.querySelector(".eye__highlight");
      if (pupil) {
        pupil.setAttribute(
          "transform",
          `translate(${nx * EYE_MAX_OFFSET * factor}, ${ny * EYE_MAX_OFFSET * factor})`
        );
      }
      if (highlight) {
        highlight.setAttribute(
          "transform",
          `translate(${nx * HIGHLIGHT_OFFSET * factor}, ${ny * HIGHLIGHT_OFFSET * factor})`
        );
      }
    });
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  // Also refresh on scroll — eye positions change in the viewport
  window.addEventListener("scroll", updateEyes, { passive: true });
  window.addEventListener("resize", updateEyes);

  updateEyes();
}
