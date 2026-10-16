// Stacking behaviour adapted from 21st.dev "Stacking Cards" by danielpetho (Khoa Phan) —
// https://21st.dev/@danielpetho/components/stacking-cards
import { createContext, useContext, useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { offeringsSection } from "@/content/offerings";
import { Cta } from "@/components/ui/Cta";
import { Star } from "@/components/ui/Ornaments";
import { cn } from "@/lib/utils";

const Ctx = createContext<{ progress: MotionValue<number>; total: number } | null>(null);

function StackingCards({ children, total, className }: { children: ReactNode; total: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <Ctx.Provider value={{ progress: scrollYProgress, total }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

function StackingCardItem({ index, children }: { index: number; children: ReactNode }) {
  const ctx = useContext(Ctx)!;
  const reduce = useReducedMotion();
  const scaleTo = 1 - (ctx.total - index) * 0.035;
  const scale = useTransform(ctx.progress, [index / ctx.total, 1], [1, scaleTo]);
  const brightness = useTransform(ctx.progress, [index / ctx.total, 1], [1, 0.82 + index * 0.04]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);
  return (
    <div className="sticky top-0 flex min-h-[100svh] items-start pt-[12vh]" style={{ paddingTop: `calc(11vh + ${index * 22}px)` }}>
      <motion.div className="w-full origin-top" style={reduce ? undefined : { scale, filter }}>
        {children}
      </motion.div>
    </div>
  );
}

const tones = [
  { card: "bg-dusk text-ivory", tag: "text-rose", body: "text-ivory/75", star: "text-rose", rule: "bg-ivory/15", cta: "light" as const },
  { card: "bg-blush text-ink", tag: "text-plum-deep", body: "text-taupe", star: "text-plum", rule: "bg-ink/10", cta: "solid" as const },
  { card: "bg-linen text-ink", tag: "text-plum-deep", body: "text-taupe", star: "text-plum", rule: "bg-ink/10", cta: "solid" as const },
  { card: "bg-plum-deep text-ivory", tag: "text-blush", body: "text-ivory/80", star: "text-blush", rule: "bg-ivory/20", cta: "light" as const },
];

export function OfferingsStack() {
  const items = offeringsSection.items;
  return (
    <StackingCards total={items.length} className="relative">
      {items.map((o, i) => {
        const t = tones[i % tones.length];
        return (
          <StackingCardItem key={o.title} index={i}>
            <article className={cn("relative mx-auto grid min-h-[68vh] max-w-[1300px] overflow-hidden rounded-[2px] p-8 md:grid-cols-12 md:gap-10 md:p-14 lg:p-20", t.card)}>
              <img
                src="/assets/lotus-mandala.webp"
                alt=""
                aria-hidden
                className="pointer-events-none absolute -right-[18%] -bottom-[30%] w-[70%] max-w-[640px] animate-spin-slow opacity-[0.08] mix-blend-luminosity"
              />
              <div className="relative flex flex-col md:col-span-7">
                <p className={cn("eyebrow", t.tag)}>{o.tag}</p>
                <h3 className="mt-6 text-display-lg">
                  {o.title.split(" ").slice(0, -1).join(" ")} <em className="font-light">{o.title.split(" ").slice(-1)}</em>
                </h3>
                <p className={cn("mt-8 max-w-xl text-lg leading-relaxed md:text-xl", t.body)}>{o.desc}</p>
              </div>
              <div className="relative mt-10 flex flex-col justify-end md:col-span-5 md:mt-0">
                <ul className="space-y-0">
                  {o.points.map((p) => (
                    <li key={p} className="relative flex items-center gap-4 py-4 font-display text-xl md:text-2xl">
                      <span className={cn("absolute inset-x-0 top-0 h-px", t.rule)} />
                      <Star className={cn("size-3", t.star)} />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Cta href={o.href} tone={t.cta} size="lg">
                    {o.cta}
                  </Cta>
                </div>
              </div>
            </article>
          </StackingCardItem>
        );
      })}
    </StackingCards>
  );
}
