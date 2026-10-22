import type { APIRoute } from 'astro';
import { guestAdminDb } from '../../../../lib/guests/server.ts';
import { saveGuestRsvp } from '../../../../lib/guests/rsvp.ts';

const response = (body: unknown, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'private, no-store, max-age=0' },
});

export const POST: APIRoute = async ({ request, params }) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) return response({ error: 'Request origin is not allowed.' }, 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return response({ error: 'Content-Type harus application/json.' }, 415);
  if (!params.slug || params.slug.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(params.slug)) return response({ error: 'Tautan undangan tidak tersedia.' }, 404);

  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 1024) return response({ error: 'Permintaan terlalu besar.' }, 413);
    body = JSON.parse(text);
  } catch {
    return response({ error: 'Format jawaban tidak valid.' }, 400);
  }
  const status = typeof body === 'object' && body !== null && 'status' in body ? body.status : null;
  if (status !== 'attending' && status !== 'declined') return response({ error: 'Pilih hadir atau tidak hadir.' }, 400);

  try {
    const saved = await saveGuestRsvp(guestAdminDb(), params.slug, status);
    return saved ? response({ saved: true }) : response({ error: 'Tautan undangan tidak tersedia.' }, 404);
  } catch {
    return response({ error: 'Jawaban belum tersimpan. Periksa koneksi lalu coba lagi.' }, 503);
  }
};
