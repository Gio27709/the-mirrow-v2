"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Theater, Music, Disc3, Mic2, Target } from "lucide-react";

// Reuse categories from page.tsx but with image placeholders
const categories = [
    {
        id: "teatro",
        title: "Teatro",
        icon: Theater,
        href: "/teatro",
        image: "/images/hero-theater.png",
        gradient: "from-zinc-400 to-zinc-600",
    },
    {
        id: "musicos",
        title: "Músicos",
        icon: Music,
        href: "/musicos",
        image: "/images/hero-music.png",
        gradient: "from-slate-400 to-slate-600",
    },
    {
        id: "djs",
        title: "DJs",
        icon: Disc3,
        href: "/djs",
        image: "/images/hero-dj.png",
        gradient: "from-neutral-400 to-neutral-600",
    },
    {
        id: "cantantes",
        title: "Cantantes",
        icon: Mic2,
        href: "/cantantes",
        image: "/images/hero-music.png",
        gradient: "from-stone-400 to-stone-600",
    },
    {
        id: "billar",
        title: "Billar",
        icon: Target,
        href: "/billar",
        image: "/images/hero-dj.png",
        gradient: "from-gray-400 to-gray-600",
    },
    {
        id: "eventos",
        title: "Eventos",
        icon: Theater,
        href: "/eventos",
        image: "/images/hero-theater.png",
        gradient: "from-zinc-400 to-zinc-600",
    },
];

export function CategoryCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, []);

    return (
        <div className="w-full pb-8 pt-0 space-y-2">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    Explora por Categorías
                </h2>
                {/* Visual indicator of interactivity */}
                <span className="text-sm text-[var(--text-secondary)] hidden md:block opacity-60">
                    Arrastra para explorar
                </span>
            </div>

            <motion.div
                ref={carouselRef}
                className="cursor-grab active:cursor-grabbing overflow-hidden px-4 py-2"
            >
                <motion.div
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    whileTap={{ cursor: "grabbing" }}
                    className="flex gap-6"
                >
                    {categories.map((cat, index) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={`${cat.id}-${index}`}
                                href={cat.href}
                                className="flex-shrink-0 group relative"
                                draggable={false}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex flex-col items-center gap-4 w-40"
                                >
                                    {/* Circular Image Container */}
                                    <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-2xl border-2 border-transparent group-hover:border-[var(--accent-metallic)] transition-all duration-300 pointer-events-none">
                                        <Image
                                            src={cat.image}
                                            alt={cat.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-50"
                                        />

                                        {/* Icon Overlay - Centered and Larger */}
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <div className="p-5 bg-black/30 backdrop-blur-sm rounded-full group-hover:bg-[var(--accent-metallic)] group-hover:text-white transition-all duration-300 shadow-xl border border-white/10">
                                                <Icon className="w-12 h-12 text-white/90" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <span className="text-base font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors text-center select-none uppercase tracking-wider">
                                        {cat.title}
                                    </span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </motion.div>
            </motion.div>
        </div>
    );
}
