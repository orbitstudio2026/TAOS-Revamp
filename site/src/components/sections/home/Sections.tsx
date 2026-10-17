import { useRef } from "react";
import { Cosmos } from "@/components/ui/Cosmos";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { findPath, heal, journey, pillars, valuesSection } from "@/content/home";
import { toolkit } from "@/content/services";
import { offeringsSection } from "@/content/offerings";
import { values } from "@/content/site";
import { Cta } from "@/components/ui/Cta";
import { Eyebrow, Orb, Sigil, Star } from "@/components/ui/Ornaments";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { ModalityOrbit } from "@/components/sections/ModalityOrbit";
import { OfferingsStack } from "@/components/sections/OfferingsStack";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* ── Find your path: sticky heading, questions illuminate as they pass ── */
export function FindPath() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.6", "end 0.6"] });
  const thread = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section className="relative px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal kind="fade">
              <Eyebrow>{findPath.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-8 text-display-lg text-ink" by="words">
              How Do You Know If This Is <em className="text-plum">For You?</em>
            </SplitHeading>
            <Reveal kind="blur" delay={0.15}>
              <p className="mt-10 max-w-sm font-display text-2xl leading-snug text-taupe italic">{findPath.lead}</p>
            </Reveal>
            <div aria-hidden className="mt-12 hidden h-40 w-px bg-ink/10 lg:block">
              <motion.div className="h-full w-px origin-top bg-gradient-to-b from-plum to-rose" style={{ scaleY: thread }} />
            </div>
          </div>
        </div>

        <ol ref={listRef} className="lg:col-span-7 lg:col-start-6">
          {findPath.questions.map((q) => (
            <Question key={q} text={q} />
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center text-center">
        <SplitHeading as="p" className="font-display text-display-md text-plum-deep italic" by="words">
          {findPath.close}
        </SplitHeading>
        <Reveal kind="rise" delay={0.2} className="mt-12">
          <Cta to="/booking" size="lg">
            {findPath.cta}
          </Cta>
        </Reveal>
      </div>
    </section>
  );
}

function Question({ text }: { text: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.15, 0.4, 0.6, 0.88], [0.18, 1, 1, 0.25]);
  const x = useTransform(scrollYProgress, [0.15, 0.4], [28, 0]);
  const rotate = useTransform(scrollYProgress, [0.2, 0.5], [0, 180]);
  const starScale = useTransform(scrollYProgress, [0.25, 0.45, 0.6], [0.6, 1.35, 1]);

  return (
    <li ref={ref} className="flex gap-6 border-t border-ink/10 py-6 md:gap-10 md:py-8">
      <motion.span style={reduce ? undefined : { rotate, scale: starScale }} className="mt-2 text-plum">
        <Star className="size-4 md:size-5" />
      </motion.span>
      <motion.p style={reduce ? undefined : { opacity, x }} className="font-display text-2xl leading-[1.3] text-ink md:text-[2.15rem]">
        {text}
      </motion.p>
    </li>
  );
}

/* ── Two pillars: dusk chapter with counter-scrolling columns ── */
export function Pillars() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);

  return (
    <section className="relative isolate overflow-clip bg-dusk px-6 py-16 text-ivory md:px-10 md:py-28">
      <Cosmos tone="dark" className="-z-10" />
      <Parallax speed={-160} className="absolute top-0 left-1/2 -z-10 -translate-x-1/2">
        <Sigil className="size-[52rem]" opacity={0.07} spin={30} />
      </Parallax>
      <Orb className="-bottom-40 -left-40 -z-10 size-[36rem]" color="plum" />

      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-center text-center">
          <Reveal kind="fade">
            <Eyebrow tone="light">{pillars.eyebrow}</Eyebrow>
          </Reveal>
          <SplitHeading className="mt-8 text-display-lg" by="chars">
            {pillars.title}
          </SplitHeading>
        </div>

        <div ref={ref} className="relative mt-12 grid gap-16 md:mt-16 md:grid-cols-2 md:gap-0">
          <motion.div aria-hidden style={{ scaleY: lineScale }} className="absolute top-0 left-1/2 hidden h-full w-px origin-top bg-gradient-to-b from-rose/0 via-rose/50 to-rose/0 md:block" />
          {pillars.items.map((p, i) => (
            <Parallax key={p.num} speed={i === 0 ? 70 : -70} className={cn("md:px-16 lg:px-24", i === 1 && "md:pt-24")}>
              <article>
                <span aria-hidden className="block font-display text-[9rem] leading-none text-transparent italic [-webkit-text-stroke:1px_rgba(213,165,165,0.55)] md:text-[13rem]">
                  {p.num}
                </span>
                <p className="eyebrow mt-4 text-sand">{p.label}</p>
                <h3 className="mt-5 text-display-md italic">{p.title}</h3>
                <Reveal kind="blur">
                  <p className="mt-8 max-w-md text-lg leading-relaxed text-ivory/80">{p.body}</p>
                </Reveal>
              </article>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── What we heal: pinned horizontal gallery on desktop ── */
export function HealGallery() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const distance = () => t.scrollWidth - window.innerWidth;
        const tween = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.to(bar.current, { scaleX: 1, ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        gsap.utils.toArray<HTMLElement>(".heal-numeral").forEach((n) => {
          gsap.fromTo(n, { xPercent: 30 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: n.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>(".heal-panel").forEach((p) => {
          gsap.from(p.querySelectorAll(".heal-in"), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 1,
            scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 80%", toggleActions: "play none none reverse" },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative overflow-hidden bg-linen/75 lg:h-[100svh]">
      <div ref={track} className="flex flex-col lg:h-full lg:w-max lg:flex-row lg:items-stretch">
        <div className="flex shrink-0 flex-col justify-center px-6 pt-16 pb-10 md:px-10 lg:w-[42vw] lg:py-0 lg:pl-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]">
          <Reveal kind="fade">
            <Eyebrow>{heal.eyebrow}</Eyebrow>
          </Reveal>
          <SplitHeading className="mt-8 text-display-lg text-ink" by="words">
            What We <em className="text-plum">Heal</em> Together
          </SplitHeading>
        </div>
        {heal.items.map((h, i) => (
          <article
            key={h.num}
            className={cn(
              "heal-panel group relative flex shrink-0 flex-col justify-end overflow-hidden border-t border-ink/10 px-6 py-14 md:px-10 lg:h-full lg:w-[34vw] lg:min-w-[420px] lg:border-t-0 lg:border-l lg:px-12 lg:pb-[14vh]",
              i % 2 === 1 && "lg:bg-blush/40",
            )}
          >
            <span aria-hidden className="heal-numeral pointer-events-none absolute top-[8vh] right-4 font-display text-[9rem] leading-none text-plum/15 italic transition-colors duration-700 group-hover:text-plum/35 lg:text-[16rem]">
              {h.num.replace(".", "")}
            </span>
            <div className="relative">
              <p className="heal-in eyebrow text-plum-deep">{h.num}</p>
              <h3 className="heal-in mt-5 max-w-sm font-display text-4xl leading-[1.05] text-ink md:text-5xl">{h.title}</h3>
              <p className="heal-in mt-6 max-w-sm text-lg leading-relaxed text-taupe">{h.desc}</p>
              <span aria-hidden className="heal-in mt-8 block h-px w-16 bg-plum transition-all duration-700 ease-[var(--ease-alchemy)] group-hover:w-40" />
            </div>
          </article>
        ))}
        <div aria-hidden className="hidden shrink-0 lg:block lg:w-[10vw]" />
      </div>
      <div aria-hidden className="absolute inset-x-10 bottom-10 hidden h-px bg-ink/10 lg:block">
        <div ref={bar} className="h-px origin-left scale-x-0 bg-plum" />
      </div>
    </section>
  );
}

/* ── Healing toolkit (orbit) ── */
export function Toolkit({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  return (
    <section className="relative isolate overflow-clip px-6 py-16 md:px-10 md:py-24">
      <Orb className="top-20 -left-60 -z-10 size-[36rem]" color="rose" />
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal kind="fade">
              <Eyebrow>{toolkit.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading as={headingAs} className="mt-8 text-display-lg text-ink" by="words">
              Sacred Tools for <em className="text-plum">Transformation</em>
            </SplitHeading>
          </div>
          <Reveal kind="blur" delay={0.15} className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-relaxed text-taupe">{toolkit.body}</p>
          </Reveal>
        </div>
        <Reveal kind="scale" duration={1.4} className="mt-12">
          <ModalityOrbit />
        </Reveal>
        <Reveal kind="rise" className="mt-10 flex justify-center lg:justify-start">
          <Cta href="#cta" tone="outline" size="lg">
            {toolkit.cta}
          </Cta>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Offerings ── */
export function Offerings({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  return (
    <section className="relative px-4 pt-16 pb-10 md:px-8 md:pt-24">
      <div className="mx-auto mb-10 flex max-w-[1300px] flex-col gap-8 px-2 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal kind="fade">
            <Eyebrow>{offeringsSection.eyebrow}</Eyebrow>
          </Reveal>
          <SplitHeading as={headingAs} className="mt-8 max-w-3xl text-display-lg text-ink" by="words">
            Choose Your Path to <em className="text-plum">Sovereignty</em>
          </SplitHeading>
        </div>
      </div>
      <OfferingsStack />
    </section>
  );
}

/* ── Values marquee + founder quote ── */
export function Values() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-6 text-center md:px-10">
        <Reveal kind="fade">
          <Eyebrow>{valuesSection.eyebrow}</Eyebrow>
        </Reveal>
        <SplitHeading className="mt-8 max-w-4xl text-display-lg text-ink" by="words">
          Values That Guide <em className="text-plum">Every Session</em>
        </SplitHeading>
      </div>

      <div className="mt-10 space-y-4 md:mt-14">
        <Marquee duration={55}>
          {values.map((v) => (
            <span key={v} className="flex items-center gap-10 pr-10">
              <span className="font-display text-6xl whitespace-nowrap text-ink italic md:text-8xl">{v}</span>
              <Star className="size-5 text-plum" />
            </span>
          ))}
        </Marquee>
        <Marquee duration={65} reverse>
          {[...values].reverse().map((v) => (
            <span key={v} className="flex items-center gap-10 pr-10">
              <span className="font-display text-6xl whitespace-nowrap text-transparent [-webkit-text-stroke:1px_var(--color-plum)] md:text-8xl">{v}</span>
              <Star className="size-5 text-rose" filled={false} />
            </span>
          ))}
        </Marquee>
      </div>

      <figure className="mx-auto mt-14 max-w-5xl px-6 md:mt-20 md:px-10">
        <ScrollWords text={valuesSection.quote} className="font-display text-[1.75rem] leading-[1.35] text-ink md:text-[2.6rem]" />
        <Reveal kind="rise">
          <figcaption className="mt-10 flex items-center gap-4">
            <span className="h-px w-12 bg-plum" />
            <span className="font-display text-2xl text-plum-deep italic">{valuesSection.author}</span>
          </figcaption>
        </Reveal>
      </figure>
    </section>
  );
}

/* ── How it works: a gold thread draws itself through the three steps ── */
export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const draw = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });

  return (
    <section className="relative isolate overflow-clip bg-paper/70 px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center text-center">
          <Reveal kind="fade">
            <Eyebrow>{journey.eyebrow}</Eyebrow>
          </Reveal>
          <SplitHeading className="mt-8 text-display-lg text-ink" by="chars">
            {journey.title}
          </SplitHeading>
        </div>

        <div ref={ref} className="relative mt-12">
          {/* Desktop serpentine thread */}
          <svg aria-hidden viewBox="0 0 1200 900" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full md:block">
            <path d="M600 0 C 600 120, 260 140, 260 300 S 940 420, 940 600 S 600 760, 600 900" fill="none" stroke="var(--color-ink)" strokeOpacity="0.08" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <motion.path
              d="M600 0 C 600 120, 260 140, 260 300 S 940 420, 940 600 S 600 760, 600 900"
              fill="none"
              stroke="url(#thread)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: draw }}
            />
            <defs>
              <linearGradient id="thread" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#a36c9b" />
                <stop offset="60%" stopColor="#d5a5a5" />
                <stop offset="100%" stopColor="#c6b49a" />
              </linearGradient>
            </defs>
          </svg>
          {/* Mobile straight thread */}
          <div aria-hidden className="absolute top-0 bottom-0 left-[1.35rem] w-px bg-ink/10 md:hidden">
            <motion.div className="h-full w-px origin-top bg-gradient-to-b from-plum via-rose to-sand" style={{ scaleY: draw }} />
          </div>

          <ol className="relative grid gap-20 md:min-h-[700px] md:gap-0">
            {journey.steps.map((s, i) => (
              <li
                key={s.num}
                className={cn(
                  "relative pl-16 md:absolute md:w-[38%] md:pl-0",
                  i === 0 && "md:top-[14%] md:left-[62%]",
                  i === 1 && "md:top-[38%] md:left-0 md:text-right",
                  i === 2 && "md:top-[62%] md:left-[62%]",
                )}
              >
                <Step num={s.num} title={s.title} desc={s.desc} progress={draw} at={[0.22, 0.55, 0.85][i]} align={i === 1 ? "right" : "left"} />
              </li>
            ))}
          </ol>
        </div>

        <Reveal kind="rise" className="mt-12 flex justify-center">
          <Cta to="/booking" size="lg">
            {journey.cta}
          </Cta>
        </Reveal>
      </div>
    </section>
  );
}

function Step({ num, title, desc, progress, at, align }: { num: string; title: string; desc: string; progress: ReturnType<typeof useSpring>; at: number; align: "left" | "right" }) {
  const lit = useTransform(progress, [at - 0.08, at], [0, 1]);
  const bg = useTransform(lit, [0, 1], ["rgba(251,250,247,1)", "rgba(122,74,113,1)"]);
  const color = useTransform(lit, [0, 1], ["rgba(122,74,113,1)", "rgba(247,245,242,1)"]);
  const y = useTransform(lit, [0, 1], [30, 0]);
  const opacity = useTransform(lit, [0, 1], [0.35, 1]);

  return (
    <div className={cn("flex flex-col", align === "right" && "md:items-end")}>
      <motion.span
        style={{ backgroundColor: bg, color }}
        className="absolute top-0 left-0 grid size-11 place-items-center rounded-full border border-plum/30 font-display text-lg md:static md:size-16 md:text-2xl"
      >
        {num}
      </motion.span>
      <motion.div style={{ y, opacity }}>
        <h3 className="font-display text-4xl text-ink md:mt-6 md:text-5xl">{title}</h3>
        <p className="mt-4 max-w-sm text-lg leading-relaxed text-taupe">{desc}</p>
      </motion.div>
    </div>
  );
}

