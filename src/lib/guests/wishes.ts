import type { SupabaseClient } from '@supabase/supabase-js';

export type GuestWish = { name: string; message: string; createdAt: string };

export function parseWish(body: unknown): { name: string; message: string } | null {
  if (typeof body !== 'object' || body === null) return null;
  const { name, message } = body as Record<string, unknown>;
  if (typeof name !== 'string' || typeof message !== 'string') return null;
  const clean = { name: name.trim(), message: message.trim() };
  return clean.name.length >= 1 && clean.name.length <= 80 && clean.message.length >= 1 && clean.message.length <= 500 ? clean : null;
}

// Returns true when saved, false when the link is not an active guest, 'limit' when the guest hit the cap.
export async function saveGuestWish(db: SupabaseClient, slug: string, wish: { name: string; message: string }) {
  const { data, error } = await db.rpc('save_guest_wish', { p_slug: slug, p_name: wish.name, p_message: wish.message });
  if (error?.hint === 'wish_limit') return 'limit' as const;
  if (error) throw error;
  return data === true;
}

// shortcut: newest 100 only, add paging if a wedding gets more.
export async function readGuestWishes(db: SupabaseClient): Promise<GuestWish[]> {
  const { data, error } = await db.from('guest_wishes').select('name,message,created_at').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return (data ?? []).map((row) => ({ name: row.name, message: row.message, createdAt: row.created_at }));
}
