"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Bell, X, User, LogOut, ChevronDown } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

/**
 * Floating Navbar Component
 * Sticky glassmorphism pill design with search, theme switcher, and auth buttons
 */
export function FloatingNavbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

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
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-4 z-50 w-full px-4 flex justify-center" // Centered wrapper
    >
      <nav className="w-full max-w-7xl flex items-center justify-between gap-4 px-6 py-3 bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-full shadow-lg shadow-[var(--shadow-color)] transition-colors">
        {/* Left Section: Logo + Navigation Links */}
        <div className="flex items-center gap-8 shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group outline-none">
            <Logo className="scale-90 sm:scale-100 origin-left" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
            <Link
              href="/about"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/company"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Compañía
            </Link>
            <Link
              href="/contact"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-1 max-w-md hidden lg:block">
          <motion.div
            animate={{
              scale: isSearchFocused ? 1.02 : 1,
              boxShadow: isSearchFocused
                ? "0 0 20px var(--accent-metallic-glow)"
                : "none",
            }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar artistas, eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-10 py-2 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-full text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-metallic)] focus:bg-[var(--bg-tertiary)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center hover:bg-[var(--accent-metallic)]/20 transition-colors"
              >
                <X className="w-3 h-3 text-[var(--text-secondary)]" />
              </button>
            )}
          </motion.div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Notifications (Keep for existing functionality) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--accent-metallic)]/30 transition-all"
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[var(--bg-elevated)]" />
          </motion.button>

          {/* Divider */}
          <div className="w-px h-6 bg-[var(--border-subtle)] mx-1 hidden md:block" />

          {/* Auth Buttons or User Menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-elevated)] hover:border-[var(--accent-metallic)]/50 transition-all shadow-sm"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--accent-metallic)] shadow-[0_0_10px_var(--accent-metallic-glow)]">
                  {user.profile_image_url && !imageError ? (
                    <Image
                      key={user.profile_image_url}
                      src={`${user.profile_image_url}?t=${new Date().getTime()}`}
                      alt={user.email}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-primary)] font-bold text-sm">
                        {user.full_name
                          ? user.full_name[0].toUpperCase()
                          : user.username
                            ? user.username[0].toUpperCase()
                            : user.email[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <ChevronDown
                  size={14}
                  className={`text-[var(--text-secondary)] transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`}
                />
              </motion.button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden py-1 z-50 backdrop-blur-xl"
                >
                  <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {user.username || "Usuario"}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link href="/settings" onClick={() => setShowUserMenu(false)}>
                    <div className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                      <User className="w-4 h-4" />
                      <span>Mi Perfil</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-metallic)] transition-colors"
                >
                  Iniciar Sesión
                </motion.button>
              </Link>

              <Link href="/register">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px var(--accent-metallic-glow)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all border border-white/10"
                >
                  Registrarse
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
