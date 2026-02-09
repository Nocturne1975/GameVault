"use client";

interface RatingStarsProps {
  rating: number | null;
  max?: number;
}

export default function RatingStars({ rating, max = 5 }: RatingStarsProps) {
  // Si aucune note n'est fournie, afficher un texte neutre
  if (rating === null || rating === 0) {
    return <span className="text-zinc-400 text-xs italic">Non noté</span>;
  }

  return (
    <div className="flex items-center gap-0.5" aria-label={`Note de ${rating} sur ${max}`}>
      {[...Array(max)].map((_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;

        return (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFilled ? "currentColor" : "none"}
            stroke="currentColor"
            className={`w-4 h-4 ${
              isFilled ? "text-yellow-400" : "text-zinc-300"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.837-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        );
      })}
    </div>
  );
}