import assert from 'node:assert/strict';
import test from 'node:test';
import { GET } from '../src/pages/calendar.ics.ts';

test('calendar download exposes the sample event as an iCalendar attachment', async () => {
  const response = await GET({});
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /^text\/calendar; charset=utf-8$/);
  assert.match(response.headers.get('content-disposition') ?? '', /attachment; filename="undangan-nadia-arka\.ics"/);
  assert.match(body, /DTSTART:20261128T113000Z/);
  assert.match(body, /DTEND:20261128T140000Z/);
  assert.match(body, /SUMMARY:Resepsi Pernikahan — Nadia & Arka/);
});
