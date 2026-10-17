import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { brand, nav, primaryCta, cta as ctaCopy } from "@/content/site";
import { Cta } from "@/components/ui/Cta";
import { Cosmos } from "@/components/ui/Cosmos";
import { LogoMark, Sigil, Star } from "@/components/ui/Ornaments";
import { useLenis } from "@/components/motion/SmoothScroll";
import { cn, EASE, EASE_VEIL } from "@/lib/utils";

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 240 && y > prev && !open);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={cn("fixed inset-x-0 top-0", open ? "z-[75]" : "z-50")}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-6 px-5 transition-[background-color,padding,border-color,backdrop-filter] duration-700 md:px-10",
            scrolled && !open ? "border-b border-ink/5 bg-ivory/75 py-3 backdrop-blur-xl" : "border-b border-transparent py-5 md:py-7",
          )}
        >
          <Link to="/" className={cn("relative z-[70] flex items-center gap-3", open ? "text-ivory" : "text-plum-deep")} aria-label={brand.name}>
            <LogoMark className="size-9 md:size-10" />
            <span className={cn("font-display text-[1.05rem] leading-[1.05] tracking-tight md:text-[1.2rem]", open ? "text-ivory" : "text-ink")}>
              The Alchemy
              <br />
              <em className={cn("font-light", open ? "text-rose" : "text-plum")}>of Sovereignty</em>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} end className="group relative px-4 py-2">
                {({ isActive }) => (
                  <>
                    <span className="relative block overflow-hidden">
                      <span className="eyebrow block text-ink transition-transform duration-500 ease-[var(--ease-alchemy)] group-hover:-translate-y-full">{item.label}</span>
                      <span className="eyebrow absolute inset-0 block translate-y-full text-plum transition-transform duration-500 ease-[var(--ease-alchemy)] group-hover:translate-y-0">
                        {item.label}
                      </span>
                    </span>
                    {isActive && (
                      <motion.span layoutId="nav-active" className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-plum" transition={{ duration: 0.8, ease: EASE }}>
                        <Star className="size-2" />
                      </motion.span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Cta to="/booking" icon={false}>
                {primaryCta}
              </Cta>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu-overlay"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "relative z-[70] grid size-12 cursor-pointer place-items-center rounded-full border transition-colors duration-500 lg:hidden",
                open ? "border-ivory/30 text-ivory" : "border-ink/15 text-ink",
              )}
            >
              <span className="relative block h-3 w-5">
                <span className={cn("absolute left-0 h-px w-5 bg-current transition-all duration-500 ease-[var(--ease-alchemy)]", open ? "top-1.5 rotate-45" : "top-0")} />
                <span className={cn("absolute left-0 h-px bg-current transition-all duration-500 ease-[var(--ease-alchemy)]", open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3")} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[72] flex flex-col overflow-hidden bg-dusk text-ivory"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.9, ease: EASE_VEIL }}
          >
            <Cosmos tone="dark" />
            <Sigil className="absolute -right-40 -bottom-40 size-[34rem]" opacity={0.12} />
            <nav className="relative mt-32 flex flex-1 flex-col gap-1 px-6" aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "60%", opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.07 }}
                  className="overflow-hidden"
                >
                  <NavLink to={item.to} end className={({ isActive }) => cn("block py-1 font-display text-[3.2rem] leading-none tracking-tight", isActive ? "italic text-rose" : "text-ivory")}>
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              className="relative flex flex-col gap-6 px-6 pb-10"
            >
              <Cta to="/booking" tone="light" size="lg">
                {ctaCopy.button}
              </Cta>
              <p className="font-display text-lg italic text-ivory/75">{brand.tagline}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
