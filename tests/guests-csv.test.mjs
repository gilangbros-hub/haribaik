import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeGuestImport, exportGuestsCsv, parseGuestsCsv } from '../src/lib/guests/csv.ts';

test('validates imports, generates unique slugs, and reports replacement impact', () => {
  const current = [
    { id: '1', name: 'Ayu', slug: 'ayu', active: true },
    { id: '2', name: 'Budi', slug: 'budi', active: true },
    { id: '3', name: 'Cici', slug: 'cici', active: false },
  ];
  const preview = analyzeGuestImport(parseGuestsCsv('nama,slug\nAyu,ayu\nCici,cici\nDewi,\nDewi,'), current);
  assert.deepEqual(preview.counts, { new: 2, retained: 1, deactivated: 1, reactivated: 1 });
  assert.deepEqual(preview.rows.map(({ slug }) => slug), ['ayu', 'cici', 'dewi', 'dewi-2']);
});

test('rejects malformed CSV, bad headers, blank identities, and duplicate slugs', () => {
  assert.throws(() => parseGuestsCsv('name,slug\nAyu,ayu'), /header/i);
  assert.throws(() => parseGuestsCsv('nama,slug\n"Ayu,ayu'), /CSV/);
  assert.throws(() => parseGuestsCsv('nama,slug\n ,ayu'), /nama/);
  assert.throws(() => parseGuestsCsv('nama,slug\nAyu,ayu\nBudi,ayu'), /duplikat/);
});

test('requires a stable slug when a blank slug name matches a saved guest', () => {
  assert.throws(
    () => analyzeGuestImport(parseGuestsCsv('nama,slug\nAyu,'), [{ id: '1', name: 'Ayu', slug: 'ayu', active: true }]),
    /slug tetap/,
  );
});

test('exports spreadsheet-safe CSV and imports exported names unchanged without applying RSVP columns', () => {
  const source = [
    { name: '=1+1', slug: 'formula', rsvp: 'attending', answeredAt: '2026-10-22T00:00:00Z' },
    { name: '+1+2', slug: 'plus', rsvp: '', answeredAt: null },
    { name: '@SUM(1)', slug: 'at', rsvp: '', answeredAt: null },
    { name: '-1+1', slug: 'minus', rsvp: '', answeredAt: null },
    { name: '\t=1+1', slug: 'tab-formula', rsvp: '', answeredAt: null },
    { name: '\tNama', slug: 'tab-name', rsvp: '', answeredAt: null },
    { name: "'=literal", slug: 'apostrophe-formula', rsvp: '', answeredAt: null },
    { name: "'Nama", slug: 'apostrophe-name', rsvp: '', answeredAt: null },
    { name: '  +2+2', slug: 'whitespace', rsvp: '', answeredAt: null },
    { name: 'Dewi, "Dewi"\nKedua', slug: 'quoted-name', rsvp: 'declined', answeredAt: null },
  ];
  const csv = exportGuestsCsv(source);
  assert.match(csv, /'=1\+1/);
  assert.match(csv, /waktu_jawaban_terakhir/);
  const roundTrip = parseGuestsCsv(csv);
  assert.deepEqual(roundTrip.map(({ name }) => name), source.map(({ name }) => name));
  assert.equal('rsvp' in roundTrip[0], false);
});
