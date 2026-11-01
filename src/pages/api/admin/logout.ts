import { isSameOriginRequest } from '../../../lib/request-origin';
import { ADMIN_COOKIE } from '../../../lib/admin-session';

export const POST = async ({ request, cookies }: { request: Request; cookies: import('astro').AstroCookies }) => {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }
  cookies.delete(ADMIN_COOKIE, { path: '/' });
  return new Response(null, { status: 303, headers: { Location: new URL('/admin/login', request.url).toString() } });
};
