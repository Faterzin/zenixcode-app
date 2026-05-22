import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAppState } from "../lib/AppState";
import { findSector } from "../lib/sectors";

export function Sidebar() {
  const {
    activeSectorId,
    activeCategoryId,
    setActiveCategoryId,
    sidebarCollapsed,
    toggleSidebar,
  } = useAppState();
  const sector = findSector(activeSectorId);
  const collapsed = sidebarCollapsed;

  return (
    <aside
      className="shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface-1)] flex flex-col transition-all duration-200 ease-out"
      style={{ width: collapsed ? 60 : 232 }}
    >
      <div className="flex items-center justify-between px-3 h-12 border-b border-[var(--color-border)]">
        {!collapsed && (
          <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-subtle)]">
            {sector?.label}
          </p>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className="w-7 h-7 ml-auto flex items-center justify-center rounded-md text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {sector?.categories.length === 0 && !collapsed && (
          <p className="text-xs text-[var(--color-text-subtle)] px-2 py-2">
            Nenhuma categoria neste setor ainda.
          </p>
        )}
        {sector?.categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              disabled={cat.disabled}
              onClick={() => setActiveCategoryId(cat.id)}
              title={collapsed ? cat.label : undefined}
              className={`w-full flex items-center gap-2.5 px-2.5 h-9 rounded-md text-sm transition-colors group ${
                isActive
                  ? "bg-[var(--color-brand-soft)] text-[var(--color-text)]"
                  : cat.disabled
                    ? "text-[var(--color-text-faint)] cursor-not-allowed"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
              }`}
            >
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-md ${
                  isActive
                    ? "text-[var(--color-brand)]"
                    : "text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)]"
                }`}
              >
                <Icon size={15} />
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">{cat.label}</span>
                  {cat.badge && (
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
                      {cat.badge}
                    </span>
                  )}
                </>
              )}
              {isActive && (
                <span className="absolute left-0 w-0.5 h-5 rounded-r bg-[var(--color-brand)]" />
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-3 border-t border-[var(--color-border)]">
          <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">
            Zenix Code
          </p>
          <p className="text-[11px] text-[var(--color-text-subtle)] mt-0.5">
            Pré-lançamento — v0.0.3
          </p>
        </div>
      )}
    </aside>
  );
}
