import assert from 'node:assert/strict';
import test from 'node:test';
import { parseWish } from '../src/lib/guests/wishes.ts';

test('parseWish trims and enforces name and message limits', () => {
  assert.deepEqual(parseWish({ name: ' Rina ', message: ' Selamat! ' }), { name: 'Rina', message: 'Selamat!' });
  assert.equal(parseWish({ name: ' ', message: 'Halo' }), null);
  assert.equal(parseWish({ name: 'Rina', message: 'x'.repeat(501) }), null);
  assert.equal(parseWish({ name: 'R'.repeat(81), message: 'Halo' }), null);
  assert.equal(parseWish({ name: 5, message: 'Halo' }), null);
  assert.equal(parseWish(null), null);
});
