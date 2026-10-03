/**
 * Lapisan tampilan: mengubah state menjadi DOM.
 * Modul ini hanya berbicara ke DOM; semua perhitungan diambil dari ./tasks.js.
 * @module render
 */
import { formatDue, isOverdue } from "./utils.js";
import { hasCompleted, remainingCount, visibleTasks } from "./tasks.js";

/**
 * Membuat elemen dengan class dan teks opsional.
 * @param {string} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElement}
 */
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

/**
 * @typedef {object} Handlers
 * @property {(id: string) => void} onToggle
 * @property {(id: string) => void} onRemove
 * @property {(id: string, text: string) => void} onRename
 * @property {(id: string) => void} onDragStart
 * @property {() => void} onDragEnd
 * @property {(id: string) => void} onDrop
 */

/**
 * Mengaktifkan mode ubah-di-tempat pada satu tugas.
 * Enter menyimpan, Escape membatalkan, dan kehilangan fokus ikut menyimpan.
 * @param {HTMLElement} textEl
 * @param {import("./tasks.js").Task} task
 * @param {Handlers} handlers
 * @returns {void}
 */
const startEdit = (textEl, task, handlers) => {
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
  const commit = (apply) => {
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

/**
 * Membangun satu elemen <li> tugas beserta seluruh interaksinya.
 * @param {import("./tasks.js").Task} task
 * @param {Handlers} handlers
 * @returns {HTMLLIElement}
 */
export const buildTaskItem = (task, handlers) => {
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

/**
 * @typedef {object} Refs
 * @property {HTMLFormElement} form
 * @property {HTMLInputElement} input
 * @property {HTMLInputElement} due
 * @property {HTMLElement} list
 * @property {HTMLElement} counter
 * @property {HTMLElement} empty
 * @property {HTMLElement} filters
 * @property {HTMLButtonElement} clearBtn
 * @property {HTMLButtonElement} themeToggle
 */

/**
 * Menggambar ulang seluruh daftar (daftar tugas, penghitung, pesan kosong).
 * @param {Refs} refs
 * @param {{ tasks: import("./tasks.js").Task[], filter: import("./tasks.js").Filter }} state
 * @param {Handlers} handlers
 * @returns {void}
 */
export const render = (refs, state, handlers) => {
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

/**
 * Menerapkan tema ke <html> dan memperbarui ikon tombolnya.
 * @param {"light" | "dark"} theme
 * @param {HTMLButtonElement | null} [toggle]
 * @returns {void}
 */
export const applyTheme = (theme, toggle) => {
  document.documentElement.dataset.theme = theme;
  if (!toggle) return;
  toggle.textContent = theme === "light" ? "☀️" : "🌙";
  toggle.setAttribute(
    "aria-label",
    theme === "light" ? "Aktifkan tema gelap" : "Aktifkan tema terang",
  );
};