import type { APIRoute } from 'astro';
import { analyzeGuestImport, parseGuestsCsv } from '../../../../lib/guests/csv';
import { csvError, getGuests, guestAdminDb, readCsv } from '../../../../lib/guests/server';

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.adminUser) return Response.json({ error: 'Admin access required.' }, { status: 401 });
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  try {
    const rows = parseGuestsCsv(await readCsv(request));
    const db = guestAdminDb();
    const preview = analyzeGuestImport(rows, (await getGuests(db)).map(({ id, name, slug, active }) => ({ id, name, slug, active })));
    const { error } = await db.rpc('replace_active_guests', { p_rows: preview.rows });
    if (error) throw error;
    return Response.json({ counts: preview.counts }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return csvError(error);
  }
};
