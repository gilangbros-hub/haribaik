# 05: Foto dan musik undangan

**What to build:** Sebagai admin, saya dapat menyiapkan foto di bagian yang tepat dan musik undangan, sehingga media muncul ke tamu hanya setelah kontennya diterbitkan.

**Blocked by:** 02 — Login dan akses admin; 03 — Edit dan publikasikan konten.

**Status:** ready-for-human

- [x] Admin dapat mengunggah, mengganti, atau melepas foto pasangan di sampul, foto CPP, foto CPW, dan beberapa foto galeri.
- [x] Admin dapat mengatur urutan foto galeri; galeri tamu tetap berupa grid sederhana tanpa slider atau lightbox.
- [x] Admin dapat mengisi teks alternatif yang diperlukan untuk memahami gambar.
- [x] Admin dapat mengunggah atau mengganti musik MP3; musik dan foto yang dipilih tampil di preview dan snapshot publik setelah Publish.
- [x] Upload hanya diizinkan bagi admin, divalidasi menurut isi/ukuran, dan tidak mengganti media lama saat upload gagal.
- [x] Media draf tersimpan privat; preview dan undangan hanya menerima signed URL untuk media yang diizinkan.
- [x] Melepas media dari draf tidak menghapus objek yang masih dipakai snapshot publik.
- [x] Tombol Buka Undangan mencoba memutar musik setelah interaksi; kontrol putar/jeda tersedia dan kegagalan audio tidak menghalangi konten.
- [x] Tanpa foto/musik, layout tetap lengkap dan kontrol musik tidak ditampilkan.
- [x] Foto memakai ukuran tampilan yang sesuai; metadata lokasi dihapus sebelum media dipublikasikan.

Implementasi kode selesai. Status `ready-for-human` menandai pemeriksaan browser dan media nyata yang masih perlu dilakukan setelah layanan/aset tersedia.

## Comments

- `npm test` (25/25), Astro check, dan Vercel build lulus. Alur browser lokal memeriksa draf, preview, Publish, dan undangan tanpa media; upload/preview dengan aset contoh, pemeriksaan metadata, serta pemulihan belum diverifikasi.
