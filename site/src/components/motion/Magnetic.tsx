// Adapted from 21st.dev "Magnetic" by ibelick — https://21st.dev/@ibelick/components/magnetic
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, type SpringOptions } from "motion/react";

const SPRING: SpringOptions = { stiffness: 180, damping: 15, mass: 0.3 };

export function Magnetic({
  children,
  intensity = 0.35,
  range = 110,
  className,
}: {
  children: ReactNode;
  intensity?: number;
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  useEffect(() => {
    if (!active || reduce) return;
    const move = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      const f = d <= range ? 1 - d / range / 2 : 0;
      x.set(dx * intensity * f);
      y.set(dy * intensity * f);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [active, intensity, range, reduce, x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(true)}
      onPointerLeave={() => {
        setActive(false);
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
