# 04: Impor dan pengelolaan daftar tamu CSV

**What to build:** Sebagai admin, saya dapat mengganti daftar tamu dari CSV, memeriksa dampaknya, lalu menyalin URL atau mengunduh daftar, sehingga pembaruan untuk sekitar 200 tamu tidak merusak tautan dan jawaban yang sudah tersimpan.

**Blocked by:** 02 — Login dan akses admin.

**Status:** ready-for-human

- [x] Admin dapat mengunggah CSV berkepala `nama` dan `slug`; slug kosong hanya membuat slug untuk tamu baru.
- [x] Server memvalidasi seluruh file sebelum perubahan dan menunjukkan hitungan tamu baru, tetap aktif, dinonaktifkan, serta diaktifkan kembali.
- [x] Impor mengganti daftar aktif dalam satu transaksi; kegagalan atau file kosong/rusak tidak mengubah daftar yang tersimpan.
- [x] Slug tamu yang sudah ada mempertahankan ID, URL, nama yang diperbarui, dan RSVP; identitas tidak dicocokkan menurut nama atau urutan baris.
- [x] Tamu yang tidak ada dalam CSV dinonaktifkan tanpa menghapus RSVP; slug lama yang diimpor kembali mengaktifkan tamu dan riwayatnya.
- [x] Nama kosong, slug invalid/duplikat, nama tersimpan dengan slug kosong, header salah, encoding/quoting rusak, atau file melewati batas yang dikonfigurasi menghasilkan pesan yang menunjuk masalahnya.
- [x] Halaman daftar dapat mencari nama/slug, memfilter status aktif, melihat RSVP, dan menyalin URL per tamu.
- [x] Admin dapat mengunduh CSV daftar aktif lengkap dengan `nama`, `slug`, `status_rsvp`, dan waktu jawaban terakhir, meski daftar di layar sedang difilter.
- [x] Status/waktu RSVP di CSV tidak dapat menimpa jawaban; ekspor aman untuk spreadsheet dan impor ulang menjaga nama tetap sama.
- [x] Dua impor bersamaan tidak meninggalkan daftar campuran dan RSVP yang masuk bersamaan tidak hilang.

## Comments

- Implementasi menggunakan RPC transaksi yang menserialkan impor dan hanya mengubah tabel tamu; tabel RSVP tidak ditulis oleh jalur impor.
- `npm test`, `npm run check`, dan `npm run build` lulus. Tes Supabase/browser belum dijalankan karena project Supabase pengujian belum tersedia.
