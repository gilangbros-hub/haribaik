import { isSameOriginRequest } from '../../../lib/request-origin';
import { ADMIN_COOKIE, hashSessionToken } from '../../../lib/admin-session';

export const POST = async ({ request, cookies, locals }: { request: Request; cookies: import('astro').AstroCookies; locals: App.Locals }) => {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }
  const token = cookies.get(ADMIN_COOKIE)?.value;
  if (token && locals.supabase) {
    const { error } = await locals.supabase.from('admin_sessions').delete().eq('token_hash', hashSessionToken(token));
    if (error) return Response.json({ error: 'Could not end the admin session.' }, { status: 503 });
  }
  cookies.delete(ADMIN_COOKIE, { path: '/' });
  return new Response(null, { status: 303, headers: { Location: new URL('/admin/login', request.url).toString() } });
};
