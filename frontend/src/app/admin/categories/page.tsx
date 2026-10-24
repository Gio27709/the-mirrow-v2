"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { gradientStyle } from "@/lib/colors";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/context/CategoryContext";
import { errorMessage } from "../_lib/upload";
import {
  Plus,
  Pencil,
  Trash,
  X,
  Check,
  Upload,
  ImageIcon,
  Info,
  Loader2,
  LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import Image from "next/image";

/* ── Icon Options ─────────────────────────────────────────── */
const iconOptions = [
  "Activity", "Anchor", "Aperture", "Award", "Camera", "Clapperboard",
  "Code", "Coffee", "Compass", "Cpu", "Disc", "DollarSign", "Feather",
  "Film", "Flag", "Gift", "Globe", "Headphones", "Heart", "Image",
  "Layers", "Layout", "Map", "Mic", "Mic2", "Monitor", "Moon", "Music",
  "Package", "PenTool", "Play", "Radio", "ShoppingBag", "Smartphone",
  "Speaker", "Star", "Sun", "Tag", "Target", "Terminal", "Theater",
  "Tool", "Truck", "Tv", "Umbrella", "User", "Video", "Watch", "Zap",
];

/* ── Gradient Presets ─────────────────────────────────────── */
const gradientOptions = [
  { label: "Purple/Pink", from: "purple-500", to: "pink-500" },
  { label: "Blue/Cyan", from: "blue-500", to: "cyan-500" },
  { label: "Indigo/Purple", from: "indigo-500", to: "purple-600" },
  { label: "Rose/Orange", from: "rose-500", to: "orange-500" },
  { label: "Emerald/Green", from: "emerald-500", to: "green-500" },
  { label: "Amber/Yellow", from: "amber-500", to: "yellow-500" },
  { label: "Red/Rose", from: "red-500", to: "rose-500" },
  { label: "Teal/Cyan", from: "teal-500", to: "cyan-400" },
];

/* ── Types ────────────────────────────────────────────────── */
interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  banner_url: string | null;
  gradient_from: string;
  gradient_to: string;
  icon_name?: string | null;
  order: number;
  is_active: boolean;
}

/* ── Banner Specs (must match backend) ────────────────────── */
const BANNER_SPECS = {
  width: 1200,
  height: 900,
  ratio: "4:3",
  maxMB: 2,
  formats: "JPEG, PNG, WebP",
};

export default function AdminCategoriesPage() {
  const { token, user } = useAuth();
  // Public context (navbar) only lists active categories; refresh it after changes
  const { refreshCategories } = useCategories();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingBanner, setIsRemovingBanner] = useState(false);
  const [formError, setFormError] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Layers");
  const [gradientFrom, setGradientFrom] = useState("indigo-500");
  const [gradientTo, setGradientTo] = useState("purple-500");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Banner Upload State
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Data ─────────────────────────────────────────────── */

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      // Admin endpoint: includes inactive categories
      const data: AdminCategory[] = await api.get("/admin/categories", token);
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refreshAll = () => {
    fetchCategories();
    refreshCategories();
  };

  /* ── Helpers ──────────────────────────────────────────── */

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setIconName("Layers");
    setGradientFrom("indigo-500");
    setGradientTo("purple-500");
    setImageUrl("");
    setIsActive(true);
    setBannerFile(null);
    setBannerPreview(null);
    setEditingCategory(null);
    setIsModalOpen(false);
    setIsUploading(false);
    setFormError("");
  };

  const handleEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIconName(cat.icon_name || "Layers");
    setGradientFrom(cat.gradient_from);
    setGradientTo(cat.gradient_to);
    setImageUrl(cat.image_url || "");
    setIsActive(cat.is_active);
    setBannerPreview(cat.banner_url || null);
    setBannerFile(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (cat: AdminCategory) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/admin/categories/${cat.id}`, token);
      refreshAll();
    } catch (error) {
      console.error("Failed to delete category", error);
      alert(errorMessage(error, "Error al eliminar categoría"));
    }
  };

  /* ── Banner File Selection ─────────────────────────────── */

  const validateAndSetBanner = (file: File) => {
    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Formato no permitido. Usa JPEG, PNG o WebP.");
      return;
    }
    // Validate size (2MB)
    if (file.size > BANNER_SPECS.maxMB * 1024 * 1024) {
      alert(`La imagen no debe superar ${BANNER_SPECS.maxMB}MB.`);
      return;
    }
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetBanner(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetBanner(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeBanner = async () => {
    if (fileInputRef.current) fileInputRef.current.value = "";

    // A new file not saved yet: just discard it and go back to the saved banner
    if (bannerFile) {
      setBannerFile(null);
      setBannerPreview(editingCategory?.banner_url || null);
      return;
    }

    // Saved banner: delete it on the server
    if (editingCategory?.banner_url) {
      if (!window.confirm("¿Quitar el banner guardado de esta categoría?")) return;
      setIsRemovingBanner(true);
      setFormError("");
      try {
        const updated: AdminCategory = await api.delete(
          `/admin/categories/${editingCategory.id}/banner`,
          token,
        );
        setEditingCategory(updated);
        setBannerPreview(null);
        refreshAll();
      } catch (error) {
        setFormError(errorMessage(error, "No se pudo quitar el banner"));
      } finally {
        setIsRemovingBanner(false);
      }
      return;
    }

    setBannerPreview(null);
  };

  /* ── Submit Handler ────────────────────────────────────── */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    if (!name.trim()) {
      setFormError("El nombre de la categoría es obligatorio.");
      return;
    }
    setFormError("");
    setIsUploading(true);

    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const payload = {
      name: name.trim(),
      slug: finalSlug,
      description,
      image_url: imageUrl,
      icon_name: iconName,
      gradient_from: gradientFrom,
      gradient_to: gradientTo,
    };

    if (!finalSlug) {
      setFormError("No se pudo generar el slug. Escribe uno manualmente (solo letras, números y guiones).");
      setIsUploading(false);
      return;
    }

    let savedCat: AdminCategory;
    try {
      if (editingCategory) {
        savedCat = await api.put(
          `/admin/categories/${editingCategory.id}`,
          { ...payload, is_active: isActive },
          token,
        );
      } else {
        savedCat = await api.post("/admin/categories", payload, token);
      }
    } catch (error: unknown) {
      console.error("Error saving category", error);
      setFormError(errorMessage(error, "Error al guardar categoría"));
      setIsUploading(false);
      return;
    }

    // Upload banner if a new file was selected
    if (bannerFile) {
      try {
        const formData = new FormData();
        formData.append("file", bannerFile);
        await api.upload(
          `/admin/categories/${savedCat.id}/banner`,
          formData,
          token,
        );
      } catch (error: unknown) {
        console.error("Error uploading banner", error);
        // The category itself is saved: switch to edit mode so a retry doesn't create a duplicate
        setEditingCategory(savedCat);
        setSlug(savedCat.slug);
        setFormError(
          `La categoría se guardó, pero el banner no se pudo subir: ${errorMessage(error, "error desconocido")}. Puedes intentarlo de nuevo.`,
        );
        setIsUploading(false);
        refreshAll();
        return;
      }
    }

    refreshAll();
    resetForm();
  };

  /* ── Auth Gate ──────────────────────────────────────────── */

  if (!user || (user.role !== "admin" && user.role !== "owner")) {
    return <div className="p-8 text-center">Acceso denegado</div>;
  }

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Gestión de Categorías
          </h1>
          <p className="text-[var(--text-secondary)]">
            Crea y personaliza categorías dinámicas.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Banner / Gradient Header */}
            <div className="h-40 w-full relative overflow-hidden">
              {cat.banner_url ? (
                <Image
                  src={cat.banner_url}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={gradientStyle(cat.gradient_from, cat.gradient_to)}
                />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {/* Icon centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                {(() => {
                  const Icon =
                    (Icons[
                      cat.icon_name as keyof typeof Icons
                    ] as LucideIcon) || Icons.Layers;
                  return (
                    <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                  );
                })()}
              </div>
              {/* Banner badge */}
              <div className="absolute top-2 left-2 flex gap-1">
                {cat.banner_url && (
                  <span className="text-[10px] bg-green-500/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
                    Banner activo
                  </span>
                )}
                {!cat.is_active && (
                  <span className="text-[10px] bg-red-500/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
                    Inactiva
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {cat.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                /{cat.slug}
              </p>

              <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full text-blue-500"
                  aria-label={`Editar ${cat.name}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full text-red-500"
                  aria-label={`Eliminar ${cat.name}`}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="col-span-full py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
          </div>
        )}
        {!isLoading && categories.length === 0 && (
          <div className="col-span-full py-12 text-center text-[var(--text-muted)] italic">
            No hay categorías dinámicas creadas aún.
          </div>
        )}
      </div>

      {/* ═══ Modal ═══════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[var(--border-subtle)] shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center sticky top-0 bg-[var(--bg-secondary)] z-10">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <button
                onClick={resetForm}
                disabled={isUploading}
                className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full disabled:opacity-50"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-3 text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Ej. Comedia"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-3 text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Ej. comedia (auto-generado si vacío)"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-3 text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-colors h-24 resize-none"
                />
              </div>

              {/* ═══ Banner Upload Section ════════════════════ */}
              <div className="border-t border-[var(--border-subtle)] pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Banner de Categoría
                  </h3>
                </div>

                {/* Size specs info */}
                <div className="flex items-start gap-2 mb-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                  <Info className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-indigo-300/90">
                    <p className="font-medium mb-1">
                      Requisitos de imagen:
                    </p>
                    <ul className="space-y-0.5 text-xs text-[var(--text-secondary)]">
                      <li>
                        • Tamaño recomendado:{" "}
                        <span className="text-[var(--text-primary)] font-medium">
                          {BANNER_SPECS.width} × {BANNER_SPECS.height}px
                        </span>
                      </li>
                      <li>
                        • Proporción:{" "}
                        <span className="text-[var(--text-primary)] font-medium">
                          {BANNER_SPECS.ratio}
                        </span>
                      </li>
                      <li>
                        • Peso máximo:{" "}
                        <span className="text-[var(--text-primary)] font-medium">
                          {BANNER_SPECS.maxMB}MB
                        </span>
                      </li>
                      <li>
                        • Formatos:{" "}
                        <span className="text-[var(--text-primary)] font-medium">
                          {BANNER_SPECS.formats}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Upload Zone / Preview */}
                {bannerPreview ? (
                  <div className="relative w-full aspect-[4/3] max-h-64 rounded-xl overflow-hidden border border-[var(--border-subtle)] group/preview">
                    <Image
                      src={bannerPreview}
                      alt="Vista previa del banner"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 md:group-hover/preview:bg-black/40 transition-colors flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeBanner}
                        disabled={isRemovingBanner || isUploading}
                        className="opacity-100 md:opacity-0 md:group-hover/preview:opacity-100 focus:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                      >
                        {isRemovingBanner ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash className="w-4 h-4" />
                        )}
                        {bannerFile ? "Descartar imagen nueva" : "Quitar banner"}
                      </button>
                    </div>
                    {bannerFile && (
                      <span className="absolute bottom-2 left-2 text-[10px] bg-amber-500/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
                        Nuevo archivo pendiente de guardar
                      </span>
                    )}
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      w-full aspect-[4/3] max-h-64 rounded-xl border-2 border-dashed 
                      flex flex-col items-center justify-center gap-3 cursor-pointer
                      transition-all duration-200
                      ${
                        isDragging
                          ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
                          : "border-[var(--border-subtle)] hover:border-indigo-500/50 bg-[var(--bg-tertiary)]"
                      }
                    `}
                  >
                    <div
                      className={`p-4 rounded-full transition-colors ${isDragging ? "bg-indigo-500/20" : "bg-[var(--bg-secondary)]"}`}
                    >
                      <Upload
                        className={`w-8 h-8 ${isDragging ? "text-indigo-400" : "text-[var(--text-muted)]"}`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[var(--text-secondary)]">
                        {isDragging
                          ? "Suelta la imagen aquí"
                          : "Arrastra una imagen o haz clic"}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {BANNER_SPECS.width}×{BANNER_SPECS.height}px •{" "}
                        {BANNER_SPECS.ratio} • Max {BANNER_SPECS.maxMB}MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleBannerSelect}
                  className="hidden"
                />
              </div>

              {/* ═══ Styling Section ══════════════════════════ */}
              <div className="border-t border-[var(--border-subtle)] pt-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  Personalización
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Gradient Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                      Gradiente (Color de respaldo)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {gradientOptions.map((opt) => (
                        <button
                          type="button"
                          key={opt.label}
                          onClick={() => {
                            setGradientFrom(opt.from);
                            setGradientTo(opt.to);
                          }}
                          className={`
                            h-12 rounded-lg border-2 transition-all
                            ${
                              gradientFrom === opt.from
                                ? "border-white scale-105 shadow-md"
                                : "border-transparent opacity-70 hover:opacity-100"
                            }
                          `}
                          style={gradientStyle(opt.from, opt.to)}
                          title={opt.label}
                          aria-label={opt.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Icon Selector */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text-secondary)]">
                        Ícono
                      </label>
                      <select
                        value={iconName}
                        onChange={(e) => setIconName(e.target.value)}
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-3 text-[var(--text-primary)] outline-none focus:border-indigo-500"
                      >
                        {iconOptions.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="bg-[var(--bg-tertiary)] p-4 rounded-xl border border-[var(--border-subtle)] text-center">
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    Vista Previa
                  </p>
                  <div className="relative w-full max-w-sm mx-auto aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 shadow-lg">
                    {bannerPreview ? (
                      <>
                        <Image
                          src={bannerPreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </>
                    ) : (
                      <div
                        className="w-full h-full"
                        style={gradientStyle(gradientFrom, gradientTo)}
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      {(() => {
                        const Icon =
                          (Icons[
                            iconName as keyof typeof Icons
                          ] as LucideIcon) || Icons.Layers;
                        return (
                          <Icon className="w-8 h-8 text-white mx-auto mb-2 drop-shadow-md" />
                        );
                      })()}
                      <span className="text-xl font-bold text-white drop-shadow-md">
                        {name || "Nombre Categoría"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visibility (only for existing categories; new ones start active) */}
              {editingCategory && (
                <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  Activa (visible en la web)
                </label>
              )}

              {formError && (
                <div
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm"
                  role="alert"
                >
                  {formError}
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Guardar Categoría
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
