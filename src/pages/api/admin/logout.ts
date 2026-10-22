export const POST = async ({ request, locals }: { request: Request; locals: App.Locals }) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }
  if (locals.supabase) {
    const { error } = await locals.supabase.auth.signOut();
    if (error) return Response.json({ error: 'Could not end the admin session.' }, { status: 503 });
  }
  return Response.redirect(new URL('/admin/login', request.url), 303);
};
