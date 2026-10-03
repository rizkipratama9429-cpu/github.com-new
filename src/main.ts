/**
 * Titik masuk aplikasi: menyambungkan state, DOM, dan localStorage.
 * @module main
 */
import "./style.css";
import type { Filter, Task } from "./types";
import * as store from "./storage";
import * as tasksApi from "./tasks";
import { applyTheme, render, type Handlers, type Refs } from "./render";

const refs: Refs = {
  form: document.querySelector<HTMLFormElement>("#task-form")!,
  input: document.querySelector<HTMLInputElement>("#task-input")!,
  due: document.querySelector<HTMLInputElement>("#task-due")!,
  list: document.querySelector<HTMLElement>("#tasks")!,
  counter: document.querySelector<HTMLElement>("#counter")!,
  empty: document.querySelector<HTMLElement>("#empty")!,
  filters: document.querySelector<HTMLElement>("#filters")!,
  clearBtn: document.querySelector<HTMLButtonElement>("#clear-completed")!,
  themeToggle: document.querySelector<HTMLButtonElement>("#theme-toggle")!,
};

let tasks: Task[] = store.loadTasks();
let filter: Filter = "semua";
let draggedId: string | null = null;

const handlers: Handlers = {
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

/** Gambar ulang tampilan dari state saat ini. */
function paint(): void {
  render(refs, { tasks, filter }, handlers);
}

/** Simpan ke localStorage lalu gambar ulang. */
function commit(): void {
  store.saveTasks(tasks);
  paint();
}

refs.form.addEventListener("submit", (event) => {
  event.preventDefault();
  tasks = tasksApi.addTask(tasks, refs.input.value, refs.due.value || null);
  refs.input.value = "";
  refs.due.value = "";
  refs.input.focus();
  commit();
});

refs.filters.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(".filters__btn");
  if (!button) return;
  filter = button.dataset.filter as Filter;
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
