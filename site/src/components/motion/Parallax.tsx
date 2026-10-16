import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  /** Pixels travelled across the element's viewport pass. Negative moves against scroll. */
  speed?: number;
  rotate?: number;
  scale?: [number, number];
  className?: string;
}

/** Scroll-linked parallax layer (motion useScroll). */
export function Parallax({ children, speed = 80, rotate = 0, scale, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const y = useTransform(smooth, [0, 1], [speed, -speed]);
  const r = useTransform(smooth, [0, 1], [-rotate, rotate]);
  const s = useTransform(smooth, [0, 1], scale ?? [1, 1]);

  return (
    <motion.div ref={ref} className={cn("will-change-transform", className)} style={reduce ? undefined : { y, rotate: r, scale: s }}>
      {children}
    </motion.div>
  );
}

/** Image that drifts inside its clipping frame as it scrolls past. */
export function ParallaxImage({ src, alt, className, imgClassName, amount = 12 }: { src: string; alt: string; className?: string; imgClassName?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.22, 1.12, 1.22]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
        style={reduce ? undefined : { y, scale }}
      />
    </div>
  );
}
