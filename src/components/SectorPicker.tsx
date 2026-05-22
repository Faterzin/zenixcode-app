import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { useAppState } from "../lib/AppState";
import { findSector, SECTORS } from "../lib/sectors";
import { Popover } from "./ui/Popover";

export function SectorPicker() {
  const { activeSectorId, setActiveSectorId } = useAppState();
  const [open, setOpen] = useState(false);
  const active = findSector(activeSectorId);
  if (!active) return null;
  const Icon = active.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] transition-colors"
      >
        <span className="w-6 h-6 rounded-md flex items-center justify-center bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
          <Icon size={14} />
        </span>
        <span className="text-sm font-medium">{active.label}</span>
        <ChevronDown
          size={14}
          className="text-[var(--color-text-subtle)] transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>

      <Popover open={open} onClose={() => setOpen(false)} anchor="left" className="w-[260px]">
        <ul className="py-1.5">
          {SECTORS.map((s) => {
            const SIcon = s.icon;
            const isActive = activeSectorId === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={s.disabled}
                  onClick={() => {
                    setActiveSectorId(s.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    s.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : isActive
                        ? "bg-[var(--color-brand-soft)]"
                        : "hover:bg-[var(--color-surface-3)]"
                  }`}
                >
                  <span className="w-7 h-7 rounded-md flex items-center justify-center bg-[var(--color-surface-3)]">
                    <SIcon size={14} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{s.label}</p>
                    {s.description && (
                      <p className="text-[11px] text-[var(--color-text-subtle)] truncate">
                        {s.description}
                      </p>
                    )}
                  </div>
                  {isActive && <Check size={14} className="text-[var(--color-brand)]" />}
                </button>
              </li>
            );
          })}
        </ul>
      </Popover>
    </div>
  );
}
