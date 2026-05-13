"use client";

import { PromoCard } from "@/components/ui/PromoCard";

export function HomePromo() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromoCard
          title="Organiza tu Evento"
          subtitle="Lleva tu producción al siguiente nivel. Cotiza y contrata artistas, logística y marketing en un solo lugar."
          image="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
          ctaText="Cotizar Ahora"
          ctaLink="/contact"
          gradient="from-purple-900/90 to-blue-900/90"
        />
        <PromoCard
          title="Descubre Nuevo Talento"
          subtitle="Explora nuestro catálogo de artistas y encuentra la estrella perfecta para tu próximo proyecto."
          image="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop"
          ctaText="Explorar Artistas"
          ctaLink="/explore"
          delay={0.2}
          gradient="from-pink-900/90 to-orange-900/90"
        />
      </div>
    </section>
  );
}
