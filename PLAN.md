# VersaPlay Enhanced Tournament Platform - Implementation Plan

## Summary
Add cricket/football/basketball sport-specific scoring (CricHeroes-style), tournament match scheduling with day-wise grouping, team/player management with image uploads, private matches with access codes, club join requests, and all UI screens from the design.

## Phase 1: Database Schema Changes
- Add `CricketMatchState`, `CricketBall`, `BasketballMatchState` models
- Extend `Match` with `matchDay`, `matchDayLabel`, `isPrivate`, `accessCode`, `codeType`, `sport`
- Extend `MatchParticipant` with `role`, `battingOrder`, `stats` (JSON)
- Extend `ScoringEvent` with `secondaryPlayerId`, `points`, `quarter`, `half`, `innings`, `overBall`
- Extend `Player` with `phoneNumber`, `avatarUrl` (already exists)
- Extend `Tournament` with `isPrivate`, `accessCode`
- Add `Upload` model for images
- Add `ClubJoinRequest` model (playerId, teamId, status, message)
- Run migration

## Phase 2: New API Routes (~17 new routes)
- Upload API, Team members API, Player search API
- Tournament schedule API (day-wise match creation)
- Private match access code API
- Cricket scoring APIs (setup, ball, undo, change-innings, change-bowler, change-batsman)
- Football stats API
- Basketball scoring APIs (setup, score, event)
- Club join request API (request, approve/reject, list)

## Phase 3: Frontend Pages (~8 new pages, ~25 new components)
- Tournament detail page with tabs (Overview, Schedule, Teams, Standings)
- Tournament schedule management page (admin)
- Team detail page with player management
- Dynamic scoring page `/scoring/[id]` detecting sport
- Cricket scoring components (ball input, scorecard, over display, wicket modal, etc.)
- Football scoring components (goal/card/sub modals, timeline)
- Basketball scoring components (quarter scoreboard, player stats)
- Private match access code gate
- Club join request UI (player request button + admin approval panel)
- All new design screens (Community Feed, Add Player, Player Roster, Cricket Series, Match Setup, Official Assignments, Live Scoring, Club Management, Subscription Tiers, Superadmin Dashboard, Player Stats)

## Phase 4: Mobile App Updates
- Sport-specific scoring screens
- Team detail screen with contact import
- Tournament detail screen
- Navigation updates

## Implementation Order
1. Database migration (schema changes)
2. Upload infrastructure + image components
3. Team & player management + club join requests
4. Enhanced tournament management (day-wise scheduling)
5. Private match system
6. Football scoring upgrade (real API data)
7. Cricket scoring (largest feature - CricHeroes-style)
8. Basketball scoring
9. All remaining design screens
10. Mobile app updates
11. Polish & testing
