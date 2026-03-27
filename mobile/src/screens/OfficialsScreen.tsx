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

interface Assignment {
  id: string;
  role: string;
  officialName: string;
  status: "confirmed" | "pending";
}

interface Official {
  id: string;
  name: string;
  country: string;
  experience: string;
  rating: number;
  votes: { up: number; down: number };
}

const ASSIGNMENTS: Assignment[] = [
  { id: "1", role: "On-field Umpire 1", officialName: "Kumar Dharmasena", status: "confirmed" },
  { id: "2", role: "On-field Umpire 2", officialName: "Richard Kettleborough", status: "confirmed" },
  { id: "3", role: "Third Umpire", officialName: "Marais Erasmus", status: "confirmed" },
  { id: "4", role: "Match Referee", officialName: "Ranjan Madugalle", status: "pending" },
  { id: "5", role: "Reserve Umpire", officialName: "Chris Gaffaney", status: "pending" },
  { id: "6", role: "Scorer 1", officialName: "Alex Wharf", status: "confirmed" },
  { id: "7", role: "Scorer 2", officialName: "Joel Wilson", status: "pending" },
];

const OFFICIALS: Official[] = [
  { id: "1", name: "Kumar Dharmasena", country: "Sri Lanka", experience: "15 years", rating: 94, votes: { up: 342, down: 18 } },
  { id: "2", name: "Richard Kettleborough", country: "England", experience: "12 years", rating: 92, votes: { up: 298, down: 22 } },
  { id: "3", name: "Marais Erasmus", country: "South Africa", experience: "18 years", rating: 96, votes: { up: 412, down: 8 } },
  { id: "4", name: "Ranjan Madugalle", country: "Sri Lanka", experience: "20 years", rating: 95, votes: { up: 388, down: 12 } },
  { id: "5", name: "Chris Gaffaney", country: "New Zealand", experience: "8 years", rating: 87, votes: { up: 186, down: 34 } },
  { id: "6", name: "Alex Wharf", country: "England", experience: "6 years", rating: 82, votes: { up: 142, down: 28 } },
  { id: "7", name: "Joel Wilson", country: "West Indies", experience: "10 years", rating: 88, votes: { up: 224, down: 42 } },
];

export default function OfficialsScreen() {
  const [officialVotes, setOfficialVotes] = useState<Record<string, "up" | "down" | null>>({});

  const handleVote = (officialId: string, vote: "up" | "down") => {
    setOfficialVotes((prev) => ({
      ...prev,
      [officialId]: prev[officialId] === vote ? null : vote,
    }));
  };

  const confirmedCount = ASSIGNMENTS.filter((a) => a.status === "confirmed").length;
  const pendingCount = ASSIGNMENTS.filter((a) => a.status === "pending").length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Official Assignments</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          </View>
          <View style={styles.statusSummary}>
            <View style={styles.statusChip}>
              <View style={[styles.statusDot, { backgroundColor: colors.green }]} />
              <Text style={styles.statusChipText}>{confirmedCount} Confirmed</Text>
            </View>
            <View style={styles.statusChip}>
              <View style={[styles.statusDot, { backgroundColor: colors.orange }]} />
              <Text style={styles.statusChipText}>{pendingCount} Pending</Text>
            </View>
          </View>
        </View>

        {/* Match Info Card */}
        <View style={styles.matchInfoCard}>
          <View style={styles.matchInfoRow}>
            <View style={[styles.teamBadge, { backgroundColor: "rgba(200,255,0,0.15)" }]}>
              <Text style={[styles.teamBadgeText, { color: colors.lime }]}>IND</Text>
            </View>
            <View style={styles.matchInfoCenter}>
              <Text style={styles.matchInfoTitle}>India vs Australia</Text>
              <Text style={styles.matchInfoSub}>2nd ODI - International Series</Text>
            </View>
            <View style={[styles.teamBadge, { backgroundColor: "rgba(74,124,255,0.15)" }]}>
              <Text style={[styles.teamBadgeText, { color: colors.blue }]}>AUS</Text>
            </View>
          </View>
        </View>

        {/* Assignment Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ROLE ASSIGNMENTS</Text>
          {ASSIGNMENTS.map((assignment) => (
            <View key={assignment.id} style={styles.assignmentCard}>
              <View style={styles.assignmentTop}>
                <View style={styles.roleTag}>
                  <Text style={styles.roleTagText}>{assignment.role}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        assignment.status === "confirmed"
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(245,158,11,0.15)",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDotSmall,
                      {
                        backgroundColor:
                          assignment.status === "confirmed"
                            ? colors.green
                            : colors.orange,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusBadgeText,
                      {
                        color:
                          assignment.status === "confirmed"
                            ? colors.green
                            : colors.orange,
                      },
                    ]}
                  >
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.assignmentBottom}>
                <View style={styles.officialAvatar}>
                  <Text style={styles.officialAvatarText}>
                    {assignment.officialName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Text>
                </View>
                <Text style={styles.officialName}>{assignment.officialName}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Official Selector with Voting */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionLabel}>OFFICIAL RATINGS</Text>
          <Text style={styles.sectionSubtitle}>
            Vote for officials based on performance
          </Text>
          {OFFICIALS.map((official) => {
            const currentVote = officialVotes[official.id] || null;
            return (
              <View key={official.id} style={styles.officialCard}>
                <View style={styles.officialCardTop}>
                  <View style={styles.officialCardAvatar}>
                    <Text style={styles.officialCardAvatarText}>
                      {official.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Text>
                  </View>
                  <View style={styles.officialCardInfo}>
                    <Text style={styles.officialCardName}>{official.name}</Text>
                    <Text style={styles.officialCardMeta}>
                      {official.country} | {official.experience}
                    </Text>
                  </View>
                  <View style={styles.officialRating}>
                    <Text style={styles.officialRatingValue}>{official.rating}</Text>
                  </View>
                </View>
                <View style={styles.voteRow}>
                  <TouchableOpacity
                    onPress={() => handleVote(official.id, "up")}
                    style={[
                      styles.voteBtn,
                      styles.voteBtnUp,
                      currentVote === "up" && styles.voteBtnUpActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.voteIcon,
                        { color: currentVote === "up" ? colors.dark : colors.green },
                      ]}
                    >
                      +
                    </Text>
                    <Text
                      style={[
                        styles.voteCount,
                        { color: currentVote === "up" ? colors.dark : colors.green },
                      ]}
                    >
                      {official.votes.up + (currentVote === "up" ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleVote(official.id, "down")}
                    style={[
                      styles.voteBtn,
                      styles.voteBtnDown,
                      currentVote === "down" && styles.voteBtnDownActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.voteIcon,
                        { color: currentVote === "down" ? colors.white : colors.red },
                      ]}
                    >
                      -
                    </Text>
                    <Text
                      style={[
                        styles.voteCount,
                        { color: currentVote === "down" ? colors.white : colors.red },
                      ]}
                    >
                      {official.votes.down + (currentVote === "down" ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.approvalBar}>
                    <View
                      style={[
                        styles.approvalFill,
                        {
                          width: `${Math.round(
                            (official.votes.up / (official.votes.up + official.votes.down)) * 100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.approvalText}>
                    {Math.round(
                      (official.votes.up / (official.votes.up + official.votes.down)) * 100
                    )}
                    %
                  </Text>
                </View>
              </View>
            );
          })}
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
  statusSummary: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusChipText: { fontSize: fontSize.xs, color: colors.textDim },
  matchInfoCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  matchInfoRow: { flexDirection: "row", alignItems: "center" },
  teamBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  teamBadgeText: { fontSize: fontSize.xs, fontWeight: "800" },
  matchInfoCenter: { flex: 1, alignItems: "center" },
  matchInfoTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.white },
  matchInfoSub: { fontSize: fontSize.xs, color: colors.textDim, marginTop: 2 },
  section: { paddingHorizontal: spacing.xl },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  assignmentCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  assignmentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  roleTag: {
    backgroundColor: "rgba(200,255,0,0.1)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  roleTagText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.lime },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusDotSmall: { width: 6, height: 6, borderRadius: 3 },
  statusBadgeText: { fontSize: fontSize.xs, fontWeight: "600" },
  assignmentBottom: { flexDirection: "row", alignItems: "center" },
  officialAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(200,255,0,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  officialAvatarText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.lime },
  officialName: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  officialCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  officialCardTop: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  officialCardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(74,124,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  officialCardAvatarText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.blue },
  officialCardInfo: { flex: 1 },
  officialCardName: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  officialCardMeta: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  officialRating: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: "rgba(200,255,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  officialRatingValue: { fontSize: fontSize.sm, fontWeight: "800", color: colors.lime },
  voteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  voteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  voteBtnUp: { borderColor: "rgba(34,197,94,0.3)", backgroundColor: "rgba(34,197,94,0.08)" },
  voteBtnUpActive: { backgroundColor: colors.green, borderColor: colors.green },
  voteBtnDown: { borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.08)" },
  voteBtnDownActive: { backgroundColor: colors.red, borderColor: colors.red },
  voteIcon: { fontSize: fontSize.md, fontWeight: "700" },
  voteCount: { fontSize: fontSize.xs, fontWeight: "600" },
  approvalBar: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 3,
    overflow: "hidden",
  },
  approvalFill: { height: "100%", backgroundColor: colors.green, borderRadius: 3 },
  approvalText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.green, minWidth: 32, textAlign: "right" },
});
