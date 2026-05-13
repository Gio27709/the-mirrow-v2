"use client";

import { useEffect, useState, ElementType } from "react";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/context/CategoryContext";
import * as Icons from "lucide-react";
import { api } from "@/lib/api";

// Verified Import Path
import { TalentCard } from "@/components/talent/TalentCard";

interface TalentProfile {
  id: number;
  stage_name: string;
  category: string;
  image_url: string;
  description?: string;
  rating?: number;
  location?: string;
}

export default function DynamicCategoryPage() {
  const params = useParams();
  const slug = params.category as string;
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const category = categories.find((c) => c.slug === slug);

  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [isLoadingTalents, setIsLoadingTalents] = useState(true);

  useEffect(() => {
    if (category) {
      const fetchTalents = async () => {
        setIsLoadingTalents(true);
        try {
          // GET /talent/{slug} returns already filtered data
          const data = await api.get(`/talent/${slug}`);
          setTalents(data as TalentProfile[]);
        } catch (error) {
          console.error("Error fetching talents", error);
        } finally {
          setIsLoadingTalents(false);
        }
      };
      fetchTalents();
    }
  }, [category, slug]);

  if (!isCategoriesLoading && !category) {
    return notFound();
  }

  if (!category)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );

  // Dynamic Styling without 'any'
  // icon_name is now optional in Category interface
  const iconKey = (category.icon_name || "Layers") as keyof typeof Icons;
  const Icon = (Icons[iconKey] || Icons.Layers) as ElementType;

  const gradientClass = `from-${category.gradient_from} to-${category.gradient_to}`;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden flex items-center justify-center">
        {/* Dynamic Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-20`}
        />

        {/* Optional Image Background */}
        {category.image_url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover opacity-30 mix-blend-overlay"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
          </div>
        )}

        <div className="relative z-10 text-center space-y-4 px-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg mb-6`}
          >
            <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-[var(--text-primary)]"
          >
            {category.name}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto"
          >
            {category.description}
          </motion.p>
        </div>

        <Link
          href="/"
          className="absolute top-6 left-6 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-[var(--text-primary)]"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      {/* Talents Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        {isLoadingTalents ? (
          <div className="text-center py-20">Searching talents...</div>
        ) : talents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talents.map((talent, index) => (
              <TalentCard key={talent.id} talent={talent} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--bg-secondary)]/50 backdrop-blur rounded-3xl border border-[var(--border-subtle)]">
            {/* Using generic Icon because imports can be tricky with namespace */}
            <div className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4 flex items-center justify-center">
              <Icons.UserX className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              No hay talentos aún
            </h3>
            <p className="text-[var(--text-secondary)]">
              Sé el primero en unirte a la categoría {category.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
