export type WeddingEvent = {
  name: string;
  startsAt: string;
  endsAt: string;
  venue: string;
  address: string;
  mapUrl: string;
};

export type WeddingContent = {
  title: string;
  greeting: string;
  brideName: string;
  groomName: string;
  description: string;
  timeZone: string;
  events: WeddingEvent[];
  closing: string;
};

type ContentResult = { ok: true; content: WeddingContent } | { ok: false; errors: string[] };
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const localParts = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const parts = match.slice(1).map(Number);
  const [year, month, day, hour, minute] = parts;
  const check = new Date(Date.UTC(year, month - 1, day, hour, minute));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day || check.getUTCHours() !== hour || check.getUTCMinutes() !== minute) return null;
  return parts as [number, number, number, number, number];
};

export function zonedLocalToUtc(value: string, timeZone: string): Date | null {
  const parts = localParts(value);
  if (!parts) return null;
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const target = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
    let candidate = target;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const displayed = Object.fromEntries(formatter.formatToParts(candidate).map(({ type, value }) => [type, value]));
      const represented = Date.UTC(Number(displayed.year), Number(displayed.month) - 1, Number(displayed.day), Number(displayed.hour), Number(displayed.minute));
      const correction = target - represented;
      if (correction === 0) return new Date(candidate);
      candidate += correction;
    }
  } catch {
    return null;
  }
  return null;
}

export function validateWeddingContent(value: unknown, requireComplete = true): ContentResult {
  if (!isRecord(value)) return { ok: false, errors: ['Isi konten harus berupa objek.'] };
  const errors: string[] = [];
  const text = (key: string, label: string, max: number, required = requireComplete) => {
    const item = value[key];
    if (typeof item !== 'string' || item.length > max || (required && !item.trim())) {
      errors.push(`${label} ${required ? 'wajib diisi' : 'tidak valid atau terlalu panjang'}.`);
      return '';
    }
    return item.trim();
  };
  const title = text('title', 'Judul', 120);
  const greeting = text('greeting', 'Sapaan', 300);
  const brideName = text('brideName', 'Nama CPW', 120);
  const groomName = text('groomName', 'Nama CPP', 120);
  const description = text('description', 'Deskripsi', 2000, false);
  const timeZone = text('timeZone', 'Zona waktu', 80);
  const closing = text('closing', 'Teks penutup', 1000);
  try {
    new Intl.DateTimeFormat('en', { timeZone });
  } catch {
    errors.push('Zona waktu tidak valid.');
  }

  if (!Array.isArray(value.events)) errors.push('Daftar acara tidak valid.');
  const sourceEvents = Array.isArray(value.events) ? value.events : [];
  if (sourceEvents.length > 10 || (requireComplete && sourceEvents.length < 1)) errors.push('Daftar acara wajib berisi 1–10 acara.');
  const events: WeddingEvent[] = sourceEvents.slice(0, 10).map((item, index) => {
    if (!isRecord(item)) {
      errors.push(`Acara ${index + 1} tidak valid.`);
      return { name: '', startsAt: '', endsAt: '', venue: '', address: '', mapUrl: '' };
    }
    const eventText = (key: keyof WeddingEvent, label: string, max: number, required = requireComplete) => {
      const field = item[key];
      if (typeof field !== 'string' || field.length > max || (required && !field.trim())) {
        errors.push(`Acara ${index + 1}: ${label} ${required ? 'wajib diisi' : 'tidak valid atau terlalu panjang'}.`);
        return '';
      }
      return field.trim();
    };
    const event: WeddingEvent = {
      name: eventText('name', 'nama acara', 120),
      startsAt: eventText('startsAt', 'waktu mulai', 16),
      endsAt: eventText('endsAt', 'waktu selesai', 16),
      venue: eventText('venue', 'venue', 180),
      address: eventText('address', 'alamat', 500),
      mapUrl: eventText('mapUrl', 'tautan peta', 1000),
    };
    const start = event.startsAt ? zonedLocalToUtc(event.startsAt, timeZone) : null;
    const end = event.endsAt ? zonedLocalToUtc(event.endsAt, timeZone) : null;
    if ((event.startsAt && !start) || (event.endsAt && !end) || (requireComplete && (!start || !end))) errors.push(`Acara ${index + 1}: tanggal, waktu, atau zona waktu tidak valid.`);
    else if (start && end && end <= start) errors.push(`Acara ${index + 1}: waktu acara selesai harus setelah waktu mulai.`);
    if (event.mapUrl) {
      try {
        const map = new URL(event.mapUrl);
        if (map.protocol !== 'https:' || !map.hostname || map.username || map.password) throw new Error('invalid map URL');
      } catch {
        errors.push(`Acara ${index + 1}: tautan peta harus menggunakan HTTPS.`);
      }
    } else if (requireComplete) errors.push(`Acara ${index + 1}: tautan peta wajib diisi.`);
    return event;
  });

  if (errors.length) return { ok: false, errors };
  return { ok: true, content: { title, greeting, brideName, groomName, description, timeZone, events, closing } };
}

export function formatWeddingDate(value: string, timeZone: string, options: Intl.DateTimeFormatOptions = { dateStyle: 'full' }): string {
  const date = zonedLocalToUtc(value, timeZone);
  return date ? new Intl.DateTimeFormat('id-ID', { ...options, timeZone }).format(date) : '';
}

const escapeIcs = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const icsDate = (value: string, timeZone: string) => zonedLocalToUtc(value, timeZone)?.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z') ?? '';
const foldLine = (line: string) => {
  const chunks: string[] = [];
  let chunk = '';
  let bytes = 0;
  for (const char of line) {
    const charBytes = new TextEncoder().encode(char).length;
    if (bytes + charBytes > 75) {
      chunks.push(chunk);
      chunk = ` ${char}`;
      bytes = charBytes + 1;
    } else {
      chunk += char;
      bytes += charBytes;
    }
  }
  chunks.push(chunk);
  return chunks.join('\r\n');
};

export function buildCalendar(content: WeddingContent, now = new Date()): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HariBahagia//Invitation//ID', 'CALSCALE:GREGORIAN'];
  content.events.forEach((event, index) => lines.push(
    'BEGIN:VEVENT', `UID:haribahagia-${index + 1}@haribahagia`,
    `DTSTAMP:${now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
    `DTSTART:${icsDate(event.startsAt, content.timeZone)}`, `DTEND:${icsDate(event.endsAt, content.timeZone)}`,
    `SUMMARY:${escapeIcs(`${event.name} — ${content.brideName} & ${content.groomName}`)}`,
    `LOCATION:${escapeIcs(`${event.venue}, ${event.address}`)}`,
    `DESCRIPTION:${escapeIcs([content.greeting, content.description].filter(Boolean).join('\n'))}`,
    'END:VEVENT',
  ));
  lines.push('END:VCALENDAR', '');
  return lines.map(foldLine).join('\r\n');
}

export const emptyWeddingContent: WeddingContent = {
  title: 'Undangan Pernikahan', greeting: 'Assalamu’alaikum warahmatullahi wabarakatuh',
  brideName: '', groomName: '', description: '', timeZone: 'Asia/Jakarta',
  events: [{ name: '', startsAt: '', endsAt: '', venue: '', address: '', mapUrl: '' }], closing: '',
};
