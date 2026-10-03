/**
 * Lapisan tampilan: mengubah state menjadi DOM.
 * Modul ini hanya berbicara ke DOM; semua perhitungan diambil dari ./tasks.
 * @module render
 */
import type { Filter, Task, Theme } from "./types";
import { formatDue, isOverdue } from "./utils";
import { hasCompleted, remainingCount, visibleTasks } from "./tasks";

/** Elemen-elemen DOM yang dipakai aplikasi. */
export interface Refs {
  form: HTMLFormElement;
  input: HTMLInputElement;
  due: HTMLInputElement;
  list: HTMLElement;
  counter: HTMLElement;
  empty: HTMLElement;
  filters: HTMLElement;
  clearBtn: HTMLButtonElement;
  themeToggle: HTMLButtonElement;
}

/** Aksi yang dipicu oleh interaksi pengguna. */
export interface Handlers {
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, text: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
}

/** Membuat elemen dengan class dan teks opsional. */
const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

/**
 * Mengaktifkan mode ubah-di-tempat pada satu tugas.
 * Enter menyimpan, Escape membatalkan, dan kehilangan fokus ikut menyimpan.
 */
const startEdit = (textEl: HTMLElement, task: Task, handlers: Handlers): void => {
  const parent = textEl.parentNode;
  if (!parent) return;

  const edit = document.createElement("input");
  edit.type = "text";
  edit.className = "task__edit";
  edit.value = task.text;
  edit.maxLength = 120;
  edit.setAttribute("aria-label", "Ubah tugas");
  parent.replaceChild(edit, textEl);
  edit.focus();
  edit.select?.();

  let finished = false;
  const commit = (apply: boolean): void => {
    if (finished) return;
    finished = true;
    handlers.onRename(task.id, apply ? edit.value : task.text);
  };

  edit.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit(true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      commit(false);
    }
  });
  edit.addEventListener("blur", () => commit(true));
};

/** Membangun satu elemen <li> tugas beserta seluruh interaksinya. */
export const buildTaskItem = (task: Task, handlers: Handlers): HTMLLIElement => {
  const item = el("li", "task");
  item.classList.toggle("is-done", task.done);
  item.classList.toggle("is-overdue", isOverdue(task));
  item.draggable = true;
  item.dataset.id = task.id;

  const handle = el("span", "task__handle", "⠿");
  handle.setAttribute("aria-hidden", "true");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task__check";
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", `Tandai selesai: ${task.text}`);
  checkbox.addEventListener("change", () => handlers.onToggle(task.id));

  const body = el("div", "task__body");

  const text = el("span", "task__text", task.text);
  text.title = "Klik ganda untuk mengubah";
  text.addEventListener("dblclick", () => startEdit(text, task, handlers));
  body.append(text);

  if (task.due) {
    body.append(el("span", "task__due", `📅 ${formatDue(task.due)}`));
  }

  const editBtn = el("button", "task__icon", "✏️");
  editBtn.type = "button";
  editBtn.setAttribute("aria-label", `Ubah tugas: ${task.text}`);
  editBtn.addEventListener("click", () => startEdit(text, task, handlers));

  const deleteBtn = el("button", "task__icon task__icon--danger", "🗑️");
  deleteBtn.type = "button";
  deleteBtn.setAttribute("aria-label", `Hapus tugas: ${task.text}`);
  deleteBtn.addEventListener("click", () => handlers.onRemove(task.id));

  item.addEventListener("dragstart", (event) => {
    handlers.onDragStart(task.id);
    item.classList.add("is-dragging");
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", task.id);
    }
  });
  item.addEventListener("dragend", () => {
    handlers.onDragEnd();
    item.classList.remove("is-dragging");
  });
  item.addEventListener("dragover", (event) => {
    event.preventDefault();
    item.classList.add("is-drop-target");
  });
  item.addEventListener("dragleave", () => item.classList.remove("is-drop-target"));
  item.addEventListener("drop", (event) => {
    event.preventDefault();
    item.classList.remove("is-drop-target");
    handlers.onDrop(task.id);
  });

  item.append(handle, checkbox, body, editBtn, deleteBtn);
  return item;
};

/** State minimal yang dibutuhkan untuk menggambar tampilan. */
export interface ViewState {
  tasks: Task[];
  filter: Filter;
}

/** Menggambar ulang seluruh daftar (daftar tugas, penghitung, pesan kosong). */
export const render = (refs: Refs, state: ViewState, handlers: Handlers): void => {
  const items = visibleTasks(state.tasks, state.filter);
  refs.list.replaceChildren(...items.map((task) => buildTaskItem(task, handlers)));

  refs.counter.textContent = `${remainingCount(state.tasks)} tugas tersisa`;

  const isEmpty = items.length === 0;
  refs.empty.hidden = !isEmpty;
  if (isEmpty) {
    refs.empty.textContent =
      state.tasks.length === 0
        ? "Belum ada tugas. Tambahkan satu di atas!"
        : "Tidak ada tugas pada filter ini.";
  }

  refs.clearBtn.hidden = !hasCompleted(state.tasks);
};

/** Menerapkan tema ke <html> dan memperbarui ikon tombolnya. */
export const applyTheme = (theme: Theme, toggle?: HTMLButtonElement | null): void => {
  document.documentElement.dataset.theme = theme;
  if (!toggle) return;
  toggle.textContent = theme === "light" ? "☀️" : "🌙";
  toggle.setAttribute(
    "aria-label",
    theme === "light" ? "Aktifkan tema gelap" : "Aktifkan tema terang",
  );
};
