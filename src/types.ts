/** Bentuk satu tugas dalam daftar. */
export interface Task {
  id: string;
  text: string;
  done: boolean;
  /** Tanggal ISO (YYYY-MM-DD) atau null bila tidak ada tenggat. */
  due: string | null;
}

/** Nilai filter yang didukung. */
export type Filter = "semua" | "aktif" | "selesai";

/** Pilihan tema tampilan. */
export type Theme = "light" | "dark";
