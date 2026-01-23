"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

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
        title: "Noche Electrónica",
        description: "Siente el ritmo de los mejores DJs.",
        ctaText: "Ver Eventos",
        ctaLink: "/djs",
    },
    {
        id: 2,
        image: "/images/hero-theater.png",
        title: "Magia del Teatro",
        description: "Obras que te dejarán sin aliento.",
        ctaText: "Cartelera",
        ctaLink: "/teatro",
    },
    {
        id: 3,
        image: "/images/hero-music.png",
        title: "Conciertos en Vivo",
        description: "Tus artistas favoritos, cerca de ti.",
        ctaText: "Entradas",
        ctaLink: "/musicos",
    }
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const router = useRouter();

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 1.2,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const handleSlideClick = () => {
        router.push(slides[current].ctaLink);
    };

    return (
        <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px] overflow-hidden rounded-2xl shadow-2xl group border border-[var(--border-subtle)]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.4 },
                        scale: { duration: 0.6 }
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
                        } else if (Math.abs(offset.x) < 5) {
                            // If the drag was very small, treat it as a click
                            handleSlideClick();
                        }
                    }}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                >
                    {/* Background Image */}
                    <Image
                        src={slides[current].image}
                        alt={slides[current].title}
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                        <div className="max-w-2xl space-y-4">
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none drop-shadow-xl"
                            >
                                {slides[current].title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-lg md:text-xl text-gray-200 font-medium max-w-lg drop-shadow-md"
                            >
                                {slides[current].description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="pt-4"
                            >
                                <button className="px-8 py-3.5 bg-white text-black hover:bg-[var(--accent-metallic)] hover:text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                                    {slides[current].ctaText}
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20">
                <button
                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                    className="w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group/btn"
                >
                    <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                    className="w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group/btn"
                >
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Pagination Dots (Bottom Center) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDirection(index > current ? 1 : -1);
                            setCurrent(index);
                        }}
                        className={`
                            relative rounded-full transition-all duration-500 ease-out
                            ${index === current ? "w-3 bg-[var(--accent-metallic)] shadow-[0_0_10px_var(--accent-metallic)] scale-125" : "w-1.5 bg-white/50 hover:bg-white"}
                            h-3
                        `}
                    />
                ))}
            </div>
        </div>
    );
}
