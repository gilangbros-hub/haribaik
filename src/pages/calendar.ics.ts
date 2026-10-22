import type { APIRoute } from 'astro';
import { invitation } from '../data/invitation.ts';

const escapeIcs = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const icsDate = (value: string) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

export const GET: APIRoute = () => {
  const event = invitation.event;
  const content = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HariBahagia//Invitation//ID', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', `UID:haribahagia-demo-${icsDate(event.startsAt)}@haribahagia`, `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(event.startsAt)}`, `DTEND:${icsDate(event.endsAt)}`,
    `SUMMARY:${escapeIcs(`${event.name} — ${invitation.couple.full}`)}`,
    `LOCATION:${escapeIcs(`${event.venue}, ${event.address}`)}`, `DESCRIPTION:${escapeIcs(invitation.intro)}`,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="undangan-nadia-arka.ics"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
