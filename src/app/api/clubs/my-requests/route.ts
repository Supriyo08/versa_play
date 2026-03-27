import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/clubs/my-requests - Get current player's join requests
export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    const player = await prisma.player.findUnique({ where: { userId: payload.userId } });
    if (!player) {
      return NextResponse.json({ error: "Player profile not found" }, { status: 404 });
    }

    const requests = await prisma.clubJoinRequest.findMany({
      where: { playerId: player.id },
      include: {
        club: {
          select: { id: true, name: true, sport: true, rating: true, logoUrl: true, privacy: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Failed to fetch player requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
