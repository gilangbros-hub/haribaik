# 07: RSVP tamu dan ringkasan admin

**What to build:** Sebagai tamu, saya dapat mengirim dan mengubah jawaban hadir/tidak hadir melalui tautan saya; sebagai admin, saya dapat melihat ringkasan RSVP tanpa mengubah jawaban tamu.

**Blocked by:** 02 — Login dan akses admin; 04 — Impor dan pengelolaan daftar tamu CSV; 06 — Undangan personal dari data tersimpan.

**Status:** ready-for-human

- [x] RSVP menyimpan satu jawaban terkini per ID tamu dengan status attending atau declined.
- [x] Tamu dapat mengirim jawaban pertama, melihat jawaban tersimpan, dan mengubahnya melalui tautan yang sama.
- [x] Server memeriksa slug, status aktif, dan nilai jawaban; ID sasaran tidak dapat dipilih dari klien.
- [x] Klik ganda tidak membuat duplikasi; kegagalan jaringan/database tidak menampilkan sukses palsu.
- [x] Permintaan dari slug nonaktif atau nilai enum invalid ditolak; impor yang menonaktifkan tamu bersamaan tidak kehilangan RSVP yang sudah berhasil.
- [x] Undangan mewakili satu orang; tidak ada jumlah hadir atau plus-one.
- [x] Dashboard menghitung tamu aktif yang hadir, tidak hadir, dan belum menjawab; tamu nonaktif dapat dilihat terpisah.
- [x] Tidak ada form admin atau kolom impor CSV yang dapat mengubah RSVP.
- [x] Tanpa sesi admin, daftar, draf, dan ekspor RSVP ditolak; jawaban satu tamu tidak menampilkan data tamu lain.

## Comments

- Implemented RSVP save/read, personal form, and admin summary. `npm test`, `npm run check`, and `npm run build` pass. Live Supabase RLS and import/RSVP concurrency checks still require a non-production Supabase project.
- Before public sharing, configure a Vercel Firewall rate-limit rule for `/api/guests/*/rsvp`. Vercel documents WAF rate limiting for Hobby; its fixed-window rule is configured in the project Firewall dashboard, which is not connected yet: https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting
