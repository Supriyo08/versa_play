"use client";

import AppShell from "@/components/layout/AppShell";
import { useState } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────────

const player = {
  name: "Marcus 'Vortex' Kane",
  position: "All-Rounder",
  team: "Neon Strikers",
  teamBadge: "NS",
  winRate: 78.4,
  seasonWins: 34,
  globalRank: 7,
  level: 42,
  xp: 8750,
};

const overviewCards = [
  { label: "Matches Played", value: "156", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4", change: "+18 this season", color: "text-vp-blue" },
  { label: "Win Rate", value: "78.4%", icon: "", change: "+3.2% from last season", color: "text-vp-lime", isCircular: true, circularValue: 78.4 },
  { label: "Current Streak", value: "7W", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", change: "Best: 12W", color: "text-vp-green" },
  { label: "Season Points", value: "2,480", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z", change: "Top 5% globally", color: "text-vp-orange" },
];

type Period = "Week" | "Month" | "Season" | "All Time";

const performanceData: Record<Period, { label: string; wins: number; losses: number }[]> = {
  Week: [
    { label: "Mon", wins: 3, losses: 1 },
    { label: "Tue", wins: 2, losses: 0 },
    { label: "Wed", wins: 1, losses: 2 },
    { label: "Thu", wins: 4, losses: 1 },
    { label: "Fri", wins: 2, losses: 1 },
    { label: "Sat", wins: 5, losses: 0 },
    { label: "Sun", wins: 3, losses: 1 },
  ],
  Month: [
    { label: "W1", wins: 8, losses: 3 },
    { label: "W2", wins: 10, losses: 2 },
    { label: "W3", wins: 7, losses: 4 },
    { label: "W4", wins: 12, losses: 1 },
  ],
  Season: [
    { label: "Jan", wins: 12, losses: 5 },
    { label: "Feb", wins: 15, losses: 3 },
    { label: "Mar", wins: 10, losses: 6 },
    { label: "Apr", wins: 14, losses: 4 },
    { label: "May", wins: 18, losses: 2 },
    { label: "Jun", wins: 16, losses: 3 },
    { label: "Jul", wins: 13, losses: 5 },
    { label: "Aug", wins: 17, losses: 1 },
    { label: "Sep", wins: 19, losses: 2 },
    { label: "Oct", wins: 14, losses: 4 },
    { label: "Nov", wins: 20, losses: 1 },
    { label: "Dec", wins: 11, losses: 3 },
  ],
  "All Time": [
    { label: "S1", wins: 45, losses: 22 },
    { label: "S2", wins: 58, losses: 18 },
    { label: "S3", wins: 67, losses: 14 },
    { label: "S4", wins: 72, losses: 10 },
  ],
};

const skills = [
  { name: "Speed", value: 92, color: "from-vp-lime to-vp-green" },
  { name: "Accuracy", value: 87, color: "from-vp-blue to-[#7c3aed]" },
  { name: "Agility", value: 95, color: "from-vp-orange to-vp-red" },
  { name: "Strength", value: 78, color: "from-vp-purple to-[#ec4899]" },
  { name: "Endurance", value: 84, color: "from-vp-green to-vp-blue" },
];

const matchHistory = [
  { id: 1, opponent: "Thunder Wolves", result: "W" as const, score: "156/3 vs 142/8", date: "Mar 25, 2025", tournament: "Pro League S4" },
  { id: 2, opponent: "Shadow Ravens", result: "W" as const, score: "189/5 vs 165/10", date: "Mar 22, 2025", tournament: "Pro League S4" },
  { id: 3, opponent: "Neon Knights", result: "L" as const, score: "134/10 vs 178/4", date: "Mar 19, 2025", tournament: "Pro League S4" },
  { id: 4, opponent: "Cyber Titans", result: "W" as const, score: "210/2 vs 198/7", date: "Mar 16, 2025", tournament: "Champions Cup" },
  { id: 5, opponent: "Blaze Phoenix", result: "W" as const, score: "175/6 vs 170/9", date: "Mar 13, 2025", tournament: "Champions Cup" },
  { id: 6, opponent: "Iron Hawks", result: "W" as const, score: "192/4 vs 155/10", date: "Mar 10, 2025", tournament: "Pro League S4" },
  { id: 7, opponent: "Storm Breakers", result: "L" as const, score: "148/10 vs 152/6", date: "Mar 7, 2025", tournament: "Pro League S4" },
  { id: 8, opponent: "Frost Giants", result: "W" as const, score: "203/3 vs 180/8", date: "Mar 4, 2025", tournament: "Champions Cup" },
];

const achievements = [
  { id: 1, name: "Century Slayer", desc: "Score 100+ in a single match", icon: "🎯", date: "Mar 25, 2025", color: "from-vp-lime/20 to-vp-green/20", borderColor: "border-vp-lime/30" },
  { id: 2, name: "Win Streak Master", desc: "Win 10 consecutive matches", icon: "🔥", date: "Mar 18, 2025", color: "from-vp-orange/20 to-vp-red/20", borderColor: "border-vp-orange/30" },
  { id: 3, name: "MVP Award", desc: "Named MVP of the tournament", icon: "🏆", date: "Feb 28, 2025", color: "from-[#fbbf24]/20 to-vp-orange/20", borderColor: "border-[#fbbf24]/30" },
  { id: 4, name: "Team Captain", desc: "Led team to 5 consecutive wins", icon: "⭐", date: "Feb 15, 2025", color: "from-vp-blue/20 to-vp-purple/20", borderColor: "border-vp-blue/30" },
  { id: 5, name: "Sharpshooter", desc: "95%+ accuracy in 3 matches", icon: "🎯", date: "Jan 30, 2025", color: "from-vp-purple/20 to-[#ec4899]/20", borderColor: "border-vp-purple/30" },
  { id: 6, name: "Iron Defense", desc: "Concede under 100 in 5 matches", icon: "🛡️", date: "Jan 12, 2025", color: "from-vp-green/20 to-vp-blue/20", borderColor: "border-vp-green/30" },
];

const seasonStats = {
  batting: {
    average: 54.8,
    strikeRate: 142.6,
    highScore: 127,
    fifties: 8,
    hundreds: 3,
    totalRuns: 1644,
  },
  bowling: {
    average: 22.4,
    economy: 6.8,
    bestFigures: "5/23",
    wickets: 28,
    fourWickets: 4,
    fiveWickets: 1,
  },
  topPerformances: [
    { match: "vs Thunder Wolves", performance: "127 (68) & 3/34", date: "Mar 25" },
    { match: "vs Cyber Titans", performance: "98* (52) & 2/28", date: "Mar 16" },
    { match: "vs Shadow Ravens", performance: "5/23 & 45 (31)", date: "Mar 22" },
    { match: "vs Frost Giants", performance: "112 (71) & 1/42", date: "Mar 4" },
  ],
};

// ── Circular Progress Component ────────────────────────────────────────────────

function CircularProgress({ value, size = 80, strokeWidth = 6 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e1e30" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#circleGradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000"
      />
      <defs>
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c8ff00" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Page Component ─────────────────────────────────────────────────────────────

export default function PlayerStatsPage() {
  const [period, setPeriod] = useState<Period>("Season");

  const chartData = performanceData[period];
  const maxVal = Math.max(...chartData.map((d) => d.wins + d.losses));

  return (
    <AppShell>
      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div className="relative h-[320px] lg:h-[380px] overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0d1f3c] to-[#0a1628]" />
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-vp-lime/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-vp-blue/5 rounded-full blur-[100px]" />
        <div className="absolute top-10 right-10 w-[200px] h-[200px] bg-vp-purple/5 rounded-full blur-[80px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(200,255,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 flex flex-col justify-end h-full px-6 lg:px-10 pb-8">
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-vp-card/80 backdrop-blur border border-vp-border px-3 py-1 rounded-full text-xs font-medium text-white">
              ELITE PRO
            </span>
            <span className="inline-flex items-center bg-vp-lime/20 px-3 py-1 rounded-full text-xs font-semibold text-vp-lime">
              ALL-ROUNDER
            </span>
            <span className="inline-flex items-center bg-vp-blue/20 px-3 py-1 rounded-full text-xs font-semibold text-vp-blue">
              LVL {player.level}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* Left: Name + Info */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight uppercase">
                {player.name}
              </h1>
              <p className="text-sm lg:text-base text-vp-text-dim mt-2 max-w-lg">
                {player.position} for{" "}
                <span className="text-white font-semibold">{player.team}</span>.
                Ranked <span className="text-vp-lime font-bold">#{player.globalRank}</span> globally.
              </p>
            </div>

            {/* Right: Key stats + Team badge */}
            <div className="flex items-center gap-6 lg:gap-10">
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-black text-vp-lime">{player.winRate}%</p>
                <p className="text-xs text-vp-text-dim uppercase tracking-wider mt-1">Win Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-black text-white">{player.seasonWins}</p>
                <p className="text-xs text-vp-text-dim uppercase tracking-wider mt-1">Season Wins</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-black text-vp-blue">#{player.globalRank}</p>
                <p className="text-xs text-vp-text-dim uppercase tracking-wider mt-1">Global Rank</p>
              </div>
              {/* Team badge */}
              <div className="hidden lg:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-vp-lime/20 to-vp-blue/20 border border-vp-border items-center justify-center">
                <span className="text-lg font-black text-vp-lime">{player.teamBadge}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="px-6 lg:px-10 py-8">

        {/* ── Stats Overview Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {overviewCards.map((card) => (
            <div key={card.label} className="bg-vp-card rounded-2xl border border-vp-border p-5 relative overflow-hidden group hover:border-vp-lime/20 transition-colors">
              {/* Subtle glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-vp-lime/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-xs text-vp-text-dim uppercase tracking-wider">{card.label}</p>
              <div className="flex items-center gap-3 mt-3">
                {card.isCircular ? (
                  <div className="relative">
                    <CircularProgress value={card.circularValue!} size={56} strokeWidth={5} />
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-vp-lime">
                      {card.value}
                    </span>
                  </div>
                ) : (
                  <span className={`text-3xl font-black ${card.color}`}>{card.value}</span>
                )}
              </div>
              <p className="text-[10px] text-vp-text-muted mt-2">{card.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Left Column (8 cols) ──────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">

            {/* ── Performance Chart ────────────────────────────────────── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold text-vp-lime uppercase tracking-widest">Performance</p>
                  <h3 className="text-lg font-bold text-white mt-1">Win / Loss Breakdown</h3>
                </div>
                <div className="flex gap-2">
                  {(["Week", "Month", "Season", "All Time"] as Period[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase transition-colors active:scale-95 ${
                        period === p
                          ? "bg-vp-lime text-vp-dark"
                          : "bg-vp-dark text-vp-text-dim hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-vp-lime/60 to-vp-lime" />
                  <span className="text-[10px] text-vp-text-dim uppercase">Wins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-vp-red/40 to-vp-red/80" />
                  <span className="text-[10px] text-vp-text-dim uppercase">Losses</span>
                </div>
              </div>

              {/* Chart bars */}
              <div className="flex items-end gap-3 h-52">
                {chartData.map((d) => {
                  const total = d.wins + d.losses;
                  const winH = maxVal > 0 ? (d.wins / maxVal) * 180 : 0;
                  const lossH = maxVal > 0 ? (d.losses / maxVal) * 180 : 0;
                  return (
                    <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-vp-text-dim">{total}</span>
                      <div className="flex gap-1 items-end w-full justify-center">
                        <div
                          className="flex-1 max-w-[20px] rounded-t-md bg-gradient-to-t from-vp-lime/40 to-vp-lime/90 transition-all duration-500"
                          style={{ height: `${winH}px` }}
                        />
                        <div
                          className="flex-1 max-w-[20px] rounded-t-md bg-gradient-to-t from-vp-red/30 to-vp-red/70 transition-all duration-500"
                          style={{ height: `${lossH}px` }}
                        />
                      </div>
                      <span className="text-[10px] text-vp-text-muted uppercase mt-1">{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Skill Breakdown ──────────────────────────────────────── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <p className="text-xs font-bold text-vp-purple uppercase tracking-widest mb-1">Attributes</p>
              <h3 className="text-lg font-bold text-white mb-6">Skill Breakdown</h3>
              <div className="space-y-5">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{skill.name}</span>
                      <span className="text-sm font-bold text-vp-text-dim">{skill.value}<span className="text-vp-text-muted">/100</span></span>
                    </div>
                    <div className="h-3 bg-vp-dark rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-700`}
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Match History ────────────────────────────────────────── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
              <div className="p-5 border-b border-vp-border">
                <p className="text-xs font-bold text-vp-blue uppercase tracking-widest mb-1">Recent</p>
                <h3 className="text-lg font-bold text-white">Match History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-vp-border">
                      {["Opponent", "Result", "Score", "Tournament", "Date"].map((h) => (
                        <th key={h} className="text-left text-[10px] font-bold text-vp-text-muted uppercase tracking-wider px-5 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matchHistory.map((match) => (
                      <tr key={match.id} className="border-b border-vp-border last:border-0 hover:bg-vp-card-hover transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-vp-dark flex items-center justify-center text-xs font-bold text-vp-text-dim">
                              {match.opponent.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-white">{match.opponent}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${
                              match.result === "W"
                                ? "bg-vp-green/10 text-vp-green"
                                : "bg-vp-red/10 text-vp-red"
                            }`}
                          >
                            {match.result}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-vp-text-dim font-mono">{match.score}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-[10px] font-bold text-vp-text-muted uppercase bg-vp-dark px-2 py-1 rounded">
                            {match.tournament}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-vp-text-dim">{match.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Achievement Showcase ─────────────────────────────────── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold text-vp-orange uppercase tracking-widest mb-1">Unlocked</p>
                  <h3 className="text-lg font-bold text-white">Achievements</h3>
                </div>
                <span className="text-xs font-bold text-vp-text-dim bg-vp-dark px-3 py-1.5 rounded-lg">
                  {achievements.length} / 24
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`relative bg-gradient-to-br ${ach.color} rounded-xl border ${ach.borderColor} p-4 hover:scale-[1.02] transition-transform`}
                  >
                    <div className="text-2xl mb-2">{ach.icon}</div>
                    <h4 className="text-sm font-bold text-white">{ach.name}</h4>
                    <p className="text-[10px] text-vp-text-dim mt-1">{ach.desc}</p>
                    <p className="text-[10px] text-vp-text-muted mt-2">{ach.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar (4 cols) ────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">

            {/* ── Season Batting Stats ─────────────────────────────────── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <p className="text-xs font-bold text-vp-lime uppercase tracking-widest mb-1">Batting</p>
              <h3 className="text-lg font-bold text-white mb-5">Season Statistics</h3>
              <div className="space-y-4">
                {[
                  { label: "Batting Average", value: seasonStats.batting.average, color: "text-vp-lime" },
                  { label: "Strike Rate", value: seasonStats.batting.strikeRate, color: "text-vp-blue" },
                  { label: "High Score", value: seasonStats.batting.highScore, color: "text-vp-orange" },
                  { label: "Total Runs", value: seasonStats.batting.totalRuns.toLocaleString(), color: "text-white" },
                  { label: "Fifties / Hundreds", value: `${seasonStats.batting.fifties} / ${seasonStats.batting.hundreds}`, color: "text-vp-purple" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-vp-border last:border-0">
                    <span className="text-xs text-vp-text-dim">{stat.label}</span>
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Season Bowling Stats ─────────────────────────────────── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <p className="text-xs font-bold text-vp-blue uppercase tracking-widest mb-1">Bowling</p>
              <h3 className="text-lg font-bold text-white mb-5">Bowling Figures</h3>
              <div className="space-y-4">
                {[
                  { label: "Bowling Average", value: seasonStats.bowling.average, color: "text-vp-blue" },
                  { label: "Economy Rate", value: seasonStats.bowling.economy, color: "text-vp-green" },
                  { label: "Best Figures", value: seasonStats.bowling.bestFigures, color: "text-vp-lime" },
                  { label: "Total Wickets", value: seasonStats.bowling.wickets, color: "text-white" },
                  { label: "4W / 5W Hauls", value: `${seasonStats.bowling.fourWickets} / ${seasonStats.bowling.fiveWickets}`, color: "text-vp-orange" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-vp-border last:border-0">
                    <span className="text-xs text-vp-text-dim">{stat.label}</span>
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Top Performances ─────────────────────────────────────── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <p className="text-xs font-bold text-vp-text-dim uppercase tracking-widest mb-4">Highlights</p>
              <h3 className="text-lg font-bold text-white mb-5">Top Performances</h3>
              <div className="space-y-3">
                {seasonStats.topPerformances.map((perf, i) => (
                  <div key={i} className="bg-vp-dark rounded-xl p-4 border border-vp-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white">{perf.match}</span>
                      <span className="text-[10px] text-vp-text-muted">{perf.date}</span>
                    </div>
                    <p className="text-sm font-bold text-vp-lime font-mono">{perf.performance}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── XP Progress ──────────────────────────────────────────── */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <p className="text-xs font-bold text-vp-text-dim uppercase tracking-widest mb-4">Progress</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">Level {player.level}</span>
                <span className="text-xs text-vp-text-dim">{player.xp.toLocaleString()} / 10,000 XP</span>
              </div>
              <div className="h-3 bg-vp-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-vp-lime to-vp-green rounded-full transition-all duration-700"
                  style={{ width: `${(player.xp / 10000) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-vp-text-muted mt-2">
                {(10000 - player.xp).toLocaleString()} XP to Level {player.level + 1}
              </p>

              {/* Mini stat blocks */}
              <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-vp-border">
                <div className="bg-vp-dark rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-vp-lime">{player.globalRank}</p>
                  <p className="text-[10px] text-vp-text-muted uppercase">Global Rank</p>
                </div>
                <div className="bg-vp-dark rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-vp-green">{player.seasonWins}</p>
                  <p className="text-[10px] text-vp-text-muted uppercase">Season Wins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
