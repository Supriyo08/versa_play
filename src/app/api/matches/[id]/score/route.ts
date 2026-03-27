import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromHeader(req.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { homeScore, awayScore, status } = await req.json();

    const updateData: Record<string, unknown> = {};
    if (homeScore !== undefined) updateData.homeScore = homeScore;
    if (awayScore !== undefined) updateData.awayScore = awayScore;
    if (status) {
      updateData.status = status;
      if (status === "live" && !updateData.startedAt) {
        updateData.startedAt = new Date();
      }
      if (status === "completed") {
        updateData.endedAt = new Date();
      }
    }

    const match = await prisma.match.update({
      where: { id: params.id },
      data: updateData,
      include: {
        homeTeam: { select: { name: true } },
        awayTeam: { select: { name: true } },
      },
    });

    // If match completed, update player stats
    if (status === "completed") {
      const participants = await prisma.matchParticipant.findMany({
        where: { matchId: params.id },
      });

      for (const participant of participants) {
        const isWinner =
          (participant.team === 1 && match.homeScore > match.awayScore) ||
          (participant.team === 2 && match.awayScore > match.homeScore);

        const xp = isWinner ? 12 : -4;

        await prisma.player.update({
          where: { id: participant.playerId },
          data: {
            wins: isWinner ? { increment: 1 } : undefined,
            losses: !isWinner ? { increment: 1 } : undefined,
            xp: { increment: Math.max(xp, 0) },
          },
        });

        await prisma.matchParticipant.update({
          where: { id: participant.id },
          data: { xpEarned: xp },
        });
      }
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error("Match score update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
