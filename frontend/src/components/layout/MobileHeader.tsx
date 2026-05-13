"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Search } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

/**
 * Mobile Header Component
 * Displays logo, search bar, theme switcher, and auth controls on mobile devices
 */
export function MobileHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="bg-[var(--bg-secondary)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 py-3 transition-colors relative">
        {/* Main Header Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Logo className="scale-[0.85] origin-left" />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isSearchOpen
                  ? "bg-[var(--accent-metallic)] text-[var(--bg-primary)]"
                  : "bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
              }`}
              title="Buscar"
            >
              {isSearchOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </motion.button>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            <div className="w-px h-6 bg-[var(--border-subtle)] mx-1" />

            {/* User / Auth Controls */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--accent-metallic)] shadow-sm"
                >
                  {user.profile_image_url ? (
                    <Image
                      src={`${user.profile_image_url}?t=${new Date().getTime()}`}
                      alt={user.username || "User"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {user.username?.[0]?.toUpperCase() ||
                        user.email[0].toUpperCase()}
                    </div>
                  )}
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl shadow-xl overflow-hidden py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {user.username || "Usuario"}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link href="/settings">
                        <div
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Mi Perfil</span>
                        </div>
                      </Link>
                      {/* Admin Link if applicable */}
                      {(user.role === "admin" || user.role === "owner") && (
                        <Link href="/admin">
                          <button
                            onClick={() => setShowUserMenu(false)}
                            className="w-full text-left px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] flex items-center gap-2 transition-colors"
                          >
                            <Menu size={16} />
                            Admin Panel
                          </button>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 flex items-center gap-2 transition-colors border-t border-[var(--border-subtle)]"
                      >
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)]"
                >
                  <User className="w-4 h-4" />
                </motion.button>
              </Link>
            )}
          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 pb-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-metallic)] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center hover:bg-[var(--accent-metallic)]/20 transition-colors"
                    >
                      <X className="w-3 h-3 text-[var(--text-secondary)]" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
