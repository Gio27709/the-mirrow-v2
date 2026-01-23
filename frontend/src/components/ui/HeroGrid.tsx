"use client";

import { HeroCarousel } from "./HeroCarousel";
import { PromoCard } from "./PromoCard";

export function HeroGrid() {
    return (
        <section className="w-full pb-0 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
                {/* Main Carousel - Takes 2 columns on Desktop */}
                <div className="lg:col-span-2 h-[400px] lg:h-full">
                    <HeroCarousel />
                </div>

                {/* Side Banners - Takes 1 column on Desktop, stacked vertically */}
                <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 h-full">
                    <PromoCard
                        title="Artistas Destacados"
                        subtitle="Descubre quiénes están marcando tendencia este mes en The Mirrow."
                        image="/images/hero-music.png" // Fallback or specific image
                        ctaText="Ver Top 10"
                        ctaLink="/musicos"
                        delay={0.1}
                        gradient="from-indigo-900/90 to-purple-900/90"
                    />
                    <PromoCard
                        title="Próximos Eventos"
                        subtitle="No te pierdas las fechas más importantes de la temporada."
                        image="/images/hero-theater.png" // Fallback or specific image
                        ctaText="Calendario"
                        ctaLink="/teatro"
                        delay={0.2}
                        gradient="from-slate-900/90 to-zinc-900/90"
                    />
                </div>
            </div>
        </section>
    );
}
