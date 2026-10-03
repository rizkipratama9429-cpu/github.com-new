import { describe, expect, it } from "vitest";
import type { Task } from "./types";
import {
  addTask,
  clearCompleted,
  hasCompleted,
  remainingCount,
  removeTask,
  renameTask,
  reorder,
  toggleTask,
  visibleTasks,
} from "./tasks";
import { formatDue, isOverdue, makeId, todayISO } from "./utils";

const make = (over: Partial<Task> = {}): Task => ({
  id: "id",
  text: "Tugas",
  done: false,
  due: null,
  ...over,
});

describe("utils", () => {
  it("makeId menghasilkan string unik", () => {
    expect(typeof makeId()).toBe("string");
    expect(makeId()).not.toBe(makeId());
  });

  it("todayISO berformat YYYY-MM-DD", () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formatDue mengembalikan string kosong untuk input kosong", () => {
    expect(formatDue("")).toBe("");
  });

  it("formatDue memakai locale id-ID", () => {
    expect(formatDue("2026-10-03")).toContain("2026");
  });

  it("isOverdue hanya benar untuk tugas lampau yang belum selesai", () => {
    expect(isOverdue({ done: false, due: "2000-01-01" })).toBe(true);
    expect(isOverdue({ done: true, due: "2000-01-01" })).toBe(false);
    expect(isOverdue({ done: false, due: null })).toBe(false);
    expect(isOverdue({ done: false, due: "2999-01-01" })).toBe(false);
  });
});

describe("tasks (logika murni)", () => {
  it("addTask mengabaikan teks kosong dan tidak mengubah input", () => {
    const start: Task[] = [];
    expect(addTask(start, "   ")).toHaveLength(0);
    expect(start).toHaveLength(0);
  });

  it("addTask memangkas teks, menyimpan due, dan default belum selesai", () => {
    const [task] = addTask([], "  Belajar  ", "2000-01-01");
    expect(task.text).toBe("Belajar");
    expect(task.due).toBe("2000-01-01");
    expect(task.done).toBe(false);
  });

  it("addTask memberi due null bila tidak diisi", () => {
    expect(addTask([], "X")[0].due).toBeNull();
  });

  it("toggleTask membalik hanya tugas terkait (immutable)", () => {
    const list = [make({ id: "a" }), make({ id: "b" })];
    const next = toggleTask(list, "a");
    expect(next[0].done).toBe(true);
    expect(next[1].done).toBe(false);
    expect(list[0].done).toBe(false);
  });

  it("removeTask menghapus berdasarkan id", () => {
    const list = [make({ id: "a" }), make({ id: "b" })];
    expect(removeTask(list, "a").map((t) => t.id)).toEqual(["b"]);
  });

  it("renameTask memangkas dan mengabaikan teks kosong", () => {
    const list = [make({ id: "a", text: "Lama" })];
    expect(renameTask(list, "a", "  Baru ")[0].text).toBe("Baru");
    expect(renameTask(list, "a", "   ")[0].text).toBe("Lama");
  });

  it("clearCompleted menyisakan yang belum selesai", () => {
    const list = [make({ id: "a", done: true }), make({ id: "b" })];
    expect(clearCompleted(list).map((t) => t.id)).toEqual(["b"]);
  });

  it("reorder memindahkan item dan tetap immutable", () => {
    const list = [make({ id: "a" }), make({ id: "b" }), make({ id: "c" })];
    const next = reorder(list, "a", "c");
    expect(next.map((t) => t.id)).toEqual(["b", "c", "a"]);
    expect(list.map((t) => t.id)).toEqual(["a", "b", "c"]);
  });

  it("reorder tidak melakukan apa-apa bila id sama atau tidak ditemukan", () => {
    const list = [make({ id: "a" }), make({ id: "b" })];
    expect(reorder(list, "a", "a")).toBe(list);
    expect(reorder(list, "a", "zzz")).toBe(list);
  });

  it("visibleTasks menyaring sesuai filter", () => {
    const list = [make({ id: "a" }), make({ id: "b", done: true })];
    expect(visibleTasks(list, "semua")).toHaveLength(2);
    expect(visibleTasks(list, "aktif").map((t) => t.id)).toEqual(["a"]);
    expect(visibleTasks(list, "selesai").map((t) => t.id)).toEqual(["b"]);
  });

  it("remainingCount dan hasCompleted menghitung dengan benar", () => {
    const list = [make({ id: "a" }), make({ id: "b", done: true })];
    expect(remainingCount(list)).toBe(1);
    expect(hasCompleted(list)).toBe(true);
    expect(hasCompleted([make({ id: "c" })])).toBe(false);
  });
});
