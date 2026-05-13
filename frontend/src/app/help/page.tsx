"use client";

import { motion } from "framer-motion";
import { HelpCircle, MessageCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
        <div className="relative bg-[var(--bg-elevated)] p-8 rounded-full border border-[var(--border-subtle)] shadow-2xl">
          <HelpCircle className="w-16 h-16 text-green-400" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 bg-[var(--bg-tertiary)] p-3 rounded-full border border-[var(--border-medium)]"
          >
            <MessageCircle className="w-6 h-6 text-[var(--accent-primary)]" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400 mb-4"
      >
        Centro de Ayuda
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-[var(--text-secondary)] max-w-md"
      >
        ¿Necesitas asistencia? Estamos preparando guías y soporte para ti.
        <br />
        <span className="text-[var(--accent-primary)] font-semibold mt-2 block">
          Próximamente
        </span>
      </motion.p>
    </div>
  );
}
