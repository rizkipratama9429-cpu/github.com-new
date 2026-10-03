/**
 * Pembungkus tipis di atas localStorage supaya aman dipakai
 * (mis. saat browser memblokir penyimpanan atau JSON rusak).
 * @module storage
 */
import type { Task, Theme } from "./types";

/** Kunci penyimpanan yang dipakai aplikasi. */
export const KEYS = Object.freeze({
  tasks: "project-belanin.tasks",
  theme: "project-belanin.theme",
});

/** Membaca daftar tugas tersimpan. */
export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(KEYS.tasks);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Task[]) : [];
  } catch (error) {
    console.warn("Gagal memuat tugas:", error);
    return [];
  }
};

/** Menyimpan daftar tugas. */
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(KEYS.tasks, JSON.stringify(tasks));
  } catch (error) {
    console.warn("Gagal menyimpan tugas:", error);
  }
};

/** Membaca tema tersimpan. */
export const loadTheme = (): Theme | null => {
  try {
    const value = localStorage.getItem(KEYS.theme);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

/** Menyimpan pilihan tema. */
export const saveTheme = (theme: Theme): void => {
  try {
    localStorage.setItem(KEYS.theme, theme);
  } catch (error) {
    console.warn("Gagal menyimpan tema:", error);
  }
};
