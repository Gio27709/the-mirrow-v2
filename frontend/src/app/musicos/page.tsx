import { Music, Users, Disc, Star } from "lucide-react";

const featuredArtists = [
    {
        id: 1,
        name: "Jazz Quartet",
        genre: "Jazz",
        members: 4,
        rating: 4.9,
    },
    {
        id: 2,
        name: "Rock Fusion Band",
        genre: "Rock",
        members: 5,
        rating: 4.8,
    },
    {
        id: 3,
        name: "Orquesta Sinfónica",
        genre: "Clásica",
        members: 40,
        rating: 4.9,
    },
];

export default function MusicosPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <section className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 mb-4">
                    <Music className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                    Músicos
                </h1>
                <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
                    Artistas y bandas que marcan tendencia
                </p>
            </section>

            {/* Featured Artists */}
            <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                    Artistas Destacados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredArtists.map((artist) => (
                        <div key={artist.id} className="glass-card card-hover p-6">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                {artist.name}
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Disc className="w-4 h-4" />
                                    <span>{artist.genre}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Users className="w-4 h-4" />
                                    <span>{artist.members} miembros</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--accent-metallic)]">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{artist.rating}</span>
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
                    Estamos trabajando en traerte los mejores artistas y bandas.
                </p>
            </section>
        </div>
    );
}
