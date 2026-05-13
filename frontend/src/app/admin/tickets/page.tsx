"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Search, Ticket, Mail, Plus, Check } from "lucide-react";

export default function AdminTicketsPage() {
    const { token } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [email, setEmail] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [pricePaid, setPricePaid] = useState("");
    const [issuing, setIssuing] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await api.get("/events");
                setEvents(data);
            } catch (err) {
                console.error("Failed to fetch events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleIssueTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setIssuing(true);
        setError("");
        setSuccess("");

        try {
            await api.post(
                `/tickets/admin/issue?event_id=${selectedEvent}&user_email=${encodeURIComponent(email)}&price_paid=${encodeURIComponent(pricePaid)}`, 
                {}, 
                token!
            );
            setSuccess(`¡Entrada emitida correctamente para ${email}!`);
            setEmail("");
            setPricePaid("");
        } catch (err: any) {
            setError(err.message || "Error al emitir entrada. Verifica que el usuario exista.");
        } finally {
            setIssuing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        Gestión de Entradas
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Emisión manual de entradas para ventas por canales externos (WhatsApp, Bizum, etc).
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Issue Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-subtle)]">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Ticket className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">Emitir Nueva Entrada</h2>
                    </div>

                    <form onSubmit={handleIssueTicket} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Evento</label>
                            <select 
                                required
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            >
                                <option value="">-- Seleccionar Evento --</option>
                                {events.map(ev => (
                                    <option key={ev.id} value={ev.id}>{ev.title} ({ev.date})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Correo del Usuario Registrado</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input 
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="usuario@correo.com"
                                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                />
                            </div>
                            <p className="text-xs text-[var(--text-muted)]">El usuario debe haber creado una cuenta en la plataforma.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Precio Pagado (Opcional)</label>
                            <input 
                                type="text"
                                value={pricePaid}
                                onChange={(e) => setPricePaid(e.target.value)}
                                placeholder="Ej: 25€ (Bizum)"
                                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm flex items-center gap-2">
                                <Check className="w-4 h-4" /> {success}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={issuing || !selectedEvent || !email}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--accent-primary)] hover:brightness-110 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                        >
                            <Plus className="w-5 h-5" />
                            {issuing ? "Emitiendo..." : "Emitir Entrada"}
                        </button>
                    </form>
                </motion.div>

                {/* Info Panel */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-2">¿Cómo funciona?</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--text-secondary)]">
                            <li>El cliente te paga por Bizum, Transferencia o Efectivo.</li>
                            <li>Le pides que se registre en la plataforma con su correo.</li>
                            <li>Entras aquí y emites la entrada hacia ese correo.</li>
                            <li>La entrada digital con código QR aparecerá automáticamente en su perfil ("Mis Entradas").</li>
                        </ol>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
