"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  CheckCircle,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Instagram,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const WHATSAPP_NUMBER = "34677267104";
const EMAIL = "info@themirrow.com";
const INSTAGRAM = "@themirrow";

const inquiryTypes = [
  { value: "evento", label: "🎪 Organizar un Evento" },
  { value: "cotizacion", label: "💰 Cotizar Producción" },
  { value: "talento", label: "🎤 Contratar Talento" },
  { value: "general", label: "💬 Consulta General" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: "",
    inquiry_type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/leads", {
        ...formData,
        source: "web",
      });
      setIsSuccess(true);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        message: "",
        inquiry_type: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al enviar. Intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppUrl = () => {
    const inquiry = inquiryTypes.find(
      (t) => t.value === formData.inquiry_type
    );
    const typeText = inquiry ? inquiry.label : "una consulta";
    const msg = formData.full_name
      ? `Hola, soy ${formData.full_name}. Quiero información sobre ${typeText}.${formData.message ? ` ${formData.message}` : ""}`
      : `Hola, quiero información sobre los servicios de The Mirrow.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-24 overflow-clip">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-600/15 rounded-full blur-[120px] mix-blend-screen" />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/15 rounded-full blur-[120px] mix-blend-screen"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center space-y-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Hablemos
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter"
          >
            ¿Tienes un{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
              proyecto
            </span>{" "}
            en mente?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto"
          >
            Cuéntanos tu idea y te ayudamos a hacerla realidad. Organización de
            eventos, contratación de talentos, producción y más.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl p-8 md:p-10 relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative z-10 text-center py-16 space-y-6"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold">¡Mensaje Enviado!</h3>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                      Hemos recibido tu mensaje. Nuestro equipo te contactará
                      pronto. Si prefieres respuesta inmediata, escríbenos por
                      WhatsApp.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp Directo
                      </a>
                      <button
                        onClick={() => setIsSuccess(false)}
                        className="inline-flex items-center justify-center gap-2 border border-[var(--border-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-6 py-3 rounded-xl font-medium transition-colors"
                      >
                        Enviar otro mensaje
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="relative z-10 space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        Envíanos un mensaje
                      </h2>
                      <p className="text-[var(--text-secondary)] text-sm">
                        Completa el formulario y te responderemos a la brevedad.
                      </p>
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        ¿En qué te podemos ayudar?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {inquiryTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                inquiry_type: type.value,
                              }))
                            }
                            className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                              formData.inquiry_type === type.value
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]"
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          placeholder="Tu nombre"
                          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="tu@email.com"
                          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+34 600 000 000"
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Mensaje *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Cuéntanos sobre tu proyecto, evento o consulta..."
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none"
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                        {error}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-emerald-700 hover:to-cyan-700 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Enviar Mensaje
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sidebar — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* WhatsApp Card */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-3xl p-8 hover:border-emerald-500/60 transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    WhatsApp Directo
                  </h3>
                  <p className="text-emerald-300/80 text-sm">
                    Respuesta inmediata
                  </p>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-sm mb-4">
                ¿Prefieres una respuesta rápida? Escríbenos directamente por
                WhatsApp y te atenderemos al momento.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm group-hover:gap-3 transition-all">
                +34 677 26 71 04
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${EMAIL}`}
              className="group block bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl p-8 hover:border-blue-500/40 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Email</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Para propuestas formales
                  </p>
                </div>
              </div>
              <p className="text-blue-400 font-medium text-sm">{EMAIL}</p>
            </a>

            {/* Info Cards */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl p-8 space-y-5">
              <h3 className="text-lg font-bold">Información</h3>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[var(--text-muted)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    +34 677 26 71 04
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Instagram className="w-5 h-5 text-[var(--text-muted)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Instagram</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {INSTAGRAM}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[var(--text-muted)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Horario de atención</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Lunes a Viernes: 9:00 - 18:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--text-muted)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Ubicación</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    España
                  </p>
                </div>
              </div>
            </div>

            {/* CTA - Events */}
            <Link
              href="/eventos"
              className="group block bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 rounded-3xl p-8 hover:border-purple-500/40 transition-all"
            >
              <h3 className="text-lg font-bold mb-2">
                ¿Buscas organizar un evento?
              </h3>
              <p className="text-[var(--text-secondary)] text-sm mb-4">
                Descubre nuestra cartelera y cotiza tu propio evento con
                producción profesional.
              </p>
              <span className="flex items-center gap-2 text-purple-400 font-medium text-sm group-hover:gap-3 transition-all">
                Ver Eventos <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
