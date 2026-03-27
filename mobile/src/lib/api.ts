// API base URL - change this to your deployed backend URL in production
const API_BASE = __DEV__
  ? "http://192.168.1.5:3001/api"
  : "https://your-production-url.com/api";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

async function fetchAPI(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

// Auth
export const auth = {
  login: (email: string, password: string) =>
    fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, username: string, password: string, role: string) =>
    fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password, role }),
    }),

  me: () => fetchAPI("/auth/me"),
};

// Players
export const players = {
  list: (params?: { page?: number; search?: string; sort?: string }) =>
    fetchAPI(`/players?${new URLSearchParams(params as Record<string, string>).toString()}`),

  get: (id: string) => fetchAPI(`/players/${id}`),

  update: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/players/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Teams
export const teams = {
  list: () => fetchAPI("/teams"),
  get: (id: string) => fetchAPI(`/teams/${id}`),
};

// Tournaments
export const tournaments = {
  list: (params?: { status?: string; sport?: string }) =>
    fetchAPI(`/tournaments?${new URLSearchParams(params as Record<string, string>).toString()}`),

  get: (id: string) => fetchAPI(`/tournaments/${id}`),

  register: (tournamentId: string, teamId: string) =>
    fetchAPI(`/tournaments/${tournamentId}/entries`, {
      method: "POST",
      body: JSON.stringify({ teamId }),
    }),
};

// Clubs
export const clubs = {
  list: () => fetchAPI("/clubs"),

  requestJoin: (clubId: string, message?: string) =>
    fetchAPI("/clubs/join-request", {
      method: "POST",
      body: JSON.stringify({ clubId, message }),
    }),

  handleRequest: (requestId: string, action: "accept" | "reject") =>
    fetchAPI("/clubs/join-request", {
      method: "PATCH",
      body: JSON.stringify({ requestId, action }),
    }),

  getRequests: (clubId: string) => fetchAPI(`/clubs/join-request?clubId=${clubId}`),

  myRequests: () => fetchAPI("/clubs/my-requests"),
};

// Matches
export const matches = {
  list: (params?: { tournamentId?: string; status?: string }) =>
    fetchAPI(`/matches?${new URLSearchParams(params as Record<string, string>).toString()}`),

  get: (id: string) => fetchAPI(`/matches/${id}`),

  addEvent: (matchId: string, event: Record<string, unknown>) =>
    fetchAPI(`/matches/${matchId}/events`, {
      method: "POST",
      body: JSON.stringify(event),
    }),

  updateScore: (matchId: string, data: Record<string, unknown>) =>
    fetchAPI(`/matches/${matchId}/score`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
