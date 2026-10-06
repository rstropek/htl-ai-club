import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { qrSvg } from '../lib/qr';

// Printable QR code for the sign-up form, served at /qr-signup.svg.
export const GET: APIRoute = () =>
  new Response(qrSvg(site.joinFormUrl), { headers: { 'Content-Type': 'image/svg+xml' } });
