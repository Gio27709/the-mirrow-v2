"use client";

import { ArrowLeft } from "lucide-react";

export function GoBackButton() {
    return (
        <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 glass-card hover:border-[var(--accent-metallic)] text-[var(--text-primary)] font-semibold rounded-xl transition-all"
        >
            <ArrowLeft className="w-5 h-5" />
            Volver atrás
        </button>
    );
}
