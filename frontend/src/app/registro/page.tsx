"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterLanding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("http://localhost:8000/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/"), 3000); // Redirect after success
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 relative z-10 gap-12 lg:gap-24">
        {/* Left Side: Value Proposition */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Evento Exclusivo 2026</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-none">
            Sé parte del <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Futuro del Arte
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-xl mx-auto lg:mx-0">
            Únete a la lista de espera exclusiva. Acceso anticipado a eventos,
            meet & greets con artistas y experiencias VIP inolvidables.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <span>Acceso VIP</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <span>Newsletter Semanal</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Glass Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full max-w-md"
        >
          <div className="bg-[var(--bg-elevated)]/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative">
            {status === "success" ? (
              <div className="text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  ¡Registro Exitoso!
                </h3>
                <p className="text-gray-400">
                  Gracias por unirte. Te contactaremos pronto.
                </p>
                <Link
                  href="/"
                  className="inline-block text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Volver al inicio
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white">
                    Regístrate Ahora
                  </h3>
                  <p className="text-sm text-gray-400">
                    Completa tus datos para asegurar tu lugar.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="tu@correo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Teléfono (Opcional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
                >
                  {status === "loading" ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar Registro
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="text-red-400 text-sm text-center">
                    Hubo un error. Intenta de nuevo.
                  </p>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-8">
        <Link
          href="/"
          className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Volver a Home
        </Link>
      </div>
    </div>
  );
}
