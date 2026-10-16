import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/** The brand's ✦ motif, drawn as a four-point star so it renders crisply at any size. */
export function Star({ className, filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-3.5 shrink-0", className)}>
      <path
        d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1}
      />
    </svg>
  );
}

/** Running head: small tracked label with a hairline rule. Holds the site's section labels. */
export function Eyebrow({ children, className, tone = "plum" }: { children: React.ReactNode; className?: string; tone?: "plum" | "light" | "gold" }) {
  return (
    <p
      className={cn(
        "eyebrow flex items-center gap-3",
        tone === "plum" && "text-plum-deep",
        tone === "light" && "text-rose",
        tone === "gold" && "text-sand",
        className,
      )}
    >
      <Star className="size-2.5" />
      <span>{children}</span>
    </p>
  );
}

/** Brand logomark tinted with currentColor via CSS mask. */
export function LogoMark({ className }: { className?: string }) {
  return <span aria-hidden className={cn("logo-mask inline-block size-10", className)} />;
}

/** The lotus mandala sigil: slow rotation plus scroll-linked spin and drift. */
export function Sigil({ className, opacity = 0.18, spin = 60 }: { className?: string; opacity?: number; spin?: number }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, spin * 6]);
  return (
    <motion.div aria-hidden className={cn("pointer-events-none select-none", className)} style={reduce ? { opacity } : { rotate, opacity }}>
      <img src="/assets/lotus-mandala.webp" alt="" className="h-full w-full animate-spin-slow object-contain" draggable={false} />
    </motion.div>
  );
}

/** Soft luminous orb used for atmospheric light in backgrounds. */
export function Orb({ className, color = "plum" }: { className?: string; color?: "plum" | "rose" | "sand" }) {
  const map = { plum: "rgba(163,108,155,0.45)", rose: "rgba(213,165,165,0.55)", sand: "rgba(198,180,154,0.5)" };
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-3xl animate-breathe", className)}
      style={{ background: `radial-gradient(circle, ${map[color]} 0%, transparent 70%)` }}
    />
  );
}
