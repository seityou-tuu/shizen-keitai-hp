require('./register-ts.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { splashBootstrap, splashInitialStyle } = require('../lib/splash-bootstrap.ts');
function boot({ seen = false, reduced = false, hash = '', pathname = '/', storageFails = false } = {}) {
  const attributes = new Map();
  let timeout;
  const root = { setAttribute: (key, value) => attributes.set(key, value), getAttribute: key => attributes.get(key), removeAttribute: key => attributes.delete(key) };
  vm.runInNewContext(splashBootstrap, { location: { pathname, hash }, matchMedia: () => ({ matches: reduced }), sessionStorage: { getItem: () => { if (storageFails) throw Error('disabled'); return seen; }, setItem: () => {} }, document: { documentElement: root }, setTimeout: callback => { timeout = callback; }, addEventListener: () => {} });
  return { attributes, timeout };
}
test('initial cover is enabled before hydration and releases if application scripts fail', () => {
  const result = boot();
  assert.equal(result.attributes.get('data-brand-intro'), 'pending');
  assert.match(splashInitialStyle, /background:#173f35/);
  result.timeout();
  assert.equal(result.attributes.size, 0);
});
test('repeat access, reduced motion, anchors and other routes bypass the initial cover', () => {
  for (const options of [{ seen: true }, { reduced: true }, { hash: '#training' }, { pathname: '/recruitment/first' }]) assert.equal(boot(options).attributes.size, 0);
  assert.equal(boot({ storageFails: true }).attributes.get('data-brand-intro'), 'pending');
});
