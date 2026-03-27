"use client";

import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface Match { id: string; homeTeam: { name: string }; awayTeam: { name: string }; homeScore: number; awayScore: number; status: string; tournament: { name: string; sport: string }; }
interface Tournament { id: string; name: string; sport: string; startDate: string; maxTeams: number; prizePool: string | null; status: string; _count: { entries: number }; }
interface Player { id: string; displayName: string; rating: number; wins: number; team?: { name: string } | null; }

export default function DashboardPage() {
  const { fetchWithAuth, loading: authLoading, isAdmin } = useAuth();
  const [accessDenied, setAccessDenied] = useState(false);

  // Check if redirected with access=denied
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("access=denied")) {
      setAccessDenied(true);
      // Clean URL
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const safeJson = (r: Response) => r.json().catch(() => ({}));
    Promise.all([
      fetchWithAuth("/matches").then(safeJson),
      fetchWithAuth("/tournaments").then(safeJson),
      fetchWithAuth("/players?limit=5&sort=rating").then(safeJson),
    ]).then(([mData, tData, pData]) => {
      setMatches(mData.matches || []);
      setTournaments(tData.tournaments || []);
      setPlayers(pData.players || []);
    }).catch(console.error).finally(() => setDataLoading(false));
  }, [authLoading, fetchWithAuth]);

  const liveMatches = matches.filter(m => m.status === "live");
  const scheduledMatches = matches.filter(m => m.status === "scheduled");

  if (dataLoading) {
    return <AppShell><div className="flex items-center justify-center h-[60vh]"><div className="text-vp-lime animate-pulse text-xl font-bold">Loading Dashboard...</div></div></AppShell>;
  }

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        {/* Access Denied Banner */}
        {accessDenied && (
          <div className="mb-6 p-4 rounded-xl bg-vp-red/10 border border-vp-red/30 flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/><path d="M5.07 19h13.86c1.1 0 1.79-1.19 1.24-2.14L13.24 4.14a1.42 1.42 0 00-2.48 0L3.83 16.86c-.55.95.14 2.14 1.24 2.14z" stroke="#ef4444" strokeWidth="1.5"/></svg>
            <p className="text-sm text-vp-red font-medium">Access Denied — You don&apos;t have permission to view that page.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Tournament Dashboard</h1>
            <p className="text-sm text-vp-text-dim mt-1">Live scores, upcoming events, and rankings</p>
          </div>
          {isAdmin && (
            <Link href="/admin" className="inline-flex items-center gap-2 bg-vp-lime text-vp-dark font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-vp-lime-dark transition-colors">
              + Create Tournament
            </Link>
          )}
        </div>

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-vp-red live-dot" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Now ({liveMatches.length})</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {liveMatches.map((match) => (
                <Link key={match.id} href="/scoring" className="min-w-[280px] bg-vp-card rounded-2xl border border-vp-border p-5 flex-shrink-0 hover:border-vp-lime/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-vp-text-dim uppercase">{match.tournament.sport}</span>
                    <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-vp-red live-dot" /><span className="text-[10px] font-bold text-vp-red">LIVE</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-vp-lime/20 flex items-center justify-center text-xs font-bold text-vp-lime">{match.homeTeam.name.charAt(0)}</div>
                        <span className="text-sm font-medium text-white">{match.homeTeam.name}</span>
                      </div>
                      <span className="text-xl font-black text-white">{match.homeScore}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-vp-blue/20 flex items-center justify-center text-xs font-bold text-vp-blue">{match.awayTeam.name.charAt(0)}</div>
                        <span className="text-sm font-medium text-white">{match.awayTeam.name}</span>
                      </div>
                      <span className="text-xl font-black text-white">{match.awayScore}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        {scheduledMatches.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Scheduled Matches</h2>
            <div className="space-y-3">
              {scheduledMatches.map((match) => (
                <div key={match.id} className="bg-vp-card rounded-2xl border border-vp-border p-5 flex items-center gap-4">
                  <span className="text-xs text-vp-text-dim uppercase">{match.tournament.sport}</span>
                  <span className="text-sm font-bold text-white flex-1">{match.homeTeam.name} vs {match.awayTeam.name}</span>
                  <span className="text-[10px] font-bold text-vp-orange uppercase bg-vp-orange/10 px-2 py-1 rounded">Scheduled</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tournaments */}
          <div className="lg:col-span-8">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tournaments ({tournaments.length})</h2>
            <div className="space-y-3">
              {tournaments.map((t) => (
                <Link key={t.id} href={`/tournaments`} className="bg-vp-card rounded-2xl border border-vp-border p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-vp-text-muted/50 transition-colors block">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white">{t.name}</h3>
                    <p className="text-xs text-vp-text-dim mt-1">{t.sport} &bull; {new Date(t.startDate).toLocaleDateString()} &bull; {t._count.entries}/{t.maxTeams} teams</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {t.prizePool && <div className="text-right"><p className="text-sm font-bold text-vp-lime">{t.prizePool}</p><p className="text-[10px] text-vp-text-muted">Prize</p></div>}
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase ${
                      t.status === "active" ? "bg-vp-green/10 text-vp-green" :
                      t.status === "registration_open" ? "bg-vp-blue/10 text-vp-blue" :
                      t.status === "completed" ? "bg-vp-text-muted/10 text-vp-text-muted" :
                      "bg-vp-orange/10 text-vp-orange"
                    }`}>{t.status.replace("_", " ")}</span>
                  </div>
                </Link>
              ))}
              {tournaments.length === 0 && <p className="text-sm text-vp-text-dim text-center py-8">No tournaments yet. Create one to get started.</p>}
            </div>
          </div>

          {/* Rankings */}
          <div className="lg:col-span-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Top Players</h2>
            <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
              {players.map((player, i) => (
                <Link key={player.id} href="/profile" className={`flex items-center gap-3 px-5 py-4 hover:bg-vp-card-hover transition-colors ${i < players.length - 1 ? "border-b border-vp-border" : ""}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-vp-lime text-vp-dark" : "bg-vp-dark text-vp-text-dim"}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{player.displayName}</p>
                    <p className="text-[10px] text-vp-text-muted">{player.team?.name || "Free Agent"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-vp-lime">{player.rating}</p>
                    <p className="text-[10px] text-vp-green">{player.wins}W</p>
                  </div>
                </Link>
              ))}
              {players.length === 0 && <p className="text-sm text-vp-text-dim text-center py-8">No players yet</p>}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
