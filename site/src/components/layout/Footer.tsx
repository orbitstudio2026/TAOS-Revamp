import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { Cosmos } from "@/components/ui/Cosmos";
import { brand, footer, nav } from "@/content/site";
import { LogoMark, Star } from "@/components/ui/Ornaments";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0.2, 1], [0, 1]);
  const logoRotate = useTransform(scrollYProgress, [0, 1], [-90, 0]);

  return (
    <footer ref={ref} className="relative isolate overflow-hidden bg-dusk text-ivory">
      <Cosmos tone="dark" className="-z-10" />
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 pt-24 pb-10 md:grid-cols-12 md:px-10 md:pt-32">
        <div className="md:col-span-5">
          <Link to="/" className="inline-flex items-center gap-4 text-rose" aria-label={brand.name}>
            <motion.span style={{ rotate: logoRotate }} className="inline-block">
              <LogoMark className="size-16" />
            </motion.span>
            <span className="font-display text-2xl leading-tight text-ivory">
              {brand.name}
              <span className="block text-base italic text-ivory/75">{brand.tagline}</span>
            </span>
          </Link>
        </div>

        <nav className="md:col-span-4 md:col-start-7" aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="group inline-flex items-center gap-2 font-display text-2xl text-ivory/80 transition-colors hover:text-rose">
                  <Star className="size-2 -translate-x-2 text-rose opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-6 md:col-span-2 md:flex-col md:items-end">
          {footer.legal.map((l) => (
            <a key={l.label} href="#" className="eyebrow text-ivory/80 transition-colors hover:text-rose">
              {l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="hairline opacity-30" />
        <div className="flex flex-col gap-4 py-8 text-sm text-ivory/75 md:flex-row md:items-start md:justify-between">
          <div>
            <p>{footer.copyright}</p>
            <p>{footer.license}</p>
          </div>
          <p className="max-w-xl text-ivory/80 md:text-right">{footer.disclaimer}</p>
        </div>
      </div>

      <motion.div style={{ y, opacity }} aria-hidden className="pointer-events-none select-none px-4 pb-4 md:px-8">
        <p className="font-display text-[23vw] leading-[0.8] tracking-[-0.04em] whitespace-nowrap text-ivory/[0.07]">
          <em className="text-rose/20">Sovereignty</em>
        </p>
      </motion.div>
    </footer>
  );
}
