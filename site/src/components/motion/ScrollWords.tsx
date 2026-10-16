import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/** Paragraph whose words brighten one by one as it scrolls through the viewport. */
export function ScrollWords({ text, className, dim = 0.14 }: { text: string; className?: string; dim?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} dim={dim}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range, dim }: { children: string; progress: MotionValue<number>; range: [number, number]; dim: number }) {
  const opacity = useTransform(progress, range, [dim, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <span aria-hidden className="relative mr-[0.26em] inline-block">
      <motion.span style={{ opacity, y }} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
}
