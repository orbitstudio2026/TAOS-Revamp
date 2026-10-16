import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

const PALETTE: Record<Tone, { stars: string[]; nebula: [string, string][]; alpha: [number, number]; density: number; sparkle: string }> = {
  light: {
    stars: ["163,108,155", "213,165,165", "198,180,154", "122,74,113"],
    nebula: [
      ["213,165,165", "0.16"],
      ["163,108,155", "0.10"],
      ["198,180,154", "0.12"],
    ],
    alpha: [0.35, 0.8],
    density: 9000,
    sparkle: "163,108,155",
  },
  dark: {
    stars: ["247,245,242", "213,165,165", "198,180,154", "241,226,224"],
    nebula: [
      ["163,108,155", "0.22"],
      ["213,165,165", "0.10"],
      ["122,74,113", "0.20"],
    ],
    alpha: [0.25, 0.9],
    density: 8500,
    sparkle: "241,226,224",
  },
};

interface Star {
  x: number;
  y: number;
  r: number;
  layer: number;
  color: string;
  base: number;
  phase: number;
  speed: number;
  sparkle: boolean;
}

const LAYER_PARALLAX = [0.02, 0.05, 0.1];

/**
 * Subtle animated cosmos: twinkling brand-coloured stars on three parallax layers,
 * drifting nebula light and an occasional slow shooting star. Canvas-based, throttled,
 * paused when offscreen or hidden, and static under reduced motion.
 */
export function Cosmos({ tone = "light", fixed = false, className }: { tone?: Tone; fixed?: boolean; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const p = PALETTE[tone];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let raf = 0;
    let last = 0;
    let visible = true;
    let shooting: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextShot = performance.now() + 4000 + Math.random() * 6000;

    const seed = () => {
      const count = Math.min(Math.round((w * h) / p.density), tone === "dark" ? 180 : 160);
      stars = Array.from({ length: count }, (_, i) => {
        const layer = i % 3;
        const sparkle = i % 14 === 0;
        return {
          x: Math.random(),
          y: Math.random(),
          r: sparkle ? 3.5 + Math.random() * 3 : 0.6 + Math.random() * (0.7 + layer * 0.55),
          layer,
          color: p.stars[Math.floor(Math.random() * p.stars.length)],
          base: p.alpha[0] + Math.random() * (p.alpha[1] - p.alpha[0]),
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.1,
          sparkle,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(performance.now());
    };

    const sparklePath = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.closePath();
    };

    const draw = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      // Nebula light — very soft, slowly drifting clouds.
      p.nebula.forEach(([rgb, a], i) => {
        const cx = w * (0.2 + 0.6 * ((i * 0.37 + 0.5 + 0.08 * Math.sin(t * 0.05 + i * 2)) % 1));
        const cy = h * (0.25 + 0.5 * ((i * 0.53 + 0.3 + 0.06 * Math.cos(t * 0.04 + i)) % 1));
        const rad = Math.max(w, h) * (0.35 + i * 0.08);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });

      const scroll = window.scrollY;
      for (const s of stars) {
        const drift = (scroll * LAYER_PARALLAX[s.layer]) % h;
        let y = s.y * h - drift;
        if (y < -10) y += h + 20;
        const x = s.x * w + Math.sin(t * 0.03 + s.phase) * 4;
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        const alpha = s.base * tw;
        if (s.sparkle) {
          ctx.fillStyle = `rgba(${p.sparkle},${alpha * 0.9})`;
          ctx.shadowColor = `rgba(${s.color},${alpha})`;
          ctx.shadowBlur = 8;
          sparklePath(x, y, s.r * (0.85 + 0.15 * tw));
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(${s.color},${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Occasional shooting star in rose-gold.
      if (!reduce) {
        if (!shooting && now > nextShot) {
          const fromLeft = Math.random() > 0.5;
          shooting = { x: fromLeft ? w * 0.1 : w * 0.9, y: h * (0.05 + Math.random() * 0.35), vx: (fromLeft ? 1 : -1) * w * 0.22, vy: h * 0.08, life: 0 };
        }
        if (shooting) {
          shooting.life += 1 / 30;
          const k = shooting.life / 1.6;
          const hx = shooting.x + shooting.vx * shooting.life;
          const hy = shooting.y + shooting.vy * shooting.life;
          const tx = hx - shooting.vx * 0.35;
          const ty = hy - shooting.vy * 0.35;
          const fade = Math.sin(Math.min(k, 1) * Math.PI);
          const g = ctx.createLinearGradient(tx, ty, hx, hy);
          g.addColorStop(0, "rgba(198,180,154,0)");
          g.addColorStop(1, `rgba(213,165,165,${(tone === "dark" ? 0.85 : 0.6) * fade})`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(hx, hy);
          ctx.stroke();
          if (k >= 1) {
            shooting = null;
            nextShot = now + 9000 + Math.random() * 8000;
          }
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 33) return;
      last = now;
      draw(now);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(canvas);
    resize();
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [tone]);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none inset-0 h-full w-full", fixed ? "fixed" : "absolute", className)} />;
}
