import { isSameOriginRequest } from '../../../lib/request-origin';

export const POST = async ({ request, locals }: { request: Request; locals: App.Locals }) => {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }
  if (locals.supabase) {
    const { error } = await locals.supabase.auth.signOut();
    if (error) return Response.json({ error: 'Could not end the admin session.' }, { status: 503 });
  }
  return Response.redirect(new URL('/admin/login', request.url), 303);
};
