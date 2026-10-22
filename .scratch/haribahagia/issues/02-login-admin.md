# 02: Login dan akses admin

**What to build:** Sebagai satu admin, saya dapat login dan logout, sehingga hanya akun yang diizinkan dapat membuka pengelolaan undangan.

**Blocked by:** 01 — Undangan publik dasar.

**Status:** ready-for-human

**Implementation:** Login/logout dan pembatasan admin di server sudah diimplementasikan serta diuji lewat browser lokal; akun hosted dan pemeriksaan keamanan pra-rilis masih menunggu provisioning.

- [ ] Admin yang diizinkan dapat login dan logout melalui Supabase Auth; pendaftaran publik tidak tersedia.
- [ ] Semua halaman dan operasi admin memeriksa sesi di server serta mencocokkan user ID dengan admin yang dikonfigurasi.
- [ ] Tanpa sesi atau dengan akun lain, pengguna tidak dapat membuka halaman admin maupun membaca draf.
- [ ] Cookie sesi memiliki konfigurasi aman untuk development dan production; logout mencabut akses berikutnya.
- [ ] Error login membantu admin tanpa mengungkap rahasia, detail database, atau stack trace.
- [ ] Uji endpoint menunjukkan akses ditolak untuk tanpa sesi dan pengguna authenticated selain admin.
