"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BadgeCheck, Star, MapPin } from "lucide-react";

interface ProfileHeroProps {
  talent: {
    stage_name: string;
    category: string;
    image_url?: string;
    rating?: number;
    location?: string;
    base_price?: number;
    price_currency?: string;
    price_unit?: string;
    is_available?: boolean;
  };
}

export function ProfileHero({ talent }: ProfileHeroProps) {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image with Parallax Effect could be added here */}
      <div className="absolute inset-0">
        {talent.image_url ? (
          <Image
            src={talent.image_url}
            alt={talent.stage_name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4"
          >
            {/* Badges */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-white">
                {talent.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="text-sm font-bold">
                  {talent.rating || "5.0"}
                </span>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight uppercase drop-shadow-2xl">
              {talent.stage_name}
              <BadgeCheck className="inline-block w-8 h-8 md:w-12 md:h-12 text-blue-400 ml-4 align-top" />
            </h1>

            {/* Location & Price Hint */}
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
                <span>{talent.location || "Disponible Globalmente"}</span>
              </div>
              {talent.base_price && (
                <>
                  <div className="w-1 h-1 bg-white/50 rounded-full" />
                  <span className="font-light">
                    Desde <strong className="text-white">${talent.base_price} {talent.price_currency || "USD"}</strong> / {talent.price_unit || "Evento"}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
