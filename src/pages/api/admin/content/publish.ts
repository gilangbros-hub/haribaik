import type { APIRoute } from 'astro';
import { validateWeddingContent } from '../../../../lib/content';
import { publishWeddingDraft, readWeddingDraft } from '../../../../lib/content/store';

export const POST: APIRoute = async ({ request, locals }) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (!locals.adminUser || !locals.supabase) return Response.json({ error: 'Admin access required.' }, { status: 401 });

  try {
    const draft = await readWeddingDraft(locals.supabase);
    const result = validateWeddingContent(draft);
    if (!result.ok) return Response.json({ errors: result.errors }, { status: 422 });
    const published = await publishWeddingDraft(locals.supabase, result.content);
    if (!published) return Response.json({ error: 'Draf berubah saat Publish. Simpan lagi lalu coba kembali.' }, { status: 409 });
    return Response.json({ published: true });
  } catch {
    return Response.json({ error: 'Publikasi gagal. Publikasi terakhir dan input form tetap tersedia.' }, { status: 503 });
  }
};
