import type { APIRoute } from 'astro';
import { exportGuestsCsv } from '../../../../lib/guests/csv';
import { csvError, getGuests, guestAdminDb } from '../../../../lib/guests/server';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.adminUser) return Response.json({ error: 'Admin access required.' }, { status: 401 });
  try {
    const guests = await getGuests(guestAdminDb());
    const active = guests.filter(({ active }) => active).map(({ name, slug, guest_rsvps }) => ({
      name, slug, rsvp: guest_rsvps[0]?.status ?? '', answeredAt: guest_rsvps[0]?.answered_at ?? null,
    }));
    return new Response(exportGuestsCsv(active), { headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="daftar-tamu.csv"',
      'Cache-Control': 'private, no-store',
    } });
  } catch (error) {
    return csvError(error);
  }
};
