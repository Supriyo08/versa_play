import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const events = await prisma.scoringEvent.findMany({
      where: { matchId: params.id },
      include: { player: { select: { displayName: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Match events error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const { type, team, playerId, detail, matchTime } = await req.json();

    if (!type || !team) {
      return NextResponse.json(
        { error: "type and team are required" },
        { status: 400 }
      );
    }

    const validTypes = ["goal", "card", "timeout", "substitution", "point", "foul"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Create the event
    const event = await prisma.scoringEvent.create({
      data: {
        matchId: params.id,
        type,
        team,
        playerId: playerId || null,
        detail,
        matchTime,
      },
      include: { player: { select: { displayName: true } } },
    });

    // If it's a goal/point, update match score
    if (type === "goal" || type === "point") {
      if (team === 1) {
        await prisma.match.update({
          where: { id: params.id },
          data: { homeScore: { increment: 1 } },
        });
      } else {
        await prisma.match.update({
          where: { id: params.id },
          data: { awayScore: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Scoring event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
