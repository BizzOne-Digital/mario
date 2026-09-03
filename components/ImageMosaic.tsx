import Image from "next/image";

type MosaicImage = {
  src: string;
  alt: string;
};

type Props = {
  images: MosaicImage[];
  className?: string;
};

/** Five-image mosaic: one large + four supporting. */
export function ImageMosaic({ images, className = "" }: Props) {
  const items = images.slice(0, 5);
  if (items.length < 5) {
    return (
      <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {items.map((img) => (
          <div key={img.src + img.alt} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="33vw" />
          </div>
        ))}
      </div>
    );
  }

  const [a, b, c, d, e] = items;

  return (
    <div className={`grid gap-3 md:grid-cols-4 md:grid-rows-2 ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[320px]">
        <Image src={a.src} alt={a.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image src={b.src} alt={b.alt} fill className="object-cover" sizes="25vw" />
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image src={c.src} alt={c.alt} fill className="object-cover" sizes="25vw" />
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image src={d.src} alt={d.alt} fill className="object-cover" sizes="25vw" />
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image src={e.src} alt={e.alt} fill className="object-cover" sizes="25vw" />
      </div>
    </div>
  );
}
