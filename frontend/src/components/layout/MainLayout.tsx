"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MOBILE_BREAKPOINT } from "@/lib/navigation";
import { FloatingNavbar } from "./FloatingNavbar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { MobileHeader } from "./MobileHeader";
import { TopContactBar } from "./TopContactBar";

interface MainLayoutProps {
    children: ReactNode;
}

/**
 * Intelligent Main Layout Component
 * Features:
 * - Floating navbar on desktop (glassmorphism)
 * - Animated sidebar with collapse on desktop
 * - Bottom nav on mobile with glassmorphism
 * - Content flows under navbar for depth effect
 */

export function MainLayout({ children }: MainLayoutProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true);

        const checkMobile = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Prevent hydration mismatch
    if (!isClient) {
        return (
            <div className="min-h-screen bg-pure-black">
                <main className="min-h-screen">{children}</main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pure-black overflow-x-hidden">
            {/* Desktop: Sidebar (Fixed) */}
            {!isMobile && (
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                />
            )}

            {/* Mobile: Header with search and theme */}
            {isMobile && <MobileHeader />}

            {/* Main Content Area (Wraps TopBar, Navbar, and Page Content) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`
          min-h-screen transition-all duration-300 flex flex-col
          ${!isMobile ? (isSidebarCollapsed ? "ml-[80px]" : "ml-[280px]") : "pb-24"}
        `}
            >
                {/* Desktop Header Stack */}
                {!isMobile && (
                    <div className="flex flex-col z-30">
                        <TopContactBar />
                        <FloatingNavbar />
                    </div>
                )}

                {/* Content wrapper */}
                <main className="relative z-10 px-4 md:px-6 lg:px-8 flex-1">
                    {/* Gradient overlay for depth effect on scroll - only on desktop */}
                    {!isMobile && (
                        <div className="pointer-events-none fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-pure-black via-pure-black/80 to-transparent z-20" />
                    )}

                    <div className="pt-2">
                        {children}
                    </div>

                    {/* Footer - visible on all pages */}
                    <Footer />
                </main>
            </motion.div>

            {/* Mobile: Bottom navigation */}
            {isMobile && <BottomNav />}
        </div>
    );
}
