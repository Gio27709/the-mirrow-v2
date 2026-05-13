"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ClipboardList,
  Layout,
  Calendar,
  Star,
  Ticket,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Hooks MUST be called before any early return
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(
    "Configuración",
  );

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin" && user.role !== "owner") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Usuarios", href: "/admin/users" },
    { icon: Star, label: "Talentos", href: "/admin/talent" },
    { icon: ClipboardList, label: "Registros", href: "/admin/leads" },
    { icon: Calendar, label: "Eventos", href: "/admin/events" },
    { icon: Ticket, label: "Entradas", href: "/admin/tickets" },
    { icon: Layout, label: "Portada", href: "/admin/hero" },
    {
      icon: Settings,
      label: "Configuración",
      href: "#",
      subItems: [
        { label: "General", href: "/admin/settings" },
        { label: "Categorías", href: "/admin/categories" },
      ],
    },
  ];

  const toggleSubmenu = (label: string) => {
    if (expandedMenu === label) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(label);
      if (!isSidebarOpen) setIsSidebarOpen(true);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-primary)]">
        Cargando Admin...
      </div>
    );
  if (!user || (user.role !== "admin" && user.role !== "owner")) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex text-[var(--text-primary)] transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="h-screen sticky top-0 border-r border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex flex-col z-50 transition-all"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              AdminPanel
            </span>
          ) : (
            <span className="text-xl font-bold text-indigo-400">AP</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <ChevronRight
              className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${isSidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.subItems ? (
                // Parent Item with Submenu
                <div>
                  <div
                    onClick={() => toggleSubmenu(item.label)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer group ${expandedMenu === item.label ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]" : ""}`}
                  >
                    <item.icon className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                    {isSidebarOpen && (
                      <>
                        <span className="font-medium flex-1">{item.label}</span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${expandedMenu === item.label ? "rotate-90" : ""}`}
                        />
                      </>
                    )}
                  </div>
                  {/* Submenu Items */}
                  {isSidebarOpen && expandedMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-9 mt-1 space-y-1 border-l-2 border-[var(--border-subtle)] pl-2"
                    >
                      {item.subItems.map((sub) => (
                        <Link key={sub.href} href={sub.href}>
                          <div className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer">
                            {sub.label}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                // Standard Item
                <Link href={item.href}>
                  <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer group">
                    <item.icon className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                    {isSidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--border-subtle)]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Salir</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
