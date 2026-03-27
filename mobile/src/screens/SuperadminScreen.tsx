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

type TabKey = "Overview" | "Config" | "Monetization" | "Media";

interface HealthMetric {
  label: string;
  value: number;
  color: string;
}

const SYSTEM_METRICS = [
  { label: "Uptime", value: "99.97%", color: colors.green },
  { label: "Active Users", value: "12,847", color: colors.lime },
  { label: "API Calls", value: "2.4M", color: colors.blue },
  { label: "Storage", value: "847GB", color: colors.purple },
];

const SYSTEM_HEALTH: HealthMetric[] = [
  { label: "Web Servers", value: 34, color: colors.green },
  { label: "Database", value: 52, color: colors.orange },
  { label: "CDN", value: 28, color: colors.green },
  { label: "WebSocket", value: 78, color: colors.red },
  { label: "Background Jobs", value: 41, color: colors.orange },
];

const USER_ACTIVITY = [
  { period: "Today", signups: 142, active: 8420, churn: 12 },
  { period: "This Week", signups: 847, active: 12847, churn: 68 },
  { period: "This Month", signups: 3240, active: 18420, churn: 224 },
];

const SUBSCRIPTION_TIERS = [
  { name: "Free", users: 8420, revenue: "$0", color: colors.textDim },
  { name: "Pro", users: 3180, revenue: "$158,900", color: colors.lime },
  { name: "Club", users: 842, revenue: "$84,200", color: colors.blue },
  { name: "Enterprise", users: 405, revenue: "$1,239,800", color: colors.purple },
];

const PAYMENT_GATEWAYS = [
  { name: "Stripe", status: "active", volume: "$892K" },
  { name: "PayPal", status: "active", volume: "$342K" },
  { name: "Apple Pay", status: "active", volume: "$186K" },
  { name: "Google Pay", status: "pending", volume: "$62K" },
];

const STREAM_QUALITIES = ["480p", "720p", "1080p", "4K"];

export default function SuperadminScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("Overview");
  const [globalToggles, setGlobalToggles] = useState({
    maintenance: false,
    registrations: true,
    tournamentCreation: true,
    liveScoring: true,
    analytics: true,
  });
  const [notifToggles, setNotifToggles] = useState({
    email: true,
    push: true,
    sms: false,
    inApp: true,
  });
  const [securityToggles, setSecurityToggles] = useState({
    twoFactor: true,
    ipWhitelist: false,
    rateLimit: true,
    auditLog: true,
  });
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [mediaToggles, setMediaToggles] = useState({
    cdn: true,
    autoRecord: true,
    payPerView: false,
    ads: true,
    donations: true,
  });

  const TABS: TabKey[] = ["Overview", "Config", "Monetization", "Media"];

  const toggleGlobal = (key: keyof typeof globalToggles) => {
    setGlobalToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNotif = (key: keyof typeof notifToggles) => {
    setNotifToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSecurity = (key: keyof typeof securityToggles) => {
    setSecurityToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMedia = (key: keyof typeof mediaToggles) => {
    setMediaToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToggle = (value: boolean, onPress: () => void) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.toggle, value && styles.toggleActive]}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <View>
      {/* System Metrics */}
      <Text style={styles.subLabel}>System Metrics</Text>
      <View style={styles.metricsGrid}>
        {SYSTEM_METRICS.map((m) => (
          <View key={m.label} style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      {/* System Health */}
      <Text style={styles.subLabel}>System Health</Text>
      <View style={styles.healthCard}>
        {SYSTEM_HEALTH.map((h) => (
          <View key={h.label} style={styles.healthRow}>
            <Text style={styles.healthLabel}>{h.label}</Text>
            <View style={styles.healthBarBg}>
              <View
                style={[
                  styles.healthBarFill,
                  {
                    width: `${h.value}%`,
                    backgroundColor: h.value > 70 ? colors.red : h.value > 40 ? colors.orange : colors.green,
                  },
                ]}
              />
            </View>
            <Text style={[styles.healthValue, { color: h.value > 70 ? colors.red : h.value > 40 ? colors.orange : colors.green }]}>
              {h.value}%
            </Text>
          </View>
        ))}
      </View>

      {/* User Activity Table */}
      <Text style={styles.subLabel}>User Activity</Text>
      <View style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Period</Text>
          <Text style={styles.tableHeaderCell}>Signups</Text>
          <Text style={styles.tableHeaderCell}>Active</Text>
          <Text style={styles.tableHeaderCell}>Churn</Text>
        </View>
        {USER_ACTIVITY.map((row) => (
          <View key={row.period} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.2, color: colors.white }]}>{row.period}</Text>
            <Text style={[styles.tableCell, { color: colors.green }]}>{row.signups.toLocaleString()}</Text>
            <Text style={[styles.tableCell, { color: colors.lime }]}>{row.active.toLocaleString()}</Text>
            <Text style={[styles.tableCell, { color: colors.red }]}>{row.churn}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderConfig = () => (
    <View>
      {/* Global Settings */}
      <Text style={styles.subLabel}>Global Settings</Text>
      <View style={styles.configCard}>
        {[
          { key: "maintenance" as const, label: "Maintenance Mode" },
          { key: "registrations" as const, label: "Registrations" },
          { key: "tournamentCreation" as const, label: "Tournament Creation" },
          { key: "liveScoring" as const, label: "Live Scoring" },
          { key: "analytics" as const, label: "Analytics" },
        ].map((item) => (
          <View key={item.key} style={styles.configRow}>
            <Text style={styles.configLabel}>{item.label}</Text>
            {renderToggle(globalToggles[item.key], () => toggleGlobal(item.key))}
          </View>
        ))}
      </View>

      {/* Notification Settings */}
      <Text style={styles.subLabel}>Notifications</Text>
      <View style={styles.configCard}>
        {[
          { key: "email" as const, label: "Email Notifications" },
          { key: "push" as const, label: "Push Notifications" },
          { key: "sms" as const, label: "SMS Notifications" },
          { key: "inApp" as const, label: "In-App Notifications" },
        ].map((item) => (
          <View key={item.key} style={styles.configRow}>
            <Text style={styles.configLabel}>{item.label}</Text>
            {renderToggle(notifToggles[item.key], () => toggleNotif(item.key))}
          </View>
        ))}
      </View>

      {/* Security Protocols */}
      <Text style={styles.subLabel}>Security Protocols</Text>
      <View style={styles.configCard}>
        {[
          { key: "twoFactor" as const, label: "Two-Factor Auth" },
          { key: "ipWhitelist" as const, label: "IP Whitelist" },
          { key: "rateLimit" as const, label: "Rate Limiting" },
          { key: "auditLog" as const, label: "Audit Logging" },
        ].map((item) => (
          <View key={item.key} style={styles.configRow}>
            <Text style={styles.configLabel}>{item.label}</Text>
            {renderToggle(securityToggles[item.key], () => toggleSecurity(item.key))}
          </View>
        ))}
      </View>
    </View>
  );

  const renderMonetization = () => (
    <View>
      {/* Subscription Tiers */}
      <Text style={styles.subLabel}>Subscription Tiers</Text>
      {SUBSCRIPTION_TIERS.map((tier) => (
        <View key={tier.name} style={styles.tierCard}>
          <View style={styles.tierTop}>
            <View style={[styles.tierDot, { backgroundColor: tier.color }]} />
            <Text style={styles.tierName}>{tier.name}</Text>
          </View>
          <View style={styles.tierStatsRow}>
            <View style={styles.tierStat}>
              <Text style={styles.tierStatValue}>{tier.users.toLocaleString()}</Text>
              <Text style={styles.tierStatLabel}>Users</Text>
            </View>
            <View style={styles.tierStat}>
              <Text style={[styles.tierStatValue, { color: colors.lime }]}>{tier.revenue}</Text>
              <Text style={styles.tierStatLabel}>Revenue</Text>
            </View>
          </View>
        </View>
      ))}

      {/* Payment Gateways */}
      <Text style={styles.subLabel}>Payment Gateways</Text>
      {PAYMENT_GATEWAYS.map((gw) => (
        <View key={gw.name} style={styles.gatewayRow}>
          <View style={styles.gatewayIcon}>
            <Text style={styles.gatewayIconText}>{gw.name.charAt(0)}</Text>
          </View>
          <View style={styles.gatewayInfo}>
            <Text style={styles.gatewayName}>{gw.name}</Text>
            <Text style={styles.gatewayVolume}>Volume: {gw.volume}</Text>
          </View>
          <View
            style={[
              styles.gatewayStatus,
              {
                backgroundColor:
                  gw.status === "active" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
              },
            ]}
          >
            <Text
              style={[
                styles.gatewayStatusText,
                { color: gw.status === "active" ? colors.green : colors.orange },
              ]}
            >
              {gw.status.toUpperCase()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderMedia = () => (
    <View>
      {/* RTMP Endpoint */}
      <Text style={styles.subLabel}>Stream Configuration</Text>
      <View style={styles.configCard}>
        <View style={styles.fieldGroup}>
          <Text style={styles.configLabel}>RTMP Endpoint</Text>
          <View style={styles.rtmpBox}>
            <Text style={styles.rtmpText} numberOfLines={1}>
              rtmp://stream.versaplay.io/live
            </Text>
          </View>
        </View>

        {/* Stream Quality */}
        <View style={styles.fieldGroup}>
          <Text style={styles.configLabel}>Stream Quality</Text>
          <View style={styles.qualityRow}>
            {STREAM_QUALITIES.map((q) => (
              <TouchableOpacity
                key={q}
                onPress={() => setSelectedQuality(q)}
                style={[styles.qualityBtn, selectedQuality === q && styles.qualityBtnActive]}
              >
                <Text style={[styles.qualityBtnText, selectedQuality === q && styles.qualityBtnTextActive]}>
                  {q}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CDN & Auto-record */}
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>CDN Enabled</Text>
          {renderToggle(mediaToggles.cdn, () => toggleMedia("cdn"))}
        </View>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Auto-Record</Text>
          {renderToggle(mediaToggles.autoRecord, () => toggleMedia("autoRecord"))}
        </View>
      </View>

      {/* Monetization Toggles */}
      <Text style={styles.subLabel}>Stream Monetization</Text>
      <View style={styles.configCard}>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Pay-per-view</Text>
          {renderToggle(mediaToggles.payPerView, () => toggleMedia("payPerView"))}
        </View>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Ads</Text>
          {renderToggle(mediaToggles.ads, () => toggleMedia("ads"))}
        </View>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Donations</Text>
          {renderToggle(mediaToggles.donations, () => toggleMedia("donations"))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Platform Pulse</Text>
            <View style={styles.superBadge}>
              <Text style={styles.superBadgeText}>SUPERADMIN</Text>
            </View>
          </View>

          {/* Revenue Stats */}
          <View style={styles.revenueRow}>
            <View style={styles.revenueStat}>
              <Text style={styles.revenueValue}>$1,482,900</Text>
              <View style={styles.revenueChangeRow}>
                <Text style={styles.revenueLabel}>Revenue</Text>
                <View style={styles.changeBadge}>
                  <Text style={styles.changeText}>+18.2%</Text>
                </View>
              </View>
            </View>
            <View style={styles.revenueStat}>
              <Text style={styles.revenueMrrValue}>842</Text>
              <Text style={styles.revenueLabel}>MRR Subs</Text>
            </View>
            <View style={styles.revenueStat}>
              <Text style={styles.revenueHealthValue}>41.1%</Text>
              <Text style={styles.revenueLabel}>Health</Text>
            </View>
          </View>
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
          {activeTab === "Overview" && renderOverview()}
          {activeTab === "Config" && renderConfig()}
          {activeTab === "Monetization" && renderMonetization()}
          {activeTab === "Media" && renderMedia()}
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
  superBadge: {
    backgroundColor: "rgba(239,68,68,0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
  },
  superBadgeText: { fontSize: 9, fontWeight: "800", color: colors.red, letterSpacing: 1 },
  revenueRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  revenueStat: { flex: 1 },
  revenueValue: { fontSize: fontSize.lg, fontWeight: "900", color: colors.lime },
  revenueMrrValue: { fontSize: fontSize.lg, fontWeight: "900", color: colors.blue },
  revenueHealthValue: { fontSize: fontSize.lg, fontWeight: "900", color: colors.orange },
  revenueChangeRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: 2 },
  revenueLabel: { fontSize: fontSize.xs, color: colors.textDim, marginTop: 2 },
  changeBadge: {
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
  },
  changeText: { fontSize: 9, fontWeight: "700", color: colors.green },
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
  subLabel: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.lime,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
  },
  metricValue: { fontSize: fontSize.xl, fontWeight: "900" },
  metricLabel: { fontSize: fontSize.xs, color: colors.textDim, marginTop: spacing.xs },
  healthCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  healthLabel: { fontSize: fontSize.xs, color: colors.text, width: 100 },
  healthBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.dark,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: spacing.sm,
  },
  healthBarFill: { height: "100%", borderRadius: 4 },
  healthValue: { fontSize: fontSize.xs, fontWeight: "700", width: 38, textAlign: "right" },
  tableCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.dark,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  tableHeaderCell: { flex: 1, fontSize: 9, fontWeight: "700", color: colors.textDim, letterSpacing: 0.5 },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableCell: { flex: 1, fontSize: fontSize.xs, fontWeight: "600" },
  configCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  configRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  configLabel: { fontSize: fontSize.sm, color: colors.text, fontWeight: "500" },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 2,
    justifyContent: "center",
  },
  toggleActive: { backgroundColor: "rgba(200,255,0,0.2)", borderColor: colors.lime },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.textMuted,
  },
  toggleThumbActive: { backgroundColor: colors.lime, alignSelf: "flex-end" },
  fieldGroup: { marginBottom: spacing.lg },
  rtmpBox: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  rtmpText: { fontSize: fontSize.sm, color: colors.lime, fontFamily: "monospace" },
  qualityRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  qualityBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  qualityBtnActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  qualityBtnText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.textDim },
  qualityBtnTextActive: { color: colors.dark },
  tierCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  tierTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  tierDot: { width: 10, height: 10, borderRadius: 5 },
  tierName: { fontSize: fontSize.md, fontWeight: "700", color: colors.white },
  tierStatsRow: { flexDirection: "row", gap: spacing.xl },
  tierStat: {},
  tierStatValue: { fontSize: fontSize.lg, fontWeight: "900", color: colors.white },
  tierStatLabel: { fontSize: fontSize.xs, color: colors.textDim, marginTop: 2 },
  gatewayRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  gatewayIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(74,124,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  gatewayIconText: { fontSize: fontSize.sm, fontWeight: "700", color: colors.blue },
  gatewayInfo: { flex: 1 },
  gatewayName: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  gatewayVolume: { fontSize: fontSize.xs, color: colors.textDim, marginTop: 2 },
  gatewayStatus: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  gatewayStatusText: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
});
