import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface SplitHeadingProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  by?: "chars" | "words" | "lines";
  /** Play immediately (hero) instead of on scroll. */
  immediate?: boolean;
  delay?: number;
  stagger?: number;
}

/** GSAP SplitText heading: each line is masked and its words/chars rise into place. */
export function SplitHeading({ as: Tag = "h2", children, className, by = "words", immediate, delay = 0, stagger }: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let split: SplitText | undefined;
        document.fonts.ready.then(() => {
          if (!el.isConnected) return;
          split = SplitText.create(el, {
            type: by === "lines" ? "lines" : `lines,${by}`,
            linesClass: "split-line",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              const targets = by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
              return gsap.from(targets, {
                yPercent: 115,
                rotate: by === "chars" ? 4 : 2,
                opacity: 0,
                duration: by === "chars" ? 1.3 : 1.25,
                ease: "expo.out",
                stagger: stagger ?? (by === "chars" ? 0.028 : by === "words" ? 0.06 : 0.12),
                delay,
                scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
              });
            },
          });
        });
        return () => split?.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
