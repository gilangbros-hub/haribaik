import { isSameOriginRequest } from '../../../lib/request-origin';
import { ADMIN_COOKIE, SESSION_SECONDS, hashSessionToken, newSessionToken } from '../../../lib/admin-session';

export const POST = async ({ request, cookies, locals }: { request: Request; cookies: import('astro').AstroCookies; locals: App.Locals }) => {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }
  const db = locals.supabase;
  if (!db) return Response.json({ error: 'Admin auth is not configured.' }, { status: 503 });
  const fail = async () => {
    // shortcut: a fixed delay slows guessing but is not a real rate limit; add one if the admin URL gets attacked.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Response.redirect(new URL('/admin/login?error=1', request.url), 303);
  };

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail();
  }
  const email = form.get('email');
  const password = form.get('password');
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) return fail();

  const { data: userId, error } = await db.rpc('verify_admin_login', { p_email: email, p_password: password });
  if (error) return Response.json({ error: 'Authentication service is unavailable.' }, { status: 503 });
  if (!userId) return fail();

  const token = newSessionToken();
  await db.from('admin_sessions').delete().lt('expires_at', new Date().toISOString());
  const { error: sessionError } = await db.from('admin_sessions').insert({
    token_hash: hashSessionToken(token), user_id: userId, expires_at: new Date(Date.now() + SESSION_SECONDS * 1000).toISOString(),
  });
  if (sessionError) return Response.json({ error: 'Authentication service is unavailable.' }, { status: 503 });
  cookies.set(ADMIN_COOKIE, token, { httpOnly: true, secure: import.meta.env.PROD, sameSite: 'lax', path: '/', maxAge: SESSION_SECONDS });
  return new Response(null, { status: 303, headers: { Location: new URL('/admin', request.url).toString() } });
};
