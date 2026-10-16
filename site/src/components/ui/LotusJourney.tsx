import { asset } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

// Path keyframes as fractions of the viewport (x = left edge of the flower, y = top).
// It begins in the top-left corner and weaves an S-curve through the side margins,
// crossing the page diagonally only briefly.
const STOPS = [0, 0.14, 0.3, 0.46, 0.62, 0.78, 0.9, 1];
const XS = [0.015, 0.03, 0.97, 0.98, 0.02, 0.02, 0.97, 0.96];
const YS = [0.13, 0.3, 0.38, 0.6, 0.5, 0.72, 0.62, 0.8];

const smooth = (t: number) => t * t * (3 - 2 * t);

function along(stops: number[], values: number[], p: number) {
  if (p <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const k = smooth((p - stops[i - 1]) / (stops[i] - stops[i - 1]));
      return values[i - 1] + (values[i] - values[i - 1]) * k;
    }
  }
  return values[values.length - 1];
}

/** The pink lotus travels through every page with the scroll, starting top-left. */
export function LotusJourney() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 55, damping: 20, mass: 0.6 });
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const mobile = vp.w < 768;
  const size = mobile ? 52 : vp.w < 1280 ? 104 : 128;
  // On phones the gutters are narrow, so the flower rides half-tucked into the screen edge.
  const tuck = mobile ? size * 0.42 : 0;
  const box = useRef({ ...vp, size, tuck });
  box.current = { ...vp, size, tuck };

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Gentle pointer drift.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const dx = useSpring(mx, { stiffness: 40, damping: 16 });
  const dy = useSpring(my, { stiffness: 40, damping: 16 });
  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 24);
      my.set((e.clientY / window.innerHeight - 0.5) * 24);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my, reduce]);

  const x = useTransform(progress, (p) => {
    const f = along(STOPS, XS, p);
    const { w, size: s, tuck: t } = box.current;
    return f * (w - s + 2 * t) - t;
  });
  const y = useTransform(progress, (p) => along(STOPS, YS, p) * (box.current.h - box.current.size));
  const rotate = useTransform(progress, (p) => p * 540);
  const scale = useTransform(progress, (p) => 1 + 0.1 * Math.sin(p * Math.PI * 8));
  const glow = useTransform(progress, (p) => 0.35 + 0.25 * Math.sin(p * Math.PI * 6));
  const fx = useTransform([x, dx], ([a, b]: number[]) => a + b);
  const fy = useTransform([y, dy], ([a, b]: number[]) => a + b);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[45] select-none"
      style={reduce ? { x: mobile ? -tuck : 16, y: vp.h * 0.13, width: size, height: size } : { x: fx, y: fy, width: size, height: size }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: mobile ? 0.8 : 0.95, scale: 1 }}
      transition={{ duration: 1.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute -inset-1/3 rounded-full bg-[radial-gradient(circle,rgba(213,165,165,0.55)_0%,rgba(163,108,155,0.18)_45%,transparent_70%)] blur-xl"
        style={reduce ? undefined : { opacity: glow }}
      />
      <motion.img
        src={asset("assets/lotus-mandala.webp")}
        alt=""
        draggable={false}
        className="relative h-full w-full object-contain drop-shadow-[0_10px_24px_rgba(122,74,113,0.35)]"
        style={reduce ? undefined : { rotate, scale }}
      />
    </motion.div>
  );
}
