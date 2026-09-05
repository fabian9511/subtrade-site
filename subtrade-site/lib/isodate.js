// Turning a plain "2026-08-29" into the timestamp Google actually wants.
//
// Search Console reports two non-critical issues against a bare date in
// structured data — "Datetime property is missing a timezone" and "Invalid
// datetime value" — because a date on its own does not identify a moment.
// Google's guidance is ISO 8601 with an offset, so `2026-08-29` has to go out
// as `2026-08-29T09:00:00-06:00`.
//
// The offset is the catch: Alberta is -07:00 in winter and -06:00 in summer, so
// hard-coding either one is wrong for half the year. Rather than write a DST
// table, ask the runtime, which already carries the timezone database. If a
// runtime ever answers in a format this does not recognise, it falls back to
// UTC — still a valid timestamp, so the markup can never end up malformed.

const ZONE = 'America/Edmonton';

function offsetFor(day) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: ZONE,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date(`${day}T12:00:00Z`));
    const name = parts.find((p) => p.type === 'timeZoneName').value; // "GMT-6"
    const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return 'Z';
    return `${m[1]}${m[2].padStart(2, '0')}:${m[3] || '00'}`;
  } catch {
    return 'Z';
  }
}

// day: "YYYY-MM-DD". time: "HH:MM", defaulting to a working-hours stamp —
// nothing on this site records the minute something went up, and mid-morning
// local is a more honest guess than midnight UTC.
export function isoDateTime(day, time = '09:00') {
  if (!day) return undefined;
  const clean = String(day).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean; // already a full stamp
  const suffix = offsetFor(clean);
  return `${clean}T${time}:00${suffix === 'Z' ? 'Z' : suffix}`;
}
