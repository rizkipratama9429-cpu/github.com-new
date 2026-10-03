/**
 * Pembungkus tipis di atas localStorage supaya aman dipakai
 * (mis. saat browser memblokir penyimpanan atau JSON rusak).
 * @module storage
 */

/** Kunci penyimpanan yang dipakai aplikasi. */
export const KEYS = Object.freeze({
  tasks: "project-belanin.tasks",
  theme: "project-belanin.theme",
});

/**
 * Membaca daftar tugas tersimpan.
 * @returns {Array<object>}
 */
export const loadTasks = () => {
  try {
    const raw = localStorage.getItem(KEYS.tasks);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Gagal memuat tugas:", error);
    return [];
  }
};

/**
 * Menyimpan daftar tugas.
 * @param {Array<object>} tasks
 * @returns {void}
 */
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(KEYS.tasks, JSON.stringify(tasks));
  } catch (error) {
    console.warn("Gagal menyimpan tugas:", error);
  }
};

/**
 * Membaca tema tersimpan.
 * @returns {"light" | "dark" | null}
 */
export const loadTheme = () => {
  try {
    const value = localStorage.getItem(KEYS.theme);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

/**
 * Menyimpan pilihan tema.
 * @param {"light" | "dark"} theme
 * @returns {void}
 */
export const saveTheme = (theme) => {
  try {
    localStorage.setItem(KEYS.theme, theme);
  } catch (error) {
    console.warn("Gagal menyimpan tema:", error);
  }
};