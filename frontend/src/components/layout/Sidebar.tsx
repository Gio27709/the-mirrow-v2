"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsLeft, Menu, Search, ChevronDown, ChevronRight } from "lucide-react";
import { navItems, NavItem } from "@/lib/nav-data";
import { usePathname } from "next/navigation";

/**
 * Animated Sidebar Component
 * - Dashboard style
 * - Nested submenus
 * - Search functionality
 * - Collapsible
 */
export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    // Helper to check if a route is active
    const isRouteActive = (href: string) => pathname === href;

    // Toggle submenu
    const toggleSubmenu = (title: string) => {
        if (isCollapsed) {
            setIsCollapsed(false);
            setTimeout(() => {
                setOpenSubmenus(prev =>
                    prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
                );
            }, 300);
        } else {
            setOpenSubmenus(prev =>
                prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
            );
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <motion.aside
            initial={{ x: -240, opacity: 0 }}
            animate={{
                x: 0,
                opacity: 1,
                width: isCollapsed ? 80 : 280
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed left-0 top-0 z-40 h-screen bg-black border-r border-zinc-800 flex flex-col overflow-hidden text-zinc-400"
        >
            {/* Header / Logo */}
            <div className="flex items-center justify-between h-20 px-5 border-b border-zinc-800/50">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-2"
                        >
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/logo-mirrow.png"
                                    alt="Logo"
                                    fill
                                    className="object-contain"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                            </div>
                            <span className="text-white font-bold text-lg tracking-tight">The Mirrow</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Collapsed Logo Fallback */}
                {isCollapsed && (
                    <div className="w-full flex justify-center">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/logo-mirrow.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}

                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                    >
                        <ChevronsLeft className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Search Bar */}
            {!isCollapsed && (
                <div className="px-5 py-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                        />
                    </div>
                </div>
            )}

            {isCollapsed && (
                <div className="px-5 py-4 flex justify-center">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-1 custom-scrollbar">
                {navItems.map((item: NavItem) => {
                    const isActive = isRouteActive(item.href);
                    const isOpen = openSubmenus.includes(item.title);
                    const hasSubmenu = item.items && item.items.length > 0;
                    const Icon = item.icon;

                    return (
                        <div key={item.title}>
                            {/* Main Item */}
                            {hasSubmenu ? (
                                <button
                                    onClick={() => toggleSubmenu(item.title)}
                                    className={`
                                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                        ${isOpen ? 'text-white bg-zinc-900' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'}
                                    `}
                                >
                                    <div className={`flex items-center gap-3 ${isCollapsed ? 'mx-auto' : ''}`}>
                                        {Icon && <Icon className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />}
                                        {!isCollapsed && <span>{item.title}</span>}
                                    </div>
                                    {!isCollapsed && (
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-zinc-600'}`} />
                                    )}
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-gradient-to-r from-zinc-800 to-zinc-900 text-white border-l-2 border-white'
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border-l-2 border-transparent'}
                                        ${isCollapsed ? 'justify-center' : ''}
                                    `}
                                >
                                    {Icon && <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />}
                                    {!isCollapsed && <span>{item.title}</span>}
                                </Link>
                            )}

                            {/* Submenu */}
                            <AnimatePresence>
                                {hasSubmenu && isOpen && !isCollapsed && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-1 ml-4 pl-3 border-l border-zinc-800 space-y-1">
                                            {item.items?.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className={`
                                                        flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                                                        ${isRouteActive(subItem.href)
                                                            ? 'text-white bg-zinc-800/50 font-medium'
                                                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}
                                                    `}
                                                >
                                                    {subItem.icon && <subItem.icon className="w-4 h-4 opacity-70" />}
                                                    {subItem.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            {/* User / Footer */}
            <div className="p-4 border-t border-zinc-800">
                {!isCollapsed ? (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                            GD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">GiovanyDev</p>
                            <p className="text-xs text-zinc-500 truncate">Admin</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                            <Menu className="w-4 h-4 text-zinc-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* Collapse Expand Button for Collapsed State */}
            {isCollapsed && (
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="absolute top-1/2 -right-3 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white border border-black"
                >
                    <ChevronRight className="w-3 h-3" />
                </button>
            )}

        </motion.aside>
    );
}
