"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { api, ApiError } from "@/lib/api";
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

  // Drop the session without navigating (e.g. expired token on a public page)
  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    router.push("/login");
  }, [clearSession, router]);

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
        // Only an auth failure means the token is bad; network/server errors keep the session
        if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
          clearSession();
        } else {
          console.error("Failed to fetch user:", error);
        }
      } finally {
        setLoading(false);
      }
    },
    [clearSession],
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

    // Revalidate when the tab regains focus (picks up role/profile changes)
    const handleFocus = () => {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        setToken(currentToken);
        fetchUser(currentToken);
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
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
