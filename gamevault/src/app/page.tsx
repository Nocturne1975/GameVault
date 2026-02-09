import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
      {/* Hero Section */}
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 mb-6">
        Gérez votre collection de <br />
        <span className="text-blue-600 italic">jeux vidéo</span>
      </h1>
      
      <p className="max-w-2xl text-lg text-zinc-500 mb-10">
        GameVault est votre coffre-fort personnel pour suivre vos jeux terminés, 
        ceux en cours et votre liste de souhaits. Partagez votre passion avec la communauté.
      </p>

      {/* Boutons d'action conditionnels */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <SignedOut>
          <SignUpButton mode="modal">
            <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-zinc-800 transition shadow-lg">
              Commencer gratuitement
            </button>
          </SignUpButton>
          
          <Link 
            href="/explore" 
            className="border border-zinc-200 px-8 py-3 rounded-full font-bold hover:bg-zinc-50 transition"
          >
            Explorer les collections
          </Link>
        </SignedOut>

        <SignedIn>
          <Link 
            href="/dashboard" 
            className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-zinc-800 transition shadow-lg"
          >
            Accéder à mon Dashboard
          </Link>
          
          <Link 
            href="/explore" 
            className="border border-zinc-200 px-8 py-3 rounded-full font-bold hover:bg-zinc-50 transition"
          >
            Voir les jeux publics
          </Link>
        </SignedIn>
      </div>

      {/* Étape 5.2 : Indice visuel inspiré des dashboards modernes */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <FeatureCard 
          title="Suivi Complet" 
          description="Gardez un œil sur votre progression, vos notes et vos plateformes préférées." 
        />
        <FeatureCard 
          title="Statistiques" 
          description="Visualisez la répartition de votre collection avec des graphiques clairs." 
        />
        <FeatureCard 
          title="Communauté" 
          description="Rendez votre collection publique pour inspirer d'autres joueurs." 
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm text-left">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}