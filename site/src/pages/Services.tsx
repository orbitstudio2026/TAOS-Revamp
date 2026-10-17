import { modalities, type Category } from "@/content/services";
import { Cosmos } from "@/components/ui/Cosmos";
import { PageHeader } from "@/components/sections/PageHeader";
import { Toolkit } from "@/components/sections/home/Sections";
import { CtaSection } from "@/components/sections/Shared";
import { Reveal, StaggerList, StaggerLi } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Sigil, Star } from "@/components/ui/Ornaments";
import { usePageMeta } from "@/lib/meta";

const order: Category[] = ["Mind", "Spirit", "Energy", "Body", "Practice", "Resource"];

export default function Services() {
  usePageMeta(
    "Healing Services & Modalities | Alchemy of Sovereignty",
    "Reiki, spiritual life coaching, hypnotherapy, Akashic records and intuitive energy work — all held online worldwide.",
  );

  return (
    <>
      <PageHeader
        title={
          <>
            Healing Services <em className="font-light text-plum">&amp; Modalities</em>
          </>
        }
      />
      <Toolkit />

      {/* Modality index — every tool in the orbit, as a readable ledger */}
      <section className="relative isolate overflow-clip bg-dusk px-6 py-14 text-ivory md:px-10 md:py-24">
        <Cosmos tone="dark" className="-z-10" />
        <Parallax speed={-180} className="absolute -bottom-40 -left-40 -z-10">
          <Sigil className="size-[44rem]" opacity={0.08} />
        </Parallax>
        <div className="mx-auto max-w-[1400px] space-y-12">
          {order.map((cat) => {
            const items = modalities.filter((m) => m.category === cat);
            return (
              <div key={cat} className="grid gap-8 lg:grid-cols-12">
                <Reveal kind="fade" className="lg:col-span-3">
                  <p className="font-display text-4xl text-rose italic lg:sticky lg:top-32">{cat}</p>
                </Reveal>
                <StaggerList className="lg:col-span-9" stagger={0.07}>
                  {items.map((m) => (
                    <StaggerLi key={m.id} className="group grid gap-2 border-t border-ivory/12 py-7 md:grid-cols-[1fr_1.2fr] md:gap-10">
                      <div className="flex items-start gap-4">
                        <Star className="mt-2.5 size-2.5 text-sand transition-transform duration-700 group-hover:rotate-180" />
                        <div>
                          <h3 className="font-display text-3xl leading-tight transition-colors duration-500 group-hover:text-rose md:text-4xl">{m.title}</h3>
                          <p className="eyebrow mt-2 text-ivory/80">{m.date}</p>
                        </div>
                      </div>
                      <p className="pl-7 text-lg leading-relaxed text-ivory/80 md:pl-0 md:pt-2">{m.content}</p>
                    </StaggerLi>
                  ))}
                </StaggerList>
              </div>
            );
          })}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
