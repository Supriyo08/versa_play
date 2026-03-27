"use client";

import AppShell from "@/components/layout/AppShell";
import { useState, useCallback } from "react";

interface MatchEvent {
  id: number;
  type: "goal" | "card" | "timeout" | "substitution";
  team: 1 | 2;
  player: string;
  time: string;
  detail: string;
}

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
}

const TEAM_PLAYERS: Record<1 | 2, Record<string, string>> = {
  1: {
    goal: "M. Reed",
    card: "D. Park",
    timeout: "Coach Rivera",
    substitution: "R. Chen",
  },
  2: {
    goal: "K. Williams",
    card: "J. Santos",
    timeout: "Coach Tanaka",
    substitution: "L. Okafor",
  },
};

const PRESET_EVENTS: MatchEvent[] = [
  { id: 1, type: "goal", team: 1, player: "M. Reed", time: "12'", detail: "Goal from free kick" },
  { id: 2, type: "card", team: 2, player: "J. Santos", time: "23'", detail: "Yellow card — rough tackle" },
  { id: 3, type: "goal", team: 2, player: "K. Williams", time: "34'", detail: "Header from corner" },
  { id: 4, type: "timeout", team: 1, player: "Coach Rivera", time: "45'", detail: "Half-time timeout" },
  { id: 5, type: "substitution", team: 1, player: "R. Chen", time: "55'", detail: "Replaced D. Park" },
  { id: 6, type: "goal", team: 1, player: "M. Reed", time: "61'", detail: "Penalty kick" },
];

const PRESET_CHAT: ChatMessage[] = [
  { id: 1, sender: "Referee", text: "VAR check complete — goal confirmed" },
  { id: 2, sender: "Scorer", text: "Updated card count for Santos" },
];

const EVENT_DETAILS: Record<MatchEvent["type"], string> = {
  goal: "Goal scored",
  card: "Yellow card issued",
  timeout: "Timeout called",
  substitution: "Player substituted",
};

export default function ScoringPage() {
  const [score1, setScore1] = useState(2);
  const [score2, setScore2] = useState(1);
  const [minutes, setMinutes] = useState(67);
  const [seconds, setSeconds] = useState(23);
  const [isPaused, setIsPaused] = useState(false);
  const [events, setEvents] = useState<MatchEvent[]>(PRESET_EVENTS);
  const [nextEventId, setNextEventId] = useState(PRESET_EVENTS.length + 1);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(PRESET_CHAT);
  const [chatInput, setChatInput] = useState("");
  const [nextChatId, setNextChatId] = useState(PRESET_CHAT.length + 1);

  const timerDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const addEvent = useCallback(
    (type: MatchEvent["type"], team: 1 | 2) => {
      const player = TEAM_PLAYERS[team][type];
      const newEvent: MatchEvent = {
        id: nextEventId,
        type,
        team,
        player,
        time: `${minutes}'`,
        detail: EVENT_DETAILS[type],
      };
      setEvents((prev) => [...prev, newEvent]);
      setNextEventId((prev) => prev + 1);

      if (type === "goal") {
        if (team === 1) setScore1((prev) => prev + 1);
        else setScore2((prev) => prev + 1);
      }
    },
    [minutes, nextEventId]
  );

  const sendChat = useCallback(() => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    const msg: ChatMessage = {
      id: nextChatId,
      sender: "You",
      text: trimmed,
    };
    setChatMessages((prev) => [...prev, msg]);
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

  /* ------------------------------------------------------------------ */
  /*  Inline SVG icons                                                   */
  /* ------------------------------------------------------------------ */
  const GoalIcon = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
  const CardIcon = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3" y="2" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
  const TimeoutIcon = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  const SubIcon = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 5l4-3v6l-4-3zM11 9l-4 3V6l4 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );

  /* ------------------------------------------------------------------ */
  /*  Reusable team controls block                                       */
  /* ------------------------------------------------------------------ */
  const TeamControls = ({ team, label, labelColor }: { team: 1 | 2; label: string; labelColor: string }) => (
    <div className="bg-vp-card rounded-2xl border border-vp-border p-5 mb-4">
      <p className={`text-xs font-bold ${labelColor} mb-3`}>{label}</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => addEvent("goal", team)}
          className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 text-green-500 px-3 py-3 rounded-xl text-xs font-bold hover:bg-green-500/20 transition-colors"
        >
          {GoalIcon}
          Goal
        </button>
        <button
          onClick={() => addEvent("card", team)}
          className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 px-3 py-3 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-colors"
        >
          {CardIcon}
          Card
        </button>
        <button
          onClick={() => addEvent("timeout", team)}
          className="flex items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-500 px-3 py-3 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-colors"
        >
          {TimeoutIcon}
          Timeout
        </button>
        <button
          onClick={() => addEvent("substitution", team)}
          className="flex items-center justify-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-500 px-3 py-3 rounded-xl text-xs font-bold hover:bg-purple-500/20 transition-colors"
        >
          {SubIcon}
          Sub
        </button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Timeline event icon (colored)                                      */
  /* ------------------------------------------------------------------ */
  const EventIcon = ({ type }: { type: MatchEvent["type"] }) => {
    if (type === "goal")
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5" stroke="#22c55e" strokeWidth="1.5" />
        </svg>
      );
    if (type === "card")
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="4" y="3" width="6" height="8" rx="1" fill="#f59e0b" />
        </svg>
      );
    if (type === "timeout")
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5" stroke="#3b82f6" strokeWidth="1.5" />
          <path d="M7 5v2l1.5 1" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M4 6l3-3v6l-3-3zM10 8l-3 3V5l3 3z" fill="#a855f7" />
      </svg>
    );
  };

  const iconBgClass = (type: MatchEvent["type"]) => {
    switch (type) {
      case "goal":
        return "bg-green-500/20";
      case "card":
        return "bg-amber-500/20";
      case "timeout":
        return "bg-blue-500/20";
      case "substitution":
        return "bg-purple-500/20";
    }
  };

  const eventTypeLabel = (type: MatchEvent["type"]) => {
    switch (type) {
      case "goal":
        return "Goal";
      case "card":
        return "Yellow Card";
      case "timeout":
        return "Timeout";
      case "substitution":
        return "Substitution";
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        {/* ---- Header ---- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Match Scoring</h1>
            <p className="text-sm text-vp-text-dim mt-1">
              Official Scorer Dashboard — Pro League Match #47
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vp-red animate-pulse" />
            <span className="text-xs font-bold text-vp-red uppercase">Live — Recording</span>
          </div>
        </div>

        {/* ---- Scoreboard ---- */}
        <div className="bg-vp-card rounded-2xl border border-vp-border p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between">
            {/* Team 1 */}
            <div className="flex-1 text-center">
              <div className="w-16 h-16 rounded-2xl bg-vp-lime/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-black text-vp-lime">AP</span>
              </div>
              <h3 className="text-lg font-bold text-white">Apex Predators</h3>
              <p className="text-xs text-vp-text-dim mt-1">Home</p>
            </div>

            {/* Score + Timer */}
            <div className="flex-shrink-0 px-8 lg:px-16">
              <div className="flex items-center gap-4 lg:gap-8">
                <span className="text-5xl lg:text-7xl font-black text-white">{score1}</span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-vp-text-muted">VS</span>
                  <div className="bg-vp-lime/10 border border-vp-lime/30 rounded-lg px-3 py-1">
                    <span className="text-sm font-mono font-bold text-vp-lime">{timerDisplay}</span>
                  </div>
                  <button
                    onClick={togglePause}
                    className={`mt-1 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors ${
                      isPaused
                        ? "bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20"
                        : "bg-vp-red/10 border border-vp-red/30 text-vp-red hover:bg-vp-red/20"
                    }`}
                  >
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                </div>
                <span className="text-5xl lg:text-7xl font-black text-white">{score2}</span>
              </div>
              <p className="text-center text-xs text-vp-text-muted mt-3 uppercase">
                2nd Half — Pro League
              </p>
            </div>

            {/* Team 2 */}
            <div className="flex-1 text-center">
              <div className="w-16 h-16 rounded-2xl bg-vp-blue/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-black text-vp-blue">TW</span>
              </div>
              <h3 className="text-lg font-bold text-white">Thunder Wolves</h3>
              <p className="text-xs text-vp-text-dim mt-1">Away</p>
            </div>
          </div>
        </div>

        {/* ---- Main grid: Controls (left) + Timeline (right) ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ---------- LEFT: Scoring Controls + Chat ---------- */}
          <div className="lg:col-span-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Scoring Controls
            </h2>

            {/* Team 1 Controls */}
            <TeamControls team={1} label="Apex Predators" labelColor="text-vp-lime" />

            {/* Team 2 Controls */}
            <TeamControls team={2} label="Thunder Wolves" labelColor="text-vp-blue" />

            {/* Official Chat */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <p className="text-xs font-bold text-white mb-3 uppercase tracking-wider">
                Official Chat
              </p>
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-xs text-vp-text-dim">
                    <span
                      className={`font-medium ${
                        msg.sender === "Referee"
                          ? "text-vp-lime"
                          : msg.sender === "Scorer"
                          ? "text-vp-blue"
                          : "text-vp-orange"
                      }`}
                    >
                      {msg.sender}:
                    </span>{" "}
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-vp-dark border border-vp-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30"
                />
                <button
                  onClick={sendChat}
                  className="bg-vp-lime text-vp-dark px-3 py-2 rounded-lg text-xs font-bold hover:bg-vp-lime/90 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* ---------- RIGHT: Event Timeline ---------- */}
          <div className="lg:col-span-8">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Match Timeline
            </h2>
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <div className="space-y-0">
                {[...events].reverse().map((event, i) => (
                  <div key={event.id} className="flex gap-4 relative">
                    {/* Vertical connector line */}
                    {i < events.length - 1 && (
                      <div className="absolute left-[18px] top-[36px] bottom-0 w-px bg-vp-border" />
                    )}

                    {/* Icon circle */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${iconBgClass(
                        event.type
                      )}`}
                    >
                      <EventIcon type={event.type} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{event.time}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            event.team === 1
                              ? "bg-vp-lime/10 text-vp-lime"
                              : "bg-vp-blue/10 text-vp-blue"
                          }`}
                        >
                          {event.team === 1 ? "APX" : "TWL"}
                        </span>
                        <span className="text-[10px] font-semibold text-vp-text-muted uppercase">
                          {eventTypeLabel(event.type)}
                        </span>
                      </div>
                      <p className="text-sm text-white mt-1">{event.player}</p>
                      <p className="text-xs text-vp-text-dim mt-0.5">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
