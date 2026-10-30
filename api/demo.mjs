import { createHash, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// I contenuti non sono asset pubblici: ogni risposta passa dalla verifica server.
const files = Object.freeze({
  'index.html': 'text/html; charset=utf-8',
  'friendly.css': 'text/css; charset=utf-8',
  'gnv-ui.css': 'text/css; charset=utf-8',
  'navigation.js': 'text/javascript; charset=utf-8',
  'scenarios.js': 'text/javascript; charset=utf-8',
  'simulation.js': 'text/javascript; charset=utf-8',
  'guide.js': 'text/javascript; charset=utf-8',
});

const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  Vary: 'Authorization',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

function authorized(header, secret) {
  const match = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(header || '');
  if (!match || match[1].length > 4096) return false;
  const supplied = Buffer.from(match[1], 'base64');
  const expected = Buffer.from(`demo:${secret}`, 'utf8');
  return timingSafeEqual(
    createHash('sha256').update(supplied).digest(),
    createHash('sha256').update(expected).digest(),
  );
}

export async function GET(request) {
  const headers = { ...privateHeaders };
  const secret = process.env.DEMO_PASSWORD;
  if (!secret || secret.length < 20) {
    return new Response('Accesso temporaneamente non disponibile.', { status: 503, headers });
  }

  if (!authorized(request.headers.get('authorization'), secret)) {
    headers['WWW-Authenticate'] = 'Basic realm="Demo riservata", charset="UTF-8"';
    headers['Content-Type'] = 'text/plain; charset=utf-8';
    return new Response('Demo riservata. Inserisci utente e password per accedere.', { status: 401, headers });
  }

  const url = new URL(request.url);
  const asset = (url.searchParams.get('asset') || '').replace(/^\/+/, '') || 'index.html';
  // Whitelist esatta: niente letture arbitrarie, directory traversal o file di progetto.
  if (!Object.hasOwn(files, asset)) {
    return new Response('Pagina non trovata.', { status: 404, headers });
  }

  try {
    const content = await readFile(join(process.cwd(), 'demo-content', asset));
    headers['Content-Type'] = files[asset];
    return new Response(request.method === 'HEAD' ? null : content, { status: 200, headers });
  } catch {
    console.error('Protected demo: bundled content unavailable.');
    return new Response('Contenuto temporaneamente non disponibile.', { status: 503, headers });
  }
}

export const HEAD = GET;
