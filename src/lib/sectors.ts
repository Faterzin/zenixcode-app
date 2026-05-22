import {
  Briefcase,
  DollarSign,
  Users2,
  BarChart3,
  Megaphone,
  FolderKanban,
  UserSquare2,
  ListChecks,
} from "lucide-react";
import type { Sector } from "./types";

/**
 * Sectors disponíveis no app. Por enquanto só "Gestão" tem conteúdo.
 * Os demais aparecem no seletor mas não navegam.
 */
export const SECTORS: Sector[] = [
  {
    id: "gestao",
    label: "Gestão",
    icon: Briefcase,
    description: "Operação geral da empresa",
    categories: [
      { id: "clientes", label: "Clientes", icon: UserSquare2 },
      { id: "projetos", label: "Projetos", icon: FolderKanban, disabled: true },
      { id: "equipe", label: "Equipe", icon: Users2, disabled: true },
      { id: "tarefas", label: "Tarefas", icon: ListChecks, disabled: true },
    ],
  },
  {
    id: "financeiro",
    label: "Financeiro",
    icon: DollarSign,
    description: "Em breve",
    categories: [],
    disabled: true,
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Megaphone,
    description: "Em breve",
    categories: [],
    disabled: true,
  },
  {
    id: "relatorios",
    label: "Relatórios",
    icon: BarChart3,
    description: "Em breve",
    categories: [],
    disabled: true,
  },
];

export const DEFAULT_SECTOR_ID = "gestao";
export const DEFAULT_CATEGORY_ID = "clientes";

export function findSector(id: string | null): Sector | undefined {
  return SECTORS.find((s) => s.id === id);
}
