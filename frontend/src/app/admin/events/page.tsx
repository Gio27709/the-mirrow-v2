"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Plus, Calendar, Clock, MapPin, Edit, Trash2, Image as ImageIcon, Star, Users, Music, Ticket, MessageCircle, Mail, ChevronDown, ChevronUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EventZone { id: number; name: string; price: string; capacity: number|null; perks: string; is_sold_out: boolean; order: number; event_id: number; }
interface EventLineupItem { id: number; artist_name: string; set_time: string; role: string; image_url: string; talent_id: number|null; order: number; event_id: number; }
interface Event { id: number; title: string; type: string; description: string; date: string; time: string; location: string; venue_name: string; venue_address: string; city: string; capacity: number|null; min_age: string; dress_code: string; image_url: string; flyer_url: string; video_promo_url: string; price: string; ticket_url: string; free_entry: boolean; reservation_required: boolean; contact_whatsapp: string; contact_email: string; contact_phone: string; contact_instagram: string; organizer_name: string; is_featured: boolean; tags: string; is_active: boolean; zones: EventZone[]; lineup: EventLineupItem[]; }

const TABS = ["General","Recinto","Entradas","Contacto","Config"];

const Input = ({label,name,placeholder,type="text", value, onChange}: {label:string;name:string;placeholder?:string;type?:string;value:string|number;onChange:any}) => (
  <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
  {type==="textarea" ? <textarea name={name} value={value} onChange={onChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 text-sm" placeholder={placeholder} rows={3}/> :
  <input type={type} name={name} value={value} onChange={onChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 text-sm" placeholder={placeholder}/> }</div>
);

const Select = ({label,name, value, onChange, options}: {label:string;name:string;value:string|number;onChange:any;options:{label:string;value:string}[]}) => (
  <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
  <select name={name} value={value} onChange={onChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 text-sm">
    <option value="">Seleccionar...</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select></div>
);

const Check = ({label,name, checked, onChange}: {label:string;name:string;checked:boolean;onChange:any}) => (
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

  // Form state
  const [form, setForm] = useState({ title:"",type:"",description:"",date:"",time:"",location:"",venue_name:"",venue_address:"",city:"",capacity:"",min_age:"",dress_code:"",price:"",currency:"€",ticket_url:"",video_promo_url:"",free_entry:false,reservation_required:false,contact_whatsapp:"+34 677 26 71 04",contact_email:"info@themirrow.com",contact_phone:"",contact_instagram:"",organizer_name:"",tags:"",is_featured:false,is_active:true });
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

  const fetchEvents = useCallback(async () => {
    try { const data = await api.get("/events"); if(data) setEvents(data); } catch(e) { console.error(e); } finally { setIsLoading(false); }
  }, []);
  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(p => ({ ...p, [name]: type==="checkbox" ? checked : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){ setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){ setVideoFile(file); setForm(p => ({ ...p, video_promo_url: "Archivo local: " + file.name })); }
  };

  const resetForm = () => {
    setEditingId(null); setActiveTab(0); setImageFile(null); setPreviewUrl(null); setVideoFile(null); setIsModalOpen(false);
    setForm({ title:"",type:"",description:"",date:"",time:"",location:"",venue_name:"",venue_address:"",city:"",capacity:"",min_age:"",dress_code:"",price:"",currency:"€",ticket_url:"",video_promo_url:"",free_entry:false,reservation_required:false,contact_whatsapp:"+34 677 26 71 04",contact_email:"info@themirrow.com",contact_phone:"",contact_instagram:"",organizer_name:"",tags:"",is_featured:false,is_active:true });
  };

  const handleEdit = (ev: Event) => {
    setEditingId(ev.id);
    let priceVal = ev.price || "";
    let currVal = "€";
    if(priceVal.includes("$")) { currVal = "$"; priceVal = priceVal.replace("$","").trim(); }
    else if(priceVal.includes("€")) { currVal = "€"; priceVal = priceVal.replace("€","").trim(); }
    setForm({ title:ev.title||"",type:ev.type||"",description:ev.description||"",date:ev.date||"",time:ev.time||"",location:ev.location||"",venue_name:ev.venue_name||"",venue_address:ev.venue_address||"",city:ev.city||"",capacity:ev.capacity?.toString()||"",min_age:ev.min_age||"",dress_code:ev.dress_code||"",price:priceVal,currency:currVal,ticket_url:ev.ticket_url||"",video_promo_url:ev.video_promo_url||"",free_entry:ev.free_entry||false,reservation_required:ev.reservation_required||false,contact_whatsapp:ev.contact_whatsapp||"",contact_email:ev.contact_email||"",contact_phone:ev.contact_phone||"",contact_instagram:ev.contact_instagram||"",organizer_name:ev.organizer_name||"",tags:ev.tags||"",is_featured:ev.is_featured||false,is_active:ev.is_active!==false });
    setPreviewUrl(ev.image_url||null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(!window.confirm("¿Eliminar este evento?")) return;
    try { await api.delete(`/events/${id}`, token); fetchEvents(); } catch(e) { console.error(e); alert("Error al eliminar"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!token) return;
    try {
      let imageUrl = previewUrl||"";
      if(imageFile){ const fd = new FormData(); fd.append("file",imageFile); const r = await api.upload("/admin/talent/upload-image",fd,token); imageUrl = r.url; }
      
      let videoUrl = form.video_promo_url||"";
      if(videoFile){ 
        const fd = new FormData(); fd.append("file",videoFile); 
        const r = await api.upload("/events/upload-video",fd,token); 
        videoUrl = r.url; 
      } else if (videoUrl.startsWith("Archivo local:")) {
        videoUrl = "";
      }

      const finalPrice = form.price ? `${form.currency} ${form.price}` : "";
      const payload = { ...form, price: finalPrice, image_url: imageUrl, video_promo_url: videoUrl, capacity: form.capacity ? parseInt(form.capacity as string) : null };
      if(editingId){ await api.put(`/events/${editingId}`,payload,token); } else { await api.post("/events/",payload,token); }
      fetchEvents(); resetForm();
    } catch(e) { console.error(e); alert("Error al guardar"); }
  };

  // Zone handlers
  const addZone = async (eventId: number) => {
    if(!zoneName.trim()||!token) return;
    try { await api.post(`/events/${eventId}/zones`,{name:zoneName,price:zonePrice,perks:zonePerks},token); setZoneName(""); setZonePrice(""); setZonePerks(""); fetchEvents(); } catch(e) { console.error(e); }
  };
  const deleteZone = async (eventId: number, zoneId: number) => {
    if(!token) return;
    try { await api.delete(`/events/${eventId}/zones/${zoneId}`,token); fetchEvents(); } catch(e) { console.error(e); }
  };

  // Lineup handlers
  const addArtist = async (eventId: number) => {
    if(!artistName.trim()||!token) return;
    try { await api.post(`/events/${eventId}/lineup`,{artist_name:artistName,role:artistRole,set_time:artistSetTime},token); setArtistName(""); setArtistRole(""); setArtistSetTime(""); fetchEvents(); } catch(e) { console.error(e); }
  };
  const deleteArtist = async (eventId: number, artistId: number) => {
    if(!token) return;
    try { await api.delete(`/events/${eventId}/lineup/${artistId}`,token); fetchEvents(); } catch(e) { console.error(e); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-[var(--text-primary)]">Gestión de Eventos</h1><p className="text-[var(--text-secondary)]">Crea y administra la cartelera de eventos con zonas, lineup y contacto.</p></div>
        <button onClick={()=>{resetForm();setIsModalOpen(true);}} className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"><Plus className="w-4 h-4"/>Nuevo Evento</button>
      </div>

      {isLoading ? <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--foreground)]"></div></div> : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center gap-4 p-4">
                <div className="w-20 h-14 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                  {event.image_url ? <img src={event.image_url} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><ImageIcon className="w-6 h-6"/></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[var(--text-primary)] truncate">{event.title}</h3>
                    {event.is_featured && <Star className="w-4 h-4 text-purple-400 fill-purple-400 shrink-0"/>}
                    {!event.is_active && <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full shrink-0">Inactivo</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                    {event.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{event.date}</span>}
                    {event.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{event.time}</span>}
                    {(event.venue_name||event.location) && <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{event.venue_name||event.location}</span>}
                    {event.zones?.length>0 && <span className="flex items-center gap-1"><Ticket className="w-3 h-3"/>{event.zones.length} zonas</span>}
                    {event.lineup?.length>0 && <span className="flex items-center gap-1"><Music className="w-3 h-3"/>{event.lineup.length} artistas</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-sm font-bold text-[var(--text-primary)] mr-2">{event.free_entry === true ? "Gratis" : event.price||"—"}</span>
                  <button onClick={()=>handleEdit(event)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors" title="Editar"><Edit className="w-4 h-4"/></button>
                  <button onClick={()=>setExpandedId(expandedId===event.id?null:event.id)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-secondary)] transition-colors" title="Zonas/Lineup">{expandedId===event.id?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}</button>
                  <button onClick={()=>handleDelete(event.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors" title="Eliminar"><Trash2 className="w-4 h-4"/></button>
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
                            <div key={z.id} className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg px-3 py-2 text-sm">
                              <div><span className="font-medium">{z.name}</span>{z.price&&<span className="text-[var(--text-secondary)] ml-2">— {z.price}</span>}{z.is_sold_out&&<span className="text-red-400 ml-2 text-xs">(Agotado)</span>}</div>
                              <button onClick={()=>deleteZone(event.id,z.id)} className="text-red-400 hover:text-red-300"><X className="w-3 h-3"/></button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <input value={zoneName} onChange={e=>setZoneName(e.target.value)} placeholder="Zona" className="flex-1 min-w-[80px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <input value={zonePrice} onChange={e=>setZonePrice(e.target.value)} placeholder="Precio" className="w-20 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <input value={zonePerks} onChange={e=>setZonePerks(e.target.value)} placeholder="Beneficios" className="flex-1 min-w-[100px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <button onClick={()=>addZone(event.id)} className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700"><Plus className="w-3 h-3"/></button>
                        </div>
                      </div>
                      {/* Lineup */}
                      <div>
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Music className="w-4 h-4 text-purple-400"/>Lineup</h4>
                        <div className="space-y-2 mb-3">
                          {event.lineup?.map(a=>(
                            <div key={a.id} className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg px-3 py-2 text-sm">
                              <div><span className="font-medium">{a.artist_name}</span>{a.role&&<span className="text-purple-400 ml-2 text-xs">({a.role})</span>}{a.set_time&&<span className="text-[var(--text-secondary)] ml-2">{a.set_time}</span>}</div>
                              <button onClick={()=>deleteArtist(event.id,a.id)} className="text-red-400 hover:text-red-300"><X className="w-3 h-3"/></button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <input value={artistName} onChange={e=>setArtistName(e.target.value)} placeholder="Artista" className="flex-1 min-w-[80px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <input value={artistRole} onChange={e=>setArtistRole(e.target.value)} placeholder="Rol" className="w-24 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <input value={artistSetTime} onChange={e=>setArtistSetTime(e.target.value)} placeholder="Horario" className="w-24 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none"/>
                          <button onClick={()=>addArtist(event.id)} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"><Plus className="w-3 h-3"/></button>
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
                <button onClick={resetForm} className="text-[var(--text-secondary)] hover:text-[var(--foreground)]">✕</button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[var(--border-subtle)] px-6 overflow-x-auto">
                {TABS.map((t,i)=><button key={t} onClick={()=>setActiveTab(i)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab===i?"border-purple-500 text-purple-400":"border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>{t}</button>)}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {activeTab===0 && <>
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Fecha" name="date" value={form.date} onChange={handleChange} type="date"/>
                    <Input label="Hora" name="time" value={form.time} onChange={handleChange} type="time"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Imagen del Evento <span className="text-xs text-[var(--text-muted)] font-normal ml-1">(Recomendado: 1200x800 px, Max 5MB)</span>
                    </label>
                    <div className="flex items-center gap-4">{previewUrl&&<img src={previewUrl} alt="Preview" className="w-24 h-16 rounded-lg object-cover border border-[var(--border-subtle)]"/>}<input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:opacity-90"/></div>
                  </div>
                </>}
                {activeTab===1 && <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Nombre del Recinto" name="venue_name" value={form.venue_name} onChange={handleChange} placeholder="Ej. Arena Central"/>
                    <Input label="Ciudad" name="city" value={form.city} onChange={handleChange} placeholder="Ej. Madrid"/>
                  </div>
                  <Input label="Dirección completa" name="venue_address" value={form.venue_address} onChange={handleChange} placeholder="Ej. Calle Gran Vía 123"/>
                  <Input label="Ubicación (Antiguo)" name="location" value={form.location} onChange={handleChange} placeholder="Ej. Teatro Principal"/>
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="Aforo máximo" name="capacity" value={form.capacity} onChange={handleChange} placeholder="Ej. 2000" type="number"/>
                    <Input label="Edad mínima" name="min_age" value={form.min_age} onChange={handleChange} placeholder="Ej. +18"/>
                    <Input label="Código de vestimenta" name="dress_code" value={form.dress_code} onChange={handleChange} placeholder="Ej. Elegante Sport"/>
                  </div>
                </>}
                {activeTab===2 && <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <div className="w-1/3"><Select label="Moneda" name="currency" value={(form as any).currency} onChange={handleChange} options={[{label:"EUR (€)",value:"€"},{label:"USD ($)",value:"$"}]}/></div>
                      <div className="w-2/3"><Input label="Precio Base" name="price" value={form.price} onChange={handleChange} placeholder="Ej. 25" type="number"/></div>
                    </div>
                    <Input label="Enlace de venta (externo)" name="ticket_url" value={form.ticket_url} onChange={handleChange} placeholder="https://eventbrite.com/..."/>
                  </div>
                  <Input label="Video promocional (URL YouTube)" name="video_promo_url" value={form.video_promo_url} onChange={handleChange} placeholder="https://youtube.com/... o subir archivo"/>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">O subir un video propio (Max 50MB, MP4)</label>
                    <input type="file" accept="video/*" onChange={handleVideoChange} className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:opacity-90"/>
                  </div>
                  <div className="flex gap-6 pt-2">
                    <Check label="Entrada Libre" name="free_entry" checked={form.free_entry} onChange={handleChange}/>
                    <Check label="Requiere Reserva" name="reservation_required" checked={form.reservation_required} onChange={handleChange}/>
                  </div>
                </>}
                {activeTab===3 && <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="WhatsApp" name="contact_whatsapp" value={form.contact_whatsapp} onChange={handleChange} placeholder="+34 677 26 71 04"/>
                    <Input label="Email" name="contact_email" value={form.contact_email} onChange={handleChange} placeholder="info@themirrow.com"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Teléfono" name="contact_phone" value={form.contact_phone} onChange={handleChange} placeholder="+34 600 000 000"/>
                    <Input label="Instagram" name="contact_instagram" value={form.contact_instagram} onChange={handleChange} placeholder="@themirrow"/>
                  </div>
                  <Input label="Organizador / Promotora" name="organizer_name" value={form.organizer_name} onChange={handleChange} placeholder="Ej. The Mirrow Events"/>
                </>}
                {activeTab===4 && <>
                  <Input label="Etiquetas (separadas por coma)" name="tags" value={form.tags} onChange={handleChange} placeholder="Ej. Electrónica, VIP, Al aire libre"/>
                  <div className="flex gap-6 pt-2">
                    <Check label="Evento Destacado" name="is_featured" checked={form.is_featured} onChange={handleChange}/>
                    <Check label="Activo (Visible)" name="is_active" checked={form.is_active} onChange={handleChange}/>
                  </div>
                </>}

                <div className="pt-4 flex justify-between items-center border-t border-[var(--border-subtle)] mt-6">
                  <div className="flex gap-2">{activeTab>0&&<button type="button" onClick={()=>setActiveTab(p=>p-1)} className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)]">← Anterior</button>}</div>
                  <div className="flex gap-3">
                    <button type="button" onClick={resetForm} className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">Cancelar</button>
                    {activeTab<TABS.length-1 ? <button type="button" onClick={()=>setActiveTab(p=>p+1)} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-purple-700">Siguiente →</button> : <button type="submit" className="bg-[var(--foreground)] text-[var(--background)] px-6 py-2 rounded-xl font-medium hover:opacity-90">{editingId?"Guardar Cambios":"Crear Evento"}</button>}
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
