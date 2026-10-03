# Project Belanin

Repositori latihan untuk belajar scripting dan web dasar.

Berisi dua bagian kecil:

1. **`halo.py`** — skrip Python sederhana untuk menyapa pengguna.
2. **Daftar Tugas** — aplikasi web interaktif untuk mencatat tugas, dibangun
   dengan vanilla JavaScript modern (ES modules) + Vite dan CSS modern
   (`@layer`, nesting, container queries).

## Struktur Proyek

```
Project Belanin/
├── index.html         # Halaman "Daftar Tugas" (entry Vite)
├── src/
│   ├── main.js        # Titik masuk: menyambungkan state, DOM, localStorage
│   ├── render.js      # Lapisan tampilan (state -> DOM)
│   ├── tasks.js       # Logika murni daftar tugas (immutable, tanpa DOM)
│   ├── storage.js     # Pembungkus localStorage
│   ├── utils.js       # Utilitas ID & tanggal
│   └── style.css      # CSS modern (@layer, nesting, container queries)
├── vite.config.js     # Konfigurasi Vite + Lightning CSS
├── package.json       # Skrip & dependensi
├── halo.py            # Skrip sapaan Python sederhana
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
npm run dev      # server pengembangan (buka di browser otomatis)
npm run build    # hasil produksi ke folder dist/
npm run preview  # cek hasil build secara lokal
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

## Lisensi

Proyek latihan — bebas dipakai untuk belajar.
