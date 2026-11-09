import { formatWeddingDate, type WeddingContent } from '../content/index.ts';

export function whatsappMessage(content: WeddingContent, guest: string, url: string) {
  const zone = { 'Asia/Jakarta': 'WIB', 'Asia/Makassar': 'WITA', 'Asia/Jayapura': 'WIT' }[content.timeZone] ?? content.timeZone;
  const events = content.events.map((event, index) => {
    const previous = content.events[index - 1];
    const next = content.events[index + 1];
    return [
      event.startsAt && (!previous || event.startsAt.slice(0, 10) !== previous.startsAt.slice(0, 10)) && `🗓️ ${formatWeddingDate(event.startsAt, content.timeZone)}`,
      event.startsAt && `🕒 ${event.name || 'Acara'}: ${formatWeddingDate(event.startsAt, content.timeZone, { hour: '2-digit', minute: '2-digit' })}${event.endsAt ? `–${formatWeddingDate(event.endsAt, content.timeZone, { hour: '2-digit', minute: '2-digit' })}` : ''} ${zone}`,
      event.startsAt && event.endsAt && event.startsAt.slice(0, 10) !== event.endsAt.slice(0, 10) && `Sampai: ${formatWeddingDate(event.endsAt, content.timeZone)}`,
      (!next || event.venue !== next.venue || event.address !== next.address) && [event.venue && `📍 ${event.venue}`, event.address].filter(Boolean).join('\n'),
    ].filter(Boolean).join('\n');
  }).filter(Boolean).join('\n');
  return [
    "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    `Kepada Yth.\n*${guest}*`,
    'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.',
    `*${content.brideName}*\n*&*\n*${content.groomName}*`,
    events && `Insya Allah akan melaksanakan ${content.events.map((event) => event.name || 'acara pernikahan').join(' dan ')} pada:\n${events}`,
    `Klik link pada undangan berikut:\n${url}`,
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu. Semoga Allah SWT menjadikan pernikahan ini sebagai ibadah, membawa keberkahan, dan menjadi langkah awal kami membangun keluarga yang Sakinah, Mawaddah, Warahmah.',
    `Hormat kami yang berbahagia,\n\n${content.coverBrideName || content.brideName} & ${content.coverGroomName || content.groomName}`,
    "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
  ].filter(Boolean).join('\n\n');
}

