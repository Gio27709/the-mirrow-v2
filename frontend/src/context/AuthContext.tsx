"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  username?: string;
  full_name?: string;
  profile_image_url?: string;
  id: number;
  role?: "user" | "admin" | "owner";
  auth_provider?: string;
  accepts_notifications?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const fetchUser = useCallback(
    async (authToken: string) => {
      try {
        // Add cache busting to ensure we get the latest data (e.g., after avatar upload)
        const userData = await api.get(`/users/me?_t=${Date.now()}`, authToken);
        // Only update state if data changed to avoid re-renders (basic check)
        setUser((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(userData)) {
            return userData;
          }
          return prev;
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        logout(); // Invalid token
      } finally {
        setLoading(false);
      }
    },
    [logout],
  );

  useEffect(() => {
    // Check for token on mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }

    // Revalidation Logic (Focus & Polling)
    const handleFocus = () => {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        setToken(currentToken);
        fetchUser(currentToken);
      }
    };

    window.addEventListener("focus", handleFocus);

    // Poll every 5 seconds for "Real Time" feel
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        setToken(currentToken);
        fetchUser(currentToken);
      }
    }, 5000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [fetchUser]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    fetchUser(newToken);
    // You might want to redirect here or let the login component handle it
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      await fetchUser(storedToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
