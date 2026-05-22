import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { useEffect, useState } from "react";
import "./App.css";
import { AppStateProvider, useAppState } from "./lib/AppState";
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { CreateCompanyDialog } from "./components/CreateCompanyDialog";
import { EmptyState } from "./screens/EmptyState";
import { CustomersScreen } from "./screens/Customers";
import { PlaceholderScreen } from "./screens/Placeholder";
import { findSector } from "./lib/sectors";
import { UpdateModal } from "./components/UpdateModal";

type UpdateState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "none" }
  | { status: "available"; update: Update }
  | { status: "downloading"; downloaded: number; total: number | null }
  | { status: "installed" }
  | { status: "error"; message: string };

export default function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  );
}

function AppShell() {
  const { ready, activeCompany, activeSectorId, activeCategoryId } = useAppState();
  const [createOpen, setCreateOpen] = useState(false);
  const [update, setUpdate] = useState<UpdateState>({ status: "idle" });

  useEffect(() => {
    setUpdate({ status: "checking" });
    check()
      .then((result) =>
        result ? setUpdate({ status: "available", update: result }) : setUpdate({ status: "none" }),
      )
      .catch((err) => setUpdate({ status: "error", message: String(err) }));
  }, []);

  async function installUpdate() {
    if (update.status !== "available") return;
    const u = update.update;
    let downloaded = 0;
    let total: number | null = null;
    setUpdate({ status: "downloading", downloaded: 0, total: null });
    try {
      await u.downloadAndInstall((event) => {
        if (event.event === "Started") {
          total = event.data.contentLength ?? null;
          setUpdate({ status: "downloading", downloaded: 0, total });
        } else if (event.event === "Progress") {
          downloaded += event.data.chunkLength;
          setUpdate({ status: "downloading", downloaded, total });
        } else if (event.event === "Finished") {
          setUpdate({ status: "installed" });
        }
      });
      await relaunch();
    } catch (err) {
      setUpdate({ status: "error", message: String(err) });
    }
  }

  if (!ready) {
    return <SplashScreen />;
  }

  const showEmpty = !activeCompany;

  return (
    <div className="h-screen flex flex-col bg-[var(--color-surface-0)] text-[var(--color-text)]">
      <TopBar onCreateCompany={() => setCreateOpen(true)} />

      {showEmpty ? (
        <main className="flex-1 overflow-hidden">
          <EmptyState onCreateCompany={() => setCreateOpen(true)} />
        </main>
      ) : (
        <div className="flex-1 flex min-h-0">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-hidden">
            <ContentRouter sectorId={activeSectorId} categoryId={activeCategoryId} />
          </main>
        </div>
      )}

      <CreateCompanyDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      <UpdateModal state={update} onInstall={installUpdate} onDismiss={() => setUpdate({ status: "none" })} />
    </div>
  );
}

function ContentRouter({ sectorId, categoryId }: { sectorId: string; categoryId: string }) {
  const sector = findSector(sectorId);
  if (!sector) return <PlaceholderScreen title="Setor não encontrado" />;
  const cat = sector.categories.find((c) => c.id === categoryId);

  if (sectorId === "gestao" && categoryId === "clientes") return <CustomersScreen />;

  if (cat?.disabled || !cat) {
    return (
      <PlaceholderScreen
        title={cat?.label ?? sector.label}
        hint="Esta categoria ainda não tem conteúdo. Continua aparecendo aqui pra mostrar a estrutura."
      />
    );
  }

  return <PlaceholderScreen title={cat.label} />;
}

function SplashScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-[var(--color-surface-0)]">
      <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
        <div className="w-2 h-2 rounded-full bg-[var(--color-brand)] animate-pulse" />
        <span className="text-sm">Carregando…</span>
      </div>
    </div>
  );
}
