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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterTab = "All" | "Live" | "Upcoming" | "Completed";

interface Team {
  name: string;
  short: string;
  color: string;
}

interface MatchData {
  id: number;
  team1: Team;
  team2: Team;
  score1: string;
  score2: string;
  overs1: string;
  overs2: string;
  venue: string;
  status: "completed" | "live" | "upcoming";
  result: string;
}

interface PointsRow {
  team: Team;
  p: number;
  w: number;
  l: number;
  nr: number;
  nrr: string;
  pts: number;
}

interface StatEntry {
  label: string;
  player: string;
  value: string;
}

// ---------------------------------------------------------------------------
// Team colours
// ---------------------------------------------------------------------------

const TEAM_COLORS: Record<string, string> = {
  MS: "#c8ff00",
  ST: "#f59e0b",
  PS: "#f97316",
  BH: "#22c55e",
  AS: "#4a7cff",
  SS: "#06b6d4",
  HH: "#a855f7",
  SR: "#ef4444",
};

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const TEAMS: Record<string, Team> = {
  MS: { name: "Melbourne Stars", short: "MS", color: TEAM_COLORS.MS },
  ST: { name: "Sydney Thunder", short: "ST", color: TEAM_COLORS.ST },
  PS: { name: "Perth Scorchers", short: "PS", color: TEAM_COLORS.PS },
  BH: { name: "Brisbane Heat", short: "BH", color: TEAM_COLORS.BH },
  AS: { name: "Adelaide Strikers", short: "AS", color: TEAM_COLORS.AS },
  SS: { name: "Sydney Sixers", short: "SS", color: TEAM_COLORS.SS },
  HH: { name: "Hobart Hurricanes", short: "HH", color: TEAM_COLORS.HH },
  SR: { name: "Sydney Renegades", short: "SR", color: TEAM_COLORS.SR },
};

const MATCHES: MatchData[] = [
  {
    id: 1,
    team1: TEAMS.MS,
    team2: TEAMS.ST,
    score1: "186/4",
    score2: "172/8",
    overs1: "20 ov",
    overs2: "20 ov",
    venue: "MCG, Melbourne",
    status: "completed",
    result: "Melbourne Stars won by 14 runs",
  },
  {
    id: 2,
    team1: TEAMS.PS,
    team2: TEAMS.BH,
    score1: "198/5",
    score2: "199/3",
    overs1: "20 ov",
    overs2: "19.2 ov",
    venue: "Optus Stadium, Perth",
    status: "completed",
    result: "Brisbane Heat won by 7 wickets",
  },
  {
    id: 3,
    team1: TEAMS.AS,
    team2: TEAMS.SS,
    score1: "165/7",
    score2: "168/4",
    overs1: "20 ov",
    overs2: "18.4 ov",
    venue: "Adelaide Oval, Adelaide",
    status: "completed",
    result: "Sydney Sixers won by 6 wickets",
  },
  {
    id: 4,
    team1: TEAMS.HH,
    team2: TEAMS.ST,
    score1: "154/6",
    score2: "",
    overs1: "17.3 ov",
    overs2: "",
    venue: "Bellerive Oval, Hobart",
    status: "live",
    result: "Hobart Hurricanes batting",
  },
  {
    id: 5,
    team1: TEAMS.MS,
    team2: TEAMS.BH,
    score1: "",
    score2: "",
    overs1: "",
    overs2: "",
    venue: "MCG, Melbourne",
    status: "upcoming",
    result: "Starts 7:30 PM AEST",
  },
  {
    id: 6,
    team1: TEAMS.PS,
    team2: TEAMS.SR,
    score1: "",
    score2: "",
    overs1: "",
    overs2: "",
    venue: "Optus Stadium, Perth",
    status: "upcoming",
    result: "Starts 6:45 PM AWST",
  },
  {
    id: 7,
    team1: TEAMS.AS,
    team2: TEAMS.HH,
    score1: "",
    score2: "",
    overs1: "",
    overs2: "",
    venue: "Adelaide Oval, Adelaide",
    status: "upcoming",
    result: "Starts 7:00 PM ACDT",
  },
  {
    id: 8,
    team1: TEAMS.SS,
    team2: TEAMS.ST,
    score1: "",
    score2: "",
    overs1: "",
    overs2: "",
    venue: "SCG, Sydney",
    status: "upcoming",
    result: "Starts 7:15 PM AEST",
  },
];

const POINTS_TABLE: PointsRow[] = [
  { team: TEAMS.MS, p: 6, w: 5, l: 1, nr: 0, nrr: "+1.245", pts: 10 },
  { team: TEAMS.BH, p: 5, w: 4, l: 1, nr: 0, nrr: "+0.982", pts: 8 },
  { team: TEAMS.PS, p: 5, w: 3, l: 2, nr: 0, nrr: "+0.534", pts: 6 },
  { team: TEAMS.SS, p: 5, w: 3, l: 2, nr: 0, nrr: "+0.211", pts: 6 },
  { team: TEAMS.HH, p: 5, w: 2, l: 2, nr: 1, nrr: "-0.102", pts: 5 },
  { team: TEAMS.ST, p: 6, w: 2, l: 4, nr: 0, nrr: "-0.456", pts: 4 },
  { team: TEAMS.AS, p: 5, w: 1, l: 4, nr: 0, nrr: "-0.879", pts: 2 },
  { team: TEAMS.SR, p: 4, w: 0, l: 4, nr: 0, nrr: "-1.534", pts: 0 },
];

const SERIES_STATS: StatEntry[] = [
  { label: "Top Run Scorer", player: "Marcus Stoinis", value: "312 runs" },
  { label: "Top Wicket Taker", player: "Rashid Khan", value: "14 wkts" },
  { label: "Most Sixes", player: "Tim David", value: "18" },
  { label: "Best Economy", player: "Adam Zampa", value: "5.84" },
];

// ---------------------------------------------------------------------------
// Quick stat pills data
// ---------------------------------------------------------------------------

const QUICK_STATS = [
  { label: "Matches Played", value: "16/35" },
  { label: "Live", value: "1", highlight: true },
  { label: "Upcoming", value: "18" },
  { label: "Highest Score", value: "224/3" },
];

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------

const FILTER_TABS: FilterTab[] = ["All", "Live", "Upcoming", "Completed"];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SeriesScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filteredMatches =
    activeFilter === "All"
      ? MATCHES
      : MATCHES.filter((m) => m.status === activeFilter.toLowerCase());

  // -----------------------------------------------------------------------
  // Sub-renders
  // -----------------------------------------------------------------------

  const renderTeamBadge = (team: Team, size: number = 36) => {
    const half = size / 2;
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: half,
          backgroundColor: team.color + "22",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: size * 0.36,
            fontWeight: "800",
            color: team.color,
          }}
        >
          {team.short}
        </Text>
      </View>
    );
  };

  const renderStatusBadge = (status: MatchData["status"]) => {
    const map: Record<string, { bg: string; fg: string; text: string }> = {
      live: { bg: "rgba(239,68,68,0.15)", fg: colors.red, text: "LIVE" },
      completed: {
        bg: "rgba(82,82,91,0.2)",
        fg: colors.textDim,
        text: "COMPLETED",
      },
      upcoming: {
        bg: "rgba(245,158,11,0.15)",
        fg: colors.orange,
        text: "UPCOMING",
      },
    };
    const s = map[status];
    return (
      <View style={[styles.matchStatusBadge, { backgroundColor: s.bg }]}>
        {status === "live" && <View style={styles.liveDotSmall} />}
        <Text style={[styles.matchStatusText, { color: s.fg }]}>{s.text}</Text>
      </View>
    );
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}
        <View style={styles.header}>
          <View style={styles.seriesLabelRow}>
            <View style={styles.seriesLabelPill}>
              <Text style={styles.seriesLabelText}>T20 Cricket Series</Text>
            </View>
          </View>
          <Text style={styles.title}>T20 CHAMPIONS CUP</Text>
          <Text style={styles.subtitle}>
            Season 2025 &bull; 8 Teams &bull; 35 Matches
          </Text>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Quick Stat Pills                                                  */}
        {/* ----------------------------------------------------------------- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          {QUICK_STATS.map((stat) => (
            <View
              key={stat.label}
              style={[
                styles.statPill,
                stat.highlight && styles.statPillHighlight,
              ]}
            >
              <Text
                style={[
                  styles.statPillValue,
                  stat.highlight && styles.statPillValueHighlight,
                ]}
              >
                {stat.value}
              </Text>
              <Text
                style={[
                  styles.statPillLabel,
                  stat.highlight && styles.statPillLabelHighlight,
                ]}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* ----------------------------------------------------------------- */}
        {/* Filter Tabs                                                       */}
        {/* ----------------------------------------------------------------- */}
        <View style={styles.filterRow}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveFilter(tab)}
              style={[
                styles.filterTab,
                activeFilter === tab && styles.filterTabActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === tab && styles.filterTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Match Cards                                                       */}
        {/* ----------------------------------------------------------------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MATCHES</Text>
          {filteredMatches.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No matches in this category</Text>
            </View>
          ) : (
            filteredMatches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                {/* Card top row: match number + status */}
                <View style={styles.matchCardHeader}>
                  <Text style={styles.matchNumber}>Match {match.id}</Text>
                  {renderStatusBadge(match.status)}
                </View>

                {/* Teams */}
                <View style={styles.matchTeams}>
                  {/* Team 1 */}
                  <View style={styles.matchTeamRow}>
                    {renderTeamBadge(match.team1)}
                    <View style={styles.teamInfo}>
                      <Text style={styles.teamFullName}>
                        {match.team1.name}
                      </Text>
                      <Text style={styles.teamShortName}>
                        {match.team1.short}
                      </Text>
                    </View>
                    <View style={styles.scoreBlock}>
                      {match.score1 ? (
                        <>
                          <Text style={styles.scoreText}>{match.score1}</Text>
                          {match.overs1 ? (
                            <Text style={styles.oversText}>
                              {match.overs1}
                            </Text>
                          ) : null}
                        </>
                      ) : (
                        <Text style={styles.scoreTBD}>TBD</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.vsRow}>
                    <View style={styles.vsDivider} />
                    <Text style={styles.vsText}>VS</Text>
                    <View style={styles.vsDivider} />
                  </View>

                  {/* Team 2 */}
                  <View style={styles.matchTeamRow}>
                    {renderTeamBadge(match.team2)}
                    <View style={styles.teamInfo}>
                      <Text style={styles.teamFullName}>
                        {match.team2.name}
                      </Text>
                      <Text style={styles.teamShortName}>
                        {match.team2.short}
                      </Text>
                    </View>
                    <View style={styles.scoreBlock}>
                      {match.score2 ? (
                        <>
                          <Text style={styles.scoreText}>{match.score2}</Text>
                          {match.overs2 ? (
                            <Text style={styles.oversText}>
                              {match.overs2}
                            </Text>
                          ) : null}
                        </>
                      ) : (
                        <Text style={styles.scoreTBD}>TBD</Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Footer: venue + result */}
                <View style={styles.matchFooter}>
                  <Text style={styles.venueText}>{match.venue}</Text>
                  <Text
                    style={[
                      styles.resultText,
                      match.status === "live" && { color: colors.red },
                    ]}
                  >
                    {match.result}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Points Table                                                      */}
        {/* ----------------------------------------------------------------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>POINTS TABLE</Text>
          <View style={styles.tableCard}>
            {/* Table header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Team</Text>
              <Text style={styles.tableHeaderCell}>P</Text>
              <Text style={styles.tableHeaderCell}>W</Text>
              <Text style={styles.tableHeaderCell}>L</Text>
              <Text style={styles.tableHeaderCell}>NR</Text>
              <Text style={[styles.tableHeaderCell, { width: 50 }]}>NRR</Text>
              <Text style={styles.tableHeaderCell}>PTS</Text>
            </View>

            {POINTS_TABLE.map((row, idx) => {
              const isQualified = idx < 4;
              return (
                <View
                  key={row.team.short}
                  style={[
                    styles.tableRow,
                    idx < POINTS_TABLE.length - 1 && styles.tableRowBorder,
                    isQualified && styles.tableRowQualified,
                  ]}
                >
                  {/* Position + team */}
                  <View style={[styles.tableCell, { flex: 1, flexDirection: "row", alignItems: "center" }]}>
                    {isQualified && <View style={styles.qualifyBar} />}
                    <Text
                      style={[
                        styles.positionText,
                        isQualified && { color: colors.lime },
                      ]}
                    >
                      {idx + 1}
                    </Text>
                    {renderTeamBadge(row.team, 24)}
                    <Text
                      style={[
                        styles.tableTeamName,
                        isQualified && { color: colors.white },
                      ]}
                    >
                      {row.team.short}
                    </Text>
                  </View>
                  <Text style={styles.tableCellText}>{row.p}</Text>
                  <Text style={styles.tableCellText}>{row.w}</Text>
                  <Text style={styles.tableCellText}>{row.l}</Text>
                  <Text style={styles.tableCellText}>{row.nr}</Text>
                  <Text
                    style={[
                      styles.tableCellText,
                      { width: 50, textAlign: "right" },
                      parseFloat(row.nrr) >= 0
                        ? { color: colors.green }
                        : { color: colors.red },
                    ]}
                  >
                    {row.nrr}
                  </Text>
                  <Text
                    style={[
                      styles.tableCellText,
                      { fontWeight: "900" },
                      isQualified && { color: colors.lime },
                    ]}
                  >
                    {row.pts}
                  </Text>
                </View>
              );
            })}

            {/* Qualification line legend */}
            <View style={styles.qualifyLegend}>
              <View style={styles.qualifyLegendDot} />
              <Text style={styles.qualifyLegendText}>
                Top 4 qualify for playoffs
              </Text>
            </View>
          </View>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Series Stats                                                      */}
        {/* ----------------------------------------------------------------- */}
        <View style={[styles.section, { paddingBottom: 100 }]}>
          <Text style={styles.sectionTitle}>SERIES STATS</Text>
          <View style={styles.statsGrid}>
            {SERIES_STATS.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statCardLabel}>{stat.label}</Text>
                <Text style={styles.statCardPlayer}>{stat.player}</Text>
                <Text style={styles.statCardValue}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },

  // Header
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  seriesLabelRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  seriesLabelPill: {
    backgroundColor: colors.lime + "18",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  seriesLabelText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.lime,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: "900",
    color: colors.white,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    marginTop: spacing.xs,
  },

  // Quick Stats
  statsRow: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statPill: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    minWidth: 100,
  },
  statPillHighlight: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderColor: "rgba(239,68,68,0.3)",
  },
  statPillValue: {
    fontSize: fontSize.lg,
    fontWeight: "900",
    color: colors.white,
  },
  statPillValueHighlight: {
    color: colors.red,
  },
  statPillLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statPillLabelHighlight: {
    color: colors.red,
  },

  // Filter tabs
  filterRow: {
    flexDirection: "row",
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 4,
    gap: spacing.xs,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  filterTabActive: {
    backgroundColor: colors.lime,
  },
  filterText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textDim,
    textTransform: "uppercase",
  },
  filterTextActive: {
    color: colors.dark,
  },

  // Sections
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 1.5,
    marginBottom: spacing.lg,
  },

  // Match cards
  matchCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  matchCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  matchNumber: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  matchStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  liveDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.red,
  },
  matchStatusText: {
    fontSize: 9,
    fontWeight: "700",
  },
  matchTeams: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  matchTeamRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  teamInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  teamFullName: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.white,
  },
  teamShortName: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    marginTop: 1,
  },
  scoreBlock: {
    alignItems: "flex-end",
  },
  scoreText: {
    fontSize: fontSize.lg,
    fontWeight: "900",
    color: colors.white,
  },
  oversText: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  scoreTBD: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textMuted,
  },
  vsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  vsDivider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  vsText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
  },
  matchFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  venueText: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 4,
  },
  resultText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.lime,
  },

  // Points table
  tableCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    width: 32,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowQualified: {
    backgroundColor: "rgba(200,255,0,0.03)",
  },
  tableCell: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  positionText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
    width: 18,
    textAlign: "center",
  },
  qualifyBar: {
    position: "absolute",
    left: -spacing.lg,
    top: -spacing.md,
    bottom: -spacing.md,
    width: 3,
    backgroundColor: colors.lime,
    borderRadius: 2,
  },
  tableTeamName: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
    marginLeft: spacing.sm,
  },
  tableCellText: {
    fontSize: fontSize.xs,
    fontWeight: "500",
    color: colors.textDim,
    width: 32,
    textAlign: "center",
  },
  qualifyLegend: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  qualifyLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lime,
  },
  qualifyLegendText: {
    fontSize: 9,
    color: colors.textMuted,
  },

  // Series stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    width: "48%",
    flexGrow: 1,
  },
  statCardLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  statCardPlayer: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.white,
  },
  statCardValue: {
    fontSize: fontSize.lg,
    fontWeight: "900",
    color: colors.lime,
    marginTop: spacing.xs,
  },

  // Empty state
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textDim,
  },
});
