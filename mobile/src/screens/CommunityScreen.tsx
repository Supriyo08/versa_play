import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";

// ── Types ──────────────────────────────────────────────────────────
interface FeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorInitials: string;
  sport: string;
  sportColor: string;
  timeAgo: string;
  content: string;
  hasImage: boolean;
  likes: number;
  comments: number;
  shares: number;
}

interface TrendingTopic {
  id: string;
  tag: string;
  posts: string;
}

interface SpotlightPlayer {
  id: string;
  name: string;
  initials: string;
  highlight: string;
  highlightLabel: string;
  color: string;
}

// ── Mock Data ──────────────────────────────────────────────────────
const FEED_POSTS: FeedPost[] = [
  {
    id: "p1",
    authorName: "Marcus Reed",
    authorHandle: "@mreed10",
    authorInitials: "MR",
    sport: "Soccer",
    sportColor: colors.green,
    timeAgo: "12m ago",
    content:
      "Just wrapped up an insane 5-a-side session. Three goals and two assists -- the movement off the ball was on another level today. Grinding for that Pro League S4 spot.",
    hasImage: true,
    likes: 184,
    comments: 32,
    shares: 12,
  },
  {
    id: "p2",
    authorName: "Jade Kim",
    authorHandle: "@jadekim_bm",
    authorInitials: "JK",
    sport: "Badminton",
    sportColor: colors.purple,
    timeAgo: "1h",
    content:
      "31 win streak and counting. Changed my grip positioning last week and the difference in my smash accuracy is unreal. Anyone else working on mechanics adjustments?",
    hasImage: false,
    likes: 247,
    comments: 58,
    shares: 19,
  },
  {
    id: "p3",
    authorName: "Darius Cole",
    authorHandle: "@dcole_hoops",
    authorInitials: "DC",
    sport: "Basketball",
    sportColor: colors.orange,
    timeAgo: "3h",
    content:
      "Film session tonight revealed so many openings I missed in the half-court offense. Posting up the breakdown for anyone who wants to study pick-and-roll reads.",
    hasImage: true,
    likes: 312,
    comments: 74,
    shares: 45,
  },
  {
    id: "p4",
    authorName: "Lena Park",
    authorHandle: "@lenapark_t",
    authorInitials: "LP",
    sport: "Tennis",
    sportColor: colors.blue,
    timeAgo: "5h",
    content:
      "New racket day! Switched to a heavier frame for more power on serves. First session felt amazing -- hit 12 aces in practice. Tournament prep is going well.",
    hasImage: false,
    likes: 156,
    comments: 21,
    shares: 8,
  },
  {
    id: "p5",
    authorName: "Omar Hassan",
    authorHandle: "@ohassan_fc",
    authorInitials: "OH",
    sport: "Soccer",
    sportColor: colors.green,
    timeAgo: "8h",
    content:
      "Tactical analysis from yesterday's match: pressing triggers in the midfield third completely shut down their build-up. Defensive shape was immaculate all game.",
    hasImage: true,
    likes: 203,
    comments: 46,
    shares: 28,
  },
];

const TRENDING_TOPICS: TrendingTopic[] = [
  { id: "t1", tag: "#ProLeagueS4", posts: "2.4k" },
  { id: "t2", tag: "#VersaPlayMVP", posts: "1.8k" },
  { id: "t3", tag: "#WeekendWarriors", posts: "1.1k" },
  { id: "t4", tag: "#ClutchPlays", posts: "980" },
  { id: "t5", tag: "#RookieWatch", posts: "740" },
];

const SPOTLIGHT_PLAYERS: SpotlightPlayer[] = [
  {
    id: "s1",
    name: "Marcus Reed",
    initials: "MR",
    highlight: "98",
    highlightLabel: "Rating",
    color: colors.lime,
  },
  {
    id: "s2",
    name: "Jade Kim",
    initials: "JK",
    highlight: "31",
    highlightLabel: "Win Streak",
    color: colors.purple,
  },
  {
    id: "s3",
    name: "Darius Cole",
    initials: "DC",
    highlight: "92",
    highlightLabel: "Rating",
    color: colors.orange,
  },
];

// ── Component ──────────────────────────────────────────────────────
export default function CommunityScreen() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const formatCount = (count: number, liked: boolean, isLike: boolean) => {
    const adjusted = isLike && liked ? count + 1 : count;
    if (adjusted >= 1000) {
      return (adjusted / 1000).toFixed(1) + "k";
    }
    return adjusted.toString();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>COMMUNITY</Text>
        <Text style={styles.headerTitle}>Community Feed</Text>
        <Text style={styles.headerDesc}>
          See what players are talking about
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trending Topics */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.trendingRow}
          contentContainerStyle={styles.trendingRowContent}
        >
          {TRENDING_TOPICS.map((topic) => (
            <TouchableOpacity key={topic.id} style={styles.trendingChip}>
              <Text style={styles.trendingTag}>{topic.tag}</Text>
              <Text style={styles.trendingCount}>{topic.posts} posts</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Compose Bar */}
        <View style={styles.composeBar}>
          <View style={styles.composeAvatar}>
            <Text style={styles.composeAvatarText}>YO</Text>
          </View>
          <View style={styles.composeInput}>
            <Text style={styles.composeInputText}>Share something...</Text>
          </View>
        </View>

        {/* Feed Posts */}
        {FEED_POSTS.map((post) => {
          const isLiked = likedPosts.has(post.id);
          return (
            <View key={post.id} style={styles.postCard}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View
                  style={[
                    styles.postAvatar,
                    { borderColor: post.sportColor + "66" },
                  ]}
                >
                  <Text
                    style={[
                      styles.postAvatarText,
                      { color: post.sportColor },
                    ]}
                  >
                    {post.authorInitials}
                  </Text>
                </View>
                <View style={styles.postAuthorInfo}>
                  <View style={styles.postNameRow}>
                    <Text style={styles.postAuthorName}>
                      {post.authorName}
                    </Text>
                    <View
                      style={[
                        styles.sportBadge,
                        { backgroundColor: post.sportColor + "1A" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sportBadgeText,
                          { color: post.sportColor },
                        ]}
                      >
                        {post.sport}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.postMeta}>
                    {post.authorHandle} {"  "}
                    {post.timeAgo}
                  </Text>
                </View>
              </View>

              {/* Post Content */}
              <Text style={styles.postContent}>{post.content}</Text>

              {/* Image Placeholder */}
              {post.hasImage && (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderIcon}>IMG</Text>
                  <Text style={styles.imagePlaceholderText}>
                    Media Attachment
                  </Text>
                </View>
              )}

              {/* Engagement Bar */}
              <View style={styles.engagementBar}>
                <TouchableOpacity
                  style={styles.engagementButton}
                  onPress={() => toggleLike(post.id)}
                >
                  <View
                    style={[
                      styles.engagementIcon,
                      isLiked && styles.engagementIconActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.engagementIconText,
                        isLiked && styles.engagementIconTextActive,
                      ]}
                    >
                      {isLiked ? "♥" : "♡"}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.engagementCount,
                      isLiked && { color: colors.red },
                    ]}
                  >
                    {formatCount(post.likes, isLiked, true)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.engagementButton}>
                  <View style={styles.engagementIcon}>
                    <Text style={styles.engagementIconText}>💬</Text>
                  </View>
                  <Text style={styles.engagementCount}>{post.comments}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.engagementButton}>
                  <View style={styles.engagementIcon}>
                    <Text style={styles.engagementIconText}>↗</Text>
                  </View>
                  <Text style={styles.engagementCount}>{post.shares}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Player Spotlight */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>PLAYER SPOTLIGHT</Text>
          <Text style={styles.sectionTitle}>Top Performers</Text>

          {SPOTLIGHT_PLAYERS.map((player) => (
            <View key={player.id} style={styles.spotlightRow}>
              <View
                style={[
                  styles.spotlightAvatar,
                  { borderColor: player.color + "66" },
                ]}
              >
                <Text
                  style={[
                    styles.spotlightAvatarText,
                    { color: player.color },
                  ]}
                >
                  {player.initials}
                </Text>
              </View>
              <View style={styles.spotlightInfo}>
                <Text style={styles.spotlightName}>{player.name}</Text>
                <Text style={styles.spotlightMeta}>
                  {player.highlightLabel}
                </Text>
              </View>
              <View
                style={[
                  styles.spotlightValue,
                  { backgroundColor: player.color + "1A" },
                ]}
              >
                <Text
                  style={[
                    styles.spotlightValueText,
                    { color: player.color },
                  ]}
                >
                  {player.highlight}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Your Stats */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionLabel, { color: colors.blue }]}>
            YOUR STATS
          </Text>
          <Text style={styles.sectionTitle}>Season Overview</Text>

          <View style={styles.yourStatsGrid}>
            <View style={styles.yourStatItem}>
              <Text style={[styles.yourStatValue, { color: colors.lime }]}>
                24
              </Text>
              <Text style={styles.yourStatLabel}>Wins</Text>
            </View>
            <View style={styles.yourStatItem}>
              <Text style={[styles.yourStatValue, { color: colors.white }]}>
                96
              </Text>
              <Text style={styles.yourStatLabel}>Rating</Text>
            </View>
            <View style={styles.yourStatItem}>
              <Text style={[styles.yourStatValue, { color: colors.green }]}>
                89%
              </Text>
              <Text style={styles.yourStatLabel}>Win Rate</Text>
            </View>
            <View style={styles.yourStatItem}>
              <Text style={[styles.yourStatValue, { color: colors.orange }]}>
                #4
              </Text>
              <Text style={styles.yourStatLabel}>Rank</Text>
            </View>
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  scrollContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },

  // ── Trending Topics ──
  trendingRow: {
    marginBottom: spacing.lg,
  },
  trendingRowContent: {
    gap: spacing.sm,
  },
  trendingChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  trendingTag: {
    fontSize: fontSize.xs,
    fontWeight: "800",
    color: colors.lime,
  },
  trendingCount: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },

  // ── Compose Bar ──
  composeBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  composeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lime + "1A",
    borderWidth: 1,
    borderColor: colors.lime + "33",
    alignItems: "center",
    justifyContent: "center",
  },
  composeAvatarText: {
    fontSize: fontSize.sm,
    fontWeight: "800",
    color: colors.lime,
  },
  composeInput: {
    flex: 1,
    backgroundColor: colors.dark,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  composeInputText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  // ── Post Card ──
  postCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  postAvatarText: {
    fontSize: fontSize.sm,
    fontWeight: "900",
  },
  postAuthorInfo: {
    flex: 1,
  },
  postNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  postAuthorName: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.white,
  },
  sportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sportBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  postMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 3,
  },
  postContent: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.md,
  },

  // ── Image Placeholder ──
  imagePlaceholder: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  imagePlaceholderIcon: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.textMuted,
    marginBottom: 4,
  },
  imagePlaceholderText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },

  // ── Engagement Bar ──
  engagementBar: {
    flexDirection: "row",
    gap: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  engagementButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  engagementIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  engagementIconActive: {
    backgroundColor: colors.red + "1A",
  },
  engagementIconText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  engagementIconTextActive: {
    color: colors.red,
  },
  engagementCount: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
  },

  // ── Section Card (shared by Spotlight + Your Stats) ──
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.lime,
    letterSpacing: 2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.white,
    marginBottom: spacing.lg,
  },

  // ── Spotlight ──
  spotlightRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  spotlightAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  spotlightAvatarText: {
    fontSize: fontSize.sm,
    fontWeight: "900",
  },
  spotlightInfo: {
    flex: 1,
  },
  spotlightName: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.white,
  },
  spotlightMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  spotlightValue: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  spotlightValueText: {
    fontSize: fontSize.base,
    fontWeight: "900",
  },

  // ── Your Stats ──
  yourStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  yourStatItem: {
    flex: 1,
    minWidth: "40%",
    backgroundColor: colors.dark,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  yourStatValue: {
    fontSize: fontSize.xxl,
    fontWeight: "900",
  },
  yourStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },
});
