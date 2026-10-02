(function () {
  "use strict";

  var STORAGE_KEY = "project-belanin.tasks";
  var THEME_KEY = "project-belanin.theme";

  var form = document.getElementById("task-form");
  var input = document.getElementById("task-input");
  var dueInput = document.getElementById("task-due");
  var list = document.getElementById("tasks");
  var counter = document.getElementById("counter");
  var empty = document.getElementById("empty");
  var filters = document.getElementById("filters");
  var clearBtn = document.getElementById("clear-completed");
  var themeToggle = document.getElementById("theme-toggle");

  var tasks = load();
  var activeFilter = "semua";
  var draggedId = null;

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("Gagal memuat tugas:", err);
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.warn("Gagal menyimpan tugas:", err);
    }
  }

  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function pad(value) {
    return (value < 10 ? "0" : "") + value;
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function formatDue(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(d);
    } catch (err) {
      return iso;
    }
  }

  function isOverdue(task) {
    return !!task.due && !task.done && task.due < todayISO();
  }

  function indexOfTask(id) {
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) return i;
    }
    return -1;
  }

  function addTask(text, due) {
    var trimmed = text.trim();
    if (!trimmed) return;
    tasks.push({ id: makeId(), text: trimmed, done: false, due: due || null });
    save();
    input.value = "";
    dueInput.value = "";
    input.focus();
    render();
  }

  function toggleTask(id) {
    tasks.forEach(function (task) {
      if (task.id === id) task.done = !task.done;
    });
    save();
    render();
  }

  function removeTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    save();
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter(function (task) {
      return !task.done;
    });
    save();
    render();
  }

  function reorder(fromId, toId) {
    var from = indexOfTask(fromId);
    var to = indexOfTask(toId);
    if (from === -1 || to === -1 || from === to) return;
    var moved = tasks.splice(from, 1)[0];
    tasks.splice(to, 0, moved);
    save();
    render();
  }

  function visibleTasks() {
    if (activeFilter === "aktif") {
      return tasks.filter(function (t) {
        return !t.done;
      });
    }
    if (activeFilter === "selesai") {
      return tasks.filter(function (t) {
        return t.done;
      });
    }
    return tasks;
  }

  function buildTaskItem(task) {
    var li = document.createElement("li");
    li.className =
      "task" +
      (task.done ? " is-done" : "") +
      (isOverdue(task) ? " is-overdue" : "");
    li.draggable = true;
    li.dataset.id = task.id;

    li.addEventListener("dragstart", function (event) {
      draggedId = task.id;
      li.classList.add("is-dragging");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", task.id);
      }
    });
    li.addEventListener("dragend", function () {
      draggedId = null;
      li.classList.remove("is-dragging");
    });
    li.addEventListener("dragover", function (event) {
      event.preventDefault();
      if (draggedId && draggedId !== task.id) li.classList.add("is-drop-target");
    });
    li.addEventListener("dragleave", function () {
      li.classList.remove("is-drop-target");
    });
    li.addEventListener("drop", function (event) {
      event.preventDefault();
      li.classList.remove("is-drop-target");
      if (draggedId && draggedId !== task.id) reorder(draggedId, task.id);
    });

    var handle = document.createElement("span");
    handle.className = "task__handle";
    handle.textContent = "⠿";
    handle.setAttribute("aria-hidden", "true");

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task__check";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Tandai selesai: " + task.text);
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    var body = document.createElement("div");
    body.className = "task__body";

    var span = document.createElement("span");
    span.className = "task__text";
    span.textContent = task.text;
    span.title = "Klik ganda untuk mengubah";
    span.addEventListener("dblclick", function () {
      startEdit(task, span);
    });
    body.appendChild(span);

    if (task.due) {
      var due = document.createElement("span");
      due.className = "task__due";
      due.textContent = "📅 " + formatDue(task.due);
      body.appendChild(due);
    }

    var editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "task__icon";
    editBtn.textContent = "✏️";
    editBtn.setAttribute("aria-label", "Ubah tugas: " + task.text);
    editBtn.addEventListener("click", function () {
      startEdit(task, span);
    });

    var del = document.createElement("button");
    del.type = "button";
    del.className = "task__icon task__icon--danger";
    del.textContent = "🗑️";
    del.setAttribute("aria-label", "Hapus tugas: " + task.text);
    del.addEventListener("click", function () {
      removeTask(task.id);
    });

    li.appendChild(handle);
    li.appendChild(checkbox);
    li.appendChild(body);
    li.appendChild(editBtn);
    li.appendChild(del);
    return li;
  }

  function startEdit(task, spanEl) {
    if (!spanEl.parentNode) return;
    var parent = spanEl.parentNode;
    var edit = document.createElement("input");
    edit.type = "text";
    edit.className = "task__edit";
    edit.value = task.text;
    edit.maxLength = 120;
    edit.setAttribute("aria-label", "Ubah tugas");
    parent.replaceChild(edit, spanEl);
    edit.focus();
    if (edit.select) edit.select();

    var finished = false;
    function commit(apply) {
      if (finished) return;
      finished = true;
      var value = edit.value.trim();
      if (apply && value) {
        task.text = value;
        save();
      }
      render();
    }
    edit.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        commit(true);
      } else if (event.key === "Escape") {
        event.preventDefault();
        commit(false);
      }
    });
    edit.addEventListener("blur", function () {
      commit(true);
    });
  }

  function render() {
    var items = visibleTasks();
    list.innerHTML = "";

    items.forEach(function (task) {
      list.appendChild(buildTaskItem(task));
    });

    var remaining = tasks.filter(function (t) {
      return !t.done;
    }).length;
    counter.textContent = remaining + " tugas tersisa";

    if (items.length === 0) {
      empty.hidden = false;
      empty.textContent =
        tasks.length === 0
          ? "Belum ada tugas. Tambahkan satu di atas!"
          : "Tidak ada tugas pada filter ini.";
    } else {
      empty.hidden = true;
    }

    clearBtn.hidden = !tasks.some(function (t) {
      return t.done;
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask(input.value, dueInput.value || null);
  });

  filters.addEventListener("click", function (event) {
    var btn = event.target.closest(".filters__btn");
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    Array.prototype.forEach.call(filters.children, function (child) {
      child.classList.toggle("is-active", child === btn);
    });
    render();
  });

  clearBtn.addEventListener("click", clearCompleted);

  themeToggle.addEventListener("click", function () {
    var next =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "dark"
        : "light";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (err) {
      console.warn("Gagal menyimpan tema:", err);
    }
    applyTheme(next);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.textContent = theme === "light" ? "☀️" : "🌙";
      themeToggle.setAttribute(
        "aria-label",
        theme === "light" ? "Aktifkan tema gelap" : "Aktifkan tema terang"
      );
    }
  }

  try {
    var savedTheme = localStorage.getItem(THEME_KEY);
    applyTheme(savedTheme === "light" ? "light" : "dark");
  } catch (err) {
    applyTheme("dark");
  }

  render();
})();