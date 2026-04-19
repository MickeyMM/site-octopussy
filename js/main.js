/* ============================================================
   Octosystem.io — main entry point
   Loads modules and wires them up on DOMContentLoaded.
   ============================================================ */

import { initOctopusInteractions } from "./modules/octopus-interactions.js";
import { initScrollEffects }       from "./modules/scroll-effects.js";
import { initFloatingCTA }         from "./modules/floating-cta.js";
import { initReveal }              from "./modules/reveal.js";
import { initCounters }            from "./modules/counters.js";

const boot = () => {
  initOctopusInteractions();
  initScrollEffects();
  initFloatingCTA();
  initReveal();
  initCounters();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
