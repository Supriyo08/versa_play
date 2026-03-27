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

const POSITIONS = ["Batsman", "Bowler", "All-Rounder", "Wicket Keeper"];

interface SkillSlider {
  key: string;
  label: string;
  value: number;
}

export default function AddPlayerScreen() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [bio, setBio] = useState("");
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [skills, setSkills] = useState<SkillSlider[]>([
    { key: "speed", label: "Speed", value: 50 },
    { key: "accuracy", label: "Accuracy", value: 50 },
    { key: "agility", label: "Agility", value: 50 },
    { key: "strength", label: "Strength", value: 50 },
    { key: "endurance", label: "Endurance", value: 50 },
  ]);

  const updateSkill = (key: string, delta: number) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.key === key
          ? { ...s, value: Math.max(0, Math.min(100, s.value + delta)) }
          : s
      )
    );
  };

  const averageRating = Math.round(
    skills.reduce((sum, s) => sum + s.value, 0) / skills.length
  );

  const getSkillColor = (value: number) => {
    if (value >= 80) return colors.lime;
    if (value >= 60) return colors.green;
    if (value >= 40) return colors.orange;
    return colors.red;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>ADD PLAYER</Text>
            <View style={styles.limeBadge}>
              <Text style={styles.limeBadgeText}>NEW</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Register a new player to the platform</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>PLAYER DETAILS</Text>

          {/* Display Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Display Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter player name"
              placeholderTextColor={colors.textMuted}
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="player@email.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Position Dropdown */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Position</Text>
            <TouchableOpacity
              style={styles.dropdownTrigger}
              onPress={() => setShowPositionDropdown(!showPositionDropdown)}
            >
              <Text
                style={[
                  styles.dropdownTriggerText,
                  !selectedPosition && { color: colors.textMuted },
                ]}
              >
                {selectedPosition || "Select position"}
              </Text>
              <Text style={styles.dropdownArrow}>
                {showPositionDropdown ? "-" : "+"}
              </Text>
            </TouchableOpacity>
            {showPositionDropdown && (
              <View style={styles.dropdownList}>
                {POSITIONS.map((pos) => (
                  <TouchableOpacity
                    key={pos}
                    style={[
                      styles.dropdownItem,
                      selectedPosition === pos && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedPosition(pos);
                      setShowPositionDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedPosition === pos && styles.dropdownItemTextActive,
                      ]}
                    >
                      {pos}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Bio */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Write a short bio..."
              placeholderTextColor={colors.textMuted}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Skill Rating Sliders */}
        <View style={styles.card}>
          <View style={styles.skillHeaderRow}>
            <Text style={styles.sectionLabel}>SKILL RATINGS</Text>
            <View style={styles.avgBadge}>
              <Text style={styles.avgBadgeLabel}>AVG</Text>
              <Text style={styles.avgBadgeValue}>{averageRating}</Text>
            </View>
          </View>
          {skills.map((skill) => (
            <View key={skill.key} style={styles.sliderRow}>
              <View style={styles.sliderLabelRow}>
                <Text style={styles.sliderLabel}>{skill.label}</Text>
                <Text style={[styles.sliderValue, { color: getSkillColor(skill.value) }]}>
                  {skill.value}
                </Text>
              </View>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${skill.value}%`,
                      backgroundColor: getSkillColor(skill.value),
                    },
                  ]}
                />
              </View>
              <View style={styles.sliderButtons}>
                <TouchableOpacity
                  style={styles.sliderBtn}
                  onPress={() => updateSkill(skill.key, -5)}
                >
                  <Text style={styles.sliderBtnText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sliderBtn}
                  onPress={() => updateSkill(skill.key, 5)}
                >
                  <Text style={styles.sliderBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Live Preview Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>LIVE PREVIEW</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewTop}>
              <View style={styles.previewAvatar}>
                <Text style={styles.previewAvatarText}>
                  {displayName
                    ? displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "??"}
                </Text>
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewName}>
                  {displayName || "Player Name"}
                </Text>
                <Text style={styles.previewPosition}>
                  {selectedPosition || "Position"}
                </Text>
              </View>
              <View style={styles.previewRating}>
                <Text style={styles.previewRatingValue}>{averageRating}</Text>
                <Text style={styles.previewRatingLabel}>OVR</Text>
              </View>
            </View>
            {bio ? (
              <Text style={styles.previewBio} numberOfLines={2}>
                {bio}
              </Text>
            ) : null}
            <View style={styles.previewSkillsRow}>
              {skills.map((s) => (
                <View key={s.key} style={styles.previewSkillItem}>
                  <Text style={[styles.previewSkillValue, { color: getSkillColor(s.value) }]}>
                    {s.value}
                  </Text>
                  <Text style={styles.previewSkillLabel}>
                    {s.label.slice(0, 3).toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Add Player</Text>
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
  limeBadge: {
    backgroundColor: colors.lime,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  limeBadgeText: { fontSize: 9, fontWeight: "800", color: colors.dark, letterSpacing: 1 },
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
  textArea: {
    height: 100,
    paddingTop: spacing.md,
  },
  dropdownTrigger: {
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
  dropdownTriggerText: { fontSize: fontSize.sm, color: colors.white },
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
  skillHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avgBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(200,255,0,0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  avgBadgeLabel: { fontSize: 9, color: colors.lime, fontWeight: "600" },
  avgBadgeValue: { fontSize: fontSize.sm, fontWeight: "800", color: colors.lime },
  sliderRow: { marginBottom: spacing.lg },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  sliderLabel: { fontSize: fontSize.sm, color: colors.text, fontWeight: "500" },
  sliderValue: { fontSize: fontSize.sm, fontWeight: "700" },
  sliderTrack: {
    height: 8,
    backgroundColor: colors.dark,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  sliderFill: { height: "100%", borderRadius: 4 },
  sliderButtons: { flexDirection: "row", gap: spacing.sm },
  sliderBtn: {
    width: 36,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderBtnText: { fontSize: fontSize.md, color: colors.lime, fontWeight: "700" },
  previewCard: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.lime,
    padding: spacing.lg,
  },
  previewTop: { flexDirection: "row", alignItems: "center" },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(200,255,0,0.15)",
    borderWidth: 2,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  previewAvatarText: { fontSize: fontSize.base, fontWeight: "800", color: colors.lime },
  previewInfo: { flex: 1 },
  previewName: { fontSize: fontSize.md, fontWeight: "700", color: colors.white },
  previewPosition: { fontSize: fontSize.xs, color: colors.textDim, marginTop: 2 },
  previewRating: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(200,255,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewRatingValue: { fontSize: fontSize.lg, fontWeight: "900", color: colors.lime },
  previewRatingLabel: { fontSize: 8, color: colors.textDim, fontWeight: "600" },
  previewBio: {
    fontSize: fontSize.xs,
    color: colors.textDim,
    marginTop: spacing.md,
    lineHeight: 16,
  },
  previewSkillsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  previewSkillItem: { alignItems: "center" },
  previewSkillValue: { fontSize: fontSize.sm, fontWeight: "800" },
  previewSkillLabel: { fontSize: 8, color: colors.textMuted, marginTop: 2 },
  submitContainer: { paddingHorizontal: spacing.xl },
  submitButton: {
    backgroundColor: colors.lime,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  submitButtonText: { fontSize: fontSize.md, fontWeight: "800", color: colors.dark },
});
