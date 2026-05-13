"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HTMLAttributes } from "react";

interface MirrowLogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "light" | "dark";
  showText?: boolean;
}

export function Logo({
  className = "",
  variant = "default",
  showText = true, // We'll ignore showText and just show the full logo
  ...props
}: MirrowLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to show based on theme or forced variant
  let isDark = mounted && resolvedTheme === "dark";
  if (variant === "light") isDark = false;
  if (variant === "dark") isDark = true;

  return (
    <div
      className={`relative w-[160px] h-[55px] sm:w-[200px] sm:h-[65px] flex items-center justify-center shrink-0 ${className}`}
      {...props}
    >
      <Image
        src={isDark ? "/logo-claro.png" : "/logo-oscuro.png"}
        alt="The Mirrow Logo"
        fill
        className="object-contain object-center scale-110 sm:scale-125 transition-transform"
        priority
        onError={(e) => {
          e.currentTarget.src = "/logo-mirrow.png";
        }}
      />
    </div>
  );
}
