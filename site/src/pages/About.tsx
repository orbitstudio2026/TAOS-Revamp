import { useRef } from "react";
import { Cosmos } from "@/components/ui/Cosmos";
import { motion, useScroll, useTransform } from "motion/react";
import { aboutCta, aboutHero, aboutValues, chapters, credentials, facts, mission } from "@/content/about";
import { Eyebrow, Sigil, Star } from "@/components/ui/Ornaments";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Parallax, ParallaxImage } from "@/components/motion/Parallax";
import { Reveal, StaggerList, StaggerLi } from "@/components/motion/Reveal";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { Atmosphere, CtaSection } from "@/components/sections/Shared";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, EASE, asset } from "@/lib/utils";
import { usePageMeta } from "@/lib/meta";

const chapterTheme = [
  { bg: "#241a23", fg: "#f7f5f2", cap: "#d5a5a5", image: null },
  { bg: "#f1e2e0", fg: "#3c3634", cap: "#7a4a71", image: asset("assets/about-story.jpg") },
  { bg: "#f7f5f2", fg: "#3c3634", cap: "#a36c9b", image: asset("assets/vishakha-awakening.jpg") },
];

export default function About() {
  usePageMeta("About Vishakha | Alchemy of Sovereignty", "Meet Vishakha Chauhan — Certified Intuitive Energy Healer, Spiritual Life Coach and Reiki Master guiding souls through self-awakening.");
  return (
    <>
      <AboutHero />
      <Facts />
      <Story />
      <Mission />
      <ValuesList />
      <Credentials />
      <CtaSection eyebrow={aboutCta.eyebrow} title={aboutCta.title} body={aboutCta.body} button={aboutCta.button} />
    </>
  );
}

function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <section ref={ref} className="relative isolate overflow-clip px-6 pt-32 pb-12 md:px-10 md:pt-36 md:pb-20">
      <Atmosphere />
      <div className="mx-auto grid max-w-[1400px] items-end gap-16 lg:grid-cols-12">
        <motion.div style={{ y: textY }} className="lg:col-span-7">
          <Reveal kind="fade">
            <Eyebrow>{aboutHero.eyebrow}</Eyebrow>
          </Reveal>
          <SplitHeading as="h1" by="chars" immediate delay={0.2} className="mt-8 text-display-xl text-ink">
            I Am <em className="font-light text-plum">Vishakha</em>
          </SplitHeading>
          <Reveal kind="blur" delay={0.6}>
            <p className="eyebrow mt-10 max-w-xl leading-loose text-plum-deep">{aboutHero.creds}</p>
          </Reveal>
          <Reveal kind="rise" delay={0.8}>
            <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-taupe italic md:text-3xl">{aboutHero.body}</p>
          </Reveal>
        </motion.div>

        <div className="relative lg:col-span-5">
          <Parallax speed={-60} className="absolute -top-20 -left-24 -z-10">
            <Sigil className="size-[26rem]" opacity={0.22} />
          </Parallax>
          <motion.figure
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          >
            <ParallaxImage src={asset("assets/vishakha-portrait.jpg")} alt="Portrait of Vishakha Chauhan" className="arch aspect-[3/4] w-full" imgClassName="object-[50%_30%]" amount={8} />
            <figcaption className="eyebrow mt-6 text-taupe">{aboutHero.caption}</figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}

function Facts() {
  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal kind="fade">
              <Eyebrow>{facts.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-8 text-display-md text-ink" by="words">
              Meet the <em className="text-plum">Founder</em>
            </SplitHeading>
          </div>
        </div>
        <dl className="lg:col-span-8">
          {facts.rows.map((r, i) => (
            <motion.div
              key={r.k}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
              className="relative grid gap-3 py-8 md:grid-cols-[14rem_1fr] md:gap-10"
            >
              <motion.span
                aria-hidden
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
                transition={{ duration: 1.2, ease: EASE, delay: i * 0.05 }}
                className="absolute inset-x-0 top-0 h-px origin-left bg-ink/15"
              />
              <motion.dt variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }} className="eyebrow pt-2 text-plum-deep">
                {r.k}
              </motion.dt>
              <motion.dd variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 1, ease: EASE, delay: 0.18 }} className="font-display text-2xl leading-snug text-ink md:text-3xl">
                {r.v}
              </motion.dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Wound → Awakening → Mission. The page's light shifts from dusk to dawn as the story turns. */
function Story() {
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrap.current!;
      gsap.set(el, { backgroundColor: chapterTheme[0].bg, color: chapterTheme[0].fg, "--cap": chapterTheme[0].cap });
      gsap.utils.toArray<HTMLElement>(".chapter").forEach((c, i) => {
        const t = chapterTheme[i];
        gsap.timeline({
          scrollTrigger: {
            trigger: c,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => {
              if (self.isActive) gsap.to(el, { backgroundColor: t.bg, color: t.fg, "--cap": t.cap, duration: 1.2, ease: "power2.out", overwrite: "auto" });
            },
          },
        });
      });
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className="relative isolate overflow-clip" style={{ backgroundColor: chapterTheme[0].bg, color: chapterTheme[0].fg }}>
      <Cosmos tone="dark" className="-z-10" />
      <Parallax speed={-220} className="pointer-events-none absolute top-[10%] -right-60 -z-10">
        <Sigil className="size-[48rem]" opacity={0.08} spin={50} />
      </Parallax>
      {chapters.map((c, i) => {
        const theme = chapterTheme[i];
        return (
          <section key={c.title} className="chapter relative px-6 py-14 md:px-10 md:py-24">
            <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                  <SplitHeading className="text-display-lg italic" by="chars">
                    {c.title}
                  </SplitHeading>
                  {theme.image && (
                    <Reveal kind="mask" duration={1.5} className="mt-10 hidden lg:block">
                      <ParallaxImage src={theme.image} alt="" className="arch aspect-[4/5] w-full max-w-[360px]" amount={10} />
                    </Reveal>
                  )}
                </div>
              </div>
              <div className="space-y-7 lg:col-span-7 lg:col-start-6">
                {c.paragraphs.map((p, j) => (
                  <Reveal key={j} kind={j === 0 ? "blur" : "rise"} amount={0.3}>
                    <p className={cn("max-w-[65ch] text-lg leading-[1.85] opacity-85 md:text-[1.2rem]", j === 0 && "drop-cap text-xl opacity-100 md:text-[1.35rem] [&::first-letter]:text-[var(--cap)]")}>{p}</p>
                  </Reveal>
                ))}
                {c.sub && (
                  <div className="pt-10">
                    <SplitHeading as="h3" className="text-display-md" by="words">
                      {c.sub.title}
                    </SplitHeading>
                    <div className="mt-10 space-y-7">
                      {c.sub.paragraphs.map((p, j) => (
                        <Reveal key={j} kind="rise" amount={0.3}>
                          <p className="max-w-[65ch] text-lg leading-[1.85] opacity-85 md:text-[1.2rem]">{p}</p>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Mission() {
  const phrases = mission.line.split(" · ");
  return (
    <section className="relative isolate overflow-clip px-6 py-16 text-center md:px-10 md:py-28">
      <Parallax speed={120} className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <Sigil className="size-[40rem]" opacity={0.12} />
      </Parallax>
      <Reveal kind="fade" className="flex justify-center">
        <Eyebrow>{mission.eyebrow}</Eyebrow>
      </Reveal>
      <p className="sr-only">{mission.line}</p>
      <div aria-hidden className="mx-auto mt-12 flex max-w-5xl flex-col items-center gap-2">
        {phrases.map((ph, i) => (
          <div key={ph} className="flex flex-col items-center">
            <SplitHeading as="span" by="words" className={cn("block font-display text-display-lg font-light", i % 2 ? "text-plum italic" : "text-ink")}>
              {ph}
            </SplitHeading>
            {i < phrases.length - 1 && (
              <Reveal kind="scale" className="my-3 text-sand">
                <Star className="size-3" />
              </Reveal>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ValuesList() {
  return (
    <section className="bg-paper/70 px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal kind="fade">
              <Eyebrow>{aboutValues.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-8 text-display-lg text-ink" by="words">
              Values That Guide <em className="text-plum">Every Session</em>
            </SplitHeading>
          </div>
          <StaggerList className="grid gap-x-12 sm:grid-cols-2 lg:col-span-7" stagger={0.06}>
            {aboutValues.items.map((v) => (
              <StaggerLi key={v} className="group flex items-center justify-between border-b border-ink/10 py-6">
                  <span className="font-display text-3xl text-ink transition-all duration-500 group-hover:translate-x-2 group-hover:text-plum-deep group-hover:italic md:text-4xl">{v}</span>
                  <Star className="size-3 text-plum opacity-0 transition-all duration-500 group-hover:rotate-90 group-hover:opacity-100" />
              </StaggerLi>
            ))}
          </StaggerList>
        </div>

        <figure className="mx-auto mt-16 max-w-4xl text-center">
          <ScrollWords text={aboutValues.quote} className="justify-center font-display text-[2rem] leading-[1.3] text-ink italic md:text-[3rem]" />
          <Reveal kind="rise">
            <figcaption className="mt-10 font-display text-2xl text-plum-deep italic">{aboutValues.author}</figcaption>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}

function Credentials() {
  return (
    <section className="relative isolate overflow-clip px-6 py-16 md:px-10 md:py-24">
      <Atmosphere />
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SplitHeading className="text-display-md text-ink" by="words">
            {credentials.title}
          </SplitHeading>
          <StaggerList className="mt-12" stagger={0.08}>
            {credentials.items.map((c) => (
              <StaggerLi key={c} kind="blur" className="flex items-start gap-5 border-t border-ink/10 py-5 text-lg text-ink md:text-xl">
                <Star className="mt-1.5 size-3 text-plum" />
                {c}
              </StaggerLi>
            ))}
          </StaggerList>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="lg:sticky lg:top-32">
            <Reveal kind="mask" duration={1.6}>
              <ParallaxImage src={asset("assets/about-story.jpg")} alt="Clear quartz crystal held in an open palm" className="aspect-[4/5] w-full" amount={10} />
            </Reveal>
            <Reveal kind="blur" delay={0.2}>
              <p className="mt-10 font-display text-2xl leading-snug text-taupe italic">{credentials.passion}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
