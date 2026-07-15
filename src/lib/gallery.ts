import "server-only";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export function getCarGalleryImages(carSlug: string): string[] {
  const dir = join(process.cwd(), "public", "cars", carSlug);
  try {
    return readdirSync(dir)
      .filter((f) => IMG_EXT.has(f.slice(f.lastIndexOf(".")).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/cars/${carSlug}/${f}`);
  } catch {
    return [];
  }
}
