import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Eyebrow, Sigil } from "@/components/ui/Ornaments";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Atmosphere } from "@/components/sections/Shared";
import { EASE } from "@/lib/utils";

/** Interior page masthead: oversized title with a parallax sigil and a scroll-out lift. */
export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1]);
  const sigilY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const sigilRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section ref={ref} className="relative isolate overflow-clip px-6 pt-32 pb-8 md:px-10 md:pt-40 md:pb-12">
      <Atmosphere />
      <motion.div style={{ y: sigilY, rotate: sigilRotate }} className="absolute -top-24 -right-40 -z-10 md:-right-20">
        <Sigil className="size-[30rem] md:size-[42rem]" opacity={0.2} />
      </motion.div>
      <motion.div style={{ y, opacity }} className="mx-auto max-w-[1400px]">
        {eyebrow && (
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, delay: 0.25, ease: EASE }}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </motion.div>
        )}
        <SplitHeading as="h1" by="chars" immediate delay={0.3} stagger={0.022} className="mt-8 max-w-6xl text-display-xl text-ink">
          {title}
        </SplitHeading>
        {children && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.9, ease: EASE }}>
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
