import type { APIRoute } from 'astro';
import { guestAdminDb } from '../../lib/guests/server.ts';
import { parseWish, saveWish } from '../../lib/guests/wishes.ts';

const response = (body: unknown, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'private, no-store, max-age=0' },
});

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) return response({ error: 'Request origin is not allowed.' }, 403);

  let body: unknown = {};
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 16384) return response({ error: 'Ucapan terlalu panjang.' }, 413);
    body = JSON.parse(text);
  } catch {
    return response({ error: 'Format ucapan tidak valid.' }, 400);
  }
  const wish = parseWish(body);
  if (!wish) return response({ error: 'Tulis ucapan terlebih dahulu.' }, 400);

  try {
    await saveWish(guestAdminDb(), wish);
    return response({ saved: true, wish: { ...wish, createdAt: new Date().toISOString() } });
  } catch {
    return response({ error: 'Ucapan belum terkirim. Periksa koneksi lalu coba lagi.' }, 503);
  }
};
