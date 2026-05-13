"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Calendar, Phone, Mail, User, Loader2, MessageCircle, Tag, Globe, CheckCircle, Circle, Eye } from "lucide-react";

interface Lead {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  message: string | null;
  inquiry_type: string | null;
  source: string | null;
  is_read: boolean;
  created_at: string;
}

const typeLabels: Record<string, string> = {
  evento: "🎪 Evento",
  cotizacion: "💰 Cotización",
  talento: "🎤 Talento",
  general: "💬 General",
};

const sourceLabels: Record<string, string> = {
  web: "🌐 Web",
  whatsapp: "📱 WhatsApp",
  landing: "📄 Landing",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api.get("/admin/leads", token);
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const toggleRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/admin/leads/${id}/read`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });
      fetchLeads();
    } catch (e) { console.error(e); }
  };

  const unreadCount = leads.filter(l => !l.is_read).length;

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-purple-400"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Mensajes y Contactos</h1>
          <p className="text-[var(--text-secondary)]">Consultas recibidas desde la página de contacto y landing.</p>
        </div>
        {unreadCount > 0 && (
          <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-bold">
            {unreadCount} sin leer
          </div>
        )}
      </header>

      <div className="space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className={`bg-[var(--bg-elevated)] border rounded-2xl overflow-hidden transition-all ${lead.is_read ? "border-[var(--border-subtle)]" : "border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]"}`}>
            <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[var(--bg-tertiary)]/30 transition-colors" onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${lead.is_read ? "bg-[var(--bg-tertiary)] text-[var(--text-muted)]" : "bg-purple-500/20 text-purple-400"}`}>
                <User className="w-5 h-5" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium truncate ${lead.is_read ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]"}`}>{lead.full_name}</span>
                  {!lead.is_read && <Circle className="w-2 h-2 fill-purple-400 text-purple-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span>{lead.email}</span>
                  {lead.inquiry_type && <span className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded text-[var(--text-secondary)]">{typeLabels[lead.inquiry_type] || lead.inquiry_type}</span>}
                  {lead.source && <span>{sourceLabels[lead.source] || lead.source}</span>}
                </div>
              </div>

              {/* Date & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-[var(--text-muted)]">{new Date(lead.created_at).toLocaleDateString()}</span>
                <button onClick={(e) => { e.stopPropagation(); toggleRead(lead.id); }} className={`p-2 rounded-lg transition-colors ${lead.is_read ? "text-[var(--text-muted)] hover:text-emerald-400" : "text-purple-400 hover:text-emerald-400"}`} title={lead.is_read ? "Marcar como no leído" : "Marcar como leído"}>
                  {lead.is_read ? <CheckCircle className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === lead.id && (
              <div className="px-4 pb-4 pt-0 border-t border-[var(--border-subtle)]">
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-blue-400" /><a href={`mailto:${lead.email}`} className="text-blue-400 hover:underline">{lead.email}</a></div>
                    {lead.phone && <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-emerald-400" /><a href={`tel:${lead.phone}`} className="text-emerald-400 hover:underline">{lead.phone}</a></div>}
                    {lead.inquiry_type && <div className="flex items-center gap-2 text-sm"><Tag className="w-4 h-4 text-[var(--text-muted)]" /><span>Tipo: {typeLabels[lead.inquiry_type] || lead.inquiry_type}</span></div>}
                    {lead.source && <div className="flex items-center gap-2 text-sm"><Globe className="w-4 h-4 text-[var(--text-muted)]" /><span>Fuente: {sourceLabels[lead.source] || lead.source}</span></div>}
                    <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-[var(--text-muted)]" /><span>{new Date(lead.created_at).toLocaleString()}</span></div>
                  </div>
                  {lead.message && (
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)] mb-2 flex items-center gap-1"><MessageCircle className="w-3 h-3" />Mensaje</p>
                      <p className="text-sm text-[var(--text-primary)] whitespace-pre-line">{lead.message}</p>
                    </div>
                  )}
                </div>
                {lead.phone && (
                  <div className="mt-4 flex gap-2">
                    <a href={`https://wa.me/${lead.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600/30 transition-colors">
                      <MessageCircle className="w-4 h-4" />Responder por WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {leads.length === 0 && <div className="p-8 text-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border-subtle)] rounded-2xl">No hay mensajes aún.</div>}
      </div>
    </div>
  );
}
