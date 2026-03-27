"use client";

import AppShell from "@/components/layout/AppShell";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface Player { id: string; displayName: string; rating: number; wins: number; losses: number; user: { email: string; username: string }; team: { name: string } | null; }
interface Team { id: string; name: string; sport: string; verified: boolean; _count: { members: number }; }

type Tab = "players" | "clubs" | "tournaments" | "reports";

export default function AdminPage() {
  const { fetchWithAuth, loading: authLoading, isAdmin, user } = useAuth();

  // RBAC Guard — only admin and superadmin can access
  if (!authLoading && !isAdmin) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[60vh] px-6">
          <div className="w-16 h-16 rounded-full bg-vp-red/20 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M5.07 19h13.86c1.1 0 1.79-1.19 1.24-2.14L13.24 4.14a1.42 1.42 0 00-2.48 0L3.83 16.86c-.55.95.14 2.14 1.24 2.14z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-vp-text-dim text-center max-w-md">You don&apos;t have permission to access the Admin Dashboard. This page is restricted to <span className="text-vp-orange font-semibold">Admin</span> and <span className="text-vp-red font-semibold">Superadmin</span> users only.</p>
          <p className="text-xs text-vp-text-muted mt-3">Your current role: <span className="text-white font-medium capitalize">{user?.role || "unknown"}</span></p>
        </div>
      </AppShell>
    );
  }
  const [activeTab, setActiveTab] = useState<Tab>("players");
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [dataLoading, setDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Tournament form
  const [tName, setTName] = useState("");
  const [tSport, setTSport] = useState("");
  const [tFormat, setTFormat] = useState("knockout");
  const [tStart, setTStart] = useState("");
  const [tEnd, setTEnd] = useState("");
  const [tMaxTeams, setTMaxTeams] = useState("");
  const [tPrize, setTPrize] = useState("");
  const [tVenue, setTVenue] = useState("");
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  useEffect(() => {
    if (authLoading) return;
    const safeJson = (r: Response) => r.json().catch(() => ({}));
    Promise.all([
      fetchWithAuth("/players?limit=50").then(safeJson),
      fetchWithAuth("/teams").then(safeJson),
      fetchWithAuth("/admin/stats").then(safeJson),
    ]).then(([pData, tData, sData]) => {
      setPlayers(pData.players || []);
      setTeams(tData.teams || []);
      setStats(sData.stats || {});
    }).catch(console.error).finally(() => setDataLoading(false));
  }, [authLoading, fetchWithAuth]);

  const filteredPlayers = searchTerm
    ? players.filter(p => p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || p.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    : players;

  const handleCreateTournament = async () => {
    if (!tName || !tSport || !tStart || !tEnd || !tMaxTeams) {
      setCreateMsg("Please fill in all required fields (name, sport, dates, max teams).");
      return;
    }
    setCreating(true);
    setCreateMsg("");
    try {
      const res = await fetchWithAuth("/tournaments", {
        method: "POST",
        body: JSON.stringify({
          name: tName, sport: tSport, format: tFormat,
          startDate: tStart, endDate: tEnd,
          maxTeams: parseInt(tMaxTeams), prizePool: tPrize || null, venue: tVenue || null,
        }),
      });
      const data = await res.json().catch(() => ({ error: "Invalid response from server" }));
      if (!res.ok) throw new Error(data.error || "Failed to create");
      setCreateMsg(`Tournament "${data.tournament?.name || tName}" created successfully!`);
      setTName(""); setTSport(""); setTStart(""); setTEnd(""); setTMaxTeams(""); setTPrize(""); setTVenue("");
    } catch (err: unknown) {
      setCreateMsg(err instanceof Error ? err.message : "Failed to create tournament");
    } finally { setCreating(false); }
  };

  if (dataLoading) {
    return <AppShell><div className="flex items-center justify-center h-[60vh]"><div className="text-vp-lime animate-pulse text-xl font-bold">Loading Admin...</div></div></AppShell>;
  }

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-vp-text-dim mt-1">Real-time data from PostgreSQL database</p>
        </div>

        {/* KPIs from API */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Players", value: stats.totalPlayers || players.length },
            { label: "Total Teams", value: stats.totalTeams || teams.length },
            { label: "Tournaments", value: stats.totalTournaments || 0 },
            { label: "Total Matches", value: stats.totalMatches || 0 },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <p className="text-xs text-vp-text-dim uppercase tracking-wider">{kpi.label}</p>
              <p className="text-2xl font-black text-white mt-2">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-vp-card rounded-xl p-1 w-fit">
          {(["players", "clubs", "tournaments", "reports"] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? "bg-vp-lime text-vp-dark" : "text-vp-text-dim hover:text-white"}`}>{tab}</button>
          ))}
        </div>

        {/* Players Tab */}
        {activeTab === "players" && (
          <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
            <div className="p-5 border-b border-vp-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Players from Database ({players.length})</h3>
              <input type="text" placeholder="Search players..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-vp-dark border border-vp-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30 w-48" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-vp-border">
                  {["Player", "Email", "Team", "Rating", "W/L"].map(h => <th key={h} className="text-left text-[10px] font-bold text-vp-text-muted uppercase px-5 py-3">{h}</th>)}
                </tr></thead>
                <tbody>
                  {filteredPlayers.map(p => (
                    <tr key={p.id} className="border-b border-vp-border last:border-0 hover:bg-vp-card-hover">
                      <td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-vp-lime/20 flex items-center justify-center text-xs font-bold text-vp-lime">{p.displayName.split(" ").map(n => n[0]).join("")}</div><span className="text-sm font-semibold text-white">{p.displayName}</span></div></td>
                      <td className="px-5 py-3 text-xs text-vp-text-dim">{p.user.email}</td>
                      <td className="px-5 py-3 text-xs text-vp-text-dim">{p.team?.name || "—"}</td>
                      <td className="px-5 py-3"><span className="text-xs font-bold text-vp-lime">{p.rating}</span></td>
                      <td className="px-5 py-3 text-xs text-vp-text-dim">{p.wins}W / {p.losses}L</td>
                    </tr>
                  ))}
                  {filteredPlayers.length === 0 && <tr><td colSpan={5} className="px-5 py-6 text-center text-xs text-vp-text-dim">No players found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clubs Tab */}
        {activeTab === "clubs" && (
          <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
            <div className="p-5 border-b border-vp-border"><h3 className="text-sm font-bold text-white uppercase tracking-wider">Teams from Database ({teams.length})</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-vp-border">
                  {["Team", "Sport", "Members", "Verified"].map(h => <th key={h} className="text-left text-[10px] font-bold text-vp-text-muted uppercase px-5 py-3">{h}</th>)}
                </tr></thead>
                <tbody>
                  {teams.map(t => (
                    <tr key={t.id} className="border-b border-vp-border last:border-0 hover:bg-vp-card-hover">
                      <td className="px-5 py-3 text-sm font-semibold text-white">{t.name}</td>
                      <td className="px-5 py-3 text-xs text-vp-text-dim">{t.sport}</td>
                      <td className="px-5 py-3 text-xs text-vp-text-dim">{t._count.members}</td>
                      <td className="px-5 py-3"><span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${t.verified ? "bg-vp-green/10 text-vp-green" : "bg-vp-orange/10 text-vp-orange"}`}>{t.verified ? "Verified" : "Pending"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tournaments Tab - Create via API */}
        {activeTab === "tournaments" && (
          <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Create Tournament (saves to database)</h3>
            {createMsg && (
              <div className={`mb-4 p-3 rounded-xl text-xs font-medium ${createMsg.includes("success") ? "bg-vp-green/10 border border-vp-green/30 text-vp-green" : "bg-vp-red/10 border border-vp-red/30 text-vp-red"}`}>{createMsg}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs text-vp-text-dim mb-1.5">Tournament Name *</label><input type="text" value={tName} onChange={e => setTName(e.target.value)} placeholder="e.g. Pro League Finals" className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30" /></div>
              <div><label className="block text-xs text-vp-text-dim mb-1.5">Sport *</label><input type="text" value={tSport} onChange={e => setTSport(e.target.value)} placeholder="e.g. Soccer, Basketball" className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30" /></div>
              <div><label className="block text-xs text-vp-text-dim mb-1.5">Format</label><select value={tFormat} onChange={e => setTFormat(e.target.value)} className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vp-lime/30"><option value="knockout">Knockout</option><option value="league">League</option><option value="round_robin">Round Robin</option></select></div>
              <div><label className="block text-xs text-vp-text-dim mb-1.5">Max Teams *</label><input type="number" value={tMaxTeams} onChange={e => setTMaxTeams(e.target.value)} placeholder="e.g. 16" className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30" /></div>
              <div><label className="block text-xs text-vp-text-dim mb-1.5">Start Date *</label><input type="date" value={tStart} onChange={e => setTStart(e.target.value)} className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vp-lime/30" /></div>
              <div><label className="block text-xs text-vp-text-dim mb-1.5">End Date *</label><input type="date" value={tEnd} onChange={e => setTEnd(e.target.value)} className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vp-lime/30" /></div>
              <div><label className="block text-xs text-vp-text-dim mb-1.5">Prize Pool</label><input type="text" value={tPrize} onChange={e => setTPrize(e.target.value)} placeholder="e.g. $10,000" className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30" /></div>
              <div><label className="block text-xs text-vp-text-dim mb-1.5">Venue</label><input type="text" value={tVenue} onChange={e => setTVenue(e.target.value)} placeholder="e.g. Central Arena" className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30" /></div>
              <div className="md:col-span-2">
                <button onClick={handleCreateTournament} disabled={creating} className="bg-vp-lime text-vp-dark px-6 py-3 rounded-xl text-sm font-bold hover:bg-vp-lime-dark transition-colors disabled:opacity-50">
                  {creating ? "Creating..." : "Create Tournament"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Database Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="bg-vp-dark rounded-xl p-4">
                  <p className="text-xs text-vp-text-dim capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-lg font-black text-white mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
