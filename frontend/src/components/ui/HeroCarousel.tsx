"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { canOptimize } from "@/lib/images";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    image: "https://cicvwajzdtgvfbsvuttx.supabase.co/storage/v1/object/public/images/static/hero-dj.png",
    title: "Únete a la Lista de Espera",
    description: "Asegura tu lugar para los eventos más exclusivos del 2026.",
    ctaText: "Regístrate Ahora",
    ctaLink: "/registro",
  },
  {
    id: 2,
    image: "https://cicvwajzdtgvfbsvuttx.supabase.co/storage/v1/object/public/images/static/hero-theater.png",
    title: "Magia del Teatro",
    description: "Obras que te dejarán sin aliento.",
    ctaText: "Cartelera",
    ctaLink: "/eventos",
  },
  {
    id: 3,
    image: "https://cicvwajzdtgvfbsvuttx.supabase.co/storage/v1/object/public/images/static/hero-dj.png",
    title: "Conciertos en Vivo",
    description: "Tus artistas favoritos, cerca de ti.",
    ctaText: "Entradas",
    ctaLink: "/musicos",
  },
];

export function HeroCarousel({ slides: slidesProp }: { slides?: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const slides = slidesProp && slidesProp.length > 0 ? slidesProp : defaultSlides;
  const router = useRouter();

  // Keep the index valid when the slides arrive from the API
  useEffect(() => {
    setCurrent((c) => (c < slides.length ? c : 0));
  }, [slides.length]);

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
      if (slides.length > 0) {
        paginate(1);
      }
    }, 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleSlideClick = () => {
    router.push(slides[current].ctaLink);
  };

  return (
    <div className="relative w-full h-full min-h-[240px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden rounded-xl md:rounded-2xl shadow-2xl group border border-[var(--border-subtle)]">
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
            scale: { duration: 0.6 },
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
          onTap={handleSlideClick}
          className="absolute inset-0 w-full h-full cursor-pointer"
        >
          {/* Background Image or Premium Fallback */}
          {!failedImages.includes(slides[current].id) ? (
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              className="object-cover"
              priority
              onError={() =>
                setFailedImages((prev) => [...prev, slides[current].id])
              }
              sizes="(min-width: 1024px) 66vw, 100vw"
              unoptimized={!canOptimize(slides[current].image)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-tertiary)] flex items-center justify-center">
              <Zap className="w-32 h-32 text-white/5 opacity-20 scale-150 transform rotate-12" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="max-w-2xl space-y-2 md:space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-none drop-shadow-xl"
              >
                {slides[current].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 font-medium max-w-lg drop-shadow-md line-clamp-2 md:line-clamp-none"
              >
                {slides[current].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="pt-1 md:pt-4"
              >
                <Link
                  href={slides[current].ctaLink}
                  className="inline-flex px-5 py-2.5 md:px-8 md:py-3.5 bg-white text-black hover:bg-[var(--accent-metallic)] hover:text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg items-center gap-2 text-sm md:text-base"
                >
                  {slides[current].ctaText}
                  <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls - Hidden on mobile, swipe is enough */}
      <div className="hidden md:flex absolute bottom-8 right-8 items-center gap-4 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            paginate(-1);
          }}
          className="w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group/btn"
        >
          <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            paginate(1);
          }}
          className="w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group/btn"
        >
          <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Pagination Dots (Bottom Center) */}
      <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3 p-1.5 md:p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
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
