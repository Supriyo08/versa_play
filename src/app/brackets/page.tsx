"use client";

import AppShell from "@/components/layout/AppShell";
import { useState } from "react";

interface BracketMatch {
  id: number;
  team1: string;
  team2: string;
  score1: number | null;
  score2: number | null;
  winner: number | null;
}

const knockoutRounds: { name: string; matches: BracketMatch[] }[] = [
  {
    name: "Quarter Finals",
    matches: [
      { id: 1, team1: "Apex Predators", team2: "Storm Blazers", score1: 3, score2: 1, winner: 1 },
      { id: 2, team1: "Thunder Wolves", team2: "Dark Phoenix", score1: 2, score2: 0, winner: 1 },
      { id: 3, team1: "Neon Knights", team2: "Iron Giants", score1: 1, score2: 3, winner: 2 },
      { id: 4, team1: "Swift Eagles", team2: "Crimson Tide", score1: 4, score2: 2, winner: 1 },
    ],
  },
  {
    name: "Semi Finals",
    matches: [
      { id: 5, team1: "Apex Predators", team2: "Thunder Wolves", score1: 2, score2: 1, winner: 1 },
      { id: 6, team1: "Iron Giants", team2: "Swift Eagles", score1: null, score2: null, winner: null },
    ],
  },
  {
    name: "Final",
    matches: [
      { id: 7, team1: "Apex Predators", team2: "TBD", score1: null, score2: null, winner: null },
    ],
  },
];

const leagueTable = [
  { team: "Apex Predators", played: 10, won: 8, draw: 1, lost: 1, gd: "+14", points: 25 },
  { team: "Thunder Wolves", played: 10, won: 7, draw: 2, lost: 1, gd: "+10", points: 23 },
  { team: "Iron Giants", played: 10, won: 6, draw: 1, lost: 3, gd: "+7", points: 19 },
  { team: "Neon Knights", played: 10, won: 5, draw: 2, lost: 3, gd: "+4", points: 17 },
  { team: "Swift Eagles", played: 10, won: 4, draw: 3, lost: 3, gd: "+2", points: 15 },
  { team: "Storm Blazers", played: 10, won: 3, draw: 1, lost: 6, gd: "-5", points: 10 },
  { team: "Dark Phoenix", played: 10, won: 2, draw: 0, lost: 8, gd: "-12", points: 6 },
  { team: "Crimson Tide", played: 10, won: 1, draw: 0, lost: 9, gd: "-20", points: 3 },
];

export default function BracketsPage() {
  const [format, setFormat] = useState<"knockout" | "league">("knockout");
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Tournament Bracket</h1>
            <p className="text-sm text-vp-text-dim mt-1">Pro League Season Finals — {format === "knockout" ? "Knockout" : "League"} Stage</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat("knockout")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors active:scale-95 ${format === "knockout" ? "bg-vp-lime text-vp-dark" : "bg-vp-card border border-vp-border text-vp-text-dim hover:text-white"}`}
            >
              Knockout
            </button>
            <button
              onClick={() => setFormat("league")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors active:scale-95 ${format === "league" ? "bg-vp-lime text-vp-dark" : "bg-vp-card border border-vp-border text-vp-text-dim hover:text-white"}`}
            >
              League
            </button>
          </div>
        </div>

        {format === "knockout" ? (
          <>
            {/* Bracket Visualization */}
            <div className="overflow-x-auto pb-4 -mx-6 px-6 lg:-mx-10 lg:px-10">
              <div className="flex gap-8 min-w-[900px] items-start">
                {knockoutRounds.map((round, roundIdx) => (
                  <div key={round.name} className="flex-1">
                    <p className="text-xs font-bold text-vp-text-dim uppercase tracking-widest mb-4 text-center">{round.name}</p>
                    <div className="flex flex-col gap-6 justify-around" style={{ minHeight: roundIdx === 0 ? "auto" : roundIdx === 1 ? "340px" : "500px", paddingTop: roundIdx === 1 ? "60px" : roundIdx === 2 ? "160px" : "0" }}>
                      {round.matches.map((match) => (
                        <button
                          key={match.id}
                          onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
                          className={`bg-vp-card rounded-xl border overflow-hidden text-left transition-all ${selectedMatch === match.id ? "border-vp-lime" : "border-vp-border hover:border-vp-text-muted"}`}
                        >
                          <div className="px-4 py-2 bg-vp-dark/50 border-b border-vp-border flex items-center justify-between">
                            <span className="text-[10px] text-vp-text-muted uppercase font-medium">Match {match.id}</span>
                            {match.winner ? (
                              <span className="text-[10px] font-bold text-vp-green uppercase">Completed</span>
                            ) : (
                              <span className="text-[10px] font-bold text-vp-text-muted uppercase">Upcoming</span>
                            )}
                          </div>
                          <div className={`flex items-center justify-between px-4 py-3 ${match.winner === 1 ? "bg-vp-lime/5" : ""}`}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-vp-lime/20 flex items-center justify-center text-[10px] font-bold text-vp-lime">{match.team1.charAt(0)}</div>
                              <span className={`text-xs font-medium ${match.winner === 1 ? "text-white" : "text-vp-text-dim"}`}>{match.team1}</span>
                            </div>
                            <span className={`text-sm font-bold ${match.winner === 1 ? "text-vp-lime" : "text-vp-text-dim"}`}>{match.score1 ?? "-"}</span>
                          </div>
                          <div className="h-px bg-vp-border" />
                          <div className={`flex items-center justify-between px-4 py-3 ${match.winner === 2 ? "bg-vp-lime/5" : ""}`}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-vp-blue/20 flex items-center justify-center text-[10px] font-bold text-vp-blue">{match.team2.charAt(0)}</div>
                              <span className={`text-xs font-medium ${match.winner === 2 ? "text-white" : "text-vp-text-dim"}`}>{match.team2}</span>
                            </div>
                            <span className={`text-sm font-bold ${match.winner === 2 ? "text-vp-lime" : "text-vp-text-dim"}`}>{match.score2 ?? "-"}</span>
                          </div>
                          {selectedMatch === match.id && (
                            <div className="px-4 py-2 bg-vp-dark/50 border-t border-vp-border text-center">
                              <span className="text-[10px] text-vp-lime font-medium">Click to view match details</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {/* Champion */}
                <div className="flex-1 flex flex-col items-center justify-center" style={{ paddingTop: "200px" }}>
                  <div className="w-16 h-16 rounded-full bg-vp-lime/20 flex items-center justify-center mb-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M8 3h8v6a4 4 0 01-8 0V3z" stroke="#c8ff00" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 15v4M8 19h8" stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 5H4v3a4 4 0 004 4M16 5h4v3a4 4 0 01-4 4" stroke="#c8ff00" strokeWidth="1.5"/></svg>
                  </div>
                  <p className="text-xs font-bold text-vp-text-dim uppercase tracking-widest">Champion</p>
                  <p className="text-sm font-bold text-white mt-1">TBD</p>
                </div>
              </div>
            </div>

            {/* Match Results Table */}
            <div className="mt-10">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">All Match Results</h2>
              <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-vp-border">
                      {["Match", "Team 1", "Score", "Team 2", "Status"].map((h) => (
                        <th key={h} className="text-left text-[10px] font-bold text-vp-text-muted uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {knockoutRounds.flatMap((round) => round.matches.map((match) => (
                        <tr key={match.id} className="border-b border-vp-border last:border-0 hover:bg-vp-card-hover transition-colors cursor-pointer" onClick={() => setSelectedMatch(match.id)}>
                          <td className="px-5 py-3"><span className="text-xs text-vp-text-dim">#{match.id}</span></td>
                          <td className="px-5 py-3"><span className={`text-xs font-medium ${match.winner === 1 ? "text-white" : "text-vp-text-dim"}`}>{match.team1}</span></td>
                          <td className="px-5 py-3 text-center"><span className="text-xs font-bold text-white">{match.score1 ?? "-"} — {match.score2 ?? "-"}</span></td>
                          <td className="px-5 py-3"><span className={`text-xs font-medium ${match.winner === 2 ? "text-white" : "text-vp-text-dim"}`}>{match.team2}</span></td>
                          <td className="px-5 py-3">{match.winner ? <span className="text-[10px] font-bold text-vp-green">COMPLETED</span> : <span className="text-[10px] font-bold text-vp-text-muted">UPCOMING</span>}</td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* League Table */
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">League Standings</h2>
            <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-vp-border">
                    {["#", "Team", "P", "W", "D", "L", "GD", "Pts"].map((h) => (
                      <th key={h} className="text-left text-[10px] font-bold text-vp-text-muted uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {leagueTable.map((row, i) => (
                      <tr key={row.team} className={`border-b border-vp-border last:border-0 hover:bg-vp-card-hover transition-colors ${i < 4 ? "" : ""}`}>
                        <td className="px-4 py-3">
                          <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-[10px] font-bold ${i < 4 ? "bg-vp-lime text-vp-dark" : "text-vp-text-dim"}`}>{i + 1}</span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-white">{row.team}</td>
                        <td className="px-4 py-3 text-xs text-vp-text-dim">{row.played}</td>
                        <td className="px-4 py-3 text-xs text-vp-green font-bold">{row.won}</td>
                        <td className="px-4 py-3 text-xs text-vp-text-dim">{row.draw}</td>
                        <td className="px-4 py-3 text-xs text-vp-red">{row.lost}</td>
                        <td className="px-4 py-3 text-xs text-vp-text-dim">{row.gd}</td>
                        <td className="px-4 py-3 text-sm font-black text-white">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
