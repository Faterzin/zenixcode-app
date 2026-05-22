import type { Update } from "@tauri-apps/plugin-updater";

type UpdateState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "none" }
  | { status: "available"; update: Update }
  | { status: "downloading"; downloaded: number; total: number | null }
  | { status: "installed" }
  | { status: "error"; message: string };

type Props = {
  state: UpdateState;
  onInstall: () => void;
  onDismiss: () => void;
};

export function UpdateModal({ state, onInstall, onDismiss }: Props) {
  if (
    state.status === "idle" ||
    state.status === "checking" ||
    state.status === "none"
  )
    return null;

  const isAvailable = state.status === "available";
  const isDownloading = state.status === "downloading";
  const isInstalled = state.status === "installed";
  const isError = state.status === "error";

  const pct =
    isDownloading && state.total && state.downloaded
      ? Math.min(100, Math.round((state.downloaded / state.total) * 100))
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-[400px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] shadow-[var(--shadow-lg)] p-5">
        {isAvailable && (
          <>
            <h2 className="text-base font-semibold">Nova versão disponível</h2>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              Atualizar para{" "}
              <span className="text-[var(--color-brand)] font-medium">
                v{state.update.version}
              </span>
              .
            </p>
            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={onDismiss}
                className="px-3 h-9 text-sm rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-3)]"
              >
                Depois
              </button>
              <button
                onClick={onInstall}
                className="px-3.5 h-9 text-sm rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-[var(--color-brand-foreground)] font-medium"
              >
                Atualizar agora
              </button>
            </div>
          </>
        )}

        {isDownloading && (
          <>
            <h2 className="text-base font-semibold">Baixando atualização…</h2>
            <div className="mt-4">
              <div className="h-2 rounded bg-[var(--color-surface-3)] overflow-hidden">
                <div
                  className="h-full bg-[var(--color-brand)] transition-all"
                  style={{ width: `${pct ?? 8}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-[var(--color-text-subtle)]">
                {pct != null ? `${pct}%` : "preparando…"}
              </p>
            </div>
          </>
        )}

        {isInstalled && (
          <>
            <h2 className="text-base font-semibold">Atualização instalada</h2>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              Reiniciando o app…
            </p>
          </>
        )}

        {isError && (
          <>
            <h2 className="text-base font-semibold">Erro ao atualizar</h2>
            <p className="mt-2 text-sm text-[var(--color-danger)] break-words font-mono">
              {state.message}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={onDismiss}
                className="px-3 h-9 text-sm rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-3)]"
              >
                Fechar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
