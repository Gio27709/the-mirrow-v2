"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Lock,
  Bell,
  Moon,
  LogOut,
  Check,
  Camera,
  Mail,
  AlertCircle,
  CreditCard,
  Sun,
  Monitor,
  LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Image from "next/image";
import { Ticket } from "lucide-react";
import MyTicketsTab from "@/components/profile/MyTicketsTab";

// -- Tabs Configuration --
interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

const TABS: TabItem[] = [
  { id: "account", label: "Mi Cuenta", icon: User },
  { id: "tickets", label: "Mis Entradas", icon: Ticket },
  { id: "security", label: "Seguridad", icon: Lock },
  { id: "appearance", label: "Apariencia", icon: Moon },
  { id: "billing", label: "Facturación", icon: CreditCard },
  { id: "notifications", label: "Notificaciones", icon: Bell },
];

export default function SettingsPage() {
  const { user, refreshUser, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  // Protect Route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const { theme, setTheme } = useTheme();

  // ... (rest of component)

  const [language, setLanguage] = useState("es");
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    username: user?.username || "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setErrorMsg("Las contraseñas nuevas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/users/me/password",
        {
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
        },
        token,
      );
      setSuccessMsg("¡Contraseña actualizada correctamente!");
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error: unknown) {
      const err = error as Error;
      setErrorMsg(err.message || "Error al actualizar contraseña");
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Save
  const handleSave = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/users/me?full_name=${encodeURIComponent(formData.full_name)}&username=${encodeURIComponent(formData.username)}`,
        {},
        token,
      );
      await refreshUser(); // Update global state
      setSuccessMsg("¡Cambios guardados correctamente!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error: unknown) {
      const err = error as Error;
      setErrorMsg(err.message || "Error al guardar cambios");
    } finally {
      setLoading(false);
    }
  };

  // Optimistic Avatar Preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instant Optimistic UI
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      await api.upload("/users/me/avatar", formData, token, "POST");

      // 2. Background Upload & Sync
      await refreshUser();
      setSuccessMsg("¡Foto actualizada!");
      setTimeout(() => {
        setSuccessMsg("");
        setPreviewImage(null); // Clear preview once real URL is loaded (optional, but good for sync)
      }, 3000);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      setErrorMsg("Error al subir la imagen");
      setPreviewImage(null); // Revert on failure
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 text-[var(--text-primary)]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-[var(--text-secondary)]">
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 text-[var(--text-primary)]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Configuración
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Gestión de tu cuenta y preferencias.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Tabs */}
          <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium
                                        ${
                                          activeTab === tab.id
                                            ? "bg-[var(--bg-elevated)] text-[var(--accent-primary)] shadow-sm border border-[var(--border-subtle)]"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                                        }
                                        ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}
                                    `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.disabled && (
                    <span className="ml-auto text-[10px] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--text-muted)]">
                      Pronto
                    </span>
                  )}
                </button>
              );
            })}

            <div className="h-px bg-[var(--border-subtle)] my-2" />

            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8"
            >
              {activeTab === "account" && (
                <div className="space-y-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-[var(--border-subtle)]">
                    <div className="relative group w-24 h-24 shrink-0">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-[var(--bg-tertiary)] shadow-lg relative">
                        {previewImage || user?.profile_image_url ? (
                          <Image
                            src={
                              previewImage ||
                              `${user?.profile_image_url}?t=${Date.now()}`
                            }
                            alt="Profile"
                            fill
                            className="object-cover"
                            unoptimized={true} // Always unoptimized to bypass Next.js cache for user content
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                            {user?.full_name?.charAt(0) ||
                              user?.email?.charAt(0) ||
                              "?"}
                          </div>
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer backdrop-blur-[2px]">
                        <Camera className="w-6 h-6" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Tu Foto de Perfil
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Haz clic en la imagen para cambiarla. Se recomienda
                        formato cuadrado.
                      </p>
                    </div>
                  </div>

                  {/* Personal Info Form */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                          Nombre de Usuario
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text-secondary)]">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--text-muted)] cursor-not-allowed opacity-70"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-500 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verificado
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        El correo electrónico no se puede cambiar por seguridad.
                      </p>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="bg-[var(--bg-tertiary)]/30 rounded-xl p-4 border border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user?.auth_provider === "google" ? (
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5">
                          <Image
                            src="https://www.google.com/favicon.ico"
                            alt="G"
                            width={20}
                            height={20}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                          <Mail className="w-4 h-4 text-[var(--text-secondary)]" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          Conectado con{" "}
                          {user?.auth_provider === "google"
                            ? "Google"
                            : "Email"}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Tu cuenta está vinculada y segura.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                      Activo
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-[var(--border-subtle)]">
                    {successMsg && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-green-500 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" /> {successMsg}
                      </motion.p>
                    )}
                    {errorMsg && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-500 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" /> {errorMsg}
                      </motion.p>
                    )}

                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-medium hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "tickets" && (
                <MyTicketsTab />
              )}

              {activeTab === "security" && (
                <div className="space-y-8">
                  {/* Password Change Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-subtle)]">
                      <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-primary)]">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          Cambiar Contraseña
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          Asegúrate de usar una contraseña segura.
                        </p>
                      </div>
                    </div>

                    {user?.auth_provider === "google" ? (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <Image
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <h4 className="text-[var(--text-primary)] font-medium">
                          Iniciaste sesión con Google
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                          Tu seguridad es gestionada directamente por Google. No
                          necesitas cambiar tu contraseña aquí.
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={handlePasswordChange}
                        className="space-y-4 max-w-md"
                      >
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Contraseña Actual
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            value={passwordData.old_password}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                old_password: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Nueva Contraseña
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            value={passwordData.new_password}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                new_password: e.target.value,
                              })
                            }
                            required
                          />
                          <p className="text-xs text-[var(--text-muted)]">
                            Mínimo 8 caracteres, 1 mayúscula, 1 número.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Confirmar Nueva Contraseña
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            value={passwordData.confirm_password}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirm_password: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-medium hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading
                              ? "Actualizando..."
                              : "Actualizar Contraseña"}
                          </button>

                          {successMsg && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-green-500 flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" /> {successMsg}
                            </motion.p>
                          )}
                          {errorMsg && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-red-500 flex items-center gap-2"
                            >
                              <AlertCircle className="w-4 h-4" /> {errorMsg}
                            </motion.p>
                          )}
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Active Sessions (Mock) */}
                  <div className="pt-8 border-t border-[var(--border-subtle)] space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-primary)]">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          Sesiones Activas
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          Dispositivos donde has iniciado sesión.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[var(--bg-tertiary)]/30 rounded-xl p-4 border border-[var(--border-subtle)] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-[var(--text-primary)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            Windows PC - Chrome
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Madrid, España • Activo ahora
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                        Este dispositivo
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-subtle)]">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-primary)]">
                      <Moon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Apariencia
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Personaliza tu experiencia visual.
                      </p>
                    </div>
                  </div>

                  {/* Theme Selector */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                      Tema
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => setTheme("light")}
                        className={`
                                                    group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all
                                                    ${
                                                      theme === "light"
                                                        ? "border-[var(--accent-primary)] bg-[var(--bg-elevated)]"
                                                        : "border-[var(--border-subtle)] hover:border-[var(--border-default)] bg-[var(--bg-tertiary)]/50"
                                                    }
                                                `}
                      >
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                          <Sun className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-sm font-medium ${theme === "light" ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"}`}
                        >
                          Claro
                        </span>
                        {theme === "light" && (
                          <div className="absolute top-3 right-3 text-[var(--accent-primary)]">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => setTheme("dark")}
                        className={`
                                                    group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all
                                                    ${
                                                      theme === "dark"
                                                        ? "border-[var(--accent-primary)] bg-[var(--bg-elevated)]"
                                                        : "border-[var(--border-subtle)] hover:border-[var(--border-default)] bg-[var(--bg-tertiary)]/50"
                                                    }
                                                `}
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center">
                          <Moon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-sm font-medium ${theme === "dark" ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"}`}
                        >
                          Oscuro
                        </span>
                        {theme === "dark" && (
                          <div className="absolute top-3 right-3 text-[var(--accent-primary)]">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => setTheme("grey")}
                        className={`
                                                    group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all
                                                    ${
                                                      theme === "grey"
                                                        ? "border-[var(--accent-primary)] bg-[var(--bg-elevated)]"
                                                        : "border-[var(--border-subtle)] hover:border-[var(--border-default)] bg-[var(--bg-tertiary)]/50"
                                                    }
                                                `}
                      >
                        <div className="w-10 h-10 rounded-full bg-zinc-600 text-zinc-300 flex items-center justify-center">
                          <Monitor className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-sm font-medium ${theme === "grey" ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"}`}
                        >
                          Grey
                        </span>
                        {theme === "grey" && (
                          <div className="absolute top-3 right-3 text-[var(--accent-primary)]">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Language Selector (Mock for now) */}
                  <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                      Idioma
                    </label>
                    <div className="bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] rounded-xl divide-y divide-[var(--border-subtle)]">
                      <button
                        onClick={() => setLanguage("es")}
                        className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-elevated)] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-400/20 text-yellow-600 flex items-center justify-center text-xs font-bold">
                            ES
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                              Español
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              Idioma actual
                            </p>
                          </div>
                        </div>
                        {language === "es" && (
                          <Check className="w-5 h-5 text-[var(--accent-primary)]" />
                        )}
                      </button>

                      <button
                        onClick={() => setLanguage("en")}
                        className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-elevated)] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-400/20 text-blue-600 flex items-center justify-center text-xs font-bold">
                            EN
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                              English (US)
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              English
                            </p>
                          </div>
                        </div>
                        {language === "en" && (
                          <Check className="w-5 h-5 text-[var(--accent-primary)]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="space-y-8">
                  {/* Current Plan */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--bg-elevated)] border border-[var(--accent-primary)]/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <CreditCard className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-[var(--accent-primary)]">
                            Plan Gratuito
                          </h3>
                          <p className="text-[var(--text-secondary)]">
                            Actualmente estás en el plan básico.
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-primary)] text-white">
                          ACTIVO
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-[var(--accent-primary)]/20">
                          Mejorar a Pro
                        </button>
                        <button className="px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] text-sm font-medium rounded-lg transition-colors border border-[var(--border-subtle)]">
                          Ver Planes
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        Método de Pago
                      </h2>
                    </div>

                    <div className="p-8 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] border-dashed flex flex-col items-center justify-center gap-3 text-center">
                      <div className="p-3 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          No tienes tarjetas guardadas
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Agrega un método de pago para suscribirte.
                        </p>
                      </div>
                      <button className="mt-2 text-sm text-[var(--accent-primary)] hover:underline font-medium">
                        + Agregar Tarjeta
                      </button>
                    </div>
                  </div>

                  {/* Billing History (Empty State) */}
                  <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                      Historial de Facturación
                    </h2>
                    <div className="p-8 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] text-center text-[var(--text-secondary)]">
                      <p>No tienes facturas disponibles.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-8">
                  {/* Email Notifications */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                      Preferencias de Correo
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">
                              Alertas de Seguridad
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              Avisos de inicio de sesión y cambios de
                              contraseña.
                            </p>
                          </div>
                        </div>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500/20">
                          <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-green-500 transition" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">
                              Novedades y Ofertas
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              Recibe noticias sobre nuevas funciones y
                              promociones.
                            </p>
                          </div>
                        </div>
                        {/* Mock User Preference Toggle */}
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user?.accepts_notifications ? "bg-indigo-500" : "bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"}`}
                          disabled
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${user?.accepts_notifications ? "translate-x-6" : "translate-x-1"}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Push Notifications (Mock) */}
                  <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                      Notificaciones Push
                    </h2>
                    <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] flex items-center justify-between opacity-50 cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">
                            Notificaciones de Escritorio
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Recibe alertas directamente en tu navegador.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-1 rounded">
                        Próximamente
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
