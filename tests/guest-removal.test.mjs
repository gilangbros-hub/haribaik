import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DELETE } from '../src/pages/api/admin/guests/[id].ts';

test('guest removal requires an admin and same-origin request, then deactivates only the selected active guest', async () => {
  const id = '12345678-1234-1234-1234-123456789abc';
  const request = (origin) => new Request('https://site.test/api/admin/guests/' + id, { method: 'DELETE', headers: { origin } });
  const calls = [];
  const query = { update: (value) => { calls.push(['update', value.active]); return query; }, eq: (...args) => { calls.push(args); return query; }, select: () => query, maybeSingle: async () => ({ data: { id }, error: null }) };
  const locals = { adminUser: {}, supabase: { from: (table) => { calls.push(['from', table]); return query; } } };
  assert.equal((await DELETE({ request: request('https://site.test'), locals: {}, params: { id } })).status, 401);
  assert.equal((await DELETE({ request: request('https://other.test'), locals, params: { id } })).status, 403);
  assert.equal((await DELETE({ request: request('https://site.test'), locals, params: { id: 'bad' } })).status, 404);
  assert.equal((await DELETE({ request: request('https://site.test'), locals, params: { id } })).status, 200);
  assert.deepEqual(calls, [['from', 'guests'], ['update', false], ['id', id], ['active', true]]);
});
