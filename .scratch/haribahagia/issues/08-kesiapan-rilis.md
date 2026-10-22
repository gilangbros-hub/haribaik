# 08: Kesiapan rilis dan pemulihan

**What to build:** Sebagai pengelola, saya dapat memeriksa dan menjalankan aplikasi pada lingkungan rilis dengan domain, data, dan media yang terpisah serta memiliki prosedur pemulihan yang pernah dicoba.

**Blocked by:** 01 — Undangan publik dasar; 02 — Login dan akses admin; 03 — Edit dan publikasikan konten; 04 — Impor dan pengelolaan daftar tamu CSV; 05 — Foto dan musik undangan; 06 — Undangan personal dari data tersimpan; 07 — RSVP tamu dan ringkasan admin.

**Status:** ready-for-agent

**Implementation:** Runbook dokumentasi selesai. Status triage tetap `ready-for-agent` karena tracker ini tidak memiliki label selesai; provisioning Supabase/Vercel/GitHub/domain, latihan restore, dan smoke test nyata tetap belum dilakukan.

- [ ] Development, Preview, dan Production memakai konfigurasi terpisah; Preview tidak membaca atau memutasi data produksi.
- [ ] Rahasia server tidak berada di Git, log, atau bundle browser; data tamu asli tidak berada di repository.
- [ ] Migrasi diterapkan terkontrol dan ada prosedur rollback yang mempertimbangkan kode, database, serta media.
- [ ] Dump database dan objek Storage dicadangkan serta berhasil dipulihkan bersama tanpa merusak relasi atau referensi media.
- [ ] Domain kanonis dan HTTPS berfungsi; tautan tamu yang disalin memakai domain final.
- [ ] Smoke test browser mencakup login, draf/preview/Publish, impor CSV, salin URL, RSVP, ekspor/impor ulang, foto, musik, peta, dan kalender.
- [ ] Layout diuji di ponsel kecil dan desktop, termasuk keyboard, reduced motion, audio gagal, serta keadaan database/kuota tidak tersedia.
- [ ] Batas upload dan kuota free tier diperiksa di lingkungan sebenarnya; error tidak menghilangkan input atau menampilkan keberhasilan palsu.
- [ ] Undangan siap dibagikan pada target pertengahan hingga akhir November 2026; keterbatasan yang tersisa didokumentasikan.
