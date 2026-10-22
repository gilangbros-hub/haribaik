import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { defineMiddleware } from 'astro:middleware';
import { adminAccess } from './lib/admin-access';

const isLoginPage = (pathname: string) => pathname === '/admin/login';
const isLoginEndpoint = (pathname: string) => pathname === '/api/admin/login';
const isAdminPath = (pathname: string) => pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/');

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = null;
  context.locals.adminUser = null;

  if (!isAdminPath(context.url.pathname)) return next();

  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    if (isLoginPage(context.url.pathname)) return next();
    if (context.url.pathname.startsWith('/api/')) {
      return Response.json({ error: 'Admin auth is not configured.' }, { status: 503 });
    }
    return context.redirect('/admin/login?setup=1');
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => parseCookieHeader(context.request.headers.get('cookie') ?? ''),
      setAll: (cookies) => cookies.forEach(({ name, value, options }) => context.cookies.set(name, value, {
        ...options,
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        path: '/',
      })),
    },
  });
  context.locals.supabase = supabase;

  let user;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    user = data.user;
  } catch {
    if (context.url.pathname.startsWith('/api/')) {
      return Response.json({ error: 'Authentication service is unavailable.' }, { status: 503 });
    }
    return new Response('Authentication service is unavailable.', { status: 503 });
  }
  const access = adminAccess(user?.id, import.meta.env.ADMIN_USER_ID);
  if (access === 'allowed') context.locals.adminUser = user;

  if (isLoginPage(context.url.pathname) || isLoginEndpoint(context.url.pathname) || access === 'allowed') {
    const response = await next();
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }
  if (context.url.pathname.startsWith('/api/')) {
    return Response.json({ error: access === 'unconfigured' ? 'Admin auth is not configured.' : 'Admin access required.' }, {
      status: access === 'unconfigured' ? 503 : 401,
    });
  }
  return context.redirect('/admin/login');
});
