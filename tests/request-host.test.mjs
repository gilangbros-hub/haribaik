import assert from 'node:assert/strict';
import test from 'node:test';
import { NodeApp } from 'astro/app/node';
import config from '../astro.config.mjs';
import { isSameOriginRequest } from '../src/lib/request-origin.ts';

test('Vercel forwarded host preserves the production origin for form submissions', () => {
  const request = NodeApp.createRequest({
    method: 'POST',
    url: '/api/admin/login',
    socket: {},
    headers: {
      host: 'internal.vercel.invalid',
      'x-forwarded-host': 'bahagianyakita.ai.id',
      'x-forwarded-proto': 'https',
      origin: 'https://bahagianyakita.ai.id',
    },
  }, { skipBody: true, allowedDomains: config.security?.allowedDomains });

  assert.equal(new URL(request.url).origin, 'https://bahagianyakita.ai.id');
  assert.equal(isSameOriginRequest(request), true);
  request.headers.set('origin', 'https://attacker.example');
  assert.equal(isSameOriginRequest(request), false);
  assert.notEqual(config.security?.checkOrigin, false);
});

test('an untrusted forwarded host cannot replace the request origin', () => {
  const request = NodeApp.createRequest({
    method: 'GET',
    url: '/',
    socket: {},
    headers: {
      host: 'internal.vercel.invalid',
      'x-forwarded-host': 'attacker.example',
      'x-forwarded-proto': 'https',
    },
  }, { skipBody: true, allowedDomains: config.security?.allowedDomains });

  assert.equal(new URL(request.url).origin, 'https://localhost');
});
