import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper to get optimized image URL
export function getCloudinaryUrl(publicId: string, options?: { width?: number; height?: number; crop?: string }) {
  const transforms: string[] = ["f_auto", "q_auto"];
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transforms.join(",")}/${publicId}`;
}

// Predefined image paths for the app
export const VP_IMAGES = {
  logo: "versaplay/logo",
  logoIcon: "versaplay/logo-icon",
  heroBanner: "versaplay/hero-banner",
  playerDefault: "versaplay/player-default",
  teamDefault: "versaplay/team-default",
  fieldCricket: "versaplay/field-cricket",
  fieldSoccer: "versaplay/field-soccer",
  trophyGold: "versaplay/trophy-gold",
  communityBanner: "versaplay/community-banner",
  subscriptionBg: "versaplay/subscription-bg",
};
