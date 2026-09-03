"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { BUSINESS } from "@/lib/constants";

const STORAGE_KEY = "eg-intro-seen";

type Phase = "boot" | "play" | "done";

type Props = {
  enabled: boolean;
  active?: boolean;
  onFinished?: () => void;
};

export function IntroSequence({ enabled, active = true, onFinished }: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("boot");

  useEffect(() => {
    if (!active || !enabled || reduced) {
      setPhase("done");
      onFinished?.();
      return;
    }

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setPhase("done");
        onFinished?.();
        return;
      }
    } catch {
      setPhase("done");
      onFinished?.();
      return;
    }

    setPhase("play");
    const timer = window.setTimeout(() => finish(), 3800);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, enabled, reduced]);

  useEffect(() => {
    if (phase === "play" || phase === "boot") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [phase]);

  function finish() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setPhase("done");
    onFinished?.();
  }

  if (phase === "done") {
    return null;
  }

  // Solid cover during boot so the site never flashes before intro
  if (phase === "boot") {
    return (
      <div
        className="fixed inset-0 z-[300] bg-navy"
        aria-hidden
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-navy"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55 }}
        role="dialog"
        aria-label="Express Glass intro"
      >
        <motion.div
          className="absolute top-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-light to-transparent"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "100%", opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute h-48 w-72 rotate-[-8deg] rounded-xl border border-glass/40 bg-glass/10"
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 0.7, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        <motion.div
          className="absolute h-40 w-64 rotate-[10deg] rounded-xl border border-cyan-light/30 bg-cyan-light/5"
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 0.8, scale: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
        />

        <div className="relative z-10 px-6 text-center">
          <motion.div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-glass/40 bg-charcoal/60 font-display text-3xl text-glass"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            EG
          </motion.div>
          <motion.p
            className="font-display text-2xl text-frost md:text-3xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.7 }}
          >
            {BUSINESS.tagline}
          </motion.p>
        </div>

        <button
          type="button"
          onClick={finish}
          className="absolute right-5 bottom-5 rounded-full border border-glass/30 px-4 py-2 text-sm text-frost/80 hover:bg-glass/10"
        >
          Skip Intro
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
