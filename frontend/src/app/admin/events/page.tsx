"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Plus, Calendar, Clock, MapPin, Edit, Trash2, Image as ImageIcon, Star, Music, Ticket, ChevronDown, ChevronUp, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage, uploadVideo, validateFile, errorMessage, IMAGE_ACCEPT, VIDEO_ACCEPT, MAX_IMAGE_MB, MAX_VIDEO_MB } from "../_lib/upload";

interface EventZone { id: number; name: string; price: string|null; capacity: number|null; perks: string|null; is_sold_out: boolean; order: number; event_id: number; }
interface EventLineupItem { id: number; artist_name: string; set_time: string|null; role: string|null; image_url: string|null; talent_id: number|null; order: number; event_id: number; }
interface Event { id: number; title: string; type: string|null; description: string|null; date: string|null; time: string|null; location: string|null; venue_name: string|null; venue_address: string|null; city: string|null; capacity: number|null; min_age: string|null; dress_code: string|null; image_url: string|null; flyer_url: string|null; video_promo_url: string|null; price: string|null; ticket_url: string|null; free_entry: boolean; reservation_required: boolean; contact_whatsapp: string|null; contact_email: string|null; contact_phone: string|null; contact_instagram: string|null; organizer_name: string|null; is_featured: boolean; tags: string|null; is_active: boolean; zones: EventZone[]; lineup: EventLineupItem[]; }

type FieldChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => void;

const TABS = ["General","Recinto","Entradas","Contacto","Config"];

const EMPTY_FORM = { title:"",type:"",description:"",date:"",time:"",location:"",venue_name:"",venue_address:"",city:"",capacity:"",min_age:"",dress_code:"",price:"",currency:"€",ticket_url:"",video_promo_url:"",free_entry:false,reservation_required:false,contact_whatsapp:"+34 677 26 71 04",contact_email:"info@themirrow.com",contact_phone:"",contact_instagram:"",organizer_name:"",tags:"",is_featured:false,is_active:true };
type EventForm = typeof EMPTY_FORM;

const Input = ({label,name,placeholder,type="text", value, onChange, required}: {label:string;name:string;placeholder?:string;type?:string;value:string|number;onChange:FieldChange;required?:boolean}) => (
  <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
  {type==="textarea" ? <textarea name={name} value={value} onChange={onChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 text-sm" placeholder={placeholder} rows={3}/> :
  <input type={type} name={name} value={value} onChange={onChange} required={required} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 text-sm" placeholder={placeholder}/> }</div>
);

const Select = ({label,name, value, onChange, options}: {label:string;name:string;value:string|number;onChange:FieldChange;options:{label:string;value:string}[]}) => (
  <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
  <select name={name} value={value} onChange={onChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 text-sm">
    <option value="">Seleccionar...</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select></div>
);

const Check = ({label,name, checked, onChange}: {label:string;name:string;checked:boolean;onChange:FieldChange}) => (
  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name={name} checked={checked} onChange={onChange} className="w-4 h-4 rounded bg-[var(--bg-secondary)]"/><span className="text-sm font-medium text-[var(--text-primary)]">{label}</span></label>
);

export default function AdminEventsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editingId, setEditingId] = useState<number|null>(null);
  const [expandedId, setExpandedId] = useState<number|null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Form state
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [previewUrl, setPreviewUrl] = useState<string|null>(null);
  const [videoFile, setVideoFile] = useState<File|null>(null);

  // Zone/Lineup inline state
  const [zoneName, setZoneName] = useState("");
  const [zonePrice, setZonePrice] = useState("");
  const [zonePerks, setZonePerks] = useState("");
  const [artistName, setArtistName] = useState("");
  const [artistRole, setArtistRole] = useState("");
  const [artistSetTime, setArtistSetTime] = useState("");
  const [isMutating, setIsMutating] = useState(false);

  const fetchEvents = useCallback(async () => {
    // Trailing slash avoids a 307 redirect; no is_active filter so inactive events are listed too
    try { const data: Event[] = await api.get("/events/"); if(data) setEvents(data); } catch(e) { console.error(e); } finally { setIsLoading(false); }
  }, []);
  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleChange: FieldChange = (e) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(p => ({ ...p, [name]: type==="checkbox" ? checked : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const err = validateFile(file, "image", MAX_IMAGE_MB);
    if(err){ alert(err); e.target.value = ""; return; }
    setImageFile(file); setPreviewUrl(URL.createObjectURL(file));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const err = validateFile(file, "video", MAX_VIDEO_MB);
    if(err){ alert(err); e.target.value = ""; return; }
    setVideoFile(file); setForm(p => ({ ...p, video_promo_url: "Archivo local: " + file.name }));
  };

  const resetForm = () => {
    setEditingId(null); setActiveTab(0); setImageFile(null); setPreviewUrl(null); setVideoFile(null); setIsModalOpen(false); setFormError("");
    setForm(EMPTY_FORM);
  };

  const handleEdit = (ev: Event) => {
    setEditingId(ev.id);
    setFormError("");
    let priceVal = ev.price || "";
    let currVal = "€";
    if(priceVal.includes("$")) { currVal = "$"; priceVal = priceVal.replace("$","").trim(); }
    else if(priceVal.includes("€")) { currVal = "€"; priceVal = priceVal.replace("€","").trim(); }
    setForm({ title:ev.title||"",type:ev.type||"",description:ev.description||"",date:ev.date||"",time:ev.time||"",location:ev.location||"",venue_name:ev.venue_name||"",venue_address:ev.venue_address||"",city:ev.city||"",capacity:ev.capacity?.toString()||"",min_age:ev.min_age||"",dress_code:ev.dress_code||"",price:priceVal,currency:currVal,ticket_url:ev.ticket_url||"",video_promo_url:ev.video_promo_url||"",free_entry:ev.free_entry||false,reservation_required:ev.reservation_required||false,contact_whatsapp:ev.contact_whatsapp||"",contact_email:ev.contact_email||"",contact_phone:ev.contact_phone||"",contact_instagram:ev.contact_instagram||"",organizer_name:ev.organizer_name||"",tags:ev.tags||"",is_featured:ev.is_featured||false,is_active:ev.is_active!==false });
    setPreviewUrl(ev.image_url||null);
    setImageFile(null); setVideoFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (ev: Event) => {
    if(!window.confirm(`¿Eliminar el evento "${ev.title}"? Esta acción no se puede deshacer.`)) return;
    try { await api.delete(`/events/${ev.id}`, token); fetchEvents(); } catch(e) { console.error(e); alert(errorMessage(e, "No se pudo eliminar el evento")); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!token || isSaving) return;
    if(!form.title.trim()) { setActiveTab(0); setFormError("El título del evento es obligatorio."); return; }
    setFormError("");
    setIsSaving(true);
    try {
      let imageUrl = imageFile ? "" : (previewUrl||"");
      if(imageFile){
        imageUrl = await uploadImage(imageFile, { token, serverEndpoint: "/admin/upload-image?folder=events", folder: "events" });
      }

      let videoUrl = form.video_promo_url||"";
      if(videoFile){
        videoUrl = await uploadVideo(videoFile, { token, folder: "events/videos" });
      } else if (videoUrl.startsWith("Archivo local:")) {
        videoUrl = "";
      }

      const { currency, ...rest } = form;
      const finalPrice = form.price ? `${currency} ${form.price}` : "";
      const payload = { ...rest, title: form.title.trim(), price: finalPrice, image_url: imageUrl || null, video_promo_url: videoUrl || null, capacity: form.capacity ? parseInt(form.capacity, 10) : null };
      if(editingId){ await api.put(`/events/${editingId}`,payload,token); } else { await api.post("/events/",payload,token); }
      fetchEvents(); resetForm();
    } catch(err) {
      console.error(err);
      setFormError(errorMessage(err, "No se pudo guardar el evento"));
    } finally { setIsSaving(false); }
  };

  // Zone handlers
  const addZone = async (eventId: number) => {
    if(!zoneName.trim()||!token||isMutating) return;
    setIsMutating(true);
    try { await api.post(`/events/${eventId}/zones`,{name:zoneName.trim(),price:zonePrice,perks:zonePerks},token); setZoneName(""); setZonePrice(""); setZonePerks(""); fetchEvents(); }
    catch(e) { console.error(e); alert(errorMessage(e, "No se pudo añadir la zona")); }
    finally { setIsMutating(false); }
  };
  const deleteZone = async (eventId: number, zone: EventZone) => {
    if(!token) return;
    if(!window.confirm(`¿Eliminar la zona "${zone.name}"?`)) return;
    try { await api.delete(`/events/${eventId}/zones/${zone.id}`,token); fetchEvents(); } catch(e) { console.error(e); alert(errorMessage(e, "No se pudo eliminar la zona")); }
  };

  // Lineup handlers
  const addArtist = async (eventId: number) => {
    if(!artistName.trim()||!token||isMutating) return;
    setIsMutating(true);
    try { await api.post(`/events/${eventId}/lineup`,{artist_name:artistName.trim(),role:artistRole,set_time:artistSetTime},token); setArtistName(""); setArtistRole(""); setArtistSetTime(""); fetchEvents(); }
    catch(e) { console.error(e); alert(errorMessage(e, "No se pudo añadir el artista")); }
    finally { setIsMutating(false); }
  };
  const deleteArtist = async (eventId: number, artist: EventLineupItem) => {
    if(!token) return;
    if(!window.confirm(`¿Quitar a "${artist.artist_name}" del lineup?`)) return;
    try { await api.delete(`/events/${eventId}/lineup/${artist.id}`,token); fetchEvents(); } catch(e) { console.error(e); alert(errorMessage(e, "No se pudo eliminar el artista")); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-[var(--text-primary)]">Gestión de Eventos</h1><p className="text-[var(--text-secondary)]">Crea y administra la cartelera de eventos con zonas, lineup y contacto.</p></div>
        <button onClick={()=>{resetForm();setIsModalOpen(true);}} className="flex items-center justify-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"><Plus className="w-4 h-4"/>Nuevo Evento</button>
      </div>

      {isLoading ? <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--foreground)]"></div></div> : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
              {/* Card Header */}
              <div className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4">
                <div className="w-20 h-14 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                  {event.image_url ? <img src={event.image_url} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><ImageIcon className="w-6 h-6"/></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[var(--text-primary)] truncate">{event.title}</h3>
                    {event.is_featured && <Star className="w-4 h-4 text-purple-400 fill-purple-400 shrink-0"/>}
                    {!event.is_active && <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full shrink-0">Inactivo</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
                    {event.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{event.date}</span>}
                    {event.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{event.time}</span>}
                    {(event.venue_name||event.location) && <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{event.venue_name||event.location}</span>}
                    {event.zones?.length>0 && <span className="flex items-center gap-1"><Ticket className="w-3 h-3"/>{event.zones.length} zonas</span>}
                    {event.lineup?.length>0 && <span className="flex items-center gap-1"><Music className="w-3 h-3"/>{event.lineup.length} artistas</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-auto">
                  <span className="text-sm font-bold text-[var(--text-primary)] mr-2">{event.free_entry === true ? "Gratis" : event.price||"—"}</span>
                  <button onClick={()=>handleEdit(event)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors" title="Editar" aria-label="Editar evento"><Edit className="w-4 h-4"/></button>
                  <button onClick={()=>setExpandedId(expandedId===event.id?null:event.id)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-secondary)] transition-colors" title="Zonas/Lineup" aria-label="Zonas y lineup">{expandedId===event.id?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}</button>
                  <button onClick={()=>handleDelete(event)} className="p-2 hover:bg-red-500/10 rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors" title="Eliminar" aria-label="Eliminar evento"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>

              {/* Expanded: Zones & Lineup */}
              <AnimatePresence>
                {expandedId===event.id && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="border-t border-[var(--border-subtle)] overflow-hidden">
                    <div className="p-4 grid md:grid-cols-2 gap-6">
                      {/* Zones */}
                      <div>
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Ticket className="w-4 h-4 text-pink-400"/>Zonas / Entradas</h4>
                        <div className="space-y-2 mb-3">
                          {event.zones?.map(z=>(
                            <div key={z.id} className="flex items-center justify-between gap-2 bg-[var(--bg-secondary)] rounded-lg px-3 py-2 text-sm">
                              <div className="min-w-0"><span className="font-medium">{z.name}</span>{z.price&&<span className="text-[var(--text-secondary)] ml-2">— {z.price}</span>}{z.is_sold_out&&<span className="text-red-400 ml-2 text-xs">(Agotado)</span>}</div>
                              <button onClick={()=>deleteZone(event.id,z)} className="p-1 text-red-400 hover:text-red-300 shrink-0" aria-label={`Eliminar zona ${z.name}`}><X className="w-3 h-3"/></button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <input value={zoneName} onChange={e=>setZoneName(e.target.value)} placeholder="Zona" className="flex-1 min-w-[80px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <input value={zonePrice} onChange={e=>setZonePrice(e.target.value)} placeholder="Precio" className="w-20 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <input value={zonePerks} onChange={e=>setZonePerks(e.target.value)} placeholder="Beneficios" className="flex-1 min-w-[100px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <button onClick={()=>addZone(event.id)} disabled={isMutating||!zoneName.trim()} className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-50" aria-label="Añadir zona"><Plus className="w-3 h-3"/></button>
                        </div>
                      </div>
                      {/* Lineup */}
                      <div>
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Music className="w-4 h-4 text-purple-400"/>Lineup</h4>
                        <div className="space-y-2 mb-3">
                          {event.lineup?.map(a=>(
                            <div key={a.id} className="flex items-center justify-between gap-2 bg-[var(--bg-secondary)] rounded-lg px-3 py-2 text-sm">
                              <div className="min-w-0"><span className="font-medium">{a.artist_name}</span>{a.role&&<span className="text-purple-400 ml-2 text-xs">({a.role})</span>}{a.set_time&&<span className="text-[var(--text-secondary)] ml-2">{a.set_time}</span>}</div>
                              <button onClick={()=>deleteArtist(event.id,a)} className="p-1 text-red-400 hover:text-red-300 shrink-0" aria-label={`Quitar ${a.artist_name}`}><X className="w-3 h-3"/></button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <input value={artistName} onChange={e=>setArtistName(e.target.value)} placeholder="Artista" className="flex-1 min-w-[80px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <input value={artistRole} onChange={e=>setArtistRole(e.target.value)} placeholder="Rol" className="w-24 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <input value={artistSetTime} onChange={e=>setArtistSetTime(e.target.value)} placeholder="Horario" className="w-24 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <button onClick={()=>addArtist(event.id)} disabled={isMutating||!artistName.trim()} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50" aria-label="Añadir artista"><Plus className="w-3 h-3"/></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {events.length===0 && <div className="py-12 text-center text-[var(--text-secondary)] border-2 border-dashed border-[var(--border-subtle)] rounded-2xl">No hay eventos creados todavía.</div>}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}} className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8">
              <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center sticky top-0 bg-[var(--bg-elevated)] z-10">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{editingId?"Editar Evento":"Nuevo Evento"}</h2>
                <button onClick={resetForm} disabled={isSaving} className="text-[var(--text-secondary)] hover:text-[var(--foreground)] disabled:opacity-50" aria-label="Cerrar">✕</button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[var(--border-subtle)] px-6 overflow-x-auto">
                {TABS.map((t,i)=><button key={t} type="button" onClick={()=>setActiveTab(i)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab===i?"border-purple-500 text-purple-400":"border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>{t}</button>)}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {activeTab===0 && <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Título del Evento *" name="title" value={form.title} onChange={handleChange} placeholder="Ej. Festival Beats & Lights"/>
                    <Select label="Tipo de Evento" name="type" value={form.type} onChange={handleChange} options={[
                      {label: "Festival", value: "Festival"},
                      {label: "Concierto", value: "Concierto"},
                      {label: "Club / DJ Set", value: "Club / DJ Set"},
                      {label: "Cultural", value: "Cultural"},
                      {label: "Corporativo", value: "Corporativo"},
                      {label: "Otro", value: "Otro"}
                    ]}/>
                  </div>
                  <Input label="Descripción" name="description" value={form.description} onChange={handleChange} type="textarea" placeholder="Descripción detallada del evento..."/>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Fecha" name="date" value={form.date} onChange={handleChange} type="date"/>
                    <Input label="Hora" name="time" value={form.time} onChange={handleChange} type="time"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Imagen del Evento <span className="text-xs text-[var(--text-muted)] font-normal ml-1">(Recomendado: 1200x800 px, JPEG/PNG/WebP, Max {MAX_IMAGE_MB}MB)</span>
                    </label>
                    <div className="flex items-center gap-4">{previewUrl&&<img src={previewUrl} alt="Preview" className="w-24 h-16 rounded-lg object-cover border border-[var(--border-subtle)]"/>}<input type="file" accept={IMAGE_ACCEPT} onChange={handleImageChange} className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:opacity-90"/></div>
                  </div>
                </>}
                {activeTab===1 && <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nombre del Recinto" name="venue_name" value={form.venue_name} onChange={handleChange} placeholder="Ej. Arena Central"/>
                    <Input label="Ciudad" name="city" value={form.city} onChange={handleChange} placeholder="Ej. Madrid"/>
                  </div>
                  <Input label="Dirección completa" name="venue_address" value={form.venue_address} onChange={handleChange} placeholder="Ej. Calle Gran Vía 123"/>
                  <Input label="Ubicación (Antiguo)" name="location" value={form.location} onChange={handleChange} placeholder="Ej. Teatro Principal"/>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input label="Aforo máximo" name="capacity" value={form.capacity} onChange={handleChange} placeholder="Ej. 2000" type="number"/>
                    <Input label="Edad mínima" name="min_age" value={form.min_age} onChange={handleChange} placeholder="Ej. +18"/>
                    <Input label="Código de vestimenta" name="dress_code" value={form.dress_code} onChange={handleChange} placeholder="Ej. Elegante Sport"/>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">El aforo limita las reservas gratuitas: cuando se alcanza, no se aceptan más.</p>
                </>}
                {activeTab===2 && <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <div className="w-1/3"><Select label="Moneda" name="currency" value={form.currency} onChange={handleChange} options={[{label:"EUR (€)",value:"€"},{label:"USD ($)",value:"$"}]}/></div>
                      <div className="w-2/3"><Input label="Precio Base" name="price" value={form.price} onChange={handleChange} placeholder="Ej. 25" type="number"/></div>
                    </div>
                    <Input label="Enlace de venta (externo)" name="ticket_url" value={form.ticket_url} onChange={handleChange} placeholder="https://eventbrite.com/..."/>
                  </div>
                  <Input label="Video promocional (URL YouTube)" name="video_promo_url" value={form.video_promo_url} onChange={handleChange} placeholder="https://youtube.com/... o subir archivo"/>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">O subir un video propio (Max {MAX_VIDEO_MB}MB, MP4/WebM/MOV)</label>
                    <input type="file" accept={VIDEO_ACCEPT} onChange={handleVideoChange} className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:opacity-90"/>
                  </div>
                  <div className="flex flex-wrap gap-6 pt-2">
                    <Check label="Entrada Libre" name="free_entry" checked={form.free_entry} onChange={handleChange}/>
                    <Check label="Requiere Reserva" name="reservation_required" checked={form.reservation_required} onChange={handleChange}/>
                  </div>
                </>}
                {activeTab===3 && <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="WhatsApp" name="contact_whatsapp" value={form.contact_whatsapp} onChange={handleChange} placeholder="+34 677 26 71 04"/>
                    <Input label="Email" name="contact_email" value={form.contact_email} onChange={handleChange} placeholder="info@themirrow.com"/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Teléfono" name="contact_phone" value={form.contact_phone} onChange={handleChange} placeholder="+34 600 000 000"/>
                    <Input label="Instagram" name="contact_instagram" value={form.contact_instagram} onChange={handleChange} placeholder="@themirrow"/>
                  </div>
                  <Input label="Organizador / Promotora" name="organizer_name" value={form.organizer_name} onChange={handleChange} placeholder="Ej. The Mirrow Events"/>
                </>}
                {activeTab===4 && <>
                  <Input label="Etiquetas (separadas por coma)" name="tags" value={form.tags} onChange={handleChange} placeholder="Ej. Electrónica, VIP, Al aire libre"/>
                  <div className="flex flex-wrap gap-6 pt-2">
                    <Check label="Evento Destacado" name="is_featured" checked={form.is_featured} onChange={handleChange}/>
                    <Check label="Activo (Visible)" name="is_active" checked={form.is_active} onChange={handleChange}/>
                  </div>
                </>}

                {formError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm" role="alert">{formError}</div>}

                <div className="pt-4 flex flex-wrap justify-between items-center gap-3 border-t border-[var(--border-subtle)] mt-6">
                  <div className="flex gap-2">{activeTab>0&&<button type="button" onClick={()=>setActiveTab(p=>p-1)} className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)]">← Anterior</button>}</div>
                  <div className="flex gap-3">
                    <button type="button" onClick={resetForm} disabled={isSaving} className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50">Cancelar</button>
                    {activeTab<TABS.length-1 && <button type="button" onClick={()=>setActiveTab(p=>p+1)} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-purple-700">Siguiente →</button>}
                    {(activeTab===TABS.length-1 || editingId) && <button type="submit" disabled={isSaving} className="bg-[var(--foreground)] text-[var(--background)] px-6 py-2 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">{isSaving && <Loader2 className="w-4 h-4 animate-spin"/>}{isSaving ? (videoFile ? "Subiendo video..." : "Guardando...") : (editingId?"Guardar Cambios":"Crear Evento")}</button>}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
