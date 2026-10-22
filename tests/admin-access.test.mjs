import assert from 'node:assert/strict';
import test from 'node:test';
import { adminAccess } from '../src/lib/admin-access.ts';
import { GET } from '../src/pages/api/admin/session.ts';

test('admin session endpoint rejects a missing session', async () => {
  const response = GET({ locals: { adminUser: null } });
  assert.equal(response.status, 401);
});

test('an authenticated account outside the configured admin is denied', () => {
  assert.equal(adminAccess('other-user-id', 'admin-id'), 'forbidden');
  const response = GET({ locals: { adminUser: null } });
  assert.equal(response.status, 401);
});

test('admin session endpoint returns only the authorized admin identity', async () => {
  const response = GET({ locals: { adminUser: { id: 'admin-id', email: 'admin@example.com' } } });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { email: 'admin@example.com' });
});
