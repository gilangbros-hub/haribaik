import assert from 'node:assert/strict';
import test from 'node:test';
import { hashSessionToken, newAdminError, newSessionToken } from '../src/lib/admin-session.ts';
import { withPrivateNoStore } from '../src/lib/admin-response.ts';
import { isSameOriginRequest } from '../src/lib/request-origin.ts';
import { GET } from '../src/pages/api/admin/session.ts';

test('private response wrapping preserves immutable redirects and disables caching', () => {
  const location = 'https://invite.example.test/admin';
  const response = withPrivateNoStore(Response.redirect(location, 303));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), location);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
});

test('same-origin form requests allow fetch metadata when Origin is absent', () => {
  assert.equal(isSameOriginRequest(new Request('https://invite.example.test/login', { headers: { origin: 'https://invite.example.test' } })), true);
  assert.equal(isSameOriginRequest(new Request('https://invite.example.test/login', { headers: { origin: 'https://attacker.example.test' } })), false);
  assert.equal(isSameOriginRequest(new Request('https://invite.example.test/login', { headers: { 'sec-fetch-site': 'same-origin' } })), true);
  assert.equal(isSameOriginRequest(new Request('https://invite.example.test/login', { headers: { origin: 'null', 'sec-fetch-site': 'same-origin' } })), true);
  assert.equal(isSameOriginRequest(new Request('https://invite.example.test/login', { headers: { 'sec-fetch-site': 'cross-site' } })), false);
});

test('admin session endpoint rejects a missing session', async () => {
  const response = GET({ locals: { adminUser: null } });
  assert.equal(response.status, 401);
});

test('own admin login: random session tokens, hashed for storage, and new-account checks', () => {
  const token = newSessionToken();
  assert.notEqual(token, newSessionToken());
  assert.match(hashSessionToken(token), /^[0-9a-f]{64}$/);
  assert.notEqual(hashSessionToken(token), token);
  assert.equal(newAdminError('admin@example.com', 'panjang-sekali'), null);
  assert.equal(newAdminError('bukan-email', 'panjang-sekali'), 'Email tidak valid.');
  assert.equal(newAdminError('admin@example.com', 'pendek'), 'Kata sandi minimal 10 karakter.');
  assert.equal(newAdminError('admin@example.com', 'é'.repeat(37)), 'Kata sandi maksimal 72 karakter.');
});

test('admin session endpoint returns only the authorized admin identity', async () => {
  const response = GET({ locals: { adminUser: { id: 'admin-id', email: 'admin@example.com' } } });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { email: 'admin@example.com' });
});
