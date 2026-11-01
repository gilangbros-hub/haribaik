import { createHash, randomBytes } from 'node:crypto';

export const ADMIN_COOKIE = 'hb_admin';
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

// The cookie holds a random token; the database stores only its hash, so a leaked table cannot log anyone in.
export const newSessionToken = () => randomBytes(32).toString('base64url');
export const hashSessionToken = (token: string) => createHash('sha256').update(token).digest('hex');

// Mirrors the create_admin_user checks so the form can explain the problem.
export function newAdminError(email: string, password: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 254) return 'Email tidak valid.';
  const bytes = new TextEncoder().encode(password).length;
  if (bytes < 10) return 'Kata sandi minimal 10 karakter.';
  if (bytes > 72) return 'Kata sandi maksimal 72 karakter.';
  return null;
}
