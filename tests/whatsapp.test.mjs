import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyWeddingContent } from '../src/lib/content/index.ts';
import { whatsappMessage } from '../src/lib/guests/whatsapp.ts';

test('WhatsApp message follows the invitation format and preserves event details', () => {
  const content = { ...emptyWeddingContent, groomName: 'Andi', brideName: 'Bunga', coverGroomName: 'Di', coverBrideName: 'Bunga', events: [
    { name: 'Akad', startsAt: '2026-12-01T09:00', endsAt: '2026-12-01T10:00', venue: 'Gedung A', address: 'Jakarta', mapUrl: '' },
    { name: 'Resepsi', startsAt: '2026-12-01T11:00', endsAt: '', venue: 'Gedung A', address: 'Jakarta', mapUrl: '' },
    { name: 'Syukuran', startsAt: '2026-12-02T11:00', endsAt: '', venue: 'Gedung B', address: 'Bandung', mapUrl: '' },
  ] };
  const message = whatsappMessage(content, 'Ibu Sari', 'https://example.test/sari');
  assert.ok(message.includes('Kepada Yth.\n*Ibu Sari*'));
  assert.ok(message.includes('*Andi*\n*&*\n*Bunga*'));
  assert.match(message, /1 Desember 2026[\s\S]*Akad: 09\.00–10\.00 WIB[\s\S]*Resepsi: 11\.00 WIB[\s\S]*📍 Gedung A\nJakarta/);
  assert.match(message, /2 Desember 2026[\s\S]*Syukuran: 11\.00 WIB[\s\S]*📍 Gedung B\nBandung/);
  assert.equal((message.match(/1 Desember 2026/g) || []).length, 1);
  assert.ok(message.includes('Klik link pada undangan berikut:\nhttps://example.test/sari'));
  assert.ok(message.includes('Hormat kami yang berbahagia,\n\nBunga & Di'));
});
