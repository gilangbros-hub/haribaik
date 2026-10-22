import { isMediaPath } from './media-validation.ts';

export type WeddingEvent = {
  name: string;
  startsAt: string;
  endsAt: string;
  venue: string;
  address: string;
  mapUrl: string;
};

export type WeddingImage = { path: string; alt: string };

export const childKinds = ['Putri', 'Putra'] as const;
export const birthOrders = ['Pertama', 'Kedua', 'Ketiga', 'Keempat'] as const;
export type ChildKind = (typeof childKinds)[number];
export type BirthOrder = (typeof birthOrders)[number];

// "Putri Pertama dari Bapak A & Ibu B"; empty when no parents are set.
export const lineage = (child: string, order: string, parents: string) => parents ? `${child} ${order} dari ${parents}` : '';

export type WeddingContent = {
  title: string;
  greeting: string;
  brideName: string;
  groomName: string;
  // Cover-page names; empty means "use brideName/groomName".
  coverBrideName: string;
  coverGroomName: string;
  brideChild: ChildKind;
  brideOrder: BirthOrder;
  brideParents: string;
  groomChild: ChildKind;
  groomOrder: BirthOrder;
  groomParents: string;
  brideBank: string;
  brideAccount: string;
  groomBank: string;
  groomAccount: string;
  description: string;
  timeZone: string;
  events: WeddingEvent[];
  closing: string;
  coverImage: WeddingImage | null;
  brideImage: WeddingImage | null;
  groomImage: WeddingImage | null;
  storyText: string;
  storyImage: WeddingImage | null;
  gallery: WeddingImage[];
  musicPath: string | null;
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
  // Older saved content has no cover names, so a missing key is allowed.
  const coverBrideName = value.coverBrideName === undefined ? '' : text('coverBrideName', 'Nama CPW di sampul', 120, false);
  const coverGroomName = value.coverGroomName === undefined ? '' : text('coverGroomName', 'Nama CPP di sampul', 120, false);
  const pick = <T extends string>(key: string, label: string, options: readonly T[], fallback: T): T => {
    const item = value[key];
    if (item === undefined) return fallback;
    if (typeof item === 'string' && (options as readonly string[]).includes(item)) return item as T;
    errors.push(`${label} tidak valid.`);
    return fallback;
  };
  const brideChild = pick('brideChild', 'Putra/Putri CPW', childKinds, 'Putri');
  const brideOrder = pick('brideOrder', 'Anak ke- CPW', birthOrders, 'Pertama');
  const brideParents = value.brideParents === undefined ? '' : text('brideParents', 'Nama orang tua CPW', 300, false);
  const groomChild = pick('groomChild', 'Putra/Putri CPP', childKinds, 'Putra');
  const groomOrder = pick('groomOrder', 'Anak ke- CPP', birthOrders, 'Pertama');
  const groomParents = value.groomParents === undefined ? '' : text('groomParents', 'Nama orang tua CPP', 300, false);
  const optional = (key: string, label: string, max: number) => value[key] === undefined ? '' : text(key, label, max, false);
  const brideBank = optional('brideBank', 'Bank CPW', 80);
  const brideAccount = optional('brideAccount', 'No. rekening CPW', 40);
  const groomBank = optional('groomBank', 'Bank CPP', 80);
  const groomAccount = optional('groomAccount', 'No. rekening CPP', 40);
  const description = text('description', 'Deskripsi', 2000, false);
  const timeZone = text('timeZone', 'Zona waktu', 80);
  const closing = text('closing', 'Teks penutup', 1000);
  const image = (key: string, label: string): WeddingImage | null => {
    const item = value[key];
    if (item === null || item === undefined) return null;
    if (!isRecord(item) || typeof item.path !== 'string' || !isMediaPath(item.path) || typeof item.alt !== 'string' || !item.alt.trim() || item.alt.length > 300) {
      errors.push(`${label} tidak valid; foto harus memiliki teks alternatif.`);
      return null;
    }
    return { path: item.path, alt: item.alt.trim() };
  };
  const coverImage = image('coverImage', 'Foto sampul');
  const brideImage = image('brideImage', 'Foto CPW');
  const groomImage = image('groomImage', 'Foto CPP');
  const storyImage = image('storyImage', 'Foto cerita kami');
  const storyText = optional('storyText', 'Cerita kami', 3000);
  const sourceGallery = value.gallery === undefined ? [] : value.gallery;
  if (!Array.isArray(sourceGallery) || sourceGallery.length > 12) errors.push('Galeri maksimal berisi 12 foto.');
  const gallery = (Array.isArray(sourceGallery) ? sourceGallery : []).slice(0, 12).map((item, index) => {
    if (!isRecord(item) || typeof item.path !== 'string' || !isMediaPath(item.path) || typeof item.alt !== 'string' || !item.alt.trim() || item.alt.length > 300) {
      errors.push(`Foto galeri ${index + 1} tidak valid; foto harus memiliki teks alternatif.`);
      return { path: '', alt: '' };
    }
    return { path: item.path, alt: item.alt.trim() };
  });
  const musicPath = value.musicPath === null || value.musicPath === undefined || value.musicPath === '' ? null : value.musicPath;
  if (musicPath !== null && (typeof musicPath !== 'string' || !isMediaPath(musicPath))) errors.push('Musik tidak valid.');
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
  const mediaPaths = [coverImage?.path, brideImage?.path, groomImage?.path, storyImage?.path, ...gallery.map((item) => item.path), musicPath].filter(Boolean);
  if (new Set(mediaPaths).size !== mediaPaths.length) errors.push('Objek media tidak boleh dipakai lebih dari satu kali.');
  if (errors.length) return { ok: false, errors };
  return { ok: true, content: { title, greeting, brideName, groomName, coverBrideName, coverGroomName, brideChild, brideOrder, brideParents, groomChild, groomOrder, groomParents, brideBank, brideAccount, groomBank, groomAccount, description, timeZone, events, closing, coverImage, brideImage, groomImage, storyText, storyImage, gallery, musicPath: musicPath as string | null } };
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
  brideName: '', groomName: '', coverBrideName: '', coverGroomName: '',
  brideChild: 'Putri', brideOrder: 'Pertama', brideParents: '', groomChild: 'Putra', groomOrder: 'Pertama', groomParents: '', brideBank: '', brideAccount: '', groomBank: '', groomAccount: '', description: '', timeZone: 'Asia/Jakarta',
  events: [{ name: '', startsAt: '', endsAt: '', venue: '', address: '', mapUrl: '' }], closing: '',
  coverImage: null, brideImage: null, groomImage: null, storyText: '', storyImage: null, gallery: [], musicPath: null,
};
