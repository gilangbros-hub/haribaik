import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyWeddingContent } from '../src/lib/content/index.ts';
import { whatsappMessage } from '../src/lib/guests/whatsapp.ts';

test('WhatsApp message uses the guest and published couple and event details', () => {
  const content = { ...emptyWeddingContent, groomName: 'Andi', brideName: 'Bunga', groomParents: 'Bapak A dan Ibu B', events: [{ name: 'Akad', startsAt: '2026-12-01T09:00', endsAt: '', venue: 'Gedung A', address: 'Jakarta', mapUrl: '' }] };
  const message = whatsappMessage(content, 'Ibu Sari', 'https://example.test/sari');
  for (const value of ['Ibu Sari', 'Andi Putra Pertama dari Bapak A dan Ibu B', 'Bunga', 'Akad', '1 Desember 2026', '09.00 WIB', 'Gedung A, Jakarta', 'https://example.test/sari']) assert.ok(message.includes(value), value);
});
