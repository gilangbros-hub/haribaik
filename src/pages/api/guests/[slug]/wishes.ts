import type { APIRoute } from 'astro';
import { guestAdminDb } from '../../../../lib/guests/server.ts';
import { parseWish, saveGuestWish } from '../../../../lib/guests/wishes.ts';

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
    if (new TextEncoder().encode(text).byteLength > 4096) return response({ error: 'Ucapan terlalu panjang.' }, 413);
    body = JSON.parse(text);
  } catch {
    return response({ error: 'Format ucapan tidak valid.' }, 400);
  }
  const wish = parseWish(body);
  if (!wish) return response({ error: 'Isi nama (maks. 80) dan ucapan (maks. 500 karakter).' }, 400);

  try {
    const saved = await saveGuestWish(guestAdminDb(), params.slug, wish);
    if (saved === 'limit') return response({ error: 'Terima kasih, ucapan Anda sudah cukup banyak.' }, 429);
    return saved ? response({ saved: true, wish: { ...wish, createdAt: new Date().toISOString() } }) : response({ error: 'Tautan undangan tidak tersedia.' }, 404);
  } catch {
    return response({ error: 'Ucapan belum terkirim. Periksa koneksi lalu coba lagi.' }, 503);
  }
};
