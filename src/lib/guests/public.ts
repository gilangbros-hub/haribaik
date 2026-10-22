import type { SupabaseClient } from '@supabase/supabase-js';

const validSlug = (slug: string) => slug.length <= 64 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export async function readActiveGuest(client: SupabaseClient, slug: string): Promise<{ name: string; rsvpStatus: 'attending' | 'declined' | null } | null> {
  if (!validSlug(slug)) return null;
  const { data, error } = await client.from('guests').select('name,guest_rsvps(status)').eq('slug', slug).eq('active', true).maybeSingle();
  if (error) throw error;
  const rsvp = Array.isArray(data?.guest_rsvps) ? data.guest_rsvps[0] : data?.guest_rsvps;
  return data && typeof data.name === 'string' ? {
    name: data.name,
    rsvpStatus: rsvp?.status === 'attending' || rsvp?.status === 'declined' ? rsvp.status : null,
  } : null;
}
