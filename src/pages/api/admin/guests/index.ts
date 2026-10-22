import type { APIRoute } from 'astro';
import { getGuests, guestAdminDb, csvError } from '../../../../lib/guests/server';

export const GET: APIRoute = async ({ locals, url }) => {
  if (!locals.adminUser) return Response.json({ error: 'Admin access required.' }, { status: 401 });
  try {
    const query = (url.searchParams.get('q') ?? '').trim().toLocaleLowerCase('id');
    const status = url.searchParams.get('status') ?? 'active';
    if (!['active', 'inactive', 'all'].includes(status)) return Response.json({ error: 'Filter status tidak valid.' }, { status: 400 });
    const guests = await getGuests(guestAdminDb());
    return Response.json(guests.filter((guest) => (status === 'all' || guest.active === (status === 'active'))
      && (!query || guest.name.toLocaleLowerCase('id').includes(query) || guest.slug.includes(query))), {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    return csvError(error);
  }
};
