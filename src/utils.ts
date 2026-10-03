/**
 * Utilitas kecil bersama (ID unik dan tanggal).
 * @module utils
 */
import type { Task } from "./types";

/** Membuat ID unik sederhana untuk sebuah tugas. */
export const makeId = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** Menambahkan angka nol di depan bila perlu. */
const pad = (value: number): string => String(value).padStart(2, "0");

/** Tanggal hari ini dalam format ISO (YYYY-MM-DD), sesuai waktu lokal. */
export const todayISO = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** Mengubah tanggal ISO menjadi teks Indonesia (mis. "3 Okt 2026"). */
export const formatDue = (iso: string): string => {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return iso;
  }
};

/** Apakah tugas sudah lewat tenggat (dan belum selesai)? */
export const isOverdue = (task: Pick<Task, "done" | "due">): boolean => {
  if (!task.due || task.done) return false;
  return task.due < todayISO();
};
