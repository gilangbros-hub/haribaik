import type { SupabaseClient } from '@supabase/supabase-js';

export type GuestWish = { name: string; message: string; createdAt: string };

// Open by request: anything goes. Only an empty message is refused, and long text is cut, never rejected.
export function parseWish(body: unknown): { name: string; message: string } | null {
  const { name, message } = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const text = (value: unknown) => (value === null || value === undefined ? '' : String(value)).trim();
  const clean = { name: [...(text(name) || 'Tamu')].slice(0, 80).join(''), message: [...text(message)].slice(0, 2000).join('') };
  return clean.message ? clean : null;
}

export async function saveWish(db: SupabaseClient, wish: { name: string; message: string }) {
  const { error } = await db.rpc('save_public_wish', { p_name: wish.name, p_message: wish.message });
  if (error) throw error;
}

// shortcut: newest 100 only, add paging if a wedding gets more.
export async function readGuestWishes(db: SupabaseClient): Promise<GuestWish[]> {
  const { data, error } = await db.from('guest_wishes').select('name,message,created_at').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return (data ?? []).map((row) => ({ name: row.name, message: row.message, createdAt: row.created_at }));
}
