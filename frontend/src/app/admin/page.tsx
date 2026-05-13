"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Users, UserCheck, Shield, Mail, Loader2 } from "lucide-react";

interface DashboardStats {
  total_users: number;
  active_users: number;
  google_users: number;
  email_users: number;
  recent_users: Array<{
    id: number;
    full_name: string | null;
    email: string;
    auth_provider: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        // Custom fetch because api wrapper might need update for auth header if not handled globaly
        // But api.ts handles it if we pass context? No, api.ts is usually authed if we use the interceptor or pass header.
        // Let's us api.get but with header manually just in case, or depend on AuthContext

        const data = await api.get("/admin/stats", token);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[200px] text-[var(--accent-primary)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  if (!stats)
    return (
      <div className="text-[var(--text-primary)]">Error al cargar datos.</div>
    );

  const cards = [
    {
      title: "Usuarios Totales",
      value: stats.total_users,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Usuarios Activos",
      value: stats.active_users,
      icon: UserCheck,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      title: "Google Auth",
      value: stats.google_users,
      icon: Shield,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      title: "Email Auth",
      value: stats.email_users,
      icon: Mail,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Dashboard
        </h1>
        <p className="text-[var(--text-secondary)]">
          Bienvenido al panel de control de The Mirrow.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-1">
              {card.value}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">{card.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions or Recent Users Table Preview could go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
            Usuarios Recientes
          </h2>
          <div className="space-y-4">
            {stats.recent_users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-tertiary)]/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user.full_name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] font-medium">
                      {user.full_name || "Sin nombre"}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-muted)] capitalize">
                  {user.auth_provider}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
