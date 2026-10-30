// Hertfordshire County Council school holiday dates (community and voluntary-controlled schools).
// Source: https://www.hertfordshire.gov.uk/services/schools-and-education/at-school/school-term-dates/school-term-dates.aspx
// Checked 7 Oct 2026. Keep in step with src/content/posts/herts-school-term-dates-2026-27.md.
// Dates are inclusive (first and last day off). Each school adds its own INSET days, which aren't here.
export type Holiday = { id: string; name: string; start: string; end: string };

export const TERM_DATES_SOURCE =
  'https://www.hertfordshire.gov.uk/services/schools-and-education/at-school/school-term-dates/school-term-dates.aspx';

export const HOLIDAYS: Holiday[] = [
  { id: '2026-oct-half-term', name: 'October half term', start: '2026-10-26', end: '2026-10-30' },
  { id: '2026-christmas', name: 'Christmas holidays', start: '2026-12-21', end: '2027-01-01' },
  { id: '2027-feb-half-term', name: 'February half term', start: '2027-02-15', end: '2027-02-19' },
  { id: '2027-easter', name: 'Easter holidays', start: '2027-03-26', end: '2027-04-09' },
  { id: '2027-may-half-term', name: 'May half term', start: '2027-05-31', end: '2027-06-04' },
  { id: '2027-summer', name: 'Summer holidays', start: '2027-07-23', end: '2027-08-31' },
  { id: '2027-oct-half-term', name: 'October half term', start: '2027-10-25', end: '2027-10-29' },
  { id: '2027-christmas', name: 'Christmas holidays', start: '2027-12-20', end: '2028-01-03' },
  { id: '2028-feb-half-term', name: 'February half term', start: '2028-02-14', end: '2028-02-18' },
  { id: '2028-easter', name: 'Easter holidays', start: '2028-04-03', end: '2028-04-17' },
  { id: '2028-may-half-term', name: 'May half term', start: '2028-05-29', end: '2028-06-02' },
  { id: '2028-summer', name: 'Summer holidays', start: '2028-07-25', end: '2028-09-01' },
];

// Dated guides for each holiday (post ids). Pages only link the ones that exist, so a missing guide is skipped.
// Used by the school holiday planner and the stable /whats-on/half-term/ page.
export const SEASONAL_GUIDES: Record<string, { href: string; label: string }[]> = {
  '2026-oct-half-term': [
    { href: 'october-half-term-2026-holiday-camps', label: 'October half term 2026 holiday camps' },
    { href: 'halloween-half-term-2026-watford', label: 'Halloween and half term events' },
    { href: 'bonfire-night-fireworks-2026-watford', label: 'Bonfire night fireworks 2026' },
  ],
  '2026-christmas': [{ href: 'christmas-2026-west-herts', label: 'Christmas 2026: pantos, grottos and lights' }],
};

// The next (or current) holiday relative to `today`, with the last school day before it and the day children go back.
// Used to keep the term dates guide's search title and answer box current on every build.
const addDays = (iso: string, n: number) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const weekday = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay();
const prevSchoolDay = (iso: string) => { let d = addDays(iso, -1); while (weekday(d) === 0 || weekday(d) === 6) d = addDays(d, -1); return d; };
const nextSchoolDay = (iso: string) => { let d = addDays(iso, 1); while (weekday(d) === 0 || weekday(d) === 6) d = addDays(d, 1); return d; };
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });

export function nextHoliday(today = new Date().toISOString().slice(0, 10)) {
  const h = HOLIDAYS.find((x) => x.end >= today);
  if (!h) return null;
  const sameYear = h.start.slice(0, 4) === h.end.slice(0, 4);
  const sameMonth = sameYear && h.start.slice(0, 7) === h.end.slice(0, 7);
  const range = sameMonth
    ? `${fmt(h.start, { day: 'numeric' })}–${fmt(h.end, { day: 'numeric', month: 'short', year: 'numeric' })}`
    : sameYear
      ? `${fmt(h.start, { day: 'numeric', month: 'short' })}–${fmt(h.end, { day: 'numeric', month: 'short', year: 'numeric' })}`
      : `${fmt(h.start, { day: 'numeric', month: 'short', year: 'numeric' })}–${fmt(h.end, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  const long = (iso: string) => fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' });
  const year = h.start.slice(0, 4);
  const onNow = h.start <= today;
  return {
    ...h,
    title: `${h.name} ${range}: Herts term dates`,
    answer: `${onNow ? 'On now' : 'Next Herts school holiday'}: ${h.name} ${year}, ${long(h.start)} to ${long(h.end)}${sameYear ? '' : ` ${h.end.slice(0, 4)}`}. The last day of term is ${long(prevSchoolDay(h.start))} and children go back on ${long(nextSchoolDay(h.end))}.`,
  };
}
