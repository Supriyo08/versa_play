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

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  time: string;
  color: string;
}

const CHAT_MESSAGES: ChatMessage[] = [
  { id: "1", user: "CricketFan99", message: "What a shot by Kohli!", time: "2m ago", color: colors.lime },
  { id: "2", user: "AussiePride", message: "Starc needs to bowl fuller", time: "1m ago", color: colors.blue },
  { id: "3", user: "SportsGuru", message: "India looking strong here", time: "45s ago", color: colors.purple },
  { id: "4", user: "MatchAnalyst", message: "Run rate climbing fast", time: "30s ago", color: colors.orange },
  { id: "5", user: "VersaPlayFan", message: "Kohli on fire today!", time: "10s ago", color: colors.green },
];

const TOP_BATTERS = [
  { name: "V. Kohli", runs: 72, balls: 48, fours: 8, sixes: 2 },
  { name: "KL Rahul", runs: 38, balls: 30, fours: 4, sixes: 1 },
  { name: "R. Sharma", runs: 34, balls: 22, fours: 5, sixes: 1 },
];

const TOP_BOWLERS = [
  { name: "J. Hazlewood", overs: "6.0", figures: "1/22", economy: "3.67" },
  { name: "M. Starc", overs: "7.0", figures: "2/28", economy: "4.00" },
  { name: "A. Zampa", overs: "5.3", figures: "1/38", economy: "6.91" },
];

export default function LivestreamScreen() {
  const [chatInput, setChatInput] = useState("");
  const [quality, setQuality] = useState("1080p");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Live Stream</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.matchTitle}>India vs Australia - 2nd ODI</Text>
        </View>

        {/* Video Player Area */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlayer}>
            <View style={styles.videoTopRow}>
              <View style={styles.liveBadgeVideo}>
                <View style={styles.liveDot} />
                <Text style={styles.liveTextSmall}>LIVE</Text>
              </View>
              <View style={styles.qualityBadge}>
                <Text style={styles.qualityText}>{quality}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.playButton}>
              <View style={styles.playTriangle} />
            </TouchableOpacity>
            <View style={styles.videoBottomRow}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <View style={styles.qualityRow}>
                {["720p", "1080p", "4K"].map((q) => (
                  <TouchableOpacity
                    key={q}
                    onPress={() => setQuality(q)}
                    style={[styles.qualityOption, quality === q && styles.qualityOptionActive]}
                  >
                    <Text style={[styles.qualityOptionText, quality === q && styles.qualityOptionTextActive]}>
                      {q}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Scoreboard Overlay */}
        <View style={styles.scoreboardCard}>
          <Text style={styles.sectionLabel}>SCOREBOARD</Text>
          <View style={styles.scoreRow}>
            <View style={styles.teamScoreBlock}>
              <View style={[styles.teamCircle, { backgroundColor: "rgba(200,255,0,0.2)" }]}>
                <Text style={[styles.teamCircleText, { color: colors.lime }]}>IND</Text>
              </View>
              <Text style={styles.teamScoreName}>India</Text>
              <Text style={styles.teamScoreValue}>184/4</Text>
              <Text style={styles.teamOvers}>(18.3 ov)</Text>
            </View>
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            <View style={styles.teamScoreBlock}>
              <View style={[styles.teamCircle, { backgroundColor: "rgba(74,124,255,0.2)" }]}>
                <Text style={[styles.teamCircleText, { color: colors.blue }]}>AUS</Text>
              </View>
              <Text style={styles.teamScoreName}>Australia</Text>
              <Text style={styles.teamScoreValue}>279/10</Text>
              <Text style={styles.teamOvers}>(50.0 ov)</Text>
            </View>
          </View>
        </View>

        {/* Match Summary Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>MATCH SUMMARY</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8.42</Text>
              <Text style={styles.statLabel}>Run Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Boundaries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>48</Text>
              <Text style={styles.statLabel}>Dot Balls</Text>
            </View>
          </View>
        </View>

        {/* Win Probability */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>WIN PROBABILITY</Text>
          <View style={styles.probRow}>
            <View style={styles.probTeam}>
              <Text style={styles.probTeamName}>India</Text>
              <Text style={[styles.probPercent, { color: colors.lime }]}>62%</Text>
            </View>
            <View style={styles.probTeam}>
              <Text style={styles.probTeamName}>Australia</Text>
              <Text style={[styles.probPercent, { color: colors.blue }]}>38%</Text>
            </View>
          </View>
          <View style={styles.probBarContainer}>
            <View style={[styles.probBar, { flex: 62, backgroundColor: colors.lime, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }]} />
            <View style={[styles.probBar, { flex: 38, backgroundColor: colors.blue, borderTopRightRadius: 6, borderBottomRightRadius: 6 }]} />
          </View>
        </View>

        {/* Match Leaderboard */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>MATCH LEADERBOARD</Text>

          {/* Top Batters */}
          <Text style={styles.subSectionLabel}>Top Batters</Text>
          {TOP_BATTERS.map((b, i) => (
            <View key={b.name} style={[styles.leaderRow, i < TOP_BATTERS.length - 1 && styles.leaderRowBorder]}>
              <View style={styles.leaderRank}>
                <Text style={styles.leaderRankText}>{i + 1}</Text>
              </View>
              <View style={styles.leaderInfo}>
                <Text style={styles.leaderName}>{b.name}</Text>
                <Text style={styles.leaderSub}>{b.balls}b | {b.fours}x4 | {b.sixes}x6</Text>
              </View>
              <Text style={styles.leaderValue}>{b.runs}</Text>
            </View>
          ))}

          {/* Top Bowlers */}
          <Text style={[styles.subSectionLabel, { marginTop: spacing.lg }]}>Top Bowlers</Text>
          {TOP_BOWLERS.map((b, i) => (
            <View key={b.name} style={[styles.leaderRow, i < TOP_BOWLERS.length - 1 && styles.leaderRowBorder]}>
              <View style={styles.leaderRank}>
                <Text style={styles.leaderRankText}>{i + 1}</Text>
              </View>
              <View style={styles.leaderInfo}>
                <Text style={styles.leaderName}>{b.name}</Text>
                <Text style={styles.leaderSub}>{b.overs} ov | Econ: {b.economy}</Text>
              </View>
              <Text style={styles.leaderValue}>{b.figures}</Text>
            </View>
          ))}
        </View>

        {/* Live Chat */}
        <View style={[styles.card, { marginBottom: 100 }]}>
          <Text style={styles.sectionLabel}>LIVE CHAT</Text>
          <View style={styles.chatContainer}>
            {CHAT_MESSAGES.map((msg) => (
              <View key={msg.id} style={styles.chatMessage}>
                <View style={[styles.chatAvatar, { backgroundColor: msg.color + "33" }]}>
                  <Text style={[styles.chatAvatarText, { color: msg.color }]}>
                    {msg.user.charAt(0)}
                  </Text>
                </View>
                <View style={styles.chatContent}>
                  <View style={styles.chatMeta}>
                    <Text style={[styles.chatUser, { color: msg.color }]}>{msg.user}</Text>
                    <Text style={styles.chatTime}>{msg.time}</Text>
                  </View>
                  <Text style={styles.chatText}>{msg.message}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.textMuted}
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
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
  matchTitle: { fontSize: fontSize.base, color: colors.lime, marginTop: spacing.xs, fontWeight: "600" },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red },
  liveText: { fontSize: fontSize.xs, fontWeight: "800", color: colors.red },
  videoContainer: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  videoPlayer: {
    backgroundColor: "#0d0d1a",
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    height: 220,
    justifyContent: "space-between",
    padding: spacing.lg,
    overflow: "hidden",
  },
  videoTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  liveBadgeVideo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.3)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  liveTextSmall: { fontSize: 9, fontWeight: "800", color: colors.red },
  qualityBadge: {
    backgroundColor: "rgba(200,255,0,0.15)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  qualityText: { fontSize: 9, fontWeight: "700", color: colors.lime },
  playButton: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(200,255,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderLeftColor: colors.lime,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    marginLeft: 4,
  },
  videoBottomRow: { gap: spacing.sm },
  progressBar: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { width: "65%", height: "100%", backgroundColor: colors.lime },
  qualityRow: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm },
  qualityOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  qualityOptionActive: { backgroundColor: "rgba(200,255,0,0.15)" },
  qualityOptionText: { fontSize: 9, color: colors.textMuted, fontWeight: "600" },
  qualityOptionTextActive: { color: colors.lime },
  scoreboardCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
    letterSpacing: 1.5,
    marginBottom: spacing.lg,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamScoreBlock: { alignItems: "center", flex: 1 },
  teamCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  teamCircleText: { fontSize: fontSize.xs, fontWeight: "800" },
  teamScoreName: { fontSize: fontSize.sm, color: colors.text, fontWeight: "500" },
  teamScoreValue: { fontSize: fontSize.xl, fontWeight: "900", color: colors.white, marginTop: 2 },
  teamOvers: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  vsContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  vsText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.textDim },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  statsGrid: { flexDirection: "row", justifyContent: "space-between" },
  statItem: { alignItems: "center", flex: 1 },
  statValue: { fontSize: fontSize.xl, fontWeight: "900", color: colors.white },
  statLabel: { fontSize: fontSize.xs, color: colors.textDim, marginTop: spacing.xs },
  probRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  probTeam: { alignItems: "center" },
  probTeamName: { fontSize: fontSize.sm, color: colors.text, fontWeight: "500" },
  probPercent: { fontSize: fontSize.xxl, fontWeight: "900", marginTop: 2 },
  probBarContainer: { flexDirection: "row", height: 10, borderRadius: 6, overflow: "hidden", gap: 2 },
  probBar: { height: "100%" },
  subSectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.lime,
    marginBottom: spacing.md,
  },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  leaderRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  leaderRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  leaderRankText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.textDim },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  leaderSub: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  leaderValue: { fontSize: fontSize.md, fontWeight: "800", color: colors.lime },
  chatContainer: { marginBottom: spacing.lg },
  chatMessage: {
    flexDirection: "row",
    marginBottom: spacing.md,
    alignItems: "flex-start",
  },
  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  chatAvatarText: { fontSize: fontSize.xs, fontWeight: "700" },
  chatContent: { flex: 1 },
  chatMeta: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: 2 },
  chatUser: { fontSize: fontSize.xs, fontWeight: "700" },
  chatTime: { fontSize: 9, color: colors.textMuted },
  chatText: { fontSize: fontSize.sm, color: colors.text, lineHeight: 18 },
  chatInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  chatInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.white,
    fontSize: fontSize.sm,
  },
  sendButton: {
    backgroundColor: colors.lime,
    paddingHorizontal: spacing.lg,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: { fontSize: fontSize.sm, fontWeight: "700", color: colors.dark },
});
