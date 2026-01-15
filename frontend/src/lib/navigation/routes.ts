import {
    Theater,
    Music,
    Disc3,
    Mic2,
    Target,
    LucideIcon,
} from "lucide-react";

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
        id: "teatro",
        label: "Teatro",
        href: "/teatro",
        icon: Theater,
        description: "Espectáculos de teatro y obras dramáticas",
    },
    {
        id: "musicos",
        label: "Músicos",
        href: "/musicos",
        icon: Music,
        description: "Artistas y bandas musicales",
    },
    {
        id: "djs",
        label: "DJs",
        href: "/djs",
        icon: Disc3,
        description: "Disc jockeys y eventos electrónicos",
    },
    {
        id: "cantantes",
        label: "Cantantes",
        href: "/cantantes",
        icon: Mic2,
        description: "Vocalistas y solistas",
    },
    {
        id: "billar",
        label: "Billar",
        href: "/billar",
        icon: Target,
        description: "Torneos y mesas de billar",
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
