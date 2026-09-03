"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  caption?: string;
  className?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  caption,
  className = "",
}: Props) {
  const [pos, setPos] = useState(50);

  return (
    <div className={`glass-panel overflow-hidden rounded-2xl ${className}`}>
      <div className="relative aspect-[16/10] w-full max-w-full select-none">
        <Image src={afterSrc} alt={afterAlt} fill className="object-cover" sizes="(max-width:768px) 100vw, 800px" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image src={beforeSrc} alt={beforeAlt} fill className="object-cover" sizes="(max-width:768px) 100vw, 800px" />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-glass"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-glass/50 bg-navy/80 text-xs text-frost">
            ↔
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          aria-label="Compare before and after"
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
        />
        <span className="absolute left-3 top-3 rounded-full bg-navy/70 px-3 py-1 text-xs text-frost">
          Before
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-navy/70 px-3 py-1 text-xs text-frost">
          After
        </span>
      </div>
      {caption ? (
        <p className="border-t border-glass/15 px-4 py-3 text-sm text-steel">{caption}</p>
      ) : null}
    </div>
  );
}
