"use client";

import AppShell from "@/components/layout/AppShell";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/* ------------------------------------------------------------------ */
/*  Toggle Switch – reusable, stateless presentation component        */
/* ------------------------------------------------------------------ */
function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className="relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
      style={{ backgroundColor: enabled ? "#c8ff00" : "#1e1e30" }}
    >
      <div
        className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
        style={{
          transform: enabled ? "translateX(20px)" : "translateX(4px)",
        }}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */
const systemMetrics = [
  {
    label: "System Uptime",
    value: "99.97%",
    detail: "Last 30 days",
    color: "#22c55e",
  },
  {
    label: "Active Users",
    value: "12,847",
    detail: "Currently online",
    color: "#c8ff00",
  },
  {
    label: "API Calls Today",
    value: "2.4M",
    detail: "98ms avg response",
    color: "#3b82f6",
  },
  {
    label: "Storage Used",
    value: "847 GB",
    detail: "of 2 TB allocated",
    color: "#f97316",
  },
];

const services = [
  { name: "Web Servers", status: "healthy" as const, load: 34 },
  { name: "Database Cluster", status: "healthy" as const, load: 52 },
  { name: "CDN", status: "healthy" as const, load: 28 },
  { name: "WebSocket Servers", status: "warning" as const, load: 78 },
  { name: "Background Jobs", status: "healthy" as const, load: 41 },
];

const userActivity = [
  { action: "New registrations", count: 342, trend: "+12%" },
  { action: "Matches played", count: 1247, trend: "+8%" },
  { action: "Tournament signups", count: 89, trend: "+24%" },
  { action: "Support tickets", count: 15, trend: "-5%" },
  { action: "Payment transactions", count: 234, trend: "+18%" },
];

const subscriptionTiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    users: 18420,
    features: ["Basic profiles", "Join tournaments", "View rankings"],
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/mo",
    users: 5230,
    features: [
      "Advanced stats",
      "Priority matchmaking",
      "Custom badges",
      "Team creation",
    ],
    highlighted: true,
  },
  {
    name: "Club",
    price: "$49.99",
    period: "/mo",
    users: 842,
    features: [
      "Unlimited teams",
      "Custom tournaments",
      "Analytics suite",
      "API access",
      "White-label options",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    users: 23,
    features: [
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "On-premise option",
      "Revenue sharing",
    ],
  },
];

const gateways = [
  { label: "Stripe", status: "Connected", icon: "S" },
  { label: "PayPal", status: "Connected", icon: "P" },
  { label: "Apple Pay", status: "Pending Setup", icon: "A" },
  { label: "Google Pay", status: "Connected", icon: "G" },
];

const securityCards = [
  {
    label: "2FA Required",
    desc: "Require two-factor authentication for all admin accounts",
    enabled: true,
  },
  {
    label: "Rate Limiting",
    desc: "API rate limiting per user (1000 req/min)",
    enabled: true,
  },
  {
    label: "IP Whitelisting",
    desc: "Restrict admin panel access by IP",
    enabled: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
export default function SuperAdminPage() {
  const { isSuperAdmin, loading: authLoading, user } = useAuth();

  // RBAC Guard — only superadmin can access
  if (!authLoading && !isSuperAdmin) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[60vh] px-6">
          <div className="w-16 h-16 rounded-full bg-vp-red/20 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M5.07 19h13.86c1.1 0 1.79-1.19 1.24-2.14L13.24 4.14a1.42 1.42 0 00-2.48 0L3.83 16.86c-.55.95.14 2.14 1.24 2.14z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-vp-text-dim text-center max-w-md">You don&apos;t have permission to access the Superadmin Panel. This page is restricted to <span className="text-vp-red font-semibold">Superadmin</span> users only.</p>
          <p className="text-xs text-vp-text-muted mt-3">Your current role: <span className="text-white font-medium capitalize">{user?.role || "unknown"}</span></p>
        </div>
      </AppShell>
    );
  }
  /* ---- tab state ------------------------------------------------- */
  const [activeTab, setActiveTab] = useState<
    "overview" | "config" | "monetization" | "media"
  >("overview");

  /* ---- Config > Global Settings toggles (5) ---------------------- */
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState(true);
  const [tournamentCreation, setTournamentCreation] = useState(true);
  const [liveScoring, setLiveScoring] = useState(true);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);

  /* ---- Config > Notification System toggles (4) ------------------ */
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  /* ---- Media > Live Stream Configuration toggles (2) ------------- */
  const [cdnCaching, setCdnCaching] = useState(true);
  const [autoRecord, setAutoRecord] = useState(true);

  /* ---- Media > Stream Monetization toggles (3) ------------------- */
  const [payPerView, setPayPerView] = useState(true);
  const [adIntegration, setAdIntegration] = useState(false);
  const [donationTips, setDonationTips] = useState(true);

  /* ================================================================ */
  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8">
        {/* ----- Header -------------------------------------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold rounded uppercase tracking-wide">
                Superadmin
              </span>
              <span className="px-2 py-0.5 bg-vp-lime/10 text-vp-lime text-[10px] font-bold rounded uppercase tracking-wide">
                Platform Pulse
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Platform Pulse
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time platform health, revenue metrics & system control
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-vp-card rounded-xl border border-vp-border px-4 py-2">
              <p className="text-[10px] text-vp-text-dim uppercase">Revenue</p>
              <p className="text-lg font-black text-vp-lime">$1,482,900 <span className="text-xs text-vp-green font-normal">+18.2%</span></p>
            </div>
            <div className="bg-vp-card rounded-xl border border-vp-border px-4 py-2">
              <p className="text-[10px] text-vp-text-dim uppercase">MRR</p>
              <p className="text-lg font-black text-white">842 <span className="text-xs text-vp-green font-normal">subs</span></p>
            </div>
            <div className="bg-vp-card rounded-xl border border-vp-border px-4 py-2">
              <p className="text-[10px] text-vp-text-dim uppercase">Health</p>
              <p className="text-lg font-black text-vp-green">41.1% <span className="text-xs text-vp-text-dim font-normal">load</span></p>
            </div>
          </div>
        </div>

        {/* ----- Tab bar ------------------------------------------- */}
        <div className="flex gap-1 mb-8 bg-[#12121e] rounded-xl p-1 w-fit">
          {(["overview", "config", "monetization", "media"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-[#c8ff00] text-[#0a0a14]"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* ========================================================= */}
        {/*  OVERVIEW TAB                                              */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <>
            {/* System Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {systemMetrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-[#12121e] rounded-2xl border border-[#1e1e30] p-5"
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    {m.label}
                  </p>
                  <p
                    className="text-2xl font-black mt-2"
                    style={{ color: m.color }}
                  >
                    {m.value}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{m.detail}</p>
                </div>
              ))}
            </div>

            {/* System Health + User Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <div className="bg-[#12121e] rounded-2xl border border-[#1e1e30] p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                  System Health
                </h3>
                <div className="space-y-4">
                  {services.map((svc) => (
                    <div key={svc.name} className="flex items-center gap-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          svc.status === "healthy"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      />
                      <span className="text-xs text-white flex-1">
                        {svc.name}
                      </span>
                      <div className="w-24 h-2 bg-[#0a0a14] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            svc.load > 70 ? "bg-orange-500" : "bg-green-500"
                          }`}
                          style={{ width: `${svc.load}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        {svc.load}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Activity (24h) */}
              <div className="bg-[#12121e] rounded-2xl border border-[#1e1e30] p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                  User Activity (24h)
                </h3>
                <div className="space-y-3">
                  {userActivity.map((item) => (
                    <div
                      key={item.action}
                      className="flex items-center justify-between py-2 border-b border-[#1e1e30] last:border-0"
                    >
                      <span className="text-xs text-gray-500">
                        {item.action}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">
                          {item.count}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            item.trend.startsWith("+")
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {item.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/*  CONFIG TAB                                                */}
        {/* ========================================================= */}
        {activeTab === "config" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Global Settings */}
            <div className="bg-[#12121e] rounded-2xl border border-[#1e1e30] p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Global Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Maintenance Mode</span>
                  <Toggle
                    enabled={maintenanceMode}
                    onToggle={() => setMaintenanceMode((p) => !p)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">New Registrations</span>
                  <Toggle
                    enabled={newRegistrations}
                    onToggle={() => setNewRegistrations((p) => !p)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">
                    Tournament Creation
                  </span>
                  <Toggle
                    enabled={tournamentCreation}
                    onToggle={() => setTournamentCreation((p) => !p)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Live Scoring</span>
                  <Toggle
                    enabled={liveScoring}
                    onToggle={() => setLiveScoring((p) => !p)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">
                    Analytics Tracking
                  </span>
                  <Toggle
                    enabled={analyticsTracking}
                    onToggle={() => setAnalyticsTracking((p) => !p)}
                  />
                </div>
              </div>
            </div>

            {/* Notification System */}
            <div className="bg-[#12121e] rounded-2xl border border-[#1e1e30] p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Notification System
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">
                    Email Notifications
                  </span>
                  <Toggle
                    enabled={emailNotifications}
                    onToggle={() => setEmailNotifications((p) => !p)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">
                    Push Notifications
                  </span>
                  <Toggle
                    enabled={pushNotifications}
                    onToggle={() => setPushNotifications((p) => !p)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">SMS Alerts</span>
                  <Toggle
                    enabled={smsAlerts}
                    onToggle={() => setSmsAlerts((p) => !p)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">
                    In-App Notifications
                  </span>
                  <Toggle
                    enabled={inAppNotifications}
                    onToggle={() => setInAppNotifications((p) => !p)}
                  />
                </div>
              </div>
            </div>

            {/* Security Protocols */}
            <div className="bg-[#12121e] rounded-2xl border border-[#1e1e30] p-6 lg:col-span-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Security Protocols
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {securityCards.map((sec) => (
                  <div
                    key={sec.label}
                    className="bg-[#0a0a14] rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">
                        {sec.label}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          sec.enabled ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-gray-600">{sec.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/*  MONETIZATION TAB                                          */}
        {/* ========================================================= */}
        {activeTab === "monetization" && (
          <>
            {/* Subscription Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {subscriptionTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`bg-[#12121e] rounded-2xl border p-6 ${
                    tier.highlighted
                      ? "border-[#c8ff00] shadow-[0_0_20px_rgba(200,255,0,0.08)]"
                      : "border-[#1e1e30]"
                  }`}
                >
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {tier.name}
                  </p>
                  <p className="text-2xl font-black text-white mt-2">
                    {tier.price}
                    {tier.period && (
                      <span className="text-sm font-normal text-gray-500">
                        {tier.period}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#c8ff00] mt-1">
                    {tier.users.toLocaleString()} users
                  </p>
                  <div className="mt-4 pt-4 border-t border-[#1e1e30] space-y-2">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="#c8ff00"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-xs text-gray-500">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      alert(`Managing ${tier.name} tier configuration`)
                    }
                    className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      tier.highlighted
                        ? "bg-[#c8ff00] text-[#0a0a14] hover:bg-[#b8ef00]"
                        : "bg-[#0a0a14] border border-[#1e1e30] text-white hover:bg-[#1e1e30]"
                    }`}
                  >
                    Manage Tier
                  </button>
                </div>
              ))}
            </div>

            {/* Payment Gateway Settings */}
            <div className="bg-[#12121e] rounded-2xl border border-[#1e1e30] p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Payment Gateway Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gateways.map((gw) => (
                  <div
                    key={gw.label}
                    className="flex items-center gap-4 bg-[#0a0a14] rounded-xl p-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#12121e] flex items-center justify-center text-sm font-bold text-[#c8ff00]">
                      {gw.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">
                        {gw.label}
                      </p>
                      <p
                        className={`text-[10px] ${
                          gw.status === "Connected"
                            ? "text-green-500"
                            : "text-orange-500"
                        }`}
                      >
                        {gw.status}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        alert(`Opening ${gw.label} gateway configuration`)
                      }
                      className="text-xs text-blue-500 hover:underline cursor-pointer"
                    >
                      Configure
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/*  MEDIA TAB                                                 */}
        {/* ========================================================= */}
        {activeTab === "media" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Stream Configuration */}
            <div className="bg-[#12121e] rounded-2xl border border-[#1e1e30] p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Live Stream Configuration
              </h3>
              <div className="space-y-4">
                {/* RTMP Endpoint */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    RTMP Endpoint
                  </label>
                  <input
                    type="text"
                    value="rtmp://stream.versaplay.io/live"
                    readOnly
                    className="w-full bg-[#0a0a14] border border-[#1e1e30] rounded-xl px-4 py-3 text-sm text-white font-mono"
                  />
                </div>

                {/* Stream Quality */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Stream Quality
                  </label>
                  <select className="w-full bg-[#0a0a14] border border-[#1e1e30] rounded-xl px-4 py-3 text-sm text-white appearance-none cursor-pointer">
                    <option>1080p (Full HD)</option>
                    <option>720p (HD)</option>
                    <option>480p (SD)</option>
                  </select>
                </div>

                {/* CDN Caching Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">
                    Enable CDN Caching
                  </span>
                  <Toggle
                    enabled={cdnCaching}
                    onToggle={() => setCdnCaching((p) => !p)}
                  />
                </div>

                {/* Auto-Record Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">
                    Auto-Record Streams
                  </span>
                  <Toggle
                    enabled={autoRecord}
                    onToggle={() => setAutoRecord((p) => !p)}
                  />
                </div>
              </div>
            </div>

            {/* Stream Monetization */}
            <div className="bg-[#12121e] rounded-2xl border border-[#1e1e30] p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Stream Monetization
              </h3>
              <div className="space-y-4">
                {/* Pay-Per-View */}
                <div className="flex items-center justify-between bg-[#0a0a14] rounded-xl p-4">
                  <div>
                    <p className="text-xs font-bold text-white">
                      Pay-Per-View Events
                    </p>
                    <p className="text-[10px] text-gray-600">
                      Charge viewers for premium matches
                    </p>
                  </div>
                  <Toggle
                    enabled={payPerView}
                    onToggle={() => setPayPerView((p) => !p)}
                  />
                </div>

                {/* Ad Integration */}
                <div className="flex items-center justify-between bg-[#0a0a14] rounded-xl p-4">
                  <div>
                    <p className="text-xs font-bold text-white">
                      Ad Integration
                    </p>
                    <p className="text-[10px] text-gray-600">
                      Display ads during stream breaks
                    </p>
                  </div>
                  <Toggle
                    enabled={adIntegration}
                    onToggle={() => setAdIntegration((p) => !p)}
                  />
                </div>

                {/* Donation/Tips */}
                <div className="flex items-center justify-between bg-[#0a0a14] rounded-xl p-4">
                  <div>
                    <p className="text-xs font-bold text-white">
                      Donation/Tips
                    </p>
                    <p className="text-[10px] text-gray-600">
                      Allow viewer donations during streams
                    </p>
                  </div>
                  <Toggle
                    enabled={donationTips}
                    onToggle={() => setDonationTips((p) => !p)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
