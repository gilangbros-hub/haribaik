export type InvitationEvent = {
  name: string;
  startsAt: string;
  endsAt: string;
  venue: string;
  address: string;
  mapUrl: string;
};

export type Invitation = {
  couple: { first: string; second: string; full: string };
  recipient: string;
  dateLabel: string;
  intro: string;
  profiles: { name: string; role: string; family: string }[];
  event: InvitationEvent;
  closing: string;
};

export const invitation: Invitation = {
  couple: { first: 'Nadia', second: 'Arka', full: 'Nadia & Arka' },
  recipient: 'Sahabat dan keluarga',
  dateLabel: 'Sabtu, 28 November 2026',
  intro: 'Dengan penuh rasa syukur, kami mengundang Anda untuk merayakan hari bahagia kami.',
  profiles: [
    { name: 'Nadia Putri', role: 'Mempelai wanita', family: 'Putri dari Bapak Surya dan Ibu Ratih' },
    { name: 'Arka Pratama', role: 'Mempelai pria', family: 'Putra dari Bapak Bima dan Ibu Laras' },
  ],
  event: {
    name: 'Resepsi Pernikahan',
    startsAt: '2026-11-28T18:30:00+07:00',
    endsAt: '2026-11-28T21:00:00+07:00',
    venue: 'Taman Senja',
    address: 'Jl. Contoh Bahagia No. 28, Jakarta',
    mapUrl: 'https://maps.google.com/?q=Taman+Senja+Jakarta',
  },
  closing: 'Merupakan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.',
};
