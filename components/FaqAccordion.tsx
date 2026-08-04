"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

export type FaqItem = {
  _id: string;
  question: string;
  answer: string;
  category: string;
};

export function FaqAccordion({
  items,
  showSearch = true,
}: {
  items: FaqItem[];
  showSearch?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?._id ?? null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const catOk = category === "All" || item.category === category;
      const qOk =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [items, query, category]);

  return (
    <div className="space-y-6">
      {showSearch ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="relative block w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-steel" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQs"
              className="input-eg pl-10"
              aria-label="Search FAQs"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  category === cat
                    ? "bg-glass text-navy"
                    : "border border-glass/25 text-frost/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {filtered.map((item) => {
          const open = openId === item._id;
          return (
            <div key={item._id} className="glass-panel overflow-hidden rounded-xl">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : item._id)}
              >
                <span className="font-medium text-frost">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-glass transition ${open ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="border-t border-glass/15 px-5 py-4 text-sm leading-relaxed text-steel">
                      {item.answer}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
        {!filtered.length ? (
          <p className="text-center text-steel">No FAQs match your search.</p>
        ) : null}
      </div>
    </div>
  );
}
