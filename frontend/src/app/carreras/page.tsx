"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Handshake,
  Megaphone,
  Mic2,
  Send,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { SITE, mailtoUrl } from "@/lib/site";

const areas = [
  {
    value: "produccion",
    label: "Producción de eventos",
    icon: Briefcase,
    text: "Planificación, logística, proveedores y coordinación el día del evento. Para quien disfruta cuando todo encaja.",
  },
  {
    value: "booking",
    label: "Booking y relación con artistas",
    icon: Handshake,
    text: "Descubrir talento, acompañar a los artistas y cerrar contrataciones con clientes y salas.",
  },
  {
    value: "marketing",
    label: "Marketing y contenido",
    icon: Megaphone,
    text: "Redes sociales, foto, vídeo y comunicación para contar lo que pasa en cada evento y en cada escenario.",
  },
  {
    value: "tecnica",
    label: "Técnica de sonido e iluminación",
    icon: SlidersHorizontal,
    text: "Montaje, control y operación de sonido y luces para que cada actuación suene y se vea como merece.",
  },
];

const values = [
  "Trabajamos codo con codo con artistas, no solo para ellos.",
  "Preferimos hacer menos cosas, pero bien hechas.",
  "Cada evento es un proyecto de equipo: todos aportan ideas.",
];

const inputClass =
  "w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all";

const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  area: "",
  portfolio: "",
  message: "",
};

export default function CarrerasPage() {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const areaLabel = areas.find((a) => a.value === form.area)?.label ?? "Otra";
    const message = [
      `Área de interés: ${areaLabel}`,
      form.portfolio.trim() ? `Portfolio / LinkedIn: ${form.portfolio.trim()}` : null,
      "",
      form.message.trim(),
    ]
      .filter((line) => line !== null)
      .join("\n");

    try {
      await api.post("/leads", {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message,
        inquiry_type: "empleo",
        source: "web",
      });
      setIsSuccess(true);
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar tu candidatura. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-clip">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-16 md:space-y-24">
        {/* Intro */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[var(--text-secondary)]">
              Trabaja con nosotros
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Haz que{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500">
              suceda
            </span>{" "}
            con nosotros
          </h1>
          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
            En {SITE.name} unimos artistas, público y producción. Somos un equipo pequeño y cercano al que le mueve la música, el escenario y el trabajo bien hecho. Si te ves aportando a esta historia, queremos conocerte.
          </p>
          <ul className="grid sm:grid-cols-3 gap-3 pt-4 text-left">
            {values.map((v) => (
              <li
                key={v}
                className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-4 text-sm text-[var(--text-secondary)]"
              >
                {v}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Areas */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-4xl font-bold">Dónde buscamos gente</h2>
            <p className="text-[var(--text-secondary)]">
              No siempre tenemos vacantes abiertas, pero guardamos las candidaturas para cuando surja la oportunidad.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {areas.map((area, i) => (
              <motion.div
                key={area.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-6 md:p-8 hover:border-[var(--accent-primary)]/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/15 flex items-center justify-center mb-4">
                  <area.icon className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{area.label}</h3>
                <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">{area.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Form + artist block */}
        <section className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div id="candidatura" className="lg:col-span-3 scroll-mt-24">
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl p-5 sm:p-8 md:p-10">
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
                    <h2 className="text-2xl font-bold">¡Candidatura recibida!</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                      Gracias por tu interés. Revisaremos tu perfil y te escribiremos si encaja con lo que buscamos.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="inline-flex items-center justify-center gap-2 border border-[var(--border-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      Enviar otra candidatura
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
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Envíanos tu candidatura</h2>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Cuéntanos quién eres y qué te gustaría aportar.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="full_name" className={labelClass}>Nombre completo *</label>
                        <input id="full_name" name="full_name" type="text" required value={form.full_name} onChange={handleChange} placeholder="Tu nombre" autoComplete="name" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelClass}>Email *</label>
                        <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="tu@email.com" autoComplete="email" className={inputClass} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className={labelClass}>Teléfono (opcional)</label>
                        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+34 600 000 000" autoComplete="tel" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="area" className={labelClass}>Área de interés *</label>
                        <select id="area" name="area" required value={form.area} onChange={handleChange} className={inputClass}>
                          <option value="" disabled>Selecciona un área</option>
                          {areas.map((a) => (
                            <option key={a.value} value={a.value}>{a.label}</option>
                          ))}
                          <option value="otra">Otra</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="portfolio" className={labelClass}>Portfolio o LinkedIn (opcional)</label>
                      <input id="portfolio" name="portfolio" type="url" value={form.portfolio} onChange={handleChange} placeholder="https://" className={inputClass} />
                    </div>

                    <div>
                      <label htmlFor="message" className={labelClass}>Mensaje *</label>
                      <textarea id="message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Tu experiencia, qué te motiva y tu disponibilidad..." className={`${inputClass} resize-none`} />
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
                          Enviar candidatura
                        </>
                      )}
                    </button>

                    <p className="text-xs text-[var(--text-muted)]">
                      Al enviar aceptas que tratemos tus datos para gestionar tu candidatura según nuestra{" "}
                      <Link href="/privacidad" className="underline hover:text-[var(--text-secondary)]">Política de Privacidad</Link>.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          <aside className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 md:p-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 flex items-center justify-center mb-4">
                <Mic2 className="w-6 h-6 text-[var(--accent-primary)]" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">¿Eres artista?</h2>
              <p className="text-[var(--text-secondary)] text-sm md:text-base mb-5">
                Si eres DJ, músico, cantante, bailarín o artista escénico, no necesitas este formulario: regístrate y te ayudamos a publicar tu perfil para que empieces a recibir solicitudes.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white px-5 py-3 rounded-xl font-semibold transition-colors"
              >
                Registrarme como artista <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 md:p-8">
              <h2 className="text-lg font-bold mb-2">¿Prefieres el email?</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                También puedes enviarnos tu CV directamente.
              </p>
              <a
                href={mailtoUrl("Candidatura - Trabaja con nosotros")}
                className="text-[var(--accent-primary)] font-medium text-sm break-all hover:underline"
              >
                {SITE.email}
              </a>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
