import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const sport = searchParams.get("sport");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (sport) where.sport = sport;

    const tournaments = await prisma.tournament.findMany({
      where,
      include: {
        organizer: { include: { user: { select: { username: true } } } },
        _count: { select: { entries: true, matches: true } },
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({ tournaments });
  } catch (error) {
    console.error("Tournaments list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Must be organizer or admin
    if (!["organizer", "admin", "superadmin"].includes(payload.role)) {
      return NextResponse.json(
        { error: "Only organizers can create tournaments" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, sport, format, startDate, endDate, maxTeams, prizePool, venue, description } = body;

    if (!name || !sport || !format || !startDate || !endDate || !maxTeams) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get organizer ID
    let organizerId: string;
    if (payload.role === "organizer") {
      const organizer = await prisma.organizer.findUnique({
        where: { userId: payload.userId },
      });
      if (!organizer) {
        return NextResponse.json({ error: "Organizer profile not found" }, { status: 404 });
      }
      organizerId = organizer.id;
    } else {
      // Admin creating — use or create a system organizer
      let organizer = await prisma.organizer.findUnique({
        where: { userId: payload.userId },
      });
      if (!organizer) {
        organizer = await prisma.organizer.create({
          data: { userId: payload.userId, orgName: "System Admin" },
        });
      }
      organizerId = organizer.id;
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        sport,
        format,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxTeams,
        prizePool,
        venue,
        description,
        organizerId,
        status: "registration_open",
      },
    });

    return NextResponse.json({ tournament }, { status: 201 });
  } catch (error) {
    console.error("Tournament create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
