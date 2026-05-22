import { LazyStore } from "@tauri-apps/plugin-store";

export const appStore = new LazyStore("zenixcode.json", { autoSave: true, defaults: {} });

export const STORE_KEYS = {
  companies: "companies",
  activeCompanyId: "activeCompanyId",
  activeSectorId: "activeSectorId",
  activeCategoryId: "activeCategoryId",
  theme: "theme",
  sidebarCollapsed: "sidebarCollapsed",
} as const;
