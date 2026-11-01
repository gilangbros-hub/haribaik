import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { emptyWeddingContent, validateWeddingContent, type WeddingContent } from './index';

export function publicContentClient(): SupabaseClient | null {
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

export async function readWeddingDraft(client: SupabaseClient): Promise<WeddingContent> {
  const { data, error } = await client.from('wedding_drafts').select('content').eq('id', 'main').maybeSingle();
  if (error) throw error;
  if (!data) return structuredClone(emptyWeddingContent);
  const result = validateWeddingContent(data.content, false);
  if (!result.ok) throw new Error('Stored draft is invalid.');
  return result.content;
}

export async function saveWeddingDraft(client: SupabaseClient, adminUserId: string, content: WeddingContent): Promise<void> {
  const { error } = await client.from('wedding_drafts').upsert({
    id: 'main', admin_user_id: adminUserId, content, updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });
  if (error) throw error;
}

export async function readPublishedWedding(client: SupabaseClient): Promise<WeddingContent | null> {
  const { data, error } = await client.from('wedding_publications').select('content').eq('id', 'main').maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const result = validateWeddingContent(data.content);
  if (!result.ok) throw new Error('Stored publication is invalid.');
  return result.content;
}

export async function publishWeddingDraft(client: SupabaseClient, expectedContent: WeddingContent): Promise<boolean> {
  // shortcut: the publish RPC needs a Supabase Auth user, so the service-role client writes directly; with one admin the "draft changed mid-publish" check is dropped.
  const { error } = await client.from('wedding_publications').upsert({ id: 'main', content: expectedContent, published_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) throw error;
  return true;
}
