import type { SupabaseClient } from '@supabase/supabase-js';
import type { WeddingContent } from './index.ts';
import { AUDIO_MAX_BYTES, IMAGE_MAX_BYTES, validateUpload } from './media-validation.ts';
const ascii = (bytes: Uint8Array) => String.fromCharCode(...bytes);

export const MEDIA_BUCKET = 'wedding-media';

export async function optimizeWeddingImage(bytes: Uint8Array): Promise<Uint8Array> {
  const { default: sharp } = await import('sharp');
  return sharp(bytes, { failOn: 'error', limitInputPixels: 40_000_000 })
    .rotate()
    .resize(1800, 1800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

export function stripMp3Tags(bytes: Uint8Array): Uint8Array {
  let start = 0;
  let end = bytes.length;
  if (ascii(bytes.subarray(0, 3)) === 'ID3') {
    if (bytes.length < 10 || bytes[6] > 127 || bytes[7] > 127 || bytes[8] > 127 || bytes[9] > 127) throw new Error('Invalid ID3 tag.');
    const size = (bytes[6] << 21) | (bytes[7] << 14) | (bytes[8] << 7) | bytes[9];
    start = 10 + size + ((bytes[5] & 0x10) ? 10 : 0);
    if (start > end) throw new Error('Invalid ID3 tag.');
  }
  if (end - start >= 128 && ascii(bytes.subarray(end - 128, end - 125)) === 'TAG') end -= 128;
  const result = bytes.slice(start, end);
  if (!validateUpload('audio', 'audio/mpeg', result.length, result)) throw new Error('Invalid MP3 file.');
  return result;
}

export type WeddingMediaUrls = { coverImage: string | null; brideImage: string | null; groomImage: string | null; storyImage: string | null; gallery: (string | null)[]; music: string | null };

export async function authorizeWeddingUpload(client: SupabaseClient, userId: string, kind: unknown, contentType: unknown, size: unknown) {
  if (!validateUpload(kind, contentType, size)) throw new Error(`Jenis file atau ukuran tidak didukung. Foto maksimal ${IMAGE_MAX_BYTES / 1024 / 1024} MB; MP3 maksimal ${AUDIO_MAX_BYTES / 1024 / 1024} MB.`);
  const path = `${userId}/incoming/${crypto.randomUUID()}`;
  const { data, error } = await client.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw error ?? new Error('Upload tidak dapat disiapkan.');
  return { path, signedUrl: data.signedUrl };
}

export async function finalizeWeddingUpload(client: SupabaseClient, privilegedClient: SupabaseClient, userId: string, path: string, kind: unknown) {
  if (!new RegExp(`^${userId}/incoming/[0-9a-f-]{36}$`, 'i').test(path) || !['image', 'audio'].includes(String(kind))) throw new Error('Upload tidak valid.');
  const { data: blob, error } = await client.storage.from(MEDIA_BUCKET).download(path);
  if (error || !blob) throw error ?? new Error('File upload tidak ditemukan.');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  try {
    if (kind === 'image') {
      const type = ['image/jpeg', 'image/png', 'image/webp'].find((candidate) => validateUpload(kind, candidate, bytes.length, bytes));
      if (!type) throw new Error('Isi file bukan foto JPEG, PNG, atau WebP yang valid.');
      const optimized = await optimizeWeddingImage(bytes);
      const outputPath = `${userId}/${crypto.randomUUID()}`;
      const { error: storeError } = await privilegedClient.storage.from(MEDIA_BUCKET).upload(outputPath, optimized, { contentType: 'image/webp', upsert: false, cacheControl: '31536000' });
      if (storeError) throw storeError;
      return outputPath;
    }
    if (!validateUpload('audio', blob.type || 'audio/mpeg', bytes.length, bytes)) throw new Error('Isi file bukan MP3 yang valid.');
    const cleaned = stripMp3Tags(bytes);
    const outputPath = `${userId}/${crypto.randomUUID()}`;
    const { error: storeError } = await privilegedClient.storage.from(MEDIA_BUCKET).upload(outputPath, cleaned, { contentType: 'audio/mpeg', upsert: false, cacheControl: '31536000' });
    if (storeError) throw storeError;
    return outputPath;
  } finally {
    await privilegedClient.storage.from(MEDIA_BUCKET).remove([path]).catch(() => {});
  }
}

export async function resolveWeddingMedia(client: SupabaseClient, content: WeddingContent, requireAll = false): Promise<WeddingMediaUrls> {
  const sign = async (path: string | null) => {
    if (!path) return null;
    const { data, error } = await client.storage.from(MEDIA_BUCKET).createSignedUrl(path, 3600);
    if (error || !data?.signedUrl) {
      if (requireAll) throw error ?? new Error('Media tidak tersedia.');
      return null;
    }
    return data.signedUrl;
  };
  return {
    coverImage: await sign(content.coverImage?.path ?? null),
    brideImage: await sign(content.brideImage?.path ?? null),
    groomImage: await sign(content.groomImage?.path ?? null),
    storyImage: await sign(content.storyImage?.path ?? null),
    gallery: await Promise.all(content.gallery.map((image) => sign(image.path))),
    music: await sign(content.musicPath),
  };
}
