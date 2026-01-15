import { Disc3, Headphones, Radio, Star } from "lucide-react";

const featuredDJs = [
    {
        id: 1,
        name: "DJ Electro",
        genre: "Electrónica",
        style: "House",
        rating: 4.9,
    },
    {
        id: 2,
        name: "Bass Master",
        genre: "EDM",
        style: "Dubstep",
        rating: 4.8,
    },
    {
        id: 3,
        name: "Vinyl Queen",
        genre: "Techno",
        style: "Minimal",
        rating: 4.7,
    },
];

export default function DJsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <section className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-400 to-neutral-600 mb-4">
                    <Disc3 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                    DJs
                </h1>
                <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
                    Los mejores sets y eventos electrónicos
                </p>
            </section>

            {/* Featured DJs */}
            <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                    DJs Destacados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredDJs.map((dj) => (
                        <div key={dj.id} className="glass-card card-hover p-6">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                {dj.name}
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Headphones className="w-4 h-4" />
                                    <span>{dj.genre}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Radio className="w-4 h-4" />
                                    <span>{dj.style}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--accent-metallic)]">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{dj.rating}</span>
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
                    Estamos trabajando en traerte los mejores DJs y eventos.
                </p>
            </section>
        </div>
    );
}
