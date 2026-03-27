"use client";

import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Official {
  id: string;
  name: string;
  rating: number;       // 1-5
  experience: string;   // "Elite" | "Senior" | "Intermediate" | "Junior"
  matchesOfficiated: number;
}

interface Assignment {
  role: string;
  icon: React.ReactNode;
  officialId: string | null;
  status: "Confirmed" | "Pending";
  thumbsUp: number;
  thumbsDown: number;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_OFFICIALS: Official[] = [
  { id: "off-1", name: "Kumar Dharmasena",  rating: 5, experience: "Elite",        matchesOfficiated: 142 },
  { id: "off-2", name: "Richard Kettleborough", rating: 5, experience: "Elite",   matchesOfficiated: 128 },
  { id: "off-3", name: "Marais Erasmus",    rating: 4, experience: "Senior",       matchesOfficiated: 110 },
  { id: "off-4", name: "Nitin Menon",       rating: 4, experience: "Senior",       matchesOfficiated: 86 },
  { id: "off-5", name: "Chris Gaffaney",    rating: 4, experience: "Senior",       matchesOfficiated: 97 },
  { id: "off-6", name: "Joel Wilson",       rating: 3, experience: "Intermediate", matchesOfficiated: 54 },
  { id: "off-7", name: "Ahsan Raza",        rating: 3, experience: "Intermediate", matchesOfficiated: 62 },
  { id: "off-8", name: "Paul Reiffel",      rating: 5, experience: "Elite",        matchesOfficiated: 135 },
  { id: "off-9", name: "Langton Rusere",    rating: 2, experience: "Junior",       matchesOfficiated: 18 },
  { id: "off-10", name: "Allahudien Paleker", rating: 2, experience: "Junior",     matchesOfficiated: 12 },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    role: "On-field Umpire 1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0113 0" />
      </svg>
    ),
    officialId: "off-1",
    status: "Confirmed",
    thumbsUp: 24,
    thumbsDown: 2,
  },
  {
    role: "On-field Umpire 2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0113 0" />
      </svg>
    ),
    officialId: "off-2",
    status: "Confirmed",
    thumbsUp: 19,
    thumbsDown: 1,
  },
  {
    role: "Third Umpire (TV)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    officialId: "off-3",
    status: "Pending",
    thumbsUp: 14,
    thumbsDown: 3,
  },
  {
    role: "Match Referee",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    officialId: "off-8",
    status: "Confirmed",
    thumbsUp: 30,
    thumbsDown: 0,
  },
  {
    role: "Reserve Umpire",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0113 0" />
        <line x1="18" y1="8" x2="18" y2="14" /><line x1="15" y1="11" x2="21" y2="11" />
      </svg>
    ),
    officialId: null,
    status: "Pending",
    thumbsUp: 0,
    thumbsDown: 0,
  },
  {
    role: "Scorer 1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    officialId: "off-6",
    status: "Confirmed",
    thumbsUp: 8,
    thumbsDown: 1,
  },
  {
    role: "Scorer 2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    officialId: null,
    status: "Pending",
    thumbsUp: 0,
    thumbsDown: 0,
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: experience badge color                                     */
/* ------------------------------------------------------------------ */

function expBadgeClass(exp: string) {
  switch (exp) {
    case "Elite":        return "bg-vp-lime/10 text-vp-lime border-vp-lime/20";
    case "Senior":       return "bg-vp-blue/10 text-vp-blue border-vp-blue/20";
    case "Intermediate": return "bg-vp-orange/10 text-vp-orange border-vp-orange/20";
    case "Junior":       return "bg-vp-purple/10 text-vp-purple border-vp-purple/20";
    default:             return "bg-vp-text-muted/10 text-vp-text-dim border-vp-border";
  }
}

/* ------------------------------------------------------------------ */
/*  Star Rating Component                                              */
/* ------------------------------------------------------------------ */

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i < count ? "text-vp-lime" : "text-vp-text-muted"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function OfficialsPage() {
  const { loading: authLoading, isAdmin, user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [saveMsg, setSaveMsg] = useState("");

  /* RBAC guard ---------------------------------------------------- */
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
            You don&apos;t have permission to access Official Assignments. This page is
            restricted to{" "}
            <span className="text-vp-orange font-semibold">Admin</span> and{" "}
            <span className="text-vp-red font-semibold">Superadmin</span> users only.
          </p>
          <p className="text-xs text-vp-text-muted mt-3">
            Your current role:{" "}
            <span className="text-white font-medium capitalize">
              {user?.role || "unknown"}
            </span>
          </p>
        </div>
      </AppShell>
    );
  }

  /* Handlers ------------------------------------------------------ */

  function getOfficial(id: string | null): Official | undefined {
    if (!id) return undefined;
    return MOCK_OFFICIALS.find((o) => o.id === id);
  }

  function handleSelectOfficial(roleIndex: number, officialId: string) {
    setAssignments((prev) =>
      prev.map((a, i) =>
        i === roleIndex
          ? { ...a, officialId: officialId || null, status: officialId ? "Pending" : "Pending" }
          : a,
      ),
    );
    setSaveMsg("");
  }

  function handleThumb(roleIndex: number, direction: "up" | "down") {
    setAssignments((prev) =>
      prev.map((a, i) =>
        i === roleIndex
          ? {
              ...a,
              thumbsUp: direction === "up" ? a.thumbsUp + 1 : a.thumbsUp,
              thumbsDown: direction === "down" ? a.thumbsDown + 1 : a.thumbsDown,
            }
          : a,
      ),
    );
  }

  function handleSave() {
    setSaveMsg("Assignments saved successfully!");
    setAssignments((prev) =>
      prev.map((a) => (a.officialId ? { ...a, status: "Confirmed" } : a)),
    );
    setTimeout(() => setSaveMsg(""), 3000);
  }

  function handleClearAll() {
    setAssignments(
      INITIAL_ASSIGNMENTS.map((a) => ({
        ...a,
        officialId: null,
        status: "Pending" as const,
        thumbsUp: 0,
        thumbsDown: 0,
      })),
    );
    setSaveMsg("");
  }

  /* Loading state ------------------------------------------------- */
  if (authLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-vp-lime animate-pulse text-xl font-bold">
            Loading Officials...
          </div>
        </div>
      </AppShell>
    );
  }

  /* Render -------------------------------------------------------- */
  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-vp-lime/10 flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c8ff00"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Official Assignments</h1>
              <p className="text-sm text-vp-text-dim mt-0.5">
                Assign umpires, referees, and scorers to upcoming matches
              </p>
            </div>
          </div>
        </div>

        {/* Stats ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Officials",
              value: MOCK_OFFICIALS.length,
              color: "text-vp-lime",
            },
            {
              label: "Assigned",
              value: assignments.filter((a) => a.officialId).length,
              color: "text-vp-blue",
            },
            {
              label: "Confirmed",
              value: assignments.filter((a) => a.status === "Confirmed").length,
              color: "text-vp-green",
            },
            {
              label: "Pending",
              value: assignments.filter((a) => a.status === "Pending").length,
              color: "text-vp-orange",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-vp-card rounded-2xl border border-vp-border p-5"
            >
              <p className="text-xs text-vp-text-dim uppercase tracking-wider">
                {stat.label}
              </p>
              <p className={`text-2xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Success / Error banner */}
        {saveMsg && (
          <div className="mb-6 p-4 rounded-xl bg-vp-green/10 border border-vp-green/30 text-vp-green text-sm font-medium flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {saveMsg}
          </div>
        )}

        {/* Assignment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {assignments.map((assignment, idx) => {
            const official = getOfficial(assignment.officialId);

            return (
              <div
                key={assignment.role}
                className="bg-vp-card rounded-2xl border border-vp-border flex flex-col overflow-hidden hover:border-vp-lime/20 transition-colors"
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-3 border-b border-vp-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-vp-dark flex items-center justify-center text-vp-lime">
                        {assignment.icon}
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {assignment.role}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                        assignment.status === "Confirmed"
                          ? "bg-vp-green/10 text-vp-green border-vp-green/20"
                          : "bg-vp-orange/10 text-vp-orange border-vp-orange/20"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 py-4 flex-1">
                  {/* Official info or unassigned */}
                  {official ? (
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-vp-lime/20 flex items-center justify-center text-sm font-bold text-vp-lime">
                          {official.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white leading-tight">
                            {official.name}
                          </p>
                          <p className="text-[11px] text-vp-text-dim mt-0.5">
                            {official.matchesOfficiated} matches
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Stars count={official.rating} />
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${expBadgeClass(
                            official.experience,
                          )}`}
                        >
                          {official.experience}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-vp-dark border border-dashed border-vp-border flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#52525b"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="7" r="4" />
                          <path d="M5.5 21a6.5 6.5 0 0113 0" />
                        </svg>
                      </div>
                      <p className="text-sm text-vp-text-muted italic">Unassigned</p>
                    </div>
                  )}

                  {/* Dropdown */}
                  <select
                    value={assignment.officialId ?? ""}
                    onChange={(e) => handleSelectOfficial(idx, e.target.value)}
                    className="w-full bg-vp-dark border border-vp-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-vp-lime/40 transition-colors appearance-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                    }}
                  >
                    <option value="">-- Select Official --</option>
                    {MOCK_OFFICIALS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.experience} - {o.rating} stars)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Card footer - voting */}
                <div className="px-5 py-3 border-t border-vp-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleThumb(idx, "up")}
                      className="flex items-center gap-1.5 text-vp-text-dim hover:text-vp-green transition-colors group"
                      aria-label="Thumbs up"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:scale-110 transition-transform"
                      >
                        <path d="M14 9V5a3 3 0 00-6 0v4M5 11h3v10H5a1 1 0 01-1-1v-8a1 1 0 011-1zM10 21h6.5a2.5 2.5 0 002.45-2l1.37-7A2.5 2.5 0 0017.87 9H14" />
                      </svg>
                      <span className="text-xs font-bold">{assignment.thumbsUp}</span>
                    </button>
                    <button
                      onClick={() => handleThumb(idx, "down")}
                      className="flex items-center gap-1.5 text-vp-text-dim hover:text-vp-red transition-colors group"
                      aria-label="Thumbs down"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:scale-110 transition-transform"
                      >
                        <path d="M10 15v4a3 3 0 006 0v-4M19 13h-3V3h3a1 1 0 011 1v8a1 1 0 01-1 1zM14 3H7.5A2.5 2.5 0 005.05 5l-1.37 7A2.5 2.5 0 006.13 15H10" />
                      </svg>
                      <span className="text-xs font-bold">{assignment.thumbsDown}</span>
                    </button>
                  </div>
                  {official && (
                    <span className="text-[10px] text-vp-text-muted">
                      {official.matchesOfficiated} career matches
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom action bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-vp-card rounded-2xl border border-vp-border p-5">
          <div className="text-sm text-vp-text-dim">
            <span className="text-white font-bold">
              {assignments.filter((a) => a.officialId).length}
            </span>{" "}
            of{" "}
            <span className="text-white font-bold">{assignments.length}</span>{" "}
            roles assigned
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAll}
              className="px-5 py-2.5 rounded-xl border border-vp-border text-sm font-bold text-vp-text-dim hover:text-white hover:border-vp-red/40 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-vp-lime text-vp-dark text-sm font-bold hover:bg-vp-lime-dark transition-colors"
            >
              Save Assignments
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
