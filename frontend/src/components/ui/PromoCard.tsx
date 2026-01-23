"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PromoCardProps {
    title: string;
    subtitle: string;
    image: string;
    ctaText: string;
    ctaLink: string;
    delay?: number;
    gradient?: string;
}

export function PromoCard({
    title,
    subtitle,
    image,
    ctaText,
    ctaLink,
    delay = 0,
    gradient = "from-purple-900/80 to-blue-900/80" // Default elegant gradient
}: PromoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            className="group relative h-full min-h-[240px] w-full overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-lg"
        >
            {/* Background Image */}
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 transition-opacity duration-300 group-hover:opacity-95`} />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                        {title}
                    </h3>
                    <p className="text-white/80 text-sm font-medium line-clamp-2">
                        {subtitle}
                    </p>
                </div>

                <div className="flex justify-end">
                    <Link href={ctaLink}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-semibold transition-all group-hover:translate-x-1">
                            {ctaText}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
