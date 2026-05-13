"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Layers, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { useCategories } from "@/context/CategoryContext";

export function CategoryCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const { categories, isLoading } = useCategories();

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth,
      );
    }
  }, [categories]);

  if (isLoading) {
    return (
      <div className="w-full pb-8 pt-0 space-y-2">
        <div className="px-4">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Explora por Categorías
          </h2>
        </div>
        <div className="flex gap-6 px-4 py-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-4 w-40">
              <div className="w-36 h-36 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
              <div className="w-20 h-4 rounded bg-[var(--bg-secondary)] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="w-full pb-8 pt-0 space-y-2">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Explora por Categorías
        </h2>
        {/* Visual indicator of interactivity */}
        <span className="text-sm text-[var(--text-secondary)] hidden md:block opacity-60">
          Arrastra para explorar
        </span>
      </div>

      <motion.div
        ref={carouselRef}
        className="cursor-grab active:cursor-grabbing overflow-hidden px-4 py-2"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          whileTap={{ cursor: "grabbing" }}
          className="flex gap-6"
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
                className="flex-shrink-0 group relative"
                draggable={false}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-4 w-40"
                >
                  {/* Circular Image Container */}
                  <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-2xl border-2 border-transparent group-hover:border-[var(--accent-metallic)] transition-all duration-300 pointer-events-none">
                    {cat.banner_url || cat.image_url ? (
                      <Image
                        src={cat.banner_url || cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-50"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 opacity-70 group-hover:opacity-50 transition-opacity" />
                    )}

                    {/* Icon Overlay - Centered and Larger */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="p-5 bg-black/30 backdrop-blur-sm rounded-full group-hover:bg-[var(--accent-metallic)] group-hover:text-white transition-all duration-300 shadow-xl border border-white/10">
                        <Icon className="w-12 h-12 text-white/90" />
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <span className="text-base font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors text-center select-none uppercase tracking-wider">
                    {cat.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
