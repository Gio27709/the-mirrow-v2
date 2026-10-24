"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Download, Mail, Newspaper, Send } from "lucide-react";
import { api } from "@/lib/api";
import { SITE, mailtoUrl } from "@/lib/site";

const facts = [
  { label: "Qué es", value: "Plataforma de entretenimiento para descubrir y contratar artistas y asistir a eventos." },
  { label: "Dónde", value: `${SITE.country}` },
  { label: "Disciplinas", value: "DJs, música en directo, cantantes, artes escénicas y danza." },
  { label: "Servicios", value: "Organización de eventos, booking de artistas, producción y venta o reserva de entradas." },
  { label: "Web", value: SITE.url.replace(/^https?:\/\//, "") },
  { label: "Instagram", value: SITE.instagram.handle },
];

const logos = [
  {
    file: "/logo-claro.png",
    name: "Logotipo claro",
    hint: "Para fondos oscuros",
    previewBg: "bg-zinc-900",
  },
  {
    file: "/logo-oscuro.png",
    name: "Logotipo oscuro",
    hint: "Para fondos claros",
    previewBg: "bg-zinc-100",
  },
];

const inputClass =
  "w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all";

const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

const emptyForm = { full_name: "", outlet: "", email: "", message: "" };

export default function PrensaPage() {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await api.post("/leads", {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        message: `Medio: ${form.outlet.trim()}\n\n${form.message.trim()}`,
        inquiry_type: "prensa",
        source: "web",
      });
      setIsSuccess(true);
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-clip">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-14 md:space-y-20">
        {/* Intro */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <Newspaper className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[var(--text-secondary)]">
              Sala de prensa
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            {SITE.name}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              para medios
            </span>
          </h1>
          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
            {SITE.name} es una plataforma de entretenimiento nacida en {SITE.country} que conecta a artistas con quienes quieren contar con ellos. Reunimos DJs, músicos, cantantes, artistas escénicos y bailarines, organizamos y producimos eventos propios y para terceros, y facilitamos que el público descubra y reserve su próxima experiencia en directo. Más sobre nuestra historia en{" "}
            <Link href="/about" className="text-[var(--accent-primary)] underline underline-offset-2">Sobre Nosotros</Link>.
          </p>
        </motion.section>

        {/* Key facts */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">Datos clave</h2>
          <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facts.map((f) => (
              <div key={f.label} className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-5">
                <dt className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">{f.label}</dt>
                <dd className="text-[var(--text-primary)] break-words">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Press kit */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Kit de prensa</h2>
            <p className="text-[var(--text-secondary)]">
              Descarga nuestros logotipos en PNG. Por favor, no los deformes ni cambies sus colores.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {logos.map((logo) => (
              <div key={logo.file} className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] overflow-hidden">
                <div className={`relative h-40 md:h-48 ${logo.previewBg}`}>
                  <Image src={logo.file} alt={`${SITE.name} — ${logo.name}`} fill className="object-contain p-8" sizes="(max-width: 640px) 100vw, 50vw" />
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-semibold">{logo.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{logo.hint}</p>
                  </div>
                  <a
                    href={logo.file}
                    download
                    className="inline-flex items-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" /> Descargar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact + form */}
        <section className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <aside className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Contacto de prensa</h2>
            <p className="text-[var(--text-secondary)]">
              Para entrevistas, acreditaciones para nuestros eventos, imágenes o información adicional, escríbenos y te responderemos lo antes posible.
            </p>
            <a
              href={mailtoUrl("Consulta de prensa")}
              className="flex items-center gap-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-5 hover:border-[var(--accent-primary)]/50 transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-[var(--accent-primary)]/15 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[var(--accent-primary)]" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-[var(--text-muted)]">Email</span>
                <span className="block font-medium break-all">{SITE.email}</span>
              </span>
            </a>
          </aside>

          <div className="lg:col-span-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl p-5 sm:p-8 md:p-10">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12 space-y-5"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold">¡Solicitud enviada!</h3>
                  <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                    Gracias por tu interés en {SITE.name}. Te responderemos en breve.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="inline-flex items-center justify-center gap-2 border border-[var(--border-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Enviar otra consulta
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <h3 className="text-xl md:text-2xl font-bold">Solicitud de prensa</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="full_name" className={labelClass}>Nombre *</label>
                      <input id="full_name" name="full_name" type="text" required value={form.full_name} onChange={handleChange} placeholder="Tu nombre" autoComplete="name" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="outlet" className={labelClass}>Medio *</label>
                      <input id="outlet" name="outlet" type="text" required value={form.outlet} onChange={handleChange} placeholder="Nombre del medio" autoComplete="organization" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>Email *</label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="tu@medio.com" autoComplete="email" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="message" className={labelClass}>Mensaje *</label>
                    <textarea id="message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Cuéntanos qué necesitas: entrevista, acreditación, imágenes..." className={`${inputClass} resize-none`} />
                  </div>

                  {error && (
                    <p role="alert" className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white py-4 rounded-2xl font-bold text-base md:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar solicitud
                      </>
                    )}
                  </button>
                  <p className="text-xs text-[var(--text-muted)]">
                    Trataremos tus datos solo para responder a tu solicitud. Más información en nuestra{" "}
                    <Link href="/privacidad" className="underline hover:text-[var(--text-secondary)]">Política de Privacidad</Link>.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
