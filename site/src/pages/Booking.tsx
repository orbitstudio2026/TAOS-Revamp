import { useEffect, useRef, useState } from "react";
import { Cosmos } from "@/components/ui/Cosmos";
import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, Clock, ExternalLink, Feather, Globe, HeartHandshake, Lock, Sparkles, Sun, Wind } from "lucide-react";
import { brand } from "@/content/site";
import { bookingFaq, bookingHero, confirmation, forYou, receive, reflections, reverence, schedule, whisper } from "@/content/booking";
import { Cta } from "@/components/ui/Cta";
import { Eyebrow, LogoMark, Sigil, Star } from "@/components/ui/Ornaments";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Parallax, ParallaxImage } from "@/components/motion/Parallax";
import { Reveal, StaggerList, StaggerLi } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { Accordion, Atmosphere } from "@/components/sections/Shared";
import { useLenis } from "@/components/motion/SmoothScroll";
import { usePageMeta } from "@/lib/meta";
import { cn, EASE, asset } from "@/lib/utils";

const CAL_URL = `${brand.calendly}?hide_gdpr_banner=1&background_color=fbfaf7&text_color=3c3634&primary_color=7a4a71`;

export default function Booking() {
  usePageMeta(
    "Book a Free Discovery Call | Alchemy of Sovereignty",
    "Book a complimentary 30-minute discovery call with Vishakha — intuitive healer, spiritual life coach and Reiki Master.",
  );
  const [scheduled, setScheduled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (scheduled) lenis?.scrollTo("#calendly", { offset: -80 });
  }, [scheduled, lenis]);

  return (
    <>
      <BookingHero />
      <Receive />
      <Reverence />

      <section id="calendly" className="relative isolate scroll-mt-24 overflow-hidden bg-paper/70 px-4 py-28 md:px-10 md:py-40">
        <Parallax speed={-120} className="absolute -top-20 -right-40 -z-10">
          <Sigil className="size-[36rem]" opacity={0.12} />
        </Parallax>
        <div className="mx-auto max-w-[1100px]">
          <AnimatePresence mode="wait">
            {scheduled ? (
              <Confirmation key="done" onAgain={() => setScheduled(false)} />
            ) : (
              <motion.div key="cal" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: EASE }}>
                <div className="flex flex-col items-center text-center">
                  <Reveal kind="fade">
                    <Eyebrow>{schedule.eyebrow}</Eyebrow>
                  </Reveal>
                  <SplitHeading className="mt-8 text-display-lg text-ink" by="words">
                    {schedule.titleA} <em className="text-plum">{schedule.titleB}</em>
                  </SplitHeading>
                  <Reveal kind="blur" delay={0.15}>
                    <p className="mx-auto mt-8 max-w-[600px] text-lg leading-relaxed text-taupe">{schedule.body}</p>
                  </Reveal>
                </div>
                <Reveal kind="fade" duration={1.2} className="mt-14">
                  <div className="relative border border-ink/10 bg-ivory p-2 shadow-[0_40px_100px_-40px_rgba(36,26,35,0.35)] md:p-4">
                    <span aria-hidden className="absolute -top-px left-1/2 h-px w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-plum to-transparent" />
                    <CalendlyEmbed onScheduled={() => setScheduled(true)} />
                  </div>
                </Reveal>
                <p className="mt-8 text-center text-sm text-taupe">
                  {schedule.fallback}{" "}
                  <a href={brand.calendly} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-plum-deep underline decoration-plum/30 underline-offset-4 transition-colors hover:decoration-plum">
                    {schedule.fallbackLink}
                    <ExternalLink className="size-3.5" strokeWidth={1.5} />
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ForYou />
      <Reflections />

      <section className="px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 flex flex-col items-center text-center">
            <Reveal kind="fade">
              <Eyebrow>{bookingFaq.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-8 text-display-lg text-ink" by="words">
              Questions, <em className="text-plum">gently answered</em>
            </SplitHeading>
          </div>
          <Accordion items={bookingFaq.items} />
        </div>
      </section>

      <Whisper />
    </>
  );
}

function BookingHero() {
  const lenis = useLenis();
  const jump = (hash: string) => (e: React.MouseEvent) => {
    const el = document.querySelector(hash);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -60 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
  const metaIcons = [Clock, Globe, Lock];

  return (
    <section className="relative isolate overflow-clip px-6 pt-40 pb-24 md:px-10 md:pt-48 md:pb-32">
      <Atmosphere />
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, delay: 0.25, ease: EASE }}>
            <Eyebrow>{bookingHero.eyebrow}</Eyebrow>
          </motion.div>
          <SplitHeading as="h1" by="chars" immediate delay={0.3} stagger={0.025} className="mt-8 text-display-xl text-ink">
            {bookingHero.titleA}
            <br />
            <em className="font-light text-plum">{bookingHero.titleB}</em>
          </SplitHeading>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
            className="mt-10 max-w-xl text-lg leading-relaxed text-taupe md:text-xl"
          >
            {bookingHero.body}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 1.1, ease: EASE }} className="mt-10 flex flex-wrap items-center gap-4">
            <Cta href="#calendly" size="lg">
              {bookingHero.primary}
            </Cta>
            <a href="#receive" onClick={jump("#receive")} className="eyebrow group inline-flex items-center gap-3 px-4 py-4 text-ink">
              <span className="relative">
                {bookingHero.secondary}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-plum transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </span>
            </a>
          </motion.div>
          <motion.ul initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1.3 } } }} className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
            {bookingHero.meta.map((m, i) => {
              const Icon = metaIcons[i];
              return (
                <motion.li key={m} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, ease: EASE }} className="eyebrow flex items-center gap-2 text-taupe">
                  <Icon className="size-3.5 text-plum" strokeWidth={1.5} />
                  {m}
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
        <div className="relative lg:col-span-5">
          <Parallax speed={-50} className="absolute -top-16 -left-20 -z-10">
            <Sigil className="size-[24rem]" opacity={0.25} />
          </Parallax>
          <motion.div
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.8, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
          >
            <ParallaxImage src={asset("assets/vishakha-portrait.jpg")} alt="Vishakha Chauhan" className="arch mx-auto aspect-[3/4] w-full max-w-[440px]" imgClassName="object-[50%_30%]" amount={8} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Receive() {
  return (
    <section id="receive" className="scroll-mt-24 px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal kind="fade">
              <Eyebrow>{receive.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-8 text-display-lg text-ink" by="words">
              What you will <em className="text-plum">receive</em>
            </SplitHeading>
          </div>
        </div>
        <StaggerList className="lg:col-span-7" stagger={0.12}>
          {receive.items.map((r) => (
            <StaggerLi key={r} kind="blur" className="group flex items-start gap-6 border-t border-ink/10 py-9">
              <Star className="mt-2 size-4 text-plum transition-transform duration-700 group-hover:rotate-180" />
              <p className="font-display text-2xl leading-snug text-ink md:text-3xl">{r}</p>
            </StaggerLi>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}

function Reverence() {
  const icons = [CalendarCheck, Globe, Lock, Sparkles];
  return (
    <section className="relative isolate overflow-clip bg-dusk px-6 py-28 text-ivory md:px-10 md:py-40">
      <Cosmos tone="dark" className="-z-10" />
      <Parallax speed={-140} className="absolute -bottom-40 -left-40 -z-10">
        <Sigil className="size-[40rem]" opacity={0.08} />
      </Parallax>
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-center text-center">
          <Reveal kind="fade">
            <Eyebrow tone="light">{reverence.eyebrow}</Eyebrow>
          </Reveal>
          <SplitHeading className="mt-8 text-display-lg" by="words">
            A call held with <em className="text-rose">reverence</em>
          </SplitHeading>
        </div>
        <StaggerList className="mt-20 grid border-t border-ivory/12 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {reverence.items.map((r, i) => {
            const Icon = icons[i];
            return (
              <StaggerLi key={r.title} className="group relative border-b border-ivory/12 px-2 py-12 md:px-8 lg:border-b-0 lg:border-l lg:first:border-l-0">
                <span className="grid size-14 place-items-center rounded-full border border-rose/30 text-rose transition-all duration-700 group-hover:-translate-y-1 group-hover:bg-rose group-hover:text-dusk">
                  <Icon className="size-5" strokeWidth={1.3} />
                </span>
                <h3 className="mt-8 font-display text-3xl">{r.title}</h3>
                <p className="mt-4 leading-relaxed text-ivory/75">{r.desc}</p>
              </StaggerLi>
            );
          })}
        </StaggerList>
      </div>
    </section>
  );
}

function ForYou() {
  return (
    <section className="relative isolate overflow-clip bg-linen/75 px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1400px] items-start gap-16 lg:grid-cols-2">
        <div className="lg:sticky lg:top-32">
          <Reveal kind="fade">
            <Eyebrow>{forYou.eyebrow}</Eyebrow>
          </Reveal>
          <SplitHeading className="mt-8 text-display-lg text-ink" by="words">
            This call is <em className="text-plum">for you if…</em>
          </SplitHeading>
          <Reveal kind="blur" delay={0.15}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-taupe">{forYou.body}</p>
          </Reveal>
        </div>
        <StaggerList className="space-y-4" stagger={0.12}>
          {forYou.items.map((f) => (
            <StaggerLi key={f} kind="rise" className="group flex items-start gap-5 bg-paper p-7 shadow-[0_12px_40px_-24px_rgba(60,54,52,0.35)] transition-transform duration-700 hover:-translate-y-1 md:p-9">
              <motion.span whileInView={{ rotate: [0, 180], scale: [0.6, 1.2, 1] }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} className="mt-1 text-plum">
                <Star className="size-4" />
              </motion.span>
              <p className="font-display text-xl leading-snug text-ink md:text-2xl">{f}</p>
            </StaggerLi>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}

function Reflections() {
  return (
    <section className="overflow-hidden py-28 md:py-40">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <Reveal kind="fade">
          <Eyebrow>{reflections.eyebrow}</Eyebrow>
        </Reveal>
        <SplitHeading className="mt-8 font-display text-3xl leading-snug text-ink md:text-5xl" by="words">
          {reflections.title}
        </SplitHeading>
      </div>
      <Reveal kind="fade" className="mt-16">
        <Marquee duration={50}>
          {[...reflections.items, ...reflections.items].map((r, i) => (
            <figure key={i} className="mr-6 flex h-[300px] w-[300px] shrink-0 flex-col border border-ink/10 bg-paper p-8 transition-transform duration-700 hover:-translate-y-1 sm:w-[400px]">
              <div className="flex gap-1 text-sand">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="size-3" />
                ))}
              </div>
              <blockquote className="mt-6 flex-1 font-display text-xl leading-snug text-ink italic md:text-[1.4rem]">“{r.quote}”</blockquote>
              <figcaption className="border-t border-ink/10 pt-4">
                <p className="eyebrow text-plum-deep">{r.author}</p>
                <p className="mt-1 text-sm text-taupe">{r.role}</p>
              </figcaption>
            </figure>
          ))}
        </Marquee>
      </Reveal>
    </section>
  );
}

function Whisper() {
  return (
    <section className="relative isolate overflow-clip bg-dusk px-6 py-32 text-center text-ivory md:py-48">
      <Cosmos tone="dark" className="-z-10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(163,108,155,0.45),transparent_65%)]" />
      <Parallax speed={140} className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <Sigil className="size-[48rem]" opacity={0.1} />
      </Parallax>
      <Reveal kind="fade" className="flex justify-center">
        <Eyebrow tone="light">{whisper.eyebrow}</Eyebrow>
      </Reveal>
      <SplitHeading className="mt-8 text-display-xl" by="chars">
        {whisper.titleA} <em className="text-rose">{whisper.titleB}</em>
      </SplitHeading>
      <Reveal kind="blur" delay={0.2}>
        <p className="mx-auto mt-10 max-w-[560px] text-lg leading-relaxed text-ivory/75">{whisper.body}</p>
      </Reveal>
      <Reveal kind="rise" delay={0.35} className="mt-12">
        <Cta href="#calendly" tone="light" size="lg">
          {whisper.button}
        </Cta>
      </Reveal>
    </section>
  );
}

type CalendlyApi = { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void };
const CAL_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";
let calendlyLoader: Promise<CalendlyApi> | null = null;

/** Load Calendly's widget script once; resolves with the global API. */
function loadCalendly(): Promise<CalendlyApi> {
  const w = window as unknown as { Calendly?: CalendlyApi };
  if (w.Calendly) return Promise.resolve(w.Calendly);
  if (!calendlyLoader) {
    calendlyLoader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = CAL_SCRIPT;
      s.async = true;
      s.onload = () => (w.Calendly ? resolve(w.Calendly) : reject(new Error("Calendly unavailable")));
      s.onerror = () => {
        calendlyLoader = null;
        s.remove();
        reject(new Error("Calendly script blocked"));
      };
      document.body.appendChild(s);
    });
  }
  return calendlyLoader;
}

/**
 * Calendly inline widget, initialised explicitly (works on every SPA visit).
 * Shows a branded loading state, sizes itself from Calendly's page_height,
 * and offers the new-tab scheduler if the calendar cannot load.
 */
function CalendlyEmbed({ onScheduled }: { onScheduled: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [height, setHeight] = useState(720);
  const scheduledRef = useRef(onScheduled);
  scheduledRef.current = onScheduled;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let alive = true;
    el.innerHTML = "";
    loadCalendly()
      .then((api) => alive && api.initInlineWidget({ url: CAL_URL, parentElement: el }))
      .catch(() => alive && setStatus("failed"));

    const timeout = window.setTimeout(() => alive && setStatus((s) => (s === "loading" ? "failed" : s)), 12000);
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com" || typeof e.data?.event !== "string") return;
      const ev: string = e.data.event;
      if (ev === "calendly.event_type_viewed" || ev === "calendly.page_height" || ev === "calendly.profile_page_viewed") setStatus("ready");
      if (ev === "calendly.page_height") {
        const h = parseInt(String(e.data.payload?.height ?? ""), 10);
        if (h > 300) setHeight(Math.min(h, 1100));
      }
      if (ev === "calendly.event_scheduled") scheduledRef.current();
    };
    window.addEventListener("message", onMsg);
    return () => {
      alive = false;
      window.clearTimeout(timeout);
      window.removeEventListener("message", onMsg);
      el.innerHTML = "";
    };
  }, []);

  return (
    <div className="relative w-full" style={{ minHeight: status === "failed" ? 360 : height }}>
      <div
        ref={host}
        className={cn("w-full min-w-[300px] transition-opacity duration-700 [&_iframe]:!h-full", status === "ready" ? "opacity-100" : "opacity-0")}
        style={{ height: status === "failed" ? 0 : height }}
      />
      <AnimatePresence>
        {status !== "ready" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
          >
            {status === "loading" ? (
              <>
                <motion.span animate={{ scale: [0.92, 1.06, 0.92], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="text-plum">
                  <LogoMark className="size-16" />
                </motion.span>
                <span className="relative block h-px w-40 overflow-hidden bg-ink/10">
                  <motion.span className="absolute inset-y-0 left-0 w-1/3 bg-plum" animate={{ x: ["-100%", "320%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }} />
                </span>
                <p className="eyebrow text-plum-deep">{schedule.eyebrow}</p>
              </>
            ) : (
              <>
                <LogoMark className="size-14 text-plum" />
                <p className="font-display text-2xl text-ink md:text-3xl">{schedule.fallback}</p>
                <Cta href={brand.calendly} size="lg">
                  {schedule.fallbackLink}
                </Cta>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Confirmation({ onAgain }: { onAgain: () => void }) {
  const icons = [Wind, Feather, Sun];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: EASE }}
      className="relative overflow-hidden border border-ink/10 bg-ivory p-10 text-center md:p-20"
    >
      <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease: EASE }} className="mx-auto grid size-16 place-items-center rounded-full bg-plum text-ivory">
        <HeartHandshake className="size-7" strokeWidth={1.3} />
      </motion.div>
      <Eyebrow className="mt-8 justify-center">{confirmation.eyebrow}</Eyebrow>
      <h2 className="mt-6 text-display-md text-ink">
        {confirmation.titleA} <em className="text-plum">{confirmation.titleB}</em>
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-taupe">{confirmation.body}</p>
      <div className="mx-auto mt-10 max-w-md border-y border-ink/10 py-6">
        <p className="eyebrow text-plum-deep">{confirmation.timeLabel}</p>
        <p className="mt-2 font-display text-2xl text-ink">{confirmation.timePending}</p>
        <p className="mt-2 text-sm text-taupe">{confirmation.sent}</p>
      </div>
      <p className="mt-12 font-display text-2xl text-ink italic">{confirmation.prepTitle}</p>
      <StaggerList className="mt-8 grid gap-6 text-left md:grid-cols-3" stagger={0.15} delay={0.4}>
        {confirmation.prep.map((p, i) => {
          const Icon = icons[i];
          return (
            <StaggerLi key={p.title} className="border-t border-plum/30 pt-6">
              <Icon className="size-5 text-plum" strokeWidth={1.25} />
              <p className="mt-4 font-display text-xl text-ink">{p.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-taupe">{p.desc}</p>
            </StaggerLi>
          );
        })}
      </StaggerList>
      <div className="mt-14 flex flex-col items-center gap-5">
        <Cta to="/" size="lg">
          {confirmation.home}
        </Cta>
        <button type="button" onClick={onAgain} className="cursor-pointer text-sm text-taupe underline decoration-ink/20 underline-offset-4 hover:text-plum-deep">
          {confirmation.again}
        </button>
      </div>
    </motion.div>
  );
}
