import assert from 'node:assert/strict';
import test from 'node:test';
import { parseWish } from '../src/lib/guests/wishes.ts';

test('parseWish accepts any content, defaults the name, and cuts long text', () => {
  assert.deepEqual(parseWish({ name: ' Rina ', message: ' Selamat! ' }), { name: 'Rina', message: 'Selamat!' });
  assert.deepEqual(parseWish({ name: '', message: '<b>hai</b>' }), { name: 'Tamu', message: '<b>hai</b>' });
  assert.deepEqual(parseWish({ name: 5, message: 7 }), { name: '5', message: '7' });
  assert.equal(parseWish({ name: 'Rina', message: 'x'.repeat(2500) }).message.length, 2000);
  assert.equal(parseWish({ name: 'R'.repeat(90), message: 'Halo' }).name.length, 80);
  assert.equal(parseWish({ name: 'Rina', message: '   ' }), null);
  assert.equal(parseWish(null), null);
});
