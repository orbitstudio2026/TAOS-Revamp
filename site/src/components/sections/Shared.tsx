import { useId, useMemo, useState } from "react";
import { Cosmos } from "@/components/ui/Cosmos";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cta as ctaCopy } from "@/content/site";
import { Cta } from "@/components/ui/Cta";
import { Eyebrow, Orb, Sigil } from "@/components/ui/Ornaments";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { cn, EASE } from "@/lib/utils";

/** Closing invitation. id="cta" is the anchor many in-page buttons point at. */
export function CtaSection({
  eyebrow = ctaCopy.eyebrow,
  title = ctaCopy.title,
  body = ctaCopy.body,
  button = ctaCopy.button,
  to = "/booking",
  id = "cta",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  button?: string;
  to?: string;
  id?: string;
}) {
  const motes = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: (i * 37) % 100,
        size: 2 + ((i * 7) % 4),
        delay: (i * 0.53) % 9,
        duration: 9 + ((i * 3) % 8),
      })),
    [],
  );

  return (
    <section id={id} className="relative isolate overflow-clip bg-dusk py-16 text-ivory md:py-28">
      <Cosmos tone="dark" className="-z-10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_120%,rgba(163,108,155,0.55),transparent_60%),radial-gradient(ellipse_at_10%_0%,rgba(213,165,165,0.18),transparent_50%)]" />
      <Parallax speed={140} className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <Sigil className="size-[44rem] md:size-[60rem]" opacity={0.1} spin={40} />
      </Parallax>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 motion-reduce:hidden">
        {motes.map((m, i) => (
          <motion.span
            key={i}
            className="absolute bottom-0 rounded-full bg-rose"
            style={{ left: `${m.left}%`, width: m.size, height: m.size }}
            animate={{ y: [0, -900], opacity: [0, 0.8, 0] }}
            transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <Reveal kind="fade">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
        </Reveal>
        <SplitHeading className="mt-8 text-display-lg text-ivory" by="chars">
          {title}
        </SplitHeading>
        <Reveal kind="blur" delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ivory/75">{body}</p>
        </Reveal>
        <Reveal kind="rise" delay={0.35} className="mt-12">
          <Cta to={to} tone="light" size="lg">
            {button}
          </Cta>
        </Reveal>
      </div>
    </section>
  );
}

/** Animated single-open accordion. */
export function Accordion({ items, tone = "light" }: { items: { q: string; a: string }[]; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  return (
    <Stagger className={cn("border-t", tone === "dark" ? "border-ivory/15" : "border-ink/10")} stagger={0.07}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <StaggerItem key={item.q} className={cn("border-b", tone === "dark" ? "border-ivory/15" : "border-ink/10")}>
            <h3>
              <button
                type="button"
                id={`${uid}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full cursor-pointer items-start justify-between gap-6 py-7 text-left md:py-9"
              >
                <span
                  className={cn(
                    "min-w-0 flex-1 font-display text-2xl leading-snug transition-colors duration-500 md:text-[2rem]",
                    tone === "dark" ? "text-ivory group-hover:text-rose" : "text-ink group-hover:text-plum-deep",
                    isOpen && (tone === "dark" ? "text-rose" : "text-plum-deep"),
                  )}
                >
                  {item.q}
                </span>
                <span
                  className={cn(
                    "mt-1 grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                    isOpen ? "border-plum bg-plum text-ivory" : tone === "dark" ? "border-ivory/25 text-ivory" : "border-ink/15 text-ink group-hover:border-plum",
                  )}
                >
                  <motion.span animate={{ rotate: isOpen ? 135 : 0 }} transition={{ duration: 0.6, ease: EASE }} className="grid place-items-center">
                    <Plus className="size-4" strokeWidth={1.4} />
                  </motion.span>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-a${i}`}
                  role="region"
                  aria-labelledby={`${uid}-q${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.65, ease: EASE }}
                  className="overflow-hidden"
                >
                  <motion.p
                    initial={{ y: 14, filter: "blur(4px)" }}
                    animate={{ y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
                    className={cn("max-w-2xl pb-9 text-lg leading-relaxed", tone === "dark" ? "text-ivory/80" : "text-taupe")}
                  >
                    {item.a}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

/** Soft ambient light field used behind light sections. */
export function Atmosphere({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <Parallax speed={120} className="absolute -top-40 -left-40">
        <Orb className="relative size-[34rem]" color="rose" />
      </Parallax>
      <Parallax speed={-90} className="absolute top-1/3 -right-48">
        <Orb className="relative size-[30rem] [animation-delay:2s]" color="plum" />
      </Parallax>
    </div>
  );
}
