"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Upload,
  X,
  ImageIcon,
  Layout,
} from "lucide-react";
import Image from "next/image";
import { uploadImage, validateFile, errorMessage, IMAGE_ACCEPT, MAX_IMAGE_MB } from "../_lib/upload";

interface HeroContent {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url: string;
  cta_text?: string | null;
  cta_link?: string | null;
  bg_gradient?: string | null;
  type: "carousel" | "card";
  order: number;
  is_active: boolean;
}

const inputCls =
  "w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-3 outline-none focus:border-[var(--accent-metallic)]";

function HeroItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: HeroContent;
  onEdit: (item: HeroContent) => void;
  onDelete: (item: HeroContent) => void;
}) {
  return (
    <div className="relative group bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border-subtle)]">
      <div className="aspect-video relative">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className={`object-cover ${item.is_active ? "" : "opacity-50 grayscale"}`}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
            <ImageIcon />
          </div>
        )}
        {!item.is_active && (
          <span className="absolute top-2 left-2 text-xs bg-red-500/80 text-white px-2 py-0.5 rounded-full font-medium">
            Inactivo
          </span>
        )}
        {/* Always visible on touch screens; hover-reveal from md up */}
        <div className="absolute inset-0 md:bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity flex items-end justify-end md:items-center md:justify-center gap-4 p-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            aria-label={`Editar ${item.title}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            aria-label={`Eliminar ${item.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold truncate">{item.title}</h3>
        <p className="text-xs text-[var(--text-secondary)] truncate">
          {item.subtitle}
        </p>
      </div>
    </div>
  );
}

export default function AdminHeroPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<HeroContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<HeroContent>>({});
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchContent = useCallback(async () => {
    if (!token) return;
    try {
      // Admin endpoint: includes inactive slides/cards
      const data: HeroContent[] = await api.get("/admin/hero-content", token);
      setItems(data);
    } catch (error) {
      console.error("Failed to load content", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleEdit = (item: HeroContent) => {
    setCurrentItem({ ...item });
    setFormError("");
    setIsEditing(true);
  };

  const handleAddNew = (type: "carousel" | "card") => {
    setCurrentItem({
      type,
      title: "",
      subtitle: "",
      image_url: "",
      cta_text: type === "card" ? "Ver más" : "Regístrate Ahora",
      cta_link: "/",
      order: items.length,
      is_active: true,
      bg_gradient: "from-purple-900 to-indigo-900",
    });
    setFormError("");
    setIsEditing(true);
  };

  const handleDelete = async (item: HeroContent) => {
    if (!confirm(`¿Eliminar "${item.title}"? También se borrará su imagen.`)) return;
    try {
      await api.delete(`/admin/hero-content/${item.id}`, token);
      fetchContent();
    } catch (error) {
      alert(errorMessage(error, "Error al eliminar"));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || uploading) return;
    if (!currentItem.title?.trim()) {
      setFormError("El título es obligatorio.");
      return;
    }
    if (!currentItem.image_url) {
      setFormError("Sube una imagen antes de guardar.");
      return;
    }
    setFormError("");
    setIsSaving(true);
    const body = {
      title: currentItem.title.trim(),
      subtitle: currentItem.subtitle ?? null,
      image_url: currentItem.image_url,
      cta_text: currentItem.cta_text ?? null,
      cta_link: currentItem.cta_link ?? null,
      bg_gradient: currentItem.bg_gradient ?? null,
      order: currentItem.order ?? 0,
      is_active: currentItem.is_active ?? true,
    };
    try {
      if (currentItem.id) {
        await api.put(`/admin/hero-content/${currentItem.id}`, body, token);
      } else {
        await api.post("/admin/hero-content", { ...body, type: currentItem.type }, token);
      }
      setIsEditing(false);
      fetchContent();
    } catch (error) {
      setFormError(errorMessage(error, "Error al guardar"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    const validation = validateFile(file, "image", MAX_IMAGE_MB);
    if (validation) {
      setFormError(validation);
      input.value = "";
      return;
    }

    setUploading(true);
    setFormError("");
    try {
      const url = await uploadImage(file, {
        token,
        serverEndpoint: "/admin/upload-image",
        folder: "cms",
      });
      setCurrentItem((prev) => ({ ...prev, image_url: url }));
    } catch (error) {
      setFormError("Error subiendo imagen: " + errorMessage(error, "Error desconocido"));
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin" />
      </div>
    );

  const carouselItems = items.filter((i) => i.type === "carousel");
  const cardItems = items.filter((i) => i.type === "card");

  return (
    <div className="space-y-8 p-0 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Gestión de Portada
          </h1>
          <p className="text-[var(--text-secondary)]">
            Administra el carrusel principal y las tarjetas promocionales
          </p>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-4 md:p-6">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layout className="w-5 h-5 text-[var(--accent-metallic)]" />
            Carrusel Principal (Izquierda)
          </h2>
          <button
            onClick={() => handleAddNew("carousel")}
            className="px-4 py-2 bg-[var(--accent-metallic)] text-white rounded-lg text-sm hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Agregar Slide
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carouselItems.map((item) => (
            <HeroItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
          {carouselItems.length === 0 && (
            <p className="col-span-full text-sm text-[var(--text-muted)] italic">
              No hay slides todavía.
            </p>
          )}
        </div>
      </div>

      {/* Cards Section */}
      <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-4 md:p-6">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layout className="w-5 h-5 text-[var(--accent-metallic)]" />
            Tarjetas Estáticas (Derecha)
          </h2>
          {cardItems.length < 2 && (
            <button
              onClick={() => handleAddNew("card")}
              className="px-4 py-2 bg-[var(--accent-metallic)] text-white rounded-lg text-sm hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Agregar Tarjeta
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardItems.map((item) => (
            <HeroItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
          {cardItems.length === 0 && (
            <p className="col-span-full text-sm text-[var(--text-muted)] italic">
              No hay tarjetas todavía.
            </p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-[var(--bg-elevated)] max-w-2xl w-full rounded-2xl p-6 shadow-2xl border border-[var(--border-subtle)] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {currentItem.id ? "Editar Elemento" : "Nuevo Elemento"}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="text-[var(--text-muted)] hover:text-white disabled:opacity-50"
                aria-label="Cerrar"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Título *</label>
                  <input
                    value={currentItem.title || ""}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, title: e.target.value })
                    }
                    className={inputCls}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Subtítulo</label>
                  <input
                    value={currentItem.subtitle || ""}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        subtitle: e.target.value,
                      })
                    }
                    className={inputCls}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">
                    Imagen * <span className="text-xs text-[var(--text-muted)]">(JPEG/PNG/WebP, máx. {MAX_IMAGE_MB}MB; hasta 4MB se convierte a WebP)</span>
                  </label>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative w-32 h-20 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden border border-[var(--border-subtle)]">
                      {currentItem.image_url ? (
                        <Image
                          src={currentItem.image_url}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept={IMAGE_ACCEPT}
                        onChange={handleImageUpload}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || isSaving}
                        className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--bg-elevated)] flex items-center gap-2 disabled:opacity-50"
                      >
                        {uploading ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {uploading ? "Subiendo..." : "Subir Imagen"}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Texto del Botón</label>
                  <input
                    value={currentItem.cta_text || ""}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        cta_text: e.target.value,
                      })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Enlace del Botón</label>
                  <input
                    value={currentItem.cta_link || ""}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        cta_link: e.target.value,
                      })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Orden</label>
                  <input
                    type="number"
                    value={currentItem.order ?? 0}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        order: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className={inputCls}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer self-end pb-3">
                  <input
                    type="checkbox"
                    checked={currentItem.is_active ?? true}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  Activo (visible en la portada)
                </label>
              </div>

              {formError && (
                <div
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm"
                  role="alert"
                >
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-subtle)] mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl hover:bg-[var(--bg-tertiary)] disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploading}
                  className="px-6 py-2 bg-[var(--accent-metallic)] text-white rounded-xl shadow-lg hover:bg-[var(--accent-metallic-hover)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
