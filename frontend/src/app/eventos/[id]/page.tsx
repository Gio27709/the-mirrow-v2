"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Star,
  Users,
  Music,
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Shield,
  Sparkles,
  Loader2,
  Share2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
interface EventZone {
  id: number;
  name: string;
  price: string | null;
  capacity: number | null;
  perks: string | null;
  is_sold_out: boolean;
  order: number;
}

interface EventLineupItem {
  id: number;
  artist_name: string;
  set_time: string | null;
  role: string | null;
  image_url: string | null;
  talent_id: number | null;
  order: number;
}

interface EventDetail {
  id: number;
  title: string;
  type: string | null;
  description: string | null;
  date: string | null;
  time: string | null;
  location: string | null;
  venue_name: string | null;
  venue_address: string | null;
  city: string | null;
  capacity: number | null;
  min_age: string | null;
  dress_code: string | null;
  image_url: string | null;
  flyer_url: string | null;
  video_promo_url: string | null;
  price: string | null;
  ticket_url: string | null;
  free_entry: boolean;
  reservation_required: boolean;
  contact_whatsapp: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_instagram: string | null;
  organizer_name: string | null;
  is_featured: boolean;
  tags: string | null;
  is_active: boolean;
  zones: EventZone[];
  lineup: EventLineupItem[];
}

const WHATSAPP_FALLBACK = "34677267104";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, token } = useAuth();
  const router = useRouter();
  const [isReserving, setIsReserving] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => {
    const checkTickets = async () => {
      if (user && token && event) {
        try {
          const tickets = await api.get("/tickets/my-tickets", token);
          const userTicketsForEvent = tickets.filter((t: any) => t.event_id === event.id);
          if (userTicketsForEvent.length > 0) {
            setHasTicket(true);
            setTicketCount(userTicketsForEvent.length);
          }
        } catch (error) {
          console.error("Error checking tickets", error);
        }
      }
    };
    checkTickets();
  }, [user, token, event]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.get(`/events/${resolvedParams.id}`);
        if (data) setEvent(data);
      } catch {
        setError("Evento no encontrado");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Evento no encontrado
        </h1>
        <p className="text-[var(--text-secondary)]">
          El evento que buscas no existe o ya no está disponible.
        </p>
        <Link
          href="/eventos"
          className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
        >
          Volver a Eventos
        </Link>
      </div>
    );
  }

  const whatsappNumber = event.contact_whatsapp
    ? event.contact_whatsapp.replace(/\D/g, "")
    : WHATSAPP_FALLBACK;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola, quiero información sobre el evento "${event.title}".`)}`;

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleReserveTicket = async () => {
    if (!user) {
      router.push("/login?redirect=/eventos/" + event.id);
      return;
    }
    setIsReserving(true);
    try {
      await api.post(`/tickets/reserve/${event.id}`, {}, token!);
      alert("¡Lugar reservado! Tu entrada digital está en tu perfil.");
      router.push("/profile");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al reservar. Puede que ya tengas una entrada.";
      alert(errorMessage);
    } finally {
      setIsReserving(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: `Evento: ${event.title} — ${event.date}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("¡Link copiado al portapapeles!");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-24 overflow-clip">
      {/* Navigation */}
      <div className="fixed top-6 left-6 z-50 flex gap-3">
        <Link
          href="/eventos"
          className="p-3 bg-black/30 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/50 transition-all text-white shadow-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>
      <button
        onClick={handleShare}
        className="fixed top-6 right-6 z-50 p-3 bg-black/30 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/50 transition-all text-white shadow-lg"
      >
        <Share2 className="w-6 h-6" />
      </button>

      {/* Hero Image */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-violet-900 to-pink-900 flex items-center justify-center">
            <Music className="w-32 h-32 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/40 to-transparent" />

        {/* Floating Event Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap gap-2">
              {event.is_featured && (
                <span className="px-3 py-1 bg-purple-600/80 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" /> Destacado
                </span>
              )}
              {event.type && (
                <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white">
                  {event.type}
                </span>
              )}
              {event.min_age && (
                <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white">
                  Edad: {event.min_age}+
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            {event.organizer_name && (
              <p className="text-lg text-white/70">
                Organiza:{" "}
                <span className="text-white font-medium">
                  {event.organizer_name}
                </span>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content — 2 cols */}
          <div className="lg:col-span-2 space-y-10">
            {/* Event Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {event.date && (
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">
                      Fecha
                    </p>
                    <p className="font-semibold">{event.date}</p>
                  </div>
                </div>
              )}
              {event.time && (
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/15 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">
                      Hora
                    </p>
                    <p className="font-semibold">{event.time}</p>
                  </div>
                </div>
              )}
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">
                    Ubicación
                  </p>
                  <p className="font-semibold">
                    {event.venue_name || event.location || "Por confirmar"}
                  </p>
                  {event.city && (
                    <p className="text-sm text-[var(--text-secondary)]">
                      {event.venue_address
                        ? `${event.venue_address}, ${event.city}`
                        : event.city}
                    </p>
                  )}
                </div>
              </div>
              {event.capacity && (
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">
                      Aforo
                    </p>
                    <p className="font-semibold">
                      {event.capacity.toLocaleString()} personas
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Description */}
            {event.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-4">Sobre el Evento</h2>
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8">
                  <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Lineup */}
            {event.lineup && event.lineup.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Music className="w-6 h-6 text-purple-400" />
                  Lineup
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.lineup.map((artist, i) => (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-5 flex items-center gap-4 hover:border-purple-500/30 transition-colors group"
                    >
                      {/* Artist Image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        {artist.image_url ? (
                          <Image
                            src={artist.image_url}
                            alt={artist.artist_name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <span className="text-2xl font-black text-white/80">
                            {artist.artist_name[0]}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate group-hover:text-purple-400 transition-colors">
                          {artist.artist_name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                          {artist.role && (
                            <span className="text-purple-400 font-medium">
                              {artist.role}
                            </span>
                          )}
                          {artist.set_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {artist.set_time}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Zones / Tickets */}
            {event.zones && event.zones.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-pink-400" />
                  Zonas y Entradas
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.zones.map((zone) => (
                    <div
                      key={zone.id}
                      className={`relative bg-[var(--bg-elevated)] border rounded-2xl p-6 transition-all ${
                        zone.is_sold_out
                          ? "border-red-500/20 opacity-60"
                          : "border-[var(--border-subtle)] hover:border-purple-500/30"
                      }`}
                    >
                      {zone.is_sold_out && (
                        <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold">
                          Agotado
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-2">{zone.name}</h3>
                      {zone.price && (
                        <p className="text-2xl font-black text-purple-400 mb-3">
                          {zone.price}
                        </p>
                      )}
                      {zone.capacity && (
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          <Users className="w-4 h-4 inline mr-1" />
                          Capacidad: {zone.capacity}
                        </p>
                      )}
                      {zone.perks && (
                        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
                          <p className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)] mb-2">
                            Incluye
                          </p>
                          <ul className="space-y-1">
                            {zone.perks.split(",").map((perk, i) => (
                              <li
                                key={i}
                                className="text-sm text-[var(--text-secondary)] flex items-center gap-2"
                              >
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                {perk.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Additional Info */}
            {(event.dress_code || event.min_age || event.reservation_required) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-4">Información Adicional</h2>
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-4">
                  {event.min_age && (
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <span>Edad mínima: <strong>{event.min_age}</strong></span>
                    </div>
                  )}
                  {event.dress_code && (
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-purple-400" />
                      <span>Dress code: <strong>{event.dress_code}</strong></span>
                    </div>
                  )}
                  {event.reservation_required && (
                    <div className="flex items-center gap-3">
                      <Ticket className="w-5 h-5 text-pink-400" />
                      <span className="text-pink-400 font-medium">Requiere reserva previa</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Video Promo */}
            {event.video_promo_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-2xl font-bold mb-4">Video Promocional</h2>
                <div className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-black aspect-video relative shadow-lg">
                  {getYouTubeId(event.video_promo_url) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(event.video_promo_url)}`}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <video
                      src={event.video_promo_url}
                      controls
                      className="absolute inset-0 w-full h-full object-cover"
                    >
                      Tu navegador no soporta el formato de video.
                    </video>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar — 1 col */}
          <div className="space-y-6">
            {/* Price & CTA Sticky Card */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl p-8 space-y-6"
              >
                <div>
                  <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">
                    Entradas
                  </p>
                  <p className="text-3xl font-black">
                    {event.free_entry
                      ? "Entrada Libre"
                      : event.price || "Consultar precio"}
                  </p>
                </div>

                {/* Already have ticket banner */}
                {hasTicket && (
                  <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400 shrink-0">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-400">¡Ya tienes entrada!</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        Has adquirido {ticketCount} entrada{ticketCount > 1 ? 's' : ''} para este evento. Puedes verlas en tu <Link href="/settings" className="underline font-medium hover:text-emerald-300">perfil</Link>.
                      </p>
                    </div>
                  </div>
                )}

                {/* External Ticket Link OR Native Reservation */}
                {event.free_entry && event.reservation_required ? (
                  <button
                    onClick={handleReserveTicket}
                    disabled={isReserving}
                    className="w-full block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 disabled:opacity-50"
                  >
                    <Ticket className="w-5 h-5 inline mr-2" />
                    {isReserving ? "Reservando..." : "Reservar mi Lugar"}
                  </button>
                ) : event.ticket_url && (
                  <a
                    href={event.ticket_url.startsWith('http') ? event.ticket_url : `https://${event.ticket_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40"
                  >
                    <Ticket className="w-5 h-5 inline mr-2" />
                    Comprar Entradas
                  </a>
                )}

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all"
                >
                  <MessageCircle className="w-5 h-5 inline mr-2" />
                  Reservar por WhatsApp
                </a>

                {/* Contact Form */}
                <Link
                  href="/contact"
                  className="w-full block text-center border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] py-4 rounded-2xl font-bold transition-all"
                >
                  <Mail className="w-5 h-5 inline mr-2" />
                  Enviar Consulta
                </Link>
              </motion.div>

              {/* Contact Info */}
              {(event.contact_whatsapp ||
                event.contact_email ||
                event.contact_phone ||
                event.contact_instagram) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl p-8 space-y-5"
                >
                  <h3 className="font-bold text-lg">Contacto del Evento</h3>

                  {event.contact_whatsapp && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-emerald-400 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {event.contact_whatsapp}
                    </a>
                  )}

                  {event.contact_email && (
                    <a
                      href={`mailto:${event.contact_email}`}
                      className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-blue-400 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      {event.contact_email}
                    </a>
                  )}

                  {event.contact_phone && (
                    <a
                      href={`tel:${event.contact_phone}`}
                      className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      {event.contact_phone}
                    </a>
                  )}

                  {event.contact_instagram && (
                    <a
                      href={`https://instagram.com/${event.contact_instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-pink-400 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                      {event.contact_instagram}
                    </a>
                  )}
                </motion.div>
              )}

              {/* Flyer */}
              {event.flyer_url && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-3xl overflow-hidden border border-[var(--border-subtle)]"
                >
                  <Image
                    src={event.flyer_url}
                    alt={`Flyer — ${event.title}`}
                    width={400}
                    height={560}
                    className="w-full h-auto object-cover"
                    unoptimized
                  />
                </motion.div>
              )}

              {/* Tags */}
              {event.tags && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.split(",").map((tag) => (
                    <span
                      key={tag.trim()}
                      className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-full text-xs font-semibold text-[var(--text-secondary)]"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
