/**
 * Logika murni daftar tugas: tanpa DOM dan tanpa efek samping,
 * sehingga mudah dibaca dan diuji. Setiap fungsi mengembalikan
 * array baru (immutable) alih-alih mengubah input.
 * @module tasks
 */
import type { Filter, Task } from "./types";
import { makeId } from "./utils";

/** Menambah tugas baru bila teksnya tidak kosong. */
export const addTask = (tasks: Task[], text: string, due: string | null = null): Task[] => {
  const trimmed = text.trim();
  if (!trimmed) return tasks;
  return [...tasks, { id: makeId(), text: trimmed, done: false, due: due || null }];
};

/** Membalik status selesai sebuah tugas. */
export const toggleTask = (tasks: Task[], id: string): Task[] =>
  tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));

/** Menghapus satu tugas. */
export const removeTask = (tasks: Task[], id: string): Task[] =>
  tasks.filter((task) => task.id !== id);

/** Mengubah teks tugas (abaikan bila kosong). */
export const renameTask = (tasks: Task[], id: string, text: string): Task[] => {
  const trimmed = text.trim();
  if (!trimmed) return tasks;
  return tasks.map((task) => (task.id === id ? { ...task, text: trimmed } : task));
};

/** Menghapus semua tugas yang sudah selesai. */
export const clearCompleted = (tasks: Task[]): Task[] => tasks.filter((task) => !task.done);

/** Memindahkan tugas `fromId` ke posisi tugas `toId`. */
export const reorder = (tasks: Task[], fromId: string, toId: string): Task[] => {
  const from = tasks.findIndex((task) => task.id === fromId);
  const to = tasks.findIndex((task) => task.id === toId);
  if (from === -1 || to === -1 || from === to) return tasks;

  const next = [...tasks];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

/** Menyaring tugas sesuai filter aktif. */
export const visibleTasks = (tasks: Task[], filter: Filter): Task[] => {
  switch (filter) {
    case "aktif":
      return tasks.filter((task) => !task.done);
    case "selesai":
      return tasks.filter((task) => task.done);
    default:
      return tasks;
  }
};

/** Jumlah tugas yang belum selesai. */
export const remainingCount = (tasks: Task[]): number =>
  tasks.filter((task) => !task.done).length;

/** Apakah ada tugas yang sudah selesai? */
export const hasCompleted = (tasks: Task[]): boolean => tasks.some((task) => task.done);
