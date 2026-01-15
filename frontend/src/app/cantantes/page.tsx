import { Mic2, Music2, Heart, Star } from "lucide-react";

const featuredSingers = [
    {
        id: 1,
        name: "Luna Voz",
        genre: "Pop",
        specialty: "Baladas",
        rating: 4.9,
    },
    {
        id: 2,
        name: "Carlos Soul",
        genre: "R&B",
        specialty: "Soul",
        rating: 4.8,
    },
    {
        id: 3,
        name: "María del Carmen",
        genre: "Ópera",
        specialty: "Soprano",
        rating: 4.9,
    },
];

export default function CantantesPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <section className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-400 to-stone-600 mb-4">
                    <Mic2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                    Cantantes
                </h1>
                <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
                    Voces que emocionan y conectan
                </p>
            </section>

            {/* Featured Singers */}
            <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                    Artistas Destacados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredSingers.map((singer) => (
                        <div key={singer.id} className="glass-card card-hover p-6">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                {singer.name}
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Music2 className="w-4 h-4" />
                                    <span>{singer.genre}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Heart className="w-4 h-4" />
                                    <span>{singer.specialty}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--accent-metallic)]">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{singer.rating}</span>
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
                    Estamos trabajando en traerte las mejores voces.
                </p>
            </section>
        </div>
    );
}
