"use client";

import { usePathname } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { navigationRoutes, getRouteByPath, type NavRoute } from "./routes";

/**
 * Breakpoint for mobile/desktop detection (768px)
 */
export const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook for navigation state management
 */
export function useNavigation() {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Handle hydration and responsive detection
    useEffect(() => {
        setIsClient(true);

        const checkMobile = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Get current active route based on pathname
    const activeRoute = useMemo(() => {
        return getRouteByPath(pathname);
    }, [pathname]);

    // Check if a specific route is active
    const isRouteActive = (route: NavRoute): boolean => {
        if (pathname === "/" && route.href === "/teatro") {
            return true; // Default to Teatro on home
        }
        return pathname === route.href || pathname.startsWith(`${route.href}/`);
    };

    return {
        routes: navigationRoutes,
        activeRoute,
        isRouteActive,
        isMobile,
        isClient,
        pathname,
    };
}

export type { NavRoute };
