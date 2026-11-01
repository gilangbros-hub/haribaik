import { createClient } from '@supabase/supabase-js';
import { defineMiddleware } from 'astro:middleware';
import { ADMIN_COOKIE, sessionConfigured, sessionValid } from './lib/admin-session';
import { withPrivateNoStore } from './lib/admin-response';

const isLoginPage = (pathname: string) => pathname === '/admin/login';
const isLoginEndpoint = (pathname: string) => pathname === '/api/admin/login';
const isAdminPath = (pathname: string) => pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/');
export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = null;
  context.locals.adminUser = null;

  if (!isAdminPath(context.url.pathname)) return next();

  const env = import.meta.env;
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !sessionConfigured(env)) {
    if (isLoginPage(context.url.pathname)) return next();
    if (context.url.pathname.startsWith('/api/')) {
      return Response.json({ error: 'Admin auth is not configured.' }, { status: 503 });
    }
    return context.redirect('/admin/login?setup=1');
  }

  if (isLoginPage(context.url.pathname) || isLoginEndpoint(context.url.pathname)) {
    return withPrivateNoStore(await next());
  }

  if (!sessionValid(context.cookies.get(ADMIN_COOKIE)?.value, env.ADMIN_SESSION_SECRET + env.ADMIN_PASSWORD)) {
    if (context.url.pathname.startsWith('/api/')) return Response.json({ error: 'Admin access required.' }, { status: 401 });
    return context.redirect('/admin/login');
  }
  // Our own login replaced Supabase Auth, so admin data goes through the server-only service-role key.
  context.locals.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  context.locals.adminUser = { id: env.ADMIN_USER_ID, email: env.ADMIN_EMAIL };
  return withPrivateNoStore(await next());
});
