import assert from 'node:assert/strict';
import test from 'node:test';
import { saveGuestRsvp } from '../src/lib/guests/rsvp.ts';
import { POST } from '../src/pages/api/guests/[slug]/rsvp.ts';

test('saving an RSVP resolves the guest by slug through the atomic database operation', async () => {
  const calls = [];
  const db = { rpc: async (...args) => { calls.push(args); return { data: true, error: null }; } };
  assert.equal(await saveGuestRsvp(db, 'nadia', 'attending'), true);
  assert.deepEqual(calls, [['save_guest_rsvp', { p_slug: 'nadia', p_status: 'attending' }]]);
});

test('database operation reports an inactive or unknown slug without saving', async () => {
  const db = { rpc: async () => ({ data: false, error: null }) };
  assert.equal(await saveGuestRsvp(db, 'inactive-person', 'declined'), false);
});

test('RSVP helper rejects values outside the allowed responses before querying', async () => {
  let called = false;
  const db = { rpc: async () => { called = true; return { data: true, error: null }; } };
  await assert.rejects(saveGuestRsvp(db, 'nadia', 'maybe'), /invalid/i);
  assert.equal(called, false);
});

test('RSVP endpoint rejects cross-origin, invalid-slug, and invalid-answer requests without caching', async () => {
  const request = (origin, body) => new Request('https://site.test/api/guests/nadia/rsvp', {
    method: 'POST', headers: { origin, 'content-type': 'application/json' }, body,
  });
  const crossOrigin = await POST({ request: request('https://other.test', '{"status":"attending"}'), params: { slug: 'nadia' } });
  assert.equal(crossOrigin.status, 403);
  assert.equal(crossOrigin.headers.get('cache-control'), 'private, no-store, max-age=0');

  const invalidSlug = await POST({ request: request('https://site.test', '{"status":"attending"}'), params: { slug: '../admin' } });
  assert.equal(invalidSlug.status, 404);

  const invalidAnswer = await POST({ request: request('https://site.test', '{"status":"maybe"}'), params: { slug: 'nadia' } });
  assert.equal(invalidAnswer.status, 400);
});

