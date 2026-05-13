"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { TalentCard } from "@/components/talent/TalentCard";

export function HomeTalents() {
  const [talents, setTalents] = useState<any[]>([]);
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
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-[var(--bg-secondary)] animate-pulse rounded-lg" />
          <div className="h-6 w-24 bg-[var(--bg-secondary)] animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-[var(--bg-secondary)] animate-pulse rounded-3xl" />
          ))}
        </div>
      </section>
    );
  }

  if (talents.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--text-primary)]">Artistas Destacados</h2>
          <p className="text-[var(--text-secondary)] text-lg">Descubre el talento que hará brillar tu evento.</p>
        </div>
        <Link 
          href="/explore" 
          className="text-sm font-bold text-pink-400 hover:text-pink-300 flex items-center gap-2 bg-pink-500/10 px-6 py-3 rounded-full transition-all hover:bg-pink-500/20 hover:scale-105 active:scale-95"
        >
          Ver todos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {talents.map((talent, i) => (
          <TalentCard key={talent.id} talent={talent} index={i} />
        ))}
      </div>
    </section>
  );
}
