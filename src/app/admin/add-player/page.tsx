"use client";

import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

/* ───────────────────── types ───────────────────── */
interface PlayerForm {
  displayName: string;
  email: string;
  position: string;
  bio: string;
}

interface SkillRatings {
  speed: number;
  accuracy: number;
  agility: number;
  strength: number;
  endurance: number;
}

const POSITIONS = ["Batsman", "Bowler", "All-Rounder", "Wicket Keeper"] as const;

const SKILL_META: { key: keyof SkillRatings; label: string; color: string }[] = [
  { key: "speed", label: "Speed", color: "#4a7cff" },
  { key: "accuracy", label: "Accuracy", color: "#c8ff00" },
  { key: "agility", label: "Agility", color: "#a855f7" },
  { key: "strength", label: "Strength", color: "#ef4444" },
  { key: "endurance", label: "Endurance", color: "#22c55e" },
];

/* ───────────────── radar chart (SVG) ──────────── */
function RadarChart({ skills }: { skills: SkillRatings }) {
  const cx = 120;
  const cy = 120;
  const maxR = 90;
  const levels = 4;
  const count = SKILL_META.length;
  const angleSlice = (Math.PI * 2) / count;

  // helper: skill value -> coordinate
  const toXY = (value: number, i: number) => {
    const r = (value / 100) * maxR;
    const angle = angleSlice * i - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // grid rings
  const rings = Array.from({ length: levels }, (_, l) => {
    const r = ((l + 1) / levels) * maxR;
    const pts = Array.from({ length: count }, (_, i) => {
      const a = angleSlice * i - Math.PI / 2;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return pts;
  });

  // axes
  const axes = Array.from({ length: count }, (_, i) => {
    const a = angleSlice * i - Math.PI / 2;
    return { x2: cx + maxR * Math.cos(a), y2: cy + maxR * Math.sin(a) };
  });

  // data polygon
  const dataPts = SKILL_META.map((s, i) => {
    const pt = toXY(skills[s.key], i);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  // label positions
  const labels = SKILL_META.map((s, i) => {
    const a = angleSlice * i - Math.PI / 2;
    const lr = maxR + 22;
    return { ...s, lx: cx + lr * Math.cos(a), ly: cy + lr * Math.sin(a) };
  });

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto">
      {/* grid */}
      {rings.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="#1e1e30" strokeWidth="1" />
      ))}
      {axes.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={a.x2} y2={a.y2} stroke="#1e1e30" strokeWidth="1" />
      ))}
      {/* data fill */}
      <polygon points={dataPts} fill="rgba(200,255,0,0.15)" stroke="#c8ff00" strokeWidth="2" />
      {/* data dots */}
      {SKILL_META.map((s, i) => {
        const pt = toXY(skills[s.key], i);
        return <circle key={s.key} cx={pt.x} cy={pt.y} r="4" fill={s.color} />;
      })}
      {/* labels */}
      {labels.map((l) => (
        <text
          key={l.key}
          x={l.lx}
          y={l.ly}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-vp-text-dim text-[9px] font-semibold uppercase"
        >
          {l.label}
        </text>
      ))}
    </svg>
  );
}

/* ──────────────────── page ──────────────────── */
export default function AddPlayerPage() {
  const { fetchWithAuth, loading: authLoading, isAdmin, user } = useAuth();
  const router = useRouter();

  /* form state */
  const [form, setForm] = useState<PlayerForm>({
    displayName: "",
    email: "",
    position: "",
    bio: "",
  });

  const [skills, setSkills] = useState<SkillRatings>({
    speed: 50,
    accuracy: 50,
    agility: 50,
    strength: 50,
    endurance: 50,
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* computed average */
  const avgRating = useMemo(() => {
    const vals = Object.values(skills);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [skills]);

  /* initials */
  const initials = useMemo(() => {
    return form.displayName
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [form.displayName]);

  /* ── RBAC guard ── */
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
            You don&apos;t have permission to access this page. This page is restricted to{" "}
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

  /* ── helpers ── */
  const updateForm = (field: keyof PlayerForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateSkill = (key: keyof SkillRatings, value: number) =>
    setSkills((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    // validation
    if (!form.displayName.trim()) {
      setMessage({ type: "error", text: "Display name is required." });
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setMessage({ type: "error", text: "A valid email address is required." });
      return;
    }
    if (!form.position) {
      setMessage({ type: "error", text: "Please select a position." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetchWithAuth("/players", {
        method: "POST",
        body: JSON.stringify({
          displayName: form.displayName.trim(),
          email: form.email.trim(),
          position: form.position,
          bio: form.bio.trim() || null,
          speed: skills.speed,
          accuracy: skills.accuracy,
          agility: skills.agility,
          strength: skills.strength,
          endurance: skills.endurance,
        }),
      });

      const data = await res.json().catch(() => ({ error: "Invalid response from server" }));

      if (!res.ok) {
        throw new Error(data.error || "Failed to create player");
      }

      setMessage({ type: "success", text: `Player "${form.displayName}" created successfully!` });
      // reset form
      setForm({ displayName: "", email: "", position: "", bio: "" });
      setSkills({ speed: 50, accuracy: 50, agility: 50, strength: 50, endurance: 50 });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── loading state ── */
  if (authLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-vp-lime animate-pulse text-xl font-bold">Loading...</div>
        </div>
      </AppShell>
    );
  }

  /* ─────────────────── render ─────────────────── */
  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 text-xs text-vp-text-dim hover:text-vp-lime transition-colors mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Admin Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wide">Add Player</h1>
          <p className="text-sm text-vp-text-dim mt-1">
            Register a new player profile with skill ratings and personal details
          </p>
        </div>

        {/* Status message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-vp-green/10 border border-vp-green/30 text-vp-green"
                : "bg-vp-red/10 border border-vp-red/30 text-vp-red"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* ── LEFT: Form ── */}
          <div className="xl:col-span-2 space-y-6">
            {/* Section 1: Player Profile */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-vp-blue/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#4a7cff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Player Profile</h2>
                  <p className="text-xs text-vp-text-muted">Basic information about the player</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Display Name */}
                <div>
                  <label className="block text-xs text-vp-text-dim mb-1.5 font-medium">
                    Display Name <span className="text-vp-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(e) => updateForm("displayName", e.target.value)}
                    placeholder="e.g. Virat Kohli"
                    className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs text-vp-text-dim mb-1.5 font-medium">
                    Email <span className="text-vp-red">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="e.g. player@versaplay.com"
                    className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30 transition-colors"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-xs text-vp-text-dim mb-1.5 font-medium">
                    Position <span className="text-vp-red">*</span>
                  </label>
                  <select
                    value={form.position}
                    onChange={(e) => updateForm("position", e.target.value)}
                    className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vp-lime/30 transition-colors appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                    }}
                  >
                    <option value="" disabled>
                      Select position...
                    </option>
                    {POSITIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-vp-text-dim mb-1.5 font-medium">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => updateForm("bio", e.target.value)}
                    placeholder="Short bio about the player (optional)"
                    rows={3}
                    className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Global Skill Ratings */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-vp-purple/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Global Skill Ratings</h2>
                  <p className="text-xs text-vp-text-muted">Set initial skill values for the player (0-100)</p>
                </div>
              </div>

              <div className="space-y-5">
                {SKILL_META.map((skill) => (
                  <div key={skill.key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-vp-text-dim font-medium uppercase tracking-wide">
                        {skill.label}
                      </label>
                      <span
                        className="text-sm font-black tabular-nums min-w-[36px] text-right"
                        style={{ color: skill.color }}
                      >
                        {skills[skill.key]}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={skills[skill.key]}
                        onChange={(e) => updateSkill(skill.key, parseInt(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${skill.color} 0%, ${skill.color} ${skills[skill.key]}%, #1e1e30 ${skills[skill.key]}%, #1e1e30 100%)`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Average indicator */}
                <div className="pt-4 mt-4 border-t border-vp-border flex items-center justify-between">
                  <span className="text-xs text-vp-text-dim font-bold uppercase tracking-wider">
                    Average Rating
                  </span>
                  <span className="text-lg font-black text-vp-lime">{avgRating}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Auto-generated Info */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-vp-green/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Automatically Generated</h2>
                  <p className="text-xs text-vp-text-muted">These values are set automatically upon creation</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Rating", value: "50", desc: "Starting rating", icon: "star" },
                  { label: "XP", value: "0", desc: "Experience points", icon: "zap" },
                  { label: "Level", value: "1", desc: "Starting level", icon: "layers" },
                  { label: "Wins", value: "0", desc: "Match wins", icon: "trophy" },
                  { label: "Losses", value: "0", desc: "Match losses", icon: "x" },
                  { label: "Global Rank", value: "TBD", desc: "Assigned after first match", icon: "globe" },
                ].map((item) => (
                  <div key={item.label} className="bg-vp-dark rounded-xl p-3.5">
                    <p className="text-[10px] text-vp-text-muted uppercase tracking-wider font-medium">{item.label}</p>
                    <p className="text-lg font-black text-white mt-1">{item.value}</p>
                    <p className="text-[10px] text-vp-text-muted mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-vp-lime text-vp-dark py-4 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-vp-lime-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Creating Player...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Create Player
                </>
              )}
            </button>
          </div>

          {/* ── RIGHT: Preview Card ── */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Preview label */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-vp-lime animate-pulse" />
                <span className="text-xs text-vp-text-dim font-bold uppercase tracking-wider">
                  Live Preview
                </span>
              </div>

              {/* Player Card Preview */}
              <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
                {/* Card header band */}
                <div className="h-20 bg-gradient-to-br from-vp-lime/20 via-vp-blue/10 to-vp-purple/10 relative">
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 rounded-2xl bg-vp-dark border-4 border-vp-card flex items-center justify-center">
                      {initials ? (
                        <span className="text-lg font-black text-vp-lime">{initials}</span>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-12 px-6 pb-6">
                  {/* Name and position */}
                  <h3 className="text-base font-bold text-white truncate">
                    {form.displayName || "Player Name"}
                  </h3>
                  <p className="text-xs text-vp-text-dim mt-0.5">
                    {form.position || "Position not set"}
                  </p>

                  {/* Email */}
                  {form.email && (
                    <p className="text-[11px] text-vp-text-muted mt-1 truncate">{form.email}</p>
                  )}

                  {/* Bio */}
                  {form.bio && (
                    <p className="text-xs text-vp-text-dim mt-3 line-clamp-2 italic">
                      &ldquo;{form.bio}&rdquo;
                    </p>
                  )}

                  {/* Quick stats row */}
                  <div className="grid grid-cols-3 gap-2 mt-5">
                    <div className="bg-vp-dark rounded-xl p-2.5 text-center">
                      <p className="text-lg font-black text-vp-lime">{avgRating}</p>
                      <p className="text-[9px] text-vp-text-muted uppercase font-medium">Rating</p>
                    </div>
                    <div className="bg-vp-dark rounded-xl p-2.5 text-center">
                      <p className="text-lg font-black text-white">1</p>
                      <p className="text-[9px] text-vp-text-muted uppercase font-medium">Level</p>
                    </div>
                    <div className="bg-vp-dark rounded-xl p-2.5 text-center">
                      <p className="text-lg font-black text-white">0</p>
                      <p className="text-[9px] text-vp-text-muted uppercase font-medium">XP</p>
                    </div>
                  </div>

                  {/* Radar Chart */}
                  <div className="mt-6">
                    <p className="text-[10px] text-vp-text-muted uppercase tracking-wider font-bold mb-3 text-center">
                      Skill Radar
                    </p>
                    <RadarChart skills={skills} />
                  </div>

                  {/* Skill bars */}
                  <div className="mt-5 space-y-2.5">
                    {SKILL_META.map((s) => (
                      <div key={s.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-vp-text-muted uppercase font-medium">
                            {s.label}
                          </span>
                          <span
                            className="text-[10px] font-bold tabular-nums"
                            style={{ color: s.color }}
                          >
                            {skills[s.key]}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-vp-dark rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${skills[s.key]}%`,
                              backgroundColor: s.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Range slider thumb styling */}
      <style jsx global>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #c8ff00;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(200, 255, 0, 0.3);
          transition: box-shadow 0.15s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 12px rgba(200, 255, 0, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #c8ff00;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(200, 255, 0, 0.3);
        }
        input[type="range"]::-moz-range-thumb:hover {
          box-shadow: 0 0 12px rgba(200, 255, 0, 0.5);
        }
        select option {
          background-color: #0a0a0f;
          color: #e4e4e7;
        }
      `}</style>
    </AppShell>
  );
}
