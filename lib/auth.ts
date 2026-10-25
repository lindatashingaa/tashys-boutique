import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

export const SESSION_COOKIE = 'tashys_session';
function getSecret() {
  const configuredSecret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (process.env.NODE_ENV === 'production' && (!configuredSecret || configuredSecret.length < 32)) {
    throw new Error('SESSION_SECRET must be set to at least 32 characters in production.');
  }
  return new TextEncoder().encode(configuredSecret || 'development-only-secret-change-this-value-please');
}

export type SessionUser = { id: string; name: string; email: string; phone: string; role: 'CUSTOMER' | 'ADMIN' };

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(getSecret());
  cookies().set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.id !== 'string' || typeof payload.email !== 'string' || typeof payload.phone !== 'string' || (payload.role !== 'CUSTOMER' && payload.role !== 'ADMIN')) return null;
    return { id: payload.id, name: typeof payload.name === 'string' ? payload.name : '', email: payload.email, phone: payload.phone, role: payload.role };
  } catch {
    return null;
  }
}