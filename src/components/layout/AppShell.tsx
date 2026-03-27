"use client";

import TopNav from "./TopNav";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-vp-dark">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-56px)] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
