import { getPublicGames } from '@/actions/games'

export default async function ExplorePage() {
  const games = await getPublicGames()

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">
          🌍 Collections publiques
        </h1>

        {games.length === 0 ? (
          <p className="text-zinc-500">
            Aucun jeu public pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-lg shadow p-4"
              >
                {game.imageUrl && (
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="h-40 w-full object-cover rounded mb-3"
                  />
                )}

                <h2 className="text-lg font-semibold">
                  {game.title}
                </h2>

                <p className="text-sm text-zinc-500">
                  Plateforme : {game.platform}
                </p>

                <p className="text-sm text-zinc-500">
                  Statut : {game.status}
                </p>

                {game.rating && (
                  <p className="text-sm text-yellow-500">
                    ⭐ {game.rating} / 5
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
