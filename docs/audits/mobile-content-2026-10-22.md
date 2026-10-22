# Audit undangan mobile — 22 Oktober 2026

Sumber: https://bahagianyakita.ai.id/, diperiksa melalui browser pada lebar 390 px. Implementasi diperiksa terpisah menggunakan halaman data contoh `/design/preview`.

## Temuan konten publik

| Bagian | Temuan | Tindakan |
| --- | --- | --- |
| Pembuka | Deskripsi “Semoga hsaksjalks” masih berupa teks percobaan. | Ganti melalui editor konten dengan naskah di bawah. |
| Keluarga | “Bapaknya Dhanar & Ibunya Dhanar” masih berupa nama sementara. | Masukkan nama yang telah dikonfirmasi keluarga. |
| Penutup | Kalimat “Semoga bapak ibu blababalbalba” belum siap tayang. | Ganti dengan ucapan terima kasih yang lengkap. |
| Hadiah | Rekening terlihat seperti data percobaan. | Verifikasi bank, nomor, dan nama pemilik sebelum dibagikan. Jangan menebak atau menggantinya dengan rekening contoh. |
| Cerita | Informasi perkenalan di Puninar tersedia; bahasanya dapat dipadatkan. | Pertahankan fakta perkenalan, gunakan naskah di bawah. |
| Jadwal | Zona waktu ditampilkan sebagai Asia/Jakarta. | Template sekarang menampilkan WIB; WITA/WIT juga didukung. |
| Ucapan | Belum ada penjelasan bahwa pesan tampil publik. | Penjelasan ditambahkan sebelum formulir. |

## Naskah untuk editor konten

**Deskripsi:** Kami berharap dapat bertemu dengan keluarga dan sahabat di hari pernikahan kami. Terima kasih atas doa dan waktu yang Anda luangkan untuk hadir.

**Cerita:**

```text
# Berkenalan di Puninar

Kami bertemu di Puninar. Di sela pekerjaan, kami mulai berbincang dan saling mengenal. Percakapan sehari-hari itu membuat kami semakin dekat.

# Memutuskan untuk menikah

Setelah menjalani hubungan, kami memutuskan untuk menikah. Kami berharap keluarga dan sahabat dapat hadir serta mendoakan langkah kami berikutnya.
```

**Penutup:** Terima kasih atas doa dan perhatian Bapak/Ibu/Saudara/i. Kami menantikan kehadiran Anda di hari pernikahan kami. Hatur nuhun.

Naskah ini belum disimpan ke database produksi. Nama keluarga, rekening, tanggal, dan lokasi tetap mengikuti data yang dikelola admin.

## Perubahan template

- Sampul mengunci scroll; tombol Buka Undangan menjalankan transisi dan memindahkan fokus ke isi.
- Ikon SVG menggantikan simbol font. Data tulisan tamu dan admin tidak dihapus atau diubah otomatis.
- Teks pendamping lebih terbaca, input minimal 16 px, tombol dan navigasi memiliki area sentuh yang cukup.
- Cerita tanpa foto menggunakan seluruh lebar kolom, bukan menyisakan kolom kosong.
- Animasi muncul per judul/kartu saat masuk viewport. Reduced motion menonaktifkan gerakan, dan konten tetap terbaca jika JavaScript dimatikan.
- Panduan kalender, arah perjalanan, dan pertanyaan umum menambah informasi yang bisa langsung dipakai tamu.

Tidak ditambahkan kisah, nama keluarga, aturan pakaian, fasilitas venue, atau rincian acara yang belum diketahui.
