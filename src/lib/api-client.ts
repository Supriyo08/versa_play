const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

let token: string | null = null;

export function setToken(t: string | null) {
  token = t;
  if (t) {
    if (typeof window !== "undefined") {
      localStorage.setItem("vp_token", t);
    }
  } else {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vp_token");
    }
  }
}

export function getToken(): string | null {
  if (token) return token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("vp_token");
  }
  return token;
}

async function fetchApi<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const currentToken = getToken();
  if (currentToken) {
    headers["Authorization"] = `Bearer ${currentToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchApi<{ token: string; user: unknown }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (email: string, username: string, password: string, role: string) =>
      fetchApi<{ token: string; user: unknown }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, username, password, role }),
      }),
    me: () => fetchApi("/auth/me"),
  },
  players: {
    list: (params?: Record<string, string>) =>
      fetchApi(`/players?${new URLSearchParams(params).toString()}`),
    get: (id: string) => fetchApi(`/players/${id}`),
  },
  teams: {
    list: () => fetchApi("/teams"),
    get: (id: string) => fetchApi(`/teams/${id}`),
  },
  tournaments: {
    list: (params?: Record<string, string>) =>
      fetchApi(`/tournaments?${new URLSearchParams(params).toString()}`),
    get: (id: string) => fetchApi(`/tournaments/${id}`),
    register: (tournamentId: string, teamId: string) =>
      fetchApi(`/tournaments/${tournamentId}/entries`, {
        method: "POST",
        body: JSON.stringify({ teamId }),
      }),
  },
  matches: {
    list: (params?: Record<string, string>) =>
      fetchApi(`/matches?${new URLSearchParams(params).toString()}`),
    get: (id: string) => fetchApi(`/matches/${id}`),
    addEvent: (matchId: string, event: Record<string, unknown>) =>
      fetchApi(`/matches/${matchId}/events`, {
        method: "POST",
        body: JSON.stringify(event),
      }),
    updateScore: (matchId: string, data: Record<string, unknown>) =>
      fetchApi(`/matches/${matchId}/score`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  admin: {
    stats: () => fetchApi("/admin/stats"),
    users: (params?: Record<string, string>) =>
      fetchApi(`/admin/users?${new URLSearchParams(params).toString()}`),
  },
  clubs: {
    list: () => fetchApi("/clubs"),
    create: (data: { name: string; sport: string; description?: string; privacy?: string }) =>
      fetchApi("/clubs", { method: "POST", body: JSON.stringify(data) }),
    requestJoin: (clubId: string, message?: string) =>
      fetchApi("/clubs/join-request", { method: "POST", body: JSON.stringify({ clubId, message }) }),
    handleRequest: (requestId: string, action: "accept" | "reject") =>
      fetchApi("/clubs/join-request", { method: "PATCH", body: JSON.stringify({ requestId, action }) }),
    getRequests: (clubId: string) => fetchApi(`/clubs/join-request?clubId=${clubId}`),
    myRequests: () => fetchApi("/clubs/my-requests"),
  },
};
