"use client";

import { motion } from "framer-motion";
import { Settings, Wrench } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
        <div className="relative bg-[var(--bg-elevated)] p-8 rounded-full border border-[var(--border-subtle)] shadow-2xl">
          <Settings className="w-16 h-16 text-purple-400" />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-2 -right-2 bg-[var(--bg-tertiary)] p-3 rounded-full border border-[var(--border-medium)]"
          >
            <Wrench className="w-6 h-6 text-[var(--accent-primary)]" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-4"
      >
        Configuración
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-[var(--text-secondary)] max-w-md"
      >
        Ajustes avanzados y personalización del sistema.
        <br />
        <span className="text-[var(--accent-primary)] font-semibold mt-2 block">
          Próximamente
        </span>
      </motion.p>
    </div>
  );
}
