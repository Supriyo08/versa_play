import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";

// ── Types ──────────────────────────────────────────────────────────────────

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

interface BattingCardEntry {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  status: string; // e.g. "c Maxwell b Starc", "not out", "b Hazlewood"
}

interface BowlingCardEntry {
  name: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
}

interface RecentOver {
  overNumber: number;
  totalRuns: number;
  balls: string[];
}

// ── Ball color helper ──────────────────────────────────────────────────────

function getBallColor(ball: string): { bg: string; fg: string } {
  switch (ball) {
    case "0":
      return { bg: colors.textMuted, fg: colors.white };
    case "4":
      return { bg: colors.blue, fg: colors.white };
    case "6":
      return { bg: colors.lime, fg: colors.dark };
    case "W":
      return { bg: colors.red, fg: colors.white };
    case "WD":
    case "NB":
    case "B":
    case "LB":
      return { bg: colors.orange, fg: colors.dark };
    default:
      return { bg: colors.card, fg: colors.white };
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function LiveScoringScreen() {
  // ── Match state ────────────────────────────────────────────────────────

  const [totalRuns, setTotalRuns] = useState(184);
  const [totalWickets, setTotalWickets] = useState(4);
  const [completedOvers, setCompletedOvers] = useState(18);
  const [currentOverBalls, setCurrentOverBalls] = useState<string[]>(["1", "0", "4"]);

  const target = 280;

  const [batsmen, setBatsmen] = useState<BatsmanStats[]>([
    { name: "Virat Kohli", runs: 72, balls: 51, fours: 8, sixes: 2, isOnStrike: true },
    { name: "KL Rahul", runs: 38, balls: 29, fours: 3, sixes: 1, isOnStrike: false },
  ]);

  const [bowler, setBowler] = useState<BowlerStats>({
    name: "Mitchell Starc",
    overs: 3,
    balls: 3,
    maidens: 0,
    runs: 28,
    wickets: 1,
  });

  const [recentOvers, setRecentOvers] = useState<RecentOver[]>([
    { overNumber: 14, totalRuns: 8, balls: ["1", "0", "4", "1", "2", "0"] },
    { overNumber: 15, totalRuns: 10, balls: ["4", "1", "0", "1", "4", "0"] },
    { overNumber: 16, totalRuns: 6, balls: ["1", "1", "0", "2", "1", "1"] },
    { overNumber: 17, totalRuns: 13, balls: ["4", "6", "1", "0", "1", "1"] },
    { overNumber: 18, totalRuns: 8, balls: ["2", "0", "1", "4", "0", "1"] },
  ]);

  const [battingCard, setBattingCard] = useState<BattingCardEntry[]>([
    { name: "Rohit Sharma", runs: 34, balls: 26, fours: 5, sixes: 1, status: "c Maxwell b Starc" },
    { name: "Shubman Gill", runs: 18, balls: 15, fours: 3, sixes: 0, status: "b Hazlewood" },
    { name: "Shreyas Iyer", runs: 12, balls: 10, fours: 1, sixes: 0, status: "lbw b Zampa" },
    { name: "Suryakumar Yadav", runs: 5, balls: 8, fours: 0, sixes: 0, status: "c Carey b Starc" },
    { name: "Virat Kohli", runs: 72, balls: 51, fours: 8, sixes: 2, status: "not out" },
    { name: "KL Rahul", runs: 38, balls: 29, fours: 3, sixes: 1, status: "not out" },
  ]);

  const [bowlingCard, setBowlingCard] = useState<BowlingCardEntry[]>([
    { name: "Mitchell Starc", overs: 3, balls: 3, maidens: 0, runs: 28, wickets: 2 },
    { name: "Josh Hazlewood", overs: 4, balls: 0, maidens: 1, runs: 22, wickets: 1 },
    { name: "Pat Cummins", overs: 4, balls: 0, maidens: 0, runs: 35, wickets: 0 },
    { name: "Adam Zampa", overs: 4, balls: 0, maidens: 0, runs: 38, wickets: 1 },
    { name: "Glenn Maxwell", overs: 3, balls: 0, maidens: 0, runs: 29, wickets: 0 },
  ]);

  const [activeTab, setActiveTab] = useState<"batting" | "bowling">("batting");

  // ── Derived values ─────────────────────────────────────────────────────

  const legalBallsInOver = currentOverBalls.filter(
    (b) => b !== "WD" && b !== "NB"
  ).length;
  const currentOverNumber = completedOvers + (legalBallsInOver > 0 ? legalBallsInOver / 10 : 0);
  const oversDisplay = `${completedOvers}.${legalBallsInOver}`;
  const totalBallsBowled = completedOvers * 6 + legalBallsInOver;
  const remainingRuns = target - totalRuns;
  const remainingBalls = 300 - totalBallsBowled; // 50 overs = 300 balls
  const crr = totalBallsBowled > 0 ? ((totalRuns / totalBallsBowled) * 6).toFixed(2) : "0.00";
  const rrr = remainingBalls > 0 ? ((remainingRuns / remainingBalls) * 6).toFixed(2) : "0.00";

  const strikeRate = (runs: number, balls: number) =>
    balls > 0 ? ((runs / balls) * 100).toFixed(1) : "0.0";

  const bowlerOversDisplay = `${bowler.overs}.${bowler.balls}`;

  // ── handleBall ─────────────────────────────────────────────────────────

  const handleBall = (type: string) => {
    const isExtra = type === "WD" || type === "NB";
    const isWicket = type === "W";
    const runsScored = isWicket ? 0 : isExtra ? 1 : parseInt(type, 10);

    // Update total score
    setTotalRuns((prev) => prev + runsScored);

    // Update wickets
    if (isWicket) {
      setTotalWickets((prev) => prev + 1);
    }

    // Update current over balls
    const newOverBalls = [...currentOverBalls, isWicket ? "W" : type];
    const newLegalBalls = newOverBalls.filter((b) => b !== "WD" && b !== "NB").length;

    // Update batsman stats
    setBatsmen((prev) => {
      const updated = prev.map((b) => {
        if (!b.isOnStrike) return b;
        const newRuns = b.runs + (isExtra ? 0 : isWicket ? 0 : runsScored);
        const newBalls = b.balls + (isExtra ? 0 : 1);
        const newFours = b.fours + (!isExtra && !isWicket && runsScored === 4 ? 1 : 0);
        const newSixes = b.sixes + (!isExtra && !isWicket && runsScored === 6 ? 1 : 0);
        return { ...b, runs: newRuns, balls: newBalls, fours: newFours, sixes: newSixes };
      });

      // Rotate strike on odd runs (1, 3) for non-extra, non-wicket
      if (!isExtra && !isWicket && runsScored % 2 === 1) {
        return updated.map((b) => ({ ...b, isOnStrike: !b.isOnStrike }));
      }
      return updated;
    });

    // Update bowler stats
    setBowler((prev) => ({
      ...prev,
      runs: prev.runs + runsScored,
      balls: isExtra ? prev.balls : prev.balls >= 5 ? 0 : prev.balls + 1,
      overs: !isExtra && prev.balls >= 5 ? prev.overs + 1 : prev.overs,
      wickets: prev.wickets + (isWicket ? 1 : 0),
    }));

    // Update batting card (sync not-out batsmen)
    setBattingCard((prev) =>
      prev.map((entry) => {
        const matchingBatsman = batsmen.find((b) => b.name === entry.name);
        if (matchingBatsman && entry.status === "not out") {
          const isOnStrike = matchingBatsman.isOnStrike;
          const addedRuns = isOnStrike && !isExtra && !isWicket ? runsScored : 0;
          const addedBalls = isOnStrike && !isExtra ? 1 : 0;
          const addedFours = isOnStrike && !isExtra && !isWicket && runsScored === 4 ? 1 : 0;
          const addedSixes = isOnStrike && !isExtra && !isWicket && runsScored === 6 ? 1 : 0;
          return {
            ...entry,
            runs: entry.runs + addedRuns,
            balls: entry.balls + addedBalls,
            fours: entry.fours + addedFours,
            sixes: entry.sixes + addedSixes,
          };
        }
        return entry;
      })
    );

    // Update bowling card (sync current bowler)
    setBowlingCard((prev) =>
      prev.map((entry) => {
        if (entry.name === bowler.name) {
          const newBalls = isExtra ? entry.balls : entry.balls >= 5 ? 0 : entry.balls + 1;
          const newOvers = !isExtra && entry.balls >= 5 ? entry.overs + 1 : entry.overs;
          return {
            ...entry,
            runs: entry.runs + runsScored,
            balls: newBalls,
            overs: newOvers,
            wickets: entry.wickets + (isWicket ? 1 : 0),
          };
        }
        return entry;
      })
    );

    // Auto-end over after 6 legal deliveries
    if (!isExtra && newLegalBalls >= 6) {
      const overTotalRuns = newOverBalls.reduce((sum, b) => {
        if (b === "W") return sum;
        if (b === "WD" || b === "NB") return sum + 1;
        return sum + parseInt(b, 10);
      }, 0);
      setRecentOvers((prev) => [
        ...prev.slice(-4),
        { overNumber: completedOvers + 1, totalRuns: overTotalRuns, balls: newOverBalls },
      ]);
      setCompletedOvers((prev) => prev + 1);
      setCurrentOverBalls([]);
      // Rotate strike at end of over
      setBatsmen((prev) => prev.map((b) => ({ ...b, isOnStrike: !b.isOnStrike })));
    } else {
      setCurrentOverBalls(newOverBalls);
    }
  };

  // ── End Over (manual) ──────────────────────────────────────────────────

  const handleEndOver = () => {
    if (currentOverBalls.length === 0) return;
    const overTotalRuns = currentOverBalls.reduce((sum, b) => {
      if (b === "W") return sum;
      if (b === "WD" || b === "NB") return sum + 1;
      return sum + parseInt(b, 10);
    }, 0);
    setRecentOvers((prev) => [
      ...prev.slice(-4),
      { overNumber: completedOvers + 1, totalRuns: overTotalRuns, balls: currentOverBalls },
    ]);
    setCompletedOvers((prev) => prev + 1);
    setCurrentOverBalls([]);
    setBatsmen((prev) => prev.map((b) => ({ ...b, isOnStrike: !b.isOnStrike })));
  };

  // ── Render helpers ─────────────────────────────────────────────────────

  const renderBallCircle = (ball: string, index: number, size: number = 28) => {
    const { bg, fg } = getBallColor(ball);
    return (
      <View
        key={index}
        style={[
          styles.ballCircle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        ]}
      >
        <Text style={[styles.ballCircleText, { color: fg, fontSize: size * 0.4 }]}>{ball}</Text>
      </View>
    );
  };

  // ── JSX ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Cricket Live Scoring</Text>
            <Text style={styles.headerSubtitle}>India vs Australia — 2nd ODI, Mumbai</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        </View>

        {/* ── Scoreboard ──────────────────────────────────────────────── */}
        <View style={styles.scoreboardCard}>
          {/* India batting */}
          <View style={styles.scoreboardRow}>
            <View style={styles.teamFlag}>
              <Text style={styles.teamFlagText}>IND</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.teamLabel}>India (Batting)</Text>
            </View>
            <Text style={styles.scoreMain}>
              {totalRuns}/{totalWickets}
            </Text>
            <Text style={styles.oversText}>({oversDisplay} ov)</Text>
          </View>

          {/* Australia */}
          <View style={[styles.scoreboardRow, { marginTop: spacing.sm }]}>
            <View style={[styles.teamFlag, { backgroundColor: colors.blue + "25" }]}>
              <Text style={[styles.teamFlagText, { color: colors.blue }]}>AUS</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.teamLabel, { color: colors.textDim }]}>Australia</Text>
            </View>
            <Text style={[styles.scoreMain, { color: colors.textDim }]}>279/10</Text>
            <Text style={[styles.oversText, { color: colors.textMuted }]}>(50.0 ov)</Text>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Rate info */}
          <View style={styles.rateRow}>
            <View style={styles.rateItem}>
              <Text style={styles.rateLabel}>Target</Text>
              <Text style={styles.rateValue}>{target}</Text>
            </View>
            <View style={styles.rateItem}>
              <Text style={styles.rateLabel}>CRR</Text>
              <Text style={styles.rateValue}>{crr}</Text>
            </View>
            <View style={styles.rateItem}>
              <Text style={styles.rateLabel}>RRR</Text>
              <Text style={[styles.rateValue, { color: colors.orange }]}>{rrr}</Text>
            </View>
            <View style={styles.rateItem}>
              <Text style={styles.rateLabel}>Need</Text>
              <Text style={[styles.rateValue, { color: colors.red }]}>
                {remainingRuns > 0 ? `${remainingRuns} off ${remainingBalls}` : "Won!"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Current Partnership ─────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>CURRENT PARTNERSHIP</Text>
          <View style={styles.partnershipHeader}>
            <Text style={[styles.partnerCol, { flex: 2 }]}>Batter</Text>
            <Text style={styles.partnerCol}>R</Text>
            <Text style={styles.partnerCol}>B</Text>
            <Text style={styles.partnerCol}>4s</Text>
            <Text style={styles.partnerCol}>6s</Text>
            <Text style={styles.partnerCol}>SR</Text>
          </View>
          {batsmen.map((b, i) => (
            <View
              key={i}
              style={[
                styles.partnershipRow,
                b.isOnStrike && { backgroundColor: colors.lime + "08" },
              ]}
            >
              <View style={[{ flex: 2, flexDirection: "row", alignItems: "center", gap: spacing.xs }]}>
                {b.isOnStrike && (
                  <View style={styles.strikeDot} />
                )}
                <Text style={styles.batsmanName} numberOfLines={1}>
                  {b.name}
                </Text>
              </View>
              <Text style={styles.partnerStat}>{b.runs}</Text>
              <Text style={[styles.partnerStat, { color: colors.textDim }]}>{b.balls}</Text>
              <Text style={[styles.partnerStat, { color: colors.blue }]}>{b.fours}</Text>
              <Text style={[styles.partnerStat, { color: colors.lime }]}>{b.sixes}</Text>
              <Text style={[styles.partnerStat, { color: colors.textDim }]}>
                {strikeRate(b.runs, b.balls)}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Current Bowler ──────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>CURRENT BOWLER</Text>
          <View style={styles.bowlerRow}>
            <Text style={styles.bowlerName}>{bowler.name}</Text>
            <Text style={styles.bowlerFigures}>
              {bowlerOversDisplay}-{bowler.maidens}-{bowler.runs}-{bowler.wickets}
            </Text>
          </View>
          <View style={styles.bowlerMeta}>
            <Text style={styles.bowlerMetaText}>
              Econ: {bowler.overs * 6 + bowler.balls > 0
                ? ((bowler.runs / ((bowler.overs * 6 + bowler.balls) / 6))).toFixed(1)
                : "0.0"}
            </Text>
          </View>
        </View>

        {/* ── This Over ───────────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>THIS OVER (Over {completedOvers + 1})</Text>
          <View style={styles.ballsRow}>
            {currentOverBalls.length === 0 ? (
              <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>
                No balls bowled yet
              </Text>
            ) : (
              currentOverBalls.map((ball, idx) => renderBallCircle(ball, idx, 34))
            )}
          </View>
        </View>

        {/* ── Recent Overs ────────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>RECENT OVERS</Text>
          {recentOvers.slice(-5).map((over, idx) => (
            <View key={idx} style={styles.recentOverRow}>
              <View style={styles.overLabel}>
                <Text style={styles.overLabelText}>Ov {over.overNumber}</Text>
              </View>
              <View style={styles.ballsRow}>
                {over.balls.map((ball, bIdx) => renderBallCircle(ball, bIdx, 24))}
              </View>
              <Text style={styles.overTotal}>{over.totalRuns} runs</Text>
            </View>
          ))}
        </View>

        {/* ── Scoring Controls ────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>SCORING CONTROLS</Text>

          {/* Runs */}
          <Text style={styles.controlGroupLabel}>Runs</Text>
          <View style={styles.controlRow}>
            {[
              { label: "0", val: "0", bg: colors.card, border: colors.border, fg: colors.text },
              { label: "1", val: "1", bg: colors.card, border: colors.border, fg: colors.text },
              { label: "2", val: "2", bg: colors.card, border: colors.border, fg: colors.text },
              { label: "3", val: "3", bg: colors.card, border: colors.border, fg: colors.text },
              { label: "4", val: "4", bg: colors.blue + "20", border: colors.blue, fg: colors.blue },
              { label: "6", val: "6", bg: colors.lime + "20", border: colors.lime, fg: colors.lime },
            ].map((btn) => (
              <TouchableOpacity
                key={btn.val}
                onPress={() => handleBall(btn.val)}
                style={[
                  styles.controlBtn,
                  { backgroundColor: btn.bg, borderColor: btn.border },
                ]}
              >
                <Text style={[styles.controlBtnText, { color: btn.fg }]}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Extras */}
          <Text style={styles.controlGroupLabel}>Extras</Text>
          <View style={styles.controlRow}>
            {[
              { label: "Wide", val: "WD" },
              { label: "No Ball", val: "NB" },
              { label: "Bye", val: "B" },
              { label: "Leg Bye", val: "LB" },
            ].map((btn) => (
              <TouchableOpacity
                key={btn.val}
                onPress={() => handleBall(btn.val)}
                style={[
                  styles.controlBtn,
                  {
                    backgroundColor: colors.orange + "15",
                    borderColor: colors.orange + "50",
                    flex: 1,
                  },
                ]}
              >
                <Text style={[styles.controlBtnText, { color: colors.orange, fontSize: fontSize.xs }]}>
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Wicket + End Over */}
          <View style={[styles.controlRow, { marginTop: spacing.sm }]}>
            <TouchableOpacity
              onPress={() => handleBall("W")}
              style={[
                styles.controlBtn,
                {
                  backgroundColor: colors.red + "15",
                  borderColor: colors.red,
                  flex: 1,
                },
              ]}
            >
              <Text style={[styles.controlBtnText, { color: colors.red, fontWeight: "800" }]}>
                WICKET
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEndOver}
              style={[
                styles.controlBtn,
                {
                  backgroundColor: colors.purple + "15",
                  borderColor: colors.purple,
                  flex: 1,
                },
              ]}
            >
              <Text style={[styles.controlBtnText, { color: colors.purple, fontWeight: "800" }]}>
                END OVER
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Scorecard Tabs ──────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.tabRow}>
            <TouchableOpacity
              onPress={() => setActiveTab("batting")}
              style={[
                styles.tab,
                activeTab === "batting" && styles.tabActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "batting" && styles.tabTextActive,
                ]}
              >
                Batting Scorecard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("bowling")}
              style={[
                styles.tab,
                activeTab === "bowling" && styles.tabActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "bowling" && styles.tabTextActive,
                ]}
              >
                Bowling Scorecard
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "batting" ? (
            <View>
              {/* Batting table header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>Batter</Text>
                <Text style={styles.tableHeaderCell}>R</Text>
                <Text style={styles.tableHeaderCell}>B</Text>
                <Text style={styles.tableHeaderCell}>4s</Text>
                <Text style={styles.tableHeaderCell}>6s</Text>
                <Text style={styles.tableHeaderCell}>SR</Text>
              </View>
              {battingCard.map((b, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.tableRow,
                    idx % 2 === 0 && { backgroundColor: colors.card + "80" },
                  ]}
                >
                  <View style={{ flex: 2.5 }}>
                    <Text style={styles.tableCell} numberOfLines={1}>
                      {b.name}
                      {b.status === "not out" ? " *" : ""}
                    </Text>
                    <Text style={styles.tableCellSub}>{b.status}</Text>
                  </View>
                  <Text style={[styles.tableCell, { fontWeight: "700" }]}>{b.runs}</Text>
                  <Text style={[styles.tableCell, { color: colors.textDim }]}>{b.balls}</Text>
                  <Text style={[styles.tableCell, { color: colors.blue }]}>{b.fours}</Text>
                  <Text style={[styles.tableCell, { color: colors.lime }]}>{b.sixes}</Text>
                  <Text style={[styles.tableCell, { color: colors.textDim }]}>
                    {strikeRate(b.runs, b.balls)}
                  </Text>
                </View>
              ))}
              {/* Extras and total rows */}
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { flex: 2.5 }]}>Extras</Text>
                <Text style={styles.totalValue}>5 (b 2, lb 1, w 1, nb 1)</Text>
              </View>
              <View style={[styles.totalRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
                <Text style={[styles.totalLabel, { flex: 2.5 }]}>TOTAL</Text>
                <Text style={[styles.totalValue, { color: colors.white, fontWeight: "800" }]}>
                  {totalRuns}/{totalWickets} ({oversDisplay} ov)
                </Text>
              </View>
            </View>
          ) : (
            <View>
              {/* Bowling table header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>Bowler</Text>
                <Text style={styles.tableHeaderCell}>O</Text>
                <Text style={styles.tableHeaderCell}>M</Text>
                <Text style={styles.tableHeaderCell}>R</Text>
                <Text style={styles.tableHeaderCell}>W</Text>
                <Text style={styles.tableHeaderCell}>Econ</Text>
              </View>
              {bowlingCard.map((b, idx) => {
                const totalBalls = b.overs * 6 + b.balls;
                const econ = totalBalls > 0 ? ((b.runs / totalBalls) * 6).toFixed(1) : "0.0";
                const oversStr = `${b.overs}.${b.balls}`;
                return (
                  <View
                    key={idx}
                    style={[
                      styles.tableRow,
                      idx % 2 === 0 && { backgroundColor: colors.card + "80" },
                    ]}
                  >
                    <Text style={[styles.tableCell, { flex: 2.5 }]} numberOfLines={1}>
                      {b.name}
                    </Text>
                    <Text style={[styles.tableCell, { color: colors.textDim }]}>{oversStr}</Text>
                    <Text style={[styles.tableCell, { color: colors.textDim }]}>{b.maidens}</Text>
                    <Text style={[styles.tableCell, { fontWeight: "700" }]}>{b.runs}</Text>
                    <Text
                      style={[
                        styles.tableCell,
                        {
                          fontWeight: "700",
                          color: b.wickets > 0 ? colors.red : colors.textDim,
                        },
                      ]}
                    >
                      {b.wickets}
                    </Text>
                    <Text style={[styles.tableCell, { color: colors.orange }]}>{econ}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    marginTop: spacing.xs,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.red + "20",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.red + "50",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
  },
  liveBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: "800",
    color: colors.red,
    letterSpacing: 1,
  },

  // Scoreboard
  scoreboardCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  scoreboardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  teamFlag: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.lime + "25",
    alignItems: "center",
    justifyContent: "center",
  },
  teamFlagText: {
    fontSize: fontSize.xs,
    fontWeight: "800",
    color: colors.lime,
  },
  teamLabel: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.white,
  },
  scoreMain: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.white,
  },
  oversText: {
    fontSize: fontSize.xs,
    color: colors.textDim,
    marginLeft: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rateItem: {
    alignItems: "center",
  },
  rateLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  rateValue: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.white,
  },

  // Section card
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.lime,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },

  // Partnership
  partnershipHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  partnerCol: {
    flex: 1,
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textMuted,
    textAlign: "center",
  },
  partnershipRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.xs,
  },
  strikeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lime,
  },
  batsmanName: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.white,
    flex: 1,
  },
  partnerStat: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
  },

  // Bowler
  bowlerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bowlerName: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.white,
  },
  bowlerFigures: {
    fontSize: fontSize.md,
    fontWeight: "800",
    color: colors.text,
  },
  bowlerMeta: {
    marginTop: spacing.xs,
  },
  bowlerMetaText: {
    fontSize: fontSize.xs,
    color: colors.textDim,
  },

  // Balls
  ballCircle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  ballCircleText: {
    fontWeight: "800",
  },
  ballsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    alignItems: "center",
  },

  // Recent overs
  recentOverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  overLabel: {
    width: 50,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.dark,
    borderRadius: borderRadius.sm,
    alignItems: "center",
  },
  overLabelText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
  },
  overTotal: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textDim,
    marginLeft: "auto",
  },

  // Controls
  controlGroupLabel: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textDim,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  controlRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  controlBtn: {
    minWidth: 48,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
  },
  controlBtnText: {
    fontSize: fontSize.base,
    fontWeight: "700",
  },

  // Tabs
  tabRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.lime + "20",
    borderColor: colors.lime,
  },
  tabText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
  },
  tabTextActive: {
    color: colors.lime,
  },

  // Table
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textMuted,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tableCell: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.white,
    textAlign: "center",
  },
  tableCellSub: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.sm,
  },
  totalLabel: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textDim,
  },
  totalValue: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textDim,
    textAlign: "right",
  },
});
