"use client";

import {useState, useTransition } from "react"
import GameCard from "./GameCard";
import { Game } from "@/generated/prisma/client";


interface GameListProps {
  games: Game[];
}

export default function GameList({ games }: GameListProps) {
  if (games.length === 0) {
    return (
      <p className="text-zinc-500">
        Aucun jeu à afficher.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
