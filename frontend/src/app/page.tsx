import { CategoryCarousel } from "@/components/ui/CategoryCarousel";
import { HeroGrid } from "@/components/ui/HeroGrid";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Hero Section - Bento Grid Style */}
      <HeroGrid />



      {/* Categories Carousel */}
      <section>
        <CategoryCarousel />
      </section>

      {/* Featured Section */}
      <section className="glass-card p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
          ¿Listo para brillar?
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 max-w-xl mx-auto">
          Únete a nuestra comunidad de artistas y profesionales del entretenimiento.
        </p>
        <button className="px-8 py-3 bg-[var(--accent-metallic)] hover:bg-[var(--accent-metallic-hover)] text-[var(--bg-primary)] font-semibold rounded-xl transition-all glow-metallic hover:shadow-lg">
          Comenzar ahora
        </button>
      </section>

      {/* Spacer for scroll testing */}
      <div className="h-20" />
    </div >
  );
}
