"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { canOptimize } from "@/lib/images";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  MapPin,
  Music,
  Newspaper,
  RefreshCw,
  User,
} from "lucide-react";
import { api } from "@/lib/api";
import type { TalentProfile } from "@/components/talent/TalentCard";

interface FeedEvent {
  id: string | number;
  title: string;
  image_url?: string | null;
  date: string;
  time?: string | null;
  venue_name?: string | null;
  location?: string | null;
  price?: string | number | null;
  free_entry?: boolean;
}

type FeedTalent = TalentProfile & { profile_image_url?: string | null };

type Status = "loading" | "ready" | "error";

const MAX_UPCOMING = 6;
const MAX_RECENT = 3;
const MAX_TALENTS = 8;

/** "YYYY-MM-DD" -> "sáb, 25 oct 2026" without timezone shifts */
function formatDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function localToday() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${mm}-${dd}`;
}

function priceLabel(event: FeedEvent) {
  if (event.free_entry) return "Entrada libre";
  if (event.price === null || event.price === undefined || event.price === "") return null;
  return typeof event.price === "number" ? `${event.price} €` : String(event.price);
}

export default function BlogPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [upcoming, setUpcoming] = useState<FeedEvent[]>([]);
  const [recent, setRecent] = useState<FeedEvent[]>([]);
  const [talents, setTalents] = useState<FeedTalent[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    const [eventsRes, talentsRes] = await Promise.allSettled([
      api.get("/events/?is_active=true"),
      api.get("/talent"),
    ]);

    // Only an error if both sources fail; otherwise show what we have
    if (eventsRes.status === "rejected" && talentsRes.status === "rejected") {
      setStatus("error");
      return;
    }

    const events: FeedEvent[] =
      eventsRes.status === "fulfilled" && Array.isArray(eventsRes.value) ? eventsRes.value : [];
    const today = localToday();
    setUpcoming(
      events
        .filter((e) => !e.date || e.date >= today)
        .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
        .slice(0, MAX_UPCOMING),
    );
    setRecent(
      events
        .filter((e) => e.date && e.date < today)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, MAX_RECENT),
    );
    setTalents(
      talentsRes.status === "fulfilled" && Array.isArray(talentsRes.value)
        ? talentsRes.value.slice(0, MAX_TALENTS)
        : [],
    );
    setStatus("ready");
  }, []);

  useEffect(() => {
    // Fetch on mount; state updates happen after the awaited requests
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const isEmpty =
    status === "ready" && upcoming.length === 0 && recent.length === 0 && talents.length === 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12 md:space-y-16">
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <Newspaper className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[var(--text-secondary)]">
              Novedades
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Lo que está{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              pasando
            </span>
          </h1>
          <p className="text-base md:text-lg text-[var(--text-secondary)]">
            Próximos eventos, lo que acabamos de vivir y los artistas que tienes que conocer. Se actualiza solo, cada vez que añadimos algo nuevo.
          </p>
        </header>

        {status === "loading" && <FeedSkeleton />}

        {status === "error" && (
          <div role="alert" className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold">No hemos podido cargar las novedades</h2>
            <p className="text-[var(--text-secondary)]">Revisa tu conexión e inténtalo de nuevo en unos segundos.</p>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white px-5 py-3 rounded-xl font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
          </div>
        )}

        {isEmpty && (
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-8 md:p-12 text-center space-y-4">
            <Music className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
            <h2 className="text-xl font-bold">Todavía no hay novedades</h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Estamos preparando los próximos eventos. Mientras tanto, explora nuestro catálogo de artistas.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white px-5 py-3 rounded-xl font-semibold transition-colors"
            >
              Explorar artistas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === "ready" && !isEmpty && (
          <>
            {upcoming.length > 0 && (
              <FeedSection title="Próximos eventos" href="/eventos" linkLabel="Ver cartelera">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {upcoming.map((e, i) => (
                    <EventCard key={e.id} event={e} index={i} />
                  ))}
                </div>
              </FeedSection>
            )}

            {talents.length > 0 && (
              <FeedSection title="Artistas destacados" href="/explore" linkLabel="Ver todos">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {talents.map((t, i) => (
                    <TalentTile key={t.id} talent={t} index={i} />
                  ))}
                </div>
              </FeedSection>
            )}

            {recent.length > 0 && (
              <FeedSection title="Eventos recientes">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {recent.map((e, i) => (
                    <EventCard key={e.id} event={e} index={i} past />
                  ))}
                </div>
              </FeedSection>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FeedSection({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 md:space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {href && linkLabel && (
          <Link
            href={href}
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-hover)]"
          >
            {linkLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function EventCard({ event, index, past = false }: { event: FeedEvent; index: number; past?: boolean }) {
  const price = priceLabel(event);
  const place = event.venue_name || event.location;
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.05 }}
      className="group rounded-3xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-colors"
    >
      <Link href={`/eventos/${event.id}`} className="block h-full">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-tertiary)]">
          {event.image_url ? (
            <Image
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={event.image_url}
              alt={event.title}
              fill
              unoptimized={!canOptimize(event.image_url)}
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${past ? "grayscale-[40%]" : ""}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
              <Music className="w-10 h-10 text-white/30" />
            </div>
          )}
          {past ? (
            <span className="absolute top-3 left-3 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Ya celebrado
            </span>
          ) : (
            price && (
              <span
                className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full ${
                  event.free_entry ? "bg-emerald-600" : "bg-purple-600"
                }`}
              >
                {price}
              </span>
            )
          )}
        </div>
        <div className="p-5 space-y-2">
          <h3 className="text-lg font-bold leading-snug line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors">
            {event.title}
          </h3>
          {event.date && (
            <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Calendar className="w-4 h-4 shrink-0 text-[var(--accent-primary)]" />
              <span className="truncate capitalize">
                {formatDate(event.date)}
                {event.time ? ` · ${event.time.slice(0, 5)}` : ""}
              </span>
            </p>
          )}
          {place && (
            <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <MapPin className="w-4 h-4 shrink-0 text-pink-500" />
              <span className="truncate">{place}</span>
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

function TalentTile({ talent, index }: { talent: FeedTalent; index: number }) {
  const img = talent.profile_image_url || talent.image_url;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.05 }}
    >
      <Link
        href={`/profile/${talent.id}`}
        className="group block rounded-2xl md:rounded-3xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-colors"
      >
        <div className="relative aspect-square overflow-hidden bg-[var(--bg-tertiary)]">
          {img ? (
            <Image
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={img}
              alt={talent.stage_name}
              fill
              unoptimized={!canOptimize(img)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-10 h-10 text-[var(--text-muted)]" />
            </div>
          )}
        </div>
        <div className="p-3 md:p-4">
          <h3 className="font-bold truncate">{talent.stage_name}</h3>
          {talent.category && (
            <p className="text-xs md:text-sm text-[var(--text-muted)] truncate capitalize">{talent.category}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-12" aria-busy="true" aria-label="Cargando novedades">
      <div className="space-y-5">
        <div className="h-8 w-56 rounded-lg bg-[var(--bg-secondary)] animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-3xl overflow-hidden border border-[var(--border-subtle)]">
              <div className="aspect-[16/10] bg-[var(--bg-secondary)] animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-[var(--bg-secondary)] animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-[var(--bg-secondary)] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-5">
        <div className="h-8 w-48 rounded-lg bg-[var(--bg-secondary)] animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-2xl md:rounded-3xl bg-[var(--bg-secondary)] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
