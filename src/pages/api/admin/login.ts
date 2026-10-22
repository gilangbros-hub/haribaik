export const POST = async ({ request, locals }: { request: Request; locals: App.Locals }) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }
  if (!locals.supabase) return Response.json({ error: 'Admin auth is not configured.' }, { status: 503 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.redirect(new URL('/admin/login?error=1', request.url), 303);
  }
  const email = form.get('email');
  const password = form.get('password');
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return Response.redirect(new URL('/admin/login?error=1', request.url), 303);
  }

  const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return Response.redirect(new URL('/admin/login?error=1', request.url), 303);
  if (data.user.id !== import.meta.env.ADMIN_USER_ID) {
    await locals.supabase.auth.signOut();
    return Response.redirect(new URL('/admin/login?error=1', request.url), 303);
  }
  return Response.redirect(new URL('/admin', request.url), 303);
};
