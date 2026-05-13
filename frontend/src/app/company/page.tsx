"use client";

import { motion } from "framer-motion";
import { Building2, Globe } from "lucide-react";

export default function CompanyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="relative bg-[var(--bg-elevated)] p-8 rounded-full border border-[var(--border-subtle)] shadow-2xl">
          <Building2 className="w-16 h-16 text-indigo-400" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-2 -left-2 bg-[var(--bg-tertiary)] p-3 rounded-full border border-[var(--border-medium)]"
          >
            <Globe className="w-6 h-6 text-[var(--accent-primary)]" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4"
      >
        Sobre la Compañía
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-[var(--text-secondary)] max-w-md"
      >
        Conoce más sobre nuestra misión, visión y el equipo detrás de The
        Mirrow.
        <br />
        <span className="text-[var(--accent-primary)] font-semibold mt-2 block">
          Próximamente
        </span>
      </motion.p>
    </div>
  );
}
