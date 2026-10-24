"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { canOptimize } from "@/lib/images";
import { ArrowRight, Calendar, MapPin, Music } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export interface HomeEvent {
  id: string | number;
  title: string;
  image_url?: string;
  free_entry?: boolean;
  price?: string | number;
  date: string;
  time?: string;
  venue_name?: string;
  location?: string;
}

export function HomeEvents() {
  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data: HomeEvent[] = await api.get("/events/?is_active=true");
        if (data) {
          // Only upcoming events (dates are "YYYY-MM-DD"), soonest first
          const today = new Date().toISOString().slice(0, 10);
          const upcoming = data
            .filter((e) => !e.date || e.date >= today)
            .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
          setEvents(upcoming.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-6 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
          <div className="h-7 md:h-8 w-40 md:w-48 bg-[var(--bg-secondary)] animate-pulse rounded-lg" />
          <div className="h-6 w-20 md:w-24 bg-[var(--bg-secondary)] animate-pulse rounded-lg" />
        </div>
        {/* Mobile: horizontal scroll skeleton */}
        <div className="flex md:hidden gap-4 overflow-hidden px-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[72vw] h-[20rem] bg-[var(--bg-secondary)] animate-pulse rounded-2xl" />
          ))}
        </div>
        {/* Desktop: grid skeleton */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[28rem] bg-[var(--bg-secondary)] animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className="py-6 md:py-12">
      <div className="flex items-end justify-between mb-5 md:mb-8 gap-4 flex-wrap px-1">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 text-[var(--text-primary)]">Próximos Eventos</h2>
          <p className="text-[var(--text-secondary)] text-sm md:text-lg">No te pierdas nuestras mejores experiencias en vivo.</p>
        </div>
        <Link 
          href="/eventos" 
          className="text-xs md:text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 md:gap-2 bg-purple-500/10 px-4 md:px-6 py-2 md:py-3 rounded-full transition-all hover:bg-purple-500/20 hover:scale-105 active:scale-95"
        >
          Ver todos <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Link>
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden mobile-scroll-x gap-4 px-1 pb-2 scroll-fade-right">
        {events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} mobile />
        ))}
        {/* End spacer for scroll */}
        <div className="w-4 flex-shrink-0" />
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </section>
  );
}

function EventCard({ event, index, mobile = false }: { event: HomeEvent; index: number; mobile?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group relative bg-[var(--bg-elevated)] border border-[var(--border-subtle)] overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col ${
        mobile 
          ? "w-[72vw] rounded-2xl" 
          : "rounded-[2rem]"
      }`}
    >
      <Link href={`/eventos/${event.id}`} className="flex flex-col h-full">
        <div className={`relative overflow-hidden ${mobile ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
          {event.image_url ? (
            <Image
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 72vw"
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized={!canOptimize(event.image_url)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
              <Music className="w-12 h-12 md:w-16 md:h-16 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
          
          {event.free_entry ? (
            <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-emerald-500/90 backdrop-blur px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold text-white shadow-lg border border-emerald-400/20">
              Entrada Libre
            </div>
          ) : (
            <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-purple-600/90 backdrop-blur px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold text-white shadow-lg border border-purple-400/20">
              {event.price || "Tickets"}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 w-full p-4 md:p-6 pt-8 md:pt-12 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
            {event.title}
          </h3>
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-white/80 font-medium">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400 flex-shrink-0" />
              <span className="truncate">{event.date} {event.time && `• ${event.time}`}</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-white/80 font-medium">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-400 flex-shrink-0" />
              <span className="truncate">{event.venue_name || event.location}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
