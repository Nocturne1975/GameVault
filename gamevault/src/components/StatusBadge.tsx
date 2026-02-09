"use client";

import { GameStatus } from "@/generated/prisma/client";

interface StatusBadgeProps {
  status: GameStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Mapping des styles par statut pour une maintenance facile
  const statusConfig: Record<GameStatus, { label: string; className: string }> = {
    [GameStatus.A_JOUER]: {
      label: "À Jouer",
      className: "bg-blue-50 text-blue-700 border-blue-100",
    },
    [GameStatus.EN_COURS]: {
      label: "En Cours",
      className: "bg-amber-50 text-amber-700 border-amber-100",
    },
    [GameStatus.TERMINE]: {
      label: "Terminé",
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    [GameStatus.ABANDONNE]: {
      label: "Abandonné",
      className: "bg-rose-50 text-rose-700 border-rose-100",
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}>
      {config.label}
    </span>
  );
}