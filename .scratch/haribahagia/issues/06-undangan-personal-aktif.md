# 06: Undangan personal dari data tersimpan

**What to build:** Sebagai tamu, saya membuka tautan bernama saya dan melihat undangan publik yang sesuai; tautan tidak mengungkap daftar atau informasi pengelolaan tamu lain.

**Blocked by:** 01 — Undangan publik dasar; 03 — Edit dan publikasikan konten; 04 — Impor dan pengelolaan daftar tamu CSV.

**Status:** ready-for-human

**Implementation:** Halaman tamu aktif, isolasi data, URL kanonis, dan RSVP sudah diimplementasikan serta diuji secara lokal; variasi slug/media dan environment hosted masih perlu diperiksa.

- [ ] Tautan berbentuk `/<slug>` menampilkan nama tamu aktif pada sampul bersama snapshot publik terkini dan media yang digunakan.
- [ ] Server mencari tamu dari slug, memeriksa status aktif, dan mengembalikan hanya data yang dibutuhkan untuk undangan.
- [ ] Slug invalid, tidak ditemukan, dan nonaktif menghasilkan keadaan halaman umum yang sama tanpa nama/RSVP.
- [ ] Sesi admin, draf, dan daftar tamu tidak dapat dibaca lewat endpoint atau cache halaman publik.
- [ ] URL dibangun dari domain kanonis yang dikonfigurasi, bukan header host permintaan.
- [ ] Halaman tamu memakai `noindex`, tidak masuk sitemap, dan tidak mengirim path penerima lewat referrer ke situs eksternal.
- [ ] Nama panjang, aset kosong, dan nama duplikat dengan slug berbeda tetap dirender dengan benar.
