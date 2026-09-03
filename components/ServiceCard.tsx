import Image from "next/image";
import Link from "next/link";
import { MEDIA } from "@/lib/media";

type Props = {
  name: string;
  slug: string;
  shortDescription: string;
  mainImage?: string;
  imageAlt?: string;
  className?: string;
};

export function ServiceCard({
  name,
  slug,
  shortDescription,
  mainImage = MEDIA.heroes.residentialWindows,
  imageAlt,
  className = "",
}: Props) {
  return (
    <article
      className={`glass-panel group flex h-full flex-col overflow-hidden rounded-2xl ${className}`}
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
        <Image
          src={mainImage}
          alt={imageAlt || name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-lg leading-snug text-frost sm:text-xl">{name}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-steel">
          {shortDescription}
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link href={`/services/${slug}`} className="text-glass hover:text-cyan-light">
            Learn More
          </Link>
          <Link href="/contact" className="text-frost/80 hover:text-frost">
            Request Estimate
          </Link>
        </div>
      </div>
    </article>
  );
}
