/**
 * Utilitas kecil bersama (ID unik dan tanggal).
 * @module utils
 */

/**
 * Membuat ID unik sederhana untuk sebuah tugas.
 * @returns {string}
 */
export const makeId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/**
 * Menambahkan angka nol di depan bila perlu.
 * @param {number} value
 * @returns {string}
 */
const pad = (value) => String(value).padStart(2, "0");

/**
 * Tanggal hari ini dalam format ISO (YYYY-MM-DD), sesuai waktu lokal.
 * @returns {string}
 */
export const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/**
 * Mengubah tanggal ISO menjadi teks Indonesia (mis. "3 Okt 2026").
 * @param {string} iso
 * @returns {string}
 */
export const formatDue = (iso) => {
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

/**
 * Apakah tugas sudah lewat tenggat (dan belum selesai)?
 * @param {{ done: boolean, due: string | null }} task
 * @returns {boolean}
 */
export const isOverdue = (task) =>
  Boolean(task.due) && !task.done && task.due < todayISO();