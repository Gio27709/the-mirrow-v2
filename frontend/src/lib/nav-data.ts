import {
    LayoutDashboard,
    Mic2,
    Music,
    Disc3,
    Target,
    Theater,
    Settings,
    HelpCircle,
    BarChart,
    Users,
    Calendar,
    FileText,
    LucideIcon
} from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    items?: NavItem[];
}

export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Categorías",
        href: "#",
        icon: FileText, // Placeholder icon for group
        items: [
            {
                title: "Teatro",
                href: "/teatro",
                icon: Theater,
            },
            {
                title: "Músicos",
                href: "/musicos",
                icon: Music,
            },
            {
                title: "DJs",
                href: "/djs",
                icon: Disc3,
            },
            {
                title: "Cantantes",
                href: "/cantantes",
                icon: Mic2,
            },
            {
                title: "Billar",
                href: "/billar",
                icon: Target,
            },
        ],
    },
    {
        title: "Gestión",
        href: "#",
        icon: BarChart,
        items: [
            {
                title: "Usuarios",
                href: "/users",
                icon: Users,
            },
            {
                title: "Eventos",
                href: "/events",
                icon: Calendar,
            },
        ]
    },
    {
        title: "Configuración",
        href: "/settings",
        icon: Settings,
    },
    {
        title: "Ayuda",
        href: "/help",
        icon: HelpCircle,
    },
];
