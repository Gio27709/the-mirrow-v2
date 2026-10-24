"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { TalentCard, type TalentProfile } from "@/components/talent/TalentCard";

export function HomeTalents() {
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const data = await api.get("/talent");
        if (data) {
          // Tomar los primeros 4 talentos para el home
          setTalents(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching talents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTalents();
  }, []);

  if (loading) {
    return (
      <section className="py-6 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
          <div className="h-7 md:h-8 w-40 md:w-48 bg-[var(--bg-secondary)] animate-pulse rounded-lg" />
          <div className="h-6 w-20 md:w-24 bg-[var(--bg-secondary)] animate-pulse rounded-lg" />
        </div>
        {/* Mobile: horizontal scroll skeleton */}
        <div className="flex md:hidden gap-4 overflow-hidden px-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[65vw] h-72 bg-[var(--bg-secondary)] animate-pulse rounded-2xl" />
          ))}
        </div>
        {/* Desktop: grid skeleton */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-[var(--bg-secondary)] animate-pulse rounded-3xl" />
          ))}
        </div>
      </section>
    );
  }

  if (talents.length === 0) return null;

  return (
    <section className="py-6 md:py-12">
      <div className="flex items-end justify-between mb-5 md:mb-8 gap-4 flex-wrap px-1">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 text-[var(--text-primary)]">Artistas Destacados</h2>
          <p className="text-[var(--text-secondary)] text-sm md:text-lg">Descubre el talento que hará brillar tu evento.</p>
        </div>
        <Link 
          href="/explore" 
          className="text-xs md:text-sm font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1.5 md:gap-2 bg-pink-500/10 px-4 md:px-6 py-2 md:py-3 rounded-full transition-all hover:bg-pink-500/20 hover:scale-105 active:scale-95"
        >
          Ver todos <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Link>
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden mobile-scroll-x gap-4 px-1 pb-2 scroll-fade-right">
        {talents.map((talent, i) => (
          <div key={talent.id} className="w-[65vw] flex-shrink-0">
            <TalentCard talent={talent} index={i} />
          </div>
        ))}
        {/* End spacer for scroll */}
        <div className="w-4 flex-shrink-0" />
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {talents.map((talent, i) => (
          <TalentCard key={talent.id} talent={talent} index={i} />
        ))}
      </div>
    </section>
  );
}
