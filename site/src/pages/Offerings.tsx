import { PageHeader } from "@/components/sections/PageHeader";
import { Offerings as OfferingsSection } from "@/components/sections/home/Sections";
import { CtaSection } from "@/components/sections/Shared";
import { usePageMeta } from "@/lib/meta";

export default function Offerings() {
  usePageMeta(
    "Coaching Offerings & Programs | Alchemy of Sovereignty",
    "Discover Vishakha's soul-led coaching programs — 1:1 mentorship, group journeys, and immersive healing containers to reclaim your sovereignty.",
  );
  return (
    <>
      <PageHeader
        title={
          <>
            Coaching Offerings <em className="font-light text-plum">&amp; Programs</em>
          </>
        }
      />
      <OfferingsSection />
      <CtaSection />
    </>
  );
}
