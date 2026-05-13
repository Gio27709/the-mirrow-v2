"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Star,
  Sparkles,
  Mail,
  MessageCircle,
  Users,
  Music,
  Filter,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

interface EventZone {
  id: number;
  name: string;
  price: string;
  capacity: number | null;
  perks: string | null;
  is_sold_out: boolean;
}

interface EventLineupItem {
  id: number;
  artist_name: string;
  set_time: string | null;
  role: string | null;
  image_url: string | null;
}

interface Event {
  id: number;
  title: string;
  type: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  venue_name: string | null;
  city: string | null;
  capacity: number | null;
  min_age: string | null;
  image_url: string;
  flyer_url: string | null;
  price: string;
  ticket_url: string | null;
  free_entry: boolean;
  contact_whatsapp: string | null;
  contact_email: string | null;
  organizer_name: string | null;
  is_featured: boolean;
  tags: string;
  is_active: boolean;
  zones: EventZone[];
  lineup: EventLineupItem[];
}

const WHATSAPP_NUMBER = "34677267104";

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, featured, free

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.get("/events?is_active=true");
        if (data) setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const featuredEvent = events.find((e) => e.is_featured);
  const otherEvents = events.filter((e) => {
    if (filter === "featured") return e.is_featured;
    if (filter === "free") return e.free_entry;
    return !e.is_featured;
  });

  const getWhatsAppUrl = (eventTitle?: string) => {
    const msg = eventTitle
      ? `Hola, quiero información sobre el evento "${eventTitle}".`
      : `Hola, quiero información sobre los eventos de The Mirrow.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-24 selection:bg-purple-500 selection:text-white overflow-clip">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/40 transition-all text-white shadow-lg"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-[var(--bg-primary)]">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Experiencias en vivo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black tracking-tighter"
          >
            Experiencias{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
              Inolvidables
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed"
          >
            Descubre los eventos exclusivos organizados por The Mirrow y nuestra
            comunidad de artistas. Conciertos, galas, teatro y producciones de
            alto nivel.
          </motion.p>
        </div>
      </section>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
        </div>
      ) : (
        <>
          {/* Featured Event Section */}
          {featuredEvent && (
            <section className="relative z-20 -mt-20 px-6 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link
                  href={`/eventos/${featuredEvent.id}`}
                  className="block relative rounded-[2.5rem] overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_0_50px_rgba(0,0,0,0.5)] group hover:border-purple-500/50 hover:shadow-[0_0_60px_rgba(168,85,247,0.2)] transition-all duration-500"
                >
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image Side */}
                  <div className="relative h-[400px] lg:h-auto overflow-hidden">
                    {featuredEvent.image_url ? (
                      <Image
                        src={featuredEvent.image_url}
                        alt={featuredEvent.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                        <Music className="w-24 h-24 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] lg:bg-gradient-to-r lg:from-transparent to-transparent opacity-100" />

                    {/* Badge */}
                    <div className="absolute top-6 left-6 bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 backdrop-blur-md">
                      <Star className="w-4 h-4 fill-white" /> Evento Destacado
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="p-10 md:p-16 flex flex-col justify-center relative bg-[var(--bg-elevated)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

                    <div className="relative z-10 space-y-6">
                      {featuredEvent.tags && (
                        <div className="flex gap-3 flex-wrap">
                          {featuredEvent.tags.split(",").map((tag) => (
                            <span
                              key={tag.trim()}
                              className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-full text-xs font-semibold text-[var(--text-secondary)]"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-4xl font-bold text-[var(--text-primary)]">
                        {featuredEvent.title}
                      </h2>

                      <div className="space-y-4 text-[var(--text-secondary)]">
                        {featuredEvent.date && (
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            <span className="font-medium text-lg">
                              {featuredEvent.date}
                            </span>
                          </div>
                        )}
                        {featuredEvent.time && (
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-pink-400" />
                            <span>{featuredEvent.time}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-orange-400" />
                          <span>
                            {featuredEvent.venue_name || featuredEvent.location}
                            {featuredEvent.city &&
                              `, ${featuredEvent.city}`}
                          </span>
                        </div>
                        {featuredEvent.capacity && (
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-cyan-400" />
                            <span>
                              Aforo: {featuredEvent.capacity} personas
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Lineup Preview */}
                      {featuredEvent.lineup &&
                        featuredEvent.lineup.length > 0 && (
                          <div className="pt-4">
                            <p className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)] mb-3">
                              Lineup
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {featuredEvent.lineup.map((artist) => (
                                <span
                                  key={artist.id}
                                  className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-300"
                                >
                                  🎵 {artist.artist_name}
                                  {artist.role && (
                                    <span className="text-purple-500/60 ml-1">
                                      ({artist.role})
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Zones Preview */}
                      {featuredEvent.zones &&
                        featuredEvent.zones.length > 0 && (
                          <div className="pt-2">
                            <p className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)] mb-3">
                              Zonas disponibles
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {featuredEvent.zones.map((zone) => (
                                <span
                                  key={zone.id}
                                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                                    zone.is_sold_out
                                      ? "border-red-500/30 text-red-400/60 line-through"
                                      : "border-[var(--border-subtle)] text-[var(--text-secondary)]"
                                  }`}
                                >
                                  {zone.name}{" "}
                                  {zone.price && `— ${zone.price}`}
                                  {zone.is_sold_out && " (Agotado)"}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">
                            Entradas
                          </p>
                          <p className="text-2xl font-black text-white">
                            {featuredEvent.free_entry
                              ? "Entrada Libre"
                              : featuredEvent.price || "Consultar"}
                          </p>
                        </div>
                        <div
                          className="bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                          <Ticket className="w-5 h-5" />
                          Ver Detalles
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </Link>
              </motion.div>
            </section>
          )}

          {/* Events Grid */}
          <section className="max-w-7xl mx-auto px-6 mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Cartelera Oficial</h2>
                <p className="text-[var(--text-secondary)]">
                  Próximos eventos y producciones de nuestra red de talentos.
                </p>
              </div>

              <div className="flex gap-2">
                {[
                  { key: "all", label: "Todos" },
                  { key: "featured", label: "Destacados" },
                  { key: "free", label: "Gratis" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${
                      filter === f.key
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "border border-[var(--border-medium)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {otherEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="group relative bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]"
                  >
                    <Link href={`/eventos/${event.id}`}>
                      <div className="aspect-[16/9] relative overflow-hidden">
                        {event.image_url ? (
                          <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                            <Music className="w-16 h-16 text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute top-4 left-4 flex gap-2">
                          {event.type && (
                            <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white">
                              {event.type}
                            </span>
                          )}
                          {event.min_age && (
                            <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white">
                              {event.min_age}
                            </span>
                          )}
                        </div>

                        {event.is_featured && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-purple-600/80 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" /> Destacado
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-8 relative">
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                          {event.title}
                        </h3>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {event.date}
                              {event.time && ` • ${event.time}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {event.venue_name || event.location}
                              {event.city && `, ${event.city}`}
                            </span>
                          </div>
                          {event.lineup && event.lineup.length > 0 && (
                            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                              <Music className="w-4 h-4" />
                              <span>
                                {event.lineup
                                  .slice(0, 3)
                                  .map((a) => a.artist_name)
                                  .join(", ")}
                                {event.lineup.length > 3 &&
                                  ` +${event.lineup.length - 3} más`}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Zones Mini */}
                        {event.zones && event.zones.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {event.zones.map((zone) => (
                              <span
                                key={zone.id}
                                className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                                  zone.is_sold_out
                                    ? "border-red-500/20 text-red-400/50 line-through"
                                    : "border-[var(--border-subtle)] text-[var(--text-muted)]"
                                }`}
                              >
                                {zone.name}
                                {zone.price && ` ${zone.price}`}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-white">
                            {event.free_entry
                              ? "Entrada Libre"
                              : event.price || "Consultar"}
                          </span>
                          <span className="text-sm font-bold bg-[var(--bg-secondary)] hover:bg-[var(--foreground)] text-[var(--text-primary)] hover:text-[var(--background)] px-6 py-2.5 rounded-xl transition-all flex items-center gap-2">
                            Ver Detalles <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Filter className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-secondary)] text-lg">
                  {events.length === 0
                    ? "No hay eventos programados aún. ¡Pronto habrá novedades!"
                    : "No hay eventos con este filtro."}
                </p>
              </div>
            )}
          </section>
        </>
      )}

      {/* Cotizar Evento CTA */}
      <section className="max-w-5xl mx-auto px-6 mt-32 relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/30 p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              ¿Quieres organizar un evento inolvidable?
            </h2>
            <p className="text-xl text-purple-100/80">
              Cotiza la producción de tu propio evento. Desde la planificación,
              logística, hasta la contratación de talentos, nosotros nos
              encargamos de todo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-white text-purple-950 px-8 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5 text-purple-950" />
                <span className="text-purple-950">Cotizar Evento</span>
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Directo
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
