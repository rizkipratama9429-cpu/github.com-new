import { describe, expect, it, vi } from "vitest";
import { applyTheme, buildTaskItem, render } from "./render";
import type { Handlers, Refs } from "./render";
import type { Task } from "./types";

const make = (over: Partial<Task> = {}): Task => ({
  id: "t1",
  text: "Halo",
  done: false,
  due: null,
  ...over,
});

const handlers = (): Handlers => ({
  onToggle: vi.fn(),
  onRemove: vi.fn(),
  onRename: vi.fn(),
  onDragStart: vi.fn(),
  onDragEnd: vi.fn(),
  onDrop: vi.fn(),
});

const refs = (): Refs => ({
  form: document.createElement("form"),
  input: document.createElement("input"),
  due: document.createElement("input"),
  list: document.createElement("ul"),
  counter: document.createElement("span"),
  empty: document.createElement("p"),
  filters: document.createElement("div"),
  clearBtn: document.createElement("button"),
  themeToggle: document.createElement("button"),
});

describe("buildTaskItem", () => {
  it("membuat <li> dengan struktur dan atribut yang benar", () => {
    const item = buildTaskItem(make(), handlers());
    expect(item.tagName).toBe("LI");
    expect(item.children).toHaveLength(5);
    expect(item.draggable).toBe(true);
    expect(item.dataset.id).toBe("t1");
  });

  it("menandai tugas yang lewat tenggat", () => {
    const item = buildTaskItem(make({ due: "2000-01-01" }), handlers());
    expect(item.classList.contains("is-overdue")).toBe(true);
    expect(item.querySelector(".task__due")?.textContent).toContain("📅");
  });

  it("tidak menampilkan tenggat bila tidak ada", () => {
    expect(buildTaskItem(make(), handlers()).querySelector(".task__due")).toBeNull();
  });

  it("memanggil onToggle saat checkbox diubah", () => {
    const h = handlers();
    const check = buildTaskItem(make(), h).querySelector<HTMLInputElement>(".task__check")!;
    check.dispatchEvent(new Event("change"));
    expect(h.onToggle).toHaveBeenCalledWith("t1");
  });

  it("memanggil onRemove saat tombol hapus diklik", () => {
    const h = handlers();
    buildTaskItem(make(), h).querySelector<HTMLButtonElement>(".task__icon--danger")!.click();
    expect(h.onRemove).toHaveBeenCalledWith("t1");
  });

  it("menyimpan hasil ubah-di-tempat lewat Enter", () => {
    const h = handlers();
    const item = buildTaskItem(make(), h);
    item.querySelector<HTMLElement>(".task__text")!.dispatchEvent(new MouseEvent("dblclick"));
    const edit = item.querySelector<HTMLInputElement>(".task__edit")!;
    edit.value = "Baru";
    edit.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(h.onRename).toHaveBeenCalledWith("t1", "Baru");
  });

  it("membatalkan ubah-di-tempat lewat Escape", () => {
    const h = handlers();
    const item = buildTaskItem(make(), h);
    item.querySelector<HTMLElement>(".task__text")!.dispatchEvent(new MouseEvent("dblclick"));
    const edit = item.querySelector<HTMLInputElement>(".task__edit")!;
    edit.value = "Diabaikan";
    edit.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(h.onRename).toHaveBeenCalledWith("t1", "Halo");
  });

  it("memicu onDragStart dan onDrop", () => {
    const h = handlers();
    const item = buildTaskItem(make(), h);
    item.dispatchEvent(new Event("dragstart"));
    item.dispatchEvent(new Event("drop"));
    expect(h.onDragStart).toHaveBeenCalledWith("t1");
    expect(h.onDrop).toHaveBeenCalledWith("t1");
  });
});

describe("render", () => {
  const sample: Task[] = [
    { id: "a", text: "A", done: false, due: null },
    { id: "b", text: "B", done: true, due: null },
  ];

  it("menggambar daftar, penghitung, dan tombol hapus-selesai", () => {
    const r = refs();
    render(r, { tasks: sample, filter: "semua" }, handlers());
    expect(r.list.children).toHaveLength(2);
    expect(r.counter.textContent).toBe("1 tugas tersisa");
    expect(r.empty.hidden).toBe(true);
    expect(r.clearBtn.hidden).toBe(false);
  });

  it("menampilkan pesan saat daftar sepenuhnya kosong", () => {
    const r = refs();
    render(r, { tasks: [], filter: "semua" }, handlers());
    expect(r.empty.hidden).toBe(false);
    expect(r.empty.textContent).toBe("Belum ada tugas. Tambahkan satu di atas!");
    expect(r.clearBtn.hidden).toBe(true);
  });

  it("menyaring sesuai filter", () => {
    const r = refs();
    render(r, { tasks: sample, filter: "selesai" }, handlers());
    expect(r.list.children).toHaveLength(1);
  });

  it("memakai pesan berbeda saat filter tidak menghasilkan apa pun", () => {
    const r = refs();
    render(
      r,
      { tasks: [{ id: "c", text: "C", done: false, due: null }], filter: "selesai" },
      handlers(),
    );
    expect(r.empty.textContent).toBe("Tidak ada tugas pada filter ini.");
  });
});

describe("applyTheme", () => {
  it("mengatur data-theme dan ikon tombol", () => {
    const toggle = document.createElement("button");
    applyTheme("light", toggle);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(toggle.textContent).toBe("☀️");
    applyTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
