"use client";

import { Mail, Phone } from "lucide-react";

export function TopContactBar() {
    return (
        <div className="hidden md:flex items-center justify-between w-full h-10 px-4 md:px-6 lg:px-8 bg-indigo-950 text-indigo-100 text-xs font-medium z-50 relative border-b border-indigo-900/50">
            <div className="flex items-center gap-6">
                <a href="mailto:info@themirrow.com.es" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    <span>info@themirrow.com.es</span>
                </a>
                <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+58 414-1756667</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="opacity-70">Professional Entertainment Platform</span>
            </div>
        </div>
    );
}
