"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function TopNav() {
  const pathname = usePathname();
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const topLinks = [
    { label: "Tournaments", href: "/tournaments" },
    { label: "Live", href: "/dashboard" },
    { label: "Rankings", href: "/analytics" },
    { label: "Community", href: "/community" },
    { label: "Clubs", href: "/clubs" },
    { label: "Series", href: "/series" },
  ];

  const initials = user?.username?.substring(0, 2).toUpperCase() || "??";

  return (
    <header className="sticky top-0 z-50 bg-vp-dark/80 backdrop-blur-xl border-b border-vp-border">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo-icon.svg" alt="VersaPlay" width={28} height={28} className="flex-shrink-0" />
          <span className="text-xl font-black italic text-vp-lime tracking-tight hidden sm:inline">Versa<span className="text-white">Play</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {topLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${isActive ? "text-white font-medium underline underline-offset-[6px] decoration-vp-lime decoration-2" : "text-vp-text-dim hover:text-white"}`}>
                {link.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link href="/admin" className={`px-3 py-2 text-sm rounded-lg transition-colors ${pathname?.startsWith("/admin") ? "text-white font-medium underline underline-offset-[6px] decoration-vp-orange decoration-2" : "text-vp-orange/70 hover:text-vp-orange"}`}>
              Admin
            </Link>
          )}
          {isSuperAdmin && (
            <Link href="/superadmin" className={`px-3 py-2 text-sm rounded-lg transition-colors ${pathname === "/superadmin" ? "text-white font-medium underline underline-offset-[6px] decoration-vp-red decoration-2" : "text-vp-red/70 hover:text-vp-red"}`}>
              Super
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {/* Role badge */}
          {user && (
            <span className={`hidden sm:inline-flex text-[9px] font-bold uppercase px-2 py-1 rounded-full ${
              user.role === "superadmin" ? "bg-vp-red/20 text-vp-red" :
              user.role === "admin" ? "bg-vp-orange/20 text-vp-orange" :
              user.role === "organizer" ? "bg-vp-blue/20 text-vp-blue" :
              "bg-vp-green/20 text-vp-green"
            }`}>
              {user.role}
            </span>
          )}

          <button className="relative p-2 rounded-lg hover:bg-vp-card transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a5 5 0 00-5 5v3l-1.5 2.5a.5.5 0 00.43.75h12.14a.5.5 0 00.43-.75L15 10V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.5" /><path d="M8 15a2 2 0 104 0" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>

          <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-vp-lime to-vp-green flex items-center justify-center text-vp-dark font-bold text-xs">
            {initials}
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-vp-card">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {mobileOpen ? <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /> : <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-vp-border bg-vp-dark/95 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-1">
            <p className="px-4 py-1 text-[9px] font-bold text-vp-text-muted uppercase tracking-widest">Main</p>
            {["Dashboard", "Profile", "Tournaments", "Brackets", "Scoring", "Analytics"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm rounded-lg text-vp-text-dim hover:text-white hover:bg-vp-card transition-colors block">{item}</Link>
            ))}
            <div className="border-t border-vp-border mt-2 pt-2">
              <p className="px-4 py-1 text-[9px] font-bold text-vp-text-muted uppercase tracking-widest">Features</p>
              {[
                { label: "Community", href: "/community" },
                { label: "Series", href: "/series" },
                { label: "Live Scoring", href: "/live-scoring" },
                { label: "Live Stream", href: "/livestream" },
                { label: "Player Stats", href: "/player-stats" },
                { label: "Clubs", href: "/clubs" },
                { label: "Subscription", href: "/subscription" },
              ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm rounded-lg text-vp-text-dim hover:text-white hover:bg-vp-card transition-colors block">{item.label}</Link>
              ))}
            </div>
            {isAdmin && (
              <div className="border-t border-vp-border mt-2 pt-2">
                <p className="px-4 py-1 text-[9px] font-bold text-vp-orange uppercase tracking-widest">Admin</p>
                {[
                  { label: "Admin Panel", href: "/admin" },
                  { label: "Roster", href: "/admin/roster" },
                  { label: "Add Player", href: "/admin/add-player" },
                  { label: "Match Setup", href: "/admin/match-setup" },
                  { label: "Officials", href: "/admin/officials" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm rounded-lg text-vp-orange hover:bg-vp-card transition-colors block">{item.label}</Link>
                ))}
                {isSuperAdmin && (
                  <Link href="/superadmin" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm rounded-lg text-vp-red hover:bg-vp-card transition-colors block">Superadmin</Link>
                )}
              </div>
            )}
            <div className="border-t border-vp-border mt-2 pt-2">
              <button onClick={() => { logout(); setMobileOpen(false); }} className="px-4 py-3 text-sm rounded-lg text-vp-red hover:bg-vp-red/10 transition-colors w-full text-left">Sign Out</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
