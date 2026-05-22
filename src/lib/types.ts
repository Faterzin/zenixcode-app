import type { LucideIcon } from "lucide-react";

export type Company = {
  id: string;
  name: string;
  path: string;
  /** Inicial mostrada no avatar quando não há logo */
  initials: string;
  /** Cor de destaque por empresa (HEX). Usada no badge do switcher. */
  accent?: string;
  createdAt: string;
};

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Marcador "Novo" no menu */
  badge?: string;
  /** Categorias ainda não implementadas */
  disabled?: boolean;
};

export type Sector = {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  categories: Category[];
  /** Setores que ainda não têm conteúdo */
  disabled?: boolean;
};
