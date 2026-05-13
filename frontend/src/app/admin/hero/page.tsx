"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
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

interface HeroContent {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  bg_gradient?: string;
  type: "carousel" | "card";
  order: number;
  is_active: boolean;
}

export default function AdminHeroPage() {
  const [items, setItems] = useState<HeroContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<HeroContent>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api.get("/hero-content", token);
      setItems(data);
    } catch (error) {
      console.error("Failed to load content", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: HeroContent) => {
    setCurrentItem({ ...item });
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
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este elemento?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/hero-content/${id}`, token);
      fetchContent();
    } catch {
      alert("Error al eliminar");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (currentItem.id) {
        await api.put(
          `/admin/hero-content/${currentItem.id}`,
          currentItem,
          token,
        );
      } else {
        await api.post("/admin/hero-content", currentItem, token);
      }
      setIsEditing(false);
      fetchContent();
    } catch {
      alert("Error al guardar");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      // Direct fetch as api wrapper might need update for generic upload
      const res = await fetch("http://localhost:8000/admin/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      setCurrentItem({ ...currentItem, image_url: data.url });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      alert("Error subiendo imagen: " + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8 p-6">
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
      <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
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
          {items
            .filter((i) => i.type === "carousel")
            .map((item) => (
              <div
                key={item.id}
                className="relative group bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border-subtle)]"
              >
                <div className="aspect-video relative">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                      <ImageIcon />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
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
            ))}
        </div>
      </div>

      {/* Cards Section */}
      <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layout className="w-5 h-5 text-[var(--accent-metallic)]" />
            Tarjetas Estáticas (Derecha)
          </h2>
          {items.filter((i) => i.type === "card").length < 2 && (
            <button
              onClick={() => handleAddNew("card")}
              className="px-4 py-2 bg-[var(--accent-metallic)] text-white rounded-lg text-sm hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Agregar Tarjeta
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items
            .filter((i) => i.type === "card")
            .map((item) => (
              <div
                key={item.id}
                className="relative group bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border-subtle)]"
              >
                <div className="aspect-video relative">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                      <ImageIcon />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
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
            ))}
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
                className="text-[var(--text-muted)] hover:text-white"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Título</label>
                  <input
                    value={currentItem.title}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, title: e.target.value })
                    }
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-3 outline-none focus:border-[var(--accent-metallic)]"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Subtítulo</label>
                  <input
                    value={currentItem.subtitle || ""}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        subtitle: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-3 outline-none focus:border-[var(--accent-metallic)]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm mb-1">
                    Imagen (Se convertirá a WebP)
                  </label>
                  <div className="flex gap-4 items-center">
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
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--bg-elevated)] flex items-center gap-2"
                      >
                        {uploading ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        Subir Imagen
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
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-3 outline-none focus:border-[var(--accent-metallic)]"
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
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-3 outline-none focus:border-[var(--accent-metallic)]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-subtle)] mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-xl hover:bg-[var(--bg-tertiary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[var(--accent-metallic)] text-white rounded-xl shadow-lg hover:bg-[var(--accent-metallic-hover)]"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
