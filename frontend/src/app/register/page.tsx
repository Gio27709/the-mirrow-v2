"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Eye, EyeOff, Check } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    accepts_notifications: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ... validation logic (same as before) ...
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isMinLength = formData.password.length >= 8;
  const passwordsMatch =
    formData.password && formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    // ... previous handleSubmit logic ...
    e.preventDefault();
    setError("");

    if (!hasUpperCase || !hasNumber || !isMinLength) {
      setError("La contraseña no cumple con los requisitos de seguridad.");
      return;
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!formData.accepts_notifications) {
      setError("Debes aceptar recibir notificaciones para registrarte.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/register", {
        email: formData.email,
        password: formData.password,
        accepts_notifications: formData.accepts_notifications,
      });
      router.push("/login?registered=true");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrarse. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    setLoading(true);
    try {
      const response = await api.post("/google-login", {
        access_token: credentialResponse.credential,
        token_type: "bearer",
      });

      if (response.access_token) {
        login(response.access_token);
        router.push("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: unknown) {
      setError("Error al registrarse con Google.");
      console.error("Google Register Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-black opacity-50 blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]">
            Crear Cuenta
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Únete a The Mirrow y descubre tu potencial
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4 mb-6">
          {/* Google Register Button */}
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Error al registrarse con Google")}
              theme="filled_black"
              shape="pill"
              width="100%"
              text="signup_with"
            />
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[var(--border-subtle)]"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">
              O con tu correo
            </span>
            <div className="flex-grow border-t border-[var(--border-subtle)]"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] focus:border-[var(--accent-metallic)] focus:ring-1 focus:ring-[var(--accent-metallic)] outline-none transition-all placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] focus:border-[var(--accent-metallic)] focus:ring-1 focus:ring-[var(--accent-metallic)] outline-none transition-all placeholder:text-[var(--text-muted)] text-[var(--text-primary)] pr-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Validation Indicators */}
            <div className="mt-3 space-y-1 text-xs text-[var(--text-secondary)]">
              <div
                className={`flex items-center gap-2 ${isMinLength ? "text-green-500" : ""}`}
              >
                {isMinLength ? (
                  <Check size={12} />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-current" />
                )}
                Mínimo 8 caracteres
              </div>
              <div
                className={`flex items-center gap-2 ${hasUpperCase ? "text-green-500" : ""}`}
              >
                {hasUpperCase ? (
                  <Check size={12} />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-current" />
                )}
                Al menos una mayúscula
              </div>
              <div
                className={`flex items-center gap-2 ${hasNumber ? "text-green-500" : ""}`}
              >
                {hasNumber ? (
                  <Check size={12} />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-current" />
                )}
                Al menos un número
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              required
              className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] focus:border-[var(--accent-metallic)] focus:ring-1 focus:ring-[var(--accent-metallic)] outline-none transition-all placeholder:text-[var(--text-muted)] text-[var(--text-primary)] ${
                formData.confirmPassword && !passwordsMatch
                  ? "border-red-500/50"
                  : ""
              }`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          {/* Mandatory Notifications Checkbox */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)]">
            <div className="relative flex items-center mt-1">
              <input
                type="checkbox"
                required
                id="notifications"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[var(--border-subtle)] checked:border-[var(--accent-metallic)] checked:bg-[var(--accent-metallic)] transition-all"
                checked={formData.accepts_notifications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accepts_notifications: e.target.checked,
                  })
                }
              />
              <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </div>
            <label
              htmlFor="notifications"
              className="text-sm text-[var(--text-secondary)] cursor-pointer select-none"
            >
              Deseo recibir notificaciones sobre eventos exclusivos, promociones
              y novedades de The Mirrow.{" "}
              <span className="text-[var(--accent-metallic)]">
                * (Obligatorio)
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[var(--accent-metallic)] hover:bg-[var(--accent-metallic-hover)] text-[var(--bg-primary)] font-bold rounded-xl transition-all shadow-[0_0_20px_var(--accent-metallic-glow)] hover:shadow-[0_0_30px_var(--accent-metallic-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[var(--text-secondary)]">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="text-[var(--accent-metallic)] hover:underline font-medium"
            >
              Inicia Sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
