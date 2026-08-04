"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
};

/* Keep motion on the Y axis only — horizontal offsets expand page width on mobile. */
const offsets = {
  up: { y: 28 },
  down: { y: -20 },
  left: { y: 24 },
  right: { y: 24 },
};

export function SectionReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: Props) {
  const reduced = useReducedMotion();
  const offset = offsets[direction];

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
