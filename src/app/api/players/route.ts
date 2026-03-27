import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "rating";

    const where = search
      ? {
          OR: [
            { displayName: { contains: search } },
            { user: { username: { contains: search } } },
          ],
        }
      : {};

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        include: {
          user: { select: { email: true, username: true } },
          team: { select: { id: true, name: true } },
        },
        orderBy: sort === "rating" ? { rating: "desc" } : { wins: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.player.count({ where }),
    ]);

    return NextResponse.json({
      players,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Players list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
