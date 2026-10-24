import Link from "next/link";
import { CategoryCarousel } from "@/components/ui/CategoryCarousel";
import { HeroGrid } from "@/components/ui/HeroGrid";
import { HomePromo } from "@/components/ui/HomePromo";
import { HomeEvents } from "@/components/ui/HomeEvents";
import { HomeTalents } from "@/components/ui/HomeTalents";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-2 md:space-y-4">
      {/* Hero Section - Bento Grid Style */}
      <HeroGrid />

      {/* Promociones / Publicidad */}
      <HomePromo />

      {/* Categories Carousel */}
      <CategoryCarousel />

      {/* Eventos Destacados */}
      <HomeEvents />

      {/* Artistas Destacados */}
      <HomeTalents />

      {/* Featured Section */}
      <section className="glass-card p-6 md:p-12 text-center rounded-2xl md:rounded-[2.5rem] mt-6 md:mt-12 mb-10 md:mb-20 border border-[var(--border-subtle)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-4 text-[var(--text-primary)]">
            ¿Listo para brillar?
          </h2>
          <p className="text-[var(--text-secondary)] mb-5 md:mb-8 max-w-xl mx-auto text-sm md:text-lg">
            Únete a nuestra comunidad de artistas y profesionales del entretenimiento. Crea tu perfil hoy mismo y lleva tu carrera al siguiente nivel.
          </p>
          <Link href="/register" className="inline-block px-6 py-3 md:px-10 md:py-4 bg-[var(--accent-metallic)] hover:bg-[var(--accent-metallic-hover)] text-[var(--bg-primary)] font-bold rounded-xl md:rounded-2xl transition-all glow-metallic hover:shadow-2xl hover:-translate-y-1 text-sm md:text-base">
            Comenzar ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
