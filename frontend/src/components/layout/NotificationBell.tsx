"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, Ticket } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Notification {
  id: string;
  title: string;
  detail: string;
  href: string;
  kind: "event" | "ticket";
}

interface EventItem {
  id: number;
  title: string;
  date?: string | null;
  time?: string | null;
  venue_name?: string | null;
}

interface TicketItem {
  id: number;
  status: string;
  event?: EventItem | null;
}

const SEEN_KEY = "notifications_seen";

function readSeen(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    return [];
  }
}

async function fetchNotifications(token: string | null): Promise<Notification[]> {
  const today = new Date().toISOString().slice(0, 10);
  const next: Notification[] = [];
  try {
    if (token) {
      const tickets: TicketItem[] = await api.get("/tickets/my-tickets", token);
      tickets
        .filter((t) => t.event && (!t.event.date || t.event.date >= today) && t.status !== "cancelado")
        .forEach((t) =>
          next.push({
            id: `ticket-${t.id}`,
            kind: "ticket",
            title: `Tu entrada: ${t.event!.title}`,
            detail: [t.event!.date, t.event!.time, t.event!.venue_name].filter(Boolean).join(" · "),
            href: "/settings?tab=tickets",
          }),
        );
    }
    const events: EventItem[] = await api.get("/events/?is_active=true");
    events
      .filter((e) => e.date && e.date >= today)
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
      .slice(0, 5)
      .forEach((e) =>
        next.push({
          id: `event-${e.id}`,
          kind: "event",
          title: `Nuevo evento: ${e.title}`,
          detail: [e.date, e.time, e.venue_name].filter(Boolean).join(" · "),
          href: `/eventos/${e.id}`,
        }),
      );
  } catch {
    // Notifications are best-effort; keep whatever loaded
  }
  return next;
}

/**
 * Bell with real notifications: upcoming events for everyone, plus the
 * user's own upcoming tickets. The dot shows only for unseen items.
 */
export function NotificationBell({ className = "" }: { className?: string }) {
  const { user, token } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [seen, setSeen] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readSeen(),
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    let cancelled = false;
    fetchNotifications(user ? token : null).then((next) => {
      if (!cancelled) setItems(next);
    });
    return () => {
      cancelled = true;
    };
  }, [user, token]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = items.filter((i) => !seen.includes(i.id)).length;

  const toggle = () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && unread > 0) {
      const all = [...new Set([...seen, ...items.map((i) => i.id)])];
      setSeen(all);
      try {
        localStorage.setItem(SEEN_KEY, JSON.stringify(all));
      } catch {
        // storage unavailable (private mode): the dot just reappears next visit
      }
    }
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggle}
        className={`relative w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all ${className}`}
        aria-label={unread ? `Notificaciones (${unread} nuevas)` : "Notificaciones"}
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[var(--bg-elevated)]" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-[var(--border-subtle)] font-semibold text-sm text-[var(--text-primary)]">
              Notificaciones
            </div>
            {items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-[var(--text-secondary)] text-center">
                No tienes notificaciones por ahora.
              </p>
            ) : (
              <ul className="max-h-80 overflow-y-auto">
                {items.map((n) => {
                  const Icon = n.kind === "ticket" ? Ticket : Calendar;
                  return (
                    <li key={n.id}>
                      <Link
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className="flex gap-3 px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <Icon className="w-4 h-4 mt-0.5 shrink-0 text-[var(--accent-primary)]" />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-[var(--text-primary)] truncate">
                            {n.title}
                          </span>
                          {n.detail && (
                            <span className="block text-xs text-[var(--text-secondary)] truncate">
                              {n.detail}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
