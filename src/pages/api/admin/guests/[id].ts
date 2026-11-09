import type { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ request, locals, params }) => {
  if (!locals.adminUser || !locals.supabase) return Response.json({ error: 'Admin access required.' }, { status: 401 });
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id ?? '')) return Response.json({ error: 'Tamu tidak ditemukan.' }, { status: 404 });
  const { data, error } = await locals.supabase.from('guests').update({ active: false, updated_at: new Date().toISOString() })
    .eq('id', params.id).eq('active', true).select('id').maybeSingle();
  if (error) return Response.json({ error: 'Tamu gagal dihapus. Coba lagi.' }, { status: 503 });
  if (!data) return Response.json({ error: 'Tamu tidak ditemukan atau sudah nonaktif.' }, { status: 404 });
  return Response.json({ removed: true });
};

export const PATCH: APIRoute = async ({ request, locals, params }) => {
  if (!locals.adminUser || !locals.supabase) return Response.json({ error: 'Admin access required.' }, { status: 401 });
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id ?? '')) return Response.json({ error: 'Tamu tidak ditemukan.' }, { status: 404 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'Data tidak valid.' }, { status: 400 }); }
  if (!body || typeof body !== 'object' || !('sent' in body) || typeof body.sent !== 'boolean') return Response.json({ error: 'Data tidak valid.' }, { status: 400 });
  const { data, error } = await locals.supabase.from('guests').update({ sent: body.sent, updated_at: new Date().toISOString() })
    .eq('id', params.id).eq('active', true).select('id').maybeSingle();
  if (error) return Response.json({ error: 'Status pengiriman gagal disimpan.' }, { status: 503 });
  if (!data) return Response.json({ error: 'Tamu tidak ditemukan atau sudah nonaktif.' }, { status: 404 });
  return Response.json({ saved: true });
};
