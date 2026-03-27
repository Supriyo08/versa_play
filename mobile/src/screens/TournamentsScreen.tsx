import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";
import { tournaments as tournamentsAPI } from "../lib/api";

type FilterTab = "All" | "Open" | "Upcoming" | "Completed";

interface Tournament {
  id: string;
  name: string;
  sport: string;
  format: string;
  startDate: string;
  endDate: string;
  maxTeams: number;
  prizePool: number;
  status: string;
  _count?: { entries: number };
}

const filterTabs: FilterTab[] = ["All", "Open", "Upcoming", "Completed"];

export default function TournamentsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [registering, setRegistering] = useState<string | null>(null);

  const fetchTournaments = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (activeFilter !== "All") {
        params.status = activeFilter.toLowerCase();
      }
      const res = await tournamentsAPI.list(params as any);
      setTournaments(res.tournaments || []);
    } catch {
      // keep existing data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    setLoading(true);
    fetchTournaments();
  }, [fetchTournaments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTournaments();
  };

  const handleRegister = async (tournamentId: string) => {
    setRegistering(tournamentId);
    try {
      await tournamentsAPI.register(tournamentId, "");
      Alert.alert("Success", "Registered for tournament!");
      fetchTournaments();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to register");
    } finally {
      setRegistering(null);
    }
  };

  const formatDate = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
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
        <Text style={styles.title}>Tournaments</Text>
        <Text style={styles.subtitle}>Browse, register, and manage</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filterTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveFilter(tab)}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
          >
            <Text style={[styles.filterText, activeFilter === tab && styles.filterTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tournament Cards */}
      <View style={styles.cardList}>
        {tournaments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No tournaments found</Text>
          </View>
        ) : (
          tournaments.map((t) => {
            const registered = t._count?.entries || 0;
            const statusKey = (t.status || "").toLowerCase();
            return (
              <View key={t.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardMeta}>{t.sport} - {t.format}</Text>
                    <Text style={styles.cardName}>{t.name}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    statusKey === "open" ? styles.statusOpen :
                    statusKey === "upcoming" ? styles.statusUpcoming : styles.statusCompleted
                  ]}>
                    <Text style={[
                      styles.statusText,
                      statusKey === "open" ? { color: colors.green } :
                      statusKey === "upcoming" ? { color: colors.orange } : { color: colors.textMuted }
                    ]}>
                      {(t.status || "").toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardDate}>{formatDate(t.startDate, t.endDate)}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.cardStats}>
                    <View>
                      <Text style={styles.statNum}>{registered}/{t.maxTeams}</Text>
                      <Text style={styles.statLabel}>TEAMS</Text>
                    </View>
                    <View>
                      <Text style={[styles.statNum, { color: colors.lime }]}>
                        ${typeof t.prizePool === "number" ? t.prizePool.toLocaleString() : t.prizePool}
                      </Text>
                      <Text style={styles.statLabel}>PRIZE</Text>
                    </View>
                  </View>

                  {statusKey === "open" ? (
                    <TouchableOpacity
                      style={styles.registerBtn}
                      onPress={() => handleRegister(t.id)}
                      disabled={registering === t.id}
                    >
                      <Text style={styles.registerText}>
                        {registering === t.id ? "..." : "Register"}
                      </Text>
                    </TouchableOpacity>
                  ) : statusKey === "completed" ? (
                    <View style={styles.resultsBtn}>
                      <Text style={styles.resultsText}>Results</Text>
                    </View>
                  ) : (
                    <View style={styles.soonBtn}>
                      <Text style={styles.soonText}>Soon</Text>
                    </View>
                  )}
                </View>

                {/* Progress Bar */}
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${(registered / t.maxTeams) * 100}%` }]} />
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.white },
  subtitle: { fontSize: fontSize.sm, color: colors.textDim, marginTop: 4 },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.xs,
    backgroundColor: colors.card,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: borderRadius.md },
  filterTabActive: { backgroundColor: colors.lime },
  filterText: { fontSize: 9, fontWeight: "700", color: colors.textDim, textTransform: "uppercase" },
  filterTextActive: { color: colors.dark },
  cardList: { paddingHorizontal: spacing.xl, paddingBottom: 100, gap: spacing.lg },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: spacing.xl, paddingBottom: spacing.sm },
  cardMeta: { fontSize: 9, fontWeight: "700", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5 },
  cardName: { fontSize: fontSize.md, fontWeight: "700", color: colors.white, marginTop: 4 },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.md },
  statusOpen: { backgroundColor: "rgba(34,197,94,0.1)" },
  statusUpcoming: { backgroundColor: "rgba(245,158,11,0.1)" },
  statusCompleted: { backgroundColor: "rgba(82,82,91,0.1)" },
  statusText: { fontSize: 9, fontWeight: "700" },
  cardDate: { fontSize: fontSize.xs, color: colors.textDim, paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cardStats: { flexDirection: "row", gap: spacing.xxl },
  statNum: { fontSize: fontSize.md, fontWeight: "900", color: colors.white },
  statLabel: { fontSize: 9, color: colors.textMuted, marginTop: 2 },
  registerBtn: { backgroundColor: colors.lime, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.lg },
  registerText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.dark },
  resultsBtn: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.lg },
  resultsText: { fontSize: fontSize.xs, fontWeight: "500", color: colors.textDim },
  soonBtn: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.lg, opacity: 0.5 },
  soonText: { fontSize: fontSize.xs, fontWeight: "500", color: colors.textMuted },
  progressTrack: { height: 3, backgroundColor: colors.dark, marginHorizontal: spacing.xl, marginBottom: spacing.lg, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: colors.lime, borderRadius: 2 },
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
