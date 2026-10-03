/**
 * Logika murni daftar tugas: tanpa DOM dan tanpa efek samping,
 * sehingga mudah dibaca dan diuji. Setiap fungsi mengembalikan
 * array baru (immutable) alih-alih mengubah input.
 * @module tasks
 */
import { makeId } from "./utils.js";

/**
 * @typedef {object} Task
 * @property {string} id
 * @property {string} text
 * @property {boolean} done
 * @property {string | null} due  Tanggal ISO (YYYY-MM-DD) atau null.
 */

/** @typedef {"semua" | "aktif" | "selesai"} Filter */

/**
 * Menambah tugas baru bila teksnya tidak kosong.
 * @param {Task[]} tasks
 * @param {string} text
 * @param {string | null} [due]
 * @returns {Task[]}
 */
export const addTask = (tasks, text, due = null) => {
  const trimmed = text.trim();
  if (!trimmed) return tasks;
  return [...tasks, { id: makeId(), text: trimmed, done: false, due: due || null }];
};

/**
 * Membalik status selesai sebuah tugas.
 * @param {Task[]} tasks
 * @param {string} id
 * @returns {Task[]}
 */
export const toggleTask = (tasks, id) =>
  tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));

/**
 * Menghapus satu tugas.
 * @param {Task[]} tasks
 * @param {string} id
 * @returns {Task[]}
 */
export const removeTask = (tasks, id) => tasks.filter((task) => task.id !== id);

/**
 * Mengubah teks tugas (abaikan bila kosong).
 * @param {Task[]} tasks
 * @param {string} id
 * @param {string} text
 * @returns {Task[]}
 */
export const renameTask = (tasks, id, text) => {
  const trimmed = text.trim();
  if (!trimmed) return tasks;
  return tasks.map((task) => (task.id === id ? { ...task, text: trimmed } : task));
};

/**
 * Menghapus semua tugas yang sudah selesai.
 * @param {Task[]} tasks
 * @returns {Task[]}
 */
export const clearCompleted = (tasks) => tasks.filter((task) => !task.done);

/**
 * Memindahkan tugas `fromId` ke posisi tugas `toId`.
 * @param {Task[]} tasks
 * @param {string} fromId
 * @param {string} toId
 * @returns {Task[]}
 */
export const reorder = (tasks, fromId, toId) => {
  const from = tasks.findIndex((task) => task.id === fromId);
  const to = tasks.findIndex((task) => task.id === toId);
  if (from === -1 || to === -1 || from === to) return tasks;

  const next = [...tasks];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

/**
 * Menyaring tugas sesuai filter aktif.
 * @param {Task[]} tasks
 * @param {Filter} filter
 * @returns {Task[]}
 */
export const visibleTasks = (tasks, filter) => {
  switch (filter) {
    case "aktif":
      return tasks.filter((task) => !task.done);
    case "selesai":
      return tasks.filter((task) => task.done);
    default:
      return tasks;
  }
};

/**
 * Jumlah tugas yang belum selesai.
 * @param {Task[]} tasks
 * @returns {number}
 */
export const remainingCount = (tasks) => tasks.filter((task) => !task.done).length;

/**
 * Apakah ada tugas yang sudah selesai?
 * @param {Task[]} tasks
 * @returns {boolean}
 */
export const hasCompleted = (tasks) => tasks.some((task) => task.done);