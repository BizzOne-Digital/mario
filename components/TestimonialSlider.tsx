"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

export type TestimonialItem = {
  _id: string;
  customerName: string;
  reviewText: string;
  service?: string;
  location?: string;
  rating?: number;
};

export function TestimonialSlider({ items }: { items: TestimonialItem[] }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  if (!items.length) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-steel">
        Customer testimonials will appear here once approved in the admin portal.
      </div>
    );
  }

  const item = items[index];
  const rating = item.rating ?? 5;

  function prev() {
    setIndex((i) => (i - 1 + items.length) % items.length);
  }
  function next() {
    setIndex((i) => (i + 1) % items.length);
  }

  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-5 sm:p-6 md:p-10">
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={item._id}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-4 flex justify-center gap-1 text-accent">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
            ))}
          </div>
          <p className="font-display text-lg leading-relaxed break-words text-frost sm:text-xl md:text-2xl">
            “{item.reviewText}”
          </p>
          <footer className="mt-6 text-sm text-steel">
            <cite className="not-italic text-cyan-light">{item.customerName}</cite>
            {(item.service || item.location) && (
              <span>
                {" "}
                — {[item.service, item.location].filter(Boolean).join(" · ")}
              </span>
            )}
          </footer>
        </motion.blockquote>
      </AnimatePresence>
      {items.length > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={prev}
            className="rounded-full border border-glass/30 p-2 text-frost hover:bg-glass/10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xs text-steel">
            {index + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-glass/30 p-2 text-frost hover:bg-glass/10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
