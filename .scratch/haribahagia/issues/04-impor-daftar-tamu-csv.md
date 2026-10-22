# 04: Impor dan pengelolaan daftar tamu CSV

**What to build:** Sebagai admin, saya dapat mengganti daftar tamu dari CSV, memeriksa dampaknya, lalu menyalin URL atau mengunduh daftar, sehingga pembaruan untuk sekitar 200 tamu tidak merusak tautan dan jawaban yang sudah tersimpan.

**Blocked by:** 02 — Login dan akses admin.

**Status:** ready-for-agent

- [ ] Admin dapat mengunggah CSV berkepala `nama` dan `slug`; slug kosong hanya membuat slug untuk tamu baru.
- [ ] Server memvalidasi seluruh file sebelum perubahan dan menunjukkan hitungan tamu baru, tetap aktif, dinonaktifkan, serta diaktifkan kembali.
- [ ] Impor mengganti daftar aktif dalam satu transaksi; kegagalan atau file kosong/rusak tidak mengubah daftar yang tersimpan.
- [ ] Slug tamu yang sudah ada mempertahankan ID, URL, nama yang diperbarui, dan RSVP; identitas tidak dicocokkan menurut nama atau urutan baris.
- [ ] Tamu yang tidak ada dalam CSV dinonaktifkan tanpa menghapus RSVP; slug lama yang diimpor kembali mengaktifkan tamu dan riwayatnya.
- [ ] Nama kosong, slug invalid/duplikat, nama tersimpan dengan slug kosong, header salah, encoding/quoting rusak, atau file melewati batas yang dikonfigurasi menghasilkan pesan yang menunjuk masalahnya.
- [ ] Halaman daftar dapat mencari nama/slug, memfilter status aktif, melihat RSVP, dan menyalin URL per tamu.
- [ ] Admin dapat mengunduh CSV daftar aktif lengkap dengan `nama`, `slug`, `status_rsvp`, dan waktu jawaban terakhir, meski daftar di layar sedang difilter.
- [ ] Status/waktu RSVP di CSV tidak dapat menimpa jawaban; ekspor aman untuk spreadsheet dan impor ulang menjaga nama tetap sama.
- [ ] Dua impor bersamaan tidak meninggalkan daftar campuran dan RSVP yang masuk bersamaan tidak hilang.
