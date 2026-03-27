"use client";

import AppShell from "@/components/layout/AppShell";
import { useState, useCallback, useMemo } from "react";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type BallOutcome =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "6"
  | "W"
  | "WD"
  | "NB"
  | "B"
  | "LB";

interface BatsmanStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOnStrike: boolean;
}

interface BowlerStats {
  name: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
}

interface OverSummary {
  overNumber: number;
  balls: BallOutcome[];
  runs: number;
}

interface BattingEntry {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  howOut: string;
}

interface BowlingEntry {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: string;
}

/* ================================================================== */
/*  Initial Mock Data                                                  */
/* ================================================================== */

const INITIAL_BATSMEN: BatsmanStats[] = [
  { name: "Virat Kohli", runs: 72, balls: 51, fours: 8, sixes: 2, isOnStrike: true },
  { name: "KL Rahul", runs: 38, balls: 29, fours: 3, sixes: 1, isOnStrike: false },
];

const INITIAL_BOWLER: BowlerStats = {
  name: "Mitchell Starc",
  overs: 3,
  balls: 3,
  maidens: 0,
  runs: 28,
  wickets: 1,
};

const INITIAL_OVER_BALLS: BallOutcome[] = ["1", "0", "4"];

const INITIAL_RECENT_OVERS: OverSummary[] = [
  { overNumber: 14, balls: ["0", "1", "2", "0", "4", "1"], runs: 8 },
  { overNumber: 15, balls: ["1", "6", "0", "0", "1", "2"], runs: 10 },
  { overNumber: 16, balls: ["4", "0", "W", "1", "0", "1"], runs: 6 },
  { overNumber: 17, balls: ["0", "0", "1", "4", "6", "2"], runs: 13 },
  { overNumber: 18, balls: ["2", "1", "0", "4", "1", "0"], runs: 8 },
];

const INITIAL_BATTING_CARD: BattingEntry[] = [
  { name: "Rohit Sharma", runs: 34, balls: 26, fours: 5, sixes: 1, howOut: "c Cummins b Starc" },
  { name: "Shubman Gill", runs: 18, balls: 15, fours: 2, sixes: 0, howOut: "b Hazlewood" },
  { name: "Shreyas Iyer", runs: 12, balls: 10, fours: 1, sixes: 0, howOut: "lbw b Zampa" },
  { name: "Suryakumar Yadav", runs: 5, balls: 8, fours: 0, sixes: 0, howOut: "c Smith b Starc" },
  { name: "Virat Kohli", runs: 72, balls: 51, fours: 8, sixes: 2, howOut: "not out" },
  { name: "KL Rahul", runs: 38, balls: 29, fours: 3, sixes: 1, howOut: "not out" },
];

const INITIAL_BOWLING_CARD: BowlingEntry[] = [
  { name: "Mitchell Starc", overs: "3.3", maidens: 0, runs: 28, wickets: 2, economy: "8.00" },
  { name: "Josh Hazlewood", overs: "4.0", maidens: 1, runs: 22, wickets: 1, economy: "5.50" },
  { name: "Pat Cummins", overs: "4.0", maidens: 0, runs: 35, wickets: 0, economy: "8.75" },
  { name: "Adam Zampa", overs: "4.0", maidens: 0, runs: 38, wickets: 1, economy: "9.50" },
  { name: "Glenn Maxwell", overs: "3.0", maidens: 0, runs: 29, wickets: 0, economy: "9.67" },
];

/* ================================================================== */
/*  Helper: ball outcome color                                         */
/* ================================================================== */

function ballColor(ball: BallOutcome): string {
  switch (ball) {
    case "4":
      return "bg-vp-blue text-white";
    case "6":
      return "bg-vp-lime text-vp-dark";
    case "W":
      return "bg-vp-red text-white";
    case "WD":
    case "NB":
      return "bg-vp-orange text-vp-dark";
    case "0":
      return "bg-zinc-700 text-zinc-300";
    default:
      return "bg-zinc-600 text-white";
  }
}

function runsFromBall(ball: BallOutcome): number {
  switch (ball) {
    case "0":
      return 0;
    case "1":
    case "B":
    case "LB":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "6":
      return 6;
    case "W":
      return 0;
    case "WD":
    case "NB":
      return 1;
    default:
      return 0;
  }
}

function isLegalDelivery(ball: BallOutcome): boolean {
  return ball !== "WD" && ball !== "NB";
}

/* ================================================================== */
/*  Page Component                                                     */
/* ================================================================== */

export default function CricketLiveScoringPage() {
  /* ---- Core match state ---- */
  const [totalRuns, setTotalRuns] = useState(184);
  const [totalWickets, setTotalWickets] = useState(4);
  const [completedOvers, setCompletedOvers] = useState(18);
  const [currentOverBalls, setCurrentOverBalls] = useState<BallOutcome[]>(INITIAL_OVER_BALLS);

  /* ---- Batsmen ---- */
  const [batsmen, setBatsmen] = useState<BatsmanStats[]>(INITIAL_BATSMEN);

  /* ---- Bowler ---- */
  const [bowler, setBowler] = useState<BowlerStats>(INITIAL_BOWLER);

  /* ---- Recent overs ---- */
  const [recentOvers, setRecentOvers] = useState<OverSummary[]>(INITIAL_RECENT_OVERS);

  /* ---- Scorecard ---- */
  const [battingCard] = useState<BattingEntry[]>(INITIAL_BATTING_CARD);
  const [bowlingCard] = useState<BowlingEntry[]>(INITIAL_BOWLING_CARD);

  /* ---- Tab state ---- */
  const [scorecardTab, setScorecardTab] = useState<"batting" | "bowling">("batting");

  /* ---- Derived values ---- */
  const legalBallsInOver = currentOverBalls.filter(isLegalDelivery).length;
  const oversDisplay = `${completedOvers}.${legalBallsInOver}`;
  const totalBallsBowled = completedOvers * 6 + legalBallsInOver;
  const crr = totalBallsBowled > 0 ? (totalRuns / (totalBallsBowled / 6)).toFixed(2) : "0.00";
  const targetRuns = 280;
  const remainingRuns = targetRuns - totalRuns;
  const remainingBalls = 120 - totalBallsBowled;
  const rrr = remainingBalls > 0 ? (remainingRuns / (remainingBalls / 6)).toFixed(2) : "0.00";

  /* ---- Batsman strike rate helper ---- */
  const strikeRate = useCallback((runs: number, balls: number) => {
    return balls > 0 ? ((runs / balls) * 100).toFixed(1) : "0.0";
  }, []);

  /* ---- Economy helper ---- */
  const economy = useMemo(() => {
    const totalBowlerBalls = bowler.overs * 6 + bowler.balls;
    return totalBowlerBalls > 0 ? ((bowler.runs / totalBowlerBalls) * 6).toFixed(2) : "0.00";
  }, [bowler]);

  /* ================================================================ */
  /*  Scoring Logic                                                    */
  /* ================================================================ */

  const handleBall = useCallback(
    (outcome: BallOutcome) => {
      const runs = runsFromBall(outcome);
      const legal = isLegalDelivery(outcome);

      /* Update total score */
      setTotalRuns((prev) => prev + runs);

      /* Wicket: increase wicket count */
      if (outcome === "W") {
        setTotalWickets((prev) => prev + 1);
      }

      /* Update current over balls */
      setCurrentOverBalls((prev) => [...prev, outcome]);

      /* Update batsman stats */
      setBatsmen((prev) => {
        const updated = [...prev];
        const si = updated.findIndex((b) => b.isOnStrike);
        if (si === -1) return prev;

        const striker = { ...updated[si] };
        if (outcome !== "WD" && outcome !== "NB" && outcome !== "B" && outcome !== "LB") {
          striker.runs += runs;
          striker.balls += 1;
          if (outcome === "4") striker.fours += 1;
          if (outcome === "6") striker.sixes += 1;
        } else if (outcome === "B" || outcome === "LB") {
          striker.balls += 1;
        }

        /* Rotate strike on odd runs (1, 3) */
        if (runs % 2 === 1 && outcome !== "WD" && outcome !== "NB") {
          const nsi = si === 0 ? 1 : 0;
          striker.isOnStrike = false;
          const nonStriker = { ...updated[nsi] };
          nonStriker.isOnStrike = true;
          updated[si] = striker;
          updated[nsi] = nonStriker;
        } else {
          updated[si] = striker;
        }

        return updated;
      });

      /* Update bowler stats */
      setBowler((prev) => {
        const updated = { ...prev };
        updated.runs += runs;
        if (outcome === "W") updated.wickets += 1;
        if (legal) {
          updated.balls += 1;
          if (updated.balls >= 6) {
            updated.overs += 1;
            updated.balls = 0;
          }
        }
        return updated;
      });

      /* Auto-end over if 6 legal deliveries */
      const newLegalCount =
        currentOverBalls.filter(isLegalDelivery).length + (legal ? 1 : 0);
      if (newLegalCount >= 6) {
        endOverInternal([...currentOverBalls, outcome]);
      }
    },
    [currentOverBalls]
  );

  /* ---- End Over ---- */
  const endOverInternal = useCallback(
    (balls: BallOutcome[]) => {
      const overRuns = balls.reduce((sum, b) => sum + runsFromBall(b), 0);
      const newOverSummary: OverSummary = {
        overNumber: completedOvers + 1,
        balls,
        runs: overRuns,
      };

      setRecentOvers((prev) => {
        const updated = [...prev, newOverSummary];
        return updated.slice(-5);
      });

      setCompletedOvers((prev) => prev + 1);
      setCurrentOverBalls([]);

      /* Rotate strike at end of over */
      setBatsmen((prev) => {
        const updated = prev.map((b) => ({ ...b, isOnStrike: !b.isOnStrike }));
        return updated;
      });
    },
    [completedOvers]
  );

  const handleEndOver = useCallback(() => {
    if (currentOverBalls.length === 0) return;
    endOverInternal(currentOverBalls);
  }, [currentOverBalls, endOverInternal]);

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        {/* ============================================================ */}
        {/*  Page Header                                                  */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Cricket Live Scoring</h1>
            <p className="text-sm text-vp-text-dim mt-1">
              India vs Australia &mdash; 2nd ODI, Mumbai
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex items-center gap-2 bg-vp-red/10 border border-vp-red/30 rounded-full px-4 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vp-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-vp-red" />
              </span>
              <span className="text-xs font-bold text-vp-red uppercase tracking-wide">
                Live
              </span>
            </span>
            <span className="text-xs text-vp-text-muted">Target: {targetRuns}</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Scoreboard Header                                            */}
        {/* ============================================================ */}
        <div className="bg-vp-card rounded-2xl border border-vp-border p-6 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Team name + Score */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-vp-blue/20 flex items-center justify-center">
                  <span className="text-xl font-black text-vp-blue">IND</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">India</h2>
                  <p className="text-xs text-vp-text-dim">Batting</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl lg:text-6xl font-black text-white tabular-nums">
                  {totalRuns}
                </span>
                <span className="text-2xl lg:text-3xl font-bold text-vp-text-muted">
                  /{totalWickets}
                </span>
              </div>
            </div>

            {/* Overs + Run Rates */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xs text-vp-text-muted uppercase tracking-wider mb-1">Overs</p>
                <p className="text-2xl font-bold font-mono text-white">{oversDisplay}</p>
              </div>
              <div className="w-px h-10 bg-vp-border" />
              <div className="text-center">
                <p className="text-xs text-vp-text-muted uppercase tracking-wider mb-1">CRR</p>
                <p className="text-2xl font-bold font-mono text-vp-lime">{crr}</p>
              </div>
              <div className="w-px h-10 bg-vp-border" />
              <div className="text-center">
                <p className="text-xs text-vp-text-muted uppercase tracking-wider mb-1">RRR</p>
                <p className="text-2xl font-bold font-mono text-vp-orange">{rrr}</p>
              </div>
              <div className="w-px h-10 bg-vp-border" />
              <div className="text-center">
                <p className="text-xs text-vp-text-muted uppercase tracking-wider mb-1">
                  Need
                </p>
                <p className="text-2xl font-bold font-mono text-vp-red">
                  {remainingRuns > 0 ? remainingRuns : 0}
                </p>
                <p className="text-[10px] text-vp-text-muted">
                  from {remainingBalls > 0 ? remainingBalls : 0} balls
                </p>
              </div>
            </div>

            {/* Opponent */}
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-white text-right">Australia</h2>
                <p className="text-xs text-vp-text-dim text-right">
                  {targetRuns - 1}/{10} (50.0)
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-vp-lime/20 flex items-center justify-center">
                <span className="text-xl font-black text-vp-lime">AUS</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Main Content Grid                                            */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* ---------------------------------------------------------- */}
          {/*  LEFT: Partnership + Bowling + This Over + Recent Overs     */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-6">
            {/* Current Partnership */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <h3 className="text-xs font-bold text-vp-text-muted uppercase tracking-wider mb-4">
                Current Partnership
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] text-vp-text-muted uppercase tracking-wider">
                      <th className="text-left pb-3 pr-4">Batsman</th>
                      <th className="text-center pb-3 px-2">R</th>
                      <th className="text-center pb-3 px-2">B</th>
                      <th className="text-center pb-3 px-2">4s</th>
                      <th className="text-center pb-3 px-2">6s</th>
                      <th className="text-center pb-3 px-2">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batsmen.map((bat, idx) => (
                      <tr
                        key={idx}
                        className={`border-t border-vp-border/50 ${
                          bat.isOnStrike ? "bg-vp-lime/5" : ""
                        }`}
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                bat.isOnStrike ? "text-vp-lime" : "text-white"
                              }`}
                            >
                              {bat.name}
                            </span>
                            {bat.isOnStrike && (
                              <span className="text-[9px] font-bold bg-vp-lime/20 text-vp-lime px-1.5 py-0.5 rounded">
                                *
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className="font-bold text-white tabular-nums">{bat.runs}</span>
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className="text-vp-text-dim tabular-nums">{bat.balls}</span>
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className="text-vp-blue tabular-nums">{bat.fours}</span>
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className="text-vp-lime tabular-nums">{bat.sixes}</span>
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className="text-vp-text-dim tabular-nums">
                            {strikeRate(bat.runs, bat.balls)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bowling Stats */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <h3 className="text-xs font-bold text-vp-text-muted uppercase tracking-wider mb-4">
                Current Bowler
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] text-vp-text-muted uppercase tracking-wider">
                      <th className="text-left pb-3 pr-4">Bowler</th>
                      <th className="text-center pb-3 px-2">O</th>
                      <th className="text-center pb-3 px-2">M</th>
                      <th className="text-center pb-3 px-2">R</th>
                      <th className="text-center pb-3 px-2">W</th>
                      <th className="text-center pb-3 px-2">Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-vp-border/50">
                      <td className="py-3 pr-4">
                        <span className="text-sm font-semibold text-white">{bowler.name}</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="font-bold text-white tabular-nums">
                          {bowler.overs}.{bowler.balls}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="text-vp-text-dim tabular-nums">{bowler.maidens}</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="text-vp-red tabular-nums">{bowler.runs}</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="text-vp-green font-bold tabular-nums">
                          {bowler.wickets}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="text-vp-text-dim tabular-nums">{economy}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* This Over - Ball by Ball */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-vp-text-muted uppercase tracking-wider">
                  This Over
                </h3>
                <span className="text-xs text-vp-text-dim">
                  Over {completedOvers + 1} &bull;{" "}
                  {currentOverBalls.reduce((s, b) => s + runsFromBall(b), 0)} runs
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {currentOverBalls.length === 0 ? (
                  <span className="text-xs text-vp-text-muted italic">New over...</span>
                ) : (
                  currentOverBalls.map((ball, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${ballColor(
                        ball
                      )}`}
                    >
                      {ball}
                    </div>
                  ))
                )}
                {/* Empty ball placeholders */}
                {Array.from({
                  length: Math.max(0, 6 - currentOverBalls.filter(isLegalDelivery).length),
                }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="w-10 h-10 rounded-full border-2 border-dashed border-vp-border flex items-center justify-center"
                  >
                    <span className="text-[10px] text-vp-text-muted">&bull;</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Overs Summary */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <h3 className="text-xs font-bold text-vp-text-muted uppercase tracking-wider mb-4">
                Recent Overs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {recentOvers.map((over) => (
                  <div
                    key={over.overNumber}
                    className="bg-vp-dark rounded-xl border border-vp-border p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-vp-text-muted font-semibold uppercase">
                        Over {over.overNumber}
                      </span>
                      <span className="text-xs font-bold text-white">{over.runs} runs</span>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {over.balls.map((ball, idx) => (
                        <div
                          key={idx}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${ballColor(
                            ball
                          )}`}
                        >
                          {ball}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/*  RIGHT: Scoring Controls                                     */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-6">
            {/* Run Buttons */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <h3 className="text-xs font-bold text-vp-text-muted uppercase tracking-wider mb-4">
                Runs
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(["0", "1", "2", "3", "4", "6"] as BallOutcome[]).map((val) => {
                  let btnClass =
                    "bg-vp-dark border border-vp-border text-white hover:bg-vp-card-hover";
                  if (val === "4")
                    btnClass =
                      "bg-vp-blue/10 border border-vp-blue/30 text-vp-blue hover:bg-vp-blue/20";
                  if (val === "6")
                    btnClass =
                      "bg-vp-lime/10 border border-vp-lime/30 text-vp-lime hover:bg-vp-lime/20";
                  if (val === "0")
                    btnClass =
                      "bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:bg-zinc-700/50";

                  return (
                    <button
                      key={val}
                      onClick={() => handleBall(val)}
                      className={`${btnClass} rounded-xl py-4 text-xl font-bold transition-colors`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extras */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <h3 className="text-xs font-bold text-vp-text-muted uppercase tracking-wider mb-4">
                Extras
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { val: "WD" as BallOutcome, label: "Wide" },
                    { val: "NB" as BallOutcome, label: "No Ball" },
                    { val: "B" as BallOutcome, label: "Bye" },
                    { val: "LB" as BallOutcome, label: "Leg Bye" },
                  ] as const
                ).map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => handleBall(val)}
                    className="bg-vp-orange/10 border border-vp-orange/30 text-vp-orange rounded-xl py-3 text-xs font-bold hover:bg-vp-orange/20 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wicket */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <h3 className="text-xs font-bold text-vp-text-muted uppercase tracking-wider mb-4">
                Wicket
              </h3>
              <button
                onClick={() => handleBall("W")}
                className="w-full bg-vp-red/10 border border-vp-red/30 text-vp-red rounded-xl py-4 text-lg font-bold hover:bg-vp-red/20 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 2v14M5 2v14M13 2v14M3 4h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Wicket
              </button>
            </div>

            {/* End Over */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <button
                onClick={handleEndOver}
                disabled={currentOverBalls.length === 0}
                className={`w-full rounded-xl py-4 text-sm font-bold transition-colors ${
                  currentOverBalls.length === 0
                    ? "bg-zinc-800/50 border border-zinc-700/30 text-zinc-600 cursor-not-allowed"
                    : "bg-vp-purple/10 border border-vp-purple/30 text-vp-purple hover:bg-vp-purple/20"
                }`}
              >
                End Over
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <h3 className="text-xs font-bold text-vp-text-muted uppercase tracking-wider mb-4">
                Match Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vp-text-dim">Partnership</span>
                  <span className="text-xs font-bold text-white">
                    {batsmen[0].runs + batsmen[1].runs} ({batsmen[0].balls + batsmen[1].balls})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vp-text-dim">Last Wicket</span>
                  <span className="text-xs font-bold text-white">169/4 (S. Yadav)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vp-text-dim">Extras</span>
                  <span className="text-xs font-bold text-white">5 (WD 3, NB 1, LB 1)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vp-text-dim">Last 5 Overs</span>
                  <span className="text-xs font-bold text-vp-lime">
                    {recentOvers.reduce((s, o) => s + o.runs, 0)} runs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Scorecard Tabs                                               */}
        {/* ============================================================ */}
        <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex border-b border-vp-border">
            <button
              onClick={() => setScorecardTab("batting")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                scorecardTab === "batting"
                  ? "text-vp-lime border-b-2 border-vp-lime bg-vp-lime/5"
                  : "text-vp-text-muted hover:text-white"
              }`}
            >
              Batting Scorecard
            </button>
            <button
              onClick={() => setScorecardTab("bowling")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                scorecardTab === "bowling"
                  ? "text-vp-blue border-b-2 border-vp-blue bg-vp-blue/5"
                  : "text-vp-text-muted hover:text-white"
              }`}
            >
              Bowling Scorecard
            </button>
          </div>

          {/* Batting Scorecard */}
          {scorecardTab === "batting" && (
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-vp-text-muted uppercase tracking-wider">
                    <th className="text-left pb-3 pr-4">Batsman</th>
                    <th className="text-left pb-3 pr-4 min-w-[120px]">How Out</th>
                    <th className="text-center pb-3 px-3">R</th>
                    <th className="text-center pb-3 px-3">B</th>
                    <th className="text-center pb-3 px-3">4s</th>
                    <th className="text-center pb-3 px-3">6s</th>
                    <th className="text-center pb-3 px-3">SR</th>
                  </tr>
                </thead>
                <tbody>
                  {battingCard.map((entry, idx) => {
                    const isNotOut = entry.howOut === "not out";
                    return (
                      <tr key={idx} className="border-t border-vp-border/50">
                        <td className="py-3 pr-4">
                          <span
                            className={`text-sm font-semibold ${
                              isNotOut ? "text-vp-lime" : "text-white"
                            }`}
                          >
                            {entry.name}
                            {isNotOut && " *"}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`text-xs ${
                              isNotOut ? "text-vp-green font-semibold" : "text-vp-text-dim"
                            }`}
                          >
                            {entry.howOut}
                          </span>
                        </td>
                        <td className="text-center py-3 px-3">
                          <span className="font-bold text-white tabular-nums">{entry.runs}</span>
                        </td>
                        <td className="text-center py-3 px-3">
                          <span className="text-vp-text-dim tabular-nums">{entry.balls}</span>
                        </td>
                        <td className="text-center py-3 px-3">
                          <span className="text-vp-blue tabular-nums">{entry.fours}</span>
                        </td>
                        <td className="text-center py-3 px-3">
                          <span className="text-vp-lime tabular-nums">{entry.sixes}</span>
                        </td>
                        <td className="text-center py-3 px-3">
                          <span className="text-vp-text-dim tabular-nums">
                            {entry.balls > 0
                              ? ((entry.runs / entry.balls) * 100).toFixed(1)
                              : "0.0"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-vp-border">
                    <td colSpan={2} className="py-3 pr-4">
                      <span className="text-sm font-bold text-white">Total</span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className="font-bold text-vp-lime tabular-nums">{totalRuns}</span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className="text-vp-text-dim tabular-nums">{totalBallsBowled}</span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className="text-vp-blue tabular-nums">
                        {battingCard.reduce((s, e) => s + e.fours, 0)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className="text-vp-lime tabular-nums">
                        {battingCard.reduce((s, e) => s + e.sixes, 0)}
                      </span>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Bowling Scorecard */}
          {scorecardTab === "bowling" && (
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-vp-text-muted uppercase tracking-wider">
                    <th className="text-left pb-3 pr-4">Bowler</th>
                    <th className="text-center pb-3 px-3">O</th>
                    <th className="text-center pb-3 px-3">M</th>
                    <th className="text-center pb-3 px-3">R</th>
                    <th className="text-center pb-3 px-3">W</th>
                    <th className="text-center pb-3 px-3">Econ</th>
                  </tr>
                </thead>
                <tbody>
                  {bowlingCard.map((entry, idx) => (
                    <tr key={idx} className="border-t border-vp-border/50">
                      <td className="py-3 pr-4">
                        <span className="text-sm font-semibold text-white">{entry.name}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className="font-bold text-white tabular-nums">{entry.overs}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className="text-vp-text-dim tabular-nums">{entry.maidens}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className="text-vp-red tabular-nums">{entry.runs}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className="text-vp-green font-bold tabular-nums">
                          {entry.wickets}
                        </span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span
                          className={`tabular-nums ${
                            parseFloat(entry.economy) > 8.0
                              ? "text-vp-red"
                              : parseFloat(entry.economy) < 6.0
                              ? "text-vp-green"
                              : "text-vp-text-dim"
                          }`}
                        >
                          {entry.economy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-vp-border">
                    <td className="py-3 pr-4">
                      <span className="text-sm font-bold text-white">Total</span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className="font-bold text-white tabular-nums">{oversDisplay}</span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className="text-vp-text-dim tabular-nums">
                        {bowlingCard.reduce((s, e) => s + e.maidens, 0)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className="text-vp-red font-bold tabular-nums">{totalRuns}</span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className="text-vp-green font-bold tabular-nums">{totalWickets}</span>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
