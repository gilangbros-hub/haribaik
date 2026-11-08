import { formatWeddingDate, lineage, type WeddingContent } from '../content/index.ts';

export function whatsappMessage(content: WeddingContent, guest: string, url: string) {
  const person = (name: string, child: string, order: string, parents: string) => [name, lineage(child, order, parents)].filter(Boolean).join(' ');
  const zone = { 'Asia/Jakarta': 'WIB', 'Asia/Makassar': 'WITA', 'Asia/Jayapura': 'WIT' }[content.timeZone] ?? content.timeZone;
  const events = content.events.map((event) => [
    `Insya Allah, ${event.name || 'acara pernikahan'} akan dilaksanakan pada:`,
    event.startsAt && `Hari/Tanggal: ${formatWeddingDate(event.startsAt, content.timeZone)}`,
    event.startsAt && `Pukul: ${formatWeddingDate(event.startsAt, content.timeZone, { hour: '2-digit', minute: '2-digit' })}${event.endsAt ? `–${formatWeddingDate(event.endsAt, content.timeZone, { hour: '2-digit', minute: '2-digit' })}` : ''} ${zone}`,
    event.startsAt && event.endsAt && event.startsAt.slice(0, 10) !== event.endsAt.slice(0, 10) && `Sampai: ${formatWeddingDate(event.endsAt, content.timeZone)}`,
    [event.venue, event.address].filter(Boolean).length && `Lokasi: ${[event.venue, event.address].filter(Boolean).join(', ')}`,
  ].filter(Boolean).join('\n')).join('\n\n');
  return [
    "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    `Kepada Yth.\n${guest}`,
    'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.',
    'Setelah menjalin kasih dan berkomitmen, tibalah saatnya kami,',
    `${person(content.groomName, content.groomChild, content.groomOrder, content.groomParents)}\n\n&\n\n${person(content.brideName, content.brideChild, content.brideOrder, content.brideParents)}`,
    events,
    `Informasi lengkap undangan:\n${url}`,
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu. Semoga Allah SWT menjadikan pernikahan ini sebagai ibadah, membawa keberkahan, dan menjadi langkah awal kami membangun keluarga yang Sakinah, Mawaddah, Warahmah.',
    `Hormat kami yang berbahagia,\n\n${content.coverGroomName || content.groomName} & ${content.coverBrideName || content.brideName}`,
    "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
  ].filter(Boolean).join('\n\n');
}
