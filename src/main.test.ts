import { beforeEach, describe, expect, it, vi } from "vitest";

const FIXTURE = `
  <form id="task-form">
    <input id="task-input" />
    <input id="task-due" type="date" />
  </form>
  <div id="filters">
    <button class="filters__btn is-active" data-filter="semua"></button>
    <button class="filters__btn" data-filter="aktif"></button>
    <button class="filters__btn" data-filter="selesai"></button>
  </div>
  <ul id="tasks"></ul>
  <span id="counter"></span>
  <p id="empty"></p>
  <button id="clear-completed"></button>
  <button id="theme-toggle"></button>
`;

/** Menyiapkan DOM, lalu memuat ulang modul main agar wiring-nya berjalan. */
const boot = async () => {
  document.body.innerHTML = FIXTURE;
  document.documentElement.dataset.theme = "dark";
  vi.resetModules();
  await import("./main");
  return {
    form: document.querySelector<HTMLFormElement>("#task-form")!,
    input: document.querySelector<HTMLInputElement>("#task-input")!,
    list: document.querySelector<HTMLElement>("#tasks")!,
    counter: document.querySelector<HTMLElement>("#counter")!,
    empty: document.querySelector<HTMLElement>("#empty")!,
    filters: document.querySelector<HTMLElement>("#filters")!,
    clearBtn: document.querySelector<HTMLButtonElement>("#clear-completed")!,
    themeToggle: document.querySelector<HTMLButtonElement>("#theme-toggle")!,
  };
};

const addViaForm = (ui: Awaited<ReturnType<typeof boot>>, text: string): void => {
  ui.input.value = text;
  ui.form.dispatchEvent(new Event("submit", { cancelable: true }));
};

describe("integrasi aplikasi (main)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("menambah tugas lewat form dan menyimpannya", async () => {
    const ui = await boot();
    addViaForm(ui, "Belajar TS");
    expect(ui.list.children).toHaveLength(1);
    expect(ui.counter.textContent).toBe("1 tugas tersisa");
    expect(JSON.parse(localStorage.getItem("project-belanin.tasks")!)).toHaveLength(1);
    expect(ui.input.value).toBe("");
  });

  it("memuat tugas yang sudah tersimpan saat dibuka", async () => {
    localStorage.setItem(
      "project-belanin.tasks",
      JSON.stringify([{ id: "a", text: "Lama", done: false, due: null }]),
    );
    const ui = await boot();
    expect(ui.list.children).toHaveLength(1);
    expect(ui.list.textContent).toContain("Lama");
  });

  it("menandai selesai lalu menghapus yang selesai", async () => {
    const ui = await boot();
    addViaForm(ui, "Satu");
    ui.list.querySelector<HTMLInputElement>(".task__check")!.dispatchEvent(new Event("change"));
    expect(ui.list.querySelector(".task")!.classList.contains("is-done")).toBe(true);
    expect(ui.clearBtn.hidden).toBe(false);
    ui.clearBtn.click();
    expect(ui.list.children).toHaveLength(0);
  });

  it("menyaring tugas lewat tombol filter", async () => {
    const ui = await boot();
    addViaForm(ui, "Satu");
    ui.filters.querySelector<HTMLButtonElement>('[data-filter="selesai"]')!.click();
    expect(ui.list.children).toHaveLength(0);
    expect(ui.empty.textContent).toBe("Tidak ada tugas pada filter ini.");
    ui.filters.querySelector<HTMLButtonElement>('[data-filter="semua"]')!.click();
    expect(ui.list.children).toHaveLength(1);
  });

  it("mengganti tema dan menyimpannya", async () => {
    const ui = await boot();
    ui.themeToggle.click();
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("project-belanin.theme")).toBe("light");
    ui.themeToggle.click();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
