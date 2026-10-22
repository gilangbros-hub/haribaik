# HariBahagia — Rencana Implementasi

Status: perencanaan, belum ada implementasi aplikasi.
Tanggal pembaruan: 22 Oktober 2026.
Keputusan hasil wawancara telah dikonfirmasi pengguna; dokumen ini belum menyatakan aplikasi sudah dibangun atau diuji.

## 1. Tujuan dan keputusan

Membangun aplikasi undangan untuk satu pernikahan dengan dua sisi: pengelolaan oleh admin dan undangan individual untuk tamu. Tampilan undangan mengikuti referensi Sheilly & Dhanar sedekat mungkin, lalu menggunakan konten pernikahan sendiri.

| Hal | Keputusan |
| --- | --- |
| Jumlah pernikahan | Satu |
| Pengelola | Satu admin; tanpa pendaftaran akun publik |
| Penerima | Individual; satu undangan untuk satu orang |
| Perkiraan tamu | Sekitar 200 orang; bukan batas maksimum aplikasi |
| URL tamu | `https://domain.com/nama-tamu` |
| Akses tamu | Cukup mengetahui tautan; tanpa PIN/OTP, termasuk untuk mengubah RSVP |
| Desain | Rekreasi visual referensi, bukan sistem pilihan template |
| Layout dan foto | Satu halaman scroll; foto pasangan di depan, foto CPP, foto CPW, dan galeri grid sederhana |
| Pengelolaan konten | Draf, preview, lalu Publish; admin mengatur foto per bagian dan urutan galeri |
| Musik | Upload/ganti oleh admin; mulai setelah Buka Undangan, dengan kontrol putar/jeda |
| Daftar tamu | Impor CSV mengganti daftar aktif; tamu lama dicocokkan melalui slug agar URL dan RSVP tetap tersimpan |
| Konten asli | Menyusul; selama pengembangan gunakan data contoh |
| Aplikasi | Astro + TypeScript |
| Hosting | Vercel Hobby/free tier; domain sudah dimiliki, detailnya menyusul |
| Database dan layanan | Supabase PostgreSQL, Auth, dan Storage; menargetkan free tier |
| Source dan deployment | Repository GitHub pribadi privat dihubungkan ke Vercel; akun dan URL repo menyusul |
| Target siap dibagikan | Pertengahan hingga akhir November 2026; tanggal pasti menyusul |
| Tahap sekarang | Memperbarui rencana sesuai kesepakatan; tidak membangun atau menerbitkan aplikasi |

Draf/publikasi, RSVP hadir/tidak hadir, impor/ekspor CSV, foto per bagian, galeri grid, dan musik sudah disepakati. Admin melihat jawaban RSVP, tetapi tidak mengisi atau mengubahnya.

## 2. Referensi dan batas bukti

Referensi visual utama: https://sheilly-dhanar.meraki.id/. Sheilly & Dhanar tetap menjadi acuan warna, font, dan layout.

### Referensi tambahan

| Repository | Inspirasi yang relevan berdasarkan README |
| --- | --- |
| [Bavly-Hamdy/Engagement](https://github.com/Bavly-Hamdy/Engagement) | Sampul animasi, transisi masuk, dan kontrol musik |
| [Rainier-PS/Invitation-Template](https://github.com/Rainier-PS/Invitation-Template) | Konten JSON, scroll antarseksi, dan pengaturan gerakan |
| [ahmadghozali-xyz/undangan-dian-iqbal](https://github.com/ahmadghozali-xyz/undangan-dian-iqbal#-pratinjau-tampilan) | Susunan undangan, animasi saat scroll, dan penyajian galeri |
| [winanda150/pawiwahan-theme-1](https://github.com/winanda150/pawiwahan-theme-1) | Nuansa budaya, galeri, dan transisi antarmuka |

README keempat repo telah dibaca; kode, tampilan, dan perilaku browser belum diperiksa langsung. Gunakan sebagai referensi tambahan dalam implementasi Astro. Fitur di repo tersebut tidak otomatis menjadi cakupan kita; periksa lisensi kode dan izin aset sebelum memakai ulang bagian apa pun.

### Bukti referensi utama

Salinan lokal yang sudah dibaca:

- `/home/gilang/Downloads/Sheilly & Dhanar · Sabtu, 19 Desember 2026.html`
- `/home/gilang/Downloads/Sheilly & Dhanar · Sabtu, 19 Desember 2026_files/`

Temuan berasal dari pemeriksaan statis HTML dan CSS, bukan pengujian interaksi atau screenshot browser. Tidak ada akses ke CMS atau backend referensi. Rancangan CMS di dokumen ini adalah desain untuk kebutuhan kita.

### Tampilan yang teridentifikasi

| Elemen | Temuan |
| --- | --- |
| Tema | `modern-10`, palet `museum`, skema gelap |
| Latar | `#122B23` |
| Permukaan/kartu | `#1A372D` |
| Teks utama | `#F0EDE4` |
| Teks sekunder | `#9CAEA3` |
| Aksen | `#D3A5B9` |
| Garis | `#28493D` |
| Judul dan nama | Libre Caslon Display |
| Isi | Instrument Sans |
| Layout | Scroll vertikal; kolom maksimal `27.5rem` atau sekitar 440 px di tengah desktop |
| Latar desktop | Permukaan berwarna dengan pola dekoratif |
| Bentuk | Sudut dominan tegas, judul serif besar, ruang antarseksi lebar |

### Bagian yang memiliki konten dalam salinan

1. Sampul: judul undangan, nama pasangan, tanggal, nama penerima, tombol Buka Undangan.
2. Profil kedua mempelai.
3. Detail acara: nama acara, tanggal, jam, venue, alamat, tombol peta dan kalender.
4. Penutup: monogram, ucapan terima kasih, nama pasangan.
5. Elemen audio dan kontrol putar/jeda musik.

Bagian story, gallery, dan quote tercantum sebagai wadah kosong. Tidak ada formulir RSVP yang terlihat pada HTML yang dibaca. Galeri grid dan RSVP merupakan kebutuhan kita yang telah disepakati, bukan fitur aktif referensi yang sudah terbukti. Atribut parallax/reveal menunjukkan kandidat efek; perilakunya belum terverifikasi.

### Hal yang harus diverifikasi saat rekreasi

- Tampilan sampul sebelum dibuka dan perubahan sesudah tombol ditekan.
- Ukuran teks, ornamen, spacing, serta perilaku scroll di mobile dan desktop.
- Gerakan animasi, fokus keyboard, serta pengaturan reduced motion.
- Waktu mulai musik setelah interaksi pengguna dan kontrol jedanya.
- Ketersediaan font, SVG, dan musik: folder simpanan berisi CSS/JS, tetapi referensi aset eksternal belum terbukti tersedia lokal.

Gunakan file simpanan sebagai bahan analisis. Jangan menjalankan ulang backend, analitik, atau formulir referensi. Implementasikan aplikasi sendiri; tentukan aset yang boleh digunakan atau buat penggantinya sebelum rilis.

## 3. Batas versi pertama

### Termasuk dalam rencana

- Satu desain undangan responsif dalam satu halaman yang bisa di-scroll.
- Login admin, pengelolaan konten, preview, dan publikasi.
- Impor CSV untuk mengganti daftar tamu aktif, ekspor CSV, serta halaman daftar dengan salin tautan individual.
- RSVP hadir/tidak hadir oleh tamu dan ringkasannya untuk admin.
- Foto pasangan di bagian depan, foto calon pengantin pria (CPP), foto calon pengantin wanita (CPW), dan galeri beberapa foto dalam grid.
- Admin mengunggah, mengganti, melepas foto dari bagian undangan, dan mengatur urutan foto galeri.
- Musik latar yang diunggah/diganti admin, dengan kontrol putar/jeda.
- Peta eksternal dan unduhan acara kalender.

### Tidak termasuk

- Banyak wedding, banyak admin, registrasi publik, billing, atau marketplace template.
- Drag-and-drop page builder, pengubahan CSS dari CMS, dan editor HTML bebas.
- Plus-one, undangan keluarga, pengaturan kursi, dan QR check-in.
- Buku ucapan publik, hadiah digital/rekening, serta cerita pasangan pada versi pertama.
- Pengiriman WhatsApp/email otomatis, impor Excel (.xlsx), dan pelacakan dibaca/dikirim.
- Form tambah/edit tamu satu per satu; pengelolaan daftar melalui CSV.
- Perubahan RSVP oleh admin, slider galeri, dan perbesar foto/lightbox.
- OTP tamu, password individual, serta analitik pengunjung.

Tidak perlu menambahkan fitur di luar daftar hanya karena ditemukan dalam bundle referensi.

## 4. Peta halaman dan URL

| URL | Pengguna | Perilaku |
| --- | --- | --- |
| `/` | Publik | Halaman singkat pernikahan tanpa daftar tamu atau kemampuan RSVP; isi final menyusul |
| `/<slug-tamu>` | Tamu | Undangan terpersonalisasi untuk satu tamu aktif |
| `/admin/login` | Admin | Form login |
| `/admin` | Admin | Ringkasan tamu dan RSVP |
| `/admin/content` | Admin | Form konten dan status publikasi |
| `/admin/guests` | Admin | Upload CSV pengganti, daftar, pencarian/filter, unduh CSV, dan salin URL per tamu |
| `/admin/preview` | Admin | Preview draf memakai komponen undangan yang sama dengan halaman tamu |
| `/api/*` | Sistem | Endpoint aplikasi; bukan slug tamu |

Semua halaman admin selain login memerlukan sesi. Preview hanya dapat diakses admin dan tidak mengubah jawaban tamu asli. Endpoint yang membaca draf atau data pengelolaan juga wajib memeriksa sesi.

### Aturan slug tamu

- Contoh: Budi Santoso menjadi `/budi-santoso`.
- Simpan nama tampilan terpisah dari slug dan ID internal.
- Otomatis: huruf kecil, normalisasi diakritik, spasi menjadi tanda hubung, buang karakter di luar `a-z`, `0-9`, dan `-`, lalu rapikan tanda hubung berulang/di tepi.
- Jika hasil kosong, tolak baris dengan pesan agar admin mengisi slug valid di CSV.
- Batas usulan: 80 karakter; sediakan ruang untuk akhiran saat menangani duplikasi.
- Nama sama menggunakan akhiran angka: `/budi-santoso-2`, kemudian `-3` jika dibutuhkan.
- Slug yang sudah tersimpan menjadi penanda tetap saat impor ulang. Perubahan nama melalui CSV tidak mengubah slug, ID tamu, atau RSVP.
- Admin mempertahankan slug tamu lama di CSV hasil unduhan. Mengganti slug bukan cara mengganti nama dan tidak menyediakan migrasi identitas atau redirect URL pada versi pertama.
- Slug harus unik di database. Tangani konflik saat penyimpanan, termasuk dua permintaan bersamaan.
- Cadangkan `admin`, `api`, `assets`, `_astro`, `_image`, `login`, `logout`, `preview`, `favicon.ico`, `robots.txt`, `sitemap.xml`, serta seluruh path statis/framework yang digunakan saat implementasi.
- Validasi yang sama berlaku di impor CSV, server, dan generator URL.
- Slug tidak valid, tidak ditemukan, atau tamu nonaktif menghasilkan halaman generik yang sama tanpa data tamu.
- Bangun tautan dari domain aplikasi yang dikonfigurasi, bukan langsung dari header host permintaan.

## 5. Alur admin

### Login

1. Admin masuk melalui `/admin/login`.
2. Server memvalidasi kredensial dan membuat sesi aman.
3. Sesi kedaluwarsa sesuai konfigurasi; logout mencabut sesi.
4. Tidak ada halaman pendaftaran atau endpoint pembuatan admin publik.

### Konten dan publikasi

1. Admin mengedit form terstruktur, bukan HTML bebas.
2. Simpan memperbarui draf saja, dengan pesan berhasil/gagal yang jelas.
3. Preview menampilkan draf dan nama penerima contoh.
4. Publikasikan memvalidasi seluruh konten wajib lalu mengganti snapshot publik secara atomik.
5. Tamu tetap melihat snapshot publik sebelumnya selama draf diedit.
6. Jika simpan/publikasi gagal, konten publik yang sudah ada tetap utuh dan input admin tidak hilang.
7. Sebelum publikasi pertama, halaman tamu menampilkan pemberitahuan undangan belum tersedia.

Field konten:

| Bagian | Field |
| --- | --- |
| Sampul | Judul, nama panggilan pasangan, tanggal tampilan, sapaan, foto pasangan di bagian depan |
| Mempelai | Nama panggilan, nama lengkap, deskripsi singkat opsional, foto CPP dan foto CPW masing-masing |
| Acara | Judul, waktu mulai/selesai, zona waktu, venue, alamat, URL peta |
| Galeri | Daftar foto berurutan dalam grid sederhana, tanpa slider atau lightbox |
| Media | Foto per bagian, teks alternatif, file musik, kontrol putar/jeda |
| Penutup | Ucapan penutup; monogram diturunkan dari inisial pasangan |

Mendukung daftar acara dengan satu form tambah/hapus sederhana agar akad dan resepsi bisa diisi bila diperlukan. Tanggal dan waktu terstruktur menjadi sumber untuk tampilan dan kalender. Jangan memasukkan tanggal kedua yang harus disinkronkan manual.

Admin mengatur foto pada bagian sampul, CPP, CPW, dan galeri dalam satu halaman scroll, bukan membuat halaman atau template baru. Foto dapat diunggah, diganti, atau dilepas dari bagian; galeri dapat diurutkan. Melepas foto dari draf tidak menghapus file yang masih digunakan publikasi. Layout dan pemotongan foto mengikuti desain referensi utama serta hasil pemeriksaan visual. Jika foto atau musik belum tersedia, layout tetap lengkap dan kontrol yang tidak diperlukan disembunyikan.

Musik dicoba mulai setelah tamu menekan Buka Undangan. Kontrol putar/jeda selalu tersedia ketika musik dipasang; penolakan autoplay atau kegagalan audio tidak menghalangi isi undangan.

### Pengelolaan tamu

1. Admin mengunggah CSV daftar tamu; upload pertama menggunakan kolom `nama` dan `slug`. Slug tamu baru boleh kosong untuk dibuat otomatis.
2. Server memvalidasi seluruh file sebelum mengubah data. Tampilkan jumlah tamu baru, tetap aktif, dinonaktifkan, dan diaktifkan kembali sebelum admin menerapkan penggantian.
3. Impor mengganti daftar aktif, bukan menambahkan daftar secara terpisah. Terapkan seluruh perubahan dalam satu transaksi; kegagalan mempertahankan daftar dan RSVP sebelumnya.
4. Baris dengan slug tamu yang sudah ada memperbarui nama dan mengaktifkan tamu tersebut, dengan ID internal, URL, dan RSVP tetap sama. Jangan mencocokkan identitas berdasarkan nama atau urutan baris saja.
5. Baris tamu baru dibuat dengan slug unik. Jika slug kosong tetapi nama sudah cocok dengan tamu tersimpan, tampilkan error yang meminta slug dari CSV hasil unduhan; jangan diam-diam membuat tamu pengganti atau menautkan RSVP berdasarkan nama.
6. Tamu lama yang tidak tercantum lagi dinonaktifkan tanpa menghapus data atau RSVP. Tautan personal dan perubahan RSVP ditolak selama tamu nonaktif.
7. Tamu nonaktif aktif kembali bila dimasukkan ke CSV berikutnya dengan slug yang sama, termasuk jawaban RSVP sebelumnya.
8. Pada halaman daftar, admin mencari nama/slug, melihat status RSVP, dan menyalin URL per tamu untuk dibagikan manual.
9. Untuk pembaruan berikutnya, unduh CSV daftar aktif lengkap, edit nama atau tambah/hapus baris, pertahankan slug tamu lama, lalu unggah kembali. Untuk mengaktifkan kembali tamu nonaktif, gunakan slug tetap yang terlihat melalui filter nonaktif.

Tolak nama kosong, slug invalid, slug berulang dalam satu file, dan CSV rusak dengan pesan baris yang jelas. File tanpa baris tamu ditolak agar upload kosong tidak menonaktifkan seluruh daftar secara tidak sengaja. Nama yang sama tetap boleh untuk tamu berbeda dengan slug berbeda. Penggantian daftar tidak boleh menimpa RSVP yang masuk bersamaan; impor hanya mengubah data tamu dan status aktifnya.

Tidak ada hard delete atau form tambah/edit tamu satu per satu pada versi pertama. Jumlah tamu aktif dan nonaktif ditampilkan terpisah. Jika daftar menjadi panjang, gunakan pagination sederhana, bukan virtualisasi tabel.

### Dashboard dan ekspor

- Jumlah tamu aktif, hadir, tidak hadir, dan belum menjawab.
- Hitungan RSVP memakai tamu aktif; data tamu nonaktif tetap dapat dilihat melalui filter.
- Unduh CSV daftar aktif lengkap dengan kolom `nama`, `slug`, `status_rsvp`, dan `waktu_jawaban_terakhir`; unduhan tetap lengkap meskipun daftar di layar sedang difilter, agar cocok untuk alur edit dan impor ulang.
- Impor hanya memakai `nama` dan `slug`. Kolom status RSVP dan waktu jawaban dari file ekspor tidak dapat mengubah jawaban tersimpan; status aktif ditentukan oleh keikutsertaan baris dalam CSV pengganti.
- Keluaran CSV harus menangani koma, kutip, baris baru, dan teks yang dapat ditafsirkan spreadsheet sebagai formula.
- Format impor/ekspor harus menjaga nama tetap sama saat file diunduh lalu diunggah kembali, termasuk pengamanan formula CSV.
- Admin tidak memiliki form atau endpoint untuk mengisi/mengubah RSVP.
- Tidak mengklaim undangan sudah dikirim, dibuka, atau dibaca karena tidak ada pelacakan tersebut.

## 6. Alur tamu dan RSVP

1. Buka `/<slug-tamu>` dan lihat nama sendiri pada sampul.
2. Tekan Buka Undangan untuk mengakses isi. Jika musik tersedia, pemutaran dicoba setelah interaksi pengguna; kegagalan audio tidak menghalangi undangan.
3. Baca profil mempelai dengan foto masing-masing, acara, galeri grid, dan penutup. Peta membuka lokasi eksternal; kalender mengunduh `.ics`.
4. Pilih hadir atau tidak hadir lalu kirim RSVP.
5. Tampilkan hasil yang sudah tersimpan dan izinkan perubahan jawaban melalui tautan yang sama.

### Aturan RSVP

- Satu tamu memiliki paling banyak satu jawaban terkini; bukan catatan baru pada setiap klik.
- Status belum menjawab berarti belum ada jawaban, bukan pilihan yang dikirim tamu.
- Satu undangan selalu mewakili satu orang; tidak ada field jumlah hadir atau plus-one.
- Nama penerima tidak dapat diubah dari formulir tamu.
- Jawaban diisi/diubah melalui tautan tamu; admin hanya melihat dan mengunduh ringkasannya, tanpa mutation RSVP admin.
- Server memvalidasi slug, tamu aktif, dan nilai jawaban setiap kali menerima perubahan.
- Gunakan ID tamu hasil pencarian server, bukan ID pilihan klien.
- Klik berulang tidak menghasilkan jawaban ganda; kegagalan jaringan tidak menampilkan sukses palsu.
- Perubahan terakhir yang berhasil disimpan menjadi jawaban berlaku.
- Tidak ada deadline RSVP pada versi awal; tambahkan hanya bila diminta.

### Batas privasi URL nama

URL nama mudah ditebak dan dapat diteruskan. Pada rancangan ini, mengetahui tautan berarti dapat melihat nama penerima serta mengirim/mengubah RSVP untuk penerima itu. Pengguna telah menerima batas ini dan memilih akses tanpa PIN/OTP. Ini bukan verifikasi identitas.

Jangan menampilkan nomor telepon, alamat pribadi tamu, daftar tamu lain, atau catatan admin. Hindari mencatat data RSVP atau nama dalam log aplikasi. Gunakan `noindex`, jangan buat sitemap tamu, dan hindari bocornya path penerima melalui referrer ke situs lain. Langkah tersebut mengurangi paparan, tetapi tidak membuat URL nama menjadi rahasia.

Jika verifikasi identitas kelak dibutuhkan, pertahankan bentuk URL dan rencanakan PIN/OTP sebagai perubahan cakupan terpisah. Jangan menambahkannya diam-diam pada versi pertama.

## 7. Struktur data minimum

| Data | Isi dan batas |
| --- | --- |
| Wedding | Satu record tetap; konten draf, snapshot publik, waktu perubahan dan publikasi |
| Guest | ID internal, nama, slug unik, status aktif, waktu dibuat/diubah |
| RSVP | Relasi unik ke Guest, nilai `attending`/`declined`, waktu dibuat/diubah |
| Media | ID, storage key, jenis file, ukuran, dimensi foto bila ada, waktu upload |
| Admin/session | Supabase Auth mengelola password dan sesi; satu user admin yang ID-nya diizinkan server |

Konten undangan boleh berupa objek JSON terstruktur karena hanya satu wedding dengan satu bentuk desain. Validasi skema di server; tidak perlu tabel untuk setiap judul/paragraf atau sistem section builder. Guest dan RSVP tetap terstruktur agar constraint, pencarian, dan ringkasan konsisten.

Relasi dan perubahan penting:

- RSVP terikat ke ID Guest; impor perubahan nama mempertahankan ID dan slug sehingga jawaban tidak hilang.
- Menonaktifkan tamu tidak menghapus RSVP.
- Impor pengganti mempertahankan ID tamu berdasarkan slug, menonaktifkan tamu yang tidak disertakan, dan mengaktifkan kembali tamu dengan slug lama. RSVP tidak dihapus atau ditulis ulang oleh impor.
- Fungsi transaksi impor menserialkan penggantian daftar agar dua upload bersamaan tidak menghasilkan daftar campuran; kegagalan tidak meninggalkan perubahan sebagian.
- Draf dan publikasi menunjuk media yang tersimpan, bukan file sementara.
- Jangan menghapus media yang masih digunakan draf atau publikasi; versi pertama boleh mempertahankan file lama sampai pembersihan manual yang aman.
- Publikasi tidak mengubah daftar tamu atau jawaban RSVP.

## 8. Arsitektur dan pilihan teknologi

Gunakan satu aplikasi dengan UI admin, UI undangan, dan endpoint server. Tidak perlu microservice, CMS eksternal, state management global, antrean pekerjaan, atau API publik terpisah.

Hosting dan database sudah dipilih: Vercel Hobby dengan custom domain, serta Supabase. Source disimpan di repository Git dan deployment dihubungkan ke Vercel. Git menyimpan kode; aplikasi berjalan di Vercel, bukan di Git.

| Komponen | Pilihan |
| --- | --- |
| Aplikasi | Astro + TypeScript dengan adapter resmi Vercel; satu proyek untuk admin, undangan, dan endpoint |
| Styling dan animasi | CSS biasa/scoped CSS Astro, transisi/keyframe, serta JavaScript kecil dengan Intersection Observer sesuai kebutuhan |
| Hosting | Vercel Hobby; tanpa server persisten atau proses background terus-menerus |
| Database | Supabase PostgreSQL; konten terstruktur menggunakan JSONB, tamu dan RSVP memakai tabel/constraint |
| Autentikasi | Supabase Auth email/password untuk satu admin; signup publik dinonaktifkan |
| Media | Supabase Storage dengan bucket privat dan akses terkontrol |
| Source control | Satu repository GitHub pribadi privat; akun dan URL repo menyusul |
| Migrasi | File SQL berversi dalam `supabase/migrations/`; bukan perubahan manual dashboard tanpa catatan |

Halaman undangan personal, admin, preview, dan endpoint mutation memakai rendering sesuai permintaan di server. Halaman generik dan aset yang tidak personal dapat statis. Publish membaca snapshot database terbaru tanpa menunggu build/deploy ulang. Renderer Astro yang sama digunakan untuk tamu dan preview.

Mulai dengan HTML/CSS dan JavaScript seperlunya; tidak perlu React atau library animasi besar untuk efek sampul/reveal dasar. Astro dipilih untuk mengurangi JavaScript browser, bukan sebagai jaminan bebas kuota. Optimasi foto, ukuran musik, dan jumlah request server tetap harus diperiksa.

Tidak memakai SQLite, file lokal sebagai penyimpanan permanen, atau CMS tambahan. Verifikasi dokumentasi dan versi Astro, adapter Vercel, serta Supabase SDK saat scaffold dibuat. Rujukan: [Astro di Vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/) dan [rendering sesuai permintaan](https://docs.astro.build/en/guides/on-demand-rendering/).

### Akses Supabase

- Browser tamu mengakses endpoint aplikasi untuk undangan dan RSVP, bukan query bebas ke tabel guest.
- Server mengembalikan hanya snapshot publik dan nama tamu yang diminta; tidak mengirim seluruh record database.
- Aktifkan RLS dan grants minimum pada tabel yang terekspos Data API. Jangan memberi akses SELECT seluruh tamu atau UPDATE RSVP kepada role anon.
- Endpoint server tamu memakai kredensial server dengan validasi dan proyeksi respons ketat. Secret/service-role key dapat melewati RLS: jangan pernah memasukkannya ke bundle browser, log, atau Git.
- Jalur admin memvalidasi sesi Supabase di server sekaligus mencocokkan user ID dengan satu admin yang diizinkan. Status authenticated saja tidak cukup.
- Jika akses database/storage memakai sesi admin, policy juga membatasi user ID admin tersebut. Endpoint yang memakai kredensial istimewa tetap memeriksa izin sendiri.
- Gunakan SDK Supabase lewat HTTP; tidak perlu ORM atau koneksi PostgreSQL persisten. Operasi publikasi dan penggantian daftar CSV yang membutuhkan transaksi memakai fungsi SQL terbatas dengan hak eksekusi yang sesuai.
- Nonaktifkan pendaftaran publik dan siapkan admin melalui prosedur provisioning terkontrol. Dokumentasikan pemulihan akses tanpa menambah sistem auth sendiri.

### Upload dan akses media

- File upload langsung dari browser admin ke Supabase Storage dengan policy admin atau signed upload yang singkat; jangan melewatkan file besar melalui Vercel Function.
- Vercel membatasi payload function hingga 4,5 MB. Endpoint aplikasi cukup menangani metadata/otorisasi; lihat [batas Vercel Functions](https://vercel.com/docs/functions/limitations).
- Upload masuk sebagai objek belum diterbitkan. Server memeriksa ukuran dan isi file melalui pembacaan terbatas sebelum mereferensikannya sebagai media valid; jangan percaya metadata upload saja.
- Bucket privat menjaga media draf tidak terbuka lewat URL publik. Preview admin dan undangan publik mendapatkan signed read URL hanya untuk media yang boleh dilihat, dengan umur yang sesuai serta penanganan saat kedaluwarsa.
- Media yang muncul dalam undangan dapat disalin penerima; signed URL bukan DRM. Jangan menyimpan berkas pribadi yang tidak perlu ditampilkan.
- Kompres foto sebelum upload dan hindari ketergantungan pada image transformation berbayar. Evaluasi resumable upload jika ukuran musik memerlukannya.
- Rujukan: [upload Supabase](https://supabase.com/docs/guides/storage/uploads/standard-uploads) dan [RLS Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).

### Git, environment, dan deployment

1. GitHub pribadi privat sudah dipilih. Tentukan akun pemilik dan URL repo sebelum membuat atau push repo; detail domain yang sudah dimiliki menyusul saat persiapan deployment.
2. Commit source, lockfile, migrasi, pengujian, `plan.md`, README, dan `.env.example` berisi nama variabel tanpa nilai rahasia.
3. Abaikan `.env*` selain `.env.example`, `.vercel/`, build output, backup, file tamu, dan upload asli. Data tamu/aset pernikahan tidak masuk Git.
4. Hubungkan repo ke Vercel; gunakan `main` untuk production dan branch/PR untuk Preview Deployment. Tidak perlu pipeline CI tambahan pada versi awal jika pemeriksaan dan build yang sama sudah berjalan sebelum deploy.
5. Repo personal direkomendasikan karena Vercel Hobby memiliki pembatasan repo organisasi dan pemilik commit. Verifikasi pemilik repo/commit sesuai akun Hobby sebelum mengaktifkan integrasi; jangan mengubah identitas commit untuk mengakali pembatasan.
6. Pisahkan environment Development, Preview, dan Production. Gunakan Supabase lokal untuk development serta project nonproduksi terpisah untuk preview bila kuota memungkinkan. Preview tidak boleh mendapat kredensial atau akses data produksi; jika belum tersedia, gunakan fixture nonpribadi dan nonaktifkan mutation preview.
7. Konfigurasi minimal: URL Supabase, publishable key yang memang aman untuk klien, secret key server, ID admin yang diizinkan, serta URL kanonis aplikasi. Gunakan nama/key SDK yang berlaku saat implementasi.
8. Terapkan migrasi secara terkontrol sebelum kode yang membutuhkannya dirilis; jangan menjalankan migrasi atau seed produksi di setiap preview/build. Utamakan migrasi kompatibel dengan versi aplikasi sebelumnya.
9. Hubungkan domain ke proyek Vercel, ikuti DNS record yang diberikan dashboard, pilih domain kanonis, lalu periksa HTTPS dan tautan undangan. Domain tidak perlu dibeli melalui Vercel; biaya registrasi/perpanjangannya terpisah.
10. Konfigurasi site URL dan redirect Auth sesuai domain produksi serta development/preview yang benar-benar diperlukan. Jangan memakai wildcard luas tanpa kebutuhan.
11. Jalankan smoke test pada domain final: login, preview/publish, impor CSV, salin URL satu tamu fiktif, RSVP, ekspor/impor ulang, media, peta, dan kalender.
12. Rollback deployment mengembalikan kode, bukan database atau media; siapkan backup dan rencana pemulihan data secara terpisah.

Rujukan: [integrasi Git Vercel](https://vercel.com/docs/git), [batas Vercel](https://vercel.com/docs/limits), dan [custom domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

### Batas free tier dan operasi

- Vercel Hobby ditujukan untuk penggunaan pribadi/nonkomersial. Pernikahan sendiri sesuai arah proyek; jika berubah menjadi jasa undangan, tinjau ulang paketnya. Rujukan: [Vercel Hobby](https://vercel.com/docs/plans/hobby).
- Supabase Free dapat dijeda setelah aktivitas rendah selama tujuh hari. Periksa status sebelum undangan disebarkan dan menjelang acara; dokumentasikan cara resume dan tampilkan error sementara yang jelas bila database tidak tersedia. Jangan mengasumsikan aplikasi selalu aktif atau menambahkan cron keep-alive sebagai jaminan.
- Pantau kapasitas database, storage, bandwidth media, dan penggunaan function. Musik berulang per pengunjung dapat mendominasi bandwidth; batasi ukuran dan jangan memuat audio sebelum diperlukan.
- Angka kuota dapat berubah; cek dashboard dan [pricing Supabase](https://supabase.com/pricing) sebelum rilis. Tidak perlu merancang sistem kuota internal.
- Jangan mengandalkan backup otomatis paket berbayar: buat dump database dan salinan objek Storage ke lokasi terpisah yang terlindungi. Backup database saja tidak mencakup isi file Storage; uji restore keduanya.
- Rujukan: [project pausing](https://supabase.com/docs/guides/platform/free-project-pausing) dan [backup Supabase](https://supabase.com/docs/guides/platform/backups).

### Batas modul dan cakupan perubahan nanti

- Renderer undangan bersama untuk halaman tamu dan preview admin.
- Form admin untuk konten, upload CSV daftar tamu, dan publikasi; daftar tamu untuk melihat data serta menyalin tautan.
- Validasi konten dan slug yang dipakai seluruh penulis data.
- Layanan/query kecil untuk wedding, guest, RSVP, dan media.
- Pemeriksaan sesi pada setiap operasi admin.
- Migrasi database, data contoh, konfigurasi environment, dan dokumentasi operasi.
- Pengujian pada logika dan batas akses yang berisiko.

Saat implementasi, perubahan skema atau format konten harus menjangkau form, renderer, endpoint, migrasi, data contoh, dan pengujiannya. Tidak ada caller aplikasi lama yang perlu dijaga saat ini karena direktori proyek belum memiliki kode aplikasi.

## 9. Validasi, keamanan, dan aksesibilitas

### Server dan data

- Validasi semua mutation di server, termasuk enum RSVP, panjang nama/slug, tanggal, dan URL.
- Parser CSV memvalidasi header, encoding, ukuran, jumlah baris, nilai per kolom, dan duplikasi sebelum transaksi. Terapkan batas operasional sesuai kebutuhan sekitar 200 tamu dan lingkungan hosting; jangan menerima file tanpa batas.
- URL peta hanya memakai protokol yang diizinkan; jangan mengambil URL arbitrer dari server.
- Escape konten teks; jangan menerima script atau HTML bebas melalui CMS.
- Lindungi operasi admin dan perubahan RSVP dari CSRF sesuai pola framework; gunakan cookie sesi `HttpOnly`, `Secure` di produksi, dan kebijakan `SameSite` yang tepat.
- Batasi percobaan login dan frekuensi perubahan RSVP/upload; jangan memblokir tamu normal yang berbagi jaringan secara agresif.
- Rahasia disimpan di environment server; jangan masuk ke bundle klien, repository, atau log.
- Halaman personal, preview, data admin, dan RSVP tidak boleh tersaji kepada pengguna lain melalui shared cache. Aset generik dapat di-cache terpisah.
- Gunakan pesan kesalahan yang berguna tanpa menampilkan stack trace atau detail database.

### Upload

- Hanya admin boleh upload.
- Validasi ukuran, tipe isi, dan format file; jangan percaya ekstensi/MIME dari klien saja.
- Batas awal usulan: JPEG/PNG/WebP hingga 10 MB per foto, MP3 hingga 20 MB, dikirim langsung ke Supabase Storage; konfirmasikan terhadap konfigurasi bucket dan total kuota sebelum implementasi.
- Jangan izinkan HTML, SVG upload, atau executable pada versi pertama.
- Gunakan nama/storage key buatan server untuk mencegah path traversal dan penimpaan file.
- Jangan memasukkan foto asli berukuran besar langsung ke halaman tamu; sediakan ukuran tampilan yang sesuai dan hilangkan metadata lokasi bila ada.
- Gagal upload tidak boleh mengganti referensi media lama; tampilkan error dan pertahankan perubahan form.

### Aksesibilitas dan kinerja

- Layout nyaman mulai lebar 320 px, tanpa scroll horizontal.
- Tombol dan form dapat dioperasikan keyboard, memiliki label, fokus terlihat, dan pesan status yang terbaca pembaca layar.
- Sesudah Buka Undangan, fokus berpindah ke konten dengan benar.
- Animasi mengikuti `prefers-reduced-motion`; isi tidak boleh tetap tersembunyi bila efek gagal.
- Musik memiliki kontrol jelas dan tidak diasumsikan boleh autoplay sebelum interaksi.
- Jaga kontras teks dan tombol, termasuk aksen merah muda di atas latar hijau.
- Gambar memakai dimensi tetap untuk mengurangi pergeseran layout; media di bawah layar dapat dimuat bertahap.
- Undangan tidak mengunduh kode admin. Hindari font, tracker, dan request eksternal yang tidak perlu.

## 10. Tahapan implementasi dan hasil yang diperiksa

### Tahap 0 — Lengkapi spesifikasi referensi

- Inspeksi visual mobile/desktop dan interaksi jika browser tersedia.
- Inventarisasi hanya font, ornamen, CSS relevan, dan media yang benar-benar dipakai tema ini.
- Pisahkan aset tersedia, aset eksternal, dan aset yang perlu diganti.
- Gunakan keputusan Astro + TypeScript dan Supabase Auth/Storage yang sudah disetujui; periksa versi dan kompatibilitas adapter Vercel sebelum scaffold.
- Verifikasi komposisi foto depan, foto CPP/CPW, galeri grid, dan animasi yang melengkapi acuan utama. Periksa kode/lisensi referensi tambahan jika akan memakai ulang bagian tertentu.

Selesai jika desain acuan dan batas fitur jelas, serta keterbatasan bukti tercatat tanpa mengarang perilaku referensi.

### Tahap 1 — Undangan dengan data contoh

- Bangun sampul dengan foto pasangan, profil dengan foto CPP/CPW, acara, galeri grid, penutup, kontrol audio, peta, dan kalender.
- Implementasikan satu renderer responsif dengan token warna/font yang teridentifikasi.
- Tambahkan slot RSVP sesuai desain kita, tanpa mengklaimnya bagian referensi.

Selesai jika tampilan mendekati acuan pada mobile/desktop dan interaksi dasar dapat digunakan dengan keyboard serta reduced motion.

### Tahap 2 — Penyimpanan, login, dan CMS

- Buat migrasi, konfigurasi admin awal, sesi, dan kontrol akses.
- Buat form konten, upload foto per bagian, pengaturan urutan galeri, upload musik, draf, preview, dan publikasi atomik.
- Pastikan halaman tamu hanya membaca publikasi, sedangkan preview membaca draf.

Selesai jika admin dapat mengubah konten tanpa mengedit kode, dan tamu tidak dapat mengakses draf atau operasi pengelolaan.

### Tahap 3 — Tamu dan URL individual

- Buat impor CSV pengganti atomik dan halaman daftar tamu; tanpa form CRUD individual.
- Implementasikan generator/validasi slug, constraint unik, pencarian, dan salin URL.
- Pertahankan identitas/URL/RSVP berdasarkan slug; nonaktifkan tamu yang hilang dari file dan aktifkan kembali slug lama yang dimasukkan lagi.
- Hubungkan `/<slug>` ke nama penerima; tangani slug invalid dan tamu nonaktif.

Selesai jika nama duplikat tertangani, impor gagal tidak mengubah daftar, penggantian daftar mempertahankan URL/RSVP yang sesuai, dan tamu hanya menerima data undangannya sendiri.

### Tahap 4 — RSVP, ringkasan, dan CSV

- Simpan/update satu jawaban per tamu secara konsisten.
- Tampilkan loading, sukses, kegagalan, dan jawaban saat ini.
- Tambahkan ringkasan dan unduh CSV daftar aktif lengkap beserta RSVP; pastikan file dapat diedit lalu diimpor ulang tanpa mengubah identitas atau jawaban tamu.

Selesai jika perubahan RSVP tidak menambah duplikasi, hitungan cocok dengan database, dan CSV aman dibuka di spreadsheet.

### Tahap 5 — Pemeriksaan rilis

- Masukkan konten final; hapus data contoh dari produksi.
- Periksa visual, akses, validasi, error, dan jaringan lambat.
- Hubungkan Git ke Vercel Hobby, pisahkan environment, lalu siapkan custom domain/HTTPS, Supabase produksi, migrasi, backup, restore, dan dokumentasi.
- Uji satu alur lengkap dari admin mengimpor daftar, menyalin URL, tamu mengisi RSVP, sampai CSV diperbarui tanpa kehilangan jawaban.
- Targetkan undangan siap dibagikan pertengahan hingga akhir November 2026; tentukan tanggal rilis pasti saat konten dan kesiapan pemeriksaan sudah jelas.

Selesai jika seluruh kriteria penerimaan terpenuhi dan keterbatasan yang tersisa dicatat. Publikasi/deployment bukan bagian dari penulisan rencana ini.

## 11. Pengujian minimum yang bermakna

| Area | Skenario utama |
| --- | --- |
| Slug | Spasi, diakritik, tanda baca, hasil kosong, batas panjang, duplikasi, kata cadangan, konflik bersamaan |
| Tamu | Nama berubah melalui CSV tetapi slug/ID/RSVP tetap; nama kembar tidak tertukar; nonaktif menolak baca dan RSVP |
| Admin | Tanpa sesi tidak dapat membaca draf, upload, ekspor, atau menjalankan mutation; logout mencabut akses |
| Publikasi | Simpan draf tidak mengubah tampilan tamu; gagal publish mempertahankan snapshot sebelumnya |
| RSVP | Pertama kali, ubah jawaban, klik ganda, nilai tidak valid, request palsu, jaringan gagal |
| Privasi | Respons tamu tidak mengandung daftar tamu/catatan internal; cache tidak menukar penerima atau draf |
| Media | File terlalu besar/salah jenis ditolak; gagal upload mempertahankan media lama; file publik tidak terhapus karena perubahan draf |
| Kalender | Zona waktu, tanggal lintas hari, serta karakter khusus judul/alamat menghasilkan `.ics` valid |
| CSV | Koma, kutip, newline, BOM/encoding, formula, header invalid, file kosong/rusak/terlalu besar, slug duplikat; ekspor-impor menjaga nama; kolom RSVP tidak bisa menimpa jawaban |
| Penggantian daftar | Tamu hilang menjadi nonaktif, slug lama aktif kembali dengan RSVP utuh; urutan baris berubah; error transaksi dan dua impor bersamaan; RSVP yang masuk selama impor tetap tersimpan |
| Visual | Mobile kecil, desktop, nama panjang, tanpa foto/musik, keyboard, reduced motion |
| Pemulihan | Backup database dan media dapat dipulihkan bersama tanpa kehilangan relasi |
| Supabase | Policy anon tidak dapat membaca daftar tamu/draf; user authenticated selain admin ditolak; key server tidak ada di bundle |
| Deployment | Preview tidak mengakses produksi; migrasi tidak dijalankan oleh preview; custom domain menghasilkan tautan tamu yang benar |
| Free tier | Database tidak tersedia atau upload ditolak kuota menghasilkan error jelas tanpa kehilangan input/data lama |

Prioritaskan unit/integration test pada slug, impor pengganti, publikasi, RSVP, dan kontrol akses; satu alur end-to-end utama cukup sebagai awal. Jangan menulis snapshot test untuk setiap paragraf atau pengujian yang sekadar menyalin implementasi.

## 12. Data contoh dan operasi

- Gunakan pasangan dan tamu fiktif; jangan menyalin daftar tamu atau data pribadi referensi.
- Siapkan contoh nama pendek, panjang, duplikat, tamu nonaktif, dan ketiga status RSVP; fixture CSV upload pertama serta pengganti dengan urutan baris berbeda, perubahan nama, penghilangan, dan pengaktifan kembali tamu.
- Dokumentasikan format `nama,slug`, slug kosong hanya untuk tamu baru, alur unduh/edit/upload, dan dampak penggantian daftar aktif. Berkas berisi tamu nyata tetap di luar Git.
- Dokumentasikan cara menyiapkan admin, environment, migrasi, preview lokal, dan menjalankan pengujian.
- Backup Supabase harus mencakup dump database dan objek Storage secara terpisah; tetapkan jadwal/retensi dan lokasi aman sebelum rilis, dengan salinan terbaru sebelum perubahan produksi penting.
- Jangan menjalankan reset/seed destruktif terhadap produksi.
- Ekspor CSV membantu pengelolaan, tetapi bukan pengganti backup aplikasi.

## 13. Kriteria penerimaan versi pertama

- [ ] Satu admin dapat login dan logout; akses pengelolaan dilindungi di server.
- [ ] Konten dapat disimpan sebagai draf, dipreview, dan dipublikasikan.
- [ ] Nama, acara, foto depan, foto CPP/CPW, galeri grid beserta urutannya, musik, dan penutup dapat dikelola tanpa perubahan kode.
- [ ] Desain undangan mengikuti karakter referensi pada mobile dan desktop.
- [ ] URL tamu berbentuk `/<nama-tamu>`, bukan query parameter atau token acak.
- [ ] Nama duplikat menghasilkan slug unik; perubahan nama tidak mengubah URL otomatis.
- [ ] Admin mengunggah CSV pengganti, melihat daftar, menyalin URL per tamu, dan mengunduh CSV daftar aktif lengkap untuk diedit/impor ulang.
- [ ] Impor mempertahankan ID/URL/RSVP berdasarkan slug; tamu yang hilang nonaktif dan tamu dengan slug lama dapat aktif kembali dengan riwayat utuh.
- [ ] Impor invalid atau gagal tidak mengubah daftar; dua impor dan RSVP bersamaan tidak menghasilkan kehilangan jawaban atau daftar campuran.
- [ ] Nama penerima sesuai tautan dan tidak dapat diubah oleh tamu.
- [ ] Peta, kalender, dan kontrol musik berfungsi ketika kontennya tersedia.
- [ ] RSVP mewakili satu orang, tersimpan, dan dapat diperbarui.
- [ ] Admin hanya melihat/mengunduh RSVP; tidak ada fitur admin atau kolom CSV yang dapat menimpa jawaban tamu.
- [ ] Tamu nonaktif tidak dapat membuka undangan personal atau memperbarui RSVP.
- [ ] Dashboard dan ekspor sesuai data; tidak ada klaim pelacakan kirim/baca.
- [ ] Draf, sesi admin, dan daftar tamu tidak bocor melalui respons publik atau cache.
- [ ] Validasi, aksesibilitas utama, penanganan error, dan pengujian risiko sudah diperiksa.
- [ ] Backup dan pemulihan sudah dicoba sebelum rilis.
- [ ] Repository Git terhubung ke Vercel Hobby dan production berjalan di custom domain melalui HTTPS.
- [ ] Environment preview terisolasi, RLS/grants diuji, dan tidak ada rahasia atau data tamu di Git.
- [ ] Prosedur resume Supabase serta pengecekan kuota dan status menjelang acara terdokumentasi.

## 14. Yang masih perlu diputuskan

Tidak perlu menunggu konten final untuk menyelesaikan desain dan alur aplikasi.

1. Detail domain yang sudah dimiliki dan akun pemilik/URL repository GitHub; keduanya sengaja ditunda sampai persiapan integrasi/deployment.
2. Konten/aset final dan hak penggunaannya, sebelum publikasi.
3. Detail perilaku referensi yang belum bisa diverifikasi melalui browser, termasuk ukuran/crop foto dan gerakan animasi akhir.
4. Tanggal rilis pasti dalam target pertengahan hingga akhir November 2026, serta konfigurasi operasional upload/kuota setelah lingkungan tersedia.

Keputusan fitur, akses melalui tautan saja, format/alur CSV, acuan visual utama dan tambahan, serta Astro + TypeScript + Supabase sudah disepakati. Tidak perlu meminta konfirmasi ulang atas keputusan tersebut.

Risiko yang sudah diketahui: URL berbasis nama bukan autentikasi tamu; aset simpanan belum lengkap; tampilan/interaksi belum diverifikasi secara visual. Jangan menandai implementasi, pengujian, atau fidelity selesai hanya berdasarkan dokumen ini.
