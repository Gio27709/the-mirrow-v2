import { Home } from "lucide-react";
import Link from "next/link";
import { GoBackButton } from "@/components/ui/GoBackButton";

/**
 * Custom 404 Page with Theme Support
 * This page respects the current theme settings
 */
export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            {/* 404 Number */}
            <h1 className="text-8xl md:text-9xl font-bold text-gradient-metallic mb-4">
                404
            </h1>

            {/* Message */}
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-2">
                Página no encontrada
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md">
                Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-metallic)] hover:bg-[var(--accent-metallic-hover)] text-[var(--bg-primary)] font-semibold rounded-xl transition-all glow-metallic"
                >
                    <Home className="w-5 h-5" />
                    Ir al inicio
                </Link>
                <GoBackButton />
            </div>
        </div>
    );
}

