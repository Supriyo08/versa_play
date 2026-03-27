import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";
import { matches as matchesAPI, tournaments as tournamentsAPI } from "../lib/api";

interface Match {
  id: string;
  round: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  matchNumber: number;
}

interface LeagueEntry {
  team: string;
  pts: number;
  w: number;
}

export default function BracketsScreen() {
  const [format, setFormat] = useState<"knockout" | "league">("knockout");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagueStandings, setLeagueStandings] = useState<LeagueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await matchesAPI.list();
      const allMatches = (res.matches || []).map((m: any) => ({
        id: m.id,
        round: m.round || "R1",
        homeTeam: m.homeTeam || { name: "TBD" },
        awayTeam: m.awayTeam || { name: "TBD" },
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        status: m.status,
        matchNumber: m.matchNumber || 0,
      }));
      setMatches(allMatches);

      // Build league standings from completed matches
      const standings: Record<string, { pts: number; w: number }> = {};
      allMatches.forEach((m: Match) => {
        const home = m.homeTeam?.name;
        const away = m.awayTeam?.name;
        if (home && home !== "TBD") {
          if (!standings[home]) standings[home] = { pts: 0, w: 0 };
        }
        if (away && away !== "TBD") {
          if (!standings[away]) standings[away] = { pts: 0, w: 0 };
        }
        if (m.status === "completed" && m.homeScore !== null && m.awayScore !== null) {
          if (m.homeScore > m.awayScore) {
            if (standings[home]) { standings[home].pts += 3; standings[home].w += 1; }
          } else if (m.awayScore > m.homeScore) {
            if (standings[away]) { standings[away].pts += 3; standings[away].w += 1; }
          } else {
            if (standings[home]) standings[home].pts += 1;
            if (standings[away]) standings[away].pts += 1;
          }
        }
      });

      setLeagueStandings(
        Object.entries(standings)
          .map(([team, s]) => ({ team, pts: s.pts, w: s.w }))
          .sort((a, b) => b.pts - a.pts)
      );
    } catch {
      // keep existing
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Group matches by round
  const rounds = [...new Set(matches.map((m) => m.round))].sort();

  const getRoundLabel = (round: string) => {
    const r = round.toUpperCase();
    if (r === "QF" || r.includes("QUARTER")) return "QUARTER FINALS";
    if (r === "SF" || r.includes("SEMI")) return "SEMI FINALS";
    if (r === "F" || r.includes("FINAL")) return "FINAL";
    return r;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.lime} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.lime} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Brackets</Text>
        <View style={styles.formatRow}>
          <TouchableOpacity
            onPress={() => setFormat("knockout")}
            style={[styles.formatBtn, format === "knockout" && styles.formatBtnActive]}
          >
            <Text style={[styles.formatText, format === "knockout" && styles.formatTextActive]}>Knockout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFormat("league")}
            style={[styles.formatBtn, format === "league" && styles.formatBtnActive]}
          >
            <Text style={[styles.formatText, format === "league" && styles.formatTextActive]}>League</Text>
          </TouchableOpacity>
        </View>
      </View>

      {format === "knockout" ? (
        <View style={styles.matchList}>
          {matches.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No matches available</Text>
            </View>
          ) : (
            rounds.map((round) => (
              <View key={round} style={styles.roundSection}>
                <Text style={styles.roundTitle}>{getRoundLabel(round)}</Text>
                {matches.filter((m) => m.round === round).map((m) => {
                  const winner = m.status === "completed" && m.homeScore !== null && m.awayScore !== null
                    ? (m.homeScore > m.awayScore ? 1 : m.awayScore > m.homeScore ? 2 : 0)
                    : null;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => setSelectedMatch(selectedMatch === m.id ? null : m.id)}
                      style={[styles.matchCard, selectedMatch === m.id && styles.matchCardSelected]}
                    >
                      <View style={styles.matchHeader}>
                        <Text style={styles.matchNum}>Match {m.matchNumber}</Text>
                        <Text style={[styles.matchStatus, { color: m.status === "completed" ? colors.green : m.status === "live" ? colors.red : colors.textMuted }]}>
                          {(m.status || "").toUpperCase()}
                        </Text>
                      </View>
                      <View style={[styles.teamRow, winner === 1 && styles.winnerRow]}>
                        <View style={[styles.teamDot, { backgroundColor: "rgba(200,255,0,0.2)" }]}>
                          <Text style={{ fontSize: 9, fontWeight: "700", color: colors.lime }}>{m.homeTeam?.name?.charAt(0) || "?"}</Text>
                        </View>
                        <Text style={[styles.matchTeam, winner === 1 && { color: colors.white }]}>{m.homeTeam?.name || "TBD"}</Text>
                        <Text style={[styles.matchScore, winner === 1 && { color: colors.lime }]}>{m.homeScore ?? "-"}</Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={[styles.teamRow, winner === 2 && styles.winnerRow]}>
                        <View style={[styles.teamDot, { backgroundColor: "rgba(74,124,255,0.2)" }]}>
                          <Text style={{ fontSize: 9, fontWeight: "700", color: colors.blue }}>{m.awayTeam?.name?.charAt(0) || "?"}</Text>
                        </View>
                        <Text style={[styles.matchTeam, winner === 2 && { color: colors.white }]}>{m.awayTeam?.name || "TBD"}</Text>
                        <Text style={[styles.matchScore, winner === 2 && { color: colors.lime }]}>{m.awayScore ?? "-"}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}
        </View>
      ) : (
        <View style={styles.matchList}>
          <Text style={styles.roundTitle}>LEAGUE STANDINGS</Text>
          {leagueStandings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No standings data available</Text>
            </View>
          ) : (
            leagueStandings.map((t, i) => (
              <View key={t.team} style={styles.leagueRow}>
                <View style={[styles.rankBadge, i < 3 && { backgroundColor: colors.lime }]}>
                  <Text style={[styles.rankText, i < 3 && { color: colors.dark }]}>{i + 1}</Text>
                </View>
                <Text style={styles.leagueTeam}>{t.team}</Text>
                <Text style={styles.leagueWins}>{t.w}W</Text>
                <Text style={styles.leaguePts}>{t.pts}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.white },
  formatRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
  formatBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  formatBtnActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  formatText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.textDim },
  formatTextActive: { color: colors.dark },
  matchList: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  roundSection: { marginBottom: spacing.xxl },
  roundTitle: { fontSize: 9, fontWeight: "700", color: colors.textDim, letterSpacing: 1.5, marginBottom: spacing.md },
  matchCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.md, overflow: "hidden",
  },
  matchCardSelected: { borderColor: colors.lime },
  matchHeader: {
    flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm, backgroundColor: "rgba(10,10,15,0.5)", borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  matchNum: { fontSize: 9, color: colors.textMuted, fontWeight: "500" },
  matchStatus: { fontSize: 9, fontWeight: "700" },
  teamRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  winnerRow: { backgroundColor: "rgba(200,255,0,0.03)" },
  teamDot: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", marginRight: spacing.sm },
  matchTeam: { flex: 1, fontSize: fontSize.xs, fontWeight: "500", color: colors.textDim },
  matchScore: { fontSize: fontSize.sm, fontWeight: "700", color: colors.textDim },
  divider: { height: 1, backgroundColor: colors.border },
  leagueRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.card,
    borderRadius: borderRadius.md, padding: spacing.lg, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  rankBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.dark, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  rankText: { fontSize: 10, fontWeight: "700", color: colors.textDim },
  leagueTeam: { flex: 1, fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  leagueWins: { fontSize: fontSize.xs, color: colors.green, fontWeight: "700", marginRight: spacing.lg },
  leaguePts: { fontSize: fontSize.sm, fontWeight: "900", color: colors.white },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyText: { fontSize: fontSize.sm, color: colors.textDim },
});
