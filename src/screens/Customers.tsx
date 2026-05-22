import { Plus, Search, Filter, Download, UserSquare2 } from "lucide-react";
import { useAppState } from "../lib/AppState";

export function CustomersScreen() {
  const { activeCompany } = useAppState();

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Clientes"
        breadcrumbs={[activeCompany?.name ?? "", "Gestão", "Clientes"]}
        actions={
          <>
            <SecondaryButton icon={Filter}>Filtros</SecondaryButton>
            <SecondaryButton icon={Download}>Exportar</SecondaryButton>
            <PrimaryButton icon={Plus}>Novo cliente</PrimaryButton>
          </>
        }
      />

      <div className="px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 max-w-md px-3 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] focus-within:border-[var(--color-brand)] transition-colors">
          <Search size={14} className="text-[var(--color-text-subtle)]" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF, e-mail…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-subtle)]"
          />
        </div>
      </div>

      <div className="flex-1 px-8 pb-8 pt-3 overflow-auto">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-[var(--color-text-subtle)] border-b border-[var(--color-border)]">
                <Th>Cliente</Th>
                <Th>Contato</Th>
                <Th>Tipo</Th>
                <Th>Status</Th>
                <Th className="text-right">Criado em</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="p-0">
                  <EmptyCustomers />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PageHeader({
  title,
  breadcrumbs,
  actions,
}: {
  title: string;
  breadcrumbs: string[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="px-8 pt-6 pb-1">
      <nav className="text-[11px] text-[var(--color-text-subtle)] flex items-center gap-1.5">
        {breadcrumbs.filter(Boolean).map((b, i, arr) => (
          <span key={i} className="flex items-center gap-1.5">
            {b}
            {i < arr.length - 1 && <span className="text-[var(--color-text-faint)]">/</span>}
          </span>
        ))}
      </nav>
      <div className="flex items-end justify-between mt-1.5">
        <h1 className="text-[26px] font-semibold tracking-tight">{title}</h1>
        <div className="flex items-center gap-1.5">{actions}</div>
      </div>
    </div>
  );
}

function PrimaryButton({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 px-3.5 h-9 rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-[var(--color-brand-foreground)] text-sm font-medium shadow-[var(--shadow-sm)]"
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

function SecondaryButton({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-3)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
    >
      <Icon size={13} />
      {children}
    </button>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-2.5 font-medium ${className}`}>{children}</th>;
}

function EmptyCustomers() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-subtle)] mb-4">
        <UserSquare2 size={20} />
      </div>
      <p className="text-base font-medium">Nenhum cliente cadastrado</p>
      <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-sm">
        Quando você adicionar clientes, eles aparecem aqui. A persistência local desta
        tela vai ser plugada nas próximas versões.
      </p>
      <button
        type="button"
        disabled
        className="mt-5 inline-flex items-center gap-2 px-3.5 h-9 rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-foreground)] text-sm font-medium opacity-60 cursor-not-allowed"
      >
        <Plus size={14} />
        Adicionar cliente
      </button>
    </div>
  );
}
