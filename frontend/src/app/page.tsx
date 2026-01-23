import { Theater, Music, Disc3, Mic2, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { HeroCarousel } from "@/components/ui/HeroCarousel";

const categories = [
  {
    id: "teatro",
    title: "Teatro",
    description: "Descubre las mejores obras y espectáculos dramáticos",
    icon: Theater,
    href: "/teatro",
    gradient: "from-zinc-400 to-zinc-600",
  },
  {
    id: "musicos",
    title: "Músicos",
    description: "Artistas y bandas que marcan tendencia",
    icon: Music,
    href: "/musicos",
    gradient: "from-slate-400 to-slate-600",
  },
  {
    id: "djs",
    title: "DJs",
    description: "Los mejores sets y eventos electrónicos",
    icon: Disc3,
    href: "/djs",
    gradient: "from-neutral-400 to-neutral-600",
  },
  {
    id: "cantantes",
    title: "Cantantes",
    description: "Voces que emocionan y conectan",
    icon: Mic2,
    href: "/cantantes",
    gradient: "from-stone-400 to-stone-600",
  },
  {
    id: "billar",
    title: "Billar",
    description: "Torneos y mesas para profesionales",
    icon: Target,
    href: "/billar",
    gradient: "from-gray-400 to-gray-600",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Carousel Section - Sony Style */}
      <section className="pb-6 pt-2">
        <HeroCarousel />

        {/* Sub-hero welcome text */}
        <div className="text-center mt-12 mb-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-[var(--text-primary)]">
            Bienvenido a <span className="text-gradient-metallic">The Mirrow</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Tu plataforma de entretenimiento profesional.
          </p>
        </div>
      </section>

      {/* Categories Grid - Main navigation area */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">
          Explora categorías
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={category.href}
                className="glass-card card-hover p-6 group"
              >
                {/* Icon with gradient background */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-[var(--text-primary)]">
                  {category.title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--accent-metallic)]" />
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>
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
    </div>
  );
}
