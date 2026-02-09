'use client'
import { Game, GameStatus } from "@/generated/prisma/client";


type StatusStats = Record<GameStatus, number>;

export default function Stats({ games }: { games: Game[] }) {
    const total = games.length;
    
    const gamesWithRating = games.filter(g => g.rating);
    const avgRating = gamesWithRating.length > 0 
        ? (gamesWithRating.reduce((acc, g) => acc + (g.rating || 0), 0) / gamesWithRating.length).toFixed(1)
        : "0";

    
    const statsByStatus = games.reduce((acc, g) => {
        acc[g.status] = (acc[g.status] || 0) + 1;
        return acc;
    }, {} as Partial<StatusStats>); 

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total" value={total} />
            <StatCard label="Note Moyenne" value={`${avgRating}/5`} />
            <StatCard label="Terminés" value={statsByStatus[GameStatus.TERMINE] || 0} />
            <StatCard label="En cours" value={statsByStatus[GameStatus.EN_COURS] || 0} />
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-100 text-center hover:shadow-md transition-shadow">
      <p className="text-xs text-zinc-500 uppercase font-bold">{label}</p>
      <p className="text-2xl font-black mt-1 text-zinc-900">{value}</p>
    </div>
  );
}