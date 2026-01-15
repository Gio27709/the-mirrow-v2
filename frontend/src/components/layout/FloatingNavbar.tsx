"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, UserPlus, LogIn, X } from "lucide-react";
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
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl"
        >
            <nav className="flex items-center justify-between gap-4 px-4 py-3 bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-full shadow-lg shadow-[var(--shadow-color)] transition-colors">
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
                                // Fallback to text if image fails
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                    {/* Fallback text logo */}
                    <span className="sr-only sm:not-sr-only text-[var(--text-primary)] font-semibold tracking-tight group-hover:text-[var(--accent-metallic)] transition-colors">
                        The Mirrow
                    </span>
                </Link>

                {/* Global Search */}
                <div className="flex-1 max-w-md">
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

                {/* Right section: Theme + Auth */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Theme Switcher */}
                    <ThemeSwitcher />

                    {/* Auth Buttons */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--accent-metallic)]/30 transition-all"
                        title="Registrarse"
                    >
                        <UserPlus className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--accent-metallic-glow)" }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-[var(--accent-metallic)]/20 border border-[var(--accent-metallic)]/40 flex items-center justify-center text-[var(--accent-metallic)] hover:bg-[var(--accent-metallic)] hover:text-[var(--bg-primary)] transition-all"
                        title="Iniciar Sesión"
                    >
                        <LogIn className="w-4 h-4" />
                    </motion.button>
                </div>
            </nav>
        </motion.header>
    );
}
