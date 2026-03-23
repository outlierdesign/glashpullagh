import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge middleware — runs on every request at the CDN edge.
 *
 * 1. Rate-limits API routes (60 req/min per IP)
 * 2. Blocks common attack patterns
 * 3. Adds security nonce for CSP (future use)
 */

/* ── Simple in-memory rate limiter (per edge instance) ── */
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 60;   // requests
const RATE_WINDOW = 60_000; // per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

/* ── Block suspicious path patterns ── */
const BLOCKED_PATTERNS = [
  /\.(php|asp|aspx|cgi|env|git|svn|bak|sql|config)$/i,
  /\/(wp-admin|wp-login|wp-content|xmlrpc)/i,
  /\/(\.env|\.git|\.svn|\.DS_Store)/i,
  /\/admin\/(config|setup|install)/i,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* 1. Block suspicious paths */
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  /* 2. Rate-limit API routes */
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (isRateLimited(ip)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': '60' },
      });
    }
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
