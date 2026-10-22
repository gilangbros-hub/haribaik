# Issue tracker: Local Markdown

Spesifikasi dan tiket disimpan dalam proyek:

- Satu direktori per fitur: `.scratch/<feature>/`.
- Spesifikasi: `.scratch/<feature>/spec.md`.
- Tiket implementasi: `.scratch/<feature>/issues/<NN>-<slug>.md`,
  mulai dari 01, satu file per tiket.
- Status ditulis sebagai `Status:` di bagian atas dokumen,
  menggunakan kosakata dalam triage-labels.md.
- Komentar ditambahkan di bagian bawah, di bawah `## Comments`.

“Publish to the issue tracker” berarti menulis dokumen lokal
sesuai struktur ini. Tidak membuat GitHub Issue secara otomatis.

Kode akan disimpan di GitHub nanti; tujuan repository menyusul.
