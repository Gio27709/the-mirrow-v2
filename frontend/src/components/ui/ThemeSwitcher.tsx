"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Monitor, ChevronDown } from "lucide-react";

interface ThemeOption {
    id: string;
    label: string;
    icon: typeof Moon;
}

const themes: ThemeOption[] = [
    { id: "dark", label: "Dark", icon: Moon },
    { id: "light", label: "Light", icon: Sun },
    { id: "grey", label: "Grey", icon: Monitor },
];

/**
 * Theme Switcher Component
 * Dropdown for switching between Dark, Light, and Grey themes
 */
export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-[var(--glass-bg)] animate-pulse" />
        );
    }

    const currentTheme = themes.find((t) => t.id === theme) || themes[0];
    const CurrentIcon = currentTheme.icon;

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-metallic)] transition-all"
                title="Change theme"
            >
                <CurrentIcon className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:block">{currentTheme.label}</span>
                <ChevronDown
                    className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 z-50 w-36 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-lg shadow-[var(--shadow-color)]"
                        >
                            {themes.map((themeOption) => {
                                const Icon = themeOption.icon;
                                const isActive = theme === themeOption.id;

                                return (
                                    <button
                                        key={themeOption.id}
                                        onClick={() => {
                                            setTheme(themeOption.id);
                                            setIsOpen(false);
                                        }}
                                        className={`
                      w-full flex items-center gap-3 px-4 py-2.5
                      text-sm transition-colors
                      ${isActive
                                                ? "text-[var(--accent-metallic)] bg-[var(--accent-metallic)]/10"
                                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                                            }
                    `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{themeOption.label}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-metallic)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
