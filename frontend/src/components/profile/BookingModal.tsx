"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Mail,
  Phone,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { api } from "@/lib/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  talentName: string;
}

export function BookingModal({
  isOpen,
  onClose,
  talentName,
}: BookingModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    date: "", // Not saved to DB yet, but good for UX
    details: "", // Not saved to DB yet
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // We only send supported fields to backend
      await api.post("/leads", {
        full_name: formData.full_name, // In future we could append details here
        email: formData.email,
        phone: formData.phone,
      });
      setStep("success");
    } catch (error) {
      console.error("Booking error:", error);
      // Handle error (toast or alert)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto z-50 w-full max-w-lg h-fit bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-2xl p-0"
          >
            <div className="relative p-6 md:p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors text-[var(--text-secondary)]"
              >
                <X className="w-5 h-5" />
              </button>

              {step === "form" ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                      Cotizar {talentName}
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm">
                      Completa tus datos y nos pondremos en contacto contigo en
                      breve para coordinar tu evento.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        Nombre Completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          required
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              full_name: e.target.value,
                            })
                          }
                          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl py-3 pl-10 pr-4 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                          placeholder="Ej. Juan Pérez"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl py-3 pl-10 pr-4 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                            placeholder="juan@email.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                          Teléfono
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl py-3 pl-10 pr-4 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                            placeholder="+58 ..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        Fecha del Evento (Estimada)
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl py-3 pl-10 pr-4 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Solicitar Cotización"
                    )}
                  </button>

                  <p className="text-xs text-center text-[var(--text-muted)]">
                    Al enviar, aceptas ser contactado por nuestro equipo de
                    ventas.
                  </p>
                </form>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      ¡Solicitud Recibida!
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                      Hemos recibido tus datos correctamente. Nuestro equipo te
                      contactará pronto al número{" "}
                      <strong>{formData.phone}</strong>.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
