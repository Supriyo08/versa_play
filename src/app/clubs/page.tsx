"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";

// ── Types ────────────────────────────────────────────────────────────────────
type Tab = "members" | "requests" | "tournaments" | "settings";
type PlayerTab = "discover" | "my-requests" | "my-club";
type MemberRole = "Captain" | "Player" | "Coach";
type MemberStatus = "Active" | "Inactive" | "Injured";
type RequestStatus = "pending" | "accepted" | "rejected";
type TournamentStatus = "Registered" | "In Progress" | "Completed" | "Upcoming";
type Privacy = "Open" | "Invite Only" | "Closed";

interface ClubMember {
  id: string;
  name: string;
  avatar: string;
  role: MemberRole;
  rating: number;
  joinDate: string;
  status: MemberStatus;
}

interface JoinRequest {
  id: string;
  playerName: string;
  avatar: string;
  rating: number;
  position: string;
  requestDate: string;
  message: string;
  status: RequestStatus;
}

interface ClubTournament {
  id: string;
  name: string;
  sport: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  placement: string | null;
  prize: string | null;
}

interface DiscoverClub {
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
  status: RequestStatus;
  message: string;
  requestDate: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────
const CLUB = {
  name: "Velocity Strikers FC",
  sport: "Soccer",
  memberCount: "1.3K+",
  description:
    "Elite competitive soccer club founded in 2019. We compete at the highest level across regional and national tournaments. Our roster blends experienced veterans with rising talent.",
  stats: {
    winRate: "72.4%",
    tournamentsWon: 14,
    activeMembers: 48,
  },
  logo: "VS",
};

const CLUB_STATS = [
  { label: "Total Members", value: "1,342", icon: "users", color: "text-vp-blue" },
  { label: "Active Players", value: "48", icon: "zap", color: "text-vp-green" },
  { label: "Matches This Season", value: "126", icon: "target", color: "text-vp-orange" },
  { label: "Club Rating", value: "2,847", icon: "star", color: "text-vp-lime" },
];

const MEMBERS: ClubMember[] = [
  { id: "m1", name: "Marcus Rivera", avatar: "MR", role: "Captain", rating: 2410, joinDate: "2019-03-15", status: "Active" },
  { id: "m2", name: "Elena Vasquez", avatar: "EV", role: "Player", rating: 2285, joinDate: "2020-08-22", status: "Active" },
  { id: "m3", name: "Jordan Mitchell", avatar: "JM", role: "Coach", rating: 2190, joinDate: "2019-01-10", status: "Active" },
  { id: "m4", name: "Aisha Patel", avatar: "AP", role: "Player", rating: 2150, joinDate: "2021-05-18", status: "Active" },
  { id: "m5", name: "Liam O'Brien", avatar: "LO", role: "Player", rating: 2095, joinDate: "2022-01-03", status: "Inactive" },
  { id: "m6", name: "Sofia Chen", avatar: "SC", role: "Player", rating: 2040, joinDate: "2022-06-14", status: "Active" },
  { id: "m7", name: "Kai Nakamura", avatar: "KN", role: "Player", rating: 1985, joinDate: "2023-02-28", status: "Injured" },
  { id: "m8", name: "Zara Thompson", avatar: "ZT", role: "Player", rating: 1920, joinDate: "2023-07-09", status: "Active" },
  { id: "m9", name: "Diego Fernandez", avatar: "DF", role: "Player", rating: 1875, joinDate: "2024-01-20", status: "Active" },
  { id: "m10", name: "Nina Johansson", avatar: "NJ", role: "Player", rating: 1830, joinDate: "2024-04-05", status: "Inactive" },
];

const JOIN_REQUESTS: JoinRequest[] = [
  { id: "r1", playerName: "Alex Turner", avatar: "AT", rating: 2120, position: "Midfielder", requestDate: "2025-01-10", message: "Experienced midfielder with 5 years of competitive play. Looking for a strong team to compete at nationals.", status: "pending" },
  { id: "r2", playerName: "Priya Sharma", avatar: "PS", rating: 1980, position: "Goalkeeper", requestDate: "2025-01-09", message: "Goalkeeper with regional tournament experience. Currently a free agent.", status: "pending" },
  { id: "r3", playerName: "Lucas Martin", avatar: "LM", rating: 2050, position: "Striker", requestDate: "2025-01-08", message: "Top scorer in the metro league last season. Ready for the next challenge.", status: "pending" },
  { id: "r4", playerName: "Fatima Al-Hassan", avatar: "FA", rating: 1890, position: "Defender", requestDate: "2025-01-07", message: "Solid defender with strong tactical awareness. Available for immediate roster entry.", status: "pending" },
];

const CLUB_TOURNAMENTS: ClubTournament[] = [
  { id: "t1", name: "National Pro League S8", sport: "Soccer", startDate: "2025-02-01", endDate: "2025-04-30", status: "In Progress", placement: "3rd / 24", prize: "$15,000" },
  { id: "t2", name: "Metro Cup 2025", sport: "Soccer", startDate: "2025-03-15", endDate: "2025-03-22", status: "Registered", placement: null, prize: "$5,000" },
  { id: "t3", name: "Champions Invitational", sport: "Soccer", startDate: "2025-05-10", endDate: "2025-05-12", status: "Upcoming", placement: null, prize: "$25,000" },
  { id: "t4", name: "Regional Showdown S7", sport: "Soccer", startDate: "2024-09-01", endDate: "2024-11-30", status: "Completed", placement: "1st / 16", prize: "$10,000" },
  { id: "t5", name: "Winter Classic 2024", sport: "Soccer", startDate: "2024-12-05", endDate: "2024-12-08", status: "Completed", placement: "2nd / 12", prize: "$7,500" },
];

const DISCOVER_CLUBS: DiscoverClub[] = [
  { id: "nc1", name: "Phoenix United", sport: "Soccer", members: 980, rating: 2650, distance: "2.4 mi", description: "Premier soccer club with multiple championship titles. Known for aggressive play style and youth development programs.", privacy: "Invite Only", logo: "PU", verified: true, winRate: "68.2%", tournamentsWon: 11 },
  { id: "nc2", name: "Iron Wolves FC", sport: "Soccer", members: 1120, rating: 2780, distance: "5.1 mi", description: "Competitive club focused on tactical gameplay. Open tryouts every month for skilled players.", privacy: "Open", logo: "IW", verified: true, winRate: "71.8%", tournamentsWon: 16 },
  { id: "nc3", name: "City United Cricket", sport: "Cricket", members: 560, rating: 2420, distance: "3.8 mi", description: "Growing cricket club with a focus on T20 format. Looking for bowlers and all-rounders.", privacy: "Open", logo: "CU", verified: false, winRate: "62.5%", tournamentsWon: 7 },
  { id: "nc4", name: "Storm Runners", sport: "Soccer", members: 740, rating: 2510, distance: "7.2 mi", description: "Fast-paced soccer club known for counter-attacking strategy. Multiple youth development tiers.", privacy: "Invite Only", logo: "SR", verified: true, winRate: "65.3%", tournamentsWon: 9 },
  { id: "nc5", name: "Thunder Riders CC", sport: "Cricket", members: 450, rating: 2300, distance: "4.5 mi", description: "Cricket club specializing in ODI and Test formats. Strong batting lineup with experienced coaches.", privacy: "Open", logo: "TR", verified: true, winRate: "59.8%", tournamentsWon: 5 },
  { id: "nc6", name: "Titans SC", sport: "Soccer", members: 1450, rating: 2900, distance: "9.6 mi", description: "One of the largest clubs in the region. Professional coaching staff and state-of-the-art training facilities.", privacy: "Invite Only", logo: "TS", verified: true, winRate: "74.1%", tournamentsWon: 22 },
  { id: "nc7", name: "Apex Athletics", sport: "Basketball", members: 380, rating: 2180, distance: "6.3 mi", description: "Multi-sport club with strong basketball division. Regular scrimmages and tournament participation.", privacy: "Open", logo: "AA", verified: false, winRate: "55.7%", tournamentsWon: 4 },
  { id: "nc8", name: "Royal Challengers XI", sport: "Cricket", members: 620, rating: 2550, distance: "8.1 mi", description: "Top-tier cricket club with IPL-style leagues. Known for big-hitting batsmen and spin bowlers.", privacy: "Invite Only", logo: "RC", verified: true, winRate: "67.9%", tournamentsWon: 13 },
];

const MY_REQUESTS: MyRequest[] = [
  { id: "mr1", clubName: "Iron Wolves FC", clubSport: "Soccer", clubRating: 2780, clubLogo: "IW", status: "pending", message: "I'm an experienced midfielder looking to join a competitive team.", requestDate: "2025-01-12" },
  { id: "mr2", clubName: "Phoenix United", clubSport: "Soccer", clubRating: 2650, clubLogo: "PU", status: "accepted", message: "Former captain of Metro FC. Looking for new challenges.", requestDate: "2025-01-05" },
  { id: "mr3", clubName: "Titans SC", clubSport: "Soccer", clubRating: 2900, clubLogo: "TS", status: "rejected", message: "Top scorer in regional league. Ready to compete at higher levels.", requestDate: "2024-12-20" },
];

// ── Icons (inline SVGs) ──────────────────────────────────────────────────────
function IconUsers({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconZap({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconTarget({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconSearch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconTrophy({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  );
}

function IconShield({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconMapPin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconUpload({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconCrown({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M3 20h18" />
    </svg>
  );
}

function IconSend({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconGlobe({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

// ── Stat icon map ────────────────────────────────────────────────────────────
const STAT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  users: IconUsers,
  zap: IconZap,
  target: IconTarget,
  star: IconStar,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function roleBadgeClasses(role: MemberRole) {
  switch (role) {
    case "Captain":
      return "bg-vp-lime/15 text-vp-lime";
    case "Coach":
      return "bg-vp-purple/15 text-vp-purple";
    default:
      return "bg-vp-blue/15 text-vp-blue";
  }
}

function statusDotColor(status: MemberStatus) {
  switch (status) {
    case "Active":
      return "bg-vp-green";
    case "Inactive":
      return "bg-vp-text-muted";
    case "Injured":
      return "bg-vp-red";
  }
}

function tournamentStatusClasses(status: TournamentStatus) {
  switch (status) {
    case "In Progress":
      return "bg-vp-blue/10 text-vp-blue";
    case "Registered":
      return "bg-vp-green/10 text-vp-green";
    case "Upcoming":
      return "bg-vp-orange/10 text-vp-orange";
    case "Completed":
      return "bg-vp-text-muted/10 text-vp-text-muted";
  }
}

function requestStatusClasses(status: RequestStatus) {
  switch (status) {
    case "pending":
      return "bg-vp-orange/10 text-vp-orange";
    case "accepted":
      return "bg-vp-green/10 text-vp-green";
    case "rejected":
      return "bg-vp-red/10 text-vp-red";
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// PLAYER VIEW - Browse Clubs, Request to Join, Track Requests
// ══════════════════════════════════════════════════════════════════════════════

function PlayerClubView() {
  const [activeTab, setActiveTab] = useState<PlayerTab>("discover");
  const [clubSearch, setClubSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("All");
  const [selectedClub, setSelectedClub] = useState<DiscoverClub | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [myRequests, setMyRequests] = useState<MyRequest[]>(MY_REQUESTS);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  // Filter clubs
  const filteredClubs = DISCOVER_CLUBS.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
      club.sport.toLowerCase().includes(clubSearch.toLowerCase());
    const matchesSport = sportFilter === "All" || club.sport === sportFilter;
    return matchesSearch && matchesSport;
  });

  const uniqueSports = ["All", ...Array.from(new Set(DISCOVER_CLUBS.map((c) => c.sport)))];

  // Handle join request
  const handleSendRequest = (club: DiscoverClub) => {
    setSendingRequest(true);
    // Simulate API call
    setTimeout(() => {
      const newRequest: MyRequest = {
        id: `mr-${Date.now()}`,
        clubName: club.name,
        clubSport: club.sport,
        clubRating: club.rating,
        clubLogo: club.logo,
        status: "pending",
        message: joinMessage,
        requestDate: new Date().toISOString().split("T")[0],
      };
      setMyRequests((prev) => [newRequest, ...prev]);
      setSentRequests((prev) => new Set(prev).add(club.id));
      setSendingRequest(false);
      setShowJoinModal(false);
      setJoinMessage("");
      setSelectedClub(null);
    }, 800);
  };

  const playerTabs: { key: PlayerTab; label: string; count?: number }[] = [
    { key: "discover", label: "Discover Clubs", count: DISCOVER_CLUBS.length },
    { key: "my-requests", label: "My Requests", count: myRequests.filter((r) => r.status === "pending").length },
    { key: "my-club", label: "My Club" },
  ];

  return (
    <div className="px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <IconGlobe className="w-5 h-5 text-vp-lime" />
          <span className="text-xs font-bold text-vp-lime uppercase tracking-widest">Clubs</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-black text-white">Find Your Club</h1>
        <p className="text-sm text-vp-text-dim mt-1">Discover and join clubs to compete in tournaments and grow your skills</p>
      </div>

      {/* Player Tabs */}
      <div className="flex gap-1 bg-vp-card rounded-xl p-1 w-fit border border-vp-border mb-6">
        {playerTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-vp-lime text-vp-dark"
                : "text-vp-text-dim hover:text-white"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.key
                    ? "bg-vp-dark/20 text-vp-dark"
                    : "bg-vp-border text-vp-text-muted"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════ DISCOVER CLUBS TAB ═══════ */}
      {activeTab === "discover" && (
        <div>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vp-text-muted" />
              <input
                type="text"
                placeholder="Search clubs by name or sport..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                className="w-full bg-vp-card border border-vp-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30"
              />
            </div>
            <div className="flex bg-vp-card rounded-lg border border-vp-border p-0.5">
              {uniqueSports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSportFilter(sport)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-md uppercase transition-colors ${
                    sportFilter === sport
                      ? "bg-vp-lime text-vp-dark"
                      : "text-vp-text-dim hover:text-white"
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* Club Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredClubs.map((club) => {
              const alreadyRequested = sentRequests.has(club.id) || myRequests.some((r) => r.clubName === club.name && r.status === "pending");
              return (
                <div
                  key={club.id}
                  className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden hover:border-vp-lime/20 transition-all group"
                >
                  {/* Card header with gradient */}
                  <div className="relative p-5 pb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-vp-lime/5 via-transparent to-vp-blue/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-vp-lime/15 border border-vp-lime/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-black text-vp-lime">{club.logo}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white truncate">{club.name}</h3>
                          {club.verified && (
                            <span className="inline-flex items-center gap-1 bg-vp-green/15 text-vp-green text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                              <span className="w-1 h-1 rounded-full bg-vp-green" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-vp-text-muted">
                          <span className="text-vp-text-dim font-medium">{club.sport}</span>
                          <span className="w-1 h-1 rounded-full bg-vp-text-muted" />
                          <span>{club.distance}</span>
                          <span className="w-1 h-1 rounded-full bg-vp-text-muted" />
                          <span>{club.privacy}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-vp-text-dim mt-3 leading-relaxed line-clamp-2">
                      {club.description}
                    </p>
                  </div>

                  {/* Stats row */}
                  <div className="px-5 py-3 border-t border-vp-border flex items-center gap-4">
                    <div>
                      <p className="text-xs font-bold text-vp-lime">{club.rating.toLocaleString()}</p>
                      <p className="text-[9px] text-vp-text-muted uppercase">Rating</p>
                    </div>
                    <div className="w-px h-6 bg-vp-border" />
                    <div>
                      <p className="text-xs font-bold text-white">{club.members}</p>
                      <p className="text-[9px] text-vp-text-muted uppercase">Members</p>
                    </div>
                    <div className="w-px h-6 bg-vp-border" />
                    <div>
                      <p className="text-xs font-bold text-vp-green">{club.winRate}</p>
                      <p className="text-[9px] text-vp-text-muted uppercase">Win Rate</p>
                    </div>
                    <div className="w-px h-6 bg-vp-border" />
                    <div>
                      <p className="text-xs font-bold text-vp-orange">{club.tournamentsWon}</p>
                      <p className="text-[9px] text-vp-text-muted uppercase">Trophies</p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="px-5 py-3 border-t border-vp-border">
                    {alreadyRequested ? (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-vp-orange/10 text-vp-orange px-4 py-2.5 rounded-xl text-xs font-bold cursor-not-allowed"
                      >
                        <IconClock className="w-3.5 h-3.5" />
                        Request Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedClub(club);
                          setShowJoinModal(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-vp-lime text-vp-dark px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-vp-lime-dark transition-colors"
                      >
                        <IconSend className="w-3.5 h-3.5" />
                        Request to Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredClubs.length === 0 && (
            <div className="bg-vp-card rounded-2xl border border-vp-border p-10 text-center">
              <IconSearch className="w-8 h-8 text-vp-text-muted mx-auto mb-3" />
              <p className="text-sm font-semibold text-white mb-1">No clubs found</p>
              <p className="text-xs text-vp-text-dim">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* ═══════ MY REQUESTS TAB ═══════ */}
      {activeTab === "my-requests" && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="bg-vp-card rounded-2xl border border-vp-border p-10 text-center">
              <IconSend className="w-8 h-8 text-vp-text-muted mx-auto mb-3" />
              <p className="text-sm font-semibold text-white mb-1">No requests yet</p>
              <p className="text-xs text-vp-text-dim">Browse clubs and send join requests to get started</p>
            </div>
          ) : (
            <>
              {/* Stats summary */}
              <div className="grid grid-cols-3 gap-4 mb-2">
                <div className="bg-vp-card rounded-2xl border border-vp-border p-5 text-center">
                  <p className="text-2xl font-black text-vp-orange">{myRequests.filter((r) => r.status === "pending").length}</p>
                  <p className="text-[10px] text-vp-text-muted uppercase tracking-wider mt-1">Pending</p>
                </div>
                <div className="bg-vp-card rounded-2xl border border-vp-border p-5 text-center">
                  <p className="text-2xl font-black text-vp-green">{myRequests.filter((r) => r.status === "accepted").length}</p>
                  <p className="text-[10px] text-vp-text-muted uppercase tracking-wider mt-1">Accepted</p>
                </div>
                <div className="bg-vp-card rounded-2xl border border-vp-border p-5 text-center">
                  <p className="text-2xl font-black text-vp-red">{myRequests.filter((r) => r.status === "rejected").length}</p>
                  <p className="text-[10px] text-vp-text-muted uppercase tracking-wider mt-1">Rejected</p>
                </div>
              </div>

              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className={`bg-vp-card rounded-2xl border border-vp-border p-6 transition-opacity ${
                    req.status === "rejected" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-vp-blue/15 border border-vp-blue/20 flex items-center justify-center text-sm font-bold text-vp-blue flex-shrink-0">
                        {req.clubLogo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{req.clubName}</h4>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${requestStatusClasses(req.status)}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-vp-text-muted">
                          <span>{req.clubSport}</span>
                          <span className="w-1 h-1 rounded-full bg-vp-text-muted" />
                          <span>Rating: {req.clubRating}</span>
                        </div>
                        {req.message && (
                          <p className="text-xs text-vp-text-dim mt-2 leading-relaxed italic">&quot;{req.message}&quot;</p>
                        )}
                        <p className="text-[10px] text-vp-text-muted mt-2">
                          Requested {new Date(req.requestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {req.status === "accepted" && (
                        <button className="inline-flex items-center gap-1.5 bg-vp-green/15 text-vp-green px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-vp-green/25 transition-colors">
                          <IconCheck className="w-3.5 h-3.5" />
                          View Club
                        </button>
                      )}
                      {req.status === "pending" && (
                        <button className="inline-flex items-center gap-1.5 bg-vp-red/10 text-vp-red px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-vp-red/20 transition-colors">
                          <IconX className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ═══════ MY CLUB TAB ═══════ */}
      {activeTab === "my-club" && (
        <div className="bg-vp-card rounded-2xl border border-vp-border p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-vp-lime/10 flex items-center justify-center mx-auto mb-4">
            <IconShield className="w-8 h-8 text-vp-lime" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Club Membership</h3>
          <p className="text-sm text-vp-text-dim max-w-md mx-auto mb-6">
            You are not a member of any club yet. Browse available clubs and send a join request to get started.
          </p>
          <button
            onClick={() => setActiveTab("discover")}
            className="inline-flex items-center gap-2 bg-vp-lime text-vp-dark px-6 py-3 rounded-xl text-sm font-bold hover:bg-vp-lime-dark transition-colors"
          >
            <IconGlobe className="w-4 h-4" />
            Discover Clubs
          </button>
        </div>
      )}

      {/* ═══════ JOIN REQUEST MODAL ═══════ */}
      {showJoinModal && selectedClub && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-vp-card rounded-2xl border border-vp-border w-full max-w-lg overflow-hidden">
            {/* Modal header */}
            <div className="p-6 border-b border-vp-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-vp-lime/15 border border-vp-lime/20 flex items-center justify-center">
                    <span className="text-lg font-black text-vp-lime">{selectedClub.logo}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Request to Join</h3>
                    <p className="text-xs text-vp-text-dim">{selectedClub.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setSelectedClub(null);
                    setJoinMessage("");
                  }}
                  className="w-8 h-8 rounded-lg bg-vp-dark flex items-center justify-center text-vp-text-muted hover:text-white transition-colors"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {/* Club info */}
              <div className="flex items-center gap-6 p-4 bg-vp-dark rounded-xl">
                <div className="text-center">
                  <p className="text-sm font-bold text-vp-lime">{selectedClub.rating.toLocaleString()}</p>
                  <p className="text-[9px] text-vp-text-muted uppercase">Rating</p>
                </div>
                <div className="w-px h-8 bg-vp-border" />
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{selectedClub.members}</p>
                  <p className="text-[9px] text-vp-text-muted uppercase">Members</p>
                </div>
                <div className="w-px h-8 bg-vp-border" />
                <div className="text-center">
                  <p className="text-sm font-bold text-vp-green">{selectedClub.winRate}</p>
                  <p className="text-[9px] text-vp-text-muted uppercase">Win Rate</p>
                </div>
                <div className="w-px h-8 bg-vp-border" />
                <div className="text-center">
                  <p className="text-sm font-bold text-vp-text-dim">{selectedClub.privacy}</p>
                  <p className="text-[9px] text-vp-text-muted uppercase">Privacy</p>
                </div>
              </div>

              {/* Message input */}
              <div>
                <label className="block text-xs text-vp-text-dim mb-1.5">
                  Message to Club Admin <span className="text-vp-text-muted">(optional)</span>
                </label>
                <textarea
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  rows={4}
                  placeholder="Tell them about yourself, your experience, and why you'd like to join..."
                  className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-vp-orange/5 border border-vp-orange/10">
                <p className="text-[10px] text-vp-orange leading-relaxed">
                  Your profile information (name, rating, position, skills) will be shared with the club admin along with this request.
                  {selectedClub.privacy === "Invite Only" && " This club requires admin approval for all join requests."}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-6 border-t border-vp-border flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setSelectedClub(null);
                  setJoinMessage("");
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-vp-text-dim hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendRequest(selectedClub)}
                disabled={sendingRequest}
                className="inline-flex items-center gap-2 bg-vp-lime text-vp-dark px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-vp-lime-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingRequest ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-vp-dark/30 border-t-vp-dark rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <IconSend className="w-3.5 h-3.5" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN/ORGANIZER VIEW - Club Console (Manage Club, Accept/Reject Requests)
// ══════════════════════════════════════════════════════════════════════════════

function AdminClubView() {
  const [activeTab, setActiveTab] = useState<Tab>("members");
  const [memberSearch, setMemberSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | MemberRole>("All");
  const [requests, setRequests] = useState<JoinRequest[]>(JOIN_REQUESTS);

  // Settings state
  const [settingsClubName, setSettingsClubName] = useState(CLUB.name);
  const [settingsDescription, setSettingsDescription] = useState(CLUB.description);
  const [settingsSport, setSettingsSport] = useState(CLUB.sport);
  const [settingsPrivacy, setSettingsPrivacy] = useState<Privacy>("Invite Only");

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editName, setEditName] = useState(CLUB.name);
  const [editDescription, setEditDescription] = useState(CLUB.description);
  const [editSport, setEditSport] = useState(CLUB.sport);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitesSent, setInvitesSent] = useState<string[]>([]);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [registeredTournaments, setRegisteredTournaments] = useState<Set<string>>(new Set(["t1", "t2"]));

  const handleSaveEdit = () => {
    setSettingsClubName(editName);
    setSettingsDescription(editDescription);
    setSettingsSport(editSport);
    setShowEditModal(false);
  };

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) return;
    setInvitesSent((prev) => [...prev, inviteEmail.trim()]);
    setInviteEmail("");
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleRegisterForTournament = () => {
    if (!selectedTournament) return;
    setRegisteredTournaments((prev) => new Set(prev).add(selectedTournament));
    setSelectedTournament("");
    setShowRegisterModal(false);
  };

  // Filtered members
  const filteredMembers = MEMBERS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase());
    const matchesRole = roleFilter === "All" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Request handlers
  const handleAcceptRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" as RequestStatus } : r))
    );
  };

  const handleRejectRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as RequestStatus } : r))
    );
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "members", label: "Members", count: MEMBERS.length },
    { key: "requests", label: "Requests", count: pendingRequests.length },
    { key: "tournaments", label: "Tournaments", count: CLUB_TOURNAMENTS.length },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <IconShield className="w-5 h-5 text-vp-lime" />
          <span className="text-xs font-bold text-vp-lime uppercase tracking-widest">Club Management</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-black text-white">Club Console</h1>
        <p className="text-sm text-vp-text-dim mt-1">Manage your club roster, review join requests, and track tournament performance</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Content (9 cols) */}
        <div className="xl:col-span-9 space-y-6">
          {/* Club Overview Card */}
          <div className="relative bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-vp-lime/5 via-transparent to-vp-blue/5 pointer-events-none" />
            <div className="relative p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-vp-lime/20 border border-vp-lime/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl lg:text-3xl font-black text-vp-lime">{CLUB.logo}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl lg:text-2xl font-black text-white">{CLUB.name}</h2>
                      <span className="inline-flex items-center gap-1.5 bg-vp-green/15 text-vp-green text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-vp-green" />
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-vp-text-dim">
                      <span>{CLUB.sport}</span>
                      <span className="w-1 h-1 rounded-full bg-vp-text-muted" />
                      <span className="text-white font-semibold">{CLUB.memberCount}</span>
                      <span>members</span>
                    </div>
                    <p className="text-sm text-vp-text-dim mt-3 max-w-xl leading-relaxed">{CLUB.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setEditName(settingsClubName); setEditDescription(settingsDescription); setEditSport(settingsSport); setShowEditModal(true); }}
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-vp-card border border-vp-border px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:border-vp-lime/30 hover:text-vp-lime transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Club
                </button>
              </div>

              <div className="flex flex-wrap gap-6 lg:gap-10 mt-6 pt-6 border-t border-vp-border">
                <div>
                  <p className="text-2xl font-black text-vp-lime">{CLUB.stats.winRate}</p>
                  <p className="text-[10px] text-vp-text-muted uppercase tracking-wider mt-0.5">Win Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-vp-orange">{CLUB.stats.tournamentsWon}</p>
                  <p className="text-[10px] text-vp-text-muted uppercase tracking-wider mt-0.5">Tournaments Won</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-vp-blue">{CLUB.stats.activeMembers}</p>
                  <p className="text-[10px] text-vp-text-muted uppercase tracking-wider mt-0.5">Active Members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Club Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CLUB_STATS.map((stat) => {
              const Icon = STAT_ICONS[stat.icon];
              return (
                <div key={stat.label} className="bg-vp-card rounded-2xl border border-vp-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] text-vp-text-muted uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-vp-card rounded-xl p-1 w-fit border border-vp-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg capitalize transition-colors ${
                  activeTab === tab.key
                    ? "bg-vp-lime text-vp-dark"
                    : "text-vp-text-dim hover:text-white"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === tab.key
                        ? "bg-vp-dark/20 text-vp-dark"
                        : tab.key === "requests" && tab.count > 0
                        ? "bg-vp-red/20 text-vp-red"
                        : "bg-vp-border text-vp-text-muted"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ═══════ MEMBERS TAB ═══════ */}
          {activeTab === "members" && (
            <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
              <div className="p-5 border-b border-vp-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-xs">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vp-text-muted" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full bg-vp-dark border border-vp-border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30"
                    />
                  </div>
                  <div className="flex bg-vp-dark rounded-lg border border-vp-border p-0.5">
                    {(["All", "Captain", "Player", "Coach"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRoleFilter(r)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-md uppercase transition-colors ${
                          roleFilter === r
                            ? "bg-vp-lime text-vp-dark"
                            : "text-vp-text-dim hover:text-white"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="inline-flex items-center gap-2 bg-vp-lime text-vp-dark px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-vp-lime-dark transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  Invite Player
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-vp-border">
                      {["Member", "Role", "Rating", "Join Date", "Status"].map((h) => (
                        <th key={h} className="text-left text-[10px] font-bold text-vp-text-muted uppercase tracking-wider px-5 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="border-b border-vp-border last:border-0 hover:bg-vp-card-hover transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-vp-lime/15 flex items-center justify-center text-xs font-bold text-vp-lime flex-shrink-0">
                              {member.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{member.name}</p>
                              <p className="text-[10px] text-vp-text-muted">@{member.name.toLowerCase().replace(/\s+/g, "").replace(/'/g, "")}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${roleBadgeClasses(member.role)}`}>
                            {member.role === "Captain" && <IconCrown className="w-3 h-3" />}
                            {member.role}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-vp-lime">{member.rating.toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-4 text-xs text-vp-text-dim">
                          {new Date(member.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${statusDotColor(member.status)}`} />
                            <span className="text-xs text-vp-text-dim">{member.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredMembers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-xs text-vp-text-dim">
                          No members found matching your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-5 py-3 border-t border-vp-border flex items-center justify-between">
                <p className="text-xs text-vp-text-muted">
                  Showing {filteredMembers.length} of {MEMBERS.length} members
                </p>
              </div>
            </div>
          )}

          {/* ═══════ REQUESTS TAB (Admin can accept/reject) ═══════ */}
          {activeTab === "requests" && (
            <div className="space-y-4">
              {/* Pending count banner */}
              {pendingRequests.length > 0 && (
                <div className="bg-vp-orange/5 border border-vp-orange/20 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-vp-orange/15 flex items-center justify-center flex-shrink-0">
                    <IconUsers className="w-4 h-4 text-vp-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{pendingRequests.length} Pending Request{pendingRequests.length !== 1 ? "s" : ""}</p>
                    <p className="text-[10px] text-vp-text-muted">Players are waiting for your response</p>
                  </div>
                </div>
              )}

              {pendingRequests.length === 0 && requests.every((r) => r.status !== "pending") && (
                <div className="bg-vp-card rounded-2xl border border-vp-border p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-vp-green/10 flex items-center justify-center mx-auto mb-3">
                    <IconCheck className="w-6 h-6 text-vp-green" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">All caught up</p>
                  <p className="text-xs text-vp-text-dim">No pending join requests at this time</p>
                </div>
              )}

              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`bg-vp-card rounded-2xl border border-vp-border p-6 transition-opacity ${
                    req.status !== "pending" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-vp-blue/15 flex items-center justify-center text-sm font-bold text-vp-blue flex-shrink-0">
                        {req.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{req.playerName}</h4>
                          <span className="text-[10px] font-bold text-vp-lime bg-vp-lime/10 px-2 py-0.5 rounded">
                            {req.rating} Rating
                          </span>
                          <span className="text-[10px] font-bold text-vp-purple bg-vp-purple/10 px-2 py-0.5 rounded">
                            {req.position}
                          </span>
                        </div>
                        <p className="text-xs text-vp-text-dim mt-2 leading-relaxed">{req.message}</p>
                        <p className="text-[10px] text-vp-text-muted mt-2">
                          Requested {new Date(req.requestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {req.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="inline-flex items-center gap-1.5 bg-vp-green/15 text-vp-green px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-vp-green/25 transition-colors"
                          >
                            <IconCheck className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="inline-flex items-center gap-1.5 bg-vp-red/15 text-vp-red px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-vp-red/25 transition-colors"
                          >
                            <IconX className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg ${
                            req.status === "accepted"
                              ? "bg-vp-green/10 text-vp-green"
                              : "bg-vp-red/10 text-vp-red"
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ═══════ TOURNAMENTS TAB ═══════ */}
          {activeTab === "tournaments" && (
            <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
              <div className="p-5 border-b border-vp-border flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Club Tournaments ({CLUB_TOURNAMENTS.length})
                </h3>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="inline-flex items-center gap-2 bg-vp-lime text-vp-dark px-4 py-2 rounded-xl text-xs font-bold hover:bg-vp-lime-dark transition-colors"
                >
                  <IconTrophy className="w-3.5 h-3.5" />
                  Register for Tournament
                </button>
              </div>
              <div className="divide-y divide-vp-border">
                {CLUB_TOURNAMENTS.map((t) => (
                  <div key={t.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-vp-card-hover transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="text-sm font-bold text-white">{t.name}</h4>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${tournamentStatusClasses(t.status)}`}>
                          {t.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-vp-text-muted">
                        <span>{t.sport}</span>
                        <span className="w-1 h-1 rounded-full bg-vp-text-muted" />
                        <span>
                          {new Date(t.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} &mdash;{" "}
                          {new Date(t.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {t.placement && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{t.placement}</p>
                          <p className="text-[10px] text-vp-text-muted uppercase">Placement</p>
                        </div>
                      )}
                      {t.prize && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-vp-lime">{t.prize}</p>
                          <p className="text-[10px] text-vp-text-muted uppercase">Prize</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════ SETTINGS TAB ═══════ */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-vp-text-dim mb-1.5">Club Name</label>
                    <input
                      type="text"
                      value={settingsClubName}
                      onChange={(e) => setSettingsClubName(e.target.value)}
                      className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-vp-text-dim mb-1.5">Sport</label>
                    <select
                      value={settingsSport}
                      onChange={(e) => setSettingsSport(e.target.value)}
                      className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vp-lime/30"
                    >
                      <option value="Soccer">Soccer</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Volleyball">Volleyball</option>
                      <option value="Cricket">Cricket</option>
                      <option value="Baseball">Baseball</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-vp-text-dim mb-1.5">Description</label>
                    <textarea
                      value={settingsDescription}
                      onChange={(e) => setSettingsDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-vp-text-dim mb-1.5">Privacy</label>
                    <select
                      value={settingsPrivacy}
                      onChange={(e) => setSettingsPrivacy(e.target.value as Privacy)}
                      className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vp-lime/30"
                    >
                      <option value="Open">Open - Anyone can join</option>
                      <option value="Invite Only">Invite Only - Requires approval</option>
                      <option value="Closed">Closed - No new members</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-vp-card rounded-2xl border border-vp-border p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Club Logo</h3>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-vp-dark border-2 border-dashed border-vp-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-vp-lime/30 transition-colors">
                    <IconUpload className="w-6 h-6 text-vp-text-muted" />
                    <span className="text-[10px] text-vp-text-muted">Upload</span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Upload your club logo</p>
                    <p className="text-xs text-vp-text-dim mt-1">PNG, JPG or SVG. Max 2MB. Recommended 256x256px.</p>
                  </div>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-vp-purple/10 via-vp-card to-vp-blue/10 rounded-2xl border border-vp-purple/30 p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-vp-purple/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <IconCrown className="w-5 h-5 text-vp-purple" />
                    <span className="text-xs font-bold text-vp-purple uppercase tracking-widest">Premium</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Next Level Stats</h3>
                  <p className="text-sm text-vp-text-dim max-w-md leading-relaxed mb-5">
                    Unlock advanced analytics, performance heatmaps, opponent scouting reports, and priority tournament registration for your club.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {["Advanced Analytics", "Heatmaps", "Scout Reports", "Priority Registration", "Custom Branding"].map((feature) => (
                      <span key={feature} className="inline-flex items-center gap-1.5 text-[10px] font-bold text-vp-purple bg-vp-purple/10 px-3 py-1.5 rounded-lg">
                        <IconCheck className="w-3 h-3" />
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="inline-flex items-center gap-2 bg-vp-purple text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-vp-purple/80 transition-colors">
                    <IconCrown className="w-4 h-4" />
                    Upgrade to Premium
                  </button>
                </div>
              </div>

              <div className="flex justify-end items-center gap-3">
                {settingsSaved && (
                  <span className="text-xs font-bold text-vp-green">Settings saved successfully!</span>
                )}
                <button
                  onClick={handleSaveSettings}
                  className="bg-vp-lime text-vp-dark px-8 py-3 rounded-xl text-sm font-bold hover:bg-vp-lime-dark transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (3 cols) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Nearby Clubs */}
          <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
            <div className="p-5 border-b border-vp-border">
              <div className="flex items-center gap-2">
                <IconMapPin className="w-4 h-4 text-vp-blue" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Nearby Clubs</h3>
              </div>
              <p className="text-[10px] text-vp-text-muted mt-1">Discover clubs in your area</p>
            </div>
            <div className="divide-y divide-vp-border">
              {DISCOVER_CLUBS.slice(0, 5).map((club) => (
                <div key={club.id} className="p-4 hover:bg-vp-card-hover transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-vp-blue/15 flex items-center justify-center text-xs font-bold text-vp-blue flex-shrink-0">
                      {club.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{club.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-vp-text-muted">
                        <span>{club.sport}</span>
                        <span className="w-1 h-1 rounded-full bg-vp-text-muted" />
                        <span>{club.distance}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-vp-lime">{club.rating.toLocaleString()}</p>
                      <p className="text-[10px] text-vp-text-muted">{club.members} members</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-vp-border">
              <button className="w-full text-center text-xs font-bold text-vp-blue hover:text-vp-blue/80 transition-colors">
                View All Clubs
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 bg-vp-dark rounded-xl px-4 py-3 text-left hover:bg-vp-card-hover transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-vp-lime/15 flex items-center justify-center flex-shrink-0 group-hover:bg-vp-lime/25 transition-colors">
                  <IconUsers className="w-4 h-4 text-vp-lime" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Invite Players</p>
                  <p className="text-[10px] text-vp-text-muted">Send invites via link or email</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 bg-vp-dark rounded-xl px-4 py-3 text-left hover:bg-vp-card-hover transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-vp-orange/15 flex items-center justify-center flex-shrink-0 group-hover:bg-vp-orange/25 transition-colors">
                  <IconTrophy className="w-4 h-4 text-vp-orange" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Schedule Match</p>
                  <p className="text-[10px] text-vp-text-muted">Set up a friendly or ranked match</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 bg-vp-dark rounded-xl px-4 py-3 text-left hover:bg-vp-card-hover transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-vp-blue/15 flex items-center justify-center flex-shrink-0 group-hover:bg-vp-blue/25 transition-colors">
                  <IconTarget className="w-4 h-4 text-vp-blue" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">View Analytics</p>
                  <p className="text-[10px] text-vp-text-muted">Club performance breakdown</p>
                </div>
              </button>
            </div>
          </div>

          {/* Club Activity Feed */}
          <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { text: "Marcus Rivera scored 3 goals vs Iron Wolves", time: "2h ago", color: "bg-vp-lime" },
                { text: "Elena Vasquez joined the roster", time: "5h ago", color: "bg-vp-green" },
                { text: "Won match against Phoenix United (3-1)", time: "1d ago", color: "bg-vp-blue" },
                { text: "Registered for Metro Cup 2025", time: "2d ago", color: "bg-vp-orange" },
                { text: "Kai Nakamura status changed to Injured", time: "3d ago", color: "bg-vp-red" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full ${activity.color} mt-1.5 flex-shrink-0`} />
                  <div>
                    <p className="text-xs text-vp-text-dim leading-relaxed">{activity.text}</p>
                    <p className="text-[10px] text-vp-text-muted mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ EDIT CLUB MODAL ═══════ */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-vp-card rounded-2xl border border-vp-border w-full max-w-lg">
            <div className="p-6 border-b border-vp-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Edit Club</h3>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-lg bg-vp-dark flex items-center justify-center text-vp-text-muted hover:text-white"><IconX className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-vp-text-dim mb-1.5">Club Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vp-lime/30" />
              </div>
              <div>
                <label className="block text-xs text-vp-text-dim mb-1.5">Sport</label>
                <select value={editSport} onChange={(e) => setEditSport(e.target.value)} className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vp-lime/30">
                  <option value="Soccer">Soccer</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-vp-text-dim mb-1.5">Description</label>
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vp-lime/30 resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-vp-border flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-xs font-bold text-vp-text-dim">Cancel</button>
              <button onClick={handleSaveEdit} className="px-6 py-2 bg-vp-lime text-vp-dark rounded-xl text-xs font-bold hover:bg-vp-lime-dark">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ INVITE PLAYER MODAL ═══════ */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-vp-card rounded-2xl border border-vp-border w-full max-w-lg">
            <div className="p-6 border-b border-vp-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Invite Player</h3>
              <button onClick={() => setShowInviteModal(false)} className="w-8 h-8 rounded-lg bg-vp-dark flex items-center justify-center text-vp-text-muted hover:text-white"><IconX className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-vp-text-dim mb-1.5">Player Email</label>
                <div className="flex gap-2">
                  <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="player@example.com" className="flex-1 bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30" onKeyDown={(e) => e.key === "Enter" && handleSendInvite()} />
                  <button onClick={handleSendInvite} disabled={!inviteEmail.trim()} className="px-5 py-3 bg-vp-lime text-vp-dark rounded-xl text-xs font-bold hover:bg-vp-lime-dark disabled:opacity-50 disabled:cursor-not-allowed">Send</button>
                </div>
              </div>
              {invitesSent.length > 0 && (
                <div>
                  <p className="text-xs text-vp-text-dim mb-2">Invites Sent ({invitesSent.length})</p>
                  <div className="space-y-1.5">
                    {invitesSent.map((email, i) => (
                      <div key={i} className="flex items-center gap-2 bg-vp-dark rounded-lg px-3 py-2">
                        <IconCheck className="w-3.5 h-3.5 text-vp-green" />
                        <span className="text-xs text-white">{email}</span>
                        <span className="text-[10px] text-vp-green ml-auto">Sent</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-3 rounded-xl bg-vp-blue/5 border border-vp-blue/10">
                <p className="text-[10px] text-vp-blue">Players will receive an email invitation to join your club. They can accept or decline from their dashboard.</p>
              </div>
            </div>
            <div className="p-6 border-t border-vp-border flex justify-end">
              <button onClick={() => setShowInviteModal(false)} className="px-5 py-2 text-xs font-bold text-vp-text-dim hover:text-white">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ REGISTER TOURNAMENT MODAL ═══════ */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-vp-card rounded-2xl border border-vp-border w-full max-w-lg">
            <div className="p-6 border-b border-vp-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Register for Tournament</h3>
              <button onClick={() => setShowRegisterModal(false)} className="w-8 h-8 rounded-lg bg-vp-dark flex items-center justify-center text-vp-text-muted hover:text-white"><IconX className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-vp-text-dim mb-1.5">Select Tournament</label>
                <select value={selectedTournament} onChange={(e) => setSelectedTournament(e.target.value)} className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vp-lime/30">
                  <option value="">Choose a tournament...</option>
                  {[
                    { id: "nt1", name: "Summer League 2025", sport: "Soccer", prize: "$10,000" },
                    { id: "nt2", name: "Champions Trophy", sport: "Cricket", prize: "$25,000" },
                    { id: "nt3", name: "Pro League Season 5", sport: "Soccer", prize: "$50,000" },
                    { id: "nt4", name: "City Championship", sport: "Basketball", prize: "$8,000" },
                  ].filter((t) => !registeredTournaments.has(t.id)).map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.sport}) - {t.prize}</option>
                  ))}
                </select>
              </div>
              {selectedTournament && (
                <div className="p-4 bg-vp-dark rounded-xl border border-vp-border">
                  <p className="text-xs text-vp-text-dim">Your club <span className="text-white font-bold">{settingsClubName}</span> will be registered for this tournament.</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-vp-border flex justify-end gap-3">
              <button onClick={() => setShowRegisterModal(false)} className="px-4 py-2 text-xs font-bold text-vp-text-dim">Cancel</button>
              <button onClick={handleRegisterForTournament} disabled={!selectedTournament} className="px-6 py-2 bg-vp-lime text-vp-dark rounded-xl text-xs font-bold hover:bg-vp-lime-dark disabled:opacity-50 disabled:cursor-not-allowed">Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT - Routes to Player or Admin view based on role
// ══════════════════════════════════════════════════════════════════════════════

export default function ClubManagementPage() {
  const { user, loading, isAdmin, isOrganizer } = useAuth();
  const [viewMode, setViewMode] = useState<"auto" | "player" | "admin">("auto");

  // Loading state
  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-vp-lime animate-pulse text-xl font-bold">Loading Club Console...</div>
        </div>
      </AppShell>
    );
  }

  const showAdminView = viewMode === "admin" || (viewMode === "auto" && (isAdmin || isOrganizer));
  const canToggle = isAdmin || isOrganizer;

  return (
    <AppShell>
      {/* View toggle for admins/organizers */}
      {canToggle && (
        <div className="px-6 lg:px-10 pt-6 pb-0">
          <div className="flex items-center gap-2 bg-vp-card rounded-xl p-1 w-fit border border-vp-border">
            <button
              onClick={() => setViewMode(showAdminView ? "player" : "admin")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                showAdminView ? "text-vp-text-dim hover:text-white" : "bg-vp-lime text-vp-dark"
              }`}
            >
              <IconGlobe className="w-3.5 h-3.5" />
              Player View
            </button>
            <button
              onClick={() => setViewMode(showAdminView ? "player" : "admin")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                showAdminView ? "bg-vp-lime text-vp-dark" : "text-vp-text-dim hover:text-white"
              }`}
            >
              <IconShield className="w-3.5 h-3.5" />
              Club Console
            </button>
          </div>
        </div>
      )}

      {showAdminView ? <AdminClubView /> : <PlayerClubView />}
    </AppShell>
  );
}
