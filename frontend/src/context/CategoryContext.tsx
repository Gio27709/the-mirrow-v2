"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/lib/api";
import { navItems, NavItem } from "@/lib/nav-data";
import * as Icons from "lucide-react";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  banner_url: string | null;
  gradient_from: string;
  gradient_to: string;
  order: number;
  icon_name?: string;
}

interface CategoryContextType {
  categories: Category[];
  mergedNavItems: NavItem[];
  isLoading: boolean;
  refreshCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mergedNavItems, setMergedNavItems] = useState<NavItem[]>(navItems);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await api.get("/categories");
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Merge Dynamic Categories into "Categorías" NavItem
  useEffect(() => {
    if (categories.length === 0) {
      setMergedNavItems(navItems);
      return;
    }

    const dynamicItems = categories.map((cat) => {
      // Dynamic Icon resolution
      // @ts-expect-error: Dynamic icon resolution from string name
      const IconComponent = Icons[cat.icon_name] || Icons.Layers;

      return {
        title: cat.name,
        href: `/${cat.slug}`,
        icon: IconComponent,
      };
    });

    const newNavItems = navItems.map((item) => {
      if (item.title === "Categorías") {
        return {
          ...item,
          items: dynamicItems.length > 0 ? dynamicItems : item.items,
        };
      }
      return item;
    });

    setMergedNavItems(newNavItems);
  }, [categories]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        mergedNavItems,
        isLoading,
        refreshCategories: fetchCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
