"use client";

import AppShell from "@/components/layout/AppShell";
import { useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface TimelineEvent {
  id: number;
  type: "goal" | "wicket" | "card" | "boundary" | "timeout";
  team: 1 | 2;
  player: string;
  time: string;
  detail: string;
}

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  badge?: string;
}

interface PlayerStat {
  name: string;
  team: 1 | 2;
  runs?: number;
  wickets?: number;
  avg: number;
  sr: number;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 1, type: "boundary", team: 1, player: "M. Reed", time: "3.2 ov", detail: "Four through covers" },
  { id: 2, type: "wicket", team: 2, player: "K. Williams", time: "5.4 ov", detail: "Caught at mid-off" },
  { id: 3, type: "goal", team: 1, player: "R. Chen", time: "8.1 ov", detail: "Six over long-on" },
  { id: 4, type: "boundary", team: 1, player: "M. Reed", time: "11.3 ov", detail: "Swept for four" },
  { id: 5, type: "wicket", team: 2, player: "J. Santos", time: "14.0 ov", detail: "LBW — reviewed, out" },
  { id: 6, type: "timeout", team: 1, player: "Coach Rivera", time: "15.0 ov", detail: "Strategic timeout" },
  { id: 7, type: "boundary", team: 1, player: "D. Park", time: "17.2 ov", detail: "Driven through extra cover" },
  { id: 8, type: "wicket", team: 2, player: "L. Okafor", time: "18.5 ov", detail: "Bowled — middle stump" },
];

const COMMENTARY: { time: string; text: string }[] = [
  { time: "18.5", text: "BOWLED! Okafor goes for a wild swing and misses completely. Middle stump pegged back." },
  { time: "18.4", text: "Full and outside off, left alone. Good discipline from the batsman." },
  { time: "18.3", text: "Short ball, pulled away but straight to deep midwicket. Single taken." },
  { time: "17.2", text: "FOUR! Beautiful drive through extra cover. The fielder had no chance." },
  { time: "17.1", text: "Dot ball. Tight line on off stump, defended solidly." },
  { time: "15.0", text: "Strategic timeout called. Apex Predators need 47 runs from 30 balls." },
];

const CHAT_MESSAGES: ChatMessage[] = [
  { id: 1, sender: "CricketFan99", text: "What a delivery! Middle stump destroyed!", badge: "VIP" },
  { id: 2, sender: "SportsJunkie", text: "This match is insane, both teams going all out" },
  { id: 3, sender: "APXSupporter", text: "Let's go Apex! We got this!", badge: "Sub" },
  { id: 4, sender: "StreamMod", text: "Keep it respectful everyone", badge: "MOD" },
  { id: 5, sender: "FantasyKing", text: "Reed is carrying my fantasy team right now" },
  { id: 6, sender: "ThunderFan", text: "Great bowling from Santos earlier though" },
  { id: 7, sender: "ProAnalyst", text: "Win probability shifting fast, APX at 65% now", badge: "VIP" },
  { id: 8, sender: "NewViewer", text: "First time watching, this is so exciting!" },
];

const PLAYER_STATS: PlayerStat[] = [
  { name: "M. Reed", team: 1, runs: 67, avg: 48.5, sr: 142.3 },
  { name: "D. Park", team: 1, runs: 34, avg: 35.2, sr: 118.7 },
  { name: "R. Chen", team: 1, runs: 22, avg: 29.0, sr: 155.0 },
  { name: "K. Williams", team: 2, wickets: 2, avg: 18.4, sr: 12.0 },
  { name: "J. Santos", team: 2, wickets: 1, avg: 24.6, sr: 18.5 },
  { name: "L. Okafor", team: 2, wickets: 1, avg: 31.2, sr: 24.0 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function LiveStreamPage() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const [nextChatId, setNextChatId] = useState(CHAT_MESSAGES.length + 1);
  const [quality, setQuality] = useState<"720p" | "1080p">("1080p");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const sendChat = useCallback(() => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatMessages((prev) => [...prev, { id: nextChatId, sender: "You", text: trimmed }]);
    setNextChatId((prev) => prev + 1);
    setChatInput("");
  }, [chatInput, nextChatId]);

  const handleChatKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendChat();
      }
    },
    [sendChat]
  );

  /* ---- Event icon helpers ---- */
  const eventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "goal":
        return (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#22c55e" strokeWidth="1.5" />
            <circle cx="7" cy="7" r="2" fill="#22c55e" />
          </svg>
        );
      case "wicket":
        return (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 2v10M7 2v10M10 2v10" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 3h8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case "card":
        return (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="4" y="3" width="6" height="8" rx="1" fill="#f59e0b" />
          </svg>
        );
      case "boundary":
        return (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#4a7cff" strokeWidth="1.5" />
            <path d="M5 7h4M7 5v4" stroke="#4a7cff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case "timeout":
        return (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#a855f7" strokeWidth="1.5" />
            <path d="M7 5v2l1.5 1" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
    }
  };

  const eventIconBg = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "goal":
        return "bg-vp-green/20";
      case "wicket":
        return "bg-vp-red/20";
      case "card":
        return "bg-vp-orange/20";
      case "boundary":
        return "bg-vp-blue/20";
      case "timeout":
        return "bg-vp-purple/20";
    }
  };

  const eventLabel = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "goal":
        return "Six";
      case "wicket":
        return "Wicket";
      case "card":
        return "Card";
      case "boundary":
        return "Four";
      case "timeout":
        return "Timeout";
    }
  };

  const badgeColor = (badge?: string) => {
    switch (badge) {
      case "MOD":
        return "bg-vp-green/20 text-vp-green";
      case "VIP":
        return "bg-vp-purple/20 text-vp-purple";
      case "Sub":
        return "bg-vp-blue/20 text-vp-blue";
      default:
        return "";
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        {/* ============================================================ */}
        {/*  HEADER                                                       */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Pro League</h1>
              <span className="bg-vp-red/20 text-vp-red text-[10px] font-bold uppercase px-2 py-1 rounded-lg flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-vp-red animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-sm text-vp-text-dim mt-1">Live Stream &mdash; Match #47 Semi-Final</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-vp-card border border-vp-border rounded-xl px-4 py-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3C4.5 3 1.73 5.11 0.5 8c1.23 2.89 4 5 7.5 5s6.27-2.11 7.5-5c-1.23-2.89-4-5-7.5-5z" stroke="#71717a" strokeWidth="1.2" />
                <circle cx="8" cy="8" r="2.5" stroke="#71717a" strokeWidth="1.2" />
              </svg>
              <span className="text-sm font-bold text-white">12.4K</span>
              <span className="text-xs text-vp-text-dim">watching</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  MAIN LAYOUT: Video + Stats sidebar                           */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          {/* ---------- VIDEO PLAYER AREA ---------- */}
          <div className="xl:col-span-8">
            <div className="relative bg-black rounded-2xl overflow-hidden border border-vp-border aspect-video">
              {/* Video placeholder gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-vp-dark via-[#0d0d1a] to-[#111122]" />

              {/* Faint field lines for visual depth */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                <div className="w-[60%] h-[70%] border-2 border-white rounded-xl" />
                <div className="absolute w-px h-[70%] bg-white" />
                <div className="absolute w-24 h-24 border-2 border-white rounded-full" />
              </div>

              {/* LIVE badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <span className="bg-vp-red px-2.5 py-1 rounded-md text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Live
                </span>
                <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-white">
                  12.4K viewers
                </span>
              </div>

              {/* Quality + Fullscreen controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-white hover:bg-black/80 transition-colors"
                  >
                    {quality}
                  </button>
                  {showQualityMenu && (
                    <div className="absolute top-8 right-0 bg-vp-card border border-vp-border rounded-lg overflow-hidden shadow-xl">
                      {(["720p", "1080p"] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => { setQuality(q); setShowQualityMenu(false); }}
                          className={`block w-full px-4 py-2 text-[11px] font-bold text-left transition-colors ${
                            quality === q ? "text-vp-lime bg-vp-lime/10" : "text-white hover:bg-vp-card-hover"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="bg-black/60 backdrop-blur-sm p-1.5 rounded-md hover:bg-black/80 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Scoreboard overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-black/70 backdrop-blur-md rounded-xl border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    {/* Team 1 */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-vp-lime/20 flex items-center justify-center">
                        <span className="text-sm font-black text-vp-lime">AP</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Apex Predators</p>
                        <p className="text-[10px] text-vp-text-dim">Batting</p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="text-right">
                        <span className="text-3xl lg:text-4xl font-black text-white">156</span>
                        <span className="text-sm text-vp-text-dim">/4</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-vp-text-muted uppercase">vs</span>
                        <div className="bg-vp-lime/10 border border-vp-lime/30 rounded-md px-2.5 py-0.5 mt-0.5">
                          <span className="text-xs font-mono font-bold text-vp-lime">18.5 ov</span>
                        </div>
                        <span className="text-[10px] text-vp-text-muted mt-0.5">RR: 8.32</span>
                      </div>
                      <div className="text-left">
                        <span className="text-3xl lg:text-4xl font-black text-white">203</span>
                        <span className="text-sm text-vp-text-dim">/8</span>
                      </div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-white text-right">Thunder Wolves</p>
                        <p className="text-[10px] text-vp-text-dim text-right">Target: 204</p>
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-vp-blue/20 flex items-center justify-center">
                        <span className="text-sm font-black text-vp-blue">TW</span>
                      </div>
                    </div>
                  </div>

                  {/* Status line */}
                  <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-white/10">
                    <span className="text-[10px] text-vp-text-dim">APX need <span className="text-white font-bold">47 runs</span> from <span className="text-white font-bold">9 balls</span></span>
                    <span className="text-[10px] text-vp-text-muted">|</span>
                    <span className="text-[10px] text-vp-text-dim">Req RR: <span className="text-vp-orange font-bold">31.33</span></span>
                  </div>
                </div>
              </div>

              {/* Play button overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center z-[5] group"
              >
                {!isPlaying && (
                  <div className="w-20 h-20 rounded-full bg-vp-lime/90 flex items-center justify-center shadow-2xl shadow-vp-lime/30 group-hover:bg-vp-lime transition-colors group-hover:scale-105 transform duration-200">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5.14v13.72a1 1 0 001.5.86l11.14-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" fill="#0a0a0f" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
                <div className="h-full bg-vp-red w-full animate-pulse" style={{ width: "100%" }} />
              </div>
            </div>
          </div>

          {/* ---------- RIGHT SIDEBAR: Match Stats ---------- */}
          <div className="xl:col-span-4 space-y-4">
            {/* Key Stats */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Match Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-vp-dark rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-vp-green">4</p>
                  <p className="text-[10px] text-vp-text-dim mt-1">Wickets</p>
                </div>
                <div className="bg-vp-dark rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-vp-blue">8.32</p>
                  <p className="text-[10px] text-vp-text-dim mt-1">Run Rate</p>
                </div>
                <div className="bg-vp-dark rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-vp-orange">14</p>
                  <p className="text-[10px] text-vp-text-dim mt-1">Boundaries</p>
                </div>
                <div className="bg-vp-dark rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-vp-purple">3</p>
                  <p className="text-[10px] text-vp-text-dim mt-1">Sixes</p>
                </div>
              </div>
            </div>

            {/* Win Probability */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Win Probability</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-vp-lime/20 flex items-center justify-center">
                        <span className="text-[8px] font-black text-vp-lime">AP</span>
                      </div>
                      <span className="text-xs font-medium text-white">Apex Predators</span>
                    </div>
                    <span className="text-sm font-black text-vp-lime">65%</span>
                  </div>
                  <div className="h-2.5 bg-vp-dark rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-vp-lime/80 to-vp-lime rounded-full transition-all duration-500" style={{ width: "65%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-vp-blue/20 flex items-center justify-center">
                        <span className="text-[8px] font-black text-vp-blue">TW</span>
                      </div>
                      <span className="text-xs font-medium text-white">Thunder Wolves</span>
                    </div>
                    <span className="text-sm font-black text-vp-blue">35%</span>
                  </div>
                  <div className="h-2.5 bg-vp-dark rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-vp-blue/80 to-vp-blue rounded-full transition-all duration-500" style={{ width: "35%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Match Leaderboard */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Match Leaderboard</h3>

              {/* Batting */}
              <p className="text-[10px] font-bold text-vp-lime uppercase tracking-wider mb-2">Top Batters</p>
              <div className="space-y-0 mb-4">
                {PLAYER_STATS.filter((p) => p.runs !== undefined).map((p, i) => (
                  <div key={p.name} className={`flex items-center gap-3 py-2 ${i > 0 ? "border-t border-vp-border" : ""}`}>
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? "bg-vp-lime text-vp-dark" : "bg-vp-dark text-vp-text-dim"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-xs font-bold text-white">{p.runs}</p>
                        <p className="text-[9px] text-vp-text-muted">runs</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-vp-text-dim">{p.sr}</p>
                        <p className="text-[9px] text-vp-text-muted">SR</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bowling */}
              <p className="text-[10px] font-bold text-vp-blue uppercase tracking-wider mb-2">Top Bowlers</p>
              <div className="space-y-0">
                {PLAYER_STATS.filter((p) => p.wickets !== undefined).map((p, i) => (
                  <div key={p.name} className={`flex items-center gap-3 py-2 ${i > 0 ? "border-t border-vp-border" : ""}`}>
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? "bg-vp-blue text-white" : "bg-vp-dark text-vp-text-dim"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-xs font-bold text-white">{p.wickets}</p>
                        <p className="text-[9px] text-vp-text-muted">wkts</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-vp-text-dim">{p.avg}</p>
                        <p className="text-[9px] text-vp-text-muted">avg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  BOTTOM SECTION: Timeline + Commentary + Chat                  */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ---------- MATCH TIMELINE ---------- */}
          <div className="lg:col-span-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Match Timeline</h2>
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <div className="space-y-0 max-h-[360px] overflow-y-auto">
                {[...TIMELINE_EVENTS].reverse().map((event, i) => (
                  <div key={event.id} className="flex gap-3 relative">
                    {i < TIMELINE_EVENTS.length - 1 && (
                      <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-vp-border" />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${eventIconBg(event.type)}`}>
                      {eventIcon(event.type)}
                    </div>
                    <div className="flex-1 pb-5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-white">{event.time}</span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          event.team === 1 ? "bg-vp-lime/10 text-vp-lime" : "bg-vp-blue/10 text-vp-blue"
                        }`}>
                          {event.team === 1 ? "APX" : "TWL"}
                        </span>
                        <span className="text-[9px] font-semibold text-vp-text-muted uppercase">{eventLabel(event.type)}</span>
                      </div>
                      <p className="text-xs text-white mt-0.5">{event.player}</p>
                      <p className="text-[11px] text-vp-text-dim">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---------- LIVE COMMENTARY ---------- */}
          <div className="lg:col-span-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Live Commentary</h2>
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <div className="space-y-3 max-h-[360px] overflow-y-auto">
                {COMMENTARY.map((c, i) => (
                  <div key={i} className={`${i > 0 ? "border-t border-vp-border pt-3" : ""}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-[11px] font-mono font-bold text-vp-lime flex-shrink-0 mt-0.5">{c.time}</span>
                      <p className="text-xs text-vp-text leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---------- LIVE CHAT ---------- */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Chat</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-vp-green animate-pulse" />
                <span className="text-[10px] text-vp-text-dim font-medium">1,247 chatting</span>
              </div>
            </div>
            <div className="bg-vp-card rounded-2xl border border-vp-border flex flex-col" style={{ height: "400px" }}>
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="group">
                    <div className="flex items-start gap-2">
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold ${
                        msg.sender === "You" ? "bg-vp-lime/20 text-vp-lime" : "bg-vp-card-hover text-vp-text-dim"
                      }`}>
                        {msg.sender.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] font-bold ${
                            msg.sender === "You" ? "text-vp-lime" : "text-white"
                          }`}>
                            {msg.sender}
                          </span>
                          {msg.badge && (
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${badgeColor(msg.badge)}`}>
                              {msg.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-vp-text-dim mt-0.5 break-words">{msg.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat input */}
              <div className="border-t border-vp-border p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Send a message..."
                    className="flex-1 bg-vp-dark border border-vp-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30 transition-colors"
                  />
                  <button
                    onClick={sendChat}
                    className="bg-vp-lime text-vp-dark px-4 py-2 rounded-lg text-xs font-bold hover:bg-vp-lime-dark transition-colors flex-shrink-0"
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
