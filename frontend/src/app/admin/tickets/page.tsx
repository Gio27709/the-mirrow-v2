"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Search, Ticket, Mail, Plus, Check, CheckCircle2, XCircle, RotateCcw, Loader2, RefreshCw } from "lucide-react";
import { errorMessage } from "../_lib/upload";

interface EventOption {
    id: number;
    title: string;
    date: string | null;
    is_active: boolean;
    capacity: number | null;
}

type TicketStatus = "valido" | "usado" | "cancelado";

interface AdminTicket {
    id: number;
    status: TicketStatus;
    qr_code: string;
    price_paid: string | null;
    created_at: string | null;
    event_id: number;
    event_title: string | null;
    event_date: string | null;
    zone_id: number | null;
    zone_name: string | null;
    user_id: number;
    user_email: string | null;
    user_full_name: string | null;
}

const STATUS_LABELS: Record<TicketStatus, { label: string; cls: string }> = {
    valido: { label: "Válida", cls: "bg-green-500/10 text-green-400 border-green-500/20" },
    usado: { label: "Usada", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    cancelado: { label: "Cancelada", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const fieldCls = "w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all";

export default function AdminTicketsPage() {
    const { token } = useAuth();
    const [events, setEvents] = useState<EventOption[]>([]);

    // Issue form state
    const [email, setEmail] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [pricePaid, setPricePaid] = useState("");
    const [issuing, setIssuing] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // List state
    const [tickets, setTickets] = useState<AdminTicket[]>([]);
    const [ticketsLoading, setTicketsLoading] = useState(true);
    const [listError, setListError] = useState("");
    const [filterEvent, setFilterEvent] = useState("");
    const [filterStatus, setFilterStatus] = useState<"" | TicketStatus>("");
    const [search, setSearch] = useState("");
    const [busyTicketId, setBusyTicketId] = useState<number | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data: EventOption[] = await api.get("/events/");
                setEvents(data);
            } catch (err) {
                console.error("Failed to fetch events", err);
            }
        };
        fetchEvents();
    }, []);

    const fetchTickets = useCallback(async () => {
        if (!token) return;
        setTicketsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterEvent) params.set("event_id", filterEvent);
            if (filterStatus) params.set("status", filterStatus);
            const qs = params.toString();
            const data: AdminTicket[] = await api.get(`/tickets/admin${qs ? `?${qs}` : ""}`, token);
            setTickets(data);
            setListError("");
        } catch (err) {
            setListError(errorMessage(err, "No se pudieron cargar las entradas"));
        } finally {
            setTicketsLoading(false);
        }
    }, [token, filterEvent, filterStatus]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleIssueTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (issuing || !token) return;
        setIssuing(true);
        setError("");
        setSuccess("");

        try {
            const issuedTo = email.trim();
            await api.post(
                "/tickets/admin/issue",
                {
                    event_id: Number(selectedEvent),
                    user_email: issuedTo,
                    price_paid: pricePaid.trim() || null,
                },
                token,
            );
            setSuccess(`¡Entrada emitida correctamente para ${issuedTo}!`);
            setEmail("");
            setPricePaid("");
            fetchTickets();
        } catch (err) {
            setError(errorMessage(err, "Error al emitir entrada. Verifica que el usuario exista."));
        } finally {
            setIssuing(false);
        }
    };

    const changeStatus = async (ticket: AdminTicket, status: TicketStatus) => {
        if (!token || busyTicketId !== null) return;
        const who = ticket.user_email || "este usuario";
        const prompts: Record<TicketStatus, string> = {
            usado: `¿Marcar como USADA la entrada ${ticket.qr_code} de ${who}?`,
            cancelado: `¿CANCELAR la entrada ${ticket.qr_code} de ${who}? Liberará una plaza.`,
            valido: `¿Restaurar como válida la entrada ${ticket.qr_code} de ${who}?`,
        };
        if (!window.confirm(prompts[status])) return;
        setBusyTicketId(ticket.id);
        try {
            const updated: AdminTicket = await api.patch(`/tickets/${ticket.id}/status`, { status }, token);
            setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        } catch (err) {
            alert(errorMessage(err, "No se pudo actualizar la entrada"));
        } finally {
            setBusyTicketId(null);
        }
    };

    const term = search.trim().toLowerCase();
    const visibleTickets = term
        ? tickets.filter(
              (t) =>
                  t.qr_code.toLowerCase().includes(term) ||
                  (t.user_email ?? "").toLowerCase().includes(term) ||
                  (t.user_full_name ?? "").toLowerCase().includes(term),
          )
        : tickets;

    const counts = tickets.reduce(
        (acc, t) => {
            acc[t.status] = (acc[t.status] ?? 0) + 1;
            return acc;
        },
        {} as Partial<Record<TicketStatus, number>>,
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        Gestión de Entradas
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Emite entradas vendidas por canales externos (WhatsApp, Bizum, etc.), valídalas en la puerta o cancélalas.
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
                                className={fieldCls}
                            >
                                <option value="">-- Seleccionar Evento --</option>
                                {events.map((ev) => (
                                    <option key={ev.id} value={ev.id}>
                                        {ev.title}
                                        {ev.date ? ` (${ev.date})` : ""}
                                        {ev.is_active ? "" : " [inactivo]"}
                                    </option>
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
                                    className={`${fieldCls} pl-10`}
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
                                className={fieldCls}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm" role="alert">
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
                            disabled={issuing || !selectedEvent || !email.trim()}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--accent-primary)] hover:brightness-110 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                        >
                            {issuing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
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
                            <li>La entrada digital con código QR aparecerá automáticamente en su perfil (&quot;Mis Entradas&quot;).</li>
                            <li>En la puerta, busca el código o el correo abajo y pulsa <span className="font-semibold">Marcar usada</span>.</li>
                        </ol>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {(Object.keys(STATUS_LABELS) as TicketStatus[]).map((s) => (
                            <div key={s} className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-4 text-center">
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{counts[s] ?? 0}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{STATUS_LABELS[s].label}s</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Tickets list */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-4 md:p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Entradas emitidas</h2>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <select
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="w-full sm:w-48 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                            aria-label="Filtrar por evento"
                        >
                            <option value="">Todos los eventos</option>
                            {events.map((ev) => (
                                <option key={ev.id} value={ev.id}>{ev.title}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as "" | TicketStatus)}
                            className="w-full sm:w-36 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                            aria-label="Filtrar por estado"
                        >
                            <option value="">Todos los estados</option>
                            <option value="valido">Válidas</option>
                            <option value="usado">Usadas</option>
                            <option value="cancelado">Canceladas</option>
                        </select>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Correo o código..."
                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-indigo-500"
                            />
                        </div>
                        <button
                            onClick={() => fetchTickets()}
                            disabled={ticketsLoading}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
                            title="Recargar"
                        >
                            <RefreshCw className={`w-4 h-4 ${ticketsLoading ? "animate-spin" : ""}`} />
                            <span className="sm:hidden">Recargar</span>
                        </button>
                    </div>
                </div>

                {listError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm" role="alert">
                        {listError}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead>
                            <tr className="border-b border-[var(--border-subtle)] text-left text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                                <th className="px-3 py-3 font-semibold">Código</th>
                                <th className="px-3 py-3 font-semibold">Usuario</th>
                                <th className="px-3 py-3 font-semibold">Evento</th>
                                <th className="px-3 py-3 font-semibold">Pagado</th>
                                <th className="px-3 py-3 font-semibold">Estado</th>
                                <th className="px-3 py-3 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                            {visibleTickets.map((t) => {
                                const st = STATUS_LABELS[t.status] ?? { label: t.status, cls: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
                                const busy = busyTicketId === t.id;
                                return (
                                    <tr key={t.id} className="hover:bg-[var(--bg-tertiary)]/40">
                                        <td className="px-3 py-3 font-mono text-xs whitespace-nowrap">{t.qr_code}</td>
                                        <td className="px-3 py-3">
                                            <div className="text-[var(--text-primary)]">{t.user_full_name || "Sin nombre"}</div>
                                            <div className="text-xs text-[var(--text-secondary)]">{t.user_email}</div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="text-[var(--text-primary)]">{t.event_title || `#${t.event_id}`}</div>
                                            <div className="text-xs text-[var(--text-secondary)]">
                                                {t.event_date}
                                                {t.zone_name ? ` · ${t.zone_name}` : ""}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-[var(--text-secondary)] whitespace-nowrap">{t.price_paid || "—"}</td>
                                        <td className="px-3 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${st.cls}`}>{st.label}</span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex justify-end gap-1">
                                                {busy && <Loader2 className="w-4 h-4 animate-spin self-center text-[var(--text-muted)]" />}
                                                {t.status === "valido" && (
                                                    <button
                                                        onClick={() => changeStatus(t, "usado")}
                                                        disabled={busyTicketId !== null}
                                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Marcar usada
                                                    </button>
                                                )}
                                                {t.status !== "cancelado" && (
                                                    <button
                                                        onClick={() => changeStatus(t, "cancelado")}
                                                        disabled={busyTicketId !== null}
                                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" /> Cancelar
                                                    </button>
                                                )}
                                                {t.status !== "valido" && (
                                                    <button
                                                        onClick={() => changeStatus(t, "valido")}
                                                        disabled={busyTicketId !== null}
                                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 disabled:opacity-50"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" /> Restaurar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {!ticketsLoading && visibleTickets.length === 0 && (
                        <div className="py-10 text-center text-[var(--text-muted)]">
                            {tickets.length === 0 ? "No hay entradas para estos filtros." : "Ninguna entrada coincide con la búsqueda."}
                        </div>
                    )}
                    {ticketsLoading && tickets.length === 0 && (
                        <div className="py-10 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
