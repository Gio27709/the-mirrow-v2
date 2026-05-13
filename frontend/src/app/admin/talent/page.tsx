"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Plus, Music, Mic2, Disc3, Theater, Activity, Edit, Trash2, Loader2,
  DollarSign, MapPin, Image as ImageIcon, Video, Link2, X, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TalentProfile {
  id: number; user_id: number; stage_name: string; category: string;
  bio: string; image_url: string; is_active: boolean; rating: number;
  base_price?: number; price_currency?: string; price_unit?: string;
  location?: string; is_available?: boolean; gallery_urls?: string[];
  video_url?: string; instagram_url?: string; facebook_url?: string;
  website_url?: string; tiktok_url?: string; youtube_url?: string;
  included_services?: string[];
}

interface User { id: number; email: string; full_name: string; }

export default function AdminTalentPage() {
  const { token } = useAuth();
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form State - Basic
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [stageName, setStageName] = useState("");
  const [category, setCategory] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State - Pricing & Location
  const [basePrice, setBasePrice] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("USD");
  const [priceUnit, setPriceUnit] = useState("Evento");
  const [location, setLocation] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  // Form State - Media
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  // Form State - Social
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Form State - Services
  const [includedServices, setIncludedServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [talentsData, usersData, categoriesData] = await Promise.all([
        api.get("/admin/talent", token),
        api.get("/admin/users", token),
        api.get("/categories"),
      ]);
      if (talentsData) setTalents(talentsData);
      if (usersData) setUsers(usersData);
      if (categoriesData) setCategories(categoriesData);
    } catch (error) { console.error("Error fetching data:", error); }
    finally { setIsLoading(false); }
  }, [token]);

  useEffect(() => { if (token) fetchData(); }, [token, fetchData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !token) return;
    if (galleryUrls.length + files.length > 8) {
      alert("Maximo 8 imagenes en la galeria"); return;
    }
    setIsUploadingGallery(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const data = await api.upload("/admin/talent/upload-gallery", formData, token);
        setGalleryUrls(prev => [...prev, data.url]);
      }
    } catch (err) { console.error(err); alert("Error subiendo imagen"); }
    finally { setIsUploadingGallery(false); }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("El video no puede superar los 50MB");
      return;
    }
    setIsVideoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await api.upload("/admin/talent/upload-video", formData, token);
      setVideoUrl(data.url);
    } catch (err) { console.error(err); alert("Error subiendo el video"); }
    finally { setIsVideoUploading(false); }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryUrls(prev => prev.filter((_, i) => i !== index));
  };

  const addService = () => {
    if (newService.trim() && !includedServices.includes(newService.trim())) {
      setIncludedServices(prev => [...prev, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    setIncludedServices(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setEditingId(null); setSelectedUserId(""); setStageName(""); setCategory("");
    setBio(""); setImageFile(null); setPreviewUrl(null); setIsModalOpen(false);
    setBasePrice(""); setPriceCurrency("USD"); setPriceUnit("Evento");
    setLocation(""); setIsAvailable(true); setGalleryUrls([]); setVideoUrl("");
    setInstagramUrl(""); setFacebookUrl(""); setWebsiteUrl("");
    setTiktokUrl(""); setYoutubeUrl(""); setIncludedServices([]);
    setNewService(""); setShowAdvanced(false);
  };

  const handleEdit = (t: TalentProfile) => {
    setEditingId(t.id); setSelectedUserId(t.user_id); setStageName(t.stage_name);
    setCategory(t.category); setBio(t.bio); setPreviewUrl(t.image_url);
    setBasePrice(t.base_price?.toString() || ""); setPriceCurrency(t.price_currency || "USD");
    setPriceUnit(t.price_unit || "Evento"); setLocation(t.location || "");
    setIsAvailable(t.is_available ?? true); setGalleryUrls(t.gallery_urls || []);
    setVideoUrl(t.video_url || ""); setInstagramUrl(t.instagram_url || "");
    setFacebookUrl(t.facebook_url || ""); setWebsiteUrl(t.website_url || "");
    setTiktokUrl(t.tiktok_url || ""); setYoutubeUrl(t.youtube_url || "");
    setIncludedServices(t.included_services || []); setShowAdvanced(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este perfil?")) return;
    try { await api.delete(`/admin/talent/${id}`, token); fetchData(); }
    catch (error) { console.error(error); alert("Error al eliminar"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isSaving) return;
    if (!category) { alert("Debe seleccionar una categoría"); return; }
    if (!editingId && !selectedUserId) { alert("Debe seleccionar un usuario"); return; }

    setIsSaving(true);
    try {
      let imageUrl = previewUrl || "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadData = await api.upload("/admin/talent/upload-image", formData, token);
        imageUrl = uploadData.url;
      }

      const payload: any = {
        stage_name: stageName, category, bio, image_url: imageUrl,
        base_price: basePrice ? parseFloat(basePrice) : null,
        price_currency: priceCurrency, price_unit: priceUnit,
        location: location || null, is_available: isAvailable,
        gallery_urls: galleryUrls.length > 0 ? galleryUrls : null,
        video_url: videoUrl || null,
        instagram_url: instagramUrl || null, facebook_url: facebookUrl || null,
        website_url: websiteUrl || null, tiktok_url: tiktokUrl || null,
        youtube_url: youtubeUrl || null,
        included_services: includedServices.length > 0 ? includedServices : null,
      };

      if (editingId) {
        await api.put(`/admin/talent/${editingId}`, payload, token);
      } else {
        await api.post("/admin/talent", { ...payload, user_id: Number(selectedUserId) }, token);
      }
      fetchData(); resetForm();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Error al guardar");
    } finally { setIsSaving(false); }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "musicos": return <Music className="w-4 h-4 text-rose-500" />;
      case "djs": return <Disc3 className="w-4 h-4 text-cyan-500" />;
      case "cantantes": return <Mic2 className="w-4 h-4 text-fuchsia-500" />;
      case "artes-escenicas": return <Theater className="w-4 h-4 text-amber-500" />;
      case "danzas-contemporaneas": return <Activity className="w-4 h-4 text-orange-500" />;
      default: return <Music className="w-4 h-4" />;
    }
  };

  const availableUsers = users;
  const inputCls = "w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--foreground)]";
  const labelCls = "block text-sm font-medium text-[var(--text-secondary)] mb-1";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Gestión de Talentos</h1>
          <p className="text-[var(--text-secondary)]">Promueve usuarios a artistas y gestiona sus perfiles.</p>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nuevo Talento
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--foreground)]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent) => (
            <div key={talent.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--foreground)] transition-colors group">
              <div className="aspect-video bg-zinc-800 relative">
                {talent.image_url ? (
                  <img src={talent.image_url} alt={talent.stage_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600"><Music className="w-12 h-12" /></div>
                )}
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur px-2 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1">
                  {getCategoryIcon(talent.category)}
                  <span className="capitalize">{talent.category.replace(/-/g, " ")}</span>
                </div>
                {talent.base_price && (
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-green-400">
                    ${talent.base_price} {talent.price_currency}/{talent.price_unit}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-[var(--text-primary)]">{talent.stage_name}</h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">{talent.bio || "Sin biografía"}</p>
                {talent.location && <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mb-4"><MapPin className="w-3 h-3" />{talent.location}</p>}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                  <span className="text-xs text-[var(--text-secondary)]">ID: {talent.id}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(talent)} className="p-2 hover:bg-[var(--hover-bg)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors" title="Editar"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(talent.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--card-bg)] border border-[var(--border-color)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{editingId ? "Editar Perfil" : "Nuevo Perfil de Talento"}</h2>
                <button onClick={resetForm} className="text-[var(--text-secondary)] hover:text-[var(--foreground)]">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* === BASIC INFO === */}
                <div>
                  <label className={labelCls}>Usuario a Promover</label>
                  <select value={selectedUserId} onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    className={inputCls} required disabled={!!editingId}>
                    <option value="">Seleccionar Usuario...</option>
                    {availableUsers.map((u) => (<option key={u.id} value={u.id}>{u.full_name || u.email} ({u.email})</option>))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Nombre Artístico</label>
                  <input type="text" value={stageName} onChange={(e) => setStageName(e.target.value)} className={inputCls} placeholder="Ej. DJ Shadow" required />
                </div>
                <div>
                  <label className={labelCls}>Categoría</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                    <option value="">Seleccionar categoría...</option>
                    {categories.map((cat: any) => (<option key={cat.id} value={cat.slug}>{cat.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Biografía Corta</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className={`${inputCls} h-20`} placeholder="Descripción del artista..." />
                </div>
                <div>
                  <label className={labelCls}>Foto Promocional</label>
                  <div className="flex items-center gap-4">
                    {previewUrl && <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-[var(--border-color)]" />}
                    <input type="file" accept="image/*" onChange={handleImageChange}
                      className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--foreground)] file:text-[var(--background)] hover:file:opacity-90" />
                  </div>
                </div>

                {/* === ADVANCED TOGGLE === */}
                <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] border border-dashed border-[var(--border-color)] rounded-xl transition-colors">
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showAdvanced ? "Ocultar configuración avanzada" : "Configuración avanzada (Precio, Galería, Redes...)"}
                </button>

                {showAdvanced && (
                  <div className="space-y-4 pt-2">
                    {/* --- PRICING --- */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-xl space-y-3">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-400" /> Precio y Ubicación</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={labelCls}>Precio Base</label>
                          <input type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className={inputCls} placeholder="350" />
                        </div>
                        <div>
                          <label className={labelCls}>Moneda</label>
                          <select value={priceCurrency} onChange={(e) => setPriceCurrency(e.target.value)} className={inputCls}>
                            <option value="USD">USD</option><option value="EUR">EUR</option><option value="VES">VES</option><option value="COP">COP</option><option value="MXN">MXN</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Unidad</label>
                          <select value={priceUnit} onChange={(e) => setPriceUnit(e.target.value)} className={inputCls}>
                            <option value="Evento">Por Evento</option><option value="Hora">Por Hora</option><option value="Show">Por Show</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Ubicación</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} placeholder="Caracas, Venezuela" />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                        <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="rounded" />
                        Disponible para contratación
                      </label>
                    </div>

                    {/* --- GALLERY --- */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-xl space-y-3">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2"><ImageIcon className="w-4 h-4 text-pink-400" /> Galería de Eventos (máx. 8)</h4>
                      {galleryUrls.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {galleryUrls.map((url, i) => (
                            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden">
                              <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeGalleryImage(i)}
                                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {galleryUrls.length < 8 && (
                        <div className="relative">
                          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={isUploadingGallery}
                            className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-500/20 file:text-pink-400 hover:file:bg-pink-500/30 disabled:opacity-50" />
                          {isUploadingGallery && <Loader2 className="absolute right-2 top-2 w-5 h-5 animate-spin text-pink-400" />}
                        </div>
                      )}
                    </div>

                    {/* --- VIDEO --- */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-xl space-y-3">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2"><Video className="w-4 h-4 text-purple-400" /> Video Promocional</h4>
                      <div className="space-y-4">
                        <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={inputCls} placeholder="Pega un link de YouTube o URL directa..." />
                        
                        <div className="relative flex items-center justify-center w-full py-2">
                          <hr className="w-full border-[var(--border-color)]" />
                          <span className="absolute px-3 bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)] uppercase font-bold">O Sube un Video (Máx 50MB)</span>
                        </div>

                        <div className="relative">
                          <input type="file" accept="video/mp4,video/webm,video/ogg" onChange={handleVideoUpload} disabled={isVideoUploading}
                            className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30 disabled:opacity-50" />
                          {isVideoUploading && <Loader2 className="absolute right-2 top-2 w-5 h-5 animate-spin text-purple-400" />}
                        </div>
                      </div>
                    </div>

                    {/* --- SOCIAL --- */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-xl space-y-3">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2"><Link2 className="w-4 h-4 text-blue-400" /> Redes Sociales</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>Instagram</label><input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className={inputCls} placeholder="https://instagram.com/..." /></div>
                        <div><label className={labelCls}>Facebook</label><input type="url" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} className={inputCls} placeholder="https://facebook.com/..." /></div>
                        <div><label className={labelCls}>TikTok</label><input type="url" value={tiktokUrl} onChange={(e) => setTiktokUrl(e.target.value)} className={inputCls} placeholder="https://tiktok.com/@..." /></div>
                        <div><label className={labelCls}>YouTube</label><input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className={inputCls} placeholder="https://youtube.com/..." /></div>
                      </div>
                      <div><label className={labelCls}>Sitio Web</label><input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className={inputCls} placeholder="https://..." /></div>
                    </div>

                    {/* --- SERVICES --- */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-xl space-y-3">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">✦ Servicios Incluidos</h4>
                      {includedServices.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {includedServices.map((s, i) => (
                            <span key={i} className="flex items-center gap-1 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-sm rounded-full border border-indigo-500/20">
                              {s}
                              <button type="button" onClick={() => removeService(i)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input type="text" value={newService} onChange={(e) => setNewService(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addService(); } }}
                          className={inputCls} placeholder="Ej. Equipo de Sonido" />
                        <button type="button" onClick={addService}
                          className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 text-sm font-medium shrink-0">
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={resetForm} disabled={isSaving}
                    className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50">Cancelar</button>
                  <button type="submit" disabled={isSaving}
                    className="bg-[var(--foreground)] text-[var(--background)] px-6 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSaving ? (editingId ? "Guardando..." : "Creando...") : (editingId ? "Guardar Cambios" : "Crear Perfil")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
