"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { api } from "@/lib/api";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { BookingModal } from "@/components/profile/BookingModal";
import { motion } from "framer-motion";
import {
  ArrowLeft, Play, Check, Instagram, Facebook, Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TalentProfile {
  id: number;
  stage_name: string;
  category: string;
  image_url?: string;
  bio?: string;
  rating?: number;
  base_price?: number;
  price_currency?: string;
  price_unit?: string;
  location?: string;
  is_available?: boolean;
  gallery_urls?: string[];
  video_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  website_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  included_services?: string[];
}

export default function ProfilePage() {
  const { id } = useParams();
  const [talent, setTalent] = useState<TalentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const data = await api.get(`/talent/profile/${id}`);
        setTalent(data);
      } catch (error) {
        console.error("Error fetching talent profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchTalent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!talent) return notFound();

  const hasGallery = talent.gallery_urls && talent.gallery_urls.length > 0;
  const hasVideo = !!talent.video_url;
  const hasPrice = !!talent.base_price;
  const hasServices = talent.included_services && talent.included_services.length > 0;
  const hasSocials = talent.instagram_url || talent.facebook_url || talent.website_url || talent.tiktok_url || talent.youtube_url;

  // Extract YouTube video ID for embed
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
    return match ? match[1] : null;
  };

  // Check if it's a direct video file (mp4, webm, or from our Supabase storage)
  const isDirectVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i) || url.includes('supabase.co');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Back Button */}
      <Link href="/explore"
        className="fixed top-6 left-6 z-50 p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/40 transition-all text-white">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      {/* Hero Section */}
      <ProfileHero talent={talent} />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 relative z-10">
        {/* Left Column: Bio & Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* About */}
          <section>
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-indigo-500 rounded-full" />
              Sobre {talent.stage_name}
            </h3>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {talent.bio || "Este artista aún no tiene una biografía detallada, pero su trabajo habla por sí mismo."}
            </p>
          </section>

          {/* Gallery - Only show if has gallery images */}
          {hasGallery && (
            <section>
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-pink-500 rounded-full" />
                Galería de Eventos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
                {talent.gallery_urls!.map((src, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.02 }}
                    className={`relative rounded-2xl overflow-hidden group cursor-pointer ${i === 0 || i === 3 ? "col-span-2" : ""}`}>
                    <Image src={src} alt={`Galería ${i + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Video Demo - Only show if has video */}
          {hasVideo && (
            <section>
              {talent.video_url && getYouTubeId(talent.video_url) ? (
                <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(talent.video_url!)}`}
                    title="Video Promocional"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : talent.video_url && isDirectVideo(talent.video_url) ? (
                <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl bg-black">
                  <video 
                    src={talent.video_url} 
                    controls 
                    className="w-full h-full object-contain"
                    preload="metadata"
                  />
                </div>
              ) : (
                <a href={talent.video_url!} target="_blank" rel="noopener noreferrer"
                  className="relative rounded-3xl overflow-hidden aspect-video bg-[var(--bg-elevated)] group cursor-pointer block shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <p className="absolute bottom-4 left-4 text-white/70 text-sm font-medium">Ver video promocional</p>
                </a>
              )}
            </section>
          )}
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="relative">
          <div className="sticky top-24 space-y-6">
            {/* Booking Card - Only show pricing if configured */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl p-8 shadow-2xl">
              {hasPrice ? (
                <>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[var(--text-secondary)] text-sm uppercase tracking-wider font-bold">Precio Base</p>
                      <h4 className="text-4xl font-black text-white">
                        ${talent.base_price}
                        <span className="text-lg text-[var(--text-muted)] font-normal">/{talent.price_unit || "Evento"}</span>
                      </h4>
                    </div>
                    <div className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      talent.is_available !== false
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {talent.is_available !== false ? "Disponible" : "No Disponible"}
                    </div>
                  </div>

                  {hasServices && (
                    <div className="space-y-4 mb-8">
                      {talent.included_services!.map((service, i) => (
                        <div key={i} className="flex items-center gap-3 text-[var(--text-secondary)]">
                          <Check className="w-5 h-5 text-indigo-400" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-6">
                  <p className="text-[var(--text-secondary)] text-sm mb-2">Precio a convenir</p>
                  <div className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${
                    talent.is_available !== false
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {talent.is_available !== false ? "Disponible" : "No Disponible"}
                  </div>
                </div>
              )}

              <button onClick={() => setIsModalOpen(true)}
                className="w-full py-4 text-center bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-transform active:scale-[0.98] shadow-lg shadow-white/10">
                Solicitar Cotización
              </button>
            </div>

            {/* Social Links - Only show if has socials */}
            {hasSocials && (
              <div className="flex gap-4 justify-center">
                {talent.instagram_url && (
                  <a href={talent.instagram_url} target="_blank" rel="noopener noreferrer"
                    className="p-4 bg-[var(--bg-tertiary)] rounded-full hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)] hover:text-white">
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
                {talent.facebook_url && (
                  <a href={talent.facebook_url} target="_blank" rel="noopener noreferrer"
                    className="p-4 bg-[var(--bg-tertiary)] rounded-full hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)] hover:text-white">
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {talent.website_url && (
                  <a href={talent.website_url} target="_blank" rel="noopener noreferrer"
                    className="p-4 bg-[var(--bg-tertiary)] rounded-full hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)] hover:text-white">
                    <Globe className="w-6 h-6" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        talentName={talent.stage_name}
      />
    </div>
  );
}
