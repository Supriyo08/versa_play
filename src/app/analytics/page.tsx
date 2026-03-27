"use client";

import AppShell from "@/components/layout/AppShell";
import { useState } from "react";

const weeklyData = [
  { day: "Mon", value: 72 },
  { day: "Tue", value: 85 },
  { day: "Wed", value: 60 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 78 },
  { day: "Sat", value: 95 },
  { day: "Sun", value: 88 },
];

const monthlyData = [
  { day: "W1", value: 78 },
  { day: "W2", value: 82 },
  { day: "W3", value: 91 },
  { day: "W4", value: 86 },
];

const yearlyData = [
  { day: "Jan", value: 55 }, { day: "Feb", value: 62 }, { day: "Mar", value: 70 },
  { day: "Apr", value: 68 }, { day: "May", value: 75 }, { day: "Jun", value: 82 },
  { day: "Jul", value: 78 }, { day: "Aug", value: 85 }, { day: "Sep", value: 90 },
  { day: "Oct", value: 88 }, { day: "Nov", value: 92 }, { day: "Dec", value: 95 },
];

const playerRankings = [
  { rank: 1, name: "Marcus Reed", sport: "Soccer", rating: 98, wins: 24, losses: 3, winRate: "88.9%" },
  { rank: 2, name: "Jade Kim", sport: "Badminton", rating: 95, wins: 31, losses: 5, winRate: "86.1%" },
  { rank: 3, name: "Darius Cole", sport: "Basketball", rating: 92, wins: 20, losses: 8, winRate: "71.4%" },
  { rank: 4, name: "Lena Park", sport: "Tennis", rating: 91, wins: 28, losses: 7, winRate: "80.0%" },
  { rank: 5, name: "Omar Hassan", sport: "Soccer", rating: 89, wins: 22, losses: 6, winRate: "78.6%" },
  { rank: 6, name: "Mia Torres", sport: "Basketball", rating: 87, wins: 18, losses: 10, winRate: "64.3%" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"Week" | "Month" | "Year">("Week");
  const [sortBy, setSortBy] = useState<"rating" | "wins" | "winRate">("rating");

  const chartData = period === "Week" ? weeklyData : period === "Month" ? monthlyData : yearlyData;
  const maxValue = Math.max(...chartData.map((d) => d.value));

  const sortedRankings = [...playerRankings].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "wins") return b.wins - a.wins;
    return parseFloat(b.winRate) - parseFloat(a.winRate);
  });

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Analytics & Rankings</h1>
          <p className="text-sm text-vp-text-dim mt-1">Player performance metrics and global rankings</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Matches", value: "148", change: "+12" },
            { label: "Win Rate", value: "88.9%", change: "+2.1%" },
            { label: "Avg Rating", value: "96.2", change: "+0.8" },
            { label: "Global Rank", value: "#4", change: "+3" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <p className="text-xs text-vp-text-dim uppercase tracking-wider">{kpi.label}</p>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-2xl font-black text-white">{kpi.value}</span>
                <span className="text-xs font-bold text-vp-green mb-1">{kpi.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart */}
          <div className="lg:col-span-8">
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold text-vp-lime uppercase tracking-widest">Performance</p>
                  <h3 className="text-lg font-bold text-white mt-1">{period}ly Overview</h3>
                </div>
                <div className="flex gap-2">
                  {(["Week", "Month", "Year"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase transition-colors active:scale-95 ${
                        period === p ? "bg-vp-lime text-vp-dark" : "bg-vp-dark text-vp-text-dim hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-3 h-48">
                {chartData.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-white">{d.value}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-vp-lime/40 to-vp-lime/80 transition-all duration-500"
                      style={{ height: `${(d.value / maxValue) * 160}px` }}
                    />
                    <span className="text-[10px] text-vp-text-muted uppercase">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rankings Table */}
            <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden mt-6">
              <div className="p-5 border-b border-vp-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Global Player Rankings</h3>
                <div className="flex gap-2">
                  {(["rating", "wins", "winRate"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase transition-colors active:scale-95 ${
                        sortBy === s ? "bg-vp-lime text-vp-dark" : "bg-vp-dark text-vp-text-dim hover:text-white"
                      }`}
                    >
                      {s === "winRate" ? "Win %" : s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-vp-border">
                    {["Rank", "Player", "Sport", "Rating", "W/L", "Win %"].map((h) => (
                      <th key={h} className="text-left text-[10px] font-bold text-vp-text-muted uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {sortedRankings.map((player, idx) => (
                      <tr key={player.name} className="border-b border-vp-border last:border-0 hover:bg-vp-card-hover transition-colors">
                        <td className="px-5 py-3">
                          <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-[10px] font-bold ${idx < 3 ? "bg-vp-lime text-vp-dark" : "text-vp-text-dim"}`}>{idx + 1}</span>
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold text-white">{player.name}</td>
                        <td className="px-5 py-3 text-xs text-vp-text-dim">{player.sport}</td>
                        <td className="px-5 py-3"><span className="text-xs font-bold text-vp-lime">{player.rating}</span></td>
                        <td className="px-5 py-3 text-xs text-vp-text-dim">{player.wins}W / {player.losses}L</td>
                        <td className="px-5 py-3 text-xs font-bold text-vp-green">{player.winRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <p className="text-xs font-bold text-vp-text-dim uppercase tracking-widest mb-4">Sport Distribution</p>
              <div className="space-y-3">
                {[
                  { sport: "Soccer", pct: 42, color: "bg-vp-lime" },
                  { sport: "Basketball", pct: 28, color: "bg-vp-blue" },
                  { sport: "Badminton", pct: 18, color: "bg-vp-orange" },
                  { sport: "Tennis", pct: 12, color: "bg-vp-purple" },
                ].map((s) => (
                  <div key={s.sport}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white">{s.sport}</span>
                      <span className="text-xs text-vp-text-dim">{s.pct}%</span>
                    </div>
                    <div className="h-2 bg-vp-dark rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <p className="text-xs font-bold text-vp-text-dim uppercase tracking-widest mb-4">Recent Activity</p>
              <div className="space-y-3">
                {[
                  { text: "Won vs Thunder Wolves", time: "2h ago", type: "win" },
                  { text: "New achievement unlocked", time: "5h ago", type: "achievement" },
                  { text: "Rating increased to 98", time: "1d ago", type: "rating" },
                  { text: "Lost vs Neon Knights", time: "3d ago", type: "loss" },
                  { text: "Joined Pro League S4", time: "1w ago", type: "tournament" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      activity.type === "win" ? "bg-vp-green" : activity.type === "loss" ? "bg-vp-red" :
                      activity.type === "achievement" ? "bg-vp-orange" : activity.type === "rating" ? "bg-vp-lime" : "bg-vp-blue"
                    }`} />
                    <div><p className="text-xs text-white">{activity.text}</p><p className="text-[10px] text-vp-text-muted">{activity.time}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <p className="text-xs font-bold text-vp-text-dim uppercase tracking-widest mb-4">Season Progress</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white">Level 42</span>
                <span className="text-xs text-vp-text-dim">2,450 / 3,000 XP</span>
              </div>
              <div className="h-3 bg-vp-dark rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-vp-lime to-vp-green rounded-full" style={{ width: "82%" }} />
              </div>
              <p className="text-[10px] text-vp-text-muted mt-2">550 XP to next level</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
