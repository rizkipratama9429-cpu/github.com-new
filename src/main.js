/**
 * Titik masuk aplikasi: menyambungkan state, DOM, dan localStorage.
 * @module main
 */
import "./style.css";
import * as store from "./storage.js";
import * as tasksApi from "./tasks.js";
import { applyTheme, render } from "./render.js";

/** @type {import("./render.js").Refs} */
const refs = {
  form: document.querySelector("#task-form"),
  input: document.querySelector("#task-input"),
  due: document.querySelector("#task-due"),
  list: document.querySelector("#tasks"),
  counter: document.querySelector("#counter"),
  empty: document.querySelector("#empty"),
  filters: document.querySelector("#filters"),
  clearBtn: document.querySelector("#clear-completed"),
  themeToggle: document.querySelector("#theme-toggle"),
};

/** @type {import("./tasks.js").Task[]} */
let tasks = store.loadTasks();
/** @type {import("./tasks.js").Filter} */
let filter = "semua";
/** @type {string | null} */
let draggedId = null;

/** Simpan ke localStorage lalu gambar ulang. */
const commit = () => {
  store.saveTasks(tasks);
  paint();
};

/** Gambar ulang tampilan dari state saat ini. */
const paint = () => render(refs, { tasks, filter }, handlers);

/** @type {import("./render.js").Handlers} */
const handlers = {
  onToggle: (id) => {
    tasks = tasksApi.toggleTask(tasks, id);
    commit();
  },
  onRemove: (id) => {
    tasks = tasksApi.removeTask(tasks, id);
    commit();
  },
  onRename: (id, text) => {
    tasks = tasksApi.renameTask(tasks, id, text);
    commit();
  },
  onDragStart: (id) => {
    draggedId = id;
  },
  onDragEnd: () => {
    draggedId = null;
  },
  onDrop: (id) => {
    if (!draggedId || draggedId === id) return;
    tasks = tasksApi.reorder(tasks, draggedId, id);
    draggedId = null;
    commit();
  },
};

refs.form.addEventListener("submit", (event) => {
  event.preventDefault();
  tasks = tasksApi.addTask(tasks, refs.input.value, refs.due.value || null);
  refs.input.value = "";
  refs.due.value = "";
  refs.input.focus();
  commit();
});

refs.filters.addEventListener("click", (event) => {
  const button = event.target.closest(".filters__btn");
  if (!button) return;
  filter = /** @type {import("./tasks.js").Filter} */ (button.dataset.filter);
  for (const child of refs.filters.children) {
    child.classList.toggle("is-active", child === button);
  }
  paint();
});

refs.clearBtn.addEventListener("click", () => {
  tasks = tasksApi.clearCompleted(tasks);
  commit();
});

refs.themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  store.saveTheme(next);
  applyTheme(next, refs.themeToggle);
});

// Terapkan tema tersimpan. Skrip kecil di index.html sudah mencegah kedip
// sebelum CSS dimuat, di sini kita hanya menyinkronkan ikonnya.
applyTheme(store.loadTheme() ?? "dark", refs.themeToggle);

paint();