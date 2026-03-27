"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth");
  }, [router]);

  return (
    <div className="min-h-screen bg-vp-dark flex items-center justify-center">
      <div className="text-vp-lime text-2xl font-black italic animate-pulse">
        VersaPlay
      </div>
    </div>
  );
}
