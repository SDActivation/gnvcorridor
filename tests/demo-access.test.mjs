import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { GET, HEAD } from '../api/demo.mjs';

// Credenziale fittizia, usata esclusivamente nei test locali.
const fixture = 'local-test-password-not-for-deployment';
const previous = process.env.DEMO_PASSWORD;
process.env.DEMO_PASSWORD = fixture;
const request = (asset = '', credentials, method = 'GET') => new Request(
  `https://example.test/api/demo?asset=${encodeURIComponent(asset)}`,
  { method, headers: credentials ? { Authorization: `Basic ${Buffer.from(credentials).toString('base64')}` } : {} },
);

test('nessun contenuto del sito è nella directory pubblica', async () => {
  assert.deepEqual((await readdir('public')).filter(name => name !== '.gitkeep'), []);
});

test('HTML e tutte le risorse richiedono credenziali', async () => {
  for (const asset of ['', 'index.html', 'simulation.js', 'scenarios.js', 'navigation.js', 'guide.js', 'friendly.css', 'gnv-ui.css']) {
    const result = await GET(request(asset));
    assert.equal(result.status, 401, asset);
    assert.match(result.headers.get('www-authenticate'), /^Basic /);
    assert.match(result.headers.get('cache-control'), /no-store/);
    assert(!((await result.text()).includes('const demandData')));
  }
});

test('credenziali errate e header malformati non autorizzano', async () => {
  for (const value of [`demo:wrong`, `other:${fixture}`, `demo:${fixture}x`]) {
    assert.equal((await GET(request('', value))).status, 401);
  }
  for (const header of ['Bearer token', 'Basic @@@@', 'Basic', '']) {
    assert.equal((await GET(new Request('https://example.test/', { headers: { Authorization: header } }))).status, 401);
  }
});

test('credenziali valide consentono HTML, dati e script senza cache pubblica', async () => {
  for (const asset of ['', 'index.html', 'simulation.js', 'scenarios.js', 'navigation.js', 'guide.js', 'friendly.css', 'gnv-ui.css']) {
    const result = await GET(request(asset, `demo:${fixture}`));
    assert.equal(result.status, 200, asset);
    assert.equal(result.headers.get('vary'), 'Authorization');
    assert.match(result.headers.get('cache-control'), /private, no-store/);
    assert.equal(result.headers.get('vercel-cdn-cache-control'), 'no-store');
    assert((await result.text()).length > 0);
  }
});

test('whitelist blocca percorso privato, traversal e metadati', async () => {
  for (const asset of ['../.env', '.env', 'README.md', 'demo-content/index.html', 'api/demo.mjs', 'index.html/../.env', 'constructor', 'toString']) {
    assert.equal((await GET(request(asset, `demo:${fixture}`))).status, 404, asset);
  }
});

test('HEAD richiede auth e non invia il file', async () => {
  assert.equal((await HEAD(request('', undefined, 'HEAD'))).status, 401);
  const result = await HEAD(request('', `demo:${fixture}`, 'HEAD'));
  assert.equal(result.status, 200);
  assert.equal(await result.text(), '');
});

test('configurazione assente o troppo breve chiude l’accesso', async () => {
  for (const value of ['', 'short']) {
    process.env.DEMO_PASSWORD = value;
    assert.equal((await GET(request('', `demo:${fixture}`))).status, 503);
  }
  process.env.DEMO_PASSWORD = fixture;
});

test.after(() => {
  if (previous === undefined) delete process.env.DEMO_PASSWORD;
  else process.env.DEMO_PASSWORD = previous;
});
