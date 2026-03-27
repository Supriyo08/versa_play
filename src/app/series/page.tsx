"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type MatchStatus = "completed" | "live" | "upcoming";

interface TeamScore {
  teamName: string;
  shortName: string;
  color: string;
  runs?: number;
  wickets?: number;
  overs?: number;
}

interface MatchCard {
  id: number;
  matchNumber: number;
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  team1: TeamScore;
  team2: TeamScore;
  result?: string;
}

interface Standing {
  position: number;
  team: string;
  shortName: string;
  color: string;
  played: number;
  won: number;
  lost: number;
  nr: number;
  nrr: string;
  points: number;
}

interface StatEntry {
  label: string;
  player: string;
  team: string;
  value: string;
  icon: string;
  accentColor: string;
}

interface SquadPlayer {
  name: string;
  role: string;
}

interface TeamSquad {
  team: string;
  shortName: string;
  color: string;
  captain: string;
  players: SquadPlayer[];
}

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */

const TEAM_COLORS: Record<string, string> = {
  MS: "#c8ff00",
  ST: "#f59e0b",
  PS: "#f97316",
  BH: "#22c55e",
  AS: "#4a7cff",
  SR: "#ef4444",
  HH: "#a855f7",
  SS: "#06b6d4",
};

const matches: MatchCard[] = [
  {
    id: 1, matchNumber: 1, date: "Dec 12, 2025", time: "14:00", venue: "MCG, Melbourne",
    status: "completed",
    team1: { teamName: "Melbourne Stars", shortName: "MS", color: TEAM_COLORS.MS, runs: 186, wickets: 4, overs: 20 },
    team2: { teamName: "Sydney Thunder", shortName: "ST", color: TEAM_COLORS.ST, runs: 172, wickets: 8, overs: 20 },
    result: "Melbourne Stars won by 14 runs",
  },
  {
    id: 2, matchNumber: 2, date: "Dec 13, 2025", time: "19:30", venue: "Optus Stadium, Perth",
    status: "completed",
    team1: { teamName: "Perth Scorchers", shortName: "PS", color: TEAM_COLORS.PS, runs: 198, wickets: 5, overs: 20 },
    team2: { teamName: "Brisbane Heat", shortName: "BH", color: TEAM_COLORS.BH, runs: 199, wickets: 3, overs: 19.2 },
    result: "Brisbane Heat won by 7 wickets",
  },
  {
    id: 3, matchNumber: 3, date: "Dec 14, 2025", time: "14:00", venue: "Adelaide Oval, Adelaide",
    status: "completed",
    team1: { teamName: "Adelaide Strikers", shortName: "AS", color: TEAM_COLORS.AS, runs: 165, wickets: 7, overs: 20 },
    team2: { teamName: "Sydney Sixers", shortName: "SS", color: TEAM_COLORS.SS, runs: 168, wickets: 4, overs: 18.4 },
    result: "Sydney Sixers won by 6 wickets",
  },
  {
    id: 4, matchNumber: 4, date: "Dec 15, 2025", time: "19:30", venue: "SCG, Sydney",
    status: "live",
    team1: { teamName: "Hobart Hurricanes", shortName: "HH", color: TEAM_COLORS.HH, runs: 154, wickets: 6, overs: 17.3 },
    team2: { teamName: "Sydney Thunder", shortName: "ST", color: TEAM_COLORS.ST },
  },
  {
    id: 5, matchNumber: 5, date: "Dec 16, 2025", time: "14:00", venue: "MCG, Melbourne",
    status: "upcoming",
    team1: { teamName: "Melbourne Stars", shortName: "MS", color: TEAM_COLORS.MS },
    team2: { teamName: "Perth Scorchers", shortName: "PS", color: TEAM_COLORS.PS },
  },
  {
    id: 6, matchNumber: 6, date: "Dec 17, 2025", time: "19:30", venue: "Gabba, Brisbane",
    status: "upcoming",
    team1: { teamName: "Brisbane Heat", shortName: "BH", color: TEAM_COLORS.BH },
    team2: { teamName: "Adelaide Strikers", shortName: "AS", color: TEAM_COLORS.AS },
  },
  {
    id: 7, matchNumber: 7, date: "Dec 18, 2025", time: "14:00", venue: "Blundstone Arena, Hobart",
    status: "upcoming",
    team1: { teamName: "Hobart Hurricanes", shortName: "HH", color: TEAM_COLORS.HH },
    team2: { teamName: "Sydney Sixers", shortName: "SS", color: TEAM_COLORS.SS },
  },
  {
    id: 8, matchNumber: 8, date: "Dec 19, 2025", time: "19:30", venue: "SCG, Sydney",
    status: "upcoming",
    team1: { teamName: "Sydney Sixers", shortName: "SS", color: TEAM_COLORS.SS },
    team2: { teamName: "Melbourne Stars", shortName: "MS", color: TEAM_COLORS.MS },
  },
];

const standings: Standing[] = [
  { position: 1, team: "Melbourne Stars", shortName: "MS", color: TEAM_COLORS.MS, played: 5, won: 4, lost: 1, nr: 0, nrr: "+1.245", points: 8 },
  { position: 2, team: "Brisbane Heat", shortName: "BH", color: TEAM_COLORS.BH, played: 5, won: 4, lost: 1, nr: 0, nrr: "+0.982", points: 8 },
  { position: 3, team: "Sydney Sixers", shortName: "SS", color: TEAM_COLORS.SS, played: 5, won: 3, lost: 1, nr: 1, nrr: "+0.654", points: 7 },
  { position: 4, team: "Perth Scorchers", shortName: "PS", color: TEAM_COLORS.PS, played: 5, won: 3, lost: 2, nr: 0, nrr: "+0.321", points: 6 },
  { position: 5, team: "Sydney Thunder", shortName: "ST", color: TEAM_COLORS.ST, played: 4, won: 2, lost: 2, nr: 0, nrr: "-0.120", points: 4 },
  { position: 6, team: "Hobart Hurricanes", shortName: "HH", color: TEAM_COLORS.HH, played: 4, won: 2, lost: 2, nr: 0, nrr: "-0.345", points: 4 },
  { position: 7, team: "Adelaide Strikers", shortName: "AS", color: TEAM_COLORS.AS, played: 5, won: 1, lost: 4, nr: 0, nrr: "-0.890", points: 2 },
  { position: 8, team: "Melbourne Renegades", shortName: "MR", color: "#ef4444", played: 5, won: 0, lost: 5, nr: 0, nrr: "-1.847", points: 0 },
];

const seriesStats: StatEntry[] = [
  { label: "Top Run Scorer", player: "Marcus Stoinis", team: "MS", value: "312 runs", icon: "bat", accentColor: "#c8ff00" },
  { label: "Top Wicket Taker", player: "Rashid Khan", team: "AS", value: "14 wkts", icon: "ball", accentColor: "#4a7cff" },
  { label: "Most Sixes", player: "Tim David", team: "BH", value: "18 sixes", icon: "six", accentColor: "#a855f7" },
  { label: "Best Economy", player: "Adam Zampa", team: "MS", value: "5.84", icon: "eco", accentColor: "#22c55e" },
];

const squads: TeamSquad[] = [
  {
    team: "Melbourne Stars", shortName: "MS", color: TEAM_COLORS.MS, captain: "Marcus Stoinis",
    players: [
      { name: "Marcus Stoinis", role: "Captain / All-rounder" }, { name: "Adam Zampa", role: "Leg Spinner" },
      { name: "Joe Clarke", role: "Wicketkeeper" }, { name: "Haris Rauf", role: "Fast Bowler" },
      { name: "Tom Rogers", role: "Medium Pacer" }, { name: "Beau Webster", role: "All-rounder" },
    ],
  },
  {
    team: "Sydney Thunder", shortName: "ST", color: TEAM_COLORS.ST, captain: "David Warner",
    players: [
      { name: "David Warner", role: "Captain / Opener" }, { name: "Alex Hales", role: "Opener" },
      { name: "Sam Billings", role: "Wicketkeeper" }, { name: "Fazalhaq Farooqi", role: "Fast Bowler" },
      { name: "Daniel Sams", role: "All-rounder" }, { name: "Tanveer Sangha", role: "Leg Spinner" },
    ],
  },
  {
    team: "Perth Scorchers", shortName: "PS", color: TEAM_COLORS.PS, captain: "Ashton Turner",
    players: [
      { name: "Ashton Turner", role: "Captain / Batsman" }, { name: "Josh Inglis", role: "Wicketkeeper" },
      { name: "Jhye Richardson", role: "Fast Bowler" }, { name: "Andrew Tye", role: "Medium Pacer" },
      { name: "Aaron Hardie", role: "All-rounder" }, { name: "Ashton Agar", role: "Left-arm Spinner" },
    ],
  },
  {
    team: "Brisbane Heat", shortName: "BH", color: TEAM_COLORS.BH, captain: "Usman Khawaja",
    players: [
      { name: "Usman Khawaja", role: "Captain / Opener" }, { name: "Tim David", role: "Power Hitter" },
      { name: "Josh Brown", role: "All-rounder" }, { name: "Michael Neser", role: "Fast Bowler" },
      { name: "Mitchell Swepson", role: "Leg Spinner" }, { name: "Jimmy Peirson", role: "Wicketkeeper" },
    ],
  },
  {
    team: "Adelaide Strikers", shortName: "AS", color: TEAM_COLORS.AS, captain: "Matt Short",
    players: [
      { name: "Matt Short", role: "Captain / Opener" }, { name: "Rashid Khan", role: "Leg Spinner" },
      { name: "Alex Carey", role: "Wicketkeeper" }, { name: "Henry Thornton", role: "Fast Bowler" },
      { name: "Thomas Kelly", role: "Batsman" }, { name: "Colin de Grandhomme", role: "All-rounder" },
    ],
  },
  {
    team: "Sydney Sixers", shortName: "SS", color: TEAM_COLORS.SS, captain: "Moises Henriques",
    players: [
      { name: "Moises Henriques", role: "Captain / All-rounder" }, { name: "Josh Philippe", role: "Wicketkeeper" },
      { name: "James Vince", role: "Batsman" }, { name: "Sean Abbott", role: "Fast Bowler" },
      { name: "Steve O'Keefe", role: "Left-arm Spinner" }, { name: "Hayden Kerr", role: "All-rounder" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  HELPER COMPONENTS                                                  */
/* ------------------------------------------------------------------ */

function TeamBadge({ shortName, color }: { shortName: string; color: string }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black tracking-wide shrink-0"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {shortName}
    </div>
  );
}

function StatusBadge({ status }: { status: MatchStatus }) {
  const map: Record<MatchStatus, { bg: string; text: string; label: string; dot?: boolean }> = {
    completed: { bg: "bg-vp-text-muted/10", text: "text-vp-text-muted", label: "Completed" },
    live: { bg: "bg-vp-red/10", text: "text-vp-red", label: "Live", dot: true },
    upcoming: { bg: "bg-vp-blue/10", text: "text-vp-blue", label: "Upcoming" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${s.bg} ${s.text}`}>
      {s.dot && <span className="w-1.5 h-1.5 rounded-full bg-vp-red animate-pulse" />}
      {s.label}
    </span>
  );
}

function StatIcon({ type, color }: { type: string; color: string }) {
  const shared = "w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0";
  return (
    <div className={shared} style={{ backgroundColor: `${color}18`, color }}>
      {type === "bat" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l4-4"/><path d="M7 17l9.5-9.5a2.12 2.12 0 013 3L10 20"/><path d="M14.5 6.5l3 3"/></svg>
      )}
      {type === "ball" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M6 12c0-1.68.68-3.2 1.76-4.24M18 12c0 1.68-.68 3.2-1.76 4.24"/></svg>
      )}
      {type === "six" && (
        <span className="font-black text-sm">6</span>
      )}
      {type === "eco" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

type MatchFilter = "all" | "completed" | "live" | "upcoming";

export default function SeriesOverviewPage() {
  const [matchFilter, setMatchFilter] = useState<MatchFilter>("all");

  const filteredMatches =
    matchFilter === "all" ? matches : matches.filter((m) => m.status === matchFilter);

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8 space-y-10">
        {/* ── SERIES HEADER ── */}
        <div className="relative overflow-hidden rounded-2xl border border-vp-border bg-vp-card">
          {/* Gradient accent strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vp-lime via-vp-blue to-vp-purple" />

          <div className="px-6 pt-7 pb-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-lg bg-vp-lime/10 text-vp-lime text-[10px] font-bold uppercase tracking-widest mb-3">
                  T20 Cricket Series
                </span>
                <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                  T20 CHAMPIONS CUP
                </h1>
                <p className="text-sm text-vp-text-dim mt-2">
                  Season 2025 &bull; 8 Teams &bull; 35 Matches &bull; Dec 12 &ndash; Jan 28
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">12</p>
                  <p className="text-[10px] font-bold text-vp-text-muted uppercase">PTS</p>
                </div>
                <div className="w-px h-10 bg-vp-border" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-vp-green" />
                  <span className="text-sm font-semibold text-vp-text-dim">Melbourne Stars</span>
                </div>
                <div className="w-px h-10 bg-vp-border" />
                <div className="text-center">
                  <p className="text-2xl font-black text-vp-lime">1st</p>
                  <p className="text-[10px] font-bold text-vp-text-muted uppercase">Rank</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stat pills */}
          <div className="px-6 pb-6 lg:px-8 flex flex-wrap gap-3">
            {[
              { label: "Matches Played", value: "16/35", color: "text-white" },
              { label: "Live", value: "1", color: "text-vp-red" },
              { label: "Upcoming", value: "18", color: "text-vp-blue" },
              { label: "Highest Score", value: "224/3", color: "text-vp-lime" },
            ].map((pill) => (
              <div
                key={pill.label}
                className="flex items-center gap-2 bg-vp-dark/60 rounded-xl px-4 py-2 border border-vp-border"
              >
                <span className="text-[11px] text-vp-text-muted font-medium">{pill.label}</span>
                <span className={`text-sm font-bold ${pill.color}`}>{pill.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN GRID: Matches + Sidebar ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-10">
            {/* ── MATCH SCHEDULE ── */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <h2 className="text-lg font-bold text-white">Match Schedule</h2>
                <div className="flex bg-vp-card rounded-xl border border-vp-border p-1">
                  {(["all", "live", "upcoming", "completed"] as MatchFilter[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setMatchFilter(key)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase transition-colors ${
                        matchFilter === key
                          ? "bg-vp-lime text-vp-dark"
                          : "text-vp-text-dim hover:text-white"
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredMatches.length === 0 && (
                  <div className="text-center py-12 text-vp-text-dim text-sm">
                    No matches found for this filter.
                  </div>
                )}
                {filteredMatches.map((m) => (
                  <div
                    key={m.id}
                    className="bg-vp-card rounded-2xl border border-vp-border hover:border-vp-border/80 transition-colors overflow-hidden"
                  >
                    {/* Match card top bar */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-vp-text-muted uppercase tracking-wider">
                          Match {m.matchNumber}
                        </span>
                        <StatusBadge status={m.status} />
                      </div>
                      <span className="text-[11px] text-vp-text-dim">
                        {m.date} &bull; {m.time}
                      </span>
                    </div>

                    {/* Teams & Scores */}
                    <div className="px-5 pb-4">
                      <div className="flex items-center gap-4 py-2">
                        <TeamBadge shortName={m.team1.shortName} color={m.team1.color} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{m.team1.teamName}</p>
                          {m.team1.runs !== undefined && (
                            <p className="text-xs text-vp-text-dim mt-0.5">
                              {m.team1.runs}/{m.team1.wickets}{" "}
                              <span className="text-vp-text-muted">({m.team1.overs} ov)</span>
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-bold text-vp-text-muted">VS</span>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-sm font-bold text-white truncate">{m.team2.teamName}</p>
                          {m.team2.runs !== undefined && (
                            <p className="text-xs text-vp-text-dim mt-0.5">
                              {m.team2.runs}/{m.team2.wickets}{" "}
                              <span className="text-vp-text-muted">({m.team2.overs} ov)</span>
                            </p>
                          )}
                        </div>
                        <TeamBadge shortName={m.team2.shortName} color={m.team2.color} />
                      </div>

                      {/* Venue & Result */}
                      <div className="flex items-center justify-between pt-3 border-t border-vp-border mt-2">
                        <span className="text-[11px] text-vp-text-muted">{m.venue}</span>
                        {m.result && (
                          <span className="text-[11px] font-semibold text-vp-green">{m.result}</span>
                        )}
                        {m.status === "upcoming" && (
                          <span className="text-[11px] font-semibold text-vp-blue">Starts {m.time}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── POINTS TABLE ── */}
            <section>
              <h2 className="text-lg font-bold text-white mb-5">Points Table</h2>
              <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[40px_1fr_50px_50px_50px_50px_65px_60px] gap-2 px-5 py-3 border-b border-vp-border text-[10px] font-bold text-vp-text-muted uppercase tracking-wider">
                  <span>#</span>
                  <span>Team</span>
                  <span className="text-center">P</span>
                  <span className="text-center">W</span>
                  <span className="text-center">L</span>
                  <span className="text-center">NR</span>
                  <span className="text-center">NRR</span>
                  <span className="text-center">PTS</span>
                </div>

                {/* Table rows */}
                {standings.map((row) => {
                  const isQualified = row.position <= 4;
                  return (
                    <div
                      key={row.position}
                      className={`grid grid-cols-[40px_1fr_50px_50px_50px_50px_65px_60px] gap-2 px-5 py-3 items-center transition-colors hover:bg-vp-card-hover ${
                        row.position < standings.length ? "border-b border-vp-border/50" : ""
                      } ${isQualified ? "bg-vp-lime/[0.02]" : ""}`}
                    >
                      <span
                        className={`text-sm font-bold ${
                          isQualified ? "text-vp-lime" : "text-vp-text-muted"
                        }`}
                      >
                        {row.position}
                      </span>
                      <div className="flex items-center gap-3 min-w-0">
                        <TeamBadge shortName={row.shortName} color={row.color} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{row.team}</p>
                        </div>
                        {isQualified && (
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-vp-lime" />
                        )}
                      </div>
                      <span className="text-sm text-vp-text-dim text-center">{row.played}</span>
                      <span className="text-sm font-semibold text-vp-green text-center">{row.won}</span>
                      <span className="text-sm text-vp-red text-center">{row.lost}</span>
                      <span className="text-sm text-vp-text-muted text-center">{row.nr}</span>
                      <span
                        className={`text-sm text-center font-medium ${
                          row.nrr.startsWith("+") ? "text-vp-green" : "text-vp-red"
                        }`}
                      >
                        {row.nrr}
                      </span>
                      <span className="text-sm font-black text-white text-center">{row.points}</span>
                    </div>
                  );
                })}

                {/* Qualification line hint */}
                <div className="px-5 py-2.5 border-t border-vp-border bg-vp-dark/40">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-vp-lime" />
                    <span className="text-[10px] text-vp-text-muted font-medium uppercase tracking-wider">
                      Top 4 qualify for semi-finals
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN -- SIDEBAR */}
          <aside className="space-y-6">
            {/* ── SERIES STATS ── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
              <div className="px-5 py-4 border-b border-vp-border">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Series Stats</h3>
              </div>
              <div className="divide-y divide-vp-border/50">
                {seriesStats.map((stat) => (
                  <div key={stat.label} className="px-5 py-4 flex items-center gap-3">
                    <StatIcon type={stat.icon} color={stat.accentColor} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-vp-text-muted uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-sm font-bold text-white truncate">{stat.player}</p>
                      <p className="text-xs text-vp-text-dim">{stat.team}</p>
                    </div>
                    <span
                      className="text-sm font-black shrink-0"
                      style={{ color: stat.accentColor }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── MINI STANDINGS ── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
              <div className="px-5 py-4 border-b border-vp-border">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Standings</h3>
              </div>
              <div className="divide-y divide-vp-border/50">
                {standings.slice(0, 4).map((row) => (
                  <div key={row.position} className="px-5 py-3 flex items-center gap-3">
                    <span className="text-sm font-bold text-vp-lime w-5">{row.position}</span>
                    <TeamBadge shortName={row.shortName} color={row.color} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{row.team}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white">{row.points} pts</p>
                      <p className="text-[10px] text-vp-text-muted">NRR {row.nrr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RECENT FORM ── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
              <div className="px-5 py-4 border-b border-vp-border">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Form</h3>
              </div>
              <div className="divide-y divide-vp-border/50">
                {[
                  { team: "Melbourne Stars", short: "MS", color: TEAM_COLORS.MS, form: ["W", "W", "L", "W", "W"] },
                  { team: "Brisbane Heat", short: "BH", color: TEAM_COLORS.BH, form: ["W", "L", "W", "W", "W"] },
                  { team: "Perth Scorchers", short: "PS", color: TEAM_COLORS.PS, form: ["L", "W", "W", "L", "W"] },
                  { team: "Sydney Thunder", short: "ST", color: TEAM_COLORS.ST, form: ["W", "L", "W", "L", "-"] },
                ].map((t) => (
                  <div key={t.short} className="px-5 py-3 flex items-center gap-3">
                    <TeamBadge shortName={t.short} color={t.color} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{t.team}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {t.form.map((result, i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            result === "W"
                              ? "bg-vp-green/15 text-vp-green"
                              : result === "L"
                              ? "bg-vp-red/15 text-vp-red"
                              : "bg-vp-border text-vp-text-muted"
                          }`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* ── TEAM SQUADS ── */}
        <section>
          <h2 className="text-lg font-bold text-white mb-5">Team Squads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {squads.map((squad) => (
              <div
                key={squad.shortName}
                className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden hover:border-vp-border/80 transition-colors"
              >
                {/* Team header strip */}
                <div className="h-1 w-full" style={{ backgroundColor: squad.color }} />

                <div className="px-5 pt-4 pb-2 flex items-center gap-3">
                  <TeamBadge shortName={squad.shortName} color={squad.color} />
                  <div>
                    <h3 className="text-sm font-bold text-white">{squad.team}</h3>
                    <p className="text-[10px] text-vp-text-muted">
                      Captain: <span className="text-vp-text-dim font-medium">{squad.captain}</span>
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-4">
                  <div className="space-y-0.5 mt-2">
                    {squad.players.map((player) => (
                      <div
                        key={player.name}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-vp-dark/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {player.name === squad.captain && (
                            <span
                              className="shrink-0 w-4 h-4 rounded flex items-center justify-center text-[8px] font-black"
                              style={{ backgroundColor: `${squad.color}25`, color: squad.color }}
                            >
                              C
                            </span>
                          )}
                          <span className="text-sm text-white truncate">{player.name}</span>
                        </div>
                        <span className="text-[10px] text-vp-text-muted font-medium shrink-0 ml-2">
                          {player.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
