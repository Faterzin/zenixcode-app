import { Bell, Search, Settings } from "lucide-react";
import { CompanySwitcher } from "./CompanySwitcher";
import { SectorPicker } from "./SectorPicker";

type Props = {
  onCreateCompany: () => void;
};

export function TopBar({ onCreateCompany }: Props) {
  return (
    <header
      className="flex items-center gap-3 px-4 h-14 border-b border-[var(--color-border)] glass relative z-30"
      data-tauri-drag-region
    >
      <div className="flex items-center gap-2 mr-1 pointer-events-none">
        <img src="/icon.svg" alt="" className="w-7 h-7" onError={(e) => (e.currentTarget.style.display = "none")} />
        <span className="font-semibold tracking-tight text-[15px]">Zenix Code</span>
      </div>

      <div className="pointer-events-auto">
        <SectorPicker />
      </div>

      <div className="flex-1 max-w-[520px] mx-3 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-border-strong)] focus-within:border-[var(--color-brand)] transition-colors">
          <Search size={14} className="text-[var(--color-text-subtle)] shrink-0" />
          <input
            type="text"
            placeholder="Buscar"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-subtle)]"
          />
          <kbd className="text-[10px] text-[var(--color-text-faint)] font-mono border border-[var(--color-border)] px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pointer-events-auto">
        <IconButton ariaLabel="Notificações">
          <Bell size={15} />
        </IconButton>
        <IconButton ariaLabel="Configurações">
          <Settings size={15} />
        </IconButton>
        <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
        <CompanySwitcher onCreateCompany={onCreateCompany} />
      </div>
    </header>
  );
}

function IconButton({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)] transition-colors"
    >
      {children}
    </button>
  );
}
