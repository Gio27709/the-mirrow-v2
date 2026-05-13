"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Music, MapPin } from "lucide-react";

interface TalentProfile {
  id: number;
  stage_name: string;
  category: string;
  image_url: string;
  description?: string;
  rating?: number;
  location?: string;
}

interface TalentCardProps {
  talent: TalentProfile;
  index: number;
}

export function TalentCard({ talent, index }: TalentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        {talent.image_url ? (
          <Image
            src={talent.image_url}
            alt={talent.stage_name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[var(--bg-tertiary)] flex items-center justify-center">
            <Music className="w-12 h-12 text-[var(--text-muted)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Badges/Tags could go here */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-white">
            {talent.rating || "5.0"}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 w-full p-6 space-y-2">
        <h3 className="text-2xl font-bold text-white leading-tight">
          {talent.stage_name}
        </h3>

        {talent.description && (
          <p className="text-white/80 text-sm line-clamp-2">
            {talent.description}
          </p>
        )}

        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider font-medium">
            <MapPin className="w-3 h-3" />
            <span>{talent.location || "Disponible"}</span>
          </div>

          <Link
            href={`/profile/${talent.id}`}
            className="bg-white !text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-100 transition-all flex items-center justify-center shadow-lg"
          >
            <span className="!text-black">Ver Perfil</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
