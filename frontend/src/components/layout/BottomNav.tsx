"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useNavigation } from "@/lib/navigation";

/**
 * Mobile Bottom Navigation Bar Component
 * Glassmorphism design with metallic accents
 * Optimized for thumb navigation
 */
export function BottomNav() {
    const { routes, isRouteActive } = useNavigation();

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2"
        >
            <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-lg shadow-[var(--shadow-color)] overflow-hidden transition-colors">
                <ul className="flex items-center justify-around h-16 px-2">
                    {routes.map((route) => {
                        const Icon = route.icon;
                        const isActive = isRouteActive(route);

                        return (
                            <li key={route.id} className="flex-1">
                                <Link
                                    href={route.href}
                                    className="relative flex flex-col items-center justify-center gap-1 py-2 mx-1 rounded-xl transition-all duration-200"
                                    aria-current={isActive ? "page" : undefined}
                                    aria-label={route.description}
                                >
                                    {/* Active background glow */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobileActiveGlow"
                                            className="absolute inset-0 bg-[var(--accent-metallic)]/10 rounded-xl"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}

                                    {/* Icon container */}
                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-xl transition-all ${isActive
                                                ? "bg-[var(--accent-metallic)] text-[var(--bg-primary)] shadow-lg shadow-[var(--accent-metallic-glow)]"
                                                : "text-[var(--text-secondary)]"
                                            }`}
                                    >
                                        <Icon
                                            className="w-5 h-5"
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                    </motion.div>

                                    {/* Label */}
                                    <span
                                        className={`relative z-10 text-[10px] font-medium transition-colors ${isActive ? "text-[var(--accent-metallic)]" : "text-[var(--text-secondary)]"
                                            }`}
                                    >
                                        {route.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Safe area spacer for iOS */}
            <div className="h-[env(safe-area-inset-bottom)]" />
        </motion.nav>
    );
}
