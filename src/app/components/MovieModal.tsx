import { X, Star, Tv } from "lucide-react";
import { Movie, StreamingPlatform } from "@/app/types/movie";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const platformColors: Record<StreamingPlatform, string> = {
  Netflix: "bg-red-600",
  "Prime Video": "bg-blue-600",
  HBO: "bg-purple-600",
};

export function MovieModal({ movie, onClose }: MovieModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-zinc-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        >
          <X size={24} />
        </button>

        {/* Header con poster */}
        <div className="relative h-80 overflow-hidden">
          <ImageWithFallback
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-white text-3xl mb-2">{movie.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400" size={20} />
                <span className="text-white text-xl">{movie.rating}/10</span>
              </div>
              <span className="text-white/70">{movie.year}</span>
              <span className="text-white/70">{movie.genre}</span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Plataformas de Streaming */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tv className="text-white" size={20} />
              <h3 className="text-white text-xl">Disponible en</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {movie.platforms.map((platform) => (
                <div
                  key={platform}
                  className={`${platformColors[platform]} rounded-lg px-4 py-2 text-white shadow-lg`}
                >
                  {platform}
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <h3 className="text-white text-xl mb-3">Descripción</h3>
            <p className="text-white/80 leading-relaxed">{movie.description}</p>
          </div>

          {/* Reseñas */}
          <div>
            <h3 className="text-white text-xl mb-4">
              Reseñas de Usuarios ({movie.reviews.length})
            </h3>
            <div className="space-y-4">
              {movie.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg bg-zinc-800 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                        <span className="text-white">
                          {review.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white">{review.userName}</p>
                        <p className="text-white/50 text-sm">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        className="fill-yellow-400 text-yellow-400"
                        size={16}
                      />
                      <span className="text-white">{review.rating}/10</span>
                    </div>
                  </div>
                  <p className="text-white/70">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}