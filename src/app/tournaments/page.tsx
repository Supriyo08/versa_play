"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";

interface Tournament {
  id: string;
  name: string;
  sport: string;
  format: string;
  startDate: string;
  endDate: string;
  maxTeams: number;
  prizePool: string | null;
  venue: string | null;
  status: string;
  _count: { entries: number; matches: number };
}

interface Team {
  id: string;
  name: string;
  sport: string;
  verified: boolean;
  _count?: { members: number };
}

type FilterTab = "all" | "registration_open" | "active" | "upcoming" | "completed";

export default function TournamentsPage() {
  const { fetchWithAuth, loading: authLoading, user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [dataLoading, setDataLoading] = useState(true);

  // Registration modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registeringTournament, setRegisteringTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerResult, setRegisterResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchTournaments = () => {
    fetchWithAuth("/tournaments")
      .then((r) => r.json().catch(() => ({})))
      .then((data) => setTournaments(data.tournaments || []))
      .catch(console.error)
      .finally(() => setDataLoading(false));
  };

  useEffect(() => {
    if (authLoading) return;
    fetchTournaments();
  }, [authLoading, fetchWithAuth]);

  const filtered = filter === "all" ? tournaments : tournaments.filter((t) => t.status === filter);

  const openRegisterModal = async (tournament: Tournament) => {
    setRegisteringTournament(tournament);
    setShowRegisterModal(true);
    setSelectedTeamId("");
    setRegisterResult(null);
    setTeamsLoading(true);

    try {
      const res = await fetchWithAuth("/teams");
      const data = await res.json().catch(() => ({}));
      setTeams(data.teams || []);
    } catch {
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registeringTournament || !selectedTeamId) return;
    setRegistering(true);
    setRegisterResult(null);

    try {
      const res = await fetchWithAuth(`/tournaments/${registeringTournament.id}/entries`, {
        method: "POST",
        body: JSON.stringify({ teamId: selectedTeamId }),
      });
      const data = await res.json().catch(() => ({ error: "Invalid server response" }));

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setRegisterResult({ type: "success", text: `Successfully registered for ${registeringTournament.name}!` });
      // Refresh tournaments to update counts
      fetchTournaments();
    } catch (err: unknown) {
      setRegisterResult({ type: "error", text: err instanceof Error ? err.message : "Registration failed" });
    } finally {
      setRegistering(false);
    }
  };

  if (dataLoading) {
    return <AppShell><div className="flex items-center justify-center h-[60vh]"><div className="text-vp-lime animate-pulse text-xl font-bold">Loading Tournaments...</div></div></AppShell>;
  }

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Tournaments</h1>
            <p className="text-sm text-vp-text-dim mt-1">{tournaments.length} tournaments from database</p>
          </div>
          <div className="flex bg-vp-card rounded-xl border border-vp-border p-1 flex-wrap">
            {([["all", "All"], ["registration_open", "Open"], ["active", "Active"], ["upcoming", "Upcoming"], ["completed", "Done"]] as [FilterTab, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase transition-colors ${filter === key ? "bg-vp-lime text-vp-dark" : "text-vp-text-dim hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20"><p className="text-vp-text-dim text-sm">No tournaments found with status &ldquo;{filter}&rdquo;</p></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((t) => (
              <div key={t.id} className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-vp-text-muted uppercase tracking-wider">{t.sport} &bull; {t.format}</span>
                      <h3 className="text-lg font-bold text-white mt-1">{t.name}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      t.status === "registration_open" ? "bg-vp-green/10 text-vp-green" :
                      t.status === "active" ? "bg-vp-blue/10 text-vp-blue" :
                      t.status === "completed" ? "bg-vp-text-muted/10 text-vp-text-muted" :
                      "bg-vp-orange/10 text-vp-orange"
                    }`}>{t.status.replace("_", " ")}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-vp-text-dim">
                    <span>{new Date(t.startDate).toLocaleDateString()} — {new Date(t.endDate).toLocaleDateString()}</span>
                    {t.venue && <span>{t.venue}</span>}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-vp-border flex items-center justify-between">
                  <div className="flex gap-6">
                    <div><p className="text-lg font-black text-white">{t._count.entries}/{t.maxTeams}</p><p className="text-[10px] text-vp-text-muted uppercase">Teams</p></div>
                    {t.prizePool && <div><p className="text-lg font-black text-vp-lime">{t.prizePool}</p><p className="text-[10px] text-vp-text-muted uppercase">Prize</p></div>}
                    <div><p className="text-lg font-black text-white">{t._count.matches}</p><p className="text-[10px] text-vp-text-muted uppercase">Matches</p></div>
                  </div>
                  {t.status === "registration_open" && (
                    <button
                      onClick={() => openRegisterModal(t)}
                      className="bg-vp-lime text-vp-dark px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-vp-lime-dark transition-colors"
                    >
                      Register
                    </button>
                  )}
                </div>
                <div className="px-6 pb-4">
                  <div className="h-1.5 bg-vp-dark rounded-full overflow-hidden">
                    <div className="h-full bg-vp-lime rounded-full transition-all" style={{ width: `${(t._count.entries / t.maxTeams) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════ REGISTRATION MODAL ═══════ */}
      {showRegisterModal && registeringTournament && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-vp-card rounded-2xl border border-vp-border w-full max-w-lg">
            {/* Header */}
            <div className="p-6 border-b border-vp-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Register for Tournament</h3>
                  <p className="text-xs text-vp-text-dim mt-1">{registeringTournament.name}</p>
                </div>
                <button
                  onClick={() => { setShowRegisterModal(false); setRegisteringTournament(null); }}
                  className="w-8 h-8 rounded-lg bg-vp-dark flex items-center justify-center text-vp-text-muted hover:text-white transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            </div>

            {/* Tournament Info */}
            <div className="p-6 border-b border-vp-border">
              <div className="flex items-center gap-6 p-4 bg-vp-dark rounded-xl">
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{registeringTournament.sport}</p>
                  <p className="text-[9px] text-vp-text-muted uppercase">Sport</p>
                </div>
                <div className="w-px h-8 bg-vp-border" />
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{registeringTournament.format}</p>
                  <p className="text-[9px] text-vp-text-muted uppercase">Format</p>
                </div>
                <div className="w-px h-8 bg-vp-border" />
                <div className="text-center">
                  <p className="text-sm font-bold text-vp-lime">{registeringTournament._count.entries}/{registeringTournament.maxTeams}</p>
                  <p className="text-[9px] text-vp-text-muted uppercase">Teams</p>
                </div>
                {registeringTournament.prizePool && (
                  <>
                    <div className="w-px h-8 bg-vp-border" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-vp-orange">{registeringTournament.prizePool}</p>
                      <p className="text-[9px] text-vp-text-muted uppercase">Prize</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Team Selection */}
            <div className="p-6 space-y-4">
              {teamsLoading ? (
                <div className="text-center py-4">
                  <div className="text-vp-lime animate-pulse text-sm">Loading teams...</div>
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-vp-orange/10 flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">No Teams Available</p>
                  <p className="text-xs text-vp-text-dim">You need to be part of a team to register. Ask an admin to create teams first.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs text-vp-text-dim mb-2">Select Your Team</label>
                    <div className="space-y-2">
                      {teams.map((team) => (
                        <button
                          key={team.id}
                          onClick={() => setSelectedTeamId(team.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                            selectedTeamId === team.id
                              ? "border-vp-lime bg-vp-lime/5"
                              : "border-vp-border bg-vp-dark hover:border-vp-text-muted"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            selectedTeamId === team.id ? "bg-vp-lime/20 text-vp-lime" : "bg-vp-card text-vp-text-dim"
                          }`}>
                            {team.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white truncate">{team.name}</p>
                              {team.verified && (
                                <span className="text-[9px] font-bold text-vp-green bg-vp-green/10 px-1.5 py-0.5 rounded">Verified</span>
                              )}
                            </div>
                            <p className="text-[10px] text-vp-text-muted">{team.sport} &bull; {team._count?.members || 0} members</p>
                          </div>
                          {selectedTeamId === team.id && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Result Message */}
              {registerResult && (
                <div className={`p-3 rounded-xl border ${
                  registerResult.type === "success"
                    ? "bg-vp-green/5 border-vp-green/20"
                    : "bg-vp-red/5 border-vp-red/20"
                }`}>
                  <p className={`text-xs font-medium ${
                    registerResult.type === "success" ? "text-vp-green" : "text-vp-red"
                  }`}>
                    {registerResult.text}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-vp-border flex items-center justify-end gap-3">
              <button
                onClick={() => { setShowRegisterModal(false); setRegisteringTournament(null); }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-vp-text-dim hover:text-white transition-colors"
              >
                {registerResult?.type === "success" ? "Done" : "Cancel"}
              </button>
              {!registerResult?.type && teams.length > 0 && (
                <button
                  onClick={handleRegister}
                  disabled={!selectedTeamId || registering}
                  className="inline-flex items-center gap-2 bg-vp-lime text-vp-dark px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-vp-lime-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-vp-dark/30 border-t-vp-dark rounded-full animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Team"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
