/*
========================================
 Hero Network Animation
 Drifting nodes linked by lines; nodes
 react to the mouse.
========================================
*/

(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LINK_DIST = 130;
  const mouse = { x: null, y: null };

  let nodes = [];
  let w = 0;
  let h = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(90, Math.floor((w * h) / 9000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      hue: Math.random() < 0.5 ? "56,189,248" : "168,85,247"
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          ctx.strokeStyle = `rgba(${a.hue},${(1 - d / LINK_DIST) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (mouse.x !== null) {
        const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (d < 170) {
          ctx.strokeStyle = `rgba(74,222,128,${(1 - d / 170) * 0.7})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(${a.hue},0.9)`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  const hero = canvas.parentElement;

  hero.addEventListener("mousemove", e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  hero.addEventListener("mouseleave", () => {
    mouse.x = mouse.y = null;
  });

  window.addEventListener("resize", resize);

  resize();
  draw();
})();
