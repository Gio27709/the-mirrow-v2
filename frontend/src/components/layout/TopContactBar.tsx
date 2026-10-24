"use client";

import { Mail, MessageCircle } from "lucide-react";
import { SITE, whatsappUrl, mailtoUrl } from "@/lib/site";

export function TopContactBar() {
    return (
        <div className="hidden md:flex items-center justify-between w-full h-10 px-4 md:px-6 lg:px-8 bg-indigo-950 text-indigo-100 text-xs font-medium z-50 relative border-b border-indigo-900/50">
            <div className="flex items-center gap-6">
                <a href={mailtoUrl()} className="flex items-center gap-2 hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{SITE.email}</span>
                </a>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{SITE.phone}</span>
                </a>
            </div>

            <div className="flex items-center gap-4">
                <span className="opacity-70">Plataforma profesional de entretenimiento</span>
            </div>
        </div>
    );
}
