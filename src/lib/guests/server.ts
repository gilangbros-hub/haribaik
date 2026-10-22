import { createClient } from '@supabase/supabase-js';

export type GuestRow = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  guest_rsvps: { status: 'attending' | 'declined'; answered_at: string } | null;
};

export function guestAdminDb() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = import.meta.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Penyimpanan daftar tamu belum dikonfigurasi.');
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getGuests(db: ReturnType<typeof guestAdminDb>) {
  const { data, error } = await db.from('guests')
    .select('id,name,slug,active,guest_rsvps(status,answered_at)')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((guest) => ({
    ...guest,
    guest_rsvps: Array.isArray(guest.guest_rsvps) ? guest.guest_rsvps[0] ?? null : guest.guest_rsvps ?? null,
  })) as GuestRow[];
}

export function csvError(error: unknown) {
  if (error instanceof Error && /CSV|nama|slug|tamu|baris|format/i.test(error.message)) {
    return Response.json({ error: error.message }, { status: 400 });
  }
  return Response.json({ error: 'Daftar tamu gagal diproses. Periksa koneksi dan coba lagi.' }, { status: 503 });
}

export async function readCsv(request: Request) {
  const length = request.headers.get('content-length');
  if (length && Number(length) > 1_050_000) throw new Error('File CSV melewati batas 1 MB.');
  let form: FormData;
  try { form = await request.formData(); }
  catch { throw new Error('Format CSV upload tidak valid.'); }
  const file = form.get('file');
  if (!(file instanceof File) || !file.name.toLowerCase().endsWith('.csv')) throw new Error('Pilih file CSV.');
  if (file.size > 1_000_000) throw new Error('File CSV melewati batas 1 MB.');
  const text = await file.text();
  if (text.includes('\uFFFD')) throw new Error('Encoding CSV tidak valid; simpan sebagai UTF-8.');
  return text;
}
