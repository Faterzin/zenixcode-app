import { ChevronDown, Plus, Check, Trash2, Folder } from "lucide-react";
import { useState } from "react";
import { useAppState } from "../lib/AppState";
import { Avatar } from "./ui/Avatar";
import { Popover } from "./ui/Popover";

type Props = {
  onCreateCompany: () => void;
};

export function CompanySwitcher({ onCreateCompany }: Props) {
  const { companies, activeCompany, setActiveCompany, removeCompany } = useAppState();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] transition-colors"
      >
        {activeCompany ? (
          <>
            <Avatar
              initials={activeCompany.initials}
              color={activeCompany.accent}
              size="sm"
            />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[11px] uppercase tracking-wide text-[var(--color-text-subtle)]">
                Empresa
              </span>
              <span className="text-sm font-medium text-[var(--color-text)] max-w-[160px] truncate">
                {activeCompany.name}
              </span>
            </div>
          </>
        ) : (
          <span className="text-sm text-[var(--color-text-muted)] px-1">
            Selecionar empresa
          </span>
        )}
        <ChevronDown
          size={14}
          className="text-[var(--color-text-subtle)] ml-1 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>

      <Popover open={open} onClose={() => setOpen(false)} anchor="right" className="w-[300px]">
        <div className="px-3 py-2.5 border-b border-[var(--color-border)]">
          <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-subtle)]">
            Suas empresas
          </p>
        </div>

        <ul className="py-1 max-h-[260px] overflow-y-auto">
          {companies.length === 0 && (
            <li className="px-3 py-4 text-sm text-[var(--color-text-muted)]">
              Nenhuma empresa cadastrada ainda.
            </li>
          )}
          {companies.map((c) => {
            const isActive = activeCompany?.id === c.id;
            return (
              <li key={c.id}>
                <div
                  className={`flex items-center gap-2.5 px-3 py-2 group cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[var(--color-brand-soft)]"
                      : "hover:bg-[var(--color-surface-3)]"
                  }`}
                  onClick={() => {
                    setActiveCompany(c.id);
                    setOpen(false);
                  }}
                >
                  <Avatar initials={c.initials} color={c.accent} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-[11px] text-[var(--color-text-subtle)] truncate flex items-center gap-1">
                      <Folder size={10} />
                      {c.path}
                    </p>
                  </div>
                  {isActive ? (
                    <Check size={14} className="text-[var(--color-brand)] shrink-0" />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remover "${c.name}" da lista?`)) void removeCompany(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[var(--color-text-subtle)] hover:text-[var(--color-danger)] transition p-1"
                      title="Remover"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-[var(--color-border)] p-1.5">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onCreateCompany();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm hover:bg-[var(--color-surface-3)] text-[var(--color-text)]"
          >
            <Plus size={14} className="text-[var(--color-brand)]" />
            Adicionar empresa
          </button>
        </div>
      </Popover>
    </div>
  );
}
