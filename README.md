# Kuis Interaktif Latihan UAS (STSI4402 - Tata Kelola Teknologi Informasi)

Aplikasi web kuis interaktif berbasis HTML, CSS, dan JavaScript ES Modules (tanpa dependensi build yang rumit) yang siap di-push ke GitHub dan di-deploy langsung ke Vercel.

## Fitur Utama
- **Pilih Mata Kuliah**: Mendukung STSI4402 Tata Kelola Teknologi Informasi (80 soal lengkap dari kisi-kisi UAS) serta opsi pemilihan jumlah soal latihan.
- **Soal Acak Satu per Satu**: Menggunakan algoritma *Fisher-Yates Shuffle* agar urutan soal selalu acak setiap sesi.
- **Pilihan Ganda A / B / C / D**: Mendukung klik layar sentuh (mobile-friendly) maupun pintasan keyboard (`A`, `B`, `C`, `D`, `Enter`).
- **Feedback & Pembahasan Instan**: Langsung menampilkan status benar/salah beserta penjelasan singkat setiap kali jawaban dipilih.
- **Skor Akhir & Review**: Menampilkan nilai akhir, jumlah benar/salah, pembahasan lengkap, serta tombol ulangi kuis.

## Cara Upload ke GitHub & Deploy ke Vercel
1. Buat repository baru di **GitHub** (misalnya `kuis-uas-ut`).
2. Upload seluruh file dalam folder ini (`index.html`, `style.css`, `questions.js`, `app.js`, `vercel.json`, `README.md`) ke repository tersebut.
3. Buka [Vercel](https://vercel.com), klik **Add New... → Project**, lalu pilih repository `kuis-uas-ut`.
4. Biarkan **Framework Preset** pada `Other` (Static), lalu klik **Deploy**.
