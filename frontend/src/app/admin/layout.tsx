"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Panel", href: "/admin" },
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

  // Sidebar content — shared between desktop and mobile drawer
  const sidebarContent = (
    <div className="h-full flex flex-col bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)]">
      <div className="p-4 md:p-6 flex items-center justify-between">
        {(isSidebarOpen || isMobile) ? (
          <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            AdminPanel
          </span>
        ) : (
          <span className="text-xl font-bold text-indigo-400">AP</span>
        )}
        {isMobile ? (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <ChevronRight
              className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${isSidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 md:px-4 py-4 space-y-1 md:space-y-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.subItems ? (
              // Parent Item with Submenu
              <div>
                <div
                  onClick={() => toggleSubmenu(item.label)}
                  className={`flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer group text-sm md:text-base ${expandedMenu === item.label ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]" : ""}`}
                >
                  <item.icon className="w-5 h-5 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  {(isSidebarOpen || isMobile) && (
                    <>
                      <span className="font-medium flex-1">{item.label}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${expandedMenu === item.label ? "rotate-90" : ""}`}
                      />
                    </>
                  )}
                </div>
                {/* Submenu Items */}
                {(isSidebarOpen || isMobile) && expandedMenu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-7 md:ml-9 mt-1 space-y-1 border-l-2 border-[var(--border-subtle)] pl-2"
                  >
                    {item.subItems.map((sub) => (
                      <Link key={sub.href} href={sub.href}>
                        <div
                          onClick={() => isMobile && setIsMobileMenuOpen(false)}
                          className="px-3 md:px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer"
                        >
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
                <div
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer group text-sm md:text-base"
                >
                  <item.icon className="w-5 h-5 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  {(isSidebarOpen || isMobile) && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </div>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="p-3 md:p-4 border-t border-[var(--border-subtle)]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-xl hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-all text-sm md:text-base"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(isSidebarOpen || isMobile) && <span className="font-medium">Salir</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Mobile: Top Bar with hamburger */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-[var(--bg-elevated)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-9 h-9 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            AdminPanel
          </span>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      )}

      {/* Mobile: Drawer overlay */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] z-[60]"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop: Sidebar */}
        {!isMobile && (
          <motion.aside
            initial={false}
            animate={{ width: isSidebarOpen ? 260 : 80 }}
            className="h-screen sticky top-0 z-50 transition-all flex-shrink-0"
          >
            {sidebarContent}
          </motion.aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto min-h-screen">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
