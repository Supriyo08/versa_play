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

type TabKey = "Players" | "Clubs" | "Tournaments" | "Reports";

const KPI_DATA = [
  { label: "Total Players", value: "1,247", color: colors.lime },
  { label: "Teams", value: "86", color: colors.blue },
  { label: "Tournaments", value: "34", color: colors.purple },
  { label: "Matches", value: "892", color: colors.orange },
];

const PLAYERS_DATA = [
  { id: "1", name: "Virat Kohli", rating: 96, team: "Royal Strikers", status: "active" },
  { id: "2", name: "Steve Smith", rating: 91, team: "Thunder Kings", status: "active" },
  { id: "3", name: "Kane Williamson", rating: 89, team: "Phoenix XI", status: "inactive" },
  { id: "4", name: "Joe Root", rating: 88, team: "Galaxy Warriors", status: "active" },
  { id: "5", name: "Babar Azam", rating: 92, team: "Storm Riders", status: "active" },
];

const CLUBS_DATA = [
  { id: "1", name: "Royal Strikers FC", members: 32, verified: true, sport: "Cricket" },
  { id: "2", name: "Thunder Kings CC", members: 28, verified: true, sport: "Cricket" },
  { id: "3", name: "Phoenix XI Academy", members: 45, verified: false, sport: "Cricket" },
  { id: "4", name: "Galaxy Warriors", members: 22, verified: true, sport: "Soccer" },
  { id: "5", name: "Storm Riders United", members: 18, verified: false, sport: "Basketball" },
];

const TOURNAMENTS_DATA = [
  { id: "1", name: "Premier League 2025", status: "live", teams: 12, sport: "Cricket" },
  { id: "2", name: "Champions Cup", status: "upcoming", teams: 8, sport: "Cricket" },
  { id: "3", name: "Super Sixes Tournament", status: "completed", teams: 16, sport: "Cricket" },
  { id: "4", name: "City League Finals", status: "live", teams: 6, sport: "Soccer" },
  { id: "5", name: "All-Stars Invitational", status: "upcoming", teams: 10, sport: "Basketball" },
];

const REPORTS_DATA = [
  { label: "Total Records", value: "48,293" },
  { label: "Database Size", value: "2.4 GB" },
  { label: "Storage Used", value: "847 GB" },
  { label: "API Calls (24h)", value: "124,582" },
  { label: "Active Sessions", value: "1,847" },
  { label: "Error Rate", value: "0.02%" },
];

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("Players");
  const [searchQuery, setSearchQuery] = useState("");

  const TABS: TabKey[] = ["Players", "Clubs", "Tournaments", "Reports"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "live":
        return colors.green;
      case "inactive":
      case "completed":
        return colors.textMuted;
      case "upcoming":
        return colors.orange;
      default:
        return colors.textDim;
    }
  };

  const renderPlayersTab = () => (
    <View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search players..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {PLAYERS_DATA.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).map((player) => (
        <View key={player.id} style={styles.tableRow}>
          <View style={styles.playerAvatar}>
            <Text style={styles.playerAvatarText}>
              {player.name.split(" ").map((n) => n[0]).join("")}
            </Text>
          </View>
          <View style={styles.tableRowInfo}>
            <Text style={styles.tableRowName}>{player.name}</Text>
            <Text style={styles.tableRowSub}>{player.team}</Text>
          </View>
          <View style={styles.tableRowRight}>
            <Text style={styles.ratingText}>{player.rating}</Text>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(player.status) }]} />
            <Text style={[styles.statusLabel, { color: getStatusColor(player.status) }]}>
              {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderClubsTab = () => (
    <View>
      {CLUBS_DATA.map((club) => (
        <View key={club.id} style={styles.tableRow}>
          <View style={[styles.playerAvatar, { backgroundColor: "rgba(74,124,255,0.15)" }]}>
            <Text style={[styles.playerAvatarText, { color: colors.blue }]}>
              {club.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.tableRowInfo}>
            <View style={styles.clubNameRow}>
              <Text style={styles.tableRowName}>{club.name}</Text>
              {club.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>V</Text>
                </View>
              )}
            </View>
            <Text style={styles.tableRowSub}>{club.sport} | {club.members} members</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTournamentsTab = () => (
    <View>
      {TOURNAMENTS_DATA.map((t) => (
        <View key={t.id} style={styles.tableRow}>
          <View style={styles.tableRowInfo}>
            <Text style={styles.tableRowName}>{t.name}</Text>
            <Text style={styles.tableRowSub}>{t.sport} | {t.teams} teams</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(t.status) + "22" },
            ]}
          >
            <Text style={[styles.statusBadgeText, { color: getStatusColor(t.status) }]}>
              {t.status.toUpperCase()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderReportsTab = () => (
    <View>
      <Text style={styles.subSectionLabel}>Database Statistics</Text>
      <View style={styles.reportsGrid}>
        {REPORTS_DATA.map((r) => (
          <View key={r.label} style={styles.reportItem}>
            <Text style={styles.reportValue}>{r.value}</Text>
            <Text style={styles.reportLabel}>{r.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          </View>
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiRow}>
          {KPI_DATA.map((kpi) => (
            <View key={kpi.label} style={styles.kpiCard}>
              <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View style={[styles.tabContent, { marginBottom: 100 }]}>
          {activeTab === "Players" && renderPlayersTab()}
          {activeTab === "Clubs" && renderClubsTab()}
          {activeTab === "Tournaments" && renderTournamentsTab()}
          {activeTab === "Reports" && renderReportsTab()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.dark },
  container: { flex: 1, backgroundColor: colors.dark },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.white },
  adminBadge: {
    backgroundColor: "rgba(200,255,0,0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  adminBadgeText: { fontSize: 9, fontWeight: "800", color: colors.lime, letterSpacing: 1 },
  kpiRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  kpiCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
  },
  kpiValue: { fontSize: fontSize.xxl, fontWeight: "900" },
  kpiLabel: { fontSize: fontSize.xs, color: colors.textDim, marginTop: spacing.xs },
  tabsContainer: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  tabsRow: { gap: spacing.sm },
  tabBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  tabText: { fontSize: fontSize.sm, fontWeight: "700", color: colors.textDim },
  tabTextActive: { color: colors.dark },
  tabContent: { paddingHorizontal: spacing.xl },
  searchContainer: { marginBottom: spacing.lg },
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
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(200,255,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  playerAvatarText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.lime },
  tableRowInfo: { flex: 1 },
  tableRowName: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  tableRowSub: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  tableRowRight: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  ratingText: { fontSize: fontSize.sm, fontWeight: "700", color: colors.lime },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: fontSize.xs, fontWeight: "600" },
  clubNameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedText: { fontSize: 8, fontWeight: "800", color: colors.white },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  subSectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.lime,
    marginBottom: spacing.md,
  },
  reportsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  reportItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
  },
  reportValue: { fontSize: fontSize.lg, fontWeight: "900", color: colors.white },
  reportLabel: { fontSize: fontSize.xs, color: colors.textDim, marginTop: spacing.xs, textAlign: "center" },
});
