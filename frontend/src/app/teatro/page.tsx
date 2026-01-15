import { Theater, Calendar, MapPin, Star } from "lucide-react";

const featuredShows = [
    {
        id: 1,
        title: "El Fantasma de la Ópera",
        venue: "Teatro Principal",
        date: "Próximamente",
        rating: 4.9,
    },
    {
        id: 2,
        title: "Romeo y Julieta",
        venue: "Auditorio Nacional",
        date: "En cartelera",
        rating: 4.8,
    },
    {
        id: 3,
        title: "La Casa de Bernarda Alba",
        venue: "Teatro Clásico",
        date: "Próximamente",
        rating: 4.7,
    },
];

export default function TeatroPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <section className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-400 to-zinc-600 mb-4">
                    <Theater className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                    Teatro
                </h1>
                <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
                    Descubre las mejores obras y espectáculos dramáticos
                </p>
            </section>

            {/* Featured Shows */}
            <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                    Obras Destacadas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredShows.map((show) => (
                        <div key={show.id} className="glass-card card-hover p-6">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                {show.title}
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <MapPin className="w-4 h-4" />
                                    <span>{show.venue}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Calendar className="w-4 h-4" />
                                    <span>{show.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--accent-metallic)]">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{show.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Coming Soon */}
            <section className="glass-card p-8 text-center">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    Más contenido próximamente
                </h2>
                <p className="text-[var(--text-secondary)]">
                    Estamos trabajando en traerte los mejores espectáculos teatrales.
                </p>
            </section>
        </div>
    );
}
