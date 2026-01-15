"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Theater,
    Music,
    Disc3,
    Mic2,
    Target,
    Mail,
    Instagram,
    Twitter,
    Youtube,
    Sparkles
} from "lucide-react";

const categories = [
    { label: "Teatro", href: "/teatro", icon: Theater },
    { label: "Músicos", href: "/musicos", icon: Music },
    { label: "DJs", href: "/djs", icon: Disc3 },
    { label: "Cantantes", href: "/cantantes", icon: Mic2 },
    { label: "Billar", href: "/billar", icon: Target },
];

const socialLinks = [
    { label: "Instagram", href: "#", icon: Instagram },
    { label: "Twitter", href: "#", icon: Twitter },
    { label: "YouTube", href: "#", icon: Youtube },
];

/**
 * Footer Component
 * Premium footer with theme-aware styling and metallic accents
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-16 border-t border-[var(--border-subtle)]">
            {/* Gradient decoration */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-metallic)] to-transparent" />

            <div className="bg-[var(--bg-secondary)] transition-colors">
                {/* Main Footer Content */}
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Brand Column */}
                        <div className="lg:col-span-1">
                            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-metallic)] to-[var(--accent-metallic-dim)] flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-[var(--bg-primary)]" />
                                </div>
                                <span className="text-xl font-bold text-[var(--text-primary)] group-hover:text-gradient-metallic transition-all">
                                    The Mirrow
                                </span>
                            </Link>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                                Tu plataforma de entretenimiento profesional.
                                Conectando artistas con audiencias desde 2024.
                            </p>
                            {/* Social Links */}
                            <div className="flex items-center gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <motion.a
                                            key={social.label}
                                            href={social.href}
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-metallic)] hover:border-[var(--accent-metallic)] transition-colors"
                                            title={social.label}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Categories Column */}
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                                Categorías
                            </h4>
                            <ul className="space-y-2">
                                {categories.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                        <li key={category.label}>
                                            <Link
                                                href={category.href}
                                                className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-metallic)] transition-colors text-sm group"
                                            >
                                                <Icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                                                {category.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                                Compañía
                            </h4>
                            <ul className="space-y-2">
                                {["Sobre nosotros", "Carreras", "Prensa", "Blog"].map((item) => (
                                    <li key={item}>
                                        <Link
                                            href="#"
                                            className="text-[var(--text-secondary)] hover:text-[var(--accent-metallic)] transition-colors text-sm"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                                Contacto
                            </h4>
                            <div className="space-y-3">
                                <a
                                    href="mailto:info@themirrow.com"
                                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-metallic)] transition-colors text-sm"
                                >
                                    <Mail className="w-4 h-4" />
                                    info@themirrow.com
                                </a>
                                <p className="text-[var(--text-muted)] text-xs">
                                    Lunes a Viernes: 9:00 - 18:00
                                </p>
                            </div>

                            {/* Newsletter mini form */}
                            <div className="mt-4">
                                <p className="text-xs text-[var(--text-secondary)] mb-2">
                                    Suscríbete a nuestras novedades
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-metallic)] transition-colors"
                                    />
                                    <button className="px-4 py-2 bg-[var(--accent-metallic)] hover:bg-[var(--accent-metallic-hover)] text-[var(--bg-primary)] text-sm font-medium rounded-lg transition-colors">
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[var(--border-subtle)]">
                    <div className="max-w-6xl mx-auto px-6 py-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-[var(--text-muted)] text-xs text-center md:text-left">
                                © {currentYear} The Mirrow. Todos los derechos reservados.
                            </p>
                            <div className="flex items-center gap-4">
                                {["Privacidad", "Términos", "Cookies"].map((item) => (
                                    <Link
                                        key={item}
                                        href="#"
                                        className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors text-xs"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
