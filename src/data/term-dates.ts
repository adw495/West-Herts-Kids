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
