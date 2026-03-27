"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"player" | "organizer">("player");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) { router.replace("/dashboard"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required"); return; }
    if (!password.trim()) { setError("Password is required"); return; }
    if (!isLogin && !username.trim()) { setError("Username is required"); return; }
    setLoading(true);
    try {
      if (isLogin) await login(email.trim(), password);
      else await register(email.trim(), username.trim(), password, role);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-vp-dark flex flex-col lg:flex-row">
      <div className="relative lg:w-1/2 h-64 lg:h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#1a0a2e]" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl lg:text-6xl font-black italic text-vp-lime mb-4">VersaPlay</h1>
          <p className="text-lg text-white/70">The ultimate multi-sport tournament platform</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex bg-vp-card rounded-xl p-1 mb-8">
            <button type="button" onClick={() => { setIsLogin(true); setError(""); }} className={`flex-1 py-2.5 text-sm font-medium rounded-lg ${isLogin ? "bg-vp-lime text-vp-dark" : "text-vp-text-dim"}`}>Sign In</button>
            <button type="button" onClick={() => { setIsLogin(false); setError(""); }} className={`flex-1 py-2.5 text-sm font-medium rounded-lg ${!isLogin ? "bg-vp-lime text-vp-dark" : "text-vp-text-dim"}`}>Register</button>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="text-vp-text-dim text-sm mb-8">{isLogin ? "Sign in to access your dashboard" : "Join the community"}</p>
          {error && <div className="mb-4 p-3 rounded-xl bg-vp-red/10 border border-vp-red/30 text-vp-red text-xs">{error}</div>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && <div><label className="block text-xs text-vp-text-dim mb-1.5">Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" className="w-full bg-vp-card border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/50" /></div>}
            <div><label className="block text-xs text-vp-text-dim mb-1.5">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" className="w-full bg-vp-card border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/50" /></div>
            <div><label className="block text-xs text-vp-text-dim mb-1.5">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full bg-vp-card border border-vp-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-vp-text-muted focus:outline-none focus:border-vp-lime/50" /></div>
            {!isLogin && <div><label className="block text-xs text-vp-text-dim mb-2">Register as</label><div className="flex gap-3">
              <button type="button" onClick={() => setRole("player")} className={`flex-1 py-2.5 text-sm rounded-xl border ${role === "player" ? "border-vp-lime bg-vp-lime/10 text-vp-lime" : "border-vp-border text-vp-text-dim"}`}>Player</button>
              <button type="button" onClick={() => setRole("organizer")} className={`flex-1 py-2.5 text-sm rounded-xl border ${role === "organizer" ? "border-vp-lime bg-vp-lime/10 text-vp-lime" : "border-vp-border text-vp-text-dim"}`}>Organizer</button>
            </div></div>}
            <button type="submit" disabled={loading} className="w-full bg-vp-lime text-vp-dark font-bold py-3 rounded-xl hover:bg-vp-lime-dark disabled:opacity-50 mt-2">{loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}</button>
          </form>
          <p className="text-center text-xs text-vp-text-muted mt-6">{isLogin ? "No account? " : "Have an account? "}<button type="button" onClick={() => setIsLogin(!isLogin)} className="text-vp-lime hover:underline">{isLogin ? "Create one" : "Sign in"}</button></p>
          <button type="button" onClick={() => { setEmail("marcus@apex.com"); setPassword("password123"); setIsLogin(true); }} className="mt-6 w-full p-3 rounded-xl bg-vp-card border border-vp-border hover:border-vp-lime/30">
            <p className="text-[10px] text-vp-text-muted text-center uppercase mb-1">Click to fill demo</p>
            <p className="text-xs text-vp-lime text-center font-medium">marcus@apex.com / password123</p>
          </button>
        </div>
      </div>
    </div>
  );
}
