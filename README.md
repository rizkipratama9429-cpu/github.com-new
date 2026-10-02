# Project Belanin

Repositori latihan untuk belajar scripting dan web dasar.

Berisi dua bagian kecil:

1. **`halo.py`** — skrip Python sederhana untuk menyapa pengguna.
2. **Daftar Tugas** — aplikasi web interaktif (HTML/CSS/JS) untuk mencatat tugas.

## Struktur Proyek

```
Project Belanin/
├── halo.py        # Skrip sapaan Python sederhana
├── index.html     # Halaman aplikasi "Daftar Tugas"
├── style.css      # Tampilan aplikasi
├── app.js         # Logika aplikasi (vanilla JavaScript)
├── .gitignore
└── README.md
```

## Menjalankan Aplikasi Web

Tanpa build step dan tanpa dependensi — cukup buka file di browser:

- Klik dua kali `index.html`, **atau**
- Klik kanan `index.html` lalu pilih **Open with Live Server** (jika ekstensi tersedia).

### Fitur "Daftar Tugas"

- Tambah tugas lewat tombol **Tambah** atau tombol **Enter**
- Tandai tugas selesai dengan checkbox
- Hapus tugas satu per satu
- Filter: **Semua / Aktif / Selesai**
- Penghitung tugas tersisa
- Tombol **Hapus yang selesai** untuk membersihkan tugas yang selesai
- Data tersimpan otomatis di browser lewat `localStorage`
- Tampilan responsif untuk layar kecil

## Menjalankan Skrip Python

```bash
python halo.py
```

Program akan meminta nama, lalu menampilkan pesan sapaan.

## Lisensi

Proyek latihan — bebas dipakai untuk belajar.
