"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Mail, Lock } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setRegisteredSuccess(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: formData.email,
        password: formData.password,
      });
      login(response.access_token);
      router.push("/"); // Redirect to home page as requested
    } catch (err: unknown) {
      setError(
        (err as Error).message || "Credenciales inválidas. Inténtalo de nuevo.",
      );
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
        token_type: "bearer", // Sending as 'access_token' to match schema, slightly hacky but works with Token schema
      });
      // Note: The backend google-login currently returns just a message or token?
      // We need to adjust backend to return the same Token schema as login: { access_token, token_type }
      // Let's assume we will fix backend to return { access_token, token_type }

      if (response.access_token) {
        login(response.access_token);
        router.push("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: unknown) {
      setError("Error al iniciar sesión con Google.");
      console.error("Google Login Error:", err);
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
            Bienvenido
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Inicia sesión para continuar
          </p>
        </div>

        {registeredSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-center text-sm"
          >
            ¡Cuenta creada exitosamente! Por favor inicia sesión.
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          {/* Google Login Button */}
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Error al iniciar sesión con Google")}
              theme="filled_black"
              shape="pill"
              width="100%"
              text="continue_with"
            />
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[var(--border-subtle)]"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">
              O usa tu correo
            </span>
            <div className="flex-grow border-t border-[var(--border-subtle)]"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] focus:border-[var(--accent-metallic)] focus:ring-1 focus:ring-[var(--accent-metallic)] outline-none transition-all placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Contraseña
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[var(--accent-metallic)] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] focus:border-[var(--accent-metallic)] focus:ring-1 focus:ring-[var(--accent-metallic)] outline-none transition-all placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[var(--accent-metallic)] hover:bg-[var(--accent-metallic-hover)] text-[var(--bg-primary)] font-bold rounded-xl transition-all shadow-[0_0_20px_var(--accent-metallic-glow)] hover:shadow-[0_0_30px_var(--accent-metallic-glow)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[var(--text-secondary)]">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="text-[var(--accent-metallic)] hover:underline font-medium"
            >
              Regístrate ahora
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
