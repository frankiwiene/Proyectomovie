import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Movie } from "@/app/types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3]">
        <ImageWithFallback
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="p-4 bg-zinc-900 relative">
        <h3 className="text-white truncate">{movie.title}</h3>
        <p className="text-purple-400 text-sm mt-1 opacity-0 transition-opacity group-hover:opacity-100">
          Click para ver más
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-white/70 text-sm">
              {movie.rating > 0 ? `${movie.rating}/10` : "Sin calificar"}
            </span>
          </div>
          <span className="text-white/50 text-sm">•</span>
          <span className="text-white/70 text-sm">{movie.year}</span>
        </div>
      </div>
    </div>
  );
}