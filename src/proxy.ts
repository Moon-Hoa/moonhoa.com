import { NextRequest, NextResponse } from "next/server";

// Best-effort in-memory rate limiting. Works within a single long-lived
// instance (fine for local dev / a lightly-loaded single Vercel instance)
// but Vercel can run multiple concurrent instances each with their own Map,
// so this is not a true distributed limit. Once Vercel + a Redis/Upstash
// account exist, replace with @vercel/firewall rules or @upstash/ratelimit
// for real production-grade protection — this is the code-level mechanism
// the architecture doc calls for, not a substitute for edge/CDN-level limits.
interface RouteLimit {
  match: (pathname: string, method: string) => boolean;
  windowMs: number;
  max: number;
}

const LIMITS: RouteLimit[] = [
  // Registration: sends an email per successful request, so kept tight.
  { match: (p, m) => p === "/api/register" && m === "POST", windowMs: 5 * 60_000, max: 5 },
  { match: (p, m) => p === "/api/reports" && m === "POST", windowMs: 5 * 60_000, max: 10 },
  { match: (p, m) => p === "/api/admin/login" && m === "POST", windowMs: 5 * 60_000, max: 5 },
  // Transfer initiate/confirm each send an email; accept just finalizes.
  { match: (p, m) => p === "/api/transfer/initiate" && m === "POST", windowMs: 5 * 60_000, max: 5 },
  { match: (p, m) => p === "/api/transfer/confirm" && m === "POST", windowMs: 5 * 60_000, max: 5 },
  { match: (p, m) => p === "/api/transfer/accept" && m === "POST", windowMs: 5 * 60_000, max: 10 },
  {
    match: (p, m) => (p === "/api/lots/available" || p === "/api/registry") && m === "GET",
    windowMs: 60_000,
    max: 60,
  },
];

const buckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const limit = LIMITS.find((l) => l.match(pathname, method));
  if (!limit) return NextResponse.next();

  const now = Date.now();
  if (Math.random() < 0.01) pruneExpired(now);

  const key = `${getClientIp(request)}:${pathname}:${method}`;
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + limit.windowMs });
    return NextResponse.next();
  }

  if (bucket.count >= limit.max) {
    const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }

  bucket.count += 1;
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/register",
    "/api/reports",
    "/api/admin/login",
    "/api/lots/available",
    "/api/registry",
    "/api/transfer/initiate",
    "/api/transfer/confirm",
    "/api/transfer/accept",
  ],
};
