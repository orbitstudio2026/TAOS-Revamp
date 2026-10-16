import { type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Infinite marquee whose skew responds to scroll velocity.
 * Content is rendered twice so the -50% loop is seamless; the copy is aria-hidden.
 */
export function Marquee({
  children,
  reverse,
  duration = 40,
  className,
  trackClassName,
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
  trackClassName?: string;
}) {
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const skew = useTransform(velocity, [-2000, 0, 2000], [-6, 0, 6], { clamp: true });

  return (
    <div className={cn("group relative flex overflow-hidden", className)} style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
      <motion.div style={{ skewX: skew }} className="flex shrink-0">
        <div
          style={{ ["--marquee-duration" as string]: `${duration}s` }}
          className={cn(
            "flex w-max shrink-0 items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
            trackClassName,
          )}
        >
          <div className="flex shrink-0 items-center">{children}</div>
          <div className="flex shrink-0 items-center" aria-hidden>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
