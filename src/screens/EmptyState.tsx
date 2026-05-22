import { ArrowRight, Building2, FolderLock, Lock } from "lucide-react";

type Props = {
  onCreateCompany: () => void;
};

export function EmptyState({ onCreateCompany }: Props) {
  return (
    <div className="h-full flex items-center justify-center p-10">
      <div className="max-w-[520px] text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-[var(--color-brand-soft)] blur-xl" />
          <div
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-[var(--color-brand-foreground)] shadow-[var(--shadow-md)]"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand), var(--color-brand-active))",
            }}
          >
            <Building2 size={32} strokeWidth={1.6} />
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          Comece criando sua empresa
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Cada empresa é um cofre local com todos os dados dela — clientes, projetos,
          equipe. Você escolhe a pasta no seu computador, e o Zenix Code só lê e escreve ali.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-2 text-left">
          <Feature
            icon={FolderLock}
            title="Dados ficam no seu computador"
            description="Sem cloud, sem servidor. Você é dono do diretório."
          />
          <Feature
            icon={Lock}
            title="Uma empresa, um cofre"
            description="Alterne entre empresas sem misturar dados — igual cofres do Obsidian."
          />
        </div>

        <button
          type="button"
          onClick={onCreateCompany}
          className="mt-8 inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-[var(--color-brand-foreground)] text-sm font-medium shadow-[var(--shadow-md)]"
        >
          Criar primeira empresa
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)]">
      <span className="w-8 h-8 rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0">
        <Icon size={15} />
      </span>
      <div>
        <p className="text-sm font-medium leading-tight">{title}</p>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">{description}</p>
      </div>
    </div>
  );
}
