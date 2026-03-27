"use client";

import AppShell from "@/components/layout/AppShell";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                         */
/* ------------------------------------------------------------------ */

const TOURNAMENTS = [
  { id: "t1", name: "VersaPlay Premier League 2025" },
  { id: "t2", name: "Thunder Cup Invitational" },
  { id: "t3", name: "Pro Cricket Championship" },
  { id: "t4", name: "City T20 Bash" },
];

const TEAMS = [
  {
    id: "team1",
    name: "Storm Riders",
    abbr: "SR",
    color: "#4a7cff",
    accent: "#c8ff00",
    logo: null,
  },
  {
    id: "team2",
    name: "Thunder Hawks",
    abbr: "TH",
    color: "#f59e0b",
    accent: "#0a0a0f",
    logo: null,
  },
  {
    id: "team3",
    name: "Royal Strikers",
    abbr: "RS",
    color: "#a855f7",
    accent: "#c8ff00",
    logo: null,
  },
  {
    id: "team4",
    name: "Blaze Kings",
    abbr: "BK",
    color: "#ef4444",
    accent: "#ffffff",
    logo: null,
  },
  {
    id: "team5",
    name: "Iron Wolves",
    abbr: "IW",
    color: "#22c55e",
    accent: "#0a0a0f",
    logo: null,
  },
  {
    id: "team6",
    name: "Night Vipers",
    abbr: "NV",
    color: "#c8ff00",
    accent: "#0a0a0f",
    logo: null,
  },
];

const MATCH_FORMATS = ["T20", "ODI", "Test"];
const OVERS_OPTIONS = ["20", "50", "Unlimited"];
const PITCH_TYPES = [
  { id: "green", label: "Green", icon: "🌿", description: "Pace-friendly, seam movement" },
  { id: "dry", label: "Dry", icon: "☀️", description: "Spin-friendly, rough surface" },
  { id: "flat", label: "Flat", icon: "🛣️", description: "Batting paradise, true bounce" },
  { id: "dusty", label: "Dusty", icon: "💨", description: "Crumbling, variable bounce" },
];
const WEATHER_OPTIONS = [
  { id: "sunny", label: "Sunny", icon: "☀️", description: "Clear skies, hot" },
  { id: "cloudy", label: "Cloudy", icon: "⛅", description: "Overcast, swing likely" },
  { id: "overcast", label: "Overcast", icon: "🌥️", description: "Heavy cloud, seam bowling" },
  { id: "rain", label: "Rain", icon: "🌧️", description: "Showers expected" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function MatchSetupPage() {
  const { loading: authLoading, isAdmin, user } = useAuth();

  /* --- Form state --- */
  const [tournament, setTournament] = useState("");
  const [matchFormat, setMatchFormat] = useState("T20");
  const [matchNumber, setMatchNumber] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [venue, setVenue] = useState("");
  const [overs, setOvers] = useState("20");

  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");

  const [pitchType, setPitchType] = useState("flat");
  const [weather, setWeather] = useState("sunny");
  const [dewFactor, setDewFactor] = useState(false);

  /* --- Derived --- */
  const homeTeam = TEAMS.find((t) => t.id === homeTeamId) || null;
  const awayTeam = TEAMS.find((t) => t.id === awayTeamId) || null;

  /* --- RBAC Guard --- */
  if (!authLoading && !isAdmin) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[60vh] px-6">
          <div className="w-16 h-16 rounded-full bg-vp-red/20 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M5.07 19h13.86c1.1 0 1.79-1.19 1.24-2.14L13.24 4.14a1.42 1.42 0 00-2.48 0L3.83 16.86c-.55.95.14 2.14 1.24 2.14z"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-vp-text-dim text-center max-w-md">
            You don&apos;t have permission to access this page. This area is restricted to{" "}
            <span className="text-vp-orange font-semibold">Admin</span> and{" "}
            <span className="text-vp-red font-semibold">Superadmin</span> users only.
          </p>
          <p className="text-xs text-vp-text-muted mt-3">
            Your current role:{" "}
            <span className="text-white font-medium capitalize">{user?.role || "unknown"}</span>
          </p>
        </div>
      </AppShell>
    );
  }

  /* --- Shared input classes --- */
  const inputCls =
    "w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/40 transition-colors";
  const labelCls = "block text-xs text-vp-text-dim mb-1.5 uppercase tracking-wider font-semibold";

  /* ---------------------------------------------------------------- */
  /*  Helpers                                                         */
  /* ---------------------------------------------------------------- */

  function TeamLogoPreview({ team }: { team: typeof TEAMS[number] | null }) {
    if (!team) {
      return (
        <div className="w-12 h-12 rounded-xl bg-vp-dark border border-dashed border-vp-border flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              stroke="#52525b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black"
        style={{ backgroundColor: team.color + "30", color: team.color }}
      >
        {team.abbr}
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
        {/* ============ Header ============ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-tight">MATCH SETUP</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-vp-lime/10 text-vp-lime border border-vp-lime/20 px-2.5 py-1 rounded-lg">
                Admin
              </span>
            </div>
            <p className="text-sm text-vp-text-dim mt-1">
              Configure cricket match details, teams, pitch &amp; conditions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs font-bold text-vp-text-dim hover:text-white border border-vp-border rounded-xl px-4 py-2.5 transition-colors">
              Reset Form
            </button>
            <button className="text-xs font-bold text-vp-dark bg-vp-lime hover:bg-vp-lime-dark rounded-xl px-5 py-2.5 transition-colors">
              Create Match
            </button>
          </div>
        </div>

        {/* ============ Main 2-Column Config ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* ---------- Left: Match Details ---------- */}
          <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-vp-blue/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="#4a7cff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Match Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Tournament */}
              <div>
                <label className={labelCls}>Tournament</label>
                <select
                  value={tournament}
                  onChange={(e) => setTournament(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select tournament...</option>
                  {TOURNAMENTS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Format + Match Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Match Format</label>
                  <select
                    value={matchFormat}
                    onChange={(e) => setMatchFormat(e.target.value)}
                    className={inputCls}
                  >
                    {MATCH_FORMATS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Match Number</label>
                  <input
                    type="number"
                    value={matchNumber}
                    onChange={(e) => setMatchNumber(e.target.value)}
                    placeholder="e.g. 42"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Date</label>
                  <input
                    type="date"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Start Time</label>
                  <input
                    type="time"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className={labelCls}>Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Wankhede Stadium, Mumbai"
                  className={inputCls}
                />
              </div>

              {/* Overs */}
              <div>
                <label className={labelCls}>Overs</label>
                <select
                  value={overs}
                  onChange={(e) => setOvers(e.target.value)}
                  className={inputCls}
                >
                  {OVERS_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o === "Unlimited" ? "Unlimited (Test)" : `${o} Overs`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ---------- Right: Team Selection ---------- */}
          <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-vp-purple/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Team Selection
              </h2>
            </div>

            <div className="space-y-5">
              {/* Home Team */}
              <div>
                <label className={labelCls}>Home Team</label>
                <div className="flex items-center gap-3">
                  <TeamLogoPreview team={homeTeam} />
                  <select
                    value={homeTeamId}
                    onChange={(e) => setHomeTeamId(e.target.value)}
                    className={`${inputCls} flex-1`}
                  >
                    <option value="">Select home team...</option>
                    {TEAMS.filter((t) => t.id !== awayTeamId).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.abbr})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-vp-border" />
                <span className="text-xs font-black text-vp-text-muted tracking-widest">VS</span>
                <div className="flex-1 h-px bg-vp-border" />
              </div>

              {/* Away Team */}
              <div>
                <label className={labelCls}>Away Team</label>
                <div className="flex items-center gap-3">
                  <TeamLogoPreview team={awayTeam} />
                  <select
                    value={awayTeamId}
                    onChange={(e) => setAwayTeamId(e.target.value)}
                    className={`${inputCls} flex-1`}
                  >
                    <option value="">Select away team...</option>
                    {TEAMS.filter((t) => t.id !== homeTeamId).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.abbr})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field Mapping */}
              <div className="mt-4">
                <label className={labelCls}>Field Mapping</label>
                <div className="bg-vp-dark rounded-xl border border-vp-border p-4 mt-1">
                  <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-vp-border/50">
                    {/* Cricket ground oval */}
                    <div className="absolute inset-2 sm:inset-4 rounded-full border-2 border-vp-lime/20" />
                    {/* Inner circle (30-yard) */}
                    <div className="absolute inset-[25%] rounded-full border border-dashed border-vp-blue/30" />
                    {/* Pitch strip */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6%] h-[35%] bg-vp-lime/10 border border-vp-lime/30 rounded-sm" />
                    {/* Labels */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] text-vp-text-muted font-semibold">
                      BOUNDARY: 65m
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] text-vp-text-muted font-semibold">
                      STRAIGHT: 75m
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-2 text-[9px] sm:text-[10px] text-vp-text-muted font-semibold">
                      SQ: 60m
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-2 text-[9px] sm:text-[10px] text-vp-text-muted font-semibold">
                      SQ: 60m
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-vp-text-dim">
                      Ground dimensions (approx.)
                    </span>
                    <span className="text-[10px] text-vp-lime font-semibold">
                      {venue || "No venue selected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ Pitch & Conditions ============ */}
        <div className="bg-vp-card rounded-2xl border border-vp-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-vp-green/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Pitch &amp; Conditions
            </h2>
          </div>

          {/* Pitch Type */}
          <div className="mb-6">
            <label className={labelCls}>Pitch Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
              {PITCH_TYPES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPitchType(p.id)}
                  className={`relative rounded-xl border p-4 text-left transition-all ${
                    pitchType === p.id
                      ? "bg-vp-lime/5 border-vp-lime/40 shadow-[0_0_20px_rgba(200,255,0,0.05)]"
                      : "bg-vp-dark border-vp-border hover:border-vp-border hover:bg-vp-card-hover"
                  }`}
                >
                  {pitchType === p.id && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-vp-lime" />
                  )}
                  <span className="text-lg">{p.icon}</span>
                  <p
                    className={`text-sm font-bold mt-1.5 ${
                      pitchType === p.id ? "text-vp-lime" : "text-white"
                    }`}
                  >
                    {p.label}
                  </p>
                  <p className="text-[10px] text-vp-text-muted mt-0.5 leading-relaxed">
                    {p.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Weather */}
          <div className="mb-6">
            <label className={labelCls}>Weather Conditions</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
              {WEATHER_OPTIONS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWeather(w.id)}
                  className={`relative rounded-xl border p-4 text-left transition-all ${
                    weather === w.id
                      ? "bg-vp-blue/5 border-vp-blue/40 shadow-[0_0_20px_rgba(74,124,255,0.05)]"
                      : "bg-vp-dark border-vp-border hover:border-vp-border hover:bg-vp-card-hover"
                  }`}
                >
                  {weather === w.id && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-vp-blue" />
                  )}
                  <span className="text-lg">{w.icon}</span>
                  <p
                    className={`text-sm font-bold mt-1.5 ${
                      weather === w.id ? "text-vp-blue" : "text-white"
                    }`}
                  >
                    {w.label}
                  </p>
                  <p className="text-[10px] text-vp-text-muted mt-0.5 leading-relaxed">
                    {w.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Dew Factor */}
          <div className="flex items-center justify-between bg-vp-dark rounded-xl border border-vp-border px-5 py-4">
            <div>
              <p className="text-sm font-bold text-white">Dew Factor</p>
              <p className="text-[10px] text-vp-text-muted mt-0.5">
                Enable if dew is expected during the match (affects 2nd innings bowling)
              </p>
            </div>
            <button
              onClick={() => setDewFactor(!dewFactor)}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                dewFactor ? "bg-vp-lime" : "bg-vp-border"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  dewFactor ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ============ Selected Teams Preview ============ */}
        {(homeTeam || awayTeam) && (
          <div className="mb-6">
            <label className={`${labelCls} mb-3`}>Match Preview</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Home Team Card */}
              {homeTeam ? (
                <div
                  className="rounded-2xl border p-5 transition-all"
                  style={{
                    backgroundColor: homeTeam.color + "08",
                    borderColor: homeTeam.color + "30",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-black shrink-0"
                      style={{
                        backgroundColor: homeTeam.color + "20",
                        color: homeTeam.color,
                      }}
                    >
                      {homeTeam.abbr}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-vp-text-muted uppercase tracking-wider font-semibold">
                        Home
                      </p>
                      <p className="text-lg font-black text-white truncate">
                        {homeTeam.name.toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: homeTeam.color }}
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: homeTeam.accent }}
                        />
                        <span className="text-[10px] text-vp-text-dim ml-1">Team Colors</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-vp-border bg-vp-dark/50 p-5 flex items-center justify-center">
                  <p className="text-xs text-vp-text-muted">Select Home Team</p>
                </div>
              )}

              {/* Away Team Card */}
              {awayTeam ? (
                <div
                  className="rounded-2xl border p-5 transition-all"
                  style={{
                    backgroundColor: awayTeam.color + "08",
                    borderColor: awayTeam.color + "30",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-black shrink-0"
                      style={{
                        backgroundColor: awayTeam.color + "20",
                        color: awayTeam.color,
                      }}
                    >
                      {awayTeam.abbr}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-vp-text-muted uppercase tracking-wider font-semibold">
                        Away
                      </p>
                      <p className="text-lg font-black text-white truncate">
                        {awayTeam.name.toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: awayTeam.color }}
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: awayTeam.accent }}
                        />
                        <span className="text-[10px] text-vp-text-dim ml-1">Team Colors</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-vp-border bg-vp-dark/50 p-5 flex items-center justify-center">
                  <p className="text-xs text-vp-text-muted">Select Away Team</p>
                </div>
              )}
            </div>

            {/* VS connector bar between teams (when both selected) */}
            {homeTeam && awayTeam && (
              <div className="flex items-center justify-center gap-4 mt-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black"
                    style={{ backgroundColor: homeTeam.color + "20", color: homeTeam.color }}
                  >
                    {homeTeam.abbr}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-vp-lime tracking-widest">VS</span>
                    <span className="text-[9px] text-vp-text-muted mt-0.5">
                      {matchFormat} | {overs === "Unlimited" ? "Test" : `${overs} Ov`}
                    </span>
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black"
                    style={{ backgroundColor: awayTeam.color + "20", color: awayTeam.color }}
                  >
                    {awayTeam.abbr}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ Summary Footer ============ */}
        <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="bg-vp-dark rounded-lg border border-vp-border px-3 py-1.5 text-vp-text-dim">
                Format:{" "}
                <span className="text-white font-semibold">{matchFormat}</span>
              </span>
              <span className="bg-vp-dark rounded-lg border border-vp-border px-3 py-1.5 text-vp-text-dim">
                Overs:{" "}
                <span className="text-white font-semibold">{overs}</span>
              </span>
              <span className="bg-vp-dark rounded-lg border border-vp-border px-3 py-1.5 text-vp-text-dim">
                Pitch:{" "}
                <span className="text-white font-semibold capitalize">{pitchType}</span>
              </span>
              <span className="bg-vp-dark rounded-lg border border-vp-border px-3 py-1.5 text-vp-text-dim">
                Weather:{" "}
                <span className="text-white font-semibold capitalize">{weather}</span>
              </span>
              {dewFactor && (
                <span className="bg-vp-blue/10 rounded-lg border border-vp-blue/20 px-3 py-1.5 text-vp-blue font-semibold">
                  Dew Active
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs font-bold text-vp-text-dim hover:text-white border border-vp-border rounded-xl px-4 py-2.5 transition-colors">
                Save Draft
              </button>
              <button className="text-xs font-bold text-vp-dark bg-vp-lime hover:bg-vp-lime-dark rounded-xl px-5 py-2.5 transition-colors flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12l5 5L20 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Confirm &amp; Create Match
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
