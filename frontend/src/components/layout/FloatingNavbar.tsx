"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Bell, X } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

/**
 * Floating Navbar Component
 * Sticky glassmorphism pill design with search, theme switcher, and auth buttons
 */
export function FloatingNavbar() {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-4 z-40 w-full px-4 flex justify-center" // Centered wrapper
        >
            <nav className="w-full max-w-7xl flex items-center justify-between gap-4 px-6 py-3 bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-full shadow-lg shadow-[var(--shadow-color)] transition-colors">

                {/* Left Section: Logo + Navigation Links */}
                <div className="flex items-center gap-8 shrink-0">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0 group">
                        <div className="relative w-[100px] h-[32px]">
                            <Image
                                src="/logo-mirrow.png"
                                alt="The Mirrow"
                                fill
                                className="object-contain"
                                priority
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                        <span className="sr-only sm:not-sr-only text-[var(--text-primary)] font-semibold tracking-tight group-hover:text-[var(--accent-metallic)] transition-colors">
                            The Mirrow
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
                        <Link href="/about" className="hover:text-[var(--text-primary)] transition-colors">Sobre Nosotros</Link>
                        <Link href="/company" className="hover:text-[var(--text-primary)] transition-colors">Compañía</Link>
                        <Link href="/contact" className="hover:text-[var(--text-primary)] transition-colors">Contacto</Link>
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

                    {/* Auth Buttons */}
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
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--accent-metallic-glow)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all border border-white/10"
                            >
                                Registrarse
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </nav>
        </motion.header>
    );
}
