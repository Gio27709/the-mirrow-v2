"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Sparkles, Star, Target, ShieldCheck, Ticket, ChevronDown, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-purple-500 selection:text-white overflow-clip pb-32">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/40 transition-all text-white shadow-lg"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 z-0"
        >
          {/* Glass Gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Nuestro Manifiesto
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
              The Mirrow <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-orange-400">
                es un puente.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-light mt-8">
              Un espacio donde las ideas dejan de ser intención y se convierten en obra, en realidad.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[var(--text-muted)]"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Descubre Más</span>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
            <ChevronDown className="w-4 h-4" />
          </div>
        </motion.div>
      </section>

      {/* Manifesto Content Redesigned */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Large Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <Quote className="w-16 h-16 text-purple-500/50" />
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Creamos con <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                sentido.
              </span>
            </h2>
          </motion.div>

          {/* Right: Glassmorphism Cards */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-all" />
              <p className="text-xl md:text-2xl text-[var(--text-primary)] font-light leading-relaxed relative z-10">
                Conectamos artistas con el proceso de materializar sus proyectos: desde la visión inicial hasta su forma final.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-8 rounded-[2rem] bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-500/20 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] group-hover:bg-orange-500/20 transition-all" />
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-light leading-relaxed relative z-10">
                Creemos en la colaboración, en la autenticidad y en el arte como lenguaje universal. No producimos por producir. <strong className="text-white">Hacemos que suceda.</strong>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Un ecosistema integral</h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            The Mirrow no es solo una plataforma, es un universo de entretenimiento y producción diseñado para artistas y creadores.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative group rounded-[2rem] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-10 hover:border-purple-500/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] group-hover:bg-purple-500/20 transition-all" />
            <Star className="w-12 h-12 text-purple-400 mb-8" />
            <h3 className="text-2xl font-bold text-white mb-4">Representación y Booking</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Contamos con un catálogo exclusivo de artistas, músicos, DJs, cantantes, artes escénicas, danzas contemporáneas y bailes exóticos.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative group rounded-[2rem] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-10 hover:border-pink-500/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[50px] group-hover:bg-pink-500/20 transition-all" />
            <Target className="w-12 h-12 text-pink-400 mb-8" />
            <h3 className="text-2xl font-bold text-white mb-4">Producción de Eventos</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Llevamos tu visión a la realidad. Organización integral de eventos públicos y privados, encargándonos de toda la logística.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative group rounded-[2rem] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-10 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-all" />
            <Ticket className="w-12 h-12 text-blue-400 mb-8" />
            <h3 className="text-2xl font-bold text-white mb-4">Ticketing y Taquilla</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Si organizas un evento con nosotros, puedes vender tus entradas directamente en nuestra plataforma web. Seguro, rápido y digital.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-20 max-w-4xl mx-auto px-6 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-16 rounded-[3rem] bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-primary)] border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 relative z-10">
            ¿Listo para cruzar el puente?
          </h2>
          <Link href="/contact">
            <button className="relative z-10 bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Únete a The Mirrow
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
