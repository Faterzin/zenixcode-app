import { Construction } from "lucide-react";

type Props = {
  title: string;
  hint?: string;
};

export function PlaceholderScreen({ title, hint }: Props) {
  return (
    <div className="h-full flex items-center justify-center p-10">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-subtle)] mb-4">
          <Construction size={22} />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {hint ?? "Essa área ainda não foi construída — vamos chegar nela em uma versão futura."}
        </p>
      </div>
    </div>
  );
}
