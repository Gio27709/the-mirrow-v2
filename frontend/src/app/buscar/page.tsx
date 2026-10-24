"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Calendar, MapPin, Music, Layers, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useCategories } from "@/context/CategoryContext";
import type { TalentProfile } from "@/components/talent/TalentCard";
import type { HomeEvent } from "@/components/ui/HomeEvents";

/** Lowercase and strip accents so "musica" matches "Música" */
const normalize = (text: string) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const matches = (query: string, ...fields: (string | null | undefined)[]) =>
  fields.some((f) => f && normalize(f).includes(query));

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [input, setInput] = useState(q);
  const { categories } = useCategories();

  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Keep the box in sync when the URL query changes (e.g. a new navbar search)
  const [syncedQ, setSyncedQ] = useState(q);
  if (q !== syncedQ) {
    setSyncedQ(q);
    setInput(q);
  }

  useEffect(() => {
    Promise.all([api.get("/talent"), api.get("/events/?is_active=true")])
      .then(([t, e]) => {
        setTalents(t ?? []);
        setEvents(e ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudo buscar"))
      .finally(() => setLoading(false));
  }, []);

  // Talents store the category slug; show the human name
  const categoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  const query = normalize(q.trim());
  // The React Compiler memoizes this; no manual useMemo needed
  const results = (() => {
    if (!query) return { talents: [], events: [], categories: [] };
    return {
      talents: talents.filter((t) =>
        matches(query, t.stage_name, t.category, categoryName(t.category), t.description, t.location),
      ),
      events: events.filter((e) =>
        matches(query, e.title, e.venue_name, e.location),
      ),
      categories: categories.filter((c) => matches(query, c.name, c.description)),
    };
  })();

  const total =
    results.talents.length + results.events.length + results.categories.length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    router.replace(value ? `/buscar?q=${encodeURIComponent(value)}` : "/buscar");
  };

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 space-y-8">
      <form onSubmit={submit} className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        <input
          autoFocus
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Buscar artistas, eventos o categorías..."
          aria-label="Buscar"
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
        />
      </form>

      {loading ? (
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <Loader2 className="w-5 h-5 animate-spin" /> Buscando...
        </div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : !query ? (
        <p className="text-[var(--text-secondary)]">
          Escribe el nombre de un artista, un evento o una categoría.
        </p>
      ) : total === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            No encontramos resultados para &ldquo;{q}&rdquo;
          </p>
          <p className="text-[var(--text-secondary)]">
            Prueba con otra palabra o{" "}
            <Link href="/explore" className="text-[var(--accent-primary)] hover:underline">
              explora todas las categorías
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <p className="text-[var(--text-secondary)]">
            {total} resultado{total === 1 ? "" : "s"} para &ldquo;{q}&rdquo;
          </p>

          {results.categories.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Categorías</h2>
              <div className="flex flex-wrap gap-3">
                {results.categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/${c.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
                  >
                    <Layers className="w-4 h-4 text-[var(--text-muted)]" />
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.talents.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Artistas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.talents.map((t) => (
                  <Link
                    key={t.id}
                    href={`/profile/${t.id}`}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[var(--bg-tertiary)] shrink-0">
                      {t.image_url ? (
                        <Image src={t.image_url} alt={t.stage_name} fill className="object-cover" unoptimized />
                      ) : (
                        <Music className="w-6 h-6 m-auto mt-5 text-[var(--text-muted)]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--text-primary)] truncate">{t.stage_name}</p>
                      <p className="text-sm text-[var(--text-secondary)] truncate">
                        {categoryName(t.category)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.events.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Eventos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.events.map((e) => (
                  <Link
                    key={e.id}
                    href={`/eventos/${e.id}`}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-colors"
                  >
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-[var(--bg-tertiary)] shrink-0">
                      {e.image_url && (
                        <Image src={e.image_url} alt={e.title} fill className="object-cover" unoptimized />
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="font-semibold text-[var(--text-primary)] truncate">{e.title}</p>
                      <p className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                        <Calendar className="w-3.5 h-3.5" /> {e.date}
                        {e.time && ` · ${e.time}`}
                      </p>
                      {(e.venue_name || e.location) && (
                        <p className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] truncate">
                          <MapPin className="w-3.5 h-3.5 shrink-0" /> {e.venue_name || e.location}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto py-12 text-[var(--text-secondary)]">Cargando...</div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
