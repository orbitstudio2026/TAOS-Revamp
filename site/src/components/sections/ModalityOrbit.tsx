// Adapted from 21st.dev "Radial Orbital Timeline" by jatin-yadav05 —
// https://21st.dev/@jatin-yadav05/components/radial-orbital-timeline
// Re-engineered with motion values (no per-frame React state), brand styling, keyboard access and a side panel.
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  AudioLines,
  BookOpen,
  Brain,
  Eye,
  Flower2,
  Gem,
  HandHeart,
  Heart,
  History,
  Infinity as InfinityIcon,
  Library,
  MessageCircleHeart,
  Moon,
  Orbit,
  Puzzle,
  Sparkles,
  Waves,
  Wind,
  ArrowRight,
  type LucideProps,
} from "lucide-react";
import { modalities, toolkit, type Modality } from "@/content/services";
import { LogoMark } from "@/components/ui/Ornaments";
import { cn, EASE } from "@/lib/utils";

const ICONS: Record<number, ComponentType<LucideProps>> = {
  1: Brain, 2: Moon, 3: BookOpen, 4: HandHeart, 5: Wind, 6: Eye, 7: Sparkles, 8: History, 9: InfinityIcon,
  10: Waves, 11: Heart, 12: Library, 13: AudioLines, 14: Gem, 15: Puzzle, 16: MessageCircleHeart, 17: Flower2, 18: Orbit,
};

function useOrbitSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState(560);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export function ModalityOrbit({ tone = "light" }: { tone?: "light" | "dark" }) {
  const wrap = useRef<HTMLDivElement>(null);
  const size = useOrbitSize(wrap);
  const radius = size * 0.42;
  const reduce = useReducedMotion();
  const rotation = useMotionValue(0);
  const [active, setActive] = useState<Modality | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const auto = !active && hovered === null && !reduce;

  useAnimationFrame((_, delta) => {
    if (auto) rotation.set(rotation.get() + delta * 0.006);
  });

  // Scrolling nudges the orbit, so the wheel feels connected to the page.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    if (!auto) return;
    const prev = scrollY.getPrevious() ?? y;
    rotation.set(rotation.get() + (y - prev) * 0.05);
  });

  const select = (m: Modality | null) => {
    setActive(m);
    if (!m) return;
    const i = modalities.findIndex((x) => x.id === m.id);
    const base = (i / modalities.length) * 360;
    const current = rotation.get();
    let target = -90 - base;
    target += Math.round((current - target) / 360) * 360;
    animate(rotation, target, { duration: reduce ? 0 : 1.3, ease: EASE });
  };

  const dark = tone === "dark";

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
      <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[620px]">
        {/* Rings */}
        <div aria-hidden className={cn("absolute inset-[8%] rounded-full border", dark ? "border-ivory/10" : "border-ink/10")} />
        <div aria-hidden className={cn("absolute inset-[20%] rounded-full border border-dashed", dark ? "border-rose/20" : "border-sand/50")} />
        <motion.div
          aria-hidden
          className="absolute inset-[30%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(213,165,165,0.35) 0%, rgba(163,108,155,0.12) 45%, transparent 70%)" }}
          animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center — resumes the orbit */}
        <button
          type="button"
          onClick={() => select(null)}
          aria-label="Resume the orbit"
          className={cn(
            "absolute top-1/2 left-1/2 z-20 grid size-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full transition-transform duration-700 hover:scale-105 md:size-28",
            dark ? "bg-ivory/5 text-rose ring-1 ring-ivory/15" : "bg-paper text-plum shadow-[0_20px_60px_-20px_rgba(122,74,113,0.5)] ring-1 ring-plum/15",
          )}
        >
          {!reduce && (
            <>
              <span className="absolute inset-0 animate-ping rounded-full ring-1 ring-plum/20 [animation-duration:3s]" />
              <span className="absolute -inset-3 animate-ping rounded-full ring-1 ring-plum/10 [animation-delay:1.2s] [animation-duration:3s]" />
            </>
          )}
          <LogoMark className="size-12 md:size-14" />
        </button>

        {modalities.map((m, i) => (
          <Node
            key={m.id}
            m={m}
            index={i}
            total={modalities.length}
            radius={radius}
            rotation={rotation}
            active={active?.id === m.id}
            related={!!active?.relatedIds.includes(m.id)}
            dimmed={!!active && active.id !== m.id && !active.relatedIds.includes(m.id)}
            dark={dark}
            onSelect={() => select(active?.id === m.id ? null : m)}
            onHover={(h) => setHovered(h ? m.id : null)}
          />
        ))}
      </div>

      {/* Detail panel */}
      <div className="relative min-h-[300px]" aria-live="polite">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p className={cn("eyebrow", dark ? "text-sand" : "text-plum-deep")}>
                {active.date} · {active.category}
              </p>
              <h3 className={cn("mt-4 text-display-md italic", dark ? "text-ivory" : "text-ink")}>{active.title}</h3>
              <p className={cn("mt-5 max-w-md text-lg leading-relaxed", dark ? "text-ivory/75" : "text-taupe")}>{active.content}</p>

              <div className="mt-8 max-w-sm">
                <div className={cn("eyebrow mb-2 flex justify-between", dark ? "text-ivory/75" : "text-taupe")}>
                  <span>Energy Level</span>
                  <span className="tabular-nums">{active.energy}%</span>
                </div>
                <div className={cn("h-px w-full", dark ? "bg-ivory/15" : "bg-ink/10")}>
                  <motion.div
                    className="h-px bg-gradient-to-r from-plum via-rose to-sand"
                    initial={{ width: 0 }}
                    animate={{ width: `${active.energy}%` }}
                    transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
                  />
                </div>
              </div>

              {active.relatedIds.length > 0 && (
                <div className="mt-8">
                  <p className={cn("eyebrow mb-3", dark ? "text-ivory/75" : "text-taupe")}>Connected Nodes</p>
                  <div className="flex flex-wrap gap-2">
                    {active.relatedIds.map((rid) => {
                      const r = modalities.find((x) => x.id === rid)!;
                      return (
                        <button
                          key={rid}
                          type="button"
                          onClick={() => select(r)}
                          className={cn(
                            "group inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-500",
                            dark ? "border-ivory/20 text-ivory/80 hover:border-rose hover:text-rose" : "border-ink/15 text-ink hover:border-plum hover:bg-plum hover:text-ivory",
                          )}
                        >
                          {r.title}
                          <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <p className={cn("font-display text-2xl leading-snug italic md:text-3xl", dark ? "text-ivory/80" : "text-ink/80")}>{toolkit.hint}</p>
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {modalities.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => select(m)}
                      onFocus={() => setHovered(m.id)}
                      onBlur={() => setHovered(null)}
                      className={cn(
                        "cursor-pointer text-sm underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:decoration-current",
                        dark ? "text-ivory/75 hover:text-rose" : "text-taupe hover:text-plum-deep",
                      )}
                    >
                      {m.title}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Node({
  m,
  index,
  total,
  radius,
  rotation,
  active,
  related,
  dimmed,
  dark,
  onSelect,
  onHover,
}: {
  m: Modality;
  index: number;
  total: number;
  radius: number;
  rotation: MotionValue<number>;
  active: boolean;
  related: boolean;
  dimmed: boolean;
  dark: boolean;
  onSelect: () => void;
  onHover: (h: boolean) => void;
}) {
  const Icon = ICONS[m.id];
  const base = (index / total) * 360;
  const x = useTransform(rotation, (r) => radius * Math.cos(((base + r) * Math.PI) / 180));
  const y = useTransform(rotation, (r) => radius * Math.sin(((base + r) * Math.PI) / 180));
  const depth = useTransform(rotation, (r) => {
    const s = Math.sin(((base + r) * Math.PI) / 180);
    return 0.65 + 0.35 * ((1 - s) / 2);
  });
  const [hover, setHover] = useState(false);

  return (
    <motion.div className="absolute top-1/2 left-1/2 z-10" style={{ x, y, opacity: dimmed ? 0.3 : active || related ? 1 : depth }}>
      <button
        type="button"
        aria-label={m.title}
        aria-pressed={active}
        onClick={onSelect}
        onPointerEnter={() => {
          setHover(true);
          onHover(true);
        }}
        onPointerLeave={() => {
          setHover(false);
          onHover(false);
        }}
        className={cn(
          "relative grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border transition-all duration-500 md:size-12",
          active
            ? "scale-125 border-plum bg-plum text-ivory shadow-[0_10px_30px_-8px_rgba(122,74,113,0.7)]"
            : related
              ? "border-rose bg-blush text-plum-deep"
              : dark
                ? "border-ivory/20 bg-dusk-2 text-ivory/80 hover:border-rose hover:text-rose"
                : "border-ink/10 bg-paper text-plum-deep hover:border-plum hover:bg-plum hover:text-ivory",
        )}
      >
        <Icon className="size-[18px]" strokeWidth={1.4} />
        {related && <span className="absolute inset-0 animate-ping rounded-full ring-1 ring-rose/60 [animation-duration:2.4s]" />}
      </button>
      <AnimatePresence>
        {(hover || active) && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={cn(
              "eyebrow pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 whitespace-nowrap",
              dark ? "bg-ivory text-dusk" : "bg-dusk text-ivory",
            )}
          >
            {m.title}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
