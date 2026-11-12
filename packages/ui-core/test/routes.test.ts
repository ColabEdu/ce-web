import test from 'node:test';
import assert from 'node:assert/strict';
import { getAppBaseUrl, getAppEnvironment, getAppTenant, appLink } from '../src/navigation/routes.ts';

test('routes.ts - Environment Resolution', async (t) => {
  await t.test('resolves local environment URLs', () => {
    const appUrl = getAppBaseUrl('app', { env: 'local' });
    const apiUrl = getAppBaseUrl('api', { env: 'local' });
    assert.equal(appUrl, 'http://local.colabedu.org:8080');
    assert.equal(apiUrl, 'http://local.colabedu.org:8081');
  });

  await t.test('resolves prod environment URLs', () => {
    const appUrl = getAppBaseUrl('app', { env: 'prod' });
    const apiUrl = getAppBaseUrl('api', { env: 'prod' });
    assert.equal(appUrl, 'https://app.colabedu.org');
    assert.equal(apiUrl, 'https://api.colabedu.org');
  });

  await t.test('resolves demo environment URLs with default tenant (intef)', () => {
    const appUrl = getAppBaseUrl('app', { env: 'demo' });
    const apiUrl = getAppBaseUrl('api', { env: 'demo' });
    assert.equal(appUrl, 'https://app.intef.demo.colabedu.net');
    assert.equal(apiUrl, 'https://api.intef.demo.colabedu.net');
  });

  await t.test('resolves demo environment URLs with explicit tenant', () => {
    const appUrl = getAppBaseUrl('app', { env: 'demo', tenant: 'madrid' });
    const apiUrl = getAppBaseUrl('api', { env: 'demo', tenant: 'oxford' });
    assert.equal(appUrl, 'https://app.madrid.demo.colabedu.net');
    assert.equal(apiUrl, 'https://api.oxford.demo.colabedu.net');
  });

  await t.test('appLink builds clean paths with query params and environment options', () => {
    const localLink = appLink('app', '/lesson/123', { ref: 'catalog' }, { env: 'local' });
    assert.equal(localLink, 'http://local.colabedu.org:8080/lesson/123?ref=catalog');

    const demoLink = appLink('app', '/lesson/123', { ref: 'catalog' }, { env: 'demo', tenant: 'intef' });
    assert.equal(demoLink, 'https://app.intef.demo.colabedu.net/lesson/123?ref=catalog');

    const prodLink = appLink('app', '/lesson/123', { ref: 'catalog' }, { env: 'prod' });
    assert.equal(prodLink, 'https://app.colabedu.org/lesson/123?ref=catalog');
  });
});

test('routes.ts - Browser Hostname & Fallback Detection', async (t) => {
  await t.test('detects local environment from localhost hostname', () => {
    (globalThis as any).window = {
      location: { hostname: 'localhost' },
    };
    assert.equal(getAppEnvironment(), 'local');
    assert.equal(getAppBaseUrl('app'), 'http://local.colabedu.org:8080');
    delete (globalThis as any).window;
  });

  await t.test('detects demo environment and tenant from hostname', () => {
    (globalThis as any).window = {
      location: { hostname: 'colabedu-oxford-demo.web.app' },
    };
    assert.equal(getAppEnvironment(), 'demo');
    assert.equal(getAppTenant(), 'oxford');
    assert.equal(getAppBaseUrl('app'), 'https://app.oxford.demo.colabedu.net');
    delete (globalThis as any).window;
  });

  await t.test('detects prod environment from colabedu.org hostname', () => {
    (globalThis as any).window = {
      location: { hostname: 'colabedu.org' },
    };
    assert.equal(getAppEnvironment(), 'prod');
    assert.equal(getAppBaseUrl('app'), 'https://app.colabedu.org');
    delete (globalThis as any).window;
  });
});
