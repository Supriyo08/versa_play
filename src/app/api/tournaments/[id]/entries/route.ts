import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

    const { teamId } = await req.json();
    if (!teamId) {
      return NextResponse.json({ error: "teamId is required" }, { status: 400 });
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: { _count: { select: { entries: true } } },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    if (tournament.status !== "registration_open") {
      return NextResponse.json(
        { error: "Registration is not open for this tournament" },
        { status: 400 }
      );
    }

    if (tournament._count.entries >= tournament.maxTeams) {
      return NextResponse.json(
        { error: "Tournament is full" },
        { status: 400 }
      );
    }

    const entry = await prisma.tournamentEntry.create({
      data: {
        tournamentId: params.id,
        teamId,
        seed: tournament._count.entries + 1,
      },
      include: { team: true },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json(
        { error: "Team is already registered for this tournament" },
        { status: 409 }
      );
    }
    console.error("Tournament entry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
