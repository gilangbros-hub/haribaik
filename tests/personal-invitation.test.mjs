import test from 'node:test';
import assert from 'node:assert/strict';
import { readActiveGuest } from '../src/lib/guests/public.ts';

function guestDb(row) {
  const calls = [];
  const filters = {};
  const result = {
    from(table) { calls.push(['from', table]); return this; },
    select(columns) { calls.push(['select', columns]); return this; },
    eq(column, value) { calls.push(['eq', column, value]); filters[column] = value; return this; },
    maybeSingle() { return Promise.resolve({ data: row && Object.entries(filters).every(([key, value]) => row[key] === value) ? row : null, error: null }); },
  };
  return { client: result, calls };
}

test('personal invitation lookup returns only an active guest display name', async () => {
  const { client, calls } = guestDb({ id: 'private-id', name: 'Nadia', active: true, slug: 'nadia', guest_rsvps: { status: 'attending' } });
  assert.deepEqual(await readActiveGuest(client, 'nadia'), { name: 'Nadia', rsvpStatus: 'attending' });
  assert.deepEqual(calls, [
    ['from', 'guests'],
    ['select', 'name,guest_rsvps(status)'],
    ['eq', 'slug', 'nadia'],
    ['eq', 'active', true],
  ]);
});

test('invalid slugs do not query guest data', async () => {
  const { client, calls } = guestDb(null);
  assert.equal(await readActiveGuest(client, '../admin'), null);
  assert.deepEqual(calls, []);
});

test('missing and inactive guests have the same result', async () => {
  const missing = guestDb(null);
  const inactive = guestDb({ name: 'Nadia', slug: 'old-link', active: false });
  assert.equal(await readActiveGuest(missing.client, 'old-link'), null);
  assert.equal(await readActiveGuest(inactive.client, 'old-link'), null);
});
