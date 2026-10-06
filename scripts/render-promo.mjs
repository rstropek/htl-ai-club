// Renders the promo canvas (src/pages/promo/[name].astro, dev-only) to a Full HD PNG.
// Usage: npm run promo            -> promo/ccc-1920x1080.png
// Needs a local Chrome or Chromium; set CHROME_PATH if it is not found automatically.
import { dev } from 'astro';
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const name = process.argv[2] ?? 'ccc';
const out = `promo/${name}-1920x1080.png`;
const port = 4399;

const server = await dev({ root: '.', server: { port }, logLevel: 'error', devToolbar: { enabled: false } });
try {
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' },
  );
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const response = await page.goto(`http://localhost:${port}/promo/${name}/`, { waitUntil: 'networkidle' });
  if (!response?.ok()) throw new Error(`Promo "${name}" did not render (${response?.status()}).`);
  await page.evaluate(() => document.fonts.ready);
  mkdirSync('promo', { recursive: true });
  await page.screenshot({ path: out });
  await browser.close();
  console.log(`Wrote ${out}`);
} finally {
  await server.stop();
}
