import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !["admin", "superadmin"].includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalPlayers,
      totalTeams,
      totalTournaments,
      activeTournaments,
      totalMatches,
      liveMatches,
      recentPlayers,
    ] = await Promise.all([
      prisma.player.count(),
      prisma.team.count(),
      prisma.tournament.count(),
      prisma.tournament.count({ where: { status: "active" } }),
      prisma.match.count(),
      prisma.match.count({ where: { status: "live" } }),
      prisma.player.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalPlayers,
        totalTeams,
        totalTournaments,
        activeTournaments,
        totalMatches,
        liveMatches,
        newPlayersThisWeek: recentPlayers,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
