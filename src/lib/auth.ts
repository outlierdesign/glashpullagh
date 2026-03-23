import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'editor';
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    'FATAL: JWT_SECRET environment variable is not set. ' +
    'Set a cryptographically random string (≥32 chars) in your environment.',
  );
}
const COOKIE_NAME = 'glash_session';

// Parse users from env vars
export function getConfiguredUsers(): { email: string; hash: string }[] {
  const users: { email: string; hash: string }[] = [];
  for (let i = 1; i <= 5; i++) {
    const val = process.env[`ADMIN_USER_${i}`];
    if (val && val.includes(':')) {
      const [email, ...hashParts] = val.split(':');
      users.push({ email: email.trim(), hash: hashParts.join(':').trim() });
    }
  }
  return users;
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  const users = getConfiguredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.hash);
  if (!valid) return null;

  return {
    email: user.email,
    name: user.email.split('@')[0],
    role: 'admin'
  };
}

export function createSessionToken(user: User): string {
  return jwt.sign(
    { email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifySessionToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    return decoded;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { COOKIE_NAME };
