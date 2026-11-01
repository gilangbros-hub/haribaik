import { isSameOriginRequest } from '../../../lib/request-origin';
import { ADMIN_COOKIE, SESSION_SECONDS, createSessionToken, credentialsMatch, sessionConfigured } from '../../../lib/admin-session';

export const POST = async ({ request, cookies }: { request: Request; cookies: import('astro').AstroCookies }) => {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }
  const env = import.meta.env;
  if (!sessionConfigured(env)) return Response.json({ error: 'Admin auth is not configured.' }, { status: 503 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.redirect(new URL('/admin/login?error=1', request.url), 303);
  }
  const email = form.get('email');
  const password = form.get('password');
  if (typeof email !== 'string' || typeof password !== 'string' || !credentialsMatch(email, password, env.ADMIN_EMAIL, env.ADMIN_PASSWORD)) {
    // shortcut: a fixed delay slows guessing but is not a real rate limit; add one if the admin URL gets attacked.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Response.redirect(new URL('/admin/login?error=1', request.url), 303);
  }
  cookies.set(ADMIN_COOKIE, createSessionToken(env.ADMIN_SESSION_SECRET + env.ADMIN_PASSWORD), {
    httpOnly: true, secure: import.meta.env.PROD, sameSite: 'lax', path: '/', maxAge: SESSION_SECONDS,
  });
  return new Response(null, { status: 303, headers: { Location: new URL('/admin', request.url).toString() } });
};
