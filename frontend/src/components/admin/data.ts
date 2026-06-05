import type { ComponentProps } from "react";
import type { AdminIcon } from "./AdminIcon";

type IconName = ComponentProps<typeof AdminIcon>["name"];

export const navigation = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "Membros", icon: "members", href: "/admin/membros" },
  { label: "Gestão de Eventos", icon: "calendar", href: "/admin/eventos" },
  { label: "Brechôs", icon: "eco", href: "/admin/brechos" },
  { label: "Categorias", icon: "tag", href: "/admin/categorias" },
] satisfies { label: string; icon: IconName; href: string; active?: boolean }[];

export const flaggedItems = [
  {
    title: "Preço inconsistente: Blusa de seda",
    text: "Reportado por 3 usuárias por divergência com o valor informado na curadoria.",
    actions: ["Revisar", "Dispensar"],
  },
  {
    title: "Atividade suspeita: Vendedora #402",
    text: "Detecção automática sinalizou criação rápida de muitas peças em pouco tempo.",
    actions: ["Congelar conta", "Verificar"],
  },
];
