import type { SupabaseClient } from '@supabase/supabase-js';

const validSlug = (slug: string) => slug.length <= 64 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export async function readActiveGuest(client: SupabaseClient, slug: string): Promise<{ name: string } | null> {
  if (!validSlug(slug)) return null;
  const { data, error } = await client.from('guests').select('name').eq('slug', slug).eq('active', true).maybeSingle();
  if (error) throw error;
  return data && typeof data.name === 'string' ? { name: data.name } : null;
}
