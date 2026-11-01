import assert from 'node:assert/strict';
import test from 'node:test';
import { createSessionToken, credentialsMatch, sessionConfigured, sessionValid } from '../src/lib/admin-session.ts';
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

test('own admin login: credentials and signed session cookie', () => {
  assert.equal(credentialsMatch(' Admin@Example.com ', 'pw', 'admin@example.com', 'pw'), true);
  assert.equal(credentialsMatch('admin@example.com', 'wrong', 'admin@example.com', 'pw'), false);
  assert.equal(credentialsMatch('other@example.com', 'pw', 'admin@example.com', 'pw'), false);
  const secret = 's'.repeat(32) + 'pw';
  const now = Date.UTC(2026, 10, 1);
  const token = createSessionToken(secret, now);
  assert.equal(sessionValid(token, secret, now + 1000), true);
  assert.equal(sessionValid(token, 's'.repeat(32) + 'new-password', now + 1000), false);
  assert.equal(sessionValid(token, secret, now + 8 * 24 * 3600 * 1000), false);
  assert.equal(sessionValid(`9999999999.${token.split('.')[1]}`, secret, now), false);
  assert.equal(sessionValid(undefined, secret, now), false);
  assert.equal(sessionConfigured({ ADMIN_EMAIL: 'a', ADMIN_PASSWORD: 'b', ADMIN_USER_ID: 'c', ADMIN_SESSION_SECRET: 'short' }), false);
});

test('admin session endpoint returns only the authorized admin identity', async () => {
  const response = GET({ locals: { adminUser: { id: 'admin-id', email: 'admin@example.com' } } });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { email: 'admin@example.com' });
});
