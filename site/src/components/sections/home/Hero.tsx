import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { hero } from "@/content/home";
import { Cta } from "@/components/ui/Cta";
import { Eyebrow, Orb, Sigil, Star } from "@/components/ui/Ornaments";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Marquee } from "@/components/motion/Marquee";
import { EASE, asset } from "@/lib/utils";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Pointer parallax — each layer drifts by a different depth.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const archX = useTransform(sx, (v) => v * -14);
  const archY = useTransform(sy, (v) => v * -10);
  const sigilX = useTransform(sx, (v) => v * 36);
  const sigilY = useTransform(sy, (v) => v * 28);
  const orbX = useTransform(sx, (v) => v * 60);
  const orbY = useTransform(sy, (v) => v * 50);

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my, reduce]);

  // Scroll choreography — title lifts away faster than the arch; the image breathes in.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const archScrollY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.28]);
  const sigilScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden pt-28 md:pt-32">
      <motion.div style={reduce ? undefined : { x: orbX, y: orbY }} className="absolute -top-32 left-[30%] -z-10">
        <Orb className="relative size-[36rem]" color="rose" />
      </motion.div>
      <motion.div style={reduce ? undefined : { x: orbX, y: orbY }} className="absolute right-[-10%] bottom-[5%] -z-10">
        <Orb className="relative size-[30rem] [animation-delay:3s]" color="plum" />
      </motion.div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-end gap-12 px-6 md:px-10 lg:grid-cols-12 lg:gap-8">
        <motion.div style={reduce ? undefined : { y: titleY, opacity: titleOpacity }} className="relative z-10 lg:col-span-7 lg:pb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: EASE }}>
            <Eyebrow>{hero.kicker}</Eyebrow>
          </motion.div>
          <SplitHeading as="h1" by="chars" immediate delay={0.35} stagger={0.03} className="mt-8 text-display-xl text-ink">
            A Saga of <em className="font-light text-plum">Self</em>
            <br />
            <em className="font-light text-plum">Awakening</em>
          </SplitHeading>
          <motion.p
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.3, delay: 1.1, ease: EASE }}
            className="mt-10 max-w-[30rem] text-lg leading-relaxed text-taupe md:text-xl"
          >
            {hero.body}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 1.35, ease: EASE }} className="mt-10 flex flex-wrap items-center gap-8">
            <Cta to="/booking" size="lg">
              {hero.cta}
            </Cta>
            <span className="eyebrow hidden items-center gap-3 text-taupe sm:flex">
              <span className="relative block h-10 w-px overflow-hidden bg-ink/15">
                <motion.span
                  className="absolute inset-x-0 top-0 h-1/2 bg-plum"
                  animate={reduce ? undefined : { y: ["-100%", "200%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
                />
              </span>
              {hero.scroll}
            </span>
          </motion.div>
        </motion.div>

        <div className="relative lg:col-span-5">
          <motion.div style={reduce ? undefined : { x: sigilX, y: sigilY, scale: sigilScale }} className="absolute -top-16 -right-24 -z-10 md:-top-24 md:-right-32">
            <Sigil className="size-[22rem] md:size-[30rem]" opacity={0.28} spin={90} />
          </motion.div>
          <motion.div
            style={reduce ? undefined : { x: archX, y: archY }}
            initial={{ clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)" }}
            transition={{ duration: 1.8, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="relative mx-auto aspect-[3/4] w-full max-w-[460px]"
          >
            <motion.div style={reduce ? undefined : { y: archScrollY }} className="arch absolute inset-0 overflow-hidden bg-mist">
              <motion.img
                src={asset("assets/vishakha-awakening.jpg")}
                alt="Vishakha in meditation by the water"
                className="h-full w-full object-cover object-[32%_50%]"
                style={reduce ? undefined : { scale: imgScale }}
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/35 via-transparent to-transparent mix-blend-multiply" />
            </motion.div>
            <div aria-hidden className="arch pointer-events-none absolute -inset-3 border border-plum/25" />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        className="relative mt-16 border-y border-ink/10 bg-ivory/60 py-5 backdrop-blur-sm md:mt-20"
      >
        <Marquee duration={36}>
          {[...hero.credentials, ...hero.credentials].map((c, i) => (
            <span key={i} className="flex items-center gap-10 pr-10">
              <span className="font-display text-2xl whitespace-nowrap text-ink italic md:text-3xl">{c}</span>
              <Star className="size-3 text-plum" />
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
