import Image from "next/image";
import { PAGE_IMAGES } from "@/lib/media";

export function LegalLayout({
  title,
  image,
  children,
}: {
  title: string;
  image: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="relative min-h-[36vh] overflow-hidden">
        <Image src={image} alt="" fill className="object-cover opacity-50" sizes="100vw" aria-hidden />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="container-eg relative z-10 flex min-h-[36vh] w-full min-w-0 items-end px-4 pb-10 md:px-6">
          <h1 className="font-display text-[2rem] text-frost sm:text-4xl md:text-5xl">{title}</h1>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-eg max-w-3xl space-y-4 leading-relaxed text-steel">{children}</div>
        <div className="container-eg mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-5">
          {PAGE_IMAGES.legal.strip.map((src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={src} alt="" fill className="object-cover" sizes="100px" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
