import { useRef, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { scrollToHash, useLenis } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/utils";

type Tone = "solid" | "outline" | "light" | "ghost-light";

const tones: Record<Tone, { base: string; fill: string; hoverText: string }> = {
  solid: { base: "bg-plum-deep text-ivory", fill: "bg-dusk", hoverText: "group-hover:text-ivory" },
  outline: { base: "border border-ink/25 text-ink", fill: "bg-plum-deep", hoverText: "group-hover:text-ivory" },
  light: { base: "bg-ivory text-dusk", fill: "bg-rose", hoverText: "group-hover:text-dusk" },
  "ghost-light": { base: "border border-ivory/30 text-ivory", fill: "bg-ivory", hoverText: "group-hover:text-dusk" },
};

interface CtaProps {
  children: ReactNode;
  to?: string;
  href?: string;
  tone?: Tone;
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: boolean;
}

/** Signature pill CTA: magnetic, with an ink fill that blooms from the cursor's entry point. */
export function Cta({ children, to, href, tone = "solid", size = "md", className, onClick, type = "button", disabled, icon = true }: CtaProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  const t = tones[tone];

  const setOrigin = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    fillRef.current?.style.setProperty("--x", `${e.clientX - r.left}px`);
    fillRef.current?.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const cls = cn(
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-sans font-medium uppercase tracking-[0.22em] transition-[color,background-color,scale] duration-500 cursor-pointer select-none active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50",
    size === "lg" ? "px-8 py-4.5 text-[max(0.72rem,11.5px)] md:px-9 md:py-5" : "px-7 py-4 text-[max(0.66rem,11px)]",
    t.base,
    className,
  );

  const inner = (
    <>
      <span
        ref={fillRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 [clip-path:circle(0%_at_var(--x,50%)_var(--y,50%))] transition-[clip-path] duration-700 ease-[var(--ease-alchemy)] group-hover:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))]",
          t.fill,
        )}
      />
      <span className={cn("relative z-10 text-center transition-colors duration-500", t.hoverText)}>{children}</span>
      {icon && (
        <span className={cn("relative z-10 hidden size-5 place-items-center overflow-hidden transition-colors duration-500 md:grid", t.hoverText)}>
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-alchemy)] group-hover:translate-x-5 group-hover:-translate-y-5" strokeWidth={1.5} />
          <ArrowUpRight className="absolute size-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-[var(--ease-alchemy)] group-hover:translate-x-0 group-hover:translate-y-0" strokeWidth={1.5} />
        </span>
      )}
    </>
  );

  let el: ReactNode;
  if (to) {
    el = (
      <Link to={to} className={cls} onMouseEnter={setOrigin} onMouseLeave={setOrigin} onClick={onClick}>
        {inner}
      </Link>
    );
  } else if (href) {
    const isHash = href.startsWith("#");
    const external = /^https?:/.test(href);
    el = (
      <a
        href={href}
        className={cls}
        onMouseEnter={setOrigin}
        onMouseLeave={setOrigin}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={(e) => {
          onClick?.();
          if (isHash && scrollToHash(lenis, href)) e.preventDefault();
        }}
      >
        {inner}
      </a>
    );
  } else {
    el = (
      <button type={type} disabled={disabled} className={cls} onMouseEnter={setOrigin} onMouseLeave={setOrigin} onClick={onClick}>
        {inner}
      </button>
    );
  }

  return <Magnetic>{el}</Magnetic>;
}
