"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Slide {
    id: number;
    image: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
}

const slides: Slide[] = [
    {
        id: 1,
        image: "/images/hero-dj.png",
        title: "Vive la Noche Electrónica",
        description: "Los mejores DJs y eventos exclusivos en un solo lugar. Siente el ritmo.",
        ctaText: "Ver Eventos",
        ctaLink: "/djs",
    },
    {
        id: 2,
        image: "/images/hero-theater.png",
        title: "La Magia del Teatro",
        description: "Obras dramáticas, comedias y espectáculos que te dejarán sin aliento.",
        ctaText: "Cartelera",
        ctaLink: "/teatro",
    },
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl group">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Image Background */}
                    <div className="relative w-full h-full">
                        <Image
                            src={slides[current].image}
                            alt={slides[current].title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Overlay Gradient (Sony style: dark text area) */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    </div>

                    {/* Text Content */}
                    <div className="absolute inset-0 flex items-center p-8 md:p-16">
                        <div className="max-w-xl space-y-6">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight"
                            >
                                {slides[current].title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-lg text-gray-200"
                            >
                                {slides[current].description}
                            </motion.p>
                            <Link href={slides[current].ctaLink}>
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="px-8 py-3 bg-[var(--accent-metallic)] hover:bg-[var(--accent-metallic-hover)] text-[var(--bg-primary)] font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_20px_var(--accent-metallic-glow)] cursor-pointer"
                                >
                                    {slides[current].ctaText}
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                className="absolute top-1/2 left-4 -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                onClick={() => paginate(-1)}
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                className="absolute top-1/2 right-4 -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                onClick={() => paginate(1)}
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > current ? 1 : -1);
                            setCurrent(index);
                        }}
                        className={`h-3 rounded-full transition-all cursor-pointer ${index === current
                            ? "bg-[var(--accent-metallic)] w-8"
                            : "bg-white/50 w-3 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
