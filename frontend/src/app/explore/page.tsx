"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { useCategories } from "@/context/CategoryContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ExplorePage() {
  const { categories, isLoading } = useCategories();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 pb-32 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-3 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Explorar
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Sumérgete en el mundo del entretenimiento.
            </p>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-3xl bg-[var(--bg-secondary)] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {categories.map((cat) => {
              const Icon =
                (Icons[
                  (cat.icon_name || "Layers") as keyof typeof Icons
                ] as LucideIcon) || Layers;

              return (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  className="block group relative"
                >
                  <motion.div
                    variants={item}
                    className="relative overflow-hidden rounded-3xl border-2 border-[var(--border-subtle)] group-hover:border-white/30 p-6 h-48 flex flex-col justify-between transition-all duration-300 ease-out hover:scale-[1.02] shadow-sm"
                  >
                    {/* Background: Banner image or fallback gradient */}
                    {cat.banner_url ? (
                      <>
                        <Image
                          src={cat.banner_url}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-[1]" />
                      </>
                    ) : (
                      /* Fallback: solid dark with border glow */
                      <div className="absolute inset-0 bg-[var(--bg-secondary)]" />
                    )}

                    {/* Content */}
                    <div className="relative z-10">
                      <div
                        className={`
                          w-12 h-12 rounded-2xl 
                          ${cat.banner_url ? "bg-black/30 backdrop-blur-md border-white/20" : "bg-white/10 backdrop-blur-md border-white/10"} 
                          flex items-center justify-center 
                          border transition-colors mb-4
                        `}
                      >
                        <Icon className="w-6 h-6 text-white transition-colors duration-300" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform drop-shadow-md">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-white/70 font-medium">
                        {cat.description || `Explora ${cat.name}`}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-sm">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}

            {categories.length === 0 && (
              <div className="col-span-full py-16 text-center text-[var(--text-muted)] italic">
                No hay categorías disponibles.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
