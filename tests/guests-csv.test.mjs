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
  assert.throws(() => parseGuestsCsv('nama,status\nAyu,x'), /header/i);
  assert.deepEqual(parseGuestsCsv('nama\nAyu\n"Rina, Dodi"'), [{ name: 'Ayu', slug: '' }, { name: 'Rina, Dodi', slug: '' }]);
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

test('exports spreadsheet-safe CSV and imports exported names unchanged without applying delivery status', () => {
  const source = [
    { name: '=1+1', slug: 'formula', sent: false, category: null },
    { name: '+1+2', slug: 'plus', sent: false, category: null },
    { name: '@SUM(1)', slug: 'at', sent: false, category: null },
    { name: '-1+1', slug: 'minus', sent: false, category: null },
    { name: '\t=1+1', slug: 'tab-formula', sent: false, category: null },
    { name: '\tNama', slug: 'tab-name', sent: false, category: null },
    { name: "'=literal", slug: 'apostrophe-formula', sent: false, category: null },
    { name: "'Nama", slug: 'apostrophe-name', sent: false, category: null },
    { name: '  +2+2', slug: 'whitespace', sent: false, category: null },
    { name: 'Dewi, "Dewi"\nKedua', slug: 'quoted-name', sent: false, category: null },
  ];
  const csv = exportGuestsCsv(source);
  assert.match(csv, /'=1\+1/);
  assert.match(csv, /status_pengiriman/);
  const roundTrip = parseGuestsCsv(csv);
  assert.deepEqual(roundTrip.map(({ name }) => name), source.map(({ name }) => name));
  assert.equal('sent' in roundTrip[0], false);
});


test('optional categories round-trip and validate without changing older CSVs', () => {
  const rows = parseGuestsCsv('nama,slug,kategori\nAyu,ayu,Dhanar\nBudi,budi,');
  assert.deepEqual(rows, [{ name: 'Ayu', slug: 'ayu', category: 'Dhanar' }, { name: 'Budi', slug: 'budi', category: '' }]);
  assert.deepEqual(analyzeGuestImport(rows, []).rows, rows);
  assert.deepEqual(parseGuestsCsv('nama,kategori\nAyu,Ortu'), [{ name: 'Ayu', slug: '', category: 'Ortu' }]);
  assert.equal(parseGuestsCsv('nama,slug,kategori\nAyu,ayu,Teman Kantor')[0].category, 'Teman Kantor');
  const csv = exportGuestsCsv([{ name: 'Ayu', slug: 'ayu', category: 'sheilly', sent: true }]);
  assert.deepEqual(parseGuestsCsv(csv), [{ name: 'Ayu', slug: 'ayu', category: 'sheilly' }]);
});


test('arbitrary categories survive spreadsheet-safe export and import', () => {
  for (const category of ['Teman Kantor', '=1+1', "'Keluarga"]) {
    const csv = exportGuestsCsv([{ name: 'Ayu', slug: 'ayu', category, sent: false }]);
    assert.equal(parseGuestsCsv(csv)[0].category, category);
  }
});
