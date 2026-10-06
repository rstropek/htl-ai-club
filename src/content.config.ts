import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const time = z.string().regex(/^\d{2}:\d{2}$/, 'use HH:MM');

const session = z.object({
  // YAML turns a bare 2026-10-21 into a Date; normalise both forms to "YYYY-MM-DD".
  date: z
    .union([z.date(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD')])
    .transform((d) => (typeof d === 'string' ? d : d.toISOString().slice(0, 10))),
  title: z.string(),
  // Optional overrides of the semester defaults.
  start: time.optional(),
  end: time.optional(),
  room: z.string().optional(),
  // Optional details. A session without any of these shows "Topic details follow".
  summary: z.string().optional(),
  agenda: z.array(z.string()).optional(),
  bring: z.string().optional(),
  level: z.string().optional(),
  prerequisites: z.string().optional(),
  host: z.string().optional(),
  links: z.array(z.object({ label: z.string(), url: z.url() })).optional(),
});

const semesters = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/semesters' }),
  schema: z.object({
    key: z.string().regex(/^[a-z]\d{2}$/, 'short key such as w26 or s27'),
    label: z.string(),
    order: z.number(),
    // Short notice under the semester's list, e.g. "Topics may still change."
    note: z.string().optional(),
    defaults: z.object({ start: time, end: time, room: z.string().optional() }),
    sessions: z.array(session),
  }),
});

export const collections = { semesters };
