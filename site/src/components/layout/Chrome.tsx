import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from "motion/react";
import { brand } from "@/content/site";
import { LogoMark } from "@/components/ui/Ornaments";
import { cn, EASE, EASE_VEIL, asset } from "@/lib/utils";

/** Thin gold thread across the top that tracks reading progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-plum via-rose to-sand"
      style={{ scaleX }}
    />
  );
}

/** Custom cursor: a precise dot plus a lagging halo that blooms over interactive elements. Desktop pointers only. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const hx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const hy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine);
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest("a, button, [role=button], input, textarea, summary, [data-cursor]"));
    };
    const leave = () => setVisible(false);
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum-deep"
        style={{ x, y, opacity: visible ? 1 : 0 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full border border-plum/60"
        style={{ x: hx, y: hy, opacity: visible ? 1 : 0 }}
        animate={{
          width: hover ? 64 : 34,
          height: hover ? 64 : 34,
          backgroundColor: hover ? "rgba(213,165,165,0.18)" : "rgba(213,165,165,0)",
          scale: down ? 0.8 : 1,
        }}
        transition={{ duration: 0.45, ease: EASE }}
      />
    </>
  );
}

/** First-visit preloader: the mark breathes in, the name resolves, then the veil lifts. */
export function Preloader() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      return sessionStorage.getItem("taos-preloaded") !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem("taos-preloaded", "1");
      } catch {
        /* storage unavailable */
      }
    }, 2600);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ivory"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1.1, ease: EASE_VEIL }}
          aria-hidden
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -40 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="text-plum"
          >
            <LogoMark className="size-24 md:size-28" />
          </motion.div>
          <div className="mt-8 overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
              className="font-display text-2xl tracking-tight text-ink md:text-3xl"
            >
              {brand.name}
            </motion.p>
          </div>
          <div className="mt-6 h-px w-40 overflow-hidden bg-ink/10">
            <motion.div className="h-full origin-left bg-plum" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Ambient background music toggle (off by default; starts only on user request). */
export function MusicToggle() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const a = audio.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.volume = 0.35;
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <>
      <audio ref={audio} src={asset("music/background.mp3")} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        className="group fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 grid size-12 cursor-pointer place-items-center rounded-full border border-ink/10 bg-ivory/80 text-plum-deep shadow-[0_8px_30px_-12px_rgba(60,54,52,0.35)] backdrop-blur-md transition-transform duration-500 hover:scale-105 md:right-8 md:bottom-8"
      >
        <span className="flex h-4 items-end gap-[3px]">
          {[0.9, 0.5, 1, 0.65].map((h, i) => (
            <motion.span
              key={i}
              className="block w-[2px] rounded-full bg-current"
              animate={playing ? { height: ["30%", `${h * 100}%`, "45%", `${h * 80}%`, "30%"] } : { height: "30%" }}
              transition={playing ? { duration: 1.1 + i * 0.15, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
            />
          ))}
        </span>
      </button>
    </>
  );
}

/** Route veil: a dusk curtain sweeps over on exit and lifts away on enter. */
export function PageVeil() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] origin-top bg-dusk"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: EASE_VEIL, delay: 0.1 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] origin-bottom bg-dusk"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.7, ease: EASE_VEIL }}
      />
    </>
  );
}

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.24  0 0 0 0 0.2  0 0 0 0 0.2  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Film grain overlay. */
export function Grain({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 z-[55] hidden overflow-hidden md:block", className)}>
      <div className="absolute -inset-1/2 opacity-[0.07] animate-[grain_1.2s_steps(6)_infinite] motion-reduce:animate-none" style={{ backgroundImage: NOISE }} />
    </div>
  );
}
