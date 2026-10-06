import { getCollection } from 'astro:content';
import { site } from '../data/site';

export type Status = 'done' | 'next' | 'upcoming';

export interface Session {
  id: string;
  number: string;
  title: string;
  startISO: string;
  endISO: string;
  weekday: string;
  shortDate: string;
  longDate: string;
  timeRange: string;
  room?: string;
  summary?: string;
  agenda?: string[];
  bring?: string;
  level?: string;
  prerequisites?: string;
  host?: string;
  links?: { label: string; url: string }[];
  hasDetails: boolean;
  status: Status;
}

export interface Semester {
  key: string;
  label: string;
  file: string;
  note?: string;
  sessions: Session[];
}

/** UTC offset of the club's time zone on a given calendar day, e.g. "+02:00". */
function offsetOn(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const noon = new Date(Date.UTC(y, m - 1, d, 12));
  const part = new Intl.DateTimeFormat('en-GB', { timeZone: site.timeZone, timeZoneName: 'longOffset' })
    .formatToParts(noon)
    .find((p) => p.type === 'timeZoneName')?.value;
  const match = part?.match(/GMT([+-]\d{2}:\d{2})/);
  return match ? match[1] : '+00:00';
}

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: site.timeZone, ...options });
const weekdayFmt = fmt({ weekday: 'short' });
const dayFmt = fmt({ day: 'numeric' });
const monthFmt = fmt({ month: 'numeric' });
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayMonth = (d: Date) => `${dayFmt.format(d)} ${MONTHS[Number(monthFmt.format(d)) - 1]}`;
const yearFmt = fmt({ year: 'numeric' });

export async function getSemesters(now = new Date()): Promise<Semester[]> {
  const entries = (await getCollection('semesters')).sort((a, b) => a.data.order - b.data.order);

  const semesters: Semester[] = entries.map(({ id, data }) => ({
    key: data.key,
    label: data.label,
    file: `semester/${id}.md`,
    note: data.note,
    sessions: data.sessions
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((s, i) => {
        const start = s.start ?? data.defaults.start;
        const end = s.end ?? data.defaults.end;
        const offset = offsetOn(s.date);
        const startISO = `${s.date}T${start}:00${offset}`;
        const endISO = `${s.date}T${end}:00${offset}`;
        const day = new Date(startISO);
        const weekday = weekdayFmt.format(day);
        const dm = dayMonth(day);
        return {
          id: `${data.key}-${String(i + 1).padStart(2, '0')}`,
          number: String(i + 1).padStart(2, '0'),
          title: s.title,
          startISO,
          endISO,
          weekday,
          shortDate: `${weekday} ${dm}`,
          longDate: `${weekday} ${dm} ${yearFmt.format(day)}`,
          timeRange: `${start}–${end}`,
          room: s.room ?? data.defaults.room,
          summary: s.summary,
          agenda: s.agenda,
          bring: s.bring,
          level: s.level,
          prerequisites: s.prerequisites,
          host: s.host,
          links: s.links,
          hasDetails: Boolean(s.summary || s.agenda || s.bring || s.level || s.prerequisites || s.host || s.links),
          status: 'upcoming' as Status,
        };
      }),
  }));

  // Build-time status; the page script recomputes it in the visitor's browser.
  let nextFound = false;
  for (const semester of semesters) {
    for (const session of semester.sessions) {
      if (new Date(session.endISO) < now) session.status = 'done';
      else if (!nextFound) {
        session.status = 'next';
        nextFound = true;
      }
    }
  }
  return semesters;
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
