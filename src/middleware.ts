import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge middleware — runs on every request at the CDN edge.
 *
 * 1. Blocks common attack patterns
 * 2. Strict rate-limit on authentication routes (10 req / 15 min per IP)
 * 3. General rate-limit on all other API routes (60 req/min per IP)
 * 4. Rejects oversized payloads on API routes
 */

/* ── Rate-limiter helpers ── */
interface RateEntry {
  count: number;
  reset: number;
}

const apiRateMap = new Map<string, RateEntry>();
const authRateMap = new Map<string, RateEntry>();

const API_RATE_LIMIT = 60;
const API_RATE_WINDOW = 60_000; // 1 minute

const AUTH_RATE_LIMIT = 10;      // max 10 attempts
const AUTH_RATE_WINDOW = 900_000; // per 15-minute window

function isRateLimited(
  map: Map<string, RateEntry>,
  ip: string,
  limit: number,
  window: number,
): { limited: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const entry = map.get(ip);

  if (!entry || now > entry.reset) {
    map.set(ip, { count: 1, reset: now + window });
    return { limited: false, remaining: limit - 1, retryAfter: 0 };
  }

  entry.count++;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.reset - now) / 1000);
    return { limited: true, remaining: 0, retryAfter };
  }

  return { limited: false, remaining: limit - entry.count, retryAfter: 0 };
}

/* ── Periodic cleanup to prevent memory leaks ── */
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 300_000; // 5 minutes

function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  apiRateMap.forEach((entry, key) => {
    if (now > entry.reset) apiRateMap.delete(key);
  });
  authRateMap.forEach((entry, key) => {
    if (now > entry.reset) authRateMap.delete(key);
  });
}

/* ── Block suspicious path patterns ── */
const BLOCKED_PATTERNS = [
  /\.(php|asp|aspx|cgi|env|git|svn|bak|sql|config)$/i,
  /\/(wp-admin|wp-login|wp-content|xmlrpc)/i,
  /\/(\.env|\.git|\.svn|\.DS_Store)/i,
  /\/admin\/(config|setup|install)/i,
];

/* ── Auth routes that get strict rate limiting ── */
const AUTH_PATHS = ['/api/auth/login', '/api/auth/login/'];

/* ── Max request body size (1 MB for API routes) ── */
const MAX_BODY_SIZE = 1_048_576; // 1 MB

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  cleanupStaleEntries();

  /* 1. Block suspicious paths */
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  /* 2. Reject oversized payloads on API routes */
  if (pathname.startsWith('/api/')) {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413 },
      );
    }
  }

  /* 3. Strict rate-limit on auth routes (10 req / 15 min per IP) */
  if (AUTH_PATHS.includes(pathname)) {
    const ip = getClientIp(request);
    const { limited, remaining, retryAfter } = isRateLimited(
      authRateMap,
      ip,
      AUTH_RATE_LIMIT,
      AUTH_RATE_WINDOW,
    );

    if (limited) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(AUTH_RATE_LIMIT),
            'X-RateLimit-Remaining': '0',
          },
        },
      );
    }

    // Continue but add rate-limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(AUTH_RATE_LIMIT));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    return response;
  }

  /* 4. General rate-limit on other API routes (60 req/min per IP) */
  if (pathname.startsWith('/api/')) {
    const ip = getClientIp(request);
    const { limited, remaining, retryAfter } = isRateLimited(
      apiRateMap,
      ip,
      API_RATE_LIMIT,
      API_RATE_WINDOW,
    );

    if (limited) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(API_RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(API_RATE_LIMIT));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next (Next.js internals)
     * - static files (images, fonts, etc.)
     * - favicon
     */
    '/((?!_next/static|_next/image|favicon\\.ico|images/|pwa-).*)',
  ],
};
