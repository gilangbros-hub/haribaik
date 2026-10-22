import type { SupabaseClient } from '@supabase/supabase-js';

export type RsvpStatus = 'attending' | 'declined';

export async function saveGuestRsvp(db: SupabaseClient, slug: string, status: RsvpStatus) {
  if (status !== 'attending' && status !== 'declined') throw new Error('Invalid RSVP status.');
  const { data, error } = await db.rpc('save_guest_rsvp', { p_slug: slug, p_status: status });
  if (error) throw error;
  return data === true;
}
