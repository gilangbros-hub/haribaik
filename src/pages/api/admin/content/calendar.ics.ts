import type { APIRoute } from 'astro';
import { buildCalendar, validateWeddingContent } from '../../../../lib/content';
import { readWeddingDraft } from '../../../../lib/content/store';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.adminUser || !locals.supabase) return new Response('Admin access required.', { status: 401 });
  try {
    const result = validateWeddingContent(await readWeddingDraft(locals.supabase));
    if (!result.ok) return new Response('Lengkapi konten wajib terlebih dahulu.', { status: 422 });
    return new Response(buildCalendar(result.content), {
      headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="undangan-preview.ics"', 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return new Response('Kalender tidak dapat dibuat.', { status: 503 });
  }
};
