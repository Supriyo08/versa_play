"use client";

import AppShell from "@/components/layout/AppShell";
import RadarChart from "@/components/charts/RadarChart";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <AppShell><div className="flex items-center justify-center h-[60vh]"><div className="text-vp-lime animate-pulse text-xl font-bold">Loading Profile...</div></div></AppShell>;
  }

  const player = user?.player;
  const displayName = player?.displayName || user?.username || "Unknown";
  const position = player?.position || "Player";
  const rating = player?.rating || 0;
  const wins = player?.wins || 0;
  const losses = player?.losses || 0;
  const xp = player?.xp || 0;
  const level = player?.level || 1;
  const globalRank = player?.globalRank || null;
  const teamName = player?.team?.name || "Free Agent";

  const radarData = [
    { label: "Speed", value: player?.speed || 50 },
    { label: "Accuracy", value: player?.accuracy || 50 },
    { label: "Agility", value: player?.agility || 50 },
    { label: "Strength", value: player?.strength || 50 },
    { label: "Endurance", value: player?.endurance || 50 },
  ];

  const winRate = wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) : "0.0";

  return (
    <AppShell>
      {/* Hero */}
      <div className="relative h-[320px] lg:h-[380px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0d1f3c] to-[#0a1628]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-vp-lime/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 flex flex-col justify-end h-full px-6 lg:px-10 pb-8">
          <div className="flex gap-2 mb-4">
            {rating >= 90 && <span className="inline-flex items-center gap-1.5 bg-vp-card/80 backdrop-blur border border-vp-border px-3 py-1 rounded-full text-xs font-medium text-white">ELITE PRO</span>}
            <span className="inline-flex items-center bg-vp-lime/20 px-3 py-1 rounded-full text-xs font-semibold text-vp-lime">{user?.role?.toUpperCase()}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight uppercase">{displayName}</h1>
              <p className="text-sm lg:text-base text-vp-text-dim mt-2 max-w-lg">
                {position} for {teamName}. {globalRank ? `Ranked #${globalRank} globally.` : ""} Level {level} with {xp} XP.
              </p>
            </div>
            <div className="flex gap-6 lg:gap-10">
              <div className="text-center"><p className="text-3xl lg:text-4xl font-black text-vp-lime">{wins}</p><p className="text-xs text-vp-text-dim uppercase tracking-wider mt-1">Wins</p></div>
              <div className="text-center"><p className="text-3xl lg:text-4xl font-black text-white">{rating}</p><p className="text-xs text-vp-text-dim uppercase tracking-wider mt-1">Rating</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radar */}
          <div className="lg:col-span-4 bg-vp-card rounded-2xl border border-vp-border p-6">
            <p className="text-xs font-bold text-vp-lime uppercase tracking-widest mb-1">Performance Radar</p>
            <h3 className="text-lg font-bold text-white mb-6">Physical Aptitude</h3>
            <RadarChart data={radarData} size={240} />
            <Link href="/scoring"><button className="w-full mt-6 bg-vp-lime text-vp-dark font-bold py-3.5 rounded-xl hover:bg-vp-lime-dark transition-colors text-sm">Start Match</button></Link>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-vp-border">
              <div><p className="text-xs text-vp-text-dim">Rank</p><p className="text-sm font-bold text-white">{globalRank ? `Global #${globalRank}` : "Unranked"}</p></div>
              <div><p className="text-xs text-vp-text-dim">Win Rate</p><p className="text-sm font-bold text-white">{winRate}%</p></div>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-4 bg-vp-card rounded-2xl border border-vp-border p-6">
            <p className="text-xs font-bold text-vp-blue uppercase tracking-widest mb-1">Player Stats</p>
            <h3 className="text-lg font-bold text-white mb-6">Performance Summary</h3>
            <div className="space-y-4">
              {[
                { label: "Total Matches", value: wins + losses },
                { label: "Wins", value: wins, color: "text-vp-green" },
                { label: "Losses", value: losses, color: "text-vp-red" },
                { label: "XP Earned", value: xp, color: "text-vp-lime" },
                { label: "Level", value: level, color: "text-vp-orange" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between py-2 border-b border-vp-border last:border-0">
                  <span className="text-xs text-vp-text-dim">{stat.label}</span>
                  <span className={`text-sm font-bold ${stat.color || "text-white"}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <p className="text-xs font-bold text-vp-text-dim uppercase tracking-widest mb-4">Account Info</p>
              <div className="space-y-3">
                <div><p className="text-xs text-vp-text-dim">Email</p><p className="text-sm text-white">{user?.email}</p></div>
                <div><p className="text-xs text-vp-text-dim">Username</p><p className="text-sm text-white">@{user?.username}</p></div>
                <div><p className="text-xs text-vp-text-dim">Role</p><p className="text-sm text-white capitalize">{user?.role}</p></div>
                <div><p className="text-xs text-vp-text-dim">Team</p><p className="text-sm text-white">{teamName}</p></div>
              </div>
            </div>

            {/* Achievements */}
            {player?.achievements && player.achievements.length > 0 && (
              <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
                <p className="text-xs font-bold text-vp-text-dim uppercase tracking-widest mb-4">Achievements ({player.achievements.length})</p>
                <div className="space-y-2">
                  {player.achievements.map((a) => (
                    <div key={a.achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-vp-dark">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${a.achievement.color === "blue" ? "bg-vp-blue" : a.achievement.color === "green" ? "bg-vp-green" : "bg-vp-orange"}`}>
                        <span className="text-white text-xs font-bold">{a.achievement.icon.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-xs font-medium text-white">{a.achievement.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={logout} className="w-full bg-vp-red/10 border border-vp-red/30 text-vp-red font-bold py-3 rounded-xl hover:bg-vp-red/20 transition-colors text-sm">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
