import type { APIRoute } from 'astro';
import { buildCalendar } from '../lib/content';
import { publicContentClient, readPublishedWedding } from '../lib/content/store';

export const GET: APIRoute = async () => {
  const client = publicContentClient();
  if (!client) return new Response('Kalender belum tersedia.', { status: 503 });
  try {
    const content = await readPublishedWedding(client);
    if (!content) return new Response('Undangan belum dipublikasikan.', { status: 404 });
    const filename = `${content.brideName}-${content.groomName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'undangan';
    return new Response(buildCalendar(content), {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.ics"`,
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch {
    return new Response('Kalender tidak dapat dibuat.', { status: 503 });
  }
};
