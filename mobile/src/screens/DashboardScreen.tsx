import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";
import { matches as matchesAPI, tournaments as tournamentsAPI, players } from "../lib/api";

interface LiveMatch {
  id: string;
  sport: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status: string;
}

interface Tournament {
  id: string;
  name: string;
  sport: string;
  startDate: string;
  maxTeams: number;
  prizePool: number;
  status: string;
  _count?: { entries: number };
}

interface Player {
  id: string;
  displayName: string;
  rating: number;
  wins: number;
  team?: { name: string };
}

export default function DashboardScreen() {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([]);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [matchesRes, tournamentsRes, playersRes] = await Promise.all([
        matchesAPI.list({ status: "live" }).catch(() => ({ matches: [] })),
        tournamentsAPI.list().catch(() => ({ tournaments: [] })),
        players.list({ sort: "rating" } as any).catch(() => ({ players: [] })),
      ]);

      const allMatches = matchesRes.matches || [];
      setLiveMatches(
        allMatches
          .filter((m: any) => m.status === "live" || m.status === "in_progress")
          .slice(0, 5)
          .map((m: any) => ({
            id: m.id,
            sport: m.tournament?.sport || "Sport",
            team1: m.homeTeam?.name || "Team 1",
            team2: m.awayTeam?.name || "Team 2",
            score1: m.homeScore ?? 0,
            score2: m.awayScore ?? 0,
            status: m.status,
          }))
      );

      const allTournaments = tournamentsRes.tournaments || [];
      setUpcomingTournaments(
        allTournaments
          .filter((t: any) => t.status !== "completed")
          .slice(0, 5)
      );

      setLeaderboard((playersRes.players || []).slice(0, 5));
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.lime} />
        <Text style={{ color: colors.textDim, marginTop: 12 }}>Loading dashboard...</Text>
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
        <View style={styles.logoRow}>
          <Image
            source={{ uri: "https://res.cloudinary.com/ddlc9p24k/image/upload/f_auto,q_auto,w_200,h_200/versaplay/logo-icon" }}
            style={styles.logoImage}
          />
          <View>
            <Text style={styles.logoText}>Versa<Text style={styles.logoAccent}>Play</Text></Text>
          </View>
        </View>
        <Text style={styles.title}>Tournament Dashboard</Text>
        <Text style={styles.subtitle}>Live scores, upcoming events, and rankings</Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Live Matches */}
      <View style={styles.section}>
        <View style={styles.liveHeader}>
          <View style={styles.liveDot} />
          <Text style={styles.sectionTitle}>LIVE NOW</Text>
        </View>

        {liveMatches.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No live matches right now</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.liveScroll}>
            {liveMatches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <View style={styles.matchCardHeader}>
                  <Text style={styles.matchSport}>{match.sport}</Text>
                  <View style={styles.liveTag}>
                    <View style={[styles.liveDot, { marginRight: 4 }]} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>

                <View style={styles.matchTeams}>
                  <View style={styles.matchTeamRow}>
                    <View style={styles.teamBadge}>
                      <Text style={styles.teamInitial}>{match.team1.charAt(0)}</Text>
                    </View>
                    <Text style={styles.teamName}>{match.team1}</Text>
                    <Text style={styles.score}>{match.score1}</Text>
                  </View>
                  <View style={styles.matchTeamRow}>
                    <View style={[styles.teamBadge, { backgroundColor: "rgba(74,124,255,0.2)" }]}>
                      <Text style={[styles.teamInitial, { color: colors.blue }]}>{match.team2.charAt(0)}</Text>
                    </View>
                    <Text style={styles.teamName}>{match.team2}</Text>
                    <Text style={styles.score}>{match.score2}</Text>
                  </View>
                </View>

                <View style={styles.matchTimer}>
                  <Text style={styles.timerText}>In Progress</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Upcoming Tournaments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UPCOMING TOURNAMENTS</Text>
        {upcomingTournaments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming tournaments</Text>
          </View>
        ) : (
          upcomingTournaments.map((t) => (
            <View key={t.id} style={styles.tournamentCard}>
              <Text style={styles.tournamentName}>{t.name}</Text>
              <Text style={styles.tournamentMeta}>
                {t.sport} - {new Date(t.startDate).toLocaleDateString()} - {t._count?.entries || 0}/{t.maxTeams} teams
              </Text>
              <View style={styles.tournamentFooter}>
                <Text style={styles.prizeText}>
                  ${typeof t.prizePool === "number" ? t.prizePool.toLocaleString() : t.prizePool}
                </Text>
                <View style={[styles.statusBadge, t.status === "open" ? styles.statusOpen : styles.statusSoon]}>
                  <Text style={[styles.statusText, t.status === "open" ? styles.statusOpenText : styles.statusSoonText]}>
                    {t.status === "open" ? "OPEN" : (t.status || "").toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Leaderboard */}
      <View style={[styles.section, { paddingBottom: 100 }]}>
        <Text style={styles.sectionTitle}>TOP RANKINGS</Text>
        <View style={styles.leaderboard}>
          {leaderboard.length === 0 ? (
            <View style={{ padding: spacing.xl }}>
              <Text style={styles.emptyText}>No player data available</Text>
            </View>
          ) : (
            leaderboard.map((player, i) => (
              <View key={player.id} style={[styles.leaderRow, i < leaderboard.length - 1 && styles.leaderBorder]}>
                <View style={[styles.rankBadge, i < 3 && styles.rankBadgeTop]}>
                  <Text style={[styles.rankText, i < 3 && styles.rankTextTop]}>
                    {i + 1}
                  </Text>
                </View>
                <View style={styles.leaderInfo}>
                  <Text style={styles.leaderName}>{player.displayName}</Text>
                  <Text style={styles.leaderTeam}>{player.team?.name || "No team"}</Text>
                </View>
                <Text style={styles.leaderPoints}>{player.rating}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: spacing.lg },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: spacing.lg },
  logoImage: { width: 32, height: 32, borderRadius: 8 },
  logoText: { fontSize: fontSize.xl, fontWeight: "900", color: colors.white, fontStyle: "italic" },
  logoAccent: { color: colors.lime },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.white },
  subtitle: { fontSize: fontSize.sm, color: colors.textDim, marginTop: 4 },
  section: { paddingHorizontal: spacing.xl, marginBottom: spacing.xxl },
  liveHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.lg },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: "700", color: colors.white, letterSpacing: 1.5 },
  liveScroll: { gap: spacing.lg },
  matchCard: {
    width: 260,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  matchCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  matchSport: { fontSize: fontSize.xs, color: colors.textDim, textTransform: "uppercase" },
  liveTag: { flexDirection: "row", alignItems: "center" },
  liveText: { fontSize: 9, fontWeight: "700", color: colors.red, textTransform: "uppercase" },
  matchTeams: { gap: spacing.md },
  matchTeamRow: { flexDirection: "row", alignItems: "center" },
  teamBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(200,255,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  teamInitial: { fontSize: fontSize.xs, fontWeight: "700", color: colors.lime },
  teamName: { flex: 1, fontSize: fontSize.sm, fontWeight: "500", color: colors.white },
  score: { fontSize: fontSize.xl, fontWeight: "900", color: colors.white },
  matchTimer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center",
  },
  timerText: { fontSize: fontSize.sm, fontFamily: "monospace", color: colors.lime },
  tournamentCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginTop: spacing.md,
  },
  tournamentName: { fontSize: fontSize.sm, fontWeight: "700", color: colors.white },
  tournamentMeta: { fontSize: fontSize.xs, color: colors.textDim, marginTop: 4 },
  tournamentFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.md },
  prizeText: { fontSize: fontSize.sm, fontWeight: "700", color: colors.lime },
  statusBadge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.md },
  statusOpen: { backgroundColor: "rgba(34,197,94,0.1)" },
  statusSoon: { backgroundColor: "rgba(245,158,11,0.1)" },
  statusText: { fontSize: 9, fontWeight: "700" },
  statusOpenText: { color: colors.green },
  statusSoonText: { color: colors.orange },
  leaderboard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginTop: spacing.md,
  },
  leaderRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  leaderBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  rankBadgeTop: { backgroundColor: colors.lime },
  rankText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.textDim },
  rankTextTop: { color: colors.dark },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  leaderTeam: { fontSize: 9, color: colors.textMuted, marginTop: 2 },
  leaderPoints: { fontSize: fontSize.sm, fontWeight: "700", color: colors.white },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    marginTop: spacing.md,
  },
  emptyText: { fontSize: fontSize.sm, color: colors.textDim },
  errorBanner: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: { fontSize: fontSize.xs, color: colors.red, flex: 1 },
  retryText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.lime, marginLeft: spacing.md },
});
