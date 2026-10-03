# Project Belanin

[![CI](https://github.com/rizkipratama9429-cpu/github.com-new/actions/workflows/ci.yml/badge.svg)](https://github.com/rizkipratama9429-cpu/github.com-new/actions/workflows/ci.yml)

Repositori latihan untuk belajar scripting dan web dasar.

Berisi dua bagian kecil:

1. **`halo.py`** — skrip Python sederhana untuk menyapa pengguna.
2. **Daftar Tugas** — aplikasi web interaktif untuk mencatat tugas, dibangun
   dengan **TypeScript** + Vite dan CSS modern (`@layer`, nesting, container
   queries), lengkap dengan uji otomatis (Vitest).

## Struktur Proyek

```
Project Belanin/
├── index.html          # Halaman "Daftar Tugas" (entry Vite)
├── src/
│   ├── main.ts         # Titik masuk: menyambungkan state, DOM, localStorage
│   ├── render.ts       # Lapisan tampilan (state -> DOM)
│   ├── tasks.ts        # Logika murni daftar tugas (immutable, tanpa DOM)
│   ├── storage.ts      # Pembungkus localStorage
│   ├── utils.ts        # Utilitas ID & tanggal
│   ├── types.ts        # Tipe bersama (Task, Filter, Theme)
│   ├── style.css       # CSS modern (@layer, nesting, container queries)
│   ├── tasks.test.ts   # Uji logika murni
│   ├── render.test.ts  # Uji lapisan tampilan (jsdom)
│   └── main.test.ts    # Uji integrasi wiring aplikasi
├── vite.config.ts      # Konfigurasi Vite + Lightning CSS + Vitest
├── tsconfig.json       # Konfigurasi TypeScript
├── eslint.config.js    # Aturan ESLint (flat config)
├── .prettierrc.json    # Konfigurasi Prettier
├── .husky/pre-commit   # Hook pra-commit (lint-staged)
├── .github/workflows/  # CI: typecheck, lint, format, test, build
├── .github/dependabot.yml  # Pembaruan dependensi otomatis
├── package.json        # Skrip & dependensi
├── halo.py             # Skrip sapaan Python sederhana
├── .gitignore
└── README.md
```

## Menjalankan Aplikasi Web

Aplikasi ini memakai **ES modules** dan CSS modern, sehingga butuh dev server
kecil (Vite). Pasang dependensi sekali saja:

```bash
npm install
```

Lalu:

```bash
npm run dev        # server pengembangan (buka di browser otomatis)
npm run build      # hasil produksi ke folder dist/
npm run preview    # cek hasil build secara lokal
npm run typecheck  # periksa tipe TypeScript
npm test           # jalankan seluruh uji (Vitest)
npm run lint       # periksa kode dengan ESLint
npm run format     # rapikan format dengan Prettier
```

### Fitur "Daftar Tugas"

- Tambah tugas lewat tombol **Tambah** atau tombol **Enter**
- Tenggat waktu opsional; tugas yang lewat tenggat ditandai merah
- Tandai tugas selesai dengan checkbox
- Ubah tugas langsung di tempat: klik ganda pada teks (Enter menyimpan, Esc membatalkan)
- Urutkan ulang tugas dengan seret-dan-lepas (drag and drop)
- Hapus tugas satu per satu
- Filter: **Semua / Aktif / Selesai**
- Penghitung tugas tersisa
- Tombol **Hapus yang selesai** untuk membersihkan tugas yang selesai
- Tombol tema terang/gelap (🌙/☀️) yang tersimpan di browser
- Data tersimpan otomatis di browser lewat `localStorage`
- Tampilan responsif untuk layar kecil

## Menjalankan Skrip Python

```bash
python halo.py
```

Program akan meminta nama, lalu menampilkan pesan sapaan.

## Kualitas Kode & CI

- **ESLint** (`npm run lint`) — aturan JS + TypeScript.
- **Prettier** (`npm run format`) — format kode yang seragam.
- **TypeScript** (`npm run typecheck`) — memeriksa tipe.
- **Vitest** (`npm test`) — uji otomatis (logika, tampilan, integrasi).
- **Husky + lint-staged** — hook pra-commit menjalankan ESLint & Prettier pada
  berkas yang diubah sebelum commit.
- **GitHub Actions** (`.github/workflows/ci.yml`) menjalankan typecheck, lint,
  format check, test, dan build pada setiap push maupun pull request ke `main`.
- **Dependabot** (`.github/dependabot.yml`) — membuat PR pembaruan dependensi
  secara berkala.

## Lisensi

Proyek latihan — bebas dipakai untuk belajar.
