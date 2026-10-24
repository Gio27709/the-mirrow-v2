"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true);

        const checkMobile = () => {
            const mobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(mobile);
            // Close mobile sidebar if resizing to desktop
            if (!mobile) setIsMobileSidebarOpen(false);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Navigation chrome depends on the viewport, so it only renders after mount.
    // `children` must keep the same position in the tree before and after mount,
    // otherwise every page unmounts/remounts and fetches its data twice.
    const showDesktop = isClient && !isMobile;
    const showMobile = isClient && isMobile;

    return (
        <div className="min-h-screen bg-pure-black overflow-clip">
            {/* Desktop: Sidebar (Fixed) */}
            {showDesktop && (
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                />
            )}

            {/* Mobile: Header with search and theme */}
            {showMobile && (
                <MobileHeader
                    onMenuToggle={() => setIsMobileSidebarOpen(true)}
                />
            )}

            {/* Mobile: Sidebar Drawer Overlay */}
            <AnimatePresence>
            {showMobile && isMobileSidebarOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="mobile-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                    {/* Sidebar as drawer */}
                    <motion.div
                        key="mobile-drawer"
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed left-0 top-0 bottom-0 z-[60] w-[280px]"
                    >
                        <Sidebar
                            isCollapsed={false}
                            setIsCollapsed={() => {}}
                            isMobileDrawer
                            onMobileClose={() => setIsMobileSidebarOpen(false)}
                        />
                    </motion.div>
                </>
            )}
            </AnimatePresence>

            {/* Main Content Area (Wraps TopBar, Navbar, and Page Content) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`
          min-h-screen transition-all duration-300 flex flex-col
          ${showDesktop ? (isSidebarCollapsed ? "ml-[80px]" : "ml-[280px]") : showMobile ? "pb-24" : ""}
        `}
            >
                {/* Desktop Header Stack */}
                {showDesktop && (
                    <>
                        <TopContactBar />
                        <FloatingNavbar />
                    </>
                )}

                {/* Content wrapper */}
                <main className="relative px-4 md:px-6 lg:px-8 flex-1">
                    {/* Gradient overlay for depth effect on scroll - only on desktop */}
                    {showDesktop && (
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
            {showMobile && <BottomNav />}
        </div>
    );
}
