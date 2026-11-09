/* MyHomepage — lightweight interaction layer.
   No tracking, dependencies, or background network requests. */
(() => {
  "use strict";

  const year = String(new Date().getFullYear());
  for (const id of ["current-year", "footer-year"]) {
    const node = document.getElementById(id);
    if (node) node.textContent = year;
  }

  const menuButton = document.getElementById("menu-trigger");
  const mobileNav = document.getElementById("mobile-nav");

  function closeMobileMenu() {
    if (!menuButton || !mobileNav) return;
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
  }

  menuButton?.addEventListener("click", () => {
    if (!mobileNav) return;
    const isOpening = mobileNav.hidden;
    mobileNav.hidden = !isOpening;
    menuButton.setAttribute("aria-expanded", String(isOpening));
    menuButton.setAttribute("aria-label", isOpening ? "Fechar menu" : "Abrir menu");
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  const dialog = document.getElementById("command-dialog");
  const openCommand = document.getElementById("open-command");
  function openPalette() {
    if (dialog instanceof HTMLDialogElement && !dialog.open) {
      dialog.showModal();
      dialog.querySelector("a")?.focus();
    }
  }
  openCommand?.addEventListener("click", openPalette);
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openPalette();
    }
    if (event.key === "Escape") closeMobileMenu();
  });
  if (dialog instanceof HTMLDialogElement) {
    dialog.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => dialog.close());
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const projectCards = [...document.querySelectorAll(".project[data-category]")];
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const chosen = button.dataset.filter;
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      projectCards.forEach((card) => {
        card.hidden = chosen !== "todos" && card.dataset.category !== chosen;
      });
    });
  });

  const canvas = document.getElementById("signal-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    width: 0,
    height: 0,
    visible: true,
    playing: false,
    pointerX: -10000,
    pointerY: -10000,
    frame: 0,
    lastFrame: 0,
    points: [],
  };

  // Predictable node distribution across visits. The drawing is illustrative,
  // not a visualization of actual financial/research data.
  let seed = 2481;
  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  function makePoints() {
    seed = 2481;
    const count = Math.min(76, Math.max(34, Math.floor((state.width * state.height) / 3400)));
    state.points = Array.from({ length: count }, (_, index) => ({
      x: random() * state.width,
      y: random() * state.height,
      radius: 1 + random() * 1.8,
      offset: random() * Math.PI * 2,
      speed: 0.25 + random() * 0.4,
      phase: index * 0.17,
    }));
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;
    state.width = bounds.width;
    state.height = bounds.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * dpr);
    canvas.height = Math.round(bounds.height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    makePoints();
    if (reducedMotion.matches) draw(0);
  }

  function draw(timestamp) {
    const { width, height, points } = state;
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    const t = reducedMotion.matches ? 0 : timestamp / 1000;
    const transformed = points.map((point) => {
      const dx = reducedMotion.matches ? 0 : Math.sin(t * point.speed + point.offset) * 6;
      const dy = reducedMotion.matches ? 0 : Math.cos(t * point.speed + point.phase) * 7;
      return { x: point.x + dx, y: point.y + dy, radius: point.radius };
    });

    for (let i = 0; i < transformed.length; i++) {
      const p = transformed[i];
      for (let j = i + 1; j < transformed.length; j++) {
        const q = transformed[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 97) continue;
        const midX = (p.x + q.x) / 2;
        const midY = (p.y + q.y) / 2;
        const pointerDistance = Math.hypot(midX - state.pointerX, midY - state.pointerY);
        const highlight = pointerDistance < 110 ? 0.25 : 0;
        const alpha = Math.max(0, (1 - distance / 97) * 0.24 + highlight);
        context.strokeStyle = "rgba(153, 191, 255, " + alpha.toFixed(3) + ")";
        context.lineWidth = highlight ? 1.2 : 0.8;
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.lineTo(q.x, q.y);
        context.stroke();
      }
      const pointerDist = Math.hypot(p.x - state.pointerX, p.y - state.pointerY);
      const highlighted = pointerDist < 95;
      context.beginPath();
      context.arc(p.x, p.y, p.radius + (highlighted ? 1 : 0), 0, Math.PI * 2);
      context.fillStyle = highlighted ? "#cbe0ff" : "rgba(153, 191, 255, .76)";
      context.fill();
    }

    const gradient = context.createRadialGradient(width * .5, height * .5, 0, width * .5, height * .5, width * .42);
    gradient.addColorStop(0, "rgba(80, 116, 215, .14)");
    gradient.addColorStop(1, "rgba(80, 116, 215, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function tick(timestamp) {
    state.frame = 0;
    if (!state.playing) return;
    if (timestamp - state.lastFrame >= 32) {
      draw(timestamp);
      state.lastFrame = timestamp;
    }
    state.frame = window.requestAnimationFrame(tick);
  }

  function syncAnimation() {
    const shouldAnimate = state.visible && !document.hidden && !reducedMotion.matches;
    if (shouldAnimate === state.playing) {
      if (!shouldAnimate) draw(0);
      return;
    }
    state.playing = shouldAnimate;
    if (shouldAnimate) {
      state.lastFrame = 0;
      state.frame = window.requestAnimationFrame(tick);
    } else {
      window.cancelAnimationFrame(state.frame);
      state.frame = 0;
      draw(0);
    }
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    state.pointerX = event.clientX - rect.left;
    state.pointerY = event.clientY - rect.top;
  });
  canvas.addEventListener("pointerleave", () => {
    state.pointerX = -10000;
    state.pointerY = -10000;
  });
  document.addEventListener("visibilitychange", syncAnimation);
  reducedMotion.addEventListener("change", syncAnimation);

  const visibilityObserver = new IntersectionObserver((entries) => {
    state.visible = entries[0]?.isIntersecting ?? false;
    syncAnimation();
  }, { threshold: 0.01 });
  visibilityObserver.observe(canvas);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  syncAnimation();

  window.addEventListener("pagehide", () => {
    state.playing = false;
    window.cancelAnimationFrame(state.frame);
    visibilityObserver.disconnect();
    resizeObserver.disconnect();
  }, { once: true });
})();
