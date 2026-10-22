import type { APIRoute } from 'astro';
import { validateWeddingContent } from '../../../lib/content';
import { readWeddingDraft, saveWeddingDraft } from '../../../lib/content/store';

const isAdmin = (locals: App.Locals) => Boolean(locals.adminUser && locals.supabase);

export const GET: APIRoute = async ({ locals }) => {
  if (!isAdmin(locals)) return Response.json({ error: 'Admin access required.' }, { status: 401 });
  try {
    return Response.json({ content: await readWeddingDraft(locals.supabase!) }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return Response.json({ error: 'Draf tidak dapat dibaca. Periksa koneksi database.' }, { status: 503 });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (!isAdmin(locals)) return Response.json({ error: 'Admin access required.' }, { status: 401 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Content-Type harus application/json.' }, { status: 415 });

  let input: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 64 * 1024) return Response.json({ error: 'Konten terlalu besar.' }, { status: 413 });
    input = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Format konten tidak valid.' }, { status: 400 });
  }
  const result = validateWeddingContent(input, false);
  if (!result.ok) return Response.json({ errors: result.errors }, { status: 422 });
  try {
    await saveWeddingDraft(locals.supabase!, locals.adminUser!.id, result.content);
    return Response.json({ saved: true });
  } catch {
    return Response.json({ error: 'Draf gagal disimpan. Periksa koneksi database; perubahan form tetap tersedia.' }, { status: 503 });
  }
};
