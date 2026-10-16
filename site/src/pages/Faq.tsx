import { faq } from "@/content/offerings";
import { PageHeader } from "@/components/sections/PageHeader";
import { Accordion, CtaSection } from "@/components/sections/Shared";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax, ParallaxImage } from "@/components/motion/Parallax";
import { usePageMeta } from "@/lib/meta";

export default function Faq() {
  usePageMeta("Frequently Asked Questions | Alchemy of Sovereignty", "Answers about Reiki, spiritual coaching, energy healing sessions, and what to expect on your soul journey with Vishakha.");
  return (
    <>
      <PageHeader
        eyebrow={faq.eyebrow}
        title={
          <>
            Frequently Asked <em className="font-light text-plum">Questions</em>
          </>
        }
      />
      <section className="px-6 pb-32 md:px-10 md:pb-44">
        <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-12">
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-32">
              <Parallax speed={40}>
                <Reveal kind="mask" duration={1.6}>
                  <ParallaxImage src="/assets/about-story.jpg" alt="" className="arch aspect-[3/4] w-full" amount={10} />
                </Reveal>
              </Parallax>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Accordion items={faq.items} />
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
