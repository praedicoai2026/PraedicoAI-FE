"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
export function Entrance({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={false}
      whileInView={reduced ? undefined : { y: [24, 0], opacity: [0.65, 1] }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
