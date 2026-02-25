import { X, Star, Tv, Heart, Trash2, Edit, ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { Movie, StreamingPlatform, Review } from "@/app/types/movie";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useState } from "react";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isAuthenticated?: boolean;
  currentUser?: string;
  onAddReview?: (movieId: string, review: Omit<Review, "id" | "date" | "likes" | "dislikes" | "likedBy" | "dislikedBy" | "reported" | "reportedBy">) => void;
  onDeleteReview?: (movieId: string, reviewId: string) => void;
  isAdmin?: boolean;
  onEditMovie?: () => void;
  onLikeReview?: (movieId: string, reviewId: string, userName: string) => void;
  onDislikeReview?: (movieId: string, reviewId: string, userName: string) => void;
  onReportReview?: (movieId: string, reviewId: string, userName: string) => void;
}

const platformColors: Record<StreamingPlatform, string> = {
  Netflix: "bg-red-600",
  "Prime Video": "bg-blue-600",
  HBO: "bg-purple-600",
  "Disney +": "bg-blue-400",
  "Crunchy Roll": "bg-orange-400",
  "Apple Tv" : "bg-gray-400"
};

export function MovieModal({ 
  movie, 
  onClose, 
  isFavorite = false, 
  onToggleFavorite,
  isAuthenticated = false,
  currentUser,
  onAddReview,
  onDeleteReview,
  isAdmin,
  onEditMovie,
  onLikeReview,
  onDislikeReview,
  onReportReview
}: MovieModalProps) {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const handleAddReview = () => {
    if (onAddReview && currentUser) {
      const newReview: Omit<Review, "id" | "date" | "likes" | "dislikes" | "likedBy" | "dislikedBy" | "reported" | "reportedBy"> = {
        userName: currentUser,
        rating: reviewRating,
        comment: reviewComment
      };
      onAddReview(movie.id, newReview);
      setReviewRating(0);
      setReviewComment("");
    }
  };

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

        {/* Favorite Button */}
        {isAuthenticated && onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className="absolute right-16 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <Heart
              size={24}
              className={isFavorite ? "fill-red-500 text-red-500" : ""}
            />
          </button>
        )}

        {/* Edit Button */}
        {isAdmin && onEditMovie && (
          <button
            onClick={onEditMovie}
            className="absolute right-40 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <Edit
              size={24}
              className="fill-blue-500 text-blue-500"
            />
          </button>
        )}

        {/* Header con poster */}
        <div className="relative h-80 overflow-hidden">
          <ImageWithFallback
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-white text-3xl mb-2" style={{ fontFamily: 'Sneakers Pro, sans-serif' }}>{movie.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400" size={20} />
                <span className="text-white text-xl">
                  {movie.rating > 0 ? `${movie.rating}/10` : "Sin calificar"}
                </span>
              </div>
              <span className="text-white/70">{movie.year}</span>
              <span className="text-white/70">{movie.genre}</span>
            </div>
            {movie.rating === 0 && (
              <p className="text-white/50 text-sm mt-2">
                Esta película aún no tiene reseñas. ¡Sé el primero en calificarla!
              </p>
            )}
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
              Comentarios de Usuarios ({movie.reviews.length})
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
                  
                  {/* Botones de interacción: Like, Dislike y Reportar */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Like */}
                      <button
                        onClick={() => {
                          if (isAuthenticated && currentUser && onLikeReview) {
                            onLikeReview(movie.id, review.id, currentUser);
                          }
                        }}
                        disabled={!isAuthenticated}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                          isAuthenticated && currentUser && review.likedBy.includes(currentUser)
                            ? "bg-green-600/30 text-green-400"
                            : "bg-zinc-700/50 text-white/70 hover:bg-zinc-700 hover:text-white"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <ThumbsUp size={14} className={currentUser && review.likedBy.includes(currentUser) ? "fill-green-400" : ""} />
                        <span>{review.likes}</span>
                      </button>

                      {/* Dislike */}
                      <button
                        onClick={() => {
                          if (isAuthenticated && currentUser && onDislikeReview) {
                            onDislikeReview(movie.id, review.id, currentUser);
                          }
                        }}
                        disabled={!isAuthenticated}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                          isAuthenticated && currentUser && review.dislikedBy.includes(currentUser)
                            ? "bg-red-600/30 text-red-400"
                            : "bg-zinc-700/50 text-white/70 hover:bg-zinc-700 hover:text-white"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <ThumbsDown size={14} className={currentUser && review.dislikedBy.includes(currentUser) ? "fill-red-400" : ""} />
                        <span>{review.dislikes}</span>
                      </button>

                      {/* Reportar (solo usuarios autenticados no admin) */}
                      {isAuthenticated && !isAdmin && currentUser && onReportReview && (
                        <button
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de que quieres reportar este comentario?')) {
                              onReportReview(movie.id, review.id, currentUser);
                            }
                          }}
                          disabled={review.reportedBy.includes(currentUser)}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                            review.reportedBy.includes(currentUser)
                              ? "bg-orange-600/30 text-orange-400"
                              : "bg-zinc-700/50 text-white/70 hover:bg-zinc-700 hover:text-white"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <Flag size={14} className={review.reportedBy.includes(currentUser) ? "fill-orange-400" : ""} />
                          <span>{review.reportedBy.includes(currentUser) ? "Reportado" : "Reportar"}</span>
                        </button>
                      )}

                      {/* Indicador de comentario reportado (solo admin) */}
                      {isAdmin && review.reported && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-orange-600/30 px-3 py-1.5 text-sm text-orange-400">
                          <Flag size={14} className="fill-orange-400" />
                          <span>Reportado ({review.reportedBy.length})</span>
                        </div>
                      )}
                    </div>

                    {/* Botón para eliminar comentario (solo admin) */}
                    {isAdmin && onDeleteReview && (
                      <button
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
                            onDeleteReview(movie.id, review.id);
                          }
                        }}
                        className="flex items-center gap-2 rounded-lg bg-red-600/20 px-3 py-1.5 text-red-400 text-sm transition-colors hover:bg-red-600/30 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agregar Reseña */}
          {isAuthenticated && currentUser && (
            <div className="mt-8 rounded-lg bg-zinc-800 p-6 border-2 border-purple-500/30">
              <h3 className="text-white text-xl mb-4">Añadir tu comentario</h3>
              
              {/* Sistema de calificación con estrellas */}
              <div className="mb-4">
                <p className="text-white/70 text-sm mb-2">Tu calificación:</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setReviewRating(rating)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`${
                          reviewRating >= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-zinc-700 text-zinc-700"
                        }`}
                        size={24}
                      />
                    </button>
                  ))}
                  {reviewRating > 0 && (
                    <span className="text-white ml-2">{reviewRating}/10</span>
                  )}
                </div>
              </div>

              {/* Comentario */}
              <div className="mb-4">
                <p className="text-white/70 text-sm mb-2">Tu comentario:</p>
                <textarea
                  className="w-full rounded-lg bg-zinc-900 p-4 text-white border border-zinc-700 focus:border-purple-500 focus:outline-none min-h-[120px] resize-none"
                  placeholder="Escribe tu opinión sobre esta película..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              {/* Botón de enviar */}
              <button
                className="w-full rounded-lg bg-purple-600 px-6 py-3 text-white font-medium transition-all hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-white/50"
                onClick={handleAddReview}
                disabled={reviewRating === 0 || reviewComment.trim() === ""}
              >
                {reviewRating === 0 || reviewComment.trim() === ""
                  ? "Completa tu calificación y comentario"
                  : "Publicar Reseña"}
              </button>
            </div>
          )}

          {/* Mensaje para usuarios no autenticados */}
          {!isAuthenticated && (
            <div className="mt-8 rounded-lg bg-zinc-800 p-6 border-2 border-zinc-700 text-center">
              <p className="text-white/70">
                <span className="text-purple-400">Inicia sesión</span> para dejar tu reseña y calificación
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}