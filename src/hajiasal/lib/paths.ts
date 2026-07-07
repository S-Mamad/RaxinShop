export const HAJIASAL_BASE = "/hajiasal" as const;

export function hajiasalPath(path = ""): string {
  if (!path || path === "/") return HAJIASAL_BASE;
  return `${HAJIASAL_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function hajiasalCanonical(path = ""): string {
  return hajiasalPath(path);
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function hajiasalAbsoluteUrl(path = ""): string {
  return `${siteUrl}${hajiasalPath(path)}`;
}
