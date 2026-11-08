import { test } from 'node:test';
import { deepStrictEqual } from 'node:assert';
import { sectionNumbers } from '../src/lib/section-numbers.ts';

test('numbers only visible sections in their display order', () => {
  deepStrictEqual(sectionNumbers(['welcome', false, 'event-0', 'event-1', undefined, 'gallery']), {
    welcome: '01', 'event-0': '02', 'event-1': '03', gallery: '04',
  });
});
