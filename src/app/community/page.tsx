"use client";

import AppShell from "@/components/layout/AppShell";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Static / mock data                                                 */
/* ------------------------------------------------------------------ */

const trendingTopics = [
  { tag: "#ProLeagueS4", posts: "2.4k", hot: true },
  { tag: "#VersaPlayMVP", posts: "1.8k", hot: true },
  { tag: "#WeekendWarriors", posts: "1.1k", hot: false },
  { tag: "#ClutchPlays", posts: "980", hot: false },
  { tag: "#RookieWatch", posts: "740", hot: false },
];

// ── Color mapping for Tailwind-safe static classes ──
const ACCENT_STYLES: Record<string, { avatarBg: string; avatarText: string; sportText: string; teamBg: string; teamText: string }> = {
  lime:   { avatarBg: "bg-vp-lime/20",   avatarText: "text-vp-lime",   sportText: "text-vp-lime",   teamBg: "bg-vp-lime/20",   teamText: "text-vp-lime" },
  blue:   { avatarBg: "bg-vp-blue/20",   avatarText: "text-vp-blue",   sportText: "text-vp-blue",   teamBg: "bg-vp-blue/20",   teamText: "text-vp-blue" },
  orange: { avatarBg: "bg-vp-orange/20", avatarText: "text-vp-orange", sportText: "text-vp-orange", teamBg: "bg-vp-orange/20", teamText: "text-vp-orange" },
  purple: { avatarBg: "bg-vp-purple/20", avatarText: "text-vp-purple", sportText: "text-vp-purple", teamBg: "bg-vp-purple/20", teamText: "text-vp-purple" },
  green:  { avatarBg: "bg-vp-green/20",  avatarText: "text-vp-green",  sportText: "text-vp-green",  teamBg: "bg-vp-green/20",  teamText: "text-vp-green" },
};

const SPORT_ACCENT: Record<string, string> = {
  Soccer: "lime",
  Basketball: "orange",
  Tennis: "blue",
  Badminton: "purple",
  Cricket: "green",
};

const feedPosts = [
  {
    id: "1",
    author: "Marcus Reed",
    avatar: "MR",
    handle: "@marcusreed",
    time: "12m ago",
    sport: "Soccer",
    content:
      "Just wrapped an insane 5-set match in the regional qualifiers. Down 2 sets and came back to take it all. Never count yourself out!",
    hasImage: true,
    imageLabel: "Match Highlight",
    likes: 342,
    comments: 58,
    shares: 27,
    liked: false,
    accent: "lime",
  },
  {
    id: "2",
    author: "Jade Kim",
    avatar: "JK",
    handle: "@jadekim",
    time: "1h ago",
    sport: "Badminton",
    content:
      "Shout-out to the VersaPlay community for all the support this season. We hit 500 wins as a team today. Here is to the next 500!",
    hasImage: false,
    imageLabel: "",
    likes: 218,
    comments: 34,
    shares: 12,
    liked: true,
    accent: "blue",
  },
  {
    id: "3",
    author: "Darius Cole",
    avatar: "DC",
    handle: "@dariuscole",
    time: "3h ago",
    sport: "Basketball",
    content:
      "New training drill breakdown for guards. Working on quick-release shooting drills with the team. Accuracy went up 14% in two weeks.",
    hasImage: true,
    imageLabel: "Training Session",
    likes: 189,
    comments: 42,
    shares: 65,
    liked: false,
    accent: "orange",
  },
  {
    id: "4",
    author: "Lena Park",
    avatar: "LP",
    handle: "@lenapark",
    time: "5h ago",
    sport: "Tennis",
    content:
      "Tournament tip: Always study your opponent bracket before your first match. Knowledge is half the battle. Good luck to everyone in this weekend qualifiers!",
    hasImage: false,
    imageLabel: "",
    likes: 156,
    comments: 23,
    shares: 41,
    liked: false,
    accent: "purple",
  },
  {
    id: "5",
    author: "Omar Hassan",
    avatar: "OH",
    handle: "@omarhassan",
    time: "8h ago",
    sport: "Soccer",
    content:
      "Match recap: Neon Knights 3 - Thunder Wolves 2. What an absolute thriller from start to finish. GG to both sides!",
    hasImage: true,
    imageLabel: "Match Recap",
    likes: 427,
    comments: 89,
    shares: 53,
    liked: true,
    accent: "green",
  },
];

const myTeams = [
  { name: "Neon Knights", role: "Captain", members: 12, accent: "lime" },
  { name: "Thunder Wolves", role: "Member", members: 8, accent: "blue" },
];

const upcomingEvents = [
  { name: "Regional Qualifiers", date: "Mar 29", sport: "Soccer", spots: 4 },
  { name: "Weekend Blitz", date: "Apr 2", sport: "Basketball", spots: 12 },
  { name: "Pro League S4 Finals", date: "Apr 15", sport: "Multi", spots: 0 },
];

const spotlightPlayers = [
  {
    name: "Marcus Reed",
    avatar: "MR",
    sport: "Soccer",
    stat: "98",
    statLabel: "Rating",
    highlight: "24W-3L this season",
    color: "from-vp-lime/20 to-vp-lime/5",
    accent: "text-vp-lime",
    border: "border-vp-lime/20",
  },
  {
    name: "Jade Kim",
    avatar: "JK",
    sport: "Badminton",
    stat: "31",
    statLabel: "Win Streak",
    highlight: "Undefeated in regionals",
    color: "from-vp-blue/20 to-vp-blue/5",
    accent: "text-vp-blue",
    border: "border-vp-blue/20",
  },
  {
    name: "Darius Cole",
    avatar: "DC",
    sport: "Basketball",
    stat: "92",
    statLabel: "Rating",
    highlight: "Most improved player",
    color: "from-vp-orange/20 to-vp-orange/5",
    accent: "text-vp-orange",
    border: "border-vp-orange/20",
  },
];

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function HeartIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 23c-4.97 0-9-3.13-9-7 0-2.38 1.34-4.42 3.31-5.5a.5.5 0 01.74.44v.81c0 1.42.91 2.69 2.24 3.12a.5.5 0 00.62-.65C9.08 11.87 11 8 11 5c0-1.57.59-3 1.56-4.09a.5.5 0 01.83.12C14.78 4.34 17 7.84 17 11c0 .28-.01.56-.04.83a.5.5 0 00.82.43A3.99 3.99 0 0019 9.5a.5.5 0 01.76-.38C20.55 9.78 21 11.06 21 12.5 21 18.3 17.42 23 12 23z" fill="#f59e0b" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 1012 0V2z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className="text-vp-text-muted">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#c8ff00" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3l14 9-14 9V3z" fill="#c8ff00" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function CommunityFeedPage() {
  const [posts, setPosts] = useState(feedPosts);
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [composeSport, setComposeSport] = useState("Soccer");
  const [composeHasImage, setComposeHasImage] = useState(false);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleCreatePost = () => {
    if (!composeText.trim()) return;
    const newPost = {
      id: `post-${Date.now()}`,
      author: "You",
      avatar: "YO",
      handle: "@you",
      time: "Just now",
      sport: composeSport,
      content: composeText.trim(),
      hasImage: composeHasImage,
      imageLabel: composeHasImage ? "Uploaded Image" : "",
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      accent: SPORT_ACCENT[composeSport] || "lime",
    };
    setPosts((prev) => [newPost, ...prev]);
    setComposeText("");
    setComposeSport("Soccer");
    setComposeHasImage(false);
    setShowCompose(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: p.comments + 1 } : p
      )
    );
    setCommentText("");
    setCommentingOn(null);
  };

  const handleShare = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, shares: p.shares + 1 } : p
      )
    );
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8">
        {/* -------- Header -------- */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Community Feed</h1>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vp-lime opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-vp-lime" />
            </span>
          </div>
          <p className="text-sm text-vp-text-dim">
            Highlights, discussions, and updates from the VersaPlay community
          </p>
        </div>

        {/* -------- Three-column layout -------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================================================================ */}
          {/*  LEFT SIDEBAR                                                     */}
          {/* ================================================================ */}
          <aside className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            {/* Trending */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <FireIcon />
                <p className="text-xs font-bold text-white uppercase tracking-widest">
                  Trending Now
                </p>
              </div>
              <ul className="space-y-3">
                {trendingTopics.map((t) => (
                  <li
                    key={t.tag}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {t.hot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-vp-orange" />
                      )}
                      <span className="text-sm font-semibold text-vp-lime group-hover:underline">
                        {t.tag}
                      </span>
                    </div>
                    <span className="text-[10px] text-vp-text-muted">
                      {t.posts} posts
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Event Promo Card */}
            <div className="bg-gradient-to-br from-[#1a1040] to-vp-card rounded-2xl border border-vp-purple/20 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-vp-purple/10 rounded-full blur-[40px]" />
              <p className="text-[10px] font-bold text-vp-purple uppercase tracking-widest mb-2 relative z-10">
                Featured Event
              </p>
              <h3 className="text-base font-bold text-white leading-snug relative z-10">
                Regional Qualifiers
              </h3>
              <p className="text-xs text-vp-text-dim mt-1 relative z-10">
                Battle of Groups &bull; Mar 29
              </p>
              <div className="flex items-center gap-3 mt-3 relative z-10">
                <div className="flex items-center gap-1.5 text-vp-text-dim">
                  <UsersIcon />
                  <span className="text-[10px]">32 teams</span>
                </div>
                <div className="flex items-center gap-1.5 text-vp-text-dim">
                  <TrophyIcon />
                  <span className="text-[10px]">$5,000</span>
                </div>
              </div>
              <div className="mt-4 relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-vp-text-muted">Spots filled</span>
                  <span className="text-[10px] font-bold text-vp-purple">28/32</span>
                </div>
                <div className="h-1.5 bg-vp-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-vp-purple to-vp-blue rounded-full"
                    style={{ width: "87.5%" }}
                  />
                </div>
              </div>
            </div>

            {/* Join the Action */}
            <div className="bg-gradient-to-br from-vp-lime/10 to-vp-card rounded-2xl border border-vp-lime/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <BoltIcon />
                <p className="text-xs font-bold text-vp-lime uppercase tracking-widest">
                  Join the Action
                </p>
              </div>
              <p className="text-xs text-vp-text-dim leading-relaxed mb-4">
                Compete in live tournaments, climb the leaderboard, and earn exclusive rewards.
              </p>
              <button className="w-full bg-vp-lime text-vp-dark font-bold py-2.5 rounded-xl text-sm hover:bg-vp-lime-dark transition-colors active:scale-[0.97]">
                Find a Tournament
              </button>
            </div>
          </aside>

          {/* ================================================================ */}
          {/*  MAIN FEED                                                        */}
          {/* ================================================================ */}
          <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
            {/* Compose hint bar */}
            <button
              onClick={() => setShowCompose(true)}
              className="w-full bg-vp-card rounded-2xl border border-vp-border p-4 flex items-center gap-3 hover:border-vp-lime/20 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full bg-vp-lime/20 flex items-center justify-center text-xs font-bold text-vp-lime flex-shrink-0">
                Y
              </div>
              <div className="flex-1 bg-vp-dark rounded-xl px-4 py-2.5 text-sm text-vp-text-muted">
                Share something with the community...
              </div>
            </button>

            {/* Compose Modal */}
            {showCompose && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-vp-card rounded-2xl border border-vp-border w-full max-w-lg">
                  <div className="p-5 border-b border-vp-border flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Create Post</h3>
                    <button onClick={() => setShowCompose(false)} className="text-vp-text-muted hover:text-white text-lg">&times;</button>
                  </div>
                  <div className="p-5 space-y-4">
                    <textarea
                      value={composeText}
                      onChange={(e) => setComposeText(e.target.value)}
                      rows={4}
                      placeholder="What's on your mind?"
                      className="w-full bg-vp-dark border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30 resize-none"
                      autoFocus
                    />
                    <div className="flex items-center gap-3">
                      <select
                        value={composeSport}
                        onChange={(e) => setComposeSport(e.target.value)}
                        className="bg-vp-dark border border-vp-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-vp-lime/30"
                      >
                        <option value="Soccer">Soccer</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Cricket">Cricket</option>
                      </select>
                      <button
                        onClick={() => setComposeHasImage(!composeHasImage)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                          composeHasImage
                            ? "bg-vp-lime/15 text-vp-lime border border-vp-lime/30"
                            : "bg-vp-dark border border-vp-border text-vp-text-dim hover:text-white"
                        }`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        {composeHasImage ? "Image Added" : "Add Image"}
                      </button>
                    </div>
                  </div>
                  <div className="p-5 border-t border-vp-border flex justify-end gap-3">
                    <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-xs font-bold text-vp-text-dim hover:text-white transition-colors">Cancel</button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!composeText.trim()}
                      className="px-6 py-2 bg-vp-lime text-vp-dark rounded-xl text-xs font-bold hover:bg-vp-lime-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Feed Posts */}
            {posts.map((post) => {
              const accentStyle = ACCENT_STYLES[post.accent] || ACCENT_STYLES.lime;
              return (
              <article
                key={post.id}
                className="bg-vp-card rounded-2xl border border-vp-border hover:border-vp-border transition-colors"
              >
                {/* Post header */}
                <div className="px-5 pt-5 pb-3 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${accentStyle.avatarBg} flex items-center justify-center text-xs font-bold ${accentStyle.avatarText}`}
                  >
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate">
                        {post.author}
                      </span>
                      <span className="text-[10px] text-vp-text-muted hidden sm:inline">
                        {post.handle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-vp-text-muted">{post.time}</span>
                      <span className="text-[10px] text-vp-text-muted">&bull;</span>
                      <span
                        className={`text-[10px] font-semibold ${accentStyle.sportText}`}
                      >
                        {post.sport}
                      </span>
                    </div>
                  </div>
                  {/* 3-dot menu placeholder */}
                  <button className="text-vp-text-muted hover:text-white transition-colors p-1">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </div>

                {/* Post body */}
                <div className="px-5 pb-3">
                  <p className="text-sm text-vp-text leading-relaxed">{post.content}</p>
                </div>

                {/* Image */}
                {post.hasImage && (
                  <div className="mx-5 mb-4 rounded-xl bg-vp-dark border border-vp-border overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={`https://res.cloudinary.com/ddlc9p24k/image/upload/f_auto,q_auto,w_800,h_450,c_fill/versaplay/match-highlight-${parseInt(post.id) % 2 === 0 ? "2" : "1"}`}
                        alt={post.imageLabel}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-vp-dark/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="text-xs text-white font-semibold">{post.imageLabel}</span>
                      </div>
                      <div className="absolute bottom-3 right-3 z-10 bg-vp-dark/80 backdrop-blur rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                        <PlayIcon />
                        <span className="text-[10px] font-bold text-vp-lime">Watch</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action bar */}
                <div className="px-5 pb-4 flex items-center gap-6">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.liked
                        ? "text-vp-red"
                        : "text-vp-text-muted hover:text-vp-red"
                    }`}
                  >
                    <HeartIcon filled={post.liked} />
                    <span className="text-xs font-semibold">{post.likes}</span>
                  </button>
                  <button
                    onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      commentingOn === post.id ? "text-vp-blue" : "text-vp-text-muted hover:text-vp-blue"
                    }`}
                  >
                    <CommentIcon />
                    <span className="text-xs font-semibold">{post.comments}</span>
                  </button>
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1.5 text-vp-text-muted hover:text-vp-green transition-colors"
                  >
                    <ShareIcon />
                    <span className="text-xs font-semibold">{post.shares}</span>
                  </button>
                </div>

                {/* Comment Input */}
                {commentingOn === post.id && (
                  <div className="px-5 pb-4">
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-vp-dark border border-vp-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/30"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentText.trim()}
                        className="bg-vp-blue text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-vp-blue/80 transition-colors disabled:opacity-50"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </article>
              );
            })}

            {/* Load more */}
            <div className="flex justify-center pt-2 pb-4">
              <button className="text-sm font-semibold text-vp-lime hover:text-vp-lime-dark transition-colors flex items-center gap-2">
                Load more posts
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>

          {/* ================================================================ */}
          {/*  RIGHT SIDEBAR                                                    */}
          {/* ================================================================ */}
          <aside className="lg:col-span-3 space-y-6 order-3">
            {/* Your Stats */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <ChartIcon />
                <p className="text-xs font-bold text-white uppercase tracking-widest">
                  Your Stats
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Wins", value: "24", color: "text-vp-green" },
                  { label: "Rating", value: "96", color: "text-vp-lime" },
                  { label: "Win Rate", value: "89%", color: "text-vp-blue" },
                  { label: "Rank", value: "#4", color: "text-vp-orange" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-vp-dark rounded-xl p-3 text-center"
                  >
                    <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-vp-text-muted uppercase tracking-wider mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-vp-text-muted">Season XP</span>
                  <span className="text-[10px] font-bold text-vp-lime">2,450 / 3,000</span>
                </div>
                <div className="h-1.5 bg-vp-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-vp-lime to-vp-green rounded-full"
                    style={{ width: "82%" }}
                  />
                </div>
              </div>
            </div>

            {/* Your Teams */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <UsersIcon />
                <p className="text-xs font-bold text-white uppercase tracking-widest">
                  Your Teams
                </p>
              </div>
              <div className="space-y-3">
                {myTeams.map((team) => {
                  const teamAccent = ACCENT_STYLES[team.accent] || ACCENT_STYLES.lime;
                  return (
                  <div
                    key={team.name}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg ${teamAccent.teamBg} flex items-center justify-center text-xs font-bold ${teamAccent.teamText}`}
                    >
                      {team.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-vp-lime transition-colors">
                        {team.name}
                      </p>
                      <p className="text-[10px] text-vp-text-muted">
                        {team.role} &bull; {team.members} members
                      </p>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-vp-text-muted group-hover:text-white transition-colors"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-vp-card rounded-2xl border border-vp-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon />
                <p className="text-xs font-bold text-white uppercase tracking-widest">
                  Upcoming Events
                </p>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt.name}
                    className="flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-vp-dark flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-vp-text-muted uppercase leading-none">
                        {evt.date.split(" ")[0]}
                      </span>
                      <span className="text-sm font-black text-white leading-none mt-0.5">
                        {evt.date.split(" ")[1]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-vp-lime transition-colors">
                        {evt.name}
                      </p>
                      <p className="text-[10px] text-vp-text-muted">
                        {evt.sport}
                        {evt.spots > 0 && (
                          <>
                            {" "}
                            &bull;{" "}
                            <span className="text-vp-green font-semibold">
                              {evt.spots} spots left
                            </span>
                          </>
                        )}
                        {evt.spots === 0 && (
                          <>
                            {" "}
                            &bull;{" "}
                            <span className="text-vp-red font-semibold">Sold out</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* ================================================================ */}
        {/*  BOTTOM SECTION -- Player Spotlights & Featured Cards            */}
        {/* ================================================================ */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-5">
            <TrophyIcon />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Player Spotlight
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {spotlightPlayers.map((player) => (
              <div
                key={player.name}
                className={`bg-gradient-to-br ${player.color} rounded-2xl border ${player.border} p-6 relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-[40px]" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full bg-vp-card flex items-center justify-center text-sm font-bold ${player.accent}`}
                  >
                    {player.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{player.name}</p>
                    <p className="text-[10px] text-vp-text-muted">{player.sport}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between relative z-10">
                  <div>
                    <p className={`text-3xl font-black ${player.accent}`}>
                      {player.stat}
                    </p>
                    <p className="text-[10px] text-vp-text-muted uppercase tracking-wider mt-0.5">
                      {player.statLabel}
                    </p>
                  </div>
                  <p className="text-xs text-vp-text-dim text-right max-w-[120px]">
                    {player.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Large featured action cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            {/* Card 1 -- Highlights Reel */}
            <div className="relative rounded-2xl border border-vp-border overflow-hidden h-56 group cursor-pointer">
              <img src="https://res.cloudinary.com/ddlc9p24k/image/upload/f_auto,q_auto,w_800,h_450,c_fill/versaplay/community-banner" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-vp-dark/90 via-transparent to-transparent" />
              <div className="absolute top-4 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 bg-vp-card/80 backdrop-blur border border-vp-border px-2.5 py-1 rounded-full text-[10px] font-bold text-white">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3l14 9-14 9V3z" fill="#c8ff00" />
                  </svg>
                  HIGHLIGHTS
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h3 className="text-lg font-bold text-white mb-1">
                  Top 10 Plays of the Week
                </h3>
                <p className="text-xs text-vp-text-dim">
                  The best clutch moments, insane comebacks, and highlight-reel plays
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-vp-lime/20 backdrop-blur flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3l14 9-14 9V3z" fill="#c8ff00" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 2 -- Community Challenge */}
            <div className="relative rounded-2xl border border-vp-lime/20 overflow-hidden h-56 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-vp-lime/10 via-vp-card to-vp-card" />
              <div className="absolute inset-0 bg-gradient-to-t from-vp-dark/90 via-transparent to-transparent" />
              <div className="absolute top-4 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 bg-vp-lime/20 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-vp-lime">
                  <BoltIcon />
                  CHALLENGE
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h3 className="text-lg font-bold text-white mb-1">
                  Weekend Warriors Challenge
                </h3>
                <p className="text-xs text-vp-text-dim mb-3">
                  Win 5 matches this weekend to earn exclusive rewards and badges
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <UsersIcon />
                    <span className="text-[10px] text-vp-text-dim">1,247 joined</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrophyIcon />
                    <span className="text-[10px] text-vp-text-dim">Ends in 2d 14h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
