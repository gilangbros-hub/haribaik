import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCalendar, lineage, validateWeddingContent } from '../src/lib/content/index.ts';

const content = {
  title: 'Undangan Pernikahan',
  greeting: 'Assalamu’alaikum',
  brideName: 'Nadia Putri',
  groomName: 'Arka Pratama',
  description: 'Dengan penuh rasa syukur.',
  timeZone: 'America/Los_Angeles',
  events: [{
    name: 'Akad, resepsi',
    startsAt: '2026-11-28T18:30',
    endsAt: '2026-11-28T21:00',
    venue: 'Taman Senja',
    address: 'Jalan Contoh, Jakarta',
    mapUrl: 'https://maps.google.com/?q=Taman+Senja',
  }],
  closing: 'Doa restu Anda berarti bagi kami.',
};

test('validates structured content and strips unrecognized fields', () => {
  const result = validateWeddingContent({ ...content, extra: 'ignored' });
  assert.equal(result.ok, true);
  assert.equal('extra' in result.content, false);
});

test('cover names are optional and kept separate from the profile names', () => {
  assert.equal(validateWeddingContent(content).content.coverBrideName, '');
  const result = validateWeddingContent({ ...content, coverBrideName: ' Nadia ', coverGroomName: 'Arka' });
  assert.equal(result.content.coverBrideName, 'Nadia');
  assert.equal(result.content.brideName, 'Nadia Putri');
  assert.equal(validateWeddingContent({ ...content, coverGroomName: 5 }).ok, false);
});

test('lineage fields default for old content, reject unknown options, and compose the phrase', () => {
  const old = validateWeddingContent(content).content;
  assert.equal(old.brideChild, 'Putri');
  assert.equal(old.groomChild, 'Putra');
  assert.equal(lineage(old.brideChild, old.brideOrder, old.brideParents), '');
  const result = validateWeddingContent({ ...content, groomOrder: 'Kedua', groomParents: ' Bapak A & Ibu B ' });
  assert.equal(lineage(result.content.groomChild, result.content.groomOrder, result.content.groomParents), 'Putra Kedua dari Bapak A & Ibu B');
  assert.equal(validateWeddingContent({ ...content, brideOrder: 'Kelima' }).ok, false);
});

test('story text and photo are optional and the photo joins the duplicate-media check', () => {
  const old = validateWeddingContent(content).content;
  assert.equal(old.storyText, '');
  assert.equal(old.storyImage, null);
  const photo = { path: '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222', alt: 'Kami' };
  assert.equal(validateWeddingContent({ ...content, storyImage: photo, storyText: '# Awal\n\nCerita' }).ok, true);
  const dup = validateWeddingContent({ ...content, storyImage: photo, coverImage: photo });
  assert.equal(dup.ok, false);
});

test('bank fields are optional and length-checked', () => {
  assert.equal(validateWeddingContent(content).content.groomAccount, '');
  const result = validateWeddingContent({ ...content, groomBank: 'BCA', groomAccount: ' 0660580697 ' });
  assert.equal(result.content.groomAccount, '0660580697');
  assert.equal(validateWeddingContent({ ...content, brideAccount: '1'.repeat(41) }).ok, false);
});

test('rejects a map URL outside HTTPS and an event that ends before it starts', () => {
  const result = validateWeddingContent({
    ...content,
    events: [{ ...content.events[0], mapUrl: 'javascript:alert(1)', endsAt: '2026-11-28T18:00' }],
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /peta/i);
  assert.match(result.errors.join(' '), /waktu acara/i);
});

test('calendar uses the configured timezone and escapes/folds ICS text', () => {
  const result = validateWeddingContent(content);
  assert.equal(result.ok, true);
  const calendar = buildCalendar({ ...result.content, description: `${result.content.description} ${'é'.repeat(80)}` }, new Date('2026-01-01T00:00:00Z'));
  assert.match(calendar, /DTSTART:20261129T023000Z/);
  assert.match(calendar, /DTEND:20261129T050000Z/);
  assert.match(calendar, /SUMMARY:Akad\\, resepsi — Nadia Putri & Arka Pratama/);
  assert.match(calendar, /DESCRIPTION:Assalamu’alaikum\\nDengan penuh rasa syukur\./);
  assert.match(calendar, /\r\n /);
});

test('rejects nonexistent local times at daylight-saving transitions', () => {
  const result = validateWeddingContent({
    ...content,
    timeZone: 'America/Los_Angeles',
    events: [{ ...content.events[0], startsAt: '2026-03-08T02:30' }],
  });
  assert.equal(result.ok, false);
});
