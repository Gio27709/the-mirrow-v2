"use client";

import { useEffect, useState } from "react";
import { HeroCarousel } from "./HeroCarousel";
import { PromoCard } from "./PromoCard";
import { api } from "@/lib/api";

interface HeroCard {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  bg_gradient?: string;
}

const defaultCards: HeroCard[] = [
  {
    id: 1,
    title: "Artistas Destacados",
    subtitle:
      "Descubre quiénes están marcando tendencia este mes en The Mirrow.",
    image_url: "https://cicvwajzdtgvfbsvuttx.supabase.co/storage/v1/object/public/images/static/hero-dj.png",
    cta_text: "Ver Top 10",
    cta_link: "/musicos",
    bg_gradient: "from-indigo-900/90 to-purple-900/90",
  },
  {
    id: 2,
    title: "Próximos Eventos",
    subtitle: "No te pierdas las fechas más importantes de la temporada.",
    image_url: "https://cicvwajzdtgvfbsvuttx.supabase.co/storage/v1/object/public/images/static/hero-theater.png",
    cta_text: "Calendario",
    cta_link: "/teatro",
    bg_gradient: "from-slate-900/90 to-zinc-900/90",
  },
];

export function HeroGrid() {
  const [cards, setCards] = useState<HeroCard[]>(defaultCards);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        interface HeroApiItem {
          id: number;
          type: string;
          image_url: string;
          title: string;
          subtitle?: string;
          cta_text?: string;
          cta_link?: string;
          bg_gradient?: string;
        }

        const data = await api.get("/hero-content");
        const cardItems = (data as HeroApiItem[]).filter((item) => item.type === "card");

        if (cardItems.length > 0) {
          setCards(
            cardItems
              .map((item) => ({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle || "",
                image_url: item.image_url,
                cta_text: item.cta_text || "Ver más",
                cta_link: item.cta_link || "#",
                bg_gradient: item.bg_gradient || "from-gray-900 to-black",
              }))
              .slice(0, 2),
          ); // Limit to 2 cards for layout
        }
      } catch (error) {
        console.error("Failed to fetch cards", error);
      }
    };

    fetchCards();
  }, []);

  return (
    <section className="w-full pb-0 pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
        {/* Main Carousel - Takes 2 columns on Desktop */}
        <div className="lg:col-span-2 h-[400px] lg:h-full">
          <HeroCarousel />
        </div>

        {/* Side Banners - Takes 1 column on Desktop, stacked vertically */}
        <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 h-full">
          {cards.map((card, index) => (
            <PromoCard
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              image={card.image_url}
              ctaText={card.cta_text}
              ctaLink={card.cta_link}
              delay={0.1 * (index + 1)}
              gradient={card.bg_gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
