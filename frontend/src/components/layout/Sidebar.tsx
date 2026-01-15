"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsLeft, Menu } from "lucide-react";
import { useNavigation } from "@/lib/navigation";

/**
 * Animated Sidebar Component
 * Slides in from left with framer-motion
 * Collapsible with frosted glass effect on active items
 * Uses metallic accent colors
 */
export function Sidebar() {
    const { routes, isRouteActive } = useNavigation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <motion.aside
            initial={{ x: -240, opacity: 0 }}
            animate={{
                x: 0,
                opacity: 1,
                width: isCollapsed ? 72 : 240
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed left-0 top-0 z-40 h-screen bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-r border-[var(--border-subtle)] flex flex-col overflow-hidden transition-colors"
        >
            {/* Header with logo and collapse toggle */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border-subtle)]">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link href="/" className="flex items-center gap-3 group">
                                {/* Logo Image */}
                                <div className="relative w-[140px] h-[40px]">
                                    <Image
                                        src="/logo-mirrow.png"
                                        alt="The Mirrow"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Collapsed state: Show icon only */}
                {isCollapsed && (
                    <Link href="/" className="mx-auto">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-metallic)] to-[var(--accent-metallic-hover)] flex items-center justify-center shadow-lg shadow-[var(--accent-metallic-glow)]">
                            <span className="text-[var(--bg-primary)] font-bold">M</span>
                        </div>
                    </Link>
                )}

                {/* Collapse Button */}
                {!isCollapsed && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-9 h-9 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
                        title="Colapsar"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </motion.button>
                )}
            </div>

            {/* Expand button when collapsed */}
            {isCollapsed && (
                <div className="px-3 py-3 border-b border-[var(--border-subtle)]">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsCollapsed(false)}
                        className="w-full h-9 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
                        title="Expandir"
                    >
                        <Menu className="w-4 h-4" />
                    </motion.button>
                </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto overflow-x-hidden">
                <ul className="space-y-2">
                    {routes.map((route, index) => {
                        const Icon = route.icon;
                        const isActive = isRouteActive(route);

                        return (
                            <motion.li
                                key={route.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <Link
                                    href={route.href}
                                    className={`
                    relative flex items-center gap-3 px-3 py-3.5 rounded-xl
                    transition-all duration-300 ease-out
                    group overflow-hidden
                    ${isCollapsed ? "justify-center" : ""}
                    ${isActive
                                            ? "bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)] shadow-lg"
                                            : "hover:bg-[var(--bg-tertiary)] border border-transparent"
                                        }
                  `}
                                    aria-current={isActive ? "page" : undefined}
                                    title={isCollapsed ? route.label : undefined}
                                >
                                    {/* Active glow effect */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeGlow"
                                            className="absolute inset-0 bg-gradient-to-r from-[var(--accent-metallic)]/20 via-transparent to-transparent rounded-xl"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}

                                    {/* Icon */}
                                    <div
                                        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all ${isActive
                                            ? "bg-[var(--accent-metallic)] text-[var(--bg-primary)] shadow-lg shadow-[var(--accent-metallic-glow)]"
                                            : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                                    </div>

                                    {/* Label */}
                                    <AnimatePresence mode="wait">
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.2 } }}
                                                exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
                                                className={`relative z-10 text-sm font-medium whitespace-nowrap ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                                                    }`}
                                            >
                                                {route.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--accent-metallic)] rounded-r-full"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            </motion.li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <AnimatePresence mode="wait">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-4 py-4 border-t border-[var(--border-subtle)]"
                    >
                        <p className="text-xs text-[var(--text-muted)] text-center">
                            © 2026 The Mirrow
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.aside>
    );
}
