import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";

interface NavItem {
  label: string;
  screen: string;
  icon: string;
  color: string;
  desc: string;
}

const FEATURES: NavItem[] = [
  { label: "Community", screen: "Community", icon: "C", color: colors.green, desc: "Feed, posts & discussions" },
  { label: "Series", screen: "Series", icon: "S", color: colors.blue, desc: "T20 Champions Cup overview" },
  { label: "Live Scoring", screen: "LiveScoring", icon: "L", color: colors.red, desc: "Ball-by-ball cricket scoring" },
  { label: "Live Stream", screen: "Livestream", icon: "TV", color: colors.purple, desc: "Watch live matches" },
  { label: "Player Stats", screen: "PlayerStats", icon: "P", color: colors.orange, desc: "Detailed player analytics" },
  { label: "Brackets", screen: "Brackets", icon: "B", color: colors.lime, desc: "Tournament bracket view" },
  { label: "Analytics", screen: "Analytics", icon: "A", color: colors.blue, desc: "Rankings & performance" },
  { label: "Subscription", screen: "Subscription", icon: "$", color: colors.lime, desc: "Upgrade your plan" },
];

const ADMIN_FEATURES: NavItem[] = [
  { label: "Admin Dashboard", screen: "Admin", icon: "AD", color: colors.red, desc: "KPIs, players & reports" },
  { label: "Add Player", screen: "AddPlayer", icon: "+", color: colors.lime, desc: "Create new player profile" },
  { label: "Roster", screen: "Roster", icon: "R", color: colors.blue, desc: "Manage player roster" },
  { label: "Match Setup", screen: "MatchSetup", icon: "M", color: colors.orange, desc: "Configure new matches" },
  { label: "Officials", screen: "Officials", icon: "O", color: colors.purple, desc: "Assign umpires & refs" },
  { label: "Superadmin", screen: "Superadmin", icon: "SA", color: colors.red, desc: "Platform pulse & controls" },
];

export default function MoreScreen({ navigation }: { navigation: any }) {
  const renderItem = (item: NavItem) => (
    <TouchableOpacity
      key={item.screen}
      style={styles.menuItem}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: item.color + "1A" }]}>
        <Text style={[styles.menuIconText, { color: item.color }]}>{item.icon}</Text>
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuLabel}>{item.label}</Text>
        <Text style={styles.menuDesc}>{item.desc}</Text>
      </View>
      <Text style={styles.chevron}>&rsaquo;</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>VERSAPLAY</Text>
          <Text style={styles.headerTitle}>All Features</Text>
          <Text style={styles.headerDesc}>Access every section of the platform</Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FEATURES</Text>
          <View style={styles.card}>
            {FEATURES.map(renderItem)}
          </View>
        </View>

        {/* Admin Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>ADMIN & MANAGEMENT</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          </View>
          <View style={styles.card}>
            {ADMIN_FEATURES.map(renderItem)}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate("LiveScoring")}
            >
              <View style={[styles.quickIcon, { backgroundColor: colors.red + "1A" }]}>
                <Text style={[styles.quickIconText, { color: colors.red }]}>LIVE</Text>
              </View>
              <Text style={styles.quickLabel}>Score a Match</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate("Community")}
            >
              <View style={[styles.quickIcon, { backgroundColor: colors.green + "1A" }]}>
                <Text style={[styles.quickIconText, { color: colors.green }]}>+</Text>
              </View>
              <Text style={styles.quickLabel}>New Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate("Subscription")}
            >
              <View style={[styles.quickIcon, { backgroundColor: colors.lime + "1A" }]}>
                <Text style={[styles.quickIconText, { color: colors.lime }]}>PRO</Text>
              </View>
              <Text style={styles.quickLabel}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerLabel: {
    fontSize: fontSize.xs,
    fontWeight: "800",
    color: colors.lime,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: "900",
    color: colors.white,
  },
  headerDesc: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  adminBadge: {
    backgroundColor: "rgba(239,68,68,0.15)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  adminBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: colors.red,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconText: {
    fontSize: fontSize.sm,
    fontWeight: "900",
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.white,
  },
  menuDesc: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: fontSize.xl,
    color: colors.textMuted,
    fontWeight: "300",
  },
  quickRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  quickIconText: {
    fontSize: fontSize.xs,
    fontWeight: "900",
  },
  quickLabel: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textDim,
    textAlign: "center",
  },
});
