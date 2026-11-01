import { isSameOriginRequest } from '../../../lib/request-origin';
import { newAdminError } from '../../../lib/admin-session';

export const POST = async ({ request, locals }: { request: Request; locals: App.Locals }) => {
  if (!isSameOriginRequest(request)) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (!locals.adminUser || !locals.supabase) return Response.json({ error: 'Admin access required.' }, { status: 401 });
  const back = (query: string) => Response.redirect(new URL(`/admin/users?${query}`, request.url), 303);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return back('error=invalid');
  }
  const email = form.get('email');
  const password = form.get('password');
  if (typeof email !== 'string' || typeof password !== 'string' || newAdminError(email, password)) return back('error=invalid');

  const { error } = await locals.supabase.rpc('create_admin_user', { p_email: email, p_password: password });
  if (error) return back(error.code === '23505' ? 'error=exists' : 'error=failed');
  return back(`created=${encodeURIComponent(email.trim().toLowerCase())}`);
};
