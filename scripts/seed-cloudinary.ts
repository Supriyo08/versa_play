/**
 * Seed Cloudinary with placeholder images for VersaPlay
 * Run: npx tsx scripts/seed-cloudinary.ts
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate colored SVG placeholders and upload them
const placeholders = [
  { name: "player-default", color: "#c8ff00", text: "VP", w: 400, h: 400 },
  { name: "team-default", color: "#4a7cff", text: "TEAM", w: 400, h: 400 },
  { name: "field-cricket", color: "#22c55e", text: "CRICKET", w: 800, h: 400 },
  { name: "field-soccer", color: "#22c55e", text: "SOCCER", w: 800, h: 400 },
  { name: "trophy-gold", color: "#f59e0b", text: "TROPHY", w: 400, h: 400 },
  { name: "community-banner", color: "#a855f7", text: "COMMUNITY", w: 1200, h: 400 },
  { name: "hero-banner", color: "#c8ff00", text: "VERSAPLAY", w: 1200, h: 600 },
  { name: "subscription-bg", color: "#4a7cff", text: "PRO", w: 1200, h: 400 },
  { name: "match-highlight-1", color: "#ef4444", text: "MATCH", w: 800, h: 450 },
  { name: "match-highlight-2", color: "#4a7cff", text: "LIVE", w: 800, h: 450 },
  { name: "player-avatar-1", color: "#c8ff00", text: "MR", w: 200, h: 200 },
  { name: "player-avatar-2", color: "#4a7cff", text: "JK", w: 200, h: 200 },
  { name: "player-avatar-3", color: "#f59e0b", text: "DC", w: 200, h: 200 },
];

function createSVG(color: string, text: string, w: number, h: number): string {
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0a0a0f"/>
        <stop offset="100%" style="stop-color:#14141f"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect x="0" y="0" width="${w}" height="${h}" fill="${color}" opacity="0.08"/>
    <circle cx="${w * 0.7}" cy="${h * 0.3}" r="${Math.min(w, h) * 0.3}" fill="${color}" opacity="0.05"/>
    <circle cx="${w * 0.2}" cy="${h * 0.8}" r="${Math.min(w, h) * 0.2}" fill="${color}" opacity="0.03"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="system-ui, sans-serif" font-weight="900" font-size="${Math.min(w, h) * 0.15}"
      fill="${color}" opacity="0.6">${text}</text>
    <line x1="0" y1="${h - 2}" x2="${w}" y2="${h - 2}" stroke="${color}" stroke-width="2" opacity="0.3"/>
  </svg>`;
}

async function uploadSVG(name: string, svg: string) {
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "versaplay",
      public_id: name,
      overwrite: true,
    });
    console.log(`Uploaded: versaplay/${name} -> ${result.secure_url}`);
    return result;
  } catch (err) {
    console.error(`Failed: ${name}`, err);
  }
}

async function main() {
  console.log("Seeding Cloudinary with VersaPlay placeholders...\n");

  // Upload logo SVG
  const logoSvg = `<svg width="400" height="80" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="80" fill="#0a0a0f"/>
    <path d="M8 24L32 8L56 24V56L32 72L8 56V24Z" fill="#c8ff00" opacity="0.15" stroke="#c8ff00" stroke-width="2"/>
    <path d="M24 28L42 40L24 52V28Z" fill="#c8ff00"/>
    <text x="72" y="50" font-family="system-ui, sans-serif" font-weight="900" font-size="36" fill="#ffffff" font-style="italic">Versa</text>
    <text x="225" y="50" font-family="system-ui, sans-serif" font-weight="900" font-size="36" fill="#c8ff00" font-style="italic">Play</text>
  </svg>`;
  await uploadSVG("logo", logoSvg);

  // Upload logo icon
  const iconSvg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="40" fill="#0a0a0f"/>
    <path d="M40 65L100 25L160 65V135L100 175L40 135V65Z" fill="#c8ff00" opacity="0.15" stroke="#c8ff00" stroke-width="3"/>
    <path d="M80 75L130 100L80 125V75Z" fill="#c8ff00"/>
  </svg>`;
  await uploadSVG("logo-icon", iconSvg);

  // Upload all placeholders
  for (const p of placeholders) {
    const svg = createSVG(p.color, p.text, p.w, p.h);
    await uploadSVG(p.name, svg);
  }

  console.log("\nDone! All images uploaded to Cloudinary.");
}

main().catch(console.error);
