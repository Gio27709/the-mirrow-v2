"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin, Music } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export function HomeEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.get("/events?is_active=true");
        if (data) {
          setEvents(data.slice(0, 4));
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
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-[var(--bg-secondary)] animate-pulse rounded-lg" />
          <div className="h-6 w-24 bg-[var(--bg-secondary)] animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[28rem] bg-[var(--bg-secondary)] animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--text-primary)]">Próximos Eventos</h2>
          <p className="text-[var(--text-secondary)] text-lg">No te pierdas nuestras mejores experiencias en vivo.</p>
        </div>
        <Link 
          href="/eventos" 
          className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-2 bg-purple-500/10 px-6 py-3 rounded-full transition-all hover:bg-purple-500/20 hover:scale-105 active:scale-95"
        >
          Ver todos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col"
          >
            <Link href={`/eventos/${event.id}`} className="flex flex-col h-full">
              <div className="aspect-[4/5] relative overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                
                {event.free_entry ? (
                  <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg border border-emerald-400/20">
                    Entrada Libre
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg border border-purple-400/20">
                    {event.price || "Tickets"}
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 w-full p-6 pt-12 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
                  {event.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="truncate">{event.date} {event.time && `• ${event.time}`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span className="truncate">{event.venue_name || event.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
