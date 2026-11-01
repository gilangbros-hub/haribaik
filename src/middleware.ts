import { createClient } from '@supabase/supabase-js';
import { defineMiddleware } from 'astro:middleware';
import { ADMIN_COOKIE, hashSessionToken } from './lib/admin-session';
import { withPrivateNoStore } from './lib/admin-response';

const isLoginPage = (pathname: string) => pathname === '/admin/login';
const isLoginEndpoint = (pathname: string) => pathname === '/api/admin/login';
const isAdminPath = (pathname: string) => pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/');
export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = null;
  context.locals.adminUser = null;

  if (!isAdminPath(context.url.pathname)) return next();

  const env = import.meta.env;
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.ADMIN_USER_ID) {
    if (isLoginPage(context.url.pathname)) return next();
    if (context.url.pathname.startsWith('/api/')) {
      return Response.json({ error: 'Admin auth is not configured.' }, { status: 503 });
    }
    return context.redirect('/admin/login?setup=1');
  }
  // Admin accounts live in our own tables, reachable only with the server-only service-role key.
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  context.locals.supabase = supabase;

  if (isLoginPage(context.url.pathname) || isLoginEndpoint(context.url.pathname)) {
    return withPrivateNoStore(await next());
  }

  const token = context.cookies.get(ADMIN_COOKIE)?.value;
  let email: string | null = null;
  if (token) {
    const { data, error } = await supabase.from('admin_sessions').select('admin_users(email)')
      .eq('token_hash', hashSessionToken(token)).gt('expires_at', new Date().toISOString()).maybeSingle();
    if (error) {
      if (context.url.pathname.startsWith('/api/')) return Response.json({ error: 'Authentication service is unavailable.' }, { status: 503 });
      return new Response('Authentication service is unavailable.', { status: 503 });
    }
    email = (data?.admin_users as unknown as { email: string } | null)?.email ?? null;
  }
  if (!email) {
    context.locals.supabase = null;
    if (context.url.pathname.startsWith('/api/')) return Response.json({ error: 'Admin access required.' }, { status: 401 });
    return context.redirect('/admin/login');
  }
  // ADMIN_USER_ID stays the owner of the draft row and media folder; it is not a login.
  context.locals.adminUser = { id: env.ADMIN_USER_ID, email };
  return withPrivateNoStore(await next());
});
