import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { appStore, STORE_KEYS } from "./store";
import type { Company } from "./types";
import {
  DEFAULT_CATEGORY_ID,
  DEFAULT_SECTOR_ID,
  findSector,
  SECTORS,
} from "./sectors";

type AppStateValue = {
  ready: boolean;

  companies: Company[];
  activeCompany: Company | null;
  setActiveCompany: (id: string) => void;
  addCompany: (company: Omit<Company, "id" | "createdAt" | "initials">) => Promise<Company>;
  removeCompany: (id: string) => Promise<void>;

  activeSectorId: string;
  setActiveSectorId: (id: string) => void;
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

const ACCENTS = [
  "#2139b1",
  "#22d3ee",
  "#34d399",
  "#ffbe1a",
  "#f43f5e",
  "#a855f7",
  "#f97316",
];

function pickAccent(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return ACCENTS[hash % ACCENTS.length];
}

function makeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(null);
  const [activeSectorId, setActiveSectorIdState] = useState<string>(DEFAULT_SECTOR_ID);
  const [activeCategoryId, setActiveCategoryIdState] = useState<string>(DEFAULT_CATEGORY_ID);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const storedCompanies = (await appStore.get<Company[]>(STORE_KEYS.companies)) ?? [];
      const storedActiveCompany = await appStore.get<string>(STORE_KEYS.activeCompanyId);
      const storedSector = await appStore.get<string>(STORE_KEYS.activeSectorId);
      const storedCategory = await appStore.get<string>(STORE_KEYS.activeCategoryId);
      const storedCollapsed = await appStore.get<boolean>(STORE_KEYS.sidebarCollapsed);
      if (cancelled) return;
      setCompanies(storedCompanies);
      setActiveCompanyIdState(
        storedActiveCompany && storedCompanies.some((c) => c.id === storedActiveCompany)
          ? storedActiveCompany
          : storedCompanies[0]?.id ?? null,
      );
      if (storedSector && findSector(storedSector)) setActiveSectorIdState(storedSector);
      if (storedCategory) setActiveCategoryIdState(storedCategory);
      if (typeof storedCollapsed === "boolean") setSidebarCollapsed(storedCollapsed);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistCompanies = useCallback(async (next: Company[]) => {
    await appStore.set(STORE_KEYS.companies, next);
  }, []);

  const setActiveCompany = useCallback((id: string) => {
    setActiveCompanyIdState(id);
    void appStore.set(STORE_KEYS.activeCompanyId, id);
  }, []);

  const addCompany = useCallback<AppStateValue["addCompany"]>(
    async (input) => {
      const id = crypto.randomUUID();
      const company: Company = {
        id,
        name: input.name.trim(),
        path: input.path,
        initials: makeInitials(input.name),
        accent: input.accent ?? pickAccent(input.name),
        createdAt: new Date().toISOString(),
      };
      const next = [...companies, company];
      setCompanies(next);
      await persistCompanies(next);
      setActiveCompany(id);
      return company;
    },
    [companies, persistCompanies, setActiveCompany],
  );

  const removeCompany = useCallback(
    async (id: string) => {
      const next = companies.filter((c) => c.id !== id);
      setCompanies(next);
      await persistCompanies(next);
      if (activeCompanyId === id) {
        const fallback = next[0]?.id ?? null;
        setActiveCompanyIdState(fallback);
        if (fallback) await appStore.set(STORE_KEYS.activeCompanyId, fallback);
      }
    },
    [companies, activeCompanyId, persistCompanies],
  );

  const setActiveSectorId = useCallback((id: string) => {
    setActiveSectorIdState(id);
    void appStore.set(STORE_KEYS.activeSectorId, id);
    const first = SECTORS.find((s) => s.id === id)?.categories[0];
    if (first) {
      setActiveCategoryIdState(first.id);
      void appStore.set(STORE_KEYS.activeCategoryId, first.id);
    }
  }, []);

  const setActiveCategoryId = useCallback((id: string) => {
    setActiveCategoryIdState(id);
    void appStore.set(STORE_KEYS.activeCategoryId, id);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((v) => {
      const next = !v;
      void appStore.set(STORE_KEYS.sidebarCollapsed, next);
      return next;
    });
  }, []);

  const activeCompany = useMemo(
    () => companies.find((c) => c.id === activeCompanyId) ?? null,
    [companies, activeCompanyId],
  );

  const value: AppStateValue = {
    ready,
    companies,
    activeCompany,
    setActiveCompany,
    addCompany,
    removeCompany,
    activeSectorId,
    setActiveSectorId,
    activeCategoryId,
    setActiveCategoryId,
    sidebarCollapsed,
    toggleSidebar,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
