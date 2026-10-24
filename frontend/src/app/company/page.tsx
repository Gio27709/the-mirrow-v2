"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Compass,
  Eye,
  Handshake,
  HeartHandshake,
  Mic2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { SITE } from "@/lib/site";

const values = [
  {
    icon: HeartHandshake,
    title: "Colaboración",
    text: "Trabajamos con los artistas, no solo para ellos. Cada proyecto se construye entre todos.",
  },
  {
    icon: Sparkles,
    title: "Autenticidad",
    text: "Defendemos propuestas con identidad propia y respetamos la visión de cada artista.",
  },
  {
    icon: ShieldCheck,
    title: "Confianza",
    text: "Hablamos claro: condiciones por escrito, sin cobros sorpresa y con un trato cercano.",
  },
  {
    icon: CalendarCheck,
    title: "Cuidado por el detalle",
    text: "Del primer correo al último acorde, nos ocupamos de que todo salga como se planeó.",
  },
];

const services = [
  {
    icon: CalendarCheck,
    title: "Organización de eventos",
    text: "Diseñamos y organizamos eventos propios y para terceros, públicos o privados, encargándonos de la logística de principio a fin.",
  },
  {
    icon: Mic2,
    title: "Booking de artistas",
    text: "DJs, músicos, cantantes, artes escénicas y danza. Te ayudamos a encontrar el artista adecuado y gestionamos la contratación.",
  },
  {
    icon: SlidersHorizontal,
    title: "Producción",
    text: "Sonido, iluminación, escenografía y coordinación técnica para que cada actuación luzca como merece.",
  },
];

const highlights = [
  "Un catálogo de artistas que crece con cada nueva incorporación.",
  "Eventos propios con reserva de entradas directamente en la plataforma.",
  "Un único interlocutor para el artista, la producción y la logística.",
  "Atención directa por email y WhatsApp, sin intermediarios.",
];

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-clip">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-16 md:space-y-24">
        {/* Intro */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <Building2 className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[var(--text-secondary)]">
              Sobre la compañía
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Hacemos que el talento{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-orange-400">
              llegue al escenario.
            </span>
          </h1>
          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
            {SITE.name} es una compañía de entretenimiento con base en {SITE.country}. Organizamos eventos, representamos y contratamos artistas y producimos experiencias en directo. Si quieres conocer el porqué de todo esto, lee nuestro{" "}
            <Link href="/about" className="text-[var(--accent-primary)] underline underline-offset-2 hover:text-[var(--accent-hover)]">
              manifiesto
            </Link>
            .
          </p>
        </motion.section>

        {/* Mission & vision */}
        <section className="grid md:grid-cols-2 gap-4 md:gap-6">
          {[
            {
              icon: Compass,
              label: "Misión",
              text: "Conectar a artistas con las personas y los espacios que quieren contar con ellos, y acompañar cada proyecto desde la idea hasta el escenario.",
            },
            {
              icon: Eye,
              label: "Visión",
              text: "Ser el punto de encuentro de referencia para el talento escénico y musical, donde contratar a un artista o vivir un evento sea sencillo, cercano y fiable.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 md:p-10"
            >
              <item.icon className="w-8 h-8 text-[var(--accent-primary)] mb-4" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">{item.label}</h2>
              <p className="text-lg md:text-2xl font-medium leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </section>

        {/* Values */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-4xl font-bold">Nuestros valores</h2>
            <p className="text-[var(--text-secondary)]">Lo que guía cada decisión que tomamos.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-6"
              >
                <div className="w-11 h-11 rounded-2xl bg-[var(--accent-primary)]/15 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What we do */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-4xl font-bold">Qué hacemos</h2>
            <p className="text-[var(--text-secondary)]">Tres áreas que funcionan como una sola.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-6 md:p-8 hover:border-[var(--accent-primary)]/50 transition-colors"
              >
                <s.icon className="w-9 h-9 text-[var(--accent-primary)] mb-5" />
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Qualitative highlights */}
        <section className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 md:p-10">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">
            <div className="lg:col-span-2 space-y-2">
              <Handshake className="w-8 h-8 text-[var(--accent-primary)]" />
              <h2 className="text-2xl md:text-3xl font-bold">Por qué trabajar con nosotros</h2>
              <p className="text-[var(--text-secondary)]">Estamos creciendo, y lo hacemos paso a paso.</p>
            </div>
            <ul className="lg:col-span-3 space-y-3">
              {highlights.map((h) => (
                <li key={h} className="flex gap-3 items-start">
                  <span className="mt-2 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shrink-0" />
                  <span className="text-[var(--text-primary)]">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl md:text-4xl font-black">¿Empezamos algo juntos?</h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Cuéntanos tu idea o descubre a los artistas que ya forman parte de {SITE.name}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              Contactar <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              Explorar artistas
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
