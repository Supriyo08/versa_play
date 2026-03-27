"use client";

import AppShell from "@/components/layout/AppShell";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RosterPlayer {
  id: string;
  displayName: string;
  position: string | null;
  rating: number;
  wins: number;
  losses: number;
  sport: string;
  status: "active" | "inactive";
  avatarUrl?: string | null;
  team: { id: string; name: string } | null;
  user: { email: string; username: string };
}

/* ------------------------------------------------------------------ */
/*  Mock data (fallback when API is unavailable)                       */
/* ------------------------------------------------------------------ */

const MOCK_PLAYERS: RosterPlayer[] = [
  { id: "p1", displayName: "Marcus Rivera", position: "Point Guard", rating: 94, wins: 48, losses: 12, sport: "Basketball", status: "active", team: { id: "t1", name: "Storm Hawks" }, user: { email: "marcus@versa.gg", username: "mrivera" } },
  { id: "p2", displayName: "Aisha Patel", position: "Striker", rating: 88, wins: 35, losses: 18, sport: "Soccer", status: "active", team: { id: "t2", name: "Phoenix FC" }, user: { email: "aisha@versa.gg", username: "apatel" } },
  { id: "p3", displayName: "Liam Chen", position: "Setter", rating: 76, wins: 22, losses: 24, sport: "Volleyball", status: "active", team: { id: "t3", name: "Volt Spikers" }, user: { email: "liam@versa.gg", username: "lchen" } },
  { id: "p4", displayName: "Sofia Nakamura", position: "Midfielder", rating: 91, wins: 41, losses: 9, sport: "Soccer", status: "active", team: { id: "t2", name: "Phoenix FC" }, user: { email: "sofia@versa.gg", username: "snakamura" } },
  { id: "p5", displayName: "Ethan Brooks", position: "Center", rating: 62, wins: 14, losses: 30, sport: "Basketball", status: "inactive", team: null, user: { email: "ethan@versa.gg", username: "ebrooks" } },
  { id: "p6", displayName: "Zara Williams", position: "Libero", rating: 85, wins: 38, losses: 15, sport: "Volleyball", status: "active", team: { id: "t3", name: "Volt Spikers" }, user: { email: "zara@versa.gg", username: "zwilliams" } },
  { id: "p7", displayName: "Diego Fernandez", position: "Goalkeeper", rating: 79, wins: 28, losses: 20, sport: "Soccer", status: "active", team: { id: "t4", name: "Ironclad United" }, user: { email: "diego@versa.gg", username: "dfernandez" } },
  { id: "p8", displayName: "Priya Sharma", position: "Shooting Guard", rating: 70, wins: 19, losses: 25, sport: "Basketball", status: "inactive", team: { id: "t1", name: "Storm Hawks" }, user: { email: "priya@versa.gg", username: "psharma" } },
  { id: "p9", displayName: "Noah Kim", position: "Defender", rating: 83, wins: 33, losses: 17, sport: "Soccer", status: "active", team: { id: "t4", name: "Ironclad United" }, user: { email: "noah@versa.gg", username: "nkim" } },
  { id: "p10", displayName: "Olivia Grant", position: "Outside Hitter", rating: 58, wins: 10, losses: 28, sport: "Volleyball", status: "inactive", team: null, user: { email: "olivia@versa.gg", username: "ogrant" } },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ROWS_PER_PAGE = 6;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function ratingColor(r: number) {
  if (r >= 90) return "bg-vp-green/15 text-[#22c55e]";
  if (r >= 75) return "bg-vp-blue/15 text-[#4a7cff]";
  if (r >= 60) return "bg-vp-orange/15 text-[#f59e0b]";
  return "bg-vp-red/15 text-[#ef4444]";
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function RosterPage() {
  const { fetchWithAuth, loading: authLoading, isAdmin, user } = useAuth();

  /* ---- RBAC guard ------------------------------------------------ */
  if (!authLoading && !isAdmin) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[60vh] px-6">
          <div className="w-16 h-16 rounded-full bg-vp-red/20 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M5.07 19h13.86c1.1 0 1.79-1.19 1.24-2.14L13.24 4.14a1.42 1.42 0 00-2.48 0L3.83 16.86c-.55.95.14 2.14 1.24 2.14z"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-vp-text-dim text-center max-w-md">
            You don&apos;t have permission to access Player Roster Management. This page is restricted to{" "}
            <span className="text-vp-orange font-semibold">Admin</span> and{" "}
            <span className="text-vp-red font-semibold">Superadmin</span> users only.
          </p>
          <p className="text-xs text-vp-text-muted mt-3">
            Your current role: <span className="text-white font-medium capitalize">{user?.role || "unknown"}</span>
          </p>
        </div>
      </AppShell>
    );
  }

  /* ---- State ----------------------------------------------------- */
  const [players, setPlayers] = useState<RosterPlayer[]>(MOCK_PLAYERS);
  const [dataLoading, setDataLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [teamFilter, setTeamFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  /* ---- Fetch real data on mount ---------------------------------- */
  useEffect(() => {
    if (authLoading) return;
    fetchWithAuth("/players?limit=50")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json().catch(() => ({}));
      })
      .then((data) => {
        if (data.players && data.players.length > 0) {
          const mapped: RosterPlayer[] = data.players.map(
            (p: Record<string, unknown>) => ({
              id: p.id as string,
              displayName: p.displayName as string,
              position: (p.position as string) || null,
              rating: (p.rating as number) || 0,
              wins: (p.wins as number) || 0,
              losses: (p.losses as number) || 0,
              sport: (p.sport as string) || "General",
              status: ((p.status as string) || "active") as "active" | "inactive",
              avatarUrl: (p.avatarUrl as string) || null,
              team: p.team
                ? { id: (p.team as Record<string, string>).id, name: (p.team as Record<string, string>).name }
                : null,
              user: p.user
                ? { email: (p.user as Record<string, string>).email, username: (p.user as Record<string, string>).username }
                : { email: "", username: "" },
            })
          );
          setPlayers(mapped);
        }
      })
      .catch(() => {
        /* keep mock data */
      })
      .finally(() => setDataLoading(false));
  }, [authLoading, fetchWithAuth]);

  /* ---- Derived lists (sports / teams for dropdowns) -------------- */
  const sportOptions = useMemo(
    () => ["All", ...Array.from(new Set(players.map((p) => p.sport)))],
    [players]
  );
  const teamOptions = useMemo(
    () => ["All", ...Array.from(new Set(players.filter((p) => p.team).map((p) => p.team!.name)))],
    [players]
  );

  /* ---- Filtered + paginated -------------------------------------- */
  const filtered = useMemo(() => {
    return players.filter((p) => {
      const matchSearch =
        !searchTerm ||
        p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.position || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSport = sportFilter === "All" || p.sport === sportFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter.toLowerCase();
      const matchTeam = teamFilter === "All" || p.team?.name === teamFilter;
      return matchSearch && matchSport && matchStatus && matchTeam;
    });
  }, [players, searchTerm, sportFilter, statusFilter, teamFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sportFilter, statusFilter, teamFilter]);

  /* ---- Stats ----------------------------------------------------- */
  const totalCount = players.length;
  const activeCount = players.filter((p) => p.status === "active").length;
  const inactiveCount = players.filter((p) => p.status === "inactive").length;
  const verifiedCount = players.filter((p) => p.rating >= 85).length;

  /* ---- Loading state --------------------------------------------- */
  if (dataLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-[#c8ff00] animate-pulse text-xl font-bold">Loading Roster...</div>
        </div>
      </AppShell>
    );
  }

  /* ---- Render ---------------------------------------------------- */
  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8">
        {/* ========== HEADER ========== */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">Player Management</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22c55e]/15 text-[#22c55e] text-[10px] font-bold uppercase tracking-wider">
                {/* dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-sm text-vp-text-dim mt-1">
              {totalCount} total players registered on the platform
            </p>
          </div>
          {/* Add player button */}
          <a
            href="/admin/add-player"
            className="inline-flex items-center gap-2 bg-[#c8ff00] hover:bg-[#a8d900] text-[#0a0a0f] px-5 py-2.5 rounded-xl text-xs font-bold transition-colors w-fit"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Add Player
          </a>
        </div>

        {/* ========== STATS ROW ========== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total */}
          <div className="bg-[#14141f] rounded-2xl border border-[#1e1e30] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#4a7cff]/15 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#4a7cff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="7" r="4" stroke="#4a7cff" strokeWidth="1.5" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#4a7cff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-vp-text-muted uppercase tracking-widest">Total Players</p>
            </div>
            <p className="text-3xl font-black text-white">{totalCount}</p>
          </div>

          {/* Active */}
          <div className="bg-[#14141f] rounded-2xl border border-[#1e1e30] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#22c55e]/15 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 4L12 14.01l-3-3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-vp-text-muted uppercase tracking-widest">Active</p>
            </div>
            <p className="text-3xl font-black text-white">{String(activeCount).padStart(2, "0")}</p>
          </div>

          {/* Inactive */}
          <div className="bg-[#14141f] rounded-2xl border border-[#1e1e30] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#ef4444]/15 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
                  <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-vp-text-muted uppercase tracking-widest">Inactive</p>
            </div>
            <p className="text-3xl font-black text-white">{String(inactiveCount).padStart(2, "0")}</p>
          </div>

          {/* Verified (rating >= 85) */}
          <div className="bg-[#14141f] rounded-2xl border border-[#1e1e30] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#22c55e]/15 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-vp-text-muted uppercase tracking-widest">Verified</p>
            </div>
            <p className="text-3xl font-black text-[#22c55e]">{String(verifiedCount).padStart(2, "0")}</p>
          </div>
        </div>

        {/* ========== SEARCH & FILTERS ========== */}
        <div className="bg-[#14141f] rounded-2xl border border-[#1e1e30] p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-vp-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, position, or email..."
              className="w-full bg-[#0a0a0f] border border-[#1e1e30] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-[#c8ff00]/30 transition-colors"
            />
          </div>

          {/* Sport dropdown */}
          <div className="relative">
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="appearance-none bg-[#0a0a0f] border border-[#1e1e30] rounded-xl px-4 py-2.5 pr-9 text-sm text-white focus:outline-none focus:border-[#c8ff00]/30 transition-colors cursor-pointer"
            >
              {sportOptions.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Sports" : s}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-vp-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Status dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#0a0a0f] border border-[#1e1e30] rounded-xl px-4 py-2.5 pr-9 text-sm text-white focus:outline-none focus:border-[#c8ff00]/30 transition-colors cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-vp-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Team dropdown */}
          <div className="relative">
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="appearance-none bg-[#0a0a0f] border border-[#1e1e30] rounded-xl px-4 py-2.5 pr-9 text-sm text-white focus:outline-none focus:border-[#c8ff00]/30 transition-colors cursor-pointer"
            >
              {teamOptions.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Teams" : t}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-vp-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ========== TABLE ========== */}
        <div className="bg-[#14141f] rounded-2xl border border-[#1e1e30] overflow-hidden">
          {/* Table header bar */}
          <div className="px-5 py-4 border-b border-[#1e1e30] flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Roster ({filtered.length} player{filtered.length !== 1 ? "s" : ""})
            </h3>
            <span className="text-[10px] text-vp-text-muted">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Scrollable table wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[#1e1e30]">
                  {["Player", "Team", "Sport", "Rating", "W/L", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-bold text-vp-text-muted uppercase tracking-wider px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#1e1e30] last:border-0 hover:bg-[#1a1a2e] transition-colors"
                  >
                    {/* Player */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#c8ff00]/15 flex items-center justify-center text-xs font-bold text-[#c8ff00] shrink-0">
                          {initials(p.displayName)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{p.displayName}</p>
                          <p className="text-[11px] text-vp-text-muted truncate">{p.position || "No position"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="px-5 py-3.5 text-xs text-vp-text-dim">{p.team?.name || <span className="italic text-vp-text-muted">Unassigned</span>}</td>

                    {/* Sport */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium text-[#a855f7]">{p.sport}</span>
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${ratingColor(p.rating)}`}>
                        {p.rating}
                      </span>
                    </td>

                    {/* W/L */}
                    <td className="px-5 py-3.5 text-xs text-vp-text-dim">
                      <span className="text-[#22c55e] font-semibold">{p.wins}W</span>
                      {" / "}
                      <span className="text-[#ef4444] font-semibold">{p.losses}L</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      {p.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#22c55e]/10 text-[#22c55e] text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ef4444]/10 text-[#ef4444] text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {/* Edit */}
                        <button
                          className="p-2 rounded-lg bg-[#4a7cff]/10 text-[#4a7cff] hover:bg-[#4a7cff]/20 transition-colors"
                          title="Edit player"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          className="p-2 rounded-lg bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 transition-colors"
                          title="Delete player"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty state */}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-vp-text-muted">
                          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <p className="text-sm text-vp-text-dim">No players found matching your filters</p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSportFilter("All");
                            setStatusFilter("All");
                            setTeamFilter("All");
                          }}
                          className="text-xs text-[#c8ff00] font-semibold hover:underline mt-1"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ========== PAGINATION ========== */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-[#1e1e30] flex items-center justify-between">
              <p className="text-[11px] text-vp-text-muted">
                Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}
                {" - "}
                {Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>

              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-lg text-vp-text-dim hover:text-white hover:bg-[#1a1a2e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      page === currentPage
                        ? "bg-[#c8ff00] text-[#0a0a0f]"
                        : "text-vp-text-dim hover:text-white hover:bg-[#1a1a2e]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-lg text-vp-text-dim hover:text-white hover:bg-[#1a1a2e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
