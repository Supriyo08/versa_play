import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/clubs - List all clubs (any authenticated user)
export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    const clubs = await prisma.club.findMany({
      include: {
        members: { select: { id: true, displayName: true, rating: true, avatarUrl: true } },
        _count: { select: { members: true, joinRequests: true } },
      },
      orderBy: { rating: "desc" },
    });

    return NextResponse.json({ clubs });
  } catch (error) {
    console.error("Failed to fetch clubs:", error);
    return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 });
  }
}

// POST /api/clubs - Create a new club (organizer/admin)
export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  if (!["organizer", "admin", "superadmin"].includes(payload.role)) {
    return NextResponse.json({ error: "Only organizers or admins can create clubs" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, sport, description, privacy } = body;

    if (!name || !sport) {
      return NextResponse.json({ error: "Name and sport are required" }, { status: 400 });
    }

    const club = await prisma.club.create({
      data: {
        name,
        sport,
        description: description || null,
        privacy: privacy || "open",
        ownerId: payload.userId,
      },
    });

    return NextResponse.json({ club }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "Club name already exists" }, { status: 409 });
    }
    console.error("Failed to create club:", error);
    return NextResponse.json({ error: "Failed to create club" }, { status: 500 });
  }
}
