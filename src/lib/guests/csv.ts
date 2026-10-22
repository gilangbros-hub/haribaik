export type CsvGuest = { name: string; slug: string };
export type ExistingGuest = { id: string; name: string; slug: string; active: boolean };
export type GuestPreview = {
  rows: CsvGuest[];
  counts: { new: number; retained: number; deactivated: number; reactivated: number };
};

const MAX_BYTES = 1_000_000;
const MAX_ROWS = 1_000;
const MAX_NAME_LENGTH = 200;
const MAX_SLUG_LENGTH = 64;
const formulaStart = /^[=+@\-\t\r]/;

function recordsFromCsv(input: string) {
  if (new TextEncoder().encode(input).length > MAX_BYTES) throw new Error('File CSV melewati batas 1 MB.');
  const source = input.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let closedQuote = false;

  for (let i = 0; i < source.length; i++) {
    const char = source[i]!;
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') { quoted = false; closedQuote = true; }
      else field += char;
    } else if (char === ',' || char === '\n' || char === '\r') {
      if (closedQuote && char !== ',' && char !== '\n' && char !== '\r') throw new Error('Format CSV tidak valid.');
      row.push(field);
      field = '';
      closedQuote = false;
      if (char !== ',') {
        if (char === '\r' && source[i + 1] === '\n') i++;
        if (row.some((cell) => cell !== '')) rows.push(row);
        row = [];
      }
    } else if (char === '"') {
      if (field || closedQuote) throw new Error('Format CSV tidak valid.');
      quoted = true;
    } else {
      if (closedQuote) throw new Error('Format CSV tidak valid.');
      field += char;
    }
    if (rows.length > MAX_ROWS + 1) throw new Error(`CSV melebihi batas ${MAX_ROWS} tamu.`);
  }
  if (quoted) throw new Error('Format CSV tidak valid: kutip tidak ditutup.');
  row.push(field);
  if (row.some((cell) => cell !== '')) rows.push(row);
  if (rows.length > MAX_ROWS + 1) throw new Error(`CSV melebihi batas ${MAX_ROWS} tamu.`);
  return rows;
}

function validSlug(slug: string) {
  return slug.length <= MAX_SLUG_LENGTH && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function slugFromName(name: string) {
  return name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-')
    .slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '');
}

export function parseGuestsCsv(input: string): CsvGuest[] {
  const table = recordsFromCsv(input);
  const headers = table.shift()?.map((header) => header.trim().toLowerCase());
  if (!headers || headers[0] !== 'nama' || headers[1] !== 'slug' || headers.length < 2 || headers.length !== new Set(headers).size) {
    throw new Error('Header CSV harus dimulai dengan kolom nama,slug yang unik.');
  }
  const isExport = headers.includes('status_rsvp') && headers.includes('waktu_jawaban_terakhir');
  if (!table.length) throw new Error('CSV tidak memiliki baris tamu.');
  const slugs = new Set<string>();
  return table.map((cells, index) => {
    if (cells.length !== headers.length) throw new Error(`Baris ${index + 2}: jumlah kolom tidak sesuai header.`);
    let name = cells[0]!;
    const slug = cells[1]!;
    if (isExport && name.startsWith("''")) name = name.slice(1);
    else if (isExport && name.startsWith("'")
      && (formulaStart.test(name.slice(1)) || formulaStart.test(name.slice(1).trimStart()))) name = name.slice(1);
    if (!name.trim() || name.length > MAX_NAME_LENGTH) throw new Error(`Baris ${index + 2}: nama wajib diisi dan maksimal ${MAX_NAME_LENGTH} karakter.`);
    if (slug && !validSlug(slug)) throw new Error(`Baris ${index + 2}: slug tidak valid.`);
    if (slug && slugs.has(slug)) throw new Error(`Baris ${index + 2}: slug duplikat (${slug}).`);
    if (slug) slugs.add(slug);
    return { name, slug };
  });
}

export function analyzeGuestImport(rows: CsvGuest[], current: ExistingGuest[]): GuestPreview {
  const bySlug = new Map(current.map((guest) => [guest.slug, guest]));
  const names = new Set(current.map((guest) => guest.name.trim().toLocaleLowerCase('id')));
  const used = new Set(current.map((guest) => guest.slug));
  const requested = new Set(rows.flatMap(({ slug }) => slug ? [slug] : []));
  const resolved = rows.map(({ name, slug }) => {
    if (!slug && names.has(name.trim().toLocaleLowerCase('id'))) {
      throw new Error(`Nama "${name}" sudah tersimpan; isi slug tetap untuk menjaga identitas dan RSVP.`);
    }
    if (slug) return { name, slug };
    const base = slugFromName(name);
    if (!base) throw new Error(`Nama "${name}" tidak dapat menjadi slug; isi slug yang valid.`);
    let candidate = base;
    for (let suffix = 2; used.has(candidate) || requested.has(candidate); suffix++) {
      const ending = `-${suffix}`;
      candidate = `${base.slice(0, MAX_SLUG_LENGTH - ending.length).replace(/-+$/g, '')}${ending}`;
    }
    used.add(candidate);
    requested.add(candidate);
    return { name, slug: candidate };
  });
  const imported = new Set(resolved.map(({ slug }) => slug));
  const counts = {
    new: resolved.filter(({ slug }) => !bySlug.has(slug)).length,
    retained: resolved.filter(({ slug }) => bySlug.get(slug)?.active).length,
    reactivated: resolved.filter(({ slug }) => bySlug.has(slug) && !bySlug.get(slug)!.active).length,
    deactivated: current.filter(({ active, slug }) => active && !imported.has(slug)).length,
  };
  return { rows: resolved, counts };
}

function csvCell(value: string) {
  const safe = formulaStart.test(value.trimStart()) || value.startsWith("'") ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function exportGuestsCsv(guests: Array<{ name: string; slug: string; rsvp: string; answeredAt: string | null }>) {
  return '\uFEFF' + [
    ['nama', 'slug', 'status_rsvp', 'waktu_jawaban_terakhir'],
    ...guests.map(({ name, slug, rsvp, answeredAt }) => [name, slug, rsvp, answeredAt ?? '']),
  ].map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
