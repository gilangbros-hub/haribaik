# HariBahagia — Undangan Pernikahan Individual dan Pengelolaan Admin

Status: ready-for-agent
Tanggal: 22 Oktober 2026
Dasar: keputusan percakapan yang telah dikonfirmasi dan rencana proyek yang sudah diperbarui.
Pendekatan pengujian: disetujui pengguna; endpoint aplikasi dengan database pengujian, satu alur browser lengkap, serta pemeriksaan visual dan aksesibilitas.

## Problem Statement

Pengelola satu pernikahan membutuhkan undangan digital untuk sekitar 200 tamu individual. Setiap tamu harus menerima tautan dengan nama sendiri, melihat detail acara serta foto pasangan, dan menjawab hadir atau tidak hadir. Pengelola perlu mengubah konten, foto, dan musik tanpa mengedit kode, serta mengganti daftar tamu dari CSV tanpa merusak tautan yang sudah dibagikan atau kehilangan jawaban RSVP.

Undangan harus nyaman dibuka lewat ponsel, memiliki animasi yang halus, dan mengikuti karakter visual Sheilly & Dhanar. Pengembangan menargetkan undangan siap dibagikan pertengahan hingga akhir November 2026 dengan Vercel Hobby dan Supabase free tier sebagai sasaran operasional.

## Solution

Bangun satu aplikasi Astro + TypeScript dengan dua sisi: satu halaman undangan yang bisa di-scroll untuk tamu dan pengelolaan yang dilindungi login untuk satu admin. Undangan memuat sampul dengan foto pasangan dan nama penerima, profil CPP/CPW beserta foto masing-masing, detail acara, galeri grid, RSVP, dan penutup. Musik mulai dicoba sesudah Buka Undangan dan memiliki kontrol putar/jeda.

Admin menyimpan konten sebagai draf, memeriksanya lewat preview, dan menerbitkannya lewat Publish. Tamu selalu melihat konten publik terakhir yang berhasil diterbitkan. Daftar tamu dikelola melalui upload CSV pengganti, dengan halaman untuk melihat RSVP, mengunduh daftar, dan menyalin tautan setiap tamu. Slug menjadi penanda tetap saat impor ulang: tamu yang tetap terdaftar mempertahankan ID, URL, dan RSVP; tamu yang hilang dinonaktifkan dengan riwayat tetap tersimpan.

## User Stories

1. Sebagai tamu, saya ingin menerima tautan berbentuk nama saya agar undangan terasa personal dan mudah dibuka.
2. Sebagai tamu, saya ingin melihat nama penerima pada sampul agar tahu undangan ditujukan kepada saya.
3. Sebagai tamu, saya ingin membuka undangan melalui tombol Buka Undangan agar dapat mulai membaca isi dan mengaktifkan musik melalui interaksi saya.
4. Sebagai tamu, saya ingin membaca undangan dalam satu halaman scroll agar tidak perlu berpindah halaman untuk melihat informasi acara.
5. Sebagai tamu, saya ingin melihat foto pasangan di bagian depan agar dapat mengenali pasangan yang mengundang saya.
6. Sebagai tamu, saya ingin melihat profil dan foto CPP serta CPW agar mengenal kedua mempelai.
7. Sebagai tamu, saya ingin melihat beberapa foto pasangan dalam grid sederhana agar dapat menikmati galeri tanpa kontrol tambahan.
8. Sebagai tamu, saya ingin melihat nama acara, tanggal, waktu, zona waktu, venue, dan alamat agar dapat merencanakan kehadiran.
9. Sebagai tamu, saya ingin membuka tautan peta agar dapat mencari lokasi acara.
10. Sebagai tamu, saya ingin mengunduh acara kalender agar dapat menyimpan jadwal yang sesuai.
11. Sebagai tamu, saya ingin memutar atau menjeda musik agar dapat mengatur pengalaman membaca undangan.
12. Sebagai tamu, saya ingin tetap membaca undangan saat audio gagal diputar agar masalah musik tidak menghalangi informasi acara.
13. Sebagai tamu, saya ingin menjawab hadir atau tidak hadir agar pengelola mengetahui rencana kehadiran saya.
14. Sebagai tamu, saya ingin melihat jawaban yang sudah tersimpan dan memperbaruinya lewat tautan yang sama agar perubahan rencana tercatat.
15. Sebagai tamu, saya ingin melihat proses pengiriman, keberhasilan, dan kegagalan RSVP agar tahu apakah jawaban benar-benar tersimpan.
16. Sebagai tamu, saya ingin klik berulang tidak menggandakan jawaban agar status kehadiran saya tetap konsisten.
17. Sebagai tamu, saya ingin membuka tautan tanpa PIN atau pendaftaran agar prosesnya singkat.
18. Sebagai tamu, saya ingin data tamu lain dan catatan pengelolaan tidak tampil pada undangan saya agar privasi daftar tamu terjaga.
19. Sebagai tamu pengguna ponsel, saya ingin tampilan tetap terbaca mulai lebar 320 px agar undangan nyaman digunakan di layar kecil.
20. Sebagai tamu pengguna keyboard atau pembaca layar, saya ingin navigasi, fokus, label, dan pesan status dapat diakses agar dapat membaca undangan serta mengirim RSVP.
21. Sebagai tamu yang mengurangi animasi, saya ingin preferensi reduced motion dihormati agar konten nyaman dibaca dan tidak tersembunyi.
22. Sebagai admin, saya ingin login dan logout agar pengelolaan hanya dapat diakses oleh akun yang diizinkan.
23. Sebagai admin, saya ingin mengedit teks pasangan, acara, dan penutup lewat form agar tidak perlu mengubah kode.
24. Sebagai admin, saya ingin mengelola daftar acara agar akad dan resepsi dapat ditampilkan bila diperlukan.
25. Sebagai admin, saya ingin mengunggah, mengganti, dan melepas foto per bagian agar sampul serta profil CPP/CPW menggunakan foto yang tepat.
26. Sebagai admin, saya ingin menambah, melepas, dan mengurutkan foto galeri agar susunannya sesuai keinginan.
27. Sebagai admin, saya ingin mengisi teks alternatif foto agar informasi visual tetap dapat dipahami pengguna pembaca layar.
28. Sebagai admin, saya ingin mengunggah atau mengganti musik agar undangan menggunakan lagu yang saya pilih.
29. Sebagai admin, saya ingin menyimpan perubahan sebagai draf agar tamu tidak melihat pekerjaan yang belum selesai.
30. Sebagai admin, saya ingin preview dengan penerima contoh agar dapat memeriksa draf tanpa mengubah RSVP tamu asli.
31. Sebagai admin, saya ingin menerbitkan konten melalui Publish agar perubahan tampil ke tamu hanya setelah siap.
32. Sebagai admin, saya ingin kegagalan simpan, upload, atau Publish mempertahankan input dan publikasi sebelumnya agar pekerjaan serta konten yang sudah dibagikan tidak hilang.
33. Sebagai admin, saya ingin mengunggah CSV nama dan slug agar daftar sekitar 200 tamu dapat dikelola sekaligus.
34. Sebagai admin, saya ingin slug tamu baru dapat dibuat dari nama dan nama kembar mendapat URL unik agar setiap orang memiliki tautan sendiri.
35. Sebagai admin, saya ingin mengetahui baris CSV yang salah dan dampak penggantian sebelum diterapkan agar dapat memperbaiki file sebelum daftar berubah.
36. Sebagai admin, saya ingin CSV baru mengganti daftar aktif secara utuh agar daftar aplikasi sesuai daftar terbaru saya.
37. Sebagai admin, saya ingin tamu yang tetap ada mempertahankan URL dan RSVP saat nama atau urutan baris berubah agar undangan yang sudah dibagikan tetap berlaku.
38. Sebagai admin, saya ingin tamu yang hilang dari CSV dinonaktifkan tanpa dihapus agar aksesnya berhenti dan riwayat tetap tersedia.
39. Sebagai admin, saya ingin mengaktifkan kembali tamu melalui slug lamanya agar URL dan jawaban sebelumnya kembali digunakan.
40. Sebagai admin, saya ingin mencari nama/slug dan memfilter status tamu agar mudah menemukan penerima tertentu.
41. Sebagai admin, saya ingin menyalin URL setiap tamu agar dapat membagikannya secara manual.
42. Sebagai admin, saya ingin melihat jumlah tamu aktif, hadir, tidak hadir, dan belum menjawab agar mengetahui perkembangan RSVP.
43. Sebagai admin, saya ingin melihat tamu nonaktif melalui filter terpisah agar dapat memeriksa riwayat tanpa memasukkannya ke hitungan aktif.
44. Sebagai admin, saya ingin mengunduh daftar aktif lengkap beserta slug dan status RSVP agar dapat menyimpan laporan dan memperbarui daftar melalui CSV yang sama.
45. Sebagai admin, saya ingin file ekspor aman dibuka di spreadsheet serta dapat diimpor kembali tanpa mengubah nama agar alur pembaruan tidak merusak data.
46. Sebagai admin, saya ingin status RSVP dalam CSV tidak menimpa jawaban tamu agar impor daftar hanya mengelola identitas dan keaktifan tamu.
47. Sebagai admin, saya ingin upload gagal atau dua upload bersamaan tidak meninggalkan daftar campuran agar aplikasi memiliki satu daftar yang konsisten.
48. Sebagai pengelola, saya ingin error database atau kuota dijelaskan tanpa kehilangan input atau menampilkan sukses palsu agar dapat mengambil tindakan yang benar.
49. Sebagai pengelola, saya ingin preview dan produksi terpisah agar perubahan pengembangan tidak mengakses atau merusak data tamu nyata.
50. Sebagai pengelola, saya ingin prosedur backup, pemulihan database/media, dan pemeriksaan layanan menjelang acara terdokumentasi agar undangan dapat dioperasikan dan dipulihkan.

## Implementation Decisions

### Arsitektur dan batas modul

- Satu proyek Astro + TypeScript dengan adapter resmi Vercel untuk halaman dinamis dan endpoint server. Gunakan Supabase PostgreSQL, Auth email/password, dan Storage. Verifikasi versi serta kompatibilitas saat scaffold.
- Gunakan modul seperlunya untuk renderer undangan bersama, form konten/publikasi, impor/daftar/ekspor tamu, dan operasi server terhadap wedding, guest, RSVP, serta media. Tidak perlu lapisan abstraksi untuk tiap field atau sistem template umum.
- Renderer yang sama menampilkan snapshot publik kepada tamu dan draf kepada preview admin. Halaman personal, admin, dan preview dirender sesuai permintaan; perubahan publikasi tidak memerlukan deploy ulang.
- Gunakan HTML, scoped CSS, transisi/keyframe, dan JavaScript kecil untuk sampul, reveal saat scroll, musik, serta form. Mulai dengan Intersection Observer sesuai kebutuhan; jangan menambahkan React atau library animasi besar untuk efek dasar.
- Aset generik dapat di-cache, tetapi halaman personal, preview, data pengelolaan, serta hasil RSVP tidak boleh bocor melalui shared cache. Kode admin tidak dikirim sebagai bagian halaman undangan.

### Halaman dan kontrak akses

| Permukaan | Kontrak yang terlihat pengguna |
| --- | --- |
| `/` | Informasi pernikahan generik; tidak menampilkan daftar tamu atau formulir RSVP personal |
| `/<slug-tamu>` | Nama satu tamu aktif dan snapshot publik; hanya data yang diperlukan undangan |
| `/admin/login` | Login admin tanpa pendaftaran publik |
| `/admin` | Ringkasan tamu aktif serta RSVP |
| `/admin/content` | Form draf, media per bagian, dan Publish |
| `/admin/guests` | Upload CSV pengganti, daftar/pencarian/filter, unduh CSV, dan salin URL individual |
| `/admin/preview` | Draf dengan penerima contoh; hanya admin, tanpa mutation RSVP nyata |
| `/api/*` | Operasi aplikasi; tidak dapat dipakai sebagai slug tamu |

- Semua operasi admin, termasuk pembacaan draf, otorisasi upload, ekspor, dan impor, memvalidasi sesi di server serta mencocokkan user ID dengan satu admin yang diizinkan. Sekadar authenticated tidak cukup; tidak ada endpoint pembuatan admin publik.
- Kredensial istimewa Supabase tetap di server. Aktifkan RLS dan grants minimum; role anon tidak dapat membaca seluruh daftar tamu/draf atau mengubah RSVP langsung. Policy admin pada data/media membatasi user ID yang sama.
- Browser tamu memakai endpoint aplikasi. Server mencari guest berdasarkan slug, memeriksa status aktif, memilih ID internal sendiri, dan membatasi proyeksi respons. Klien tidak menentukan ID tamu sasaran RSVP.
- Akses lewat tautan saja sudah disetujui. Siapa pun yang memiliki tautan dapat melihat nama penerima dan mengubah RSVP-nya; jangan mengklaim verifikasi identitas.
- Slug invalid, tidak ditemukan, dan nonaktif menghasilkan halaman generik yang sama tanpa data tamu. Sebelum publikasi pertama, undangan personal belum tersedia untuk dibaca.
- Terapkan validasi server, perlindungan CSRF sesuai pola framework, cookie sesi aman, pembatasan percobaan login/RSVP/upload, escaping teks, dan error tanpa detail rahasia. Logout mencabut akses sesuai kontrak sesi yang dipilih.
- Gunakan noindex, tanpa sitemap tamu, dan kebijakan referrer yang tidak menyebarkan path penerima. Jangan mencatat nama/RSVP dalam log atau menampilkan data tamu lain.

### Desain, konten, dan media

- Sheilly & Dhanar menjadi acuan utama: latar hijau gelap, judul Libre Caslon Display, teks Instrument Sans, aksen merah muda, kolom konten terpusat sekitar 440 px di desktop, dan spacing antarseksi lebar. Detail visual tetap perlu diperiksa langsung.
- Konten berupa satu halaman scroll dengan foto pasangan di depan, profil CPP dan CPW beserta foto masing-masing, daftar acara, galeri grid sederhana, RSVP, dan penutup. Grid tidak memiliki slider atau lightbox.
- Konten memuat nama/sapaan, nama lengkap mempelai, deskripsi opsional, detail acara, referensi media/teks alternatif, musik, dan ucapan penutup. Monogram diturunkan dari inisial. Tanggal/waktu terstruktur menjadi satu sumber bagi tampilan dan kalender.
- Admin dapat menambah/menghapus acara, mengatur foto tiap bagian, melepas foto dari draf, dan mengurutkan galeri. Pelepasan foto tidak menghapus objek yang masih dipakai draf lain yang berlaku atau snapshot publik.
- Upload media hanya oleh admin, langsung ke Supabase Storage melalui otorisasi terbatas. Endpoint aplikasi mengurus otorisasi/metadata, bukan meneruskan file media besar.
- Validasi ukuran dan isi file; jangan percaya ekstensi atau MIME dari klien saja. Foto menerima JPEG/PNG/WebP dan musik MP3. Tolak upload HTML, SVG, dan executable. Nama objek dibuat server; jangan menimpa objek lama secara tidak sengaja.
- Media draf berada dalam bucket privat. Berikan signed read URL hanya untuk media yang boleh dilihat oleh preview atau snapshot publik, dengan penanganan kedaluwarsa. Media yang ditampilkan tetap dapat disalin penerima.
- Optimalkan ukuran foto, hilangkan metadata lokasi, sediakan dimensi tampilan, dan muat media di bawah layar secara bertahap. Jangan memuat audio sebelum diperlukan. Foto/musik yang belum tersedia tidak boleh menghasilkan layout rusak.
- Tombol Buka Undangan memindahkan fokus ke isi dan mencoba memulai musik dalam interaksi pengguna. Tampilkan putar/jeda; kegagalan audio tidak menutup akses isi.
- Peta membuka URL eksternal dengan protokol yang diizinkan; server tidak mengambil URL arbitrer. Kalender menghasilkan unduhan ICS yang benar untuk zona waktu serta tanggal/waktu acara.
- Hormati reduced motion dan berikan fokus terlihat, label form, teks alternatif, status yang dapat diumumkan pembaca layar, serta navigasi keyboard. Isi tidak boleh tertinggal tersembunyi ketika animasi gagal.

### Draf dan publikasi

- Satu Wedding menyimpan konten draf dan snapshot publik terpisah, beserta waktu perubahan/publikasi. Gunakan JSON terstruktur yang divalidasi server.
- Simpan hanya mengubah draf. Preview tidak memublikasikan konten atau mengubah jawaban tamu. Publish memvalidasi konten wajib serta media valid lalu mengganti snapshot publik secara atomik.
- Tamu tetap melihat snapshot publik sebelumnya saat admin mengedit. Kegagalan simpan, upload, atau Publish mempertahankan publikasi lama serta input yang dapat dipulihkan.
- Publikasi tidak mengubah daftar guest atau RSVP. Jangan menghapus media yang masih dipakai draf atau publikasi; pembersihan manual yang aman cukup untuk versi pertama.

### Identitas tamu dan CSV pengganti

- Guest memiliki ID internal, nama tampilan, slug unik, status aktif, dan waktu perubahan. Slug menjadi kunci pencocokan CSV, sedangkan RSVP mengacu pada ID internal.
- Format impor memakai kolom nama dan slug. Slug tamu baru boleh kosong; slug tamu lama dipertahankan dari unduhan. Impor tidak memakai status RSVP atau waktu jawaban dari kolom ekspor untuk menulis jawaban.
- Generator slug memakai huruf kecil, normalisasi diakritik, spasi menjadi tanda hubung, karakter a–z/0–9/tanda hubung, serta pembersihan tanda hubung berulang/tepi. Nama kembar mendapat akhiran angka yang tetap muat dalam batas slug.
- Hasil slug kosong perlu diisi valid melalui CSV. Cadangkan rute admin/API, aset, dan rute framework. Constraint unik database menjadi pengaman akhir terhadap konflik.
- Validasi seluruh CSV sebelum perubahan: header, encoding, batas ukuran/baris, nama kosong, slug invalid, slug berulang, serta quoting yang rusak. Tolak file tanpa baris tamu dengan pesan yang jelas. Batas operasional ditentukan saat lingkungan tersedia, bukan menerima file tanpa batas.
- Tampilkan dampak penggantian sebelum diterapkan: tamu baru, tetap aktif, dinonaktifkan, dan diaktifkan kembali. Saat penerapan, validasi tetap berlaku di server.
- Slug yang sudah ada memperbarui nama dan mengaktifkan guest yang sama tanpa mengganti ID, URL, atau RSVP. Jangan mencocokkan berdasarkan urutan CSV atau nama saja. Slug kosong dengan nama yang sudah cocok dengan guest tersimpan harus meminta slug tetap agar identitas tidak tertukar.
- Guest yang tidak ada dalam CSV pengganti menjadi nonaktif; ID dan RSVP dipertahankan. Baris dengan slug guest nonaktif mengaktifkannya kembali dengan riwayat utuh.
- Terapkan satu impor sebagai transaksi utuh dan serialkan dua impor bersamaan. Impor hanya mengubah data guest/status aktif, tidak menulis ulang RSVP; jawaban yang masuk bersamaan tidak boleh hilang. Kegagalan transaksi mempertahankan daftar lama.
- Mengganti nama dilakukan dengan mempertahankan slug. Mengganti slug tidak menjadi mekanisme migrasi identitas; tidak ada redirect atau hard delete pada versi pertama.
- Unduhan berisi daftar aktif lengkap, terlepas dari filter tampilan, dengan nama, slug, status RSVP, dan waktu jawaban terakhir. Daftar nonaktif tetap bisa dilihat untuk memperoleh slug saat pengaktifan kembali.
- Ekspor menangani koma, kutip, newline, dan formula spreadsheet. Format harus aman serta menjaga nama saat ekspor-impor ulang. Pengamanan formula tidak boleh diam-diam mengubah nama tamu.
- Tautan salinan memakai domain kanonis terkonfigurasi, bukan host header dari permintaan.

### RSVP dan ringkasan

- RSVP memiliki relasi unik ke Guest, nilai attending atau declined, serta waktu jawaban. Belum menjawab berarti belum ada jawaban, bukan pilihan yang dikirim.
- Pengiriman pertama atau perubahan memperbarui satu jawaban terkini. Klik ganda tidak membuat duplikasi; jawaban terakhir yang berhasil disimpan berlaku. Jangan menampilkan sukses sebelum penyimpanan berhasil.
- Setiap mutation memeriksa slug, guest aktif, dan enum jawaban di server. Pemeriksaan status aktif serta penyimpanan harus tetap konsisten ketika impor menonaktifkan guest secara bersamaan.
- Satu undangan mewakili satu orang; nama dan jumlah orang tidak dapat diubah tamu. Tidak ada deadline RSVP pada versi pertama.
- Admin tidak memiliki form atau endpoint khusus untuk menulis RSVP. CSV tidak dapat menimpa jawaban. Akses lewat tautan tamu tetap memiliki batas privasi yang telah disepakati.
- Dashboard menghitung guest aktif saja untuk hadir, tidak hadir, dan belum menjawab. Guest nonaktif ditampilkan terpisah dan riwayatnya tetap tersedia.

### Lingkungan dan operasi

- Simpan kode di repository GitHub pribadi privat dan hubungkan ke Vercel. Detail akun, repository, dan domain yang sudah dimiliki menyusul. Jangan membuat atau push ke tujuan yang belum ditentukan.
- Pisahkan Development, Preview, dan Production. Preview tidak memiliki akses produksi; jika database nonproduksi belum tersedia, gunakan fixture nonpribadi dan nonaktifkan mutation preview.
- Rahasia tetap dalam environment server, tidak dalam Git, log, atau bundle browser. Versikan migrasi SQL, lockfile, dokumentasi, serta nama variabel contoh tanpa rahasia. Data tamu nyata dan upload asli tetap di luar Git.
- Migrasi dijalankan terkontrol; jangan menjalankan seed/reset produksi atau migrasi produksi otomatis pada setiap preview/build. Rollback kode tidak memulihkan database/media.
- Siapkan backup database dan objek Storage, uji pemulihannya bersama, dan dokumentasikan provisioning/pemulihan akses admin, status layanan, kuota, dan langkah pemulihan layanan menjelang acara. Free tier tidak menjadi jaminan selalu aktif atau tanpa batas.

## Testing Decisions

- Pengguna menyetujui batas pengujian utama pada endpoint aplikasi dengan Supabase pengujian dan satu alur browser lengkap. Belum ada kode, test runner, atau pola test lama; pilih tooling minimum saat scaffold, jangan mengarang prior art.
- Test harus mengamati perilaku yang terlihat: respons/otorisasi, isi publik dibanding draf, hasil penyimpanan, identitas/URL guest, dan jawaban setelah operasi. Jangan menguji nama helper, urutan fungsi internal, atau snapshot setiap paragraf.
- Gunakan Supabase nonproduksi/lokal dan akun admin pengujian untuk integration test. Jangan mengganti transaksi, constraint, dan RLS dengan mock yang menyembunyikan perilaku nyata.
- Pada batas konten/publikasi, periksa Simpan tidak memengaruhi tamu, preview hanya untuk admin, Publish berhasil mengganti snapshot, dan Publish/upload gagal mempertahankan publikasi serta referensi media lama.
- Pada batas impor/ekspor, periksa upload pertama, nama kembar, perubahan nama dengan slug tetap, perubahan urutan baris, penonaktifan/pengaktifan kembali, file invalid/kosong, serta ekspor-impor dengan karakter khusus dan pengamanan formula. Kolom RSVP pada CSV tidak menimpa jawaban.
- Verifikasi rollback dan concurrency: dua impor menghasilkan satu daftar konsisten, RSVP yang masuk selama impor tidak hilang, dan guest nonaktif tidak dapat menyimpan jawaban baru. ID, URL, dan RSVP yang harus bertahan diperiksa sebelum dan sesudah operasi.
- Pada batas keamanan, permintaan tanpa sesi atau user authenticated selain admin tidak dapat membaca draf/daftar, mengimpor, mengekspor, mengotorisasi upload, atau Publish. Verifikasi anon Data API tidak membaca daftar/draf atau menulis RSVP langsung, dan rahasia tidak ada di bundle browser.
- Pada batas tamu/RSVP, periksa slug invalid/tidak ditemukan/nonaktif, pertama kali menjawab, perubahan jawaban, klik ganda, enum invalid, ID tamu palsu, kegagalan jaringan, dan isolasi cache antartamu/preview.
- Satu alur browser utama: login admin, isi draf dan media contoh, preview, Publish, impor CSV, salin/buka URL guest, kirim RSVP, cek ringkasan, unduh/edit/impor ulang CSV, dan pastikan tautan serta jawaban tetap sama. Periksa juga logout menutup akses pengelolaan.
- Lengkapi dengan pemeriksaan visual pada mobile mulai 320 px dan desktop, nama panjang, foto belum tersedia, audio gagal, fokus setelah membuka sampul, keyboard, pembaca layar/status form, kontras, dan reduced motion. Jangan menyatakan fidelity selesai berdasarkan README atau HTML saja.
- Periksa hasil unduhan kalender untuk zona waktu, lintas hari, dan karakter khusus; periksa peta serta kontrol musik melalui perilaku browser. Gunakan test kecil pada generator CSV/slug/kalender hanya untuk kasus tepi yang lebih efisien dibuktikan pada batas tersebut.
- Sebelum rilis, lakukan pemeriksaan domain/HTTPS, isolasi Preview, error saat database/kuota bermasalah, ukuran media, dan satu latihan restore database beserta Storage. Tes belum dijalankan pada tahap penulisan spesifikasi ini.

## Out of Scope

- Banyak pernikahan/admin, pendaftaran publik, billing, marketplace template, page builder, atau editor HTML/CSS bebas.
- Plus-one, undangan keluarga, pengaturan kursi, dan QR check-in.
- Buku ucapan publik/privat, cerita pasangan, amplop digital, rekening, dan hadiah/kado digital.
- WhatsApp/email otomatis, pelacakan dikirim/dibuka/dibaca, serta analitik pengunjung.
- Impor Excel, form tambah/edit guest satu per satu, hard delete guest, dan migrasi/redirect slug.
- Perubahan RSVP lewat pengelolaan admin atau CSV, deadline RSVP, PIN/OTP, dan password individual.
- Slider galeri, lightbox/perbesar foto, flip-book, dan fitur tambahan hanya karena ada di repo referensi.
- Microservice, CMS eksternal, antrean pekerjaan, state management global, dan library animasi besar tanpa kebutuhan terbukti.
- Pembuatan repository, push GitHub, deployment, atau perubahan layanan produksi sebagai bagian dari penulisan spesifikasi ini.

## Further Notes

- Persyaratan fitur, arsitektur, dan pendekatan pengujian sudah disepakati. Status ready-for-agent berarti siap menjadi dasar pekerjaan implementasi berikutnya; tidak menyatakan kode tersedia, pengujian lulus, atau rilis siap.
- Sasaran rilis adalah pertengahan hingga akhir November 2026. Tanggal pasti, detail domain, akun/URL GitHub, konten final, serta izin aset diselesaikan pada tahap terkait; hal tersebut tidak menghalangi scaffold dan pengembangan memakai data fiktif.
- Referensi utama adalah [Sheilly & Dhanar](https://sheilly-dhanar.meraki.id/). Temuan desain dalam rencana berasal dari HTML/CSS simpanan; tampilan dan interaksi browser belum diverifikasi.
- Referensi tambahan: [Engagement](https://github.com/Bavly-Hamdy/Engagement), [Invitation-Template](https://github.com/Rainier-PS/Invitation-Template), [Dian & Iqbal](https://github.com/ahmadghozali-xyz/undangan-dian-iqbal#-pratinjau-tampilan), dan [Pawiwahan Theme 1](https://github.com/winanda150/pawiwahan-theme-1). README sudah dibaca; kode/lisensi dan perilaku langsung belum diperiksa. Fitur mereka tidak memperluas cakupan ini secara otomatis.
- Tiga foto JPEG tersedia lokal, tetapi isi, peran final, dan izin penggunaannya belum diverifikasi pada penyusunan spec. Jangan menganggap foto referensi sebagai aset yang boleh diterbitkan.
- Batas upload yang tercatat di rencana masih usulan awal: hingga 10 MB per foto dan 20 MB per MP3. Cocokkan dengan konfigurasi layanan, kuota, validasi, dan optimasi sebelum menetapkannya saat implementasi. Verifikasi batas/versi SDK terbaru dari dokumentasi resmi.
- Rencana proyek tetap menjadi konteks tahapan dan operasi; spesifikasi ini merangkum kontrak versi pertama. Jika implementasi membutuhkan perubahan cakupan, jelaskan dampaknya dan perbarui kedua dokumen agar tidak bertentangan.
- Spesifikasi diterbitkan ke tracker Local Markdown yang telah disetujui. Belum ada GitHub Issue atau tiket implementasi yang dibuat.
