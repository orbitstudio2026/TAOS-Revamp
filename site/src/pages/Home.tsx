import { Hero } from "@/components/sections/home/Hero";
import { FindPath, HealGallery, Journey, Offerings, Pillars, Toolkit, Values } from "@/components/sections/home/Sections";
import { CtaSection } from "@/components/sections/Shared";
import { usePageMeta } from "@/lib/meta";

export default function Home() {
  usePageMeta(
    "The Alchemy of Sovereignty — Spiritual Coaching & Reiki",
    "Spiritual Life Coach Vishakha guides you through soul healing and self-awakening. Break free from toxic patterns and reclaim your sovereignty.",
  );
  return (
    <>
      <Hero />
      <FindPath />
      <Pillars />
      <HealGallery />
      <Toolkit />
      <Offerings />
      <Values />
      <Journey />
      <CtaSection />
    </>
  );
}
