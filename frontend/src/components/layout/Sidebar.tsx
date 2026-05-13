"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { NavItem } from "@/lib/nav-data";
import { usePathname } from "next/navigation";
import { useCategories } from "@/context/CategoryContext";
import { Logo } from "@/components/ui/Logo";

import { useAuth } from "@/context/AuthContext";

/**
 * Animated Sidebar Component
 * - Dashboard style
 * - Nested submenus
 * - Search functionality
 * - Collapsible
 */
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user } = useAuth();
  const { mergedNavItems } = useCategories();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Hover timer ref to prevent instant expanding/collapsing
  const hoverTimeoutRef = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Helper to check if a route is active
  const isRouteActive = (href: string) => pathname === href;

  // Derived state
  const isActuallyCollapsed = isCollapsed && !isHovered;

  // Filter Navigation Items based on Role
  const filteredNavItems = mergedNavItems.filter((item) => {
    if (item.title === "Admin") {
      const isAdmin = user?.role === "admin" || user?.role === "owner";
      return isAdmin;
    }
    if (item.title === "Configuración") {
      return !!user; // Only show if logged in
    }
    return true;
  });

  // Hover Handlers with Delay
  const handleMouseEnter = () => {
    // Clear any closing timeout
    // Add a small delay before opening to avoid "accidental" triggers when just passing by
    // or aiming for the button if it's close.
    if (hoverTimeoutRef[0]) clearTimeout(hoverTimeoutRef[0]);

    const timeout = setTimeout(() => {
      setIsHovered(true);
    }, 300); // 300ms delay before expanding
    hoverTimeoutRef[1](timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef[0]) clearTimeout(hoverTimeoutRef[0]);

    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 300); // 300ms delay before collapsing (smoothness)
    hoverTimeoutRef[1](timeout);
  };

  // Toggle submenu
  const toggleSubmenu = (title: string) => {
    if (isActuallyCollapsed) {
      setIsCollapsed(false);
      setTimeout(() => {
        setOpenSubmenus((prev) =>
          prev.includes(title)
            ? prev.filter((t) => t !== title)
            : [...prev, title],
        );
      }, 300);
    } else {
      setOpenSubmenus((prev) =>
        prev.includes(title)
          ? prev.filter((t) => t !== title)
          : [...prev, title],
      );
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isActuallyCollapsed ? 80 : 280,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed left-0 top-0 z-[60] h-screen flex flex-col text-[var(--text-secondary)]"
    >
      {/* Inner Container for Content (Handles Overflow & Background) */}
      {/* Hover Handlers moved here so the BUTTON doesn't trigger 'isHovered' */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="h-full w-full flex flex-col overflow-hidden bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] relative z-20 transition-colors duration-300"
      >
        {/* Header / Logo */}
        <div className="flex items-center h-20 px-5 border-b border-[var(--border-subtle)] shrink-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {!isActuallyCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="w-full"
              >
                <Link href="/" className="flex items-center gap-2">
                  <div className="shrink-0 w-12 flex items-center">
                    <Logo showText={false} className="scale-[0.5] origin-left -ml-4" />
                  </div>
                  <span className="text-white font-bold text-xl tracking-tight whitespace-nowrap">
                    The Mirrow
                  </span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed Logo Fallback */}
          {isActuallyCollapsed && (
            <div className="w-full flex justify-center">
              <Link href="/">
                <Logo showText={false} className="scale-[0.35] origin-center -ml-8" />
              </Link>
            </div>
          )}
        </div>

        {/* Search Bar */}
        {!isActuallyCollapsed && (
          <div className="px-5 py-4 shrink-0">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--text-primary)] transition-colors" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-medium)] focus:ring-1 focus:ring-[var(--border-medium)] transition-all"
              />
            </div>
          </div>
        )}

        {isActuallyCollapsed && (
          <div className="px-5 py-4 flex justify-center shrink-0">
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-1 custom-scrollbar">
          {filteredNavItems.map((item: NavItem) => {
            const isActive = isRouteActive(item.href);
            const isOpen = openSubmenus.includes(item.title);
            const hasSubmenu = item.items && item.items.length > 0;
            const Icon = item.icon;

            return (
              <div key={item.title}>
                {/* Main Item */}
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`
                                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                        ${isOpen ? "text-[var(--text-primary)] bg-[var(--bg-tertiary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/50"}
                                    `}
                  >
                    <div
                      className={`flex items-center gap-3 ${isActuallyCollapsed ? "mx-auto" : ""}`}
                    >
                      {Icon && (
                        <Icon
                          className={`w-5 h-5 ${isOpen ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"}`}
                        />
                      )}
                      {!isActuallyCollapsed && <span>{item.title}</span>}
                    </div>
                    {!isActuallyCollapsed && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                        ${
                                          isActive
                                            ? "bg-gradient-to-r from-[var(--bg-tertiary)] to-[var(--bg-elevated)] text-[var(--text-primary)] border-l-2 border-[var(--accent-metallic)]"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/50 border-l-2 border-transparent"
                                        }
                                        ${isActuallyCollapsed ? "justify-center" : ""}
                                    `}
                  >
                    {Icon && (
                      <Icon
                        className={`w-5 h-5 ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"}`}
                      />
                    )}
                    {!isActuallyCollapsed && <span>{item.title}</span>}
                  </Link>
                )}

                {/* Submenu */}
                <AnimatePresence>
                  {hasSubmenu && isOpen && !isActuallyCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 ml-4 pl-3 border-l border-[var(--border-subtle)] space-y-1">
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className={`
                                                        flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                                                        ${
                                                          isRouteActive(
                                                            subItem.href,
                                                          )
                                                            ? "text-[var(--text-primary)] bg-[var(--bg-tertiary)]/50 font-medium"
                                                            : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/30"
                                                        }
                                                    `}
                          >
                            {subItem.icon && (
                              <subItem.icon className="w-4 h-4 opacity-70" />
                            )}
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* User / Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] shrink-0">
          {!isActuallyCollapsed ? (
            <div className="flex items-center gap-3">
              {user?.profile_image_url ? (
                <div className="relative w-9 h-9 shrink-0">
                  <Image src={user.profile_image_url} alt="Avatar" fill className="rounded-full object-cover border border-white/10" sizes="36px" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : "GD"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {user?.full_name || "GiovanyDev"}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {user?.role || "Admin"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              {user?.profile_image_url ? (
                <div className="relative w-8 h-8 shrink-0">
                  <Image src={user.profile_image_url} alt="Avatar" fill className="rounded-full object-cover border border-white/10" sizes="32px" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Menu className="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Unified Toggle Button - "Inner Glow" Style & Centered */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all z-50 bg-indigo-600 border border-white/20 text-white hover:scale-110 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.3)]"
      >
        {isActuallyCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  );
}
