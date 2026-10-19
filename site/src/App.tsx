import { lazy, Suspense, useCallback } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Newsletter } from "@/components/layout/Newsletter";
import { Cursor, Grain, MusicToggle, PageVeil, Preloader, ScrollProgress } from "@/components/layout/Chrome";
import { SmoothScroll, useLenis } from "@/components/motion/SmoothScroll";
import { ScrollTrigger } from "@/lib/gsap";
import { Cosmos } from "@/components/ui/Cosmos";
import { EASE } from "@/lib/utils";
import Home from "@/pages/Home";

const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Offerings = lazy(() => import("@/pages/Offerings"));
const Faq = lazy(() => import("@/pages/Faq"));
const Booking = lazy(() => import("@/pages/Booking"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageVeil />
      <motion.main
        id="main"
        className="relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
        onAnimationComplete={() => ScrollTrigger.refresh()}
      >
        <Suspense fallback={<div className="min-h-[100svh]" />}>{children}</Suspense>
      </motion.main>
    </>
  );
}

function Shell() {
  const location = useLocation();
  const lenis = useLenis();

  const onExitComplete = useCallback(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [lenis]);

  return (
    <>
      <a href="#main" className="eyebrow sr-only z-[300] bg-plum-deep px-4 py-3 text-ivory focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to content
      </a>
      <Cosmos tone="light" fixed />
      <Preloader />
      <ScrollProgress />
      <Nav />
      <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/services" element={<Page><Services /></Page>} />
          <Route path="/offerings" element={<Page><Offerings /></Page>} />
          {/* Old address from the previous site; keep it alive so existing links still land on Offerings */}
          <Route path="/OfferingsIN" element={<Page><Offerings /></Page>} />
          <Route path="/faq" element={<Page><Faq /></Page>} />
          <Route path="/booking" element={<Page><Booking /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <Newsletter />
      <MusicToggle />
      <Cursor />
      <Grain />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Shell />
      </SmoothScroll>
    </MotionConfig>
  );
}
