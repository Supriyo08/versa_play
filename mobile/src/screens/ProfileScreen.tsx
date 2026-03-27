import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";
import { auth, players } from "../lib/api";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  player?: {
    id: string;
    displayName: string;
    rating: number;
    wins: number;
    losses: number;
    bio: string;
    position: string;
    speed: number;
    accuracy: number;
    agility: number;
    strength: number;
    endurance: number;
    team?: { name: string };
    achievements?: { id: string; title: string; type: string }[];
  };
}

interface RecentMatch {
  opponent: string;
  date: string;
  event: string;
  won: boolean;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const me = await auth.me();
      setProfile(me);

      if (me.player?.id) {
        const playerDetail = await players.get(me.player.id);
        if (playerDetail.recentResults) {
          setRecentMatches(
            playerDetail.recentResults.slice(0, 5).map((r: any) => ({
              opponent: r.awayTeam?.name || r.homeTeam?.name || "Unknown",
              date: new Date(r.completedAt || r.scheduledAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
              event: r.tournament?.name || "Match",
              won: r.winner === "home" || r.winner === "away",
            }))
          );
        }
      }
    } catch {
      // stay on existing state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.lime} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.textDim, fontSize: fontSize.md }}>Unable to load profile</Text>
        <TouchableOpacity onPress={fetchProfile} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.lime, fontWeight: "700" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const p = profile.player;
  const displayName = p?.displayName || profile.username || "Player";
  const wins = p?.wins || 0;
  const rating = p?.rating || 0;
  const teamName = p?.team?.name || "No Team";
  const bio = p?.bio || `${displayName} - ${profile.role}`;
  const totalMatches = wins + (p?.losses || 0);
  const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(0) : "0";

  const statBars = [
    { label: "Speed", value: p?.speed || 50 },
    { label: "Accuracy", value: p?.accuracy || 50 },
    { label: "Agility", value: p?.agility || 50 },
    { label: "Strength", value: p?.strength || 50 },
    { label: "Endurance", value: p?.endurance || 50 },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.lime} />}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{(profile.role || "player").toUpperCase()}</Text>
          </View>
          {rating >= 90 && (
            <View style={[styles.badge, styles.badgeLime]}>
              <Text style={[styles.badgeText, styles.badgeLimeText]}>ELITE</Text>
            </View>
          )}
        </View>

        <Text style={styles.playerName}>{displayName.toUpperCase()}</Text>
        <Text style={styles.playerDesc}>{bio}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{wins}</Text>
            <Text style={styles.statLabel}>WINS</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.white }]}>{rating}</Text>
            <Text style={styles.statLabel}>RATING</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Performance Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>PERFORMANCE RADAR</Text>
          <Text style={styles.cardTitle}>Physical Aptitude</Text>

          <View style={styles.statBars}>
            {statBars.map((stat) => (
              <View key={stat.label} style={styles.statBar}>
                <View style={styles.statBarHeader}>
                  <Text style={styles.statBarLabel}>{stat.label}</Text>
                  <Text style={styles.statBarValue}>{stat.value}</Text>
                </View>
                <View style={styles.statBarTrack}>
                  <View style={[styles.statBarFill, { width: `${stat.value}%` }]} />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.rankRow}>
            <View>
              <Text style={styles.rankLabel}>Win Rate</Text>
              <Text style={styles.rankValue}>{winRate}%</Text>
            </View>
            <View>
              <Text style={styles.rankLabel}>Total Matches</Text>
              <Text style={styles.rankValue}>{totalMatches}</Text>
            </View>
          </View>
        </View>

        {/* Recent Matches */}
        <View style={styles.card}>
          <Text style={[styles.cardLabel, { color: colors.blue }]}>RECENT MATCHES</Text>
          <Text style={styles.cardTitle}>Performance Log</Text>

          {recentMatches.length === 0 ? (
            <Text style={{ color: colors.textDim, fontSize: fontSize.xs }}>No recent matches</Text>
          ) : (
            recentMatches.map((match, i) => (
              <View key={i} style={styles.matchItem}>
                <View
                  style={[
                    styles.matchIcon,
                    { backgroundColor: match.won ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)" },
                  ]}
                >
                  <Text style={{ color: match.won ? colors.green : colors.red, fontWeight: "700" }}>
                    {match.won ? "W" : "L"}
                  </Text>
                </View>
                <View style={styles.matchInfo}>
                  <Text style={styles.matchOpponent}>Vs. {match.opponent}</Text>
                  <Text style={styles.matchMeta}>
                    {match.date} - {match.event}
                  </Text>
                </View>
                <View style={styles.matchXp}>
                  <Text style={styles.matchResult}>{match.won ? "WIN" : "LOSS"}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Achievements */}
        {p?.achievements && p.achievements.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>ACHIEVEMENTS</Text>
            <View style={styles.achievementsRow}>
              {p.achievements.slice(0, 4).map((a) => (
                <View key={a.id} style={[styles.achievementBadge, { backgroundColor: colors.blue }]}>
                  <Text style={styles.achievementIcon}>{a.title.charAt(0)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom Cards */}
        <View style={styles.bottomCard}>
          <Text style={styles.bottomCardTitle}>{teamName}</Text>
          <Text style={styles.bottomCardDesc}>Team Affiliation</Text>
        </View>

        <View style={styles.bottomCard}>
          <Text style={styles.bottomCardTitle}>{profile.email}</Text>
          <Text style={styles.bottomCardDesc}>Account Email</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.xxl,
    backgroundColor: "#0d1f3c",
  },
  badges: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  badge: {
    backgroundColor: "rgba(20,20,31,0.8)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  badgeLime: {
    backgroundColor: "rgba(200,255,0,0.2)",
    borderColor: "transparent",
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: "600", color: colors.white },
  badgeLimeText: { color: colors.lime },
  playerName: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.white,
    letterSpacing: 1,
  },
  playerDesc: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.xxxl,
    marginTop: spacing.xl,
  },
  stat: { alignItems: "center" },
  statValue: { fontSize: 28, fontWeight: "900", color: colors.lime },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textDim,
    letterSpacing: 1,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.lime,
    letterSpacing: 2,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.white,
    marginBottom: spacing.lg,
  },
  statBars: { gap: spacing.md },
  statBar: {},
  statBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  statBarLabel: { fontSize: fontSize.xs, color: colors.textDim },
  statBarValue: { fontSize: fontSize.xs, color: colors.white, fontWeight: "700" },
  statBarTrack: {
    height: 6,
    backgroundColor: colors.dark,
    borderRadius: 3,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    backgroundColor: colors.lime,
    borderRadius: 3,
  },
  rankRow: {
    flexDirection: "row",
    gap: spacing.xxl,
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rankLabel: { fontSize: fontSize.xs, color: colors.textDim },
  rankValue: { fontSize: fontSize.sm, fontWeight: "700", color: colors.white, marginTop: 2 },
  matchItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  matchIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  matchInfo: { flex: 1 },
  matchOpponent: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  matchMeta: { fontSize: 9, color: colors.textMuted, letterSpacing: 0.5, marginTop: 2 },
  matchXp: { alignItems: "flex-end" },
  matchResult: { fontSize: 9, color: colors.textMuted, marginTop: 2 },
  achievementsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  achievementBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementIcon: {
    fontSize: fontSize.md,
    fontWeight: "900",
    color: colors.white,
  },
  bottomCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  bottomCardTitle: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.white,
  },
  bottomCardDesc: {
    fontSize: fontSize.xs,
    color: colors.textDim,
    marginTop: 4,
  },
});
