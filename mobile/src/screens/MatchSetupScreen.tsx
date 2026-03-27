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

const TOURNAMENTS = ["Premier League 2025", "Champions Cup", "Super Sixes", "City League"];
const FORMATS = ["T20", "ODI", "Test"];
const PITCH_TYPES = ["Green", "Dry", "Flat", "Dusty"];
const WEATHER_OPTIONS = ["Sunny", "Cloudy", "Overcast", "Rainy"];

const FIELD_POSITIONS = [
  { label: "WK", angle: 0, distance: 0.15 },
  { label: "Slip", angle: 30, distance: 0.2 },
  { label: "Gully", angle: 55, distance: 0.25 },
  { label: "Point", angle: 80, distance: 0.35 },
  { label: "Cover", angle: 110, distance: 0.38 },
  { label: "Mid-Off", angle: 150, distance: 0.35 },
  { label: "Mid-On", angle: 210, distance: 0.35 },
  { label: "Mid-Wkt", angle: 250, distance: 0.38 },
  { label: "Sq Leg", angle: 280, distance: 0.35 },
  { label: "Fine Leg", angle: 320, distance: 0.4 },
  { label: "3rd Man", angle: 345, distance: 0.42 },
];

export default function MatchSetupScreen() {
  const [tournament, setTournament] = useState(TOURNAMENTS[0]);
  const [showTournamentDropdown, setShowTournamentDropdown] = useState(false);
  const [format, setFormat] = useState("T20");
  const [date, setDate] = useState("2025-04-15");
  const [time, setTime] = useState("14:30");
  const [venue, setVenue] = useState("");
  const [homeTeam, setHomeTeam] = useState("India");
  const [awayTeam, setAwayTeam] = useState("Australia");
  const [pitchType, setPitchType] = useState("Green");
  const [weather, setWeather] = useState("Sunny");
  const [dewFactor, setDewFactor] = useState(false);

  const getPositionCoords = (angle: number, distance: number, size: number) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const rad = (angle - 90) * (Math.PI / 180);
    const maxRadius = (size / 2) * 0.85;
    const x = centerX + Math.cos(rad) * maxRadius * distance;
    const y = centerY + Math.sin(rad) * maxRadius * distance;
    return { left: x - 14, top: y - 10 };
  };

  const FIELD_SIZE = 280;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>MATCH SETUP</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Configure and schedule a new match</Text>
        </View>

        {/* Match Details Form */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>MATCH DETAILS</Text>

          {/* Tournament Select */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tournament</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowTournamentDropdown(!showTournamentDropdown)}
            >
              <Text style={styles.dropdownText}>{tournament}</Text>
              <Text style={styles.dropdownArrow}>{showTournamentDropdown ? "-" : "+"}</Text>
            </TouchableOpacity>
            {showTournamentDropdown && (
              <View style={styles.dropdownList}>
                {TOURNAMENTS.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.dropdownItem, tournament === t && styles.dropdownItemActive]}
                    onPress={() => {
                      setTournament(t);
                      setShowTournamentDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, tournament === t && styles.dropdownItemTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Match Format */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Match Format</Text>
            <View style={styles.formatRow}>
              {FORMATS.map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFormat(f)}
                  style={[styles.formatBtn, format === f && styles.formatBtnActive]}
                >
                  <Text style={[styles.formatBtnText, format === f && styles.formatBtnTextActive]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date & Time */}
          <View style={styles.twoCol}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Date</Text>
              <TextInput
                style={styles.textInput}
                value={date}
                onChangeText={setDate}
                placeholderTextColor={colors.textMuted}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Time</Text>
              <TextInput
                style={styles.textInput}
                value={time}
                onChangeText={setTime}
                placeholderTextColor={colors.textMuted}
                placeholder="HH:MM"
              />
            </View>
          </View>

          {/* Venue */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Venue</Text>
            <TextInput
              style={styles.textInput}
              value={venue}
              onChangeText={setVenue}
              placeholderTextColor={colors.textMuted}
              placeholder="Enter venue name"
            />
          </View>
        </View>

        {/* Team Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>TEAM SELECTION</Text>
          <View style={styles.teamSelectRow}>
            <View style={styles.teamBlock}>
              <Text style={styles.teamRoleLabel}>Home Team</Text>
              <View style={[styles.teamCircle, { backgroundColor: "rgba(200,255,0,0.15)" }]}>
                <Text style={[styles.teamCircleText, { color: colors.lime }]}>
                  {homeTeam.slice(0, 3).toUpperCase()}
                </Text>
              </View>
              <TextInput
                style={styles.teamInput}
                value={homeTeam}
                onChangeText={setHomeTeam}
                placeholderTextColor={colors.textMuted}
                placeholder="Home team"
                textAlign="center"
              />
            </View>
            <View style={styles.vsCircle}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            <View style={styles.teamBlock}>
              <Text style={styles.teamRoleLabel}>Away Team</Text>
              <View style={[styles.teamCircle, { backgroundColor: "rgba(74,124,255,0.15)" }]}>
                <Text style={[styles.teamCircleText, { color: colors.blue }]}>
                  {awayTeam.slice(0, 3).toUpperCase()}
                </Text>
              </View>
              <TextInput
                style={styles.teamInput}
                value={awayTeam}
                onChangeText={setAwayTeam}
                placeholderTextColor={colors.textMuted}
                placeholder="Away team"
                textAlign="center"
              />
            </View>
          </View>
        </View>

        {/* Pitch Conditions */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>PITCH CONDITIONS</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Pitch Type</Text>
            <View style={styles.formatRow}>
              {PITCH_TYPES.map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPitchType(p)}
                  style={[styles.pitchChip, pitchType === p && styles.pitchChipActive]}
                >
                  <Text style={[styles.pitchChipText, pitchType === p && styles.pitchChipTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Weather</Text>
            <View style={styles.formatRow}>
              {WEATHER_OPTIONS.map((w) => (
                <TouchableOpacity
                  key={w}
                  onPress={() => setWeather(w)}
                  style={[styles.pitchChip, weather === w && styles.pitchChipActive]}
                >
                  <Text style={[styles.pitchChipText, weather === w && styles.pitchChipTextActive]}>
                    {w}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.fieldLabel}>Dew Factor</Text>
            <TouchableOpacity
              onPress={() => setDewFactor(!dewFactor)}
              style={[styles.toggle, dewFactor && styles.toggleActive]}
            >
              <View style={[styles.toggleThumb, dewFactor && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Field Mapping */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>FIELD POSITIONS</Text>
          <View style={styles.fieldContainer}>
            <View style={[styles.fieldOuter, { width: FIELD_SIZE, height: FIELD_SIZE }]}>
              {/* Outer boundary */}
              <View style={styles.fieldCircleOuter} />
              {/* Inner circle (30-yard) */}
              <View style={styles.fieldCircleInner} />
              {/* Pitch strip */}
              <View style={styles.pitchStrip} />
              {/* Positions */}
              {FIELD_POSITIONS.map((pos) => {
                const coords = getPositionCoords(pos.angle, pos.distance, FIELD_SIZE);
                return (
                  <View key={pos.label} style={[styles.positionDot, { left: coords.left, top: coords.top }]}>
                    <Text style={styles.positionLabel}>{pos.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Match Preview */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>MATCH PREVIEW</Text>
          <View style={styles.previewGrid}>
            <View style={styles.previewItem}>
              <Text style={styles.previewLabel}>Tournament</Text>
              <Text style={styles.previewValue}>{tournament}</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewLabel}>Format</Text>
              <Text style={styles.previewValue}>{format}</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewLabel}>Date</Text>
              <Text style={styles.previewValue}>{date}</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewLabel}>Time</Text>
              <Text style={styles.previewValue}>{time}</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewLabel}>Venue</Text>
              <Text style={styles.previewValue}>{venue || "TBD"}</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewLabel}>Match</Text>
              <Text style={styles.previewValue}>{homeTeam} vs {awayTeam}</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewLabel}>Pitch</Text>
              <Text style={styles.previewValue}>{pitchType}</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewLabel}>Weather</Text>
              <Text style={styles.previewValue}>{weather}</Text>
            </View>
          </View>
        </View>

        {/* Create Match Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Create Match</Text>
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
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.white, letterSpacing: 1 },
  adminBadge: {
    backgroundColor: "rgba(200,255,0,0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  adminBadgeText: { fontSize: 9, fontWeight: "800", color: colors.lime, letterSpacing: 1 },
  subtitle: { fontSize: fontSize.sm, color: colors.textDim, marginTop: spacing.xs },
  card: {
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
  fieldGroup: { marginBottom: spacing.lg },
  fieldLabel: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginBottom: spacing.sm },
  textInput: {
    height: 44,
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    color: colors.white,
    fontSize: fontSize.sm,
  },
  twoCol: { flexDirection: "row", gap: spacing.md },
  dropdown: {
    height: 44,
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: { fontSize: fontSize.sm, color: colors.white },
  dropdownArrow: { fontSize: fontSize.md, color: colors.lime, fontWeight: "700" },
  dropdownList: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemActive: { backgroundColor: "rgba(200,255,0,0.1)" },
  dropdownItemText: { fontSize: fontSize.sm, color: colors.text },
  dropdownItemTextActive: { color: colors.lime, fontWeight: "600" },
  formatRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  formatBtn: {
    flex: 1,
    minWidth: 60,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  formatBtnActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  formatBtnText: { fontSize: fontSize.sm, fontWeight: "700", color: colors.textDim },
  formatBtnTextActive: { color: colors.dark },
  teamSelectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamBlock: { flex: 1, alignItems: "center" },
  teamRoleLabel: { fontSize: fontSize.xs, color: colors.textDim, marginBottom: spacing.sm, fontWeight: "600" },
  teamCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  teamCircleText: { fontSize: fontSize.sm, fontWeight: "800" },
  teamInput: {
    width: "100%",
    height: 36,
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    color: colors.white,
    fontSize: fontSize.xs,
  },
  vsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.md,
  },
  vsText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.textDim },
  pitchChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pitchChipActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  pitchChipText: { fontSize: fontSize.xs, fontWeight: "600", color: colors.textDim },
  pitchChipTextActive: { color: colors.dark },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  fieldContainer: { alignItems: "center", paddingVertical: spacing.md },
  fieldOuter: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldCircleOuter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "rgba(200,255,0,0.2)",
    backgroundColor: "rgba(34,197,94,0.05)",
  },
  fieldCircleInner: {
    position: "absolute",
    width: "55%",
    height: "55%",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(200,255,0,0.15)",
    borderStyle: "dashed",
  },
  pitchStrip: {
    width: 8,
    height: 50,
    backgroundColor: "rgba(200,255,0,0.3)",
    borderRadius: 4,
  },
  positionDot: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  positionLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: colors.lime,
    backgroundColor: "rgba(10,10,15,0.8)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    textAlign: "center",
  },
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  previewItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  previewLabel: { fontSize: 9, color: colors.textMuted, marginBottom: 2 },
  previewValue: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white },
  submitContainer: { paddingHorizontal: spacing.xl },
  submitButton: {
    backgroundColor: colors.lime,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  submitButtonText: { fontSize: fontSize.md, fontWeight: "800", color: colors.dark },
});
