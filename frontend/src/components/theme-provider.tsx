"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

/**
 * Theme Provider Component
 * Wraps the app to enable dynamic theme switching
 * Supports: dark, light, grey themes
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="data-theme"
            defaultTheme="dark"
            enableSystem={false}
            themes={["dark", "light", "grey"]}
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}
