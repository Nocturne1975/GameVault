import Link from "next/link";
import { getUserGames } from "@/actions/games"; 
import Stats from "@/components/Stats";
import GamesListClient from "@/components/GamesListClient";

export default async function DashboardPage() {
    // Récupération des données côté serveur (Critère Étape 4.2)
    const games = await getUserGames();

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Mes jeux</h1>
                    <p className="text-sm text-zinc-500 italic">Votre collection personnelle</p>
                </div>

                <Link
                    href="/dashboard/add"
                    className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
                >
                    + Ajouter un jeu
                </Link>    
            </header>

            {/* Composant de statistiques (Étape 5.1 & 5.2) */}
            <Stats games={games} />

            {/* Liste interactive (Bonus recherche/filtre) */}
            <div className="mt-4">
                <GamesListClient initialGames={games} />
            </div>
        </div>
    );
}