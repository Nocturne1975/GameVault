"use client"

import {Game, GameStatus} from "@/generated/prisma/client";
import { deleteGame, updateGame} from "@/actions/games";
import { useState } from "react";

interface GameCardProps{
    game: Game;
}

export default function GameCard ({game}: GameCardProps){
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm ("Voulez-vous supprimmer ce jeu?")){
            try{
                await deleteGame(game.id);
            } catch(error){
                alert("Erreur de supprimer ce jeu");
                setIsDeleting(false);
            }
        }
    };

    const handleChangeStatus = async (newStatus: string) => {
        try{
          await updateGame(game.id, {status: newStatus as GameStatus})
        } catch(error){
            alert("Erreur de modifier ce jeu");
        }
    };
return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2 py-1 rounded">
          {game.platform}
        </span>
        <div className="flex text-yellow-500 text-sm">
          {game.rating ? "★".repeat(game.rating) : "—"}
        </div>
      </div>

      <h3 className="text-xl font-bold text-zinc-900 truncate mb-4">
        {game.title}
      </h3>

      <div className="flex flex-col gap-3">
        {/* Sélecteur de statut pour l'Étape 4.2 */}
        <select 
          defaultValue={game.status}
          onChange={(e) => handleChangeStatus(e.target.value)}
          className="text-xs font-semibold bg-zinc-100 border-none rounded-lg p-2 focus:ring-2 focus:ring-black"
        >
          <option value="A_JOUER">À JOUER</option>
          <option value="EN_COURS">EN COURS</option>
          <option value="TERMINE">TERMINÉ</option>
          <option value="ABANDONNE">ABANDONNÉ</option>
        </select>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs text-red-500 font-medium hover:bg-red-50 p-2 rounded-lg transition text-center disabled:opacity-50"
        >
          {isDeleting ? "Suppression..." : "Supprimer du coffre"}
        </button>
      </div>
    </div>
  );
}