# 09 — Revamp UI admin: iOS-modern + Snapchat

Status: ready-for-agent
Tanggal: 24 Oktober 2026

## Task

Restyle seluruh halaman admin (login, dashboard, daftar tamu, konten undangan, fallback preview) dari tema Material Design 3 ke design system iOS-modern × Snapchat: kuning #fffc00 sebagai aksen utama, tinta near-black, tombol pill, kartu putih radius besar dengan shadow lembut, header sticky dan action bar frosted (backdrop blur), tabel gaya grouped list iOS, input filled rounded, chip eyebrow kuning.

## Pendekatan

Satu titik perubahan: `src/styles/admin.css` ditulis ulang dengan semua nama class (`md-*`, `admin-*`) dipertahankan sehingga halaman Astro hampir tidak berubah. Perubahan markup minimal: app icon "HB" di login, kartu navigasi besar di dashboard (`admin-nav`), fallback card preview disamakan.

## Verification

- `npm run build` lulus.
- Screenshot login (desktop) via dev server: gradient kuning, kartu putih radius 28, tombol pill kuning terverifikasi.
- Harness statis sementara di `public/` (dihapus setelah dipakai) untuk markup dashboard/tabel/form: tidak ada overflow horizontal (scrollWidth == clientWidth di 1280 & 375px), baris tabel terukur rata (top/height identik per baris), statistik 4 kolom desktop / 2×2 mobile.
- Fix dari temuan verifikasi: `overflow-wrap: anywhere` → `break-word` (kata di sel tabel tidak pecah per huruf) dan `white-space: nowrap` pada tombol.

## Comments

- 24 Oktober 2026: Diimplementasikan dalam satu sesi. Halaman admin dalam (dashboard/guests/content) tidak bisa diverifikasi visual dengan data asli karena butuh Supabase env + login; diverifikasi lewat harness markup statis dengan CSS yang sama.
- 24 Oktober 2026: Revisi permintaan pengguna — aksen kuning Snapchat (#fffc00) diganti sage muted (#b7c9a8, tint #edf2e4) di seluruh admin + fallback preview. Teks tetap near-black di atas sage (kontras aman). Build + screenshot login terverifikasi.
