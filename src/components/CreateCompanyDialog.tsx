import { open } from "@tauri-apps/plugin-dialog";
import { mkdir, exists } from "@tauri-apps/plugin-fs";
import { Folder, FolderOpen, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAppState } from "../lib/AppState";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CreateCompanyDialog({ open: isOpen, onClose }: Props) {
  const { addCompany } = useAppState();
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function pickFolder() {
    setError(null);
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Escolha a pasta da empresa",
      });
      if (typeof selected === "string") setPath(selected);
    } catch (e) {
      setError(String(e));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Dê um nome pra empresa.");
      return;
    }
    if (!path) {
      setError("Escolha onde guardar os dados.");
      return;
    }
    setSubmitting(true);
    try {
      try {
        const folderExists = await exists(path);
        if (!folderExists) await mkdir(path, { recursive: true });
      } catch {
        // pasta já existe ou caminho fora do escopo permitido — segue
      }
      await addCompany({ name, path });
      setName("");
      setPath("");
      onClose();
    } catch (e) {
      setError(String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <form
        onSubmit={submit}
        className="w-full max-w-[460px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] shadow-[var(--shadow-lg)] overflow-hidden"
      >
        <div className="flex items-start justify-between p-5 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Nova empresa</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Cada empresa é um cofre local — uma pasta com todos os dados dela.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 -mt-1 -mr-1 flex items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-3)]"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Nome da empresa">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Zenix Code"
              className="w-full px-3 h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] text-sm outline-none focus:border-[var(--color-brand)] transition-colors"
            />
          </Field>

          <Field label="Pasta de dados">
            <button
              type="button"
              onClick={pickFolder}
              className="w-full flex items-center gap-2 px-3 h-10 rounded-lg border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-1)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] transition-colors text-left"
            >
              {path ? (
                <FolderOpen size={15} className="text-[var(--color-brand)] shrink-0" />
              ) : (
                <Folder size={15} className="text-[var(--color-text-subtle)] shrink-0" />
              )}
              <span
                className={`text-sm truncate ${
                  path ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"
                }`}
              >
                {path || "Escolher pasta…"}
              </span>
            </button>
            <p className="text-[11px] text-[var(--color-text-subtle)] mt-1.5">
              Recomendado: crie uma pasta vazia dedicada (ex.: <span className="font-mono">~/ZenixVaults/MinhaEmpresa</span>).
            </p>
          </Field>

          {error && (
            <p className="text-sm text-[var(--color-danger)] font-mono break-words">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface-1)]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 h-9 rounded-lg text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 h-9 rounded-lg text-sm font-medium bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-[var(--color-brand-foreground)] disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            Criar empresa
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
