import { Link } from "react-router-dom";
import { notFound } from "@/content/site";
import { Sigil } from "@/components/ui/Ornaments";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { usePageMeta } from "@/lib/meta";

export default function NotFound() {
  usePageMeta("404 | Alchemy of Sovereignty");
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Sigil className="absolute top-1/2 left-1/2 -z-10 size-[40rem] -translate-x-1/2 -translate-y-1/2" opacity={0.15} />
      <SplitHeading as="h1" by="chars" immediate className="font-display text-[10rem] leading-none text-plum italic md:text-[16rem]">
        {notFound.code}
      </SplitHeading>
      <p className="mt-4 font-display text-3xl text-ink">{notFound.title}</p>
      <Link to="/" className="eyebrow mt-10 text-plum-deep underline decoration-plum/30 underline-offset-8 hover:decoration-plum">
        {notFound.link}
      </Link>
    </section>
  );
}
