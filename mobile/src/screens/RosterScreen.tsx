import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";

type SportFilter = "All" | "Cricket" | "Soccer" | "Basketball";
type StatusFilter = "Active" | "Inactive";

interface Player {
  id: string;
  name: string;
  initials: string;
  rating: number;
  sport: string;
  team: string;
  wins: number;
  losses: number;
  status: "active" | "inactive";
  verified: boolean;
}

const PLAYERS: Player[] = [
  { id: "1", name: "Virat Kohli", initials: "VK", rating: 96, sport: "Cricket", team: "Royal Strikers", wins: 142, losses: 48, status: "active", verified: true },
  { id: "2", name: "Steve Smith", initials: "SS", rating: 91, sport: "Cricket", team: "Thunder Kings", wins: 128, losses: 56, status: "active", verified: true },
  { id: "3", name: "Lionel Torres", initials: "LT", rating: 88, sport: "Soccer", team: "Galaxy Warriors", wins: 98, losses: 34, status: "active", verified: false },
  { id: "4", name: "Kane Williamson", initials: "KW", rating: 89, sport: "Cricket", team: "Phoenix XI", wins: 116, losses: 52, status: "inactive", verified: true },
  { id: "5", name: "Marcus Rashford", initials: "MR", rating: 85, sport: "Soccer", team: "Storm United", wins: 87, losses: 41, status: "active", verified: false },
  { id: "6", name: "LeBron Adams", initials: "LA", rating: 93, sport: "Basketball", team: "City Ballers", wins: 156, losses: 38, status: "active", verified: true },
  { id: "7", name: "Babar Azam", initials: "BA", rating: 92, sport: "Cricket", team: "Star XI", wins: 132, losses: 44, status: "active", verified: true },
  { id: "8", name: "David Warner", initials: "DW", rating: 87, sport: "Cricket", team: "Thunder Kings", wins: 108, losses: 62, status: "inactive", verified: false },
];

const SPORT_FILTERS: SportFilter[] = ["All", "Cricket", "Soccer", "Basketball"];

export default function RosterScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<SportFilter>("All");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPlayers = PLAYERS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === "All" || p.sport === selectedSport;
    const matchesStatus = !selectedStatus || p.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesSport && matchesStatus;
  });

  const totalActive = PLAYERS.filter((p) => p.status === "active").length;
  const totalInactive = PLAYERS.filter((p) => p.status === "inactive").length;
  const totalVerified = PLAYERS.filter((p) => p.verified).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>PLAYER MANAGEMENT</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{PLAYERS.length}</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statChipValue}>142</Text>
            <Text style={styles.statChipLabel}>Total</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={[styles.statChipValue, { color: colors.green }]}>118</Text>
            <Text style={styles.statChipLabel}>Active</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={[styles.statChipValue, { color: colors.red }]}>09</Text>
            <Text style={styles.statChipLabel}>Inactive</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={[styles.statChipValue, { color: colors.blue }]}>15</Text>
            <Text style={styles.statChipLabel}>Verified</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
            {SPORT_FILTERS.map((sport) => (
              <TouchableOpacity
                key={sport}
                onPress={() => setSelectedSport(sport)}
                style={[styles.filterChip, selectedSport === sport && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, selectedSport === sport && styles.filterChipTextActive]}>
                  {sport}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.filterDivider} />
            {(["Active", "Inactive"] as StatusFilter[]).map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() =>
                  setSelectedStatus(selectedStatus === status ? null : status)
                }
                style={[
                  styles.filterChip,
                  selectedStatus === status && styles.filterChipActive,
                ]}
              >
                <View
                  style={[
                    styles.filterDot,
                    {
                      backgroundColor:
                        status === "Active" ? colors.green : colors.red,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    selectedStatus === status && styles.filterChipTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Player List */}
        <View style={styles.playerList}>
          {filteredPlayers.map((player) => (
            <View key={player.id} style={styles.playerCard}>
              <View style={styles.playerRow}>
                <View style={styles.playerAvatar}>
                  <Text style={styles.playerAvatarText}>{player.initials}</Text>
                </View>
                <View style={styles.playerInfo}>
                  <View style={styles.playerNameRow}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {player.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>V</Text>
                      </View>
                    )}
                    <View
                      style={[
                        styles.statusDotSmall,
                        {
                          backgroundColor:
                            player.status === "active"
                              ? colors.green
                              : colors.red,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.playerMeta}>
                    {player.sport} | {player.team}
                  </Text>
                  <View style={styles.playerStatsRow}>
                    <Text style={styles.playerStatGreen}>W: {player.wins}</Text>
                    <Text style={styles.playerStatRed}>L: {player.losses}</Text>
                  </View>
                </View>
                <View style={styles.playerRating}>
                  <Text style={styles.playerRatingValue}>{player.rating}</Text>
                  <Text style={styles.playerRatingLabel}>RTG</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Pagination */}
        <View style={styles.paginationRow}>
          <TouchableOpacity
            style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <Text style={styles.pageBtnText}>Prev</Text>
          </TouchableOpacity>
          {[1, 2, 3].map((page) => (
            <TouchableOpacity
              key={page}
              onPress={() => setCurrentPage(page)}
              style={[styles.pageNum, currentPage === page && styles.pageNumActive]}
            >
              <Text
                style={[
                  styles.pageNumText,
                  currentPage === page && styles.pageNumTextActive,
                ]}
              >
                {page}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.pageBtn}
            onPress={() => setCurrentPage(Math.min(3, currentPage + 1))}
          >
            <Text style={styles.pageBtnText}>Next</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.dark },
  container: { flex: 1, backgroundColor: colors.dark },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  headerRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.white, letterSpacing: 1 },
  countBadge: {
    backgroundColor: colors.lime,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: { fontSize: fontSize.xs, fontWeight: "800", color: colors.dark },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  statChip: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: "center",
  },
  statChipValue: { fontSize: fontSize.md, fontWeight: "900", color: colors.white },
  statChipLabel: { fontSize: 9, color: colors.textDim, marginTop: 2 },
  searchContainer: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  searchInput: {
    height: 44,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    color: colors.white,
    fontSize: fontSize.sm,
  },
  filtersContainer: { marginBottom: spacing.lg },
  filtersRow: { paddingHorizontal: spacing.xl, gap: spacing.sm, alignItems: "center" },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  filterChipText: { fontSize: fontSize.xs, fontWeight: "600", color: colors.textDim },
  filterChipTextActive: { color: colors.dark },
  filterDivider: { width: 1, height: 20, backgroundColor: colors.border, marginHorizontal: spacing.xs },
  filterDot: { width: 8, height: 8, borderRadius: 4 },
  playerList: { paddingHorizontal: spacing.xl },
  playerCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  playerRow: { flexDirection: "row", alignItems: "center" },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(200,255,0,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  playerAvatarText: { fontSize: fontSize.sm, fontWeight: "700", color: colors.lime },
  playerInfo: { flex: 1 },
  playerNameRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  playerName: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedText: { fontSize: 7, fontWeight: "800", color: colors.white },
  statusDotSmall: { width: 7, height: 7, borderRadius: 4 },
  playerMeta: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  playerStatsRow: { flexDirection: "row", gap: spacing.md, marginTop: 4 },
  playerStatGreen: { fontSize: fontSize.xs, fontWeight: "600", color: colors.green },
  playerStatRed: { fontSize: fontSize.xs, fontWeight: "600", color: colors.red },
  playerRating: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(200,255,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  playerRatingValue: { fontSize: fontSize.md, fontWeight: "900", color: colors.lime },
  playerRatingLabel: { fontSize: 7, color: colors.textDim },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  pageBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { fontSize: fontSize.xs, fontWeight: "600", color: colors.textDim },
  pageNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  pageNumText: { fontSize: fontSize.sm, fontWeight: "700", color: colors.textDim },
  pageNumTextActive: { color: colors.dark },
});
