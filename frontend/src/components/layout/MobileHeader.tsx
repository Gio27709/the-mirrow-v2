"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Menu } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

/**
 * Mobile Header Component
 * Displays logo, search bar, and theme switcher on mobile devices
 */
export function MobileHeader() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sticky top-0 z-50 w-full"
        >
            <div className="bg-[var(--bg-secondary)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 py-3 transition-colors">
                {/* Main Header Row */}
                <div className="flex items-center justify-between gap-3">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="relative w-[100px] h-[28px]">
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
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search Toggle Button */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSearchOpen
                                    ? "bg-[var(--accent-metallic)] text-[var(--bg-primary)]"
                                    : "bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                                }`}
                            title="Buscar"
                        >
                            {isSearchOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                        </motion.button>

                        {/* Theme Switcher */}
                        <ThemeSwitcher />
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
                            <div className="pt-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Buscar artistas, eventos..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="w-full pl-10 pr-10 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-metallic)] transition-colors"
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
