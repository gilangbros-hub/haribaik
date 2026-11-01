import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'hb_admin';
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

const digest = (value: string) => createHash('sha256').update(value).digest();
// The secret is "session secret + password", so changing either one logs every session out.
const sign = (expires: string, secret: string) => createHmac('sha256', secret).update(expires).digest('base64url');
const same = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

// Missing or weak settings fail closed: nobody can log in.
export const sessionConfigured = (env: { ADMIN_EMAIL?: string; ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string; ADMIN_USER_ID?: string }) =>
  Boolean(env.ADMIN_EMAIL && env.ADMIN_PASSWORD && env.ADMIN_USER_ID && (env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32);

export function credentialsMatch(email: string, password: string, adminEmail: string, adminPassword: string) {
  // Check both so a wrong email takes as long as a wrong password.
  const emailOk = same(email.trim().toLowerCase(), adminEmail.trim().toLowerCase());
  const passwordOk = same(password, adminPassword);
  return emailOk && passwordOk;
}

export function createSessionToken(secret: string, now = Date.now()) {
  const expires = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${expires}.${sign(expires, secret)}`;
}

export function sessionValid(token: string | undefined, secret: string, now = Date.now()) {
  if (!token) return false;
  const [expires, signature, extra] = token.split('.');
  if (!expires || !signature || extra !== undefined || !/^\d+$/.test(expires)) return false;
  return same(signature, sign(expires, secret)) && Number(expires) * 1000 > now;
}
