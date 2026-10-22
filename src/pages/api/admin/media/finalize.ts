import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { finalizeWeddingUpload, MEDIA_BUCKET } from '../../../../lib/content/media';

export const POST: APIRoute = async ({ request, locals }) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (!locals.adminUser || !locals.supabase) return Response.json({ error: 'Admin access required.' }, { status: 401 });
  let input: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 2048) return Response.json({ error: 'Permintaan terlalu besar.' }, { status: 413 });
    input = JSON.parse(body);
  } catch {
    return Response.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return Response.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  const { path, kind } = input as Record<string, unknown>;
  if (typeof path !== 'string') return Response.json({ error: 'Upload tidak valid.' }, { status: 422 });
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return Response.json({ error: 'Pemrosesan media belum dikonfigurasi.' }, { status: 503 });
  const serviceClient = createClient(import.meta.env.SUPABASE_URL, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const storedPath = await finalizeWeddingUpload(locals.supabase, serviceClient, locals.adminUser.id, path, kind);
    const { data, error } = await locals.supabase.storage.from(MEDIA_BUCKET).createSignedUrl(storedPath, 3600);
    if (error || !data?.signedUrl) throw error ?? new Error('Preview media tidak tersedia.');
    return Response.json({ path: storedPath, previewUrl: data.signedUrl }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Media gagal diproses.' }, { status: 422 });
  }
};
