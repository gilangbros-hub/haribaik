export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const AUDIO_MAX_BYTES = 20 * 1024 * 1024;
const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
export const isMediaPath = (path: string) => new RegExp(`^${uuid}/${uuid}$`, 'i').test(path);
const ascii = (bytes: Uint8Array) => String.fromCharCode(...bytes);

export function validateUpload(kind: unknown, contentType: unknown, size: unknown, bytes?: Uint8Array) {
  const limit = kind === 'image' ? IMAGE_MAX_BYTES : kind === 'audio' ? AUDIO_MAX_BYTES : 0;
  const allowed = kind === 'image' ? ['image/jpeg', 'image/png', 'image/webp'] : kind === 'audio' ? ['audio/mpeg'] : [];
  if (!limit || typeof contentType !== 'string' || !allowed.includes(contentType) || typeof size !== 'number' || !Number.isSafeInteger(size) || size < 1 || size > limit) return false;
  if (!bytes) return true;
  if (bytes.byteLength !== size) return false;
  if (contentType === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === 'image/png') return ascii(bytes.subarray(0, 8)) === '\x89PNG\r\n\x1a\n';
  if (contentType === 'image/webp') return ascii(bytes.subarray(0, 4)) === 'RIFF' && ascii(bytes.subarray(8, 12)) === 'WEBP';
  return ascii(bytes.subarray(0, 3)) === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
}
