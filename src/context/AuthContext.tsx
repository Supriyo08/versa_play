"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Player {
  id: string;
  displayName: string;
  position: string | null;
  rating: number;
  wins: number;
  losses: number;
  xp: number;
  level: number;
  globalRank: number | null;
  speed: number;
  accuracy: number;
  agility: number;
  strength: number;
  endurance: number;
  teamId: string | null;
  team?: { id: string; name: string } | null;
  achievements?: { achievement: { id: string; name: string; icon: string; color: string } }[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  player?: Player | null;
  organizer?: { id: string; orgName: string } | null;
}

type Role = "player" | "organizer" | "admin" | "superadmin";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  fetchWithAuth: (path: string, options?: RequestInit) => Promise<Response>;
  hasRole: (...roles: Role[]) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isOrganizer: boolean;
  isPlayer: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

const PUBLIC_PATHS = ["/auth"];

const ROLE_HIERARCHY: Record<Role, number> = {
  player: 0,
  organizer: 1,
  admin: 2,
  superadmin: 3,
};

const PROTECTED_ROUTES: { path: string; minRole: Role }[] = [
  { path: "/superadmin", minRole: "superadmin" },
  { path: "/admin", minRole: "admin" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("vp_token") : null;
    if (stored) {
      setToken(stored);
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${stored}` } })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => { setUser(data.user); setLoading(false); })
        .catch(() => { localStorage.removeItem("vp_token"); localStorage.removeItem("vp_user"); setToken(null); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, []);

  // Route protection with RBAC
  useEffect(() => {
    if (loading || !pathname) return;
    if (!token && !PUBLIC_PATHS.includes(pathname) && pathname !== "/") {
      router.replace("/auth");
      return;
    }
    if (user && token) {
      for (const route of PROTECTED_ROUTES) {
        if (pathname.startsWith(route.path)) {
          const userLevel = ROLE_HIERARCHY[user.role as Role] ?? 0;
          const requiredLevel = ROLE_HIERARCHY[route.minRole];
          if (userLevel < requiredLevel) {
            router.replace("/dashboard?access=denied");
            return;
          }
        }
      }
    }
  }, [loading, token, user, pathname, router]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json().catch(() => ({ error: "Server returned an invalid response. Check that the database is running." }));
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("vp_token", data.token);
    localStorage.setItem("vp_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (email: string, username: string, password: string, role: string) => {
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, username, password, role }) });
    const data = await res.json().catch(() => ({ error: "Server returned an invalid response. Check that the database is running." }));
    if (!res.ok) throw new Error(data.error || "Registration failed");
    localStorage.setItem("vp_token", data.token);
    localStorage.setItem("vp_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("vp_token");
    localStorage.removeItem("vp_user");
    setToken(null);
    setUser(null);
    router.replace("/auth");
  }, [router]);

  const fetchWithAuth = useCallback(async (path: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...(options.headers as Record<string, string>) };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`/api${path}`, { ...options, headers });
    // Guard against HTML error responses - wrap in a safe Response with JSON body
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok && !contentType.includes("application/json")) {
      // Server returned a non-JSON error (e.g. HTML 404/500 page)
      return new Response(JSON.stringify({ error: `Server error: ${res.status}` }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    return res;
  }, [token]);

  const hasRole = useCallback((...roles: Role[]) => {
    if (!user) return false;
    const userLevel = ROLE_HIERARCHY[user.role as Role] ?? 0;
    return roles.some((r) => userLevel >= ROLE_HIERARCHY[r]);
  }, [user]);

  const isAdmin = !!user && (user.role === "admin" || user.role === "superadmin");
  const isSuperAdmin = !!user && user.role === "superadmin";
  const isOrganizer = !!user && (user.role === "organizer" || isAdmin);
  const isPlayer = !!user && user.role === "player";

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchWithAuth, hasRole, isAdmin, isSuperAdmin, isOrganizer, isPlayer }}>
      {children}
    </AuthContext.Provider>
  );
}
