import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSessionToken, COOKIE_NAME } from '@/lib/auth';

/** Basic email regex — not exhaustive but blocks obvious garbage. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Password constraints: 8–128 chars, must be a string. */
const MIN_PASSWORD = 8;
const MAX_PASSWORD = 128;

export async function POST(request: NextRequest) {
  try {
    // Reject non-JSON content types
    const ct = request.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON body' }, { status: 400 });
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { email, password } = body as Record<string, unknown>;

    // Type checks
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password must be strings' }, { status: 400 });
    }

    // Format validation
    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmedEmail) || trimmedEmail.length > 254) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (password.length < MIN_PASSWORD || password.length > MAX_PASSWORD) {
      return NextResponse.json(
        { error: `Password must be ${MIN_PASSWORD}–${MAX_PASSWORD} characters` },
        { status: 400 },
      );
    }

    const user = await verifyCredentials(trimmedEmail, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
