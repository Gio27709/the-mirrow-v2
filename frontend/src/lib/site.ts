/**
 * Single source of truth for public contact data and links.
 * Change values here and they update across the whole site.
 */
export const SITE = {
  name: "The Mirrow",
  legalName: "The Mirrow",
  url: "https://the-mirrow-v2frontend.vercel.app",
  email: "info@themirrow.com",
  phone: "+34 677 26 71 04",
  /** Digits only, for wa.me / tel: links */
  phoneDigits: "34677267104",
  country: "España",
  hours: "Lunes a Viernes: 9:00 - 18:00",
  instagram: {
    handle: "@themirrow",
    url: "https://instagram.com/themirrow",
  },
} as const;

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${SITE.phoneDigits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const telUrl = `tel:+${SITE.phoneDigits}`;
export const mailtoUrl = (subject?: string) =>
  `mailto:${SITE.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
