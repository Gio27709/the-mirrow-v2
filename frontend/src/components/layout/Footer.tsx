"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "@/context/CategoryContext";
import * as Icons from "lucide-react";
import {
    Mail,
    Instagram,
    MessageCircle,
    Layers,
    Loader2,
    Check,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { api } from "@/lib/api";
import { SITE, whatsappUrl, mailtoUrl } from "@/lib/site";

const socialLinks = [
    { label: `Instagram ${SITE.instagram.handle}`, href: SITE.instagram.url, icon: Instagram },
    { label: "WhatsApp", href: whatsappUrl(), icon: MessageCircle },
];

const companyLinks = [
    { label: "Sobre nosotros", href: "/about" },
    { label: "La compañía", href: "/company" },
    { label: "Carreras", href: "/carreras" },
    { label: "Prensa", href: "/prensa" },
    { label: "Blog", href: "/blog" },
    { label: "Ayuda", href: "/help" },
];

const legalLinks = [
    { label: "Privacidad", href: "/privacidad" },
    { label: "Términos", href: "/terminos" },
    { label: "Cookies", href: "/cookies" },
];

function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setError("");
        try {
            await api.post("/leads", {
                full_name: "Suscriptor newsletter",
                email,
                inquiry_type: "newsletter",
                source: "footer",
            });
            setStatus("done");
            setEmail("");
        } catch (err) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "No se pudo completar la suscripción");
        }
    };

    if (status === "done") {
        return (
            <p className="flex items-center gap-2 text-sm text-emerald-400">
                <Check className="w-4 h-4" /> ¡Listo! Te avisaremos de las novedades.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    aria-label="Tu correo electrónico"
                    className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-metallic)] transition-colors"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Suscribirme"}
                </button>
            </div>
            {status === "error" && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </form>
    );
}

/**
 * Footer Component
 * Premium footer with theme-aware styling and metallic accents
 */
export function Footer() {
    const currentYear = new Date().getFullYear();
    const { categories } = useCategories();

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
                            <Link href="/" className="inline-flex mb-4" aria-label="The Mirrow - Inicio">
                                <Logo className="w-[140px]! h-[48px]!" />
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
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
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
                                {categories.slice(0, 6).map((category) => {
                                    // @ts-expect-error: Dynamic icon resolution
                                    const Icon = Icons[category.icon_name] || Layers;
                                    return (
                                        <li key={category.id}>
                                            <Link
                                                href={`/${category.slug}`}
                                                className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-metallic)] transition-colors text-sm group"
                                            >
                                                <Icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                                                {category.name}
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
                                {companyLinks.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-[var(--text-secondary)] hover:text-[var(--accent-metallic)] transition-colors text-sm"
                                        >
                                            {item.label}
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
                                    href={mailtoUrl()}
                                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-metallic)] transition-colors text-sm"
                                >
                                    <Mail className="w-4 h-4" />
                                    {SITE.email}
                                </a>
                                <a
                                    href={whatsappUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-emerald-400 transition-colors text-sm"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {SITE.phone}
                                </a>
                                <p className="text-[var(--text-muted)] text-xs">
                                    {SITE.hours}
                                </p>
                            </div>

                            {/* Newsletter mini form */}
                            <div className="mt-4">
                                <p className="text-xs text-[var(--text-secondary)] mb-2">
                                    Suscríbete a nuestras novedades
                                </p>
                                <NewsletterForm />
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
                                {legalLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors text-xs"
                                    >
                                        {item.label}
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
