"use client";

import * as React from "react";
import type { Game, GameStatus } from "@/generated/prisma/client";
import { deleteGame, updateGame } from "@/actions/games";

function stars(rating: number | null) {
  const value = rating ?? 0;
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < value;
        return (
          <span key={i} className={filled ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        );
      })}
    </div>
  );
}

const STATUSES: GameStatus[] = ["A_JOUER", "EN_COURS", "TERMINE", "ABANDONNE"];

export default function GamesListClient({ games }: { games: Game[] }) {
  const [pendingId, setPendingId] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function onDelete(id: number) {
    const ok = window.confirm("Supprimer ce jeu ?");
    if (!ok) return;

    setError(null);
    setPendingId(id);
    try {
      await deleteGame(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la suppression.");
    } finally {
      setPendingId(null);
    }
  }

  async function onStatusChange(id: number, status: GameStatus) {
    setError(null);
    setPendingId(id);
    try {
      await updateGame(id, { status });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la mise à jour.");
    } finally {
      setPendingId(null);
    }
  }

  if (!games.length) {
    return (
      <div className="rounded-lg border bg-white p-6 text-sm text-gray-600">
        Aucun jeu pour l’instant. Ajoute-en un dans “Ajouter un jeu”.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <ul className="grid gap-3">
        {games.map((g) => (
          <li key={g.id} className="rounded-lg border bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{g.title}</h3>
                    <p className="text-sm text-gray-600">
                      {g.platform} • {g.status.replaceAll("_", " ")}
                    </p>
                  </div>
                </div>

                <div className="mt-2">{stars(g.rating)}</div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={g.status}
                  onChange={(e) => onStatusChange(g.id, e.target.value as GameStatus)}
                  disabled={pendingId === g.id}
                  className="rounded-md border px-2 py-1 text-sm"
                  aria-label={`Changer le statut de ${g.title}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => onDelete(g.id)}
                  disabled={pendingId === g.id}
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}