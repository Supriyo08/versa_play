import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/clubs/join-request - Player requests to join a club
export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    const body = await req.json();
    const { clubId, message } = body;

    if (!clubId) {
      return NextResponse.json({ error: "Club ID is required" }, { status: 400 });
    }

    // Get the player record for this user
    const player = await prisma.player.findUnique({ where: { userId: payload.userId } });
    if (!player) {
      return NextResponse.json({ error: "Player profile not found" }, { status: 404 });
    }

    // Check if already a member of this club
    if (player.clubId === clubId) {
      return NextResponse.json({ error: "You are already a member of this club" }, { status: 400 });
    }

    // Check if already has a pending request
    const existingRequest = await prisma.clubJoinRequest.findUnique({
      where: { clubId_playerId: { clubId, playerId: player.id } },
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return NextResponse.json({ error: "You already have a pending request for this club" }, { status: 400 });
      }
      // If previously rejected, allow re-request by updating
      if (existingRequest.status === "rejected") {
        const updated = await prisma.clubJoinRequest.update({
          where: { id: existingRequest.id },
          data: { status: "pending", message: message || null, createdAt: new Date() },
        });
        return NextResponse.json({ request: updated });
      }
    }

    const joinRequest = await prisma.clubJoinRequest.create({
      data: {
        clubId,
        playerId: player.id,
        message: message || null,
        status: "pending",
      },
    });

    return NextResponse.json({ request: joinRequest }, { status: 201 });
  } catch (error) {
    console.error("Failed to create join request:", error);
    return NextResponse.json({ error: "Failed to create join request" }, { status: 500 });
  }
}

// PATCH /api/clubs/join-request - Admin/organizer accepts or rejects a request
export async function PATCH(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    const body = await req.json();
    const { requestId, action } = body; // action: "accept" | "reject"

    if (!requestId || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Request ID and valid action (accept/reject) are required" }, { status: 400 });
    }

    // Get the join request with club info
    const joinRequest = await prisma.clubJoinRequest.findUnique({
      where: { id: requestId },
      include: { club: true },
    });

    if (!joinRequest) {
      return NextResponse.json({ error: "Join request not found" }, { status: 404 });
    }

    // Check if user is the club owner or admin
    const isClubOwner = joinRequest.club.ownerId === payload.userId;
    const isAdmin = ["admin", "superadmin"].includes(payload.role);

    if (!isClubOwner && !isAdmin) {
      return NextResponse.json({ error: "Only club owner or admin can manage requests" }, { status: 403 });
    }

    if (joinRequest.status !== "pending") {
      return NextResponse.json({ error: "This request has already been processed" }, { status: 400 });
    }

    if (action === "accept") {
      // Update the request status and add player to club
      await prisma.$transaction([
        prisma.clubJoinRequest.update({
          where: { id: requestId },
          data: { status: "accepted" },
        }),
        prisma.player.update({
          where: { id: joinRequest.playerId },
          data: { clubId: joinRequest.clubId },
        }),
      ]);

      return NextResponse.json({ message: "Player accepted to club", status: "accepted" });
    } else {
      // Reject the request
      await prisma.clubJoinRequest.update({
        where: { id: requestId },
        data: { status: "rejected" },
      });

      return NextResponse.json({ message: "Request rejected", status: "rejected" });
    }
  } catch (error) {
    console.error("Failed to process join request:", error);
    return NextResponse.json({ error: "Failed to process join request" }, { status: 500 });
  }
}

// GET /api/clubs/join-request - Get pending requests for a club (admin/owner)
export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const clubId = searchParams.get("clubId");

  if (!clubId) {
    return NextResponse.json({ error: "Club ID is required" }, { status: 400 });
  }

  try {
    // Verify the user is the club owner or admin
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    const isClubOwner = club.ownerId === payload.userId;
    const isAdmin = ["admin", "superadmin"].includes(payload.role);

    if (!isClubOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const requests = await prisma.clubJoinRequest.findMany({
      where: { clubId },
      include: {
        player: {
          select: {
            id: true,
            displayName: true,
            position: true,
            rating: true,
            avatarUrl: true,
            speed: true,
            accuracy: true,
            agility: true,
            strength: true,
            endurance: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Failed to fetch join requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
