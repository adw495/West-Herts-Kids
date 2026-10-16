// Subscribable calendar of Hertfordshire school holidays (all-day events).
// Parents add it once (webcal:// link on the term dates guide) and their phone keeps it up to date.
import type { APIRoute } from 'astro';
import { HOLIDAYS, TERM_DATES_SOURCE } from '../../data/term-dates';
import { SITE } from '../../site.config';

const ymd = (iso: string) => iso.replace(/-/g, '');
const nextDay = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
// RFC 5545: escape text and fold lines at 75 octets.
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (line: string) => {
  const out: string[] = [];
  let rest = line;
  while (Buffer.byteLength(rest, 'utf8') > 75) {
    let n = 75;
    while (Buffer.byteLength(rest.slice(0, n), 'utf8') > 75) n--;
    out.push(rest.slice(0, n));
    rest = ' ' + rest.slice(n);
  }
  out.push(rest);
  return out.join('\r\n');
};

export const GET: APIRoute = () => {
  const stamp = '20261015T000000Z'; // bump when the dates change
  const guide = `${SITE.url}/whats-on/herts-school-term-dates-2026-27/`;
  const events = HOLIDAYS.flatMap((h) => [
    'BEGIN:VEVENT',
    `UID:${h.id}@westhertskids.co.uk`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ymd(h.start)}`,
    `DTEND;VALUE=DATE:${ymd(nextDay(h.end))}`,
    `SUMMARY:${esc(`${h.name} (Herts schools)`)}`,
    `DESCRIPTION:${esc(`Hertfordshire County Council dates. Your school may add INSET days, and academies can set their own dates. What's on: ${guide}`)}`,
    `URL:${guide}`,
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
  ]);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//West Herts Kids//School holidays//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc('Herts school holidays')}`,
    `X-WR-CALDESC:${esc(`Hertfordshire County Council school holidays, from ${TERM_DATES_SOURCE}. Shared by ${SITE.name}.`)}`,
    'X-WR-TIMEZONE:Europe/London',
    'REFRESH-INTERVAL;VALUE=DURATION:P7D',
    'X-PUBLISHED-TTL:P7D',
    ...events,
    'END:VCALENDAR',
  ];
  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
