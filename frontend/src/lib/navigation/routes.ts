import { LayoutDashboard, Compass, Calendar, User, LucideIcon } from "lucide-react";

/**
 * Navigation route definition for The Mirrow 2 platform
 */
export interface NavRoute {
  /** Unique identifier for the route */
  id: string;
  /** Display label for the navigation item */
  label: string;
  /** URL path for the route */
  href: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Optional description for accessibility */
  description?: string;
}

/**
 * Main navigation routes for the entertainment platform
 * Order determines display order in both Sidebar and BottomNav
 */
export const navigationRoutes: NavRoute[] = [
  {
    id: "home",
    label: "Inicio",
    href: "/",
    icon: LayoutDashboard,
    description: "Página principal",
  },
  {
    id: "explore",
    label: "Explorar",
    href: "/explore",
    icon: Compass,
    description: "Descubre todas las categorías",
  },
  {
    id: "events",
    label: "Eventos",
    href: "/eventos",
    icon: Calendar,
    description: "Cartelera de eventos",
  },
  {
    id: "settings",
    label: "Mi cuenta",
    href: "/settings",
    icon: User,
    description: "Tu cuenta y tus entradas",
  },
];

/**
 * Get a specific route by its ID
 */
export function getRouteById(id: string): NavRoute | undefined {
  return navigationRoutes.find((route) => route.id === id);
}

/**
 * Get a specific route by its href path
 */
export function getRouteByPath(path: string): NavRoute | undefined {
  return navigationRoutes.find((route) => route.href === path);
}
