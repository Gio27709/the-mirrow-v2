import {
  LayoutDashboard,
  Compass,
  Settings,
  HelpCircle,
  LucideIcon,
  Shield,
  Theater,
  Music,
  Disc3,
  Mic2,
  Target,
  Layers,
  Activity,
  CalendarDays,
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
    title: "Explorar",
    href: "/explore",
    icon: Compass,
  },
  {
    title: "Eventos",
    href: "/eventos",
    icon: CalendarDays,
  },
  {
    title: "Categorías",
    href: "#",
    icon: Layers,
    items: [
      {
        title: "Artes Escénicas",
        href: "/artes-escenicas",
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
        title: "Danzas Contemporáneas",
        href: "/danzas-contemporaneas",
        icon: Activity,
      },
    ],
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Shield,
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
