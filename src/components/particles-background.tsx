import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
};

/**
 * Fondo animado interactivo (partículas) para la home.
 * - Usa los colores de marca desde las variables CSS.
 * - Se simplifica en mobile y se desactiva con prefers-reduced-motion.
 * - pointer-events: none para no interferir con botones ni texto.
 */
export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const styles = getComputedStyle(document.documentElement);
    const brand = ["--brand-blue", "--brand-green", "--brand-yellow"]
      .map((v) => styles.getPropertyValue(v).trim())
      .filter(Boolean);
    const palette = brand.length ? brand : ["#3b82f6", "#22c55e", "#eab308"];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;

    const isMobile = () => window.innerWidth < 768;
    const pointer = { x: -9999, y: -9999, active: false };

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = Math.max(rect.height, window.innerHeight);
      dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = isMobile() ? 22000 : 12000;
      const count = Math.min(isMobile() ? 45 : 120, Math.round((width * height) / density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1 + Math.random() * 1.8,
        color: palette[Math.floor(Math.random() * palette.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const linkRadius = isMobile() ? 0 : 150;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 0.01) {
            const force = (1 - dist / 120) * 0.6;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.globalAlpha = 0.45;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Líneas finas hacia las partículas cercanas al cursor.
      if (pointer.active && linkRadius > 0) {
        const near = particles.filter(
          (p) => Math.hypot(p.x - pointer.x, p.y - pointer.y) < linkRadius,
        );
        ctx.lineWidth = 0.6;
        for (let i = 0; i < near.length; i++) {
          const a = near[i];
          const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          ctx.globalAlpha = (1 - d / linkRadius) * 0.5;
          ctx.strokeStyle = a.color;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();

          for (let j = i + 1; j < near.length; j++) {
            const b = near[j];
            const dd = Math.hypot(a.x - b.x, a.y - b.y);
            if (dd < 90) {
              ctx.globalAlpha = (1 - dd / 90) * 0.25;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 200);
    };

    setup();
    draw();
    if (!reduced) raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}