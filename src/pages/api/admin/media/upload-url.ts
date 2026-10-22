import type { APIRoute } from 'astro';
import { authorizeWeddingUpload } from '../../../../lib/content/media';
import { validateUpload } from '../../../../lib/content/media-validation';

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
  const { kind, contentType, size } = input as Record<string, unknown>;
  if (!validateUpload(kind, contentType, size)) return Response.json({ error: 'Jenis file atau ukuran tidak didukung. Foto maksimal 10 MB; MP3 maksimal 20 MB.' }, { status: 422 });
  try {
    const upload = await authorizeWeddingUpload(locals.supabase, locals.adminUser.id, kind, contentType, size);
    return Response.json(upload, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return Response.json({ error: 'Upload tidak dapat disiapkan. Periksa koneksi atau Storage.' }, { status: 503 });
  }
};
