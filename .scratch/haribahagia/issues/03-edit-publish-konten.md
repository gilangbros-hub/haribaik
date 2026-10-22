# 03: Edit dan publikasikan konten

**What to build:** Sebagai admin, saya dapat mengedit detail pernikahan sebagai draf, memeriksanya lewat preview, lalu menerbitkannya ketika siap; tamu melihat publikasi terakhir yang berhasil.

**Blocked by:** 01 — Undangan publik dasar; 02 — Login dan akses admin.

**Status:** ready-for-agent

- [ ] Admin mengedit judul/sapaan, nama mempelai, deskripsi opsional, daftar acara, tanggal/waktu terstruktur, zona waktu, venue, alamat, tautan peta, dan teks penutup melalui form terstruktur.
- [ ] Simpan hanya memperbarui draf; preview admin menggunakan renderer undangan yang sama dan tidak mengubah data RSVP.
- [ ] Publish memvalidasi konten wajib lalu mengganti snapshot publik secara atomik.
- [ ] Tamu tetap melihat snapshot publik sebelumnya selama draf diedit dan menerima snapshot terbaru setelah Publish berhasil tanpa deploy ulang.
- [ ] Sebelum publikasi pertama, tautan tamu menampilkan keadaan undangan belum tersedia.
- [ ] Kegagalan simpan atau Publish mempertahankan input dan publikasi terakhir.
- [ ] Tanggal dan waktu menjadi sumber tunggal bagi tampilan serta file kalender ICS yang valid untuk zona waktu dan karakter khusus.
- [ ] Peta membuka lokasi melalui URL dengan protokol yang diizinkan.
- [ ] Pengujian memastikan tamu tidak dapat membaca draf dan Publish gagal tidak merusak snapshot sebelumnya.
