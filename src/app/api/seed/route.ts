import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // Check if already seeded
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return NextResponse.json({ message: "Database already seeded", count: existingUsers });
    }

    const password = await hashPassword("password123");

    // Create teams first
    const teams = await Promise.all([
      prisma.team.create({ data: { name: "Apex Predators", sport: "Soccer", verified: true } }),
      prisma.team.create({ data: { name: "Thunder Wolves", sport: "Soccer", verified: true } }),
      prisma.team.create({ data: { name: "Neon Knights", sport: "Basketball", verified: true } }),
      prisma.team.create({ data: { name: "Swift Eagles", sport: "Badminton", verified: true } }),
      prisma.team.create({ data: { name: "Iron Giants", sport: "Soccer", verified: true } }),
      prisma.team.create({ data: { name: "Crimson Tide", sport: "Basketball", verified: false } }),
      prisma.team.create({ data: { name: "Storm Blazers", sport: "Badminton", verified: true } }),
      prisma.team.create({ data: { name: "Dark Phoenix", sport: "Soccer", verified: true } }),
    ]);

    // Create users with players
    const players = [
      { username: "marcusreed", email: "marcus@apex.com", displayName: "Marcus Reed", position: "Forward", teamIdx: 0, rating: 98, wins: 24, losses: 3, speed: 85, accuracy: 70, agility: 75, strength: 60, endurance: 65 },
      { username: "jadekim", email: "jade@tw.com", displayName: "Jade Kim", position: "Guard", teamIdx: 1, rating: 95, wins: 31, losses: 5, speed: 80, accuracy: 85, agility: 70, strength: 55, endurance: 75 },
      { username: "dariuscole", email: "darius@nk.com", displayName: "Darius Cole", position: "Center", teamIdx: 2, rating: 92, wins: 20, losses: 8, speed: 65, accuracy: 75, agility: 60, strength: 85, endurance: 70 },
      { username: "lenapark", email: "lena@se.com", displayName: "Lena Park", position: "Singles", teamIdx: 3, rating: 91, wins: 28, losses: 7, speed: 90, accuracy: 80, agility: 88, strength: 50, endurance: 82 },
      { username: "omarhassan", email: "omar@ig.com", displayName: "Omar Hassan", position: "Midfielder", teamIdx: 4, rating: 89, wins: 22, losses: 6, speed: 72, accuracy: 68, agility: 70, strength: 80, endurance: 78 },
      { username: "miatorres", email: "mia@ct.com", displayName: "Mia Torres", position: "Point Guard", teamIdx: 5, rating: 87, wins: 18, losses: 10, speed: 82, accuracy: 78, agility: 80, strength: 55, endurance: 72 },
    ];

    const createdPlayers = [];
    for (const p of players) {
      const user = await prisma.user.create({
        data: {
          email: p.email,
          username: p.username,
          password,
          role: "player",
          player: {
            create: {
              displayName: p.displayName,
              position: p.position,
              rating: p.rating,
              wins: p.wins,
              losses: p.losses,
              xp: p.wins * 12 + p.losses * -4,
              level: Math.floor(p.wins / 5) + 1,
              globalRank: players.indexOf(p) + 1,
              speed: p.speed,
              accuracy: p.accuracy,
              agility: p.agility,
              strength: p.strength,
              endurance: p.endurance,
              teamId: teams[p.teamIdx].id,
            },
          },
        },
        include: { player: true },
      });
      createdPlayers.push(user);
    }

    // Create organizer
    const organizer = await prisma.user.create({
      data: {
        email: "organizer@versaplay.com",
        username: "vporganizer",
        password,
        role: "organizer",
        organizer: {
          create: { orgName: "VersaPlay Official", verified: true },
        },
      },
      include: { organizer: true },
    });

    // Create admin
    await prisma.user.create({
      data: {
        email: "admin@versaplay.com",
        username: "vpadmin",
        password,
        role: "admin",
      },
    });

    // Create superadmin
    await prisma.user.create({
      data: {
        email: "superadmin@versaplay.com",
        username: "vpsuperadmin",
        password,
        role: "superadmin",
      },
    });

    // Create tournaments
    const tournament1 = await prisma.tournament.create({
      data: {
        name: "Pro League Season Finals",
        sport: "Soccer",
        format: "knockout",
        startDate: new Date("2024-05-25"),
        endDate: new Date("2024-06-02"),
        maxTeams: 16,
        prizePool: "$50,000",
        venue: "Central Arena",
        status: "active",
        organizerId: organizer.organizer!.id,
      },
    });

    const tournament2 = await prisma.tournament.create({
      data: {
        name: "Badminton Grand Slam",
        sport: "Badminton",
        format: "round_robin",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-06-05"),
        maxTeams: 32,
        prizePool: "$25,000",
        venue: "Olympic Hall",
        status: "registration_open",
        organizerId: organizer.organizer!.id,
      },
    });

    // Register teams for tournament
    for (let i = 0; i < 4; i++) {
      await prisma.tournamentEntry.create({
        data: { tournamentId: tournament1.id, teamId: teams[i].id, seed: i + 1 },
      });
    }

    // Create matches
    const match1 = await prisma.match.create({
      data: {
        tournamentId: tournament1.id,
        homeTeamId: teams[0].id,
        awayTeamId: teams[1].id,
        round: "semi_final",
        matchNumber: 1,
        status: "live",
        homeScore: 2,
        awayScore: 1,
        startedAt: new Date(),
      },
    });

    await prisma.match.create({
      data: {
        tournamentId: tournament1.id,
        homeTeamId: teams[2].id,
        awayTeamId: teams[4].id,
        round: "semi_final",
        matchNumber: 2,
        status: "scheduled",
        scheduledAt: new Date("2024-05-28"),
      },
    });

    // Add match participants
    if (createdPlayers[0].player && createdPlayers[1].player) {
      await prisma.matchParticipant.create({
        data: { matchId: match1.id, playerId: createdPlayers[0].player.id, team: 1 },
      });
      await prisma.matchParticipant.create({
        data: { matchId: match1.id, playerId: createdPlayers[1].player.id, team: 2 },
      });
    }

    // Create scoring events
    await prisma.scoringEvent.createMany({
      data: [
        { matchId: match1.id, type: "goal", team: 1, playerId: createdPlayers[0].player?.id, matchTime: "12'", detail: "Goal from free kick" },
        { matchId: match1.id, type: "card", team: 2, playerId: createdPlayers[1].player?.id, matchTime: "23'", detail: "Yellow card - rough tackle" },
        { matchId: match1.id, type: "goal", team: 2, matchTime: "34'", detail: "Header from corner" },
        { matchId: match1.id, type: "goal", team: 1, playerId: createdPlayers[0].player?.id, matchTime: "61'", detail: "Penalty kick" },
      ],
    });

    // Create achievements
    const achievements = await Promise.all([
      prisma.achievement.create({ data: { name: "Diamond Player", description: "Reach rating 90+", icon: "diamond", color: "blue" } }),
      prisma.achievement.create({ data: { name: "Lightning Fast", description: "Win 5 matches in a row", icon: "bolt", color: "green" } }),
      prisma.achievement.create({ data: { name: "Tournament Champion", description: "Win a tournament", icon: "trophy", color: "orange" } }),
    ]);

    // Award achievements to Marcus Reed
    if (createdPlayers[0].player) {
      for (const achievement of achievements) {
        await prisma.playerAchievement.create({
          data: { playerId: createdPlayers[0].player.id, achievementId: achievement.id },
        });
      }
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      data: {
        users: createdPlayers.length + 3,
        teams: teams.length,
        tournaments: 2,
        matches: 2,
        achievements: achievements.length,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
