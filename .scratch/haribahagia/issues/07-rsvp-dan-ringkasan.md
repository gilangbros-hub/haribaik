# 07: RSVP tamu dan ringkasan admin

**What to build:** Sebagai tamu, saya dapat mengirim dan mengubah jawaban hadir/tidak hadir melalui tautan saya; sebagai admin, saya dapat melihat ringkasan RSVP tanpa mengubah jawaban tamu.

**Blocked by:** 02 — Login dan akses admin; 04 — Impor dan pengelolaan daftar tamu CSV; 06 — Undangan personal dari data tersimpan.

**Status:** ready-for-agent

- [ ] RSVP menyimpan satu jawaban terkini per ID tamu dengan status attending atau declined.
- [ ] Tamu dapat mengirim jawaban pertama, melihat jawaban tersimpan, dan mengubahnya melalui tautan yang sama.
- [ ] Server memeriksa slug, status aktif, dan nilai jawaban; ID sasaran tidak dapat dipilih dari klien.
- [ ] Klik ganda tidak membuat duplikasi; kegagalan jaringan/database tidak menampilkan sukses palsu.
- [ ] Permintaan dari slug nonaktif atau nilai enum invalid ditolak; impor yang menonaktifkan tamu bersamaan tidak kehilangan RSVP yang sudah berhasil.
- [ ] Undangan mewakili satu orang; tidak ada jumlah hadir atau plus-one.
- [ ] Dashboard menghitung tamu aktif yang hadir, tidak hadir, dan belum menjawab; tamu nonaktif dapat dilihat terpisah.
- [ ] Tidak ada form admin atau kolom impor CSV yang dapat mengubah RSVP.
- [ ] Tanpa sesi admin, daftar, draf, dan ekspor RSVP ditolak; jawaban satu tamu tidak menampilkan data tamu lain.
