import assert from 'node:assert/strict';
import test from 'node:test';
import sharp from 'sharp';
import { optimizeWeddingImage, stripMp3Tags } from '../src/lib/content/media.ts';
import { isMediaPath, validateUpload } from '../src/lib/content/media-validation.ts';
import { validateWeddingContent } from '../src/lib/content/index.ts';

const wedding = {
  title: 'Hari Bahagia', greeting: 'Halo', brideName: 'Nadia', groomName: 'Arka', description: '', timeZone: 'Asia/Jakarta', closing: 'Terima kasih',
  events: [{ name: 'Akad', startsAt: '2026-11-28T10:00', endsAt: '2026-11-28T11:00', venue: 'Gedung', address: 'Jakarta', mapUrl: 'https://maps.google.com' }],
};
const path = '22222222-2222-4222-8222-222222222222/11111111-1111-4111-8111-111111111111';

test('media references require generated UUID paths and alt text', () => {
  assert.equal(isMediaPath(path), true);
  assert.equal(isMediaPath('22222222-2222-4222-8222-222222222222/incoming/11111111-1111-4111-8111-111111111111'), false);
  assert.equal(isMediaPath('../private'), false);
  assert.equal(validateWeddingContent({ ...wedding, coverImage: { path, alt: 'Pasangan' } }).ok, true);
  assert.equal(validateWeddingContent({ ...wedding, coverImage: { path, alt: '' } }).ok, false);
  assert.equal(validateWeddingContent({ ...wedding, gallery: Array.from({ length: 13 }, () => ({ path, alt: 'Foto' })) }).ok, false);
});

test('uploads accept only bounded supported content with a matching signature', () => {
  assert.equal(validateUpload('image', 'image/jpeg', 3, Buffer.from([0xff, 0xd8, 0xff])), true);
  assert.equal(validateUpload('image', 'image/jpeg', 3, Buffer.from('<svg')), false);
  assert.equal(validateUpload('image', 'image/svg+xml', 3, Buffer.from('<svg')), false);
  assert.equal(validateUpload('audio', 'audio/mpeg', 3, Buffer.from('ID3')), true);
  assert.equal(validateUpload('audio', 'audio/mpeg', 3, Buffer.from('bad')), false);
  assert.equal(validateUpload('image', 'image/png', 10 * 1024 * 1024 + 1), false);
});

test('image optimization writes a resized WebP without retained EXIF', async () => {
  const source = await sharp({ create: { width: 2000, height: 1000, channels: 3, background: '#123456' } }).jpeg().withMetadata({ exif: { IFD0: { Artist: 'test' } } }).toBuffer();
  const output = await optimizeWeddingImage(source);
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, 1800);
  assert.equal(metadata.exif, undefined);
});

test('MP3 finalization removes ID3v2 and ID3v1 tags', () => {
  const audio = Buffer.from([0xff, 0xfb, 0x90, 0x64]);
  const tagged = Buffer.concat([Buffer.from('ID3'), Buffer.from([4, 0, 0, 0, 0, 0, 3]), Buffer.from('tag'), audio, Buffer.concat([Buffer.from('TAG'), Buffer.alloc(125)])]);
  assert.deepEqual(stripMp3Tags(tagged), audio);
});
