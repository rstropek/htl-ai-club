// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages: the deploy workflow passes the Pages origin and base path.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
});
