import { Target, Trophy, Users, Star } from "lucide-react";

const featuredTables = [
    {
        id: 1,
        name: "Campeonato Nacional",
        type: "Torneo",
        participants: 32,
        rating: 4.9,
    },
    {
        id: 2,
        name: "Liga Amateur",
        type: "Liga",
        participants: 64,
        rating: 4.7,
    },
    {
        id: 3,
        name: "Copa Profesional",
        type: "Torneo",
        participants: 16,
        rating: 4.9,
    },
];

export default function BillarPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <section className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 mb-4">
                    <Target className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                    Billar
                </h1>
                <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
                    Torneos y mesas para profesionales
                </p>
            </section>

            {/* Featured Events */}
            <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                    Eventos Destacados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredTables.map((event) => (
                        <div key={event.id} className="glass-card card-hover p-6">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                {event.name}
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Trophy className="w-4 h-4" />
                                    <span>{event.type}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Users className="w-4 h-4" />
                                    <span>{event.participants} participantes</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--accent-metallic)]">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{event.rating}</span>
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
                    Estamos trabajando en traerte más torneos y eventos.
                </p>
            </section>
        </div>
    );
}
