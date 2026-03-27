import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";
import { matches as matchesAPI } from "../lib/api";

interface MatchEvent {
  id: string;
  type: string;
  team: number;
  player?: { displayName: string };
  playerId?: string;
  matchTime: string;
  detail: string;
}

interface Match {
  id: string;
  homeTeam: { id: string; name: string };
  awayTeam: { id: string; name: string };
  homeScore: number;
  awayScore: number;
  status: string;
  tournament?: { sport: string };
}

export default function ScoringScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await matchesAPI.list({ status: "live" });
      const liveMatches = (res.matches || []).filter(
        (m: any) => m.status === "live" || m.status === "in_progress"
      );
      setMatches(liveMatches);
      if (liveMatches.length > 0 && !selectedMatch) {
        selectMatch(liveMatches[0]);
      } else if (liveMatches.length === 0) {
        // fallback: get all scheduled/upcoming matches
        const allRes = await matchesAPI.list();
        setMatches(allRes.matches || []);
        if ((allRes.matches || []).length > 0 && !selectedMatch) {
          selectMatch(allRes.matches[0]);
        }
      }
    } catch {
      // keep existing
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const selectMatch = async (match: Match) => {
    setSelectedMatch(match);
    try {
      const detail = await matchesAPI.get(match.id);
      if (detail.events) {
        setEvents(detail.events);
      }
    } catch {
      // keep empty events
    }
  };

  const fetchEvents = useCallback(async () => {
    if (!selectedMatch) return;
    try {
      const detail = await matchesAPI.get(selectedMatch.id);
      setSelectedMatch((prev) =>
        prev ? { ...prev, homeScore: detail.homeScore, awayScore: detail.awayScore } : prev
      );
      if (detail.events) setEvents(detail.events);
    } catch {
      // silent
    }
  }, [selectedMatch?.id]);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (!selectedMatch) return;
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, [selectedMatch?.id, fetchEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const addEvent = async (type: string, team: 1 | 2) => {
    if (!selectedMatch) return;
    try {
      await matchesAPI.addEvent(selectedMatch.id, {
        type,
        team,
        detail: type === "goal" ? "Goal scored" : type === "card" ? "Yellow card" : type === "timeout" ? "Timeout called" : "Substitution",
        matchTime: new Date().toISOString(),
      });
      fetchEvents();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to add event");
    }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: "You", text: chatInput.trim() }]);
    setChatInput("");
  };

  const EventButton = ({ label, color, onPress }: { label: string; color: string; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.eventBtn, { borderColor: color + "50", backgroundColor: color + "15" }]}
    >
      <Text style={[styles.eventBtnText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.lime} />
      </View>
    );
  }

  if (!selectedMatch) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.textDim, fontSize: fontSize.md }}>No matches available</Text>
        <TouchableOpacity onPress={onRefresh} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.lime, fontWeight: "700" }}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const score1 = selectedMatch.homeScore ?? 0;
  const score2 = selectedMatch.awayScore ?? 0;
  const team1Name = selectedMatch.homeTeam?.name || "Home";
  const team2Name = selectedMatch.awayTeam?.name || "Away";
  const team1Short = team1Name.substring(0, 3).toUpperCase();
  const team2Short = team2Name.substring(0, 3).toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.lime} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Match Scoring</Text>
        <View style={styles.liveTag}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{(selectedMatch.status || "LIVE").toUpperCase()}</Text>
        </View>
      </View>

      {/* Match Selector */}
      {matches.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }} contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.sm }}>
          {matches.map((m) => (
            <TouchableOpacity
              key={m.id}
              onPress={() => selectMatch(m)}
              style={[styles.matchTab, selectedMatch.id === m.id && styles.matchTabActive]}
            >
              <Text style={[styles.matchTabText, selectedMatch.id === m.id && { color: colors.dark }]}>
                {(m.homeTeam?.name || "?").substring(0, 3)} vs {(m.awayTeam?.name || "?").substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        <View style={styles.teamCol}>
          <View style={[styles.teamBadge, { backgroundColor: "rgba(200,255,0,0.2)" }]}>
            <Text style={[styles.teamInitials, { color: colors.lime }]}>{team1Name.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.teamName}>{team1Name}</Text>
        </View>
        <View style={styles.scoreCol}>
          <Text style={styles.scoreNum}>{score1}</Text>
          <Text style={styles.vs}>VS</Text>
          <Text style={styles.scoreNum}>{score2}</Text>
        </View>
        <View style={styles.teamCol}>
          <View style={[styles.teamBadge, { backgroundColor: "rgba(74,124,255,0.2)" }]}>
            <Text style={[styles.teamInitials, { color: colors.blue }]}>{team2Name.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.teamName}>{team2Name}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{team1Name.toUpperCase()}</Text>
        <View style={styles.btnGrid}>
          <EventButton label="Goal" color={colors.green} onPress={() => addEvent("goal", 1)} />
          <EventButton label="Card" color={colors.orange} onPress={() => addEvent("card", 1)} />
          <EventButton label="Timeout" color={colors.blue} onPress={() => addEvent("timeout", 1)} />
          <EventButton label="Sub" color={colors.purple} onPress={() => addEvent("substitution", 1)} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.blue }]}>{team2Name.toUpperCase()}</Text>
        <View style={styles.btnGrid}>
          <EventButton label="Goal" color={colors.green} onPress={() => addEvent("goal", 2)} />
          <EventButton label="Card" color={colors.orange} onPress={() => addEvent("card", 2)} />
          <EventButton label="Timeout" color={colors.blue} onPress={() => addEvent("timeout", 2)} />
          <EventButton label="Sub" color={colors.purple} onPress={() => addEvent("substitution", 2)} />
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MATCH TIMELINE</Text>
        {events.length === 0 ? (
          <Text style={{ color: colors.textDim, fontSize: fontSize.xs }}>No events yet</Text>
        ) : (
          [...events].reverse().map((e) => (
            <View key={e.id} style={styles.eventRow}>
              <View style={[styles.eventDot, {
                backgroundColor: e.type === "goal" ? colors.green + "30" : e.type === "card" ? colors.orange + "30" : colors.blue + "30"
              }]}>
                <Text style={{ fontSize: 9, fontWeight: "700", color: e.type === "goal" ? colors.green : e.type === "card" ? colors.orange : colors.blue }}>
                  {(e.type || "E").charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={styles.eventTime}>{e.matchTime || ""}</Text>
                  <View style={[styles.teamTag, { backgroundColor: e.team === 1 ? "rgba(200,255,0,0.1)" : "rgba(74,124,255,0.1)" }]}>
                    <Text style={{ fontSize: 8, fontWeight: "700", color: e.team === 1 ? colors.lime : colors.blue }}>
                      {e.team === 1 ? team1Short : team2Short}
                    </Text>
                  </View>
                </View>
                <Text style={styles.eventPlayer}>{e.player?.displayName || "Unknown"}</Text>
                <Text style={styles.eventDetail}>{e.detail}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Chat */}
      <View style={[styles.section, { paddingBottom: 100 }]}>
        <Text style={styles.sectionTitle}>OFFICIAL CHAT</Text>
        <View style={styles.chatBox}>
          {chatMessages.length === 0 ? (
            <Text style={styles.chatMsg}>No messages yet</Text>
          ) : (
            chatMessages.map((m, i) => (
              <Text key={i} style={styles.chatMsg}>
                <Text style={{ color: m.sender === "You" ? colors.orange : colors.lime, fontWeight: "600" }}>
                  {m.sender}:
                </Text>{" "}
                {m.text}
              </Text>
            ))
          )}
        </View>
        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={sendChat}
          />
          <TouchableOpacity style={styles.chatSend} onPress={sendChat}>
            <Text style={styles.chatSendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: spacing.lg, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.white },
  liveTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.red },
  liveText: { fontSize: 9, fontWeight: "700", color: colors.red },
  matchTab: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  matchTabActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  matchTabText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.textDim },
  scoreboard: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: colors.card, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.border,
    marginHorizontal: spacing.xl, padding: spacing.xl, marginBottom: spacing.xl,
  },
  teamCol: { alignItems: "center", flex: 1 },
  teamBadge: { width: 48, height: 48, borderRadius: borderRadius.lg, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  teamInitials: { fontSize: fontSize.lg, fontWeight: "900" },
  teamName: { fontSize: fontSize.xs, fontWeight: "600", color: colors.white, textAlign: "center" },
  scoreCol: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  scoreNum: { fontSize: 44, fontWeight: "900", color: colors.white },
  vs: { fontSize: fontSize.xs, color: colors.textMuted },
  section: { paddingHorizontal: spacing.xl, marginBottom: spacing.xxl },
  sectionTitle: { fontSize: 9, fontWeight: "700", color: colors.lime, letterSpacing: 1.5, marginBottom: spacing.md },
  btnGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  eventBtn: { flex: 1, minWidth: "45%", paddingVertical: 12, alignItems: "center", borderRadius: borderRadius.lg, borderWidth: 1 },
  eventBtnText: { fontSize: fontSize.xs, fontWeight: "700" },
  eventRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  eventDot: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  eventTime: { fontSize: fontSize.xs, fontWeight: "700", color: colors.white },
  teamTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  eventPlayer: { fontSize: fontSize.sm, color: colors.white, marginTop: 2 },
  eventDetail: { fontSize: fontSize.xs, color: colors.textDim, marginTop: 1 },
  chatBox: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.sm, gap: spacing.sm },
  chatMsg: { fontSize: fontSize.xs, color: colors.textDim },
  chatInputRow: { flexDirection: "row", gap: spacing.sm },
  chatInput: {
    flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.xs, color: colors.white,
  },
  chatSend: { backgroundColor: colors.lime, paddingHorizontal: spacing.lg, borderRadius: borderRadius.md, justifyContent: "center" },
  chatSendText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.dark },
});
