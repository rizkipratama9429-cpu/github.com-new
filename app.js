(function () {
  "use strict";

  var STORAGE_KEY = "project-belanin.tasks";

  var form = document.getElementById("task-form");
  var input = document.getElementById("task-input");
  var list = document.getElementById("tasks");
  var counter = document.getElementById("counter");
  var empty = document.getElementById("empty");
  var filters = document.getElementById("filters");
  var clearBtn = document.getElementById("clear-completed");

  var tasks = load();
  var activeFilter = "semua";

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

  function addTask(text) {
    var trimmed = text.trim();
    if (!trimmed) return;
    tasks.push({ id: makeId(), text: trimmed, done: false });
    save();
    input.value = "";
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

  function render() {
    var items = visibleTasks();
    list.innerHTML = "";

    items.forEach(function (task) {
      var li = document.createElement("li");
      li.className = "task" + (task.done ? " is-done" : "");

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task__check";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", "Tandai selesai: " + task.text);
      checkbox.addEventListener("change", function () {
        toggleTask(task.id);
      });

      var span = document.createElement("span");
      span.className = "task__text";
      span.textContent = task.text;

      var del = document.createElement("button");
      del.type = "button";
      del.className = "task__delete";
      del.textContent = "Hapus";
      del.setAttribute("aria-label", "Hapus tugas: " + task.text);
      del.addEventListener("click", function () {
        removeTask(task.id);
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
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
    addTask(input.value);
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

  render();
})();