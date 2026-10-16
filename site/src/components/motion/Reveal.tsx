import { useRef, type ReactNode } from "react";
import { motion, useInView, type HTMLMotionProps, type Variants } from "motion/react";
import { cn, EASE } from "@/lib/utils";

type Kind = "rise" | "blur" | "mask" | "fade" | "scale";

const variants: Record<Kind, Variants> = {
  rise: { hidden: { opacity: 0, y: 48 }, show: { opacity: 1, y: 0 } },
  blur: { hidden: { opacity: 0, filter: "blur(14px)", y: 16 }, show: { opacity: 1, filter: "blur(0px)", y: 0 } },
  mask: { hidden: { clipPath: "inset(100% 0% 0% 0%)", y: 30 }, show: { clipPath: "inset(0% 0% 0% 0%)", y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
};

// Observe an un-transformed, un-clipped outer box so visibility is measured reliably
// (an element clipped to zero area may never report as "in view").
const VIEW = { once: true, amount: 0.1, margin: "0px 0px -8% 0px" } as const;

function useReveal(amount?: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { ...VIEW, amount: amount ?? VIEW.amount });
  return { ref, state: inView ? "show" : "hidden" };
}

interface RevealProps extends HTMLMotionProps<"div"> {
  kind?: Kind;
  delay?: number;
  duration?: number;
  amount?: number;
  children?: ReactNode;
}

/** Viewport-triggered entrance. Pick the kind per section so entrances don't all feel identical. */
export function Reveal({ kind = "rise", delay = 0, duration = 1.1, amount, className, children, ...rest }: RevealProps) {
  const { ref, state } = useReveal(amount);
  return (
    <div ref={ref} className={className}>
      <motion.div initial="hidden" animate={state} variants={variants[kind]} transition={{ duration, delay, ease: EASE }} {...rest}>
        {children}
      </motion.div>
    </div>
  );
}

/** Staggered container: children should be <StaggerItem>. */
export function Stagger({ children, stagger = 0.09, delay = 0, amount, className, ...rest }: HTMLMotionProps<"div"> & { stagger?: number; delay?: number; amount?: number; children?: ReactNode }) {
  const { ref, state } = useReveal(amount);
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={state}
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
        {...rest}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function StaggerItem({ kind = "rise", children, ...rest }: HTMLMotionProps<"div"> & { kind?: Kind }) {
  return (
    <motion.div variants={variants[kind]} transition={{ duration: 1, ease: EASE }} {...rest}>
      {children}
    </motion.div>
  );
}

/** List variants of Stagger/StaggerItem that render real <ul>/<li> elements. */
export function StaggerList({ children, stagger = 0.08, delay = 0, amount, className, ...rest }: HTMLMotionProps<"ul"> & { stagger?: number; delay?: number; amount?: number; children?: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { ...VIEW, amount: amount ?? VIEW.amount });
  // A <ul> carries no transform/clip itself (only its <li> children animate), so it is safe to observe directly.
  return (
    <motion.ul
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.ul>
  );
}

export function StaggerLi({ kind = "rise", children, ...rest }: HTMLMotionProps<"li"> & { kind?: Kind }) {
  return (
    <motion.li variants={variants[kind]} transition={{ duration: 1, ease: EASE }} {...rest}>
      {children}
    </motion.li>
  );
}
