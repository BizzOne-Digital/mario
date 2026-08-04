"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function GlassImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  priority,
  sizes,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  const image = (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      priority={priority}
      sizes={sizes}
      onLoad={() => setLoaded(true)}
      className={`object-cover transition duration-700 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-glass/20 bg-charcoal/40 ${className}`}
    >
      {fill ? <div className="absolute inset-0">{image}</div> : image}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-glass/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}
