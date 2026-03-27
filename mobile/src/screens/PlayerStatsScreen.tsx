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

const SKILLS = [
  { label: "Batting", value: 92 },
  { label: "Bowling", value: 78 },
  { label: "Fielding", value: 85 },
  { label: "Speed", value: 88 },
  { label: "Endurance", value: 81 },
];

const MATCH_HISTORY = [
  { id: "1", opponent: "Royal Strikers", score: "72 (48)", result: "W", date: "Mar 22" },
  { id: "2", opponent: "Thunder Kings", score: "45 (32)", result: "W", date: "Mar 18" },
  { id: "3", opponent: "Phoenix XI", score: "12 (18)", result: "L", date: "Mar 14" },
  { id: "4", opponent: "Galaxy Warriors", score: "89 (56)", result: "W", date: "Mar 10" },
  { id: "5", opponent: "Storm Riders", score: "34 (28)", result: "W", date: "Mar 06" },
];

const ACHIEVEMENTS = [
  { id: "1", title: "Century Maker", desc: "Scored 100+ runs in a single innings", icon: "C" },
  { id: "2", title: "Hat-trick Hero", desc: "Took 3 wickets in consecutive balls", icon: "H" },
  { id: "3", title: "MVP Award", desc: "Most Valuable Player of the season", icon: "M" },
  { id: "4", title: "Golden Glove", desc: "Best fielder of the tournament", icon: "G" },
  { id: "5", title: "Speed Demon", desc: "Fastest century in tournament history", icon: "S" },
  { id: "6", title: "Iron Wall", desc: "Most balls faced without dismissal", icon: "I" },
];

const PERIODS = ["Week", "Month", "Season", "All Time"] as const;

export default function PlayerStatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Season");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>MK</Text>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>Marcus &apos;Vortex&apos; Kane</Text>
              <View style={styles.heroBadgesRow}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>#4</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingBadgeLabel}>Rating</Text>
                  <Text style={styles.ratingBadgeValue}>96</Text>
                </View>
                <View style={styles.winBadge}>
                  <Text style={styles.winBadgeLabel}>Win Rate</Text>
                  <Text style={styles.winBadgeValue}>74%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stat Cards */}
        <View style={styles.statCardsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statCardValue}>342</Text>
            <Text style={styles.statCardLabel}>Matches</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.circularProgress}>
              <View style={styles.circularInner}>
                <Text style={styles.circularText}>74%</Text>
              </View>
            </View>
            <Text style={styles.statCardLabel}>Win Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardValue}>12</Text>
            <Text style={styles.statCardLabel}>Current Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardValue}>2,847</Text>
            <Text style={styles.statCardLabel}>Season Points</Text>
          </View>
        </View>

        {/* Performance Chart Placeholder */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionLabel}>PERFORMANCE</Text>
          </View>
          <View style={styles.periodToggle}>
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setSelectedPeriod(p)}
                style={[styles.periodBtn, selectedPeriod === p && styles.periodBtnActive]}
              >
                <Text style={[styles.periodBtnText, selectedPeriod === p && styles.periodBtnTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartBarsRow}>
              {[65, 78, 45, 88, 72, 92, 80].map((val, i) => (
                <View key={i} style={styles.chartBarCol}>
                  <View style={[styles.chartBar, { height: (val / 100) * 100 }]} />
                </View>
              ))}
            </View>
            <Text style={styles.chartNote}>Performance Trend - {selectedPeriod}</Text>
          </View>
        </View>

        {/* Skill Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>SKILL BREAKDOWN</Text>
          {SKILLS.map((skill) => (
            <View key={skill.label} style={styles.skillRow}>
              <View style={styles.skillLabelRow}>
                <Text style={styles.skillLabel}>{skill.label}</Text>
                <Text style={styles.skillValue}>{skill.value}%</Text>
              </View>
              <View style={styles.skillBarBg}>
                <View
                  style={[
                    styles.skillBarFill,
                    {
                      width: `${skill.value}%`,
                      backgroundColor: skill.value >= 90 ? colors.lime : skill.value >= 80 ? colors.green : colors.blue,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Season Stats Sidebar */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>SEASON STATS</Text>
          <View style={styles.seasonGrid}>
            <View style={styles.seasonItem}>
              <Text style={styles.seasonValue}>48.5</Text>
              <Text style={styles.seasonLabel}>Batting Avg</Text>
            </View>
            <View style={styles.seasonItem}>
              <Text style={styles.seasonValue}>142.3</Text>
              <Text style={styles.seasonLabel}>Strike Rate</Text>
            </View>
            <View style={styles.seasonItem}>
              <Text style={styles.seasonValue}>24.8</Text>
              <Text style={styles.seasonLabel}>Bowling Avg</Text>
            </View>
            <View style={styles.seasonItem}>
              <Text style={styles.seasonValue}>7.2</Text>
              <Text style={styles.seasonLabel}>Economy</Text>
            </View>
          </View>
        </View>

        {/* Match History */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>MATCH HISTORY</Text>
          {MATCH_HISTORY.map((match) => (
            <View key={match.id} style={styles.matchRow}>
              <View
                style={[
                  styles.resultBadge,
                  { backgroundColor: match.result === "W" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)" },
                ]}
              >
                <Text
                  style={[
                    styles.resultText,
                    { color: match.result === "W" ? colors.green : colors.red },
                  ]}
                >
                  {match.result}
                </Text>
              </View>
              <View style={styles.matchInfo}>
                <Text style={styles.matchOpponent}>vs {match.opponent}</Text>
                <Text style={styles.matchScore}>{match.score}</Text>
              </View>
              <Text style={styles.matchDate}>{match.date}</Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={[styles.card, { marginBottom: 100 }]}>
          <Text style={styles.sectionLabel}>ACHIEVEMENTS</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((a) => (
              <View key={a.id} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <Text style={styles.achievementIconText}>{a.icon}</Text>
                </View>
                <Text style={styles.achievementTitle}>{a.title}</Text>
                <Text style={styles.achievementDesc}>{a.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.dark },
  container: { flex: 1, backgroundColor: colors.dark },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroTop: { flexDirection: "row", alignItems: "center" },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(200,255,0,0.15)",
    borderWidth: 2,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
  },
  avatarLargeText: { fontSize: fontSize.xl, fontWeight: "800", color: colors.lime },
  heroInfo: { flex: 1 },
  heroName: { fontSize: fontSize.lg, fontWeight: "800", color: colors.white, marginBottom: spacing.sm },
  heroBadgesRow: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  rankBadge: {
    backgroundColor: colors.lime,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  rankBadgeText: { fontSize: fontSize.xs, fontWeight: "800", color: colors.dark },
  ratingBadge: {
    backgroundColor: "rgba(74,124,255,0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  ratingBadgeLabel: { fontSize: 9, color: colors.blue },
  ratingBadgeValue: { fontSize: fontSize.xs, fontWeight: "800", color: colors.blue },
  winBadge: {
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  winBadgeLabel: { fontSize: 9, color: colors.green },
  winBadgeValue: { fontSize: fontSize.xs, fontWeight: "800", color: colors.green },
  statCardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
  },
  statCardValue: { fontSize: fontSize.xxl, fontWeight: "900", color: colors.white },
  statCardLabel: { fontSize: fontSize.xs, color: colors.textDim, marginTop: spacing.xs, textAlign: "center" },
  circularProgress: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 4,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  circularInner: { alignItems: "center", justifyContent: "center" },
  circularText: { fontSize: fontSize.sm, fontWeight: "800", color: colors.lime },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  periodToggle: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark,
    alignItems: "center",
  },
  periodBtnActive: { backgroundColor: colors.lime },
  periodBtnText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.textDim },
  periodBtnTextActive: { color: colors.dark },
  chartPlaceholder: { alignItems: "center" },
  chartBarsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
    width: "100%",
    marginBottom: spacing.md,
  },
  chartBarCol: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  chartBar: {
    width: "60%",
    backgroundColor: colors.lime,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    opacity: 0.7,
  },
  chartNote: { fontSize: fontSize.xs, color: colors.textMuted },
  skillRow: { marginBottom: spacing.md },
  skillLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  skillLabel: { fontSize: fontSize.sm, color: colors.text, fontWeight: "500" },
  skillValue: { fontSize: fontSize.sm, color: colors.lime, fontWeight: "700" },
  skillBarBg: {
    height: 8,
    backgroundColor: colors.dark,
    borderRadius: 4,
    overflow: "hidden",
  },
  skillBarFill: { height: "100%", borderRadius: 4 },
  seasonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  seasonItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  seasonValue: { fontSize: fontSize.lg, fontWeight: "900", color: colors.white },
  seasonLabel: { fontSize: fontSize.xs, color: colors.textDim, marginTop: spacing.xs },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  resultText: { fontSize: fontSize.sm, fontWeight: "800" },
  matchInfo: { flex: 1 },
  matchOpponent: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  matchScore: { fontSize: fontSize.xs, color: colors.textDim, marginTop: 2 },
  matchDate: { fontSize: fontSize.xs, color: colors.textMuted },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  achievementCard: {
    width: "48%",
    backgroundColor: colors.dark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: "center",
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(200,255,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  achievementIconText: { fontSize: fontSize.md, fontWeight: "800", color: colors.lime },
  achievementTitle: { fontSize: fontSize.xs, fontWeight: "700", color: colors.white, textAlign: "center" },
  achievementDesc: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: "center",
    lineHeight: 12,
  },
});
