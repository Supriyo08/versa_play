"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const DashboardIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /></svg>;
const ProfileIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" /><path d="M3 17.5c0-3.5 3.134-5.5 7-5.5s7 2 7 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const BracketsIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4h4v4H3zM3 12h4v4H3zM13 8h4v4h-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 6h3v0a0 0 0 010 0v4H7M7 14h3v0a0 0 0 000 0v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M10 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const ScoringIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M10 3v14M2 10h16" stroke="currentColor" strokeWidth="1.5" /></svg>;
const AnalyticsIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 17V9l4-3 4 5 4-8 2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const CommunityIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="14" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M1 17c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M14 12c2.5 0 4.5 1.5 4.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const SeriesIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M7 10a3 3 0 016 0" stroke="currentColor" strokeWidth="1.5" /><path d="M10 3v2M10 15v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const LiveScoringIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="7" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" /><path d="M11 8h5M11 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const LiveStreamIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14v10H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 8l5 2.5-5 2.5V8z" fill="currentColor" /></svg>;
const ClubsIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
const PlayerStatsIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 17V7M7 17V3M11 17v-7M15 17V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const SubscriptionIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M3 8h14" stroke="currentColor" strokeWidth="1.5" /><path d="M7 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const AdminIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l1.5 3h3.5l-2.8 2.2 1 3.3L10 8.5 6.8 10.5l1-3.3L5 5h3.5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M4 14h12M4 17h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const SuperIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M10 6v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M10 3v1M10 16v1M3 10h1M16 10h1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>;

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();

  const mainNav = [
    { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    { label: "Profile", href: "/profile", icon: ProfileIcon },
    { label: "Tournaments", href: "/tournaments", icon: BracketsIcon },
    { label: "Brackets", href: "/brackets", icon: BracketsIcon },
    { label: "Scoring", href: "/scoring", icon: ScoringIcon },
    { label: "Analytics", href: "/analytics", icon: AnalyticsIcon },
  ];

  const featureNav = [
    { label: "Community", href: "/community", icon: CommunityIcon },
    { label: "Series", href: "/series", icon: SeriesIcon },
    { label: "Live Scoring", href: "/live-scoring", icon: LiveScoringIcon },
    { label: "Live Stream", href: "/livestream", icon: LiveStreamIcon },
    { label: "Player Stats", href: "/player-stats", icon: PlayerStatsIcon },
    { label: "Clubs", href: "/clubs", icon: ClubsIcon },
    { label: "Subscription", href: "/subscription", icon: SubscriptionIcon },
  ];

  const adminNav = [
    { label: "Admin", href: "/admin", icon: AdminIcon, show: isAdmin },
    { label: "Roster", href: "/admin/roster", icon: ProfileIcon, show: isAdmin },
    { label: "Add Player", href: "/admin/add-player", icon: PlayerStatsIcon, show: isAdmin },
    { label: "Match Setup", href: "/admin/match-setup", icon: ScoringIcon, show: isAdmin },
    { label: "Officials", href: "/admin/officials", icon: AdminIcon, show: isAdmin },
    { label: "Superadmin", href: "/superadmin", icon: SuperIcon, show: isSuperAdmin },
  ];

  const roleBadge = user?.role === "superadmin" ? { text: "SUPERADMIN", color: "bg-vp-red/20 text-vp-red" }
    : user?.role === "admin" ? { text: "ADMIN", color: "bg-vp-orange/20 text-vp-orange" }
    : user?.role === "organizer" ? { text: "ORGANIZER", color: "bg-vp-blue/20 text-vp-blue" }
    : { text: "PLAYER", color: "bg-vp-green/20 text-vp-green" };

  const NavLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
    const isActive = pathname === href || pathname?.startsWith(href + "/");
    return (
      <Link href={href}
        className={`flex items-center gap-3 px-5 py-2.5 text-[13px] transition-colors ${isActive ? "sidebar-active text-white font-medium" : "text-vp-text-dim hover:text-white hover:bg-vp-card/50"}`}>
        <span className={isActive ? "text-vp-lime" : ""}>{icon}</span>
        {label}
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-[220px] min-h-screen bg-vp-sidebar border-r border-vp-border overflow-y-auto">
      {/* User Info */}
      <div className="px-5 py-5 border-b border-vp-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-vp-lime to-vp-green flex items-center justify-center text-vp-dark font-bold text-xs">
            {user?.username?.substring(0, 2).toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.username || "User"}</p>
            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${roleBadge.color}`}>{roleBadge.text}</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-3">
        <p className="px-5 py-1.5 text-[9px] font-bold text-vp-text-muted uppercase tracking-widest">Main</p>
        {mainNav.map((item) => <NavLink key={item.href} {...item} />)}

        <div className="my-2 mx-5 border-t border-vp-border" />
        <p className="px-5 py-1.5 text-[9px] font-bold text-vp-text-muted uppercase tracking-widest">Features</p>
        {featureNav.map((item) => <NavLink key={item.href} {...item} />)}

        {(isAdmin || isSuperAdmin) && (
          <>
            <div className="my-2 mx-5 border-t border-vp-border" />
            <p className="px-5 py-1.5 text-[9px] font-bold text-vp-orange uppercase tracking-widest">Admin</p>
            {adminNav.filter(item => item.show).map((item) => <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label} />)}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-vp-border">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-vp-text-dim hover:text-vp-red hover:bg-vp-red/5 rounded-lg transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 15H4a1 1 0 01-1-1V4a1 1 0 011-1h2M12 12l3-3-3-3M7 9h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
