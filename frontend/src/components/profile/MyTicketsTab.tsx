import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Download,
} from "lucide-react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

interface TicketData {
  id: number;
  user_id: number;
  status: string;
  qr_code: string;
  created_at: string;
  event_id: number;
  event?: {
    id: number;
    title: string;
    date: string | null;
    time: string | null;
    venue_name: string | null;
    location: string | null;
  };
}

export default function MyTicketsTab() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await api.get("/tickets/my-tickets", token);
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleDownloadQR = (qrCodeId: string, eventTitle: string) => {
    const canvas = document.getElementById(
      `qr-${qrCodeId}`,
    ) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `Entrada_${eventTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-[var(--text-secondary)]">
        Cargando entradas...
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] rounded-2xl">
        <div className="w-16 h-16 bg-[var(--bg-elevated)] rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Ticket className="w-8 h-8 text-[var(--text-muted)]" />
        </div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Aún no tienes entradas
        </h3>
        <p className="text-[var(--text-secondary)] text-center max-w-sm mb-6">
          Explora nuestra cartelera y descubre los mejores eventos y festivales
          cerca de ti.
        </p>
        <Link
          href="/eventos"
          className="px-6 py-3 bg-[var(--accent-primary)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
        >
          Explorar Eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
        Tus Entradas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((ticket, i) => {
          const title = ticket.event?.title || `Evento_${ticket.event_id}`;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={ticket.id}
              className="relative bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden flex flex-col md:flex-row group hover:border-[var(--accent-primary)]/50 transition-colors shadow-lg"
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                {ticket.status === "valido" && (
                  <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                    Válida
                  </span>
                )}
                {ticket.status === "usado" && (
                  <span className="bg-zinc-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                    Usada
                  </span>
                )}
                {ticket.status === "cancelado" && (
                  <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                    Cancelada
                  </span>
                )}
              </div>

              {/* Event Info Side */}
              <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-[var(--border-subtle)] border-dashed relative">
                {/* Decorative circles to mimic ticket perforations */}
                <div className="hidden md:block absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[var(--bg-secondary)] border-b border-l border-[var(--border-subtle)]"></div>
                <div className="hidden md:block absolute -right-3 -bottom-3 w-6 h-6 rounded-full bg-[var(--bg-secondary)] border-t border-l border-[var(--border-subtle)]"></div>

                <p className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider mb-2">
                  Boleto Digital
                </p>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
                  {title}
                </h3>

                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                  {ticket.event?.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>{ticket.event.date}</span>
                    </div>
                  )}
                  {ticket.event?.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>{ticket.event.time}</span>
                    </div>
                  )}
                  {(ticket.event?.venue_name || ticket.event?.location) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                      <span className="truncate max-w-[200px]">
                        {ticket.event.venue_name || ticket.event.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code Side */}
              <div className="p-6 flex flex-col items-center justify-center bg-[var(--bg-tertiary)]/50 min-w-[160px]">
                <div
                  className="bg-white p-2 rounded-xl shadow-sm mb-3 relative group/qr cursor-pointer"
                  onClick={() => handleDownloadQR(ticket.qr_code, title)}
                  title="Click para descargar"
                >
                  <QRCodeCanvas
                    id={`qr-${ticket.qr_code}`}
                    value={ticket.qr_code}
                    size={100}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-opacity">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs font-mono text-[var(--text-muted)] tracking-widest">
                  {ticket.qr_code}
                </p>
                <button
                  onClick={() => handleDownloadQR(ticket.qr_code, title)}
                  className="mt-3 text-xs font-medium text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Descargar
                </button>
                <Link
                  href={`/eventos/${ticket.event_id}`}
                  className="mt-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1"
                >
                  Ver Evento <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
