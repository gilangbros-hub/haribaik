import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PATCH } from '../src/pages/api/admin/guests/[id].ts';

test('sent flag requires admin, same origin, valid input and an active guest', async () => {
  const id = '12345678-1234-1234-1234-123456789abc';
  const request = (origin, sent) => new Request(`https://site.test/api/admin/guests/${id}`, { method: 'PATCH', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ sent }) });
  const calls = [];
  const query = { update: (value) => { calls.push(['sent', value.sent]); return query; }, eq: (...args) => { calls.push(args); return query; }, select: () => query, maybeSingle: async () => ({ data: { id }, error: null }) };
  const locals = { adminUser: {}, supabase: { from: () => query } };
  assert.equal((await PATCH({ request: request('https://site.test', true), locals: {}, params: { id } })).status, 401);
  assert.equal((await PATCH({ request: request('https://other.test', true), locals, params: { id } })).status, 403);
  assert.equal((await PATCH({ request: request('https://site.test', 'yes'), locals, params: { id } })).status, 400);
  assert.equal((await PATCH({ request: request('https://site.test', true), locals, params: { id } })).status, 200);
  assert.deepEqual(calls, [['sent', true], ['id', id], ['active', true]]);
});
