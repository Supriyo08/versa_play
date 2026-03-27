import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";

// ── Types ──────────────────────────────────────────────────────────
interface Club {
  id: string;
  name: string;
  sport: string;
  members: number;
  rating: number;
  distance: string;
  description: string;
  privacy: string;
  logo: string;
  verified: boolean;
  winRate: string;
  tournamentsWon: number;
}

interface MyRequest {
  id: string;
  clubName: string;
  clubSport: string;
  clubRating: number;
  clubLogo: string;
  status: "pending" | "accepted" | "rejected";
  message: string;
  requestDate: string;
}

// ── Mock Data ──────────────────────────────────────────────────────
const DISCOVER_CLUBS: Club[] = [
  { id: "nc1", name: "Phoenix United", sport: "Soccer", members: 980, rating: 2650, distance: "2.4 mi", description: "Premier soccer club with multiple championship titles.", privacy: "Invite Only", logo: "PU", verified: true, winRate: "68.2%", tournamentsWon: 11 },
  { id: "nc2", name: "Iron Wolves FC", sport: "Soccer", members: 1120, rating: 2780, distance: "5.1 mi", description: "Competitive club focused on tactical gameplay.", privacy: "Open", logo: "IW", verified: true, winRate: "71.8%", tournamentsWon: 16 },
  { id: "nc3", name: "City United Cricket", sport: "Cricket", members: 560, rating: 2420, distance: "3.8 mi", description: "Growing cricket club with a focus on T20 format.", privacy: "Open", logo: "CU", verified: false, winRate: "62.5%", tournamentsWon: 7 },
  { id: "nc4", name: "Storm Runners", sport: "Soccer", members: 740, rating: 2510, distance: "7.2 mi", description: "Fast-paced soccer club known for counter-attacking.", privacy: "Invite Only", logo: "SR", verified: true, winRate: "65.3%", tournamentsWon: 9 },
  { id: "nc5", name: "Thunder Riders CC", sport: "Cricket", members: 450, rating: 2300, distance: "4.5 mi", description: "Cricket club specializing in ODI and Test formats.", privacy: "Open", logo: "TR", verified: true, winRate: "59.8%", tournamentsWon: 5 },
  { id: "nc6", name: "Titans SC", sport: "Soccer", members: 1450, rating: 2900, distance: "9.6 mi", description: "One of the largest clubs in the region.", privacy: "Invite Only", logo: "TS", verified: true, winRate: "74.1%", tournamentsWon: 22 },
  { id: "nc7", name: "Royal Challengers XI", sport: "Cricket", members: 620, rating: 2550, distance: "8.1 mi", description: "Top-tier cricket club with IPL-style leagues.", privacy: "Invite Only", logo: "RC", verified: true, winRate: "67.9%", tournamentsWon: 13 },
];

const INITIAL_REQUESTS: MyRequest[] = [
  { id: "mr1", clubName: "Iron Wolves FC", clubSport: "Soccer", clubRating: 2780, clubLogo: "IW", status: "pending", message: "Experienced midfielder looking for a competitive team.", requestDate: "2025-01-12" },
  { id: "mr2", clubName: "Phoenix United", clubSport: "Soccer", clubRating: 2650, clubLogo: "PU", status: "accepted", message: "Former captain of Metro FC.", requestDate: "2025-01-05" },
];

// ── Tabs ────────────────────────────────────────────────────────────
type TabKey = "discover" | "requests";

export default function ClubsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [myRequests, setMyRequests] = useState<MyRequest[]>(INITIAL_REQUESTS);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  // Join modal state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [sending, setSending] = useState(false);

  const uniqueSports = ["All", ...Array.from(new Set(DISCOVER_CLUBS.map((c) => c.sport)))];

  const filteredClubs = DISCOVER_CLUBS.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.sport.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === "All" || club.sport === sportFilter;
    return matchesSearch && matchesSport;
  });

  const pendingCount = myRequests.filter((r) => r.status === "pending").length;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleSendRequest = () => {
    if (!selectedClub) return;
    setSending(true);
    setTimeout(() => {
      const newReq: MyRequest = {
        id: `mr-${Date.now()}`,
        clubName: selectedClub.name,
        clubSport: selectedClub.sport,
        clubRating: selectedClub.rating,
        clubLogo: selectedClub.logo,
        status: "pending",
        message: joinMessage,
        requestDate: new Date().toISOString().split("T")[0],
      };
      setMyRequests((prev) => [newReq, ...prev]);
      setSentRequests((prev) => new Set(prev).add(selectedClub.id));
      setSending(false);
      setShowJoinModal(false);
      setJoinMessage("");
      setSelectedClub(null);
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return colors.orange;
      case "accepted": return colors.green;
      case "rejected": return colors.red;
      default: return colors.textDim;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>CLUBS</Text>
        <Text style={styles.headerTitle}>Find Your Club</Text>
        <Text style={styles.headerDesc}>Discover and join clubs to compete</Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "discover" && styles.tabActive]}
          onPress={() => setActiveTab("discover")}
        >
          <Text style={[styles.tabText, activeTab === "discover" && styles.tabTextActive]}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "requests" && styles.tabActive]}
          onPress={() => setActiveTab("requests")}
        >
          <Text style={[styles.tabText, activeTab === "requests" && styles.tabTextActive]}>
            My Requests
          </Text>
          {pendingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.lime} />}
      >
        {/* ═══════ DISCOVER TAB ═══════ */}
        {activeTab === "discover" && (
          <>
            {/* Search */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search clubs..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Sport Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {uniqueSports.map((sport) => (
                <TouchableOpacity
                  key={sport}
                  style={[styles.filterChip, sportFilter === sport && styles.filterChipActive]}
                  onPress={() => setSportFilter(sport)}
                >
                  <Text style={[styles.filterChipText, sportFilter === sport && styles.filterChipTextActive]}>
                    {sport}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Club Cards */}
            {filteredClubs.map((club) => {
              const alreadyRequested = sentRequests.has(club.id) || myRequests.some((r) => r.clubName === club.name && r.status === "pending");
              return (
                <View key={club.id} style={styles.clubCard}>
                  {/* Club header */}
                  <View style={styles.clubHeader}>
                    <View style={styles.clubLogo}>
                      <Text style={styles.clubLogoText}>{club.logo}</Text>
                    </View>
                    <View style={styles.clubInfo}>
                      <View style={styles.clubNameRow}>
                        <Text style={styles.clubName}>{club.name}</Text>
                        {club.verified && (
                          <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>Verified</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.clubMeta}>
                        {club.sport}  •  {club.distance}  •  {club.privacy}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.clubDescription} numberOfLines={2}>{club.description}</Text>

                  {/* Stats row */}
                  <View style={styles.clubStatsRow}>
                    <View style={styles.clubStat}>
                      <Text style={[styles.clubStatValue, { color: colors.lime }]}>{club.rating}</Text>
                      <Text style={styles.clubStatLabel}>Rating</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.clubStat}>
                      <Text style={styles.clubStatValue}>{club.members}</Text>
                      <Text style={styles.clubStatLabel}>Members</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.clubStat}>
                      <Text style={[styles.clubStatValue, { color: colors.green }]}>{club.winRate}</Text>
                      <Text style={styles.clubStatLabel}>Win Rate</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.clubStat}>
                      <Text style={[styles.clubStatValue, { color: colors.orange }]}>{club.tournamentsWon}</Text>
                      <Text style={styles.clubStatLabel}>Trophies</Text>
                    </View>
                  </View>

                  {/* Action Button */}
                  {alreadyRequested ? (
                    <View style={styles.pendingButton}>
                      <Text style={styles.pendingButtonText}>Request Pending</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.joinButton}
                      onPress={() => {
                        setSelectedClub(club);
                        setShowJoinModal(true);
                      }}
                    >
                      <Text style={styles.joinButtonText}>Request to Join</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}

            {filteredClubs.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No clubs found</Text>
                <Text style={styles.emptyDesc}>Try adjusting your search or filters</Text>
              </View>
            )}

            <View style={{ height: 40 }} />
          </>
        )}

        {/* ═══════ MY REQUESTS TAB ═══════ */}
        {activeTab === "requests" && (
          <>
            {/* Stats summary */}
            <View style={styles.requestStatsRow}>
              <View style={styles.requestStatCard}>
                <Text style={[styles.requestStatValue, { color: colors.orange }]}>
                  {myRequests.filter((r) => r.status === "pending").length}
                </Text>
                <Text style={styles.requestStatLabel}>Pending</Text>
              </View>
              <View style={styles.requestStatCard}>
                <Text style={[styles.requestStatValue, { color: colors.green }]}>
                  {myRequests.filter((r) => r.status === "accepted").length}
                </Text>
                <Text style={styles.requestStatLabel}>Accepted</Text>
              </View>
              <View style={styles.requestStatCard}>
                <Text style={[styles.requestStatValue, { color: colors.red }]}>
                  {myRequests.filter((r) => r.status === "rejected").length}
                </Text>
                <Text style={styles.requestStatLabel}>Rejected</Text>
              </View>
            </View>

            {myRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No requests yet</Text>
                <Text style={styles.emptyDesc}>Browse clubs and send join requests</Text>
              </View>
            ) : (
              myRequests.map((req) => (
                <View
                  key={req.id}
                  style={[styles.requestCard, req.status === "rejected" && { opacity: 0.6 }]}
                >
                  <View style={styles.requestHeader}>
                    <View style={styles.requestLogo}>
                      <Text style={styles.requestLogoText}>{req.clubLogo}</Text>
                    </View>
                    <View style={styles.requestInfo}>
                      <View style={styles.requestNameRow}>
                        <Text style={styles.requestClubName}>{req.clubName}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(req.status) + "1A" }]}>
                          <Text style={[styles.statusText, { color: getStatusColor(req.status) }]}>
                            {(req.status || "").toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.requestMeta}>
                        {req.clubSport}  •  Rating: {req.clubRating}
                      </Text>
                    </View>
                  </View>

                  {req.message ? (
                    <Text style={styles.requestMessage} numberOfLines={2}>
                      &quot;{req.message}&quot;
                    </Text>
                  ) : null}

                  <Text style={styles.requestDate}>
                    Requested {new Date(req.requestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </Text>

                  {req.status === "accepted" && (
                    <TouchableOpacity style={styles.viewClubButton}>
                      <Text style={styles.viewClubButtonText}>View Club</Text>
                    </TouchableOpacity>
                  )}
                  {req.status === "pending" && (
                    <TouchableOpacity style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>Cancel Request</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}

            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>

      {/* ═══════ JOIN REQUEST MODAL ═══════ */}
      <Modal visible={showJoinModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                {selectedClub && (
                  <View style={styles.modalLogo}>
                    <Text style={styles.modalLogoText}>{selectedClub.logo}</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.modalTitle}>Request to Join</Text>
                  <Text style={styles.modalSubtitle}>{selectedClub?.name}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowJoinModal(false);
                  setSelectedClub(null);
                  setJoinMessage("");
                }}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>X</Text>
              </TouchableOpacity>
            </View>

            {/* Club Stats */}
            {selectedClub && (
              <View style={styles.modalStats}>
                <View style={styles.modalStatItem}>
                  <Text style={[styles.modalStatValue, { color: colors.lime }]}>{selectedClub.rating}</Text>
                  <Text style={styles.modalStatLabel}>Rating</Text>
                </View>
                <View style={styles.modalStatDivider} />
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatValue}>{selectedClub.members}</Text>
                  <Text style={styles.modalStatLabel}>Members</Text>
                </View>
                <View style={styles.modalStatDivider} />
                <View style={styles.modalStatItem}>
                  <Text style={[styles.modalStatValue, { color: colors.green }]}>{selectedClub.winRate}</Text>
                  <Text style={styles.modalStatLabel}>Win Rate</Text>
                </View>
              </View>
            )}

            {/* Message Input */}
            <Text style={styles.inputLabel}>Message to Club Admin (optional)</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Tell them about yourself..."
              placeholderTextColor={colors.textMuted}
              value={joinMessage}
              onChangeText={setJoinMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Info banner */}
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerText}>
                Your profile info (name, rating, skills) will be shared with the club admin.
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => {
                  setShowJoinModal(false);
                  setSelectedClub(null);
                  setJoinMessage("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSend, sending && { opacity: 0.6 }]}
                onPress={handleSendRequest}
                disabled={sending}
              >
                {sending ? (
                  <ActivityIndicator size="small" color={colors.dark} />
                ) : (
                  <Text style={styles.modalSendText}>Send Request</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  tabBar: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  tabActive: {
    backgroundColor: colors.lime,
  },
  tabText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
  },
  tabTextActive: {
    color: colors.dark,
  },
  badge: {
    backgroundColor: colors.red,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  // Search
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.sm,
    color: colors.white,
  },
  // Filters
  filterRow: {
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  filterChipText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
    textTransform: "uppercase",
  },
  filterChipTextActive: {
    color: colors.dark,
  },
  // Club Card
  clubCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  clubHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.lg,
    paddingBottom: 0,
    gap: spacing.md,
  },
  clubLogo: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.lime}1A`,
    borderWidth: 1,
    borderColor: `${colors.lime}33`,
    alignItems: "center",
    justifyContent: "center",
  },
  clubLogoText: {
    fontSize: fontSize.md,
    fontWeight: "900",
    color: colors.lime,
  },
  clubInfo: {
    flex: 1,
  },
  clubNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  clubName: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.white,
  },
  verifiedBadge: {
    backgroundColor: `${colors.green}1A`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.green,
    textTransform: "uppercase",
  },
  clubMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 3,
  },
  clubDescription: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    lineHeight: 18,
  },
  clubStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clubStat: {
    flex: 1,
    alignItems: "center",
  },
  clubStatValue: {
    fontSize: fontSize.sm,
    fontWeight: "800",
    color: colors.white,
  },
  clubStatLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: "uppercase",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  // Join Button
  joinButton: {
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: colors.lime,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  joinButtonText: {
    fontSize: fontSize.sm,
    fontWeight: "800",
    color: colors.dark,
  },
  pendingButton: {
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: `${colors.orange}1A`,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  pendingButtonText: {
    fontSize: fontSize.sm,
    fontWeight: "800",
    color: colors.orange,
  },
  // Empty State
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxxl,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: fontSize.sm,
    color: colors.textDim,
  },
  // Request Stats
  requestStatsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  requestStatCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
  },
  requestStatValue: {
    fontSize: fontSize.xxl,
    fontWeight: "900",
    color: colors.white,
  },
  requestStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: "uppercase",
    marginTop: 4,
  },
  // Request Card
  requestCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  requestLogo: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.blue}1A`,
    borderWidth: 1,
    borderColor: `${colors.blue}33`,
    alignItems: "center",
    justifyContent: "center",
  },
  requestLogoText: {
    fontSize: fontSize.sm,
    fontWeight: "800",
    color: colors.blue,
  },
  requestInfo: {
    flex: 1,
  },
  requestNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  requestClubName: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.white,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },
  requestMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 3,
  },
  requestMessage: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    fontStyle: "italic",
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  requestDate: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  viewClubButton: {
    marginTop: spacing.md,
    backgroundColor: `${colors.green}1A`,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  viewClubButtonText: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.green,
  },
  cancelButton: {
    marginTop: spacing.md,
    backgroundColor: `${colors.red}0D`,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.red,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  modalLogo: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.lime}1A`,
    borderWidth: 1,
    borderColor: `${colors.lime}33`,
    alignItems: "center",
    justifyContent: "center",
  },
  modalLogoText: {
    fontSize: fontSize.md,
    fontWeight: "900",
    color: colors.lime,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.white,
  },
  modalSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    marginTop: 2,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textMuted,
  },
  modalStats: {
    flexDirection: "row",
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  modalStatItem: {
    flex: 1,
    alignItems: "center",
  },
  modalStatValue: {
    fontSize: fontSize.base,
    fontWeight: "800",
    color: colors.white,
  },
  modalStatLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: "uppercase",
    marginTop: 2,
  },
  modalStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    marginBottom: spacing.sm,
  },
  messageInput: {
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.white,
    minHeight: 100,
    marginBottom: spacing.md,
  },
  infoBanner: {
    backgroundColor: `${colors.orange}0D`,
    borderWidth: 1,
    borderColor: `${colors.orange}1A`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  infoBannerText: {
    fontSize: fontSize.xs,
    color: colors.orange,
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  modalCancelText: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textDim,
  },
  modalSend: {
    flex: 2,
    backgroundColor: colors.lime,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  modalSendText: {
    fontSize: fontSize.sm,
    fontWeight: "800",
    color: colors.dark,
  },
});
