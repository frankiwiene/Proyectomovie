/* TARJETAS DE RESEÑAS */

import {
  X,
  Star,
  Tv,
  Heart,
  Trash2,
  Edit,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Play,
  AlertTriangle,
} from "lucide-react";
import {
  Movie,
  Review,
  ReactionType,
} from "@/app/types/movie";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useState } from "react";
import { ReactionPicker, reactionEmojis } from "@/app/components/ReactionPicker";
import { SuggestionModal } from "@/app/components/SuggestionModal";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isAuthenticated?: boolean;
  currentUser?: string;
  onAddReview?: (
    movieId: string,
    review: Omit<
      Review,
      | "id"
      | "date"
      | "likes"
      | "dislikes"
      | "likedBy"
      | "dislikedBy"
      | "reported"
      | "reportedBy"
    >,
  ) => void;
  onDeleteReview?: (movieId: string, reviewId: string) => void;
  isAdmin?: boolean;
  onEditMovie?: () => void;
  onDeleteMovie?: (movieId: string) => void;
  onLikeReview?: (
    movieId: string,
    reviewId: string,
    userName: string,
  ) => void;
  onDislikeReview?: (
    movieId: string,
    reviewId: string,
    userName: string,
  ) => void;
  onReportReview?: (
    movieId: string,
    reviewId: string,
    userName: string,
  ) => void;
  onReaction?: (
    movieId: string,
    reviewId: string,
    reactionType: ReactionType,
    userName: string,
  ) => void;
  onSuggestChange?: (
    movieId: string,
    suggestion: {
      type: "title" | "synopsis" | "platform";
      content: string;
      userName: string;
    },
  ) => void;
  onOpenLogin?: () => void;
}

const knownPlatformColors: Record<string, string> = {
  Netflix: "bg-red-600",
  "Prime Video": "bg-blue-600",
  HBO: "bg-purple-600",
  "Disney +": "bg-blue-400",
  "Crunchy Roll": "bg-orange-400",
  "Apple Tv": "bg-gray-500",
};

const randomColors = [
  "bg-pink-600", "bg-teal-600", "bg-cyan-600", "bg-lime-600",
  "bg-indigo-600", "bg-rose-600", "bg-emerald-600", "bg-violet-600",
];

function getPlatformColor(name: string): string {
  if (knownPlatformColors[name]) return knownPlatformColors[name];
  const index = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return randomColors[index % randomColors.length];
}

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
  onDeleteMovie,
  onLikeReview,
  onDislikeReview,
  onReportReview,
  onReaction,
  onSuggestChange,
  onOpenLogin,
}: MovieModalProps) {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddReview = () => {
    if (onAddReview && currentUser) {
      const newReview: Omit<
        Review,
        | "id"
        | "date"
        | "likes"
        | "dislikes"
        | "likedBy"
        | "dislikedBy"
        | "reported"
        | "reportedBy"
      > = {
        userName: currentUser,
        rating: reviewRating,
        comment: reviewComment,
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
              className={
                isFavorite ? "fill-red-500 text-red-500" : ""
              }
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

        {/* Delete Movie Button */}
        {isAdmin && onDeleteMovie && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="absolute right-52 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            title="Eliminar película"
          >
            <Trash2 size={24} className="text-red-500" />
          </button>
        )}

        {/* Confirmación eliminar película */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 rounded-lg">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mx-4 max-w-sm w-full text-center shadow-xl">
              <Trash2 size={36} className="text-red-500 mx-auto mb-3" />
              <h3 className="text-white text-lg font-semibold mb-1">¿Eliminar película?</h3>
              <p className="text-zinc-400 text-sm mb-5">
                Esta acción eliminará <span className="text-white font-medium">"{movie.title}"</span> y todas sus reseñas de forma permanente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-zinc-700 text-white text-sm hover:bg-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { onDeleteMovie(movie.id); onClose(); }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Suggest Change Button (solo usuarios autenticados no admin) */}
        {isAuthenticated && !isAdmin && currentUser && onSuggestChange && (
          <button
            onClick={() => setShowSuggestionModal(true)}
            className="absolute right-28 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            title="Sugerir cambios"
          >
            <AlertTriangle size={24} className="text-yellow-400" />
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
            <h2
              className="text-white text-3xl mb-1"
              style={{ fontFamily: "Sneakers Pro, sans-serif" }}
            >
              {movie.title}
            </h2>
            {movie.englishTitle && (
              <p className="text-white/50 text-base mb-2">
                {movie.englishTitle}
              </p>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star
                  className="fill-yellow-400 text-yellow-400"
                  size={20}
                />
                <span className="text-white text-xl">
                  {movie.rating > 0
                    ? `${movie.rating}/10`
                    : "Sin calificar"}
                </span>
              </div>
              <span className="text-white/70">
                {movie.year}
              </span>
              <span className="text-white/70">
                {movie.genre}
              </span>
              {(movie as any).duration && (
                <span className="text-white/70">
                  {(movie as any).duration}
                </span>
              )}
            </div>
            {movie.rating === 0 && (
              <p className="text-white/50 text-sm mt-2">
                Esta película aún no tiene comentarios. ¡Sé el
                primero en calificarla!
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
              <h3 className="text-white text-xl">
                Disponible en
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {movie.platforms.map((platform) => (
                <div
                  key={platform.name}
                  className={`${getPlatformColor(platform.name)} rounded-lg px-4 py-2 text-white shadow-lg flex items-center gap-2`}
                >
                  <span>{platform.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${platform.type === "rental" ? "bg-amber-500/30 text-amber-200" : "bg-white/20 text-white/80"}`}>
                    {platform.type === "rental" ? "Renta" : "Suscripción"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <h3 className="text-white text-xl mb-3">
              Sinopsis
            </h3>
            <p className="text-white/80 leading-relaxed">
              {movie.description}
            </p>
            {(movie as any).classification && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-white/50 text-sm">Clasificación:</span>
                <span className="border border-white/30 text-white/70 text-sm font-semibold px-2 py-0.5 rounded">
                  {(movie as any).classification}
                </span>
              </div>
            )}
          </div>

          {/* Video */}
          {(movie as any).videoUrl && (
            <div className="mb-8">
              <h3 className="text-white text-xl mb-3 flex items-center gap-2">
                <Play size={20} className="text-purple-400" />
                Trailer / Video
              </h3>
              {/\.(mp4|webm|ogg)(\?.*)?$/i.test(
                (movie as any).videoUrl,
              ) ? (
                <video
                  src={(movie as any).videoUrl}
                  controls
                  className="w-full rounded-lg bg-black max-h-72"
                />
              ) : (
                <div
                  className="relative w-full rounded-lg overflow-hidden bg-black"
                  style={{ paddingTop: "56.25%" }}
                >
                  <iframe
                    src={
                      (movie as any).videoUrl.match(
                        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                      )
                        ? `https://www.youtube.com/embed/${(movie as any).videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)[1]}`
                        : (movie as any).videoUrl.match(
                              /vimeo\.com\/(?:video\/)?(\d+)/,
                            )
                          ? `https://player.vimeo.com/video/${(movie as any).videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)[1]}`
                          : (movie as any).videoUrl
                    }
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video"
                  />
                </div>
              )}
            </div>
          )}

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
                          {review.userName
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white">
                          {review.userName}
                        </p>
                        <p className="text-white/50 text-sm">
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        className="fill-yellow-400 text-yellow-400"
                        size={16}
                      />
                      <span className="text-white">
                        {review.rating}/10
                      </span>
                    </div>
                  </div>
                  <p className="text-white/70">
                    {review.comment}
                  </p>

                  {/* Sistema de Reacciones estilo Facebook */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Picker de Reacciones */}
                      {onReaction && currentUser && (
                        <ReactionPicker
                          onReact={(reactionType) => {
                            if (isAuthenticated && currentUser) {
                              onReaction(
                                movie.id,
                                review.id,
                                reactionType,
                                currentUser,
                              );
                            }
                          }}
                          currentUserReaction={
                            isAuthenticated && currentUser
                              ? (review.reactions || [])
                                  .find((r) =>
                                    r.users.includes(currentUser),
                                  )?.type
                              : null
                          }
                          disabled={!isAuthenticated}
                        />
                      )}

                      {/* Resumen de reacciones */}
                      {review.reactions && review.reactions.length > 0 && (
                        <div className="flex items-center gap-2">
                          {review.reactions
                            .filter((r) => r.users.length > 0)
                            .sort((a, b) => b.users.length - a.users.length)
                            .slice(0, 3)
                            .map((reaction) => (
                              <div
                                key={reaction.type}
                                className="flex items-center gap-1 bg-zinc-700/50 rounded-full px-2 py-1 text-xs"
                                title={`${reaction.users.length} ${reactionEmojis[reaction.type].label}`}
                              >
                                {typeof reactionEmojis[reaction.type].emoji === "string" ? (
                                  <span className="text-sm">
                                    {reactionEmojis[reaction.type].emoji}
                                  </span>
                                ) : (
                                  <img
                                    src={reactionEmojis[reaction.type].emoji.props.src}
                                    alt={reactionEmojis[reaction.type].emoji.props.alt}
                                    className="w-4 h-4"
                                  />
                                )}
                                <span className="text-white/70">
                                  {reaction.users.length}
                                </span>
                              </div>
                            ))}
                          {review.reactions.reduce((sum, r) => sum + r.users.length, 0) > 0 && (
                            <span className="text-white/50 text-xs ml-1">
                              {review.reactions.reduce((sum, r) => sum + r.users.length, 0)} reacción{review.reactions.reduce((sum, r) => sum + r.users.length, 0) > 1 ? 'es' : ''}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Reportar (solo usuarios autenticados no admin) */}
                      {isAuthenticated &&
                        !isAdmin &&
                        currentUser &&
                        onReportReview && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "¿Estás seguro de que quieres reportar este comentario?",
                                )
                              ) {
                                onReportReview(
                                  movie.id,
                                  review.id,
                                  currentUser,
                                );
                              }
                            }}
                            disabled={review.reportedBy.includes(
                              currentUser,
                            )}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                              review.reportedBy.includes(
                                currentUser,
                              )
                                ? "bg-orange-600/30 text-orange-400"
                                : "bg-zinc-700/50 text-white/70 hover:bg-zinc-700 hover:text-white"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <Flag
                              size={14}
                              className={
                                review.reportedBy.includes(
                                  currentUser,
                                )
                                  ? "fill-orange-400"
                                  : ""
                              }
                            />
                            <span>
                              {review.reportedBy.includes(
                                currentUser,
                              )
                                ? "Reportado"
                                : "Reportar"}
                            </span>
                          </button>
                        )}

                      {/* Indicador de comentario reportado (solo admin) */}
                      {isAdmin && review.reported && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-orange-600/30 px-3 py-1.5 text-sm text-orange-400">
                          <Flag
                            size={14}
                            className="fill-orange-400"
                          />
                          <span>
                            Reportado (
                            {review.reportedBy.length})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botón para eliminar comentario (solo admin) */}
                    {isAdmin && onDeleteReview && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "¿Estás seguro de que quieres eliminar este comentario?",
                            )
                          ) {
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
              <h3 className="text-white text-xl mb-4">
                Añadir tu comentario
              </h3>

              {/* Sistema de calificación con estrellas */}
              <div className="mb-4">
                <p className="text-white/70 text-sm mb-2">
                  Tu calificación:
                </p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                    (rating) => (
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
                    ),
                  )}
                  {reviewRating > 0 && (
                    <span className="text-white ml-2">
                      {reviewRating}/10
                    </span>
                  )}
                </div>
              </div>

              {/* Comentario */}
              <div className="mb-4">
                <p className="text-white/70 text-sm mb-2">
                  Tu comentario:
                </p>
                <textarea
                  className="w-full rounded-lg bg-zinc-900 p-4 text-white border border-zinc-700 focus:border-purple-500 focus:outline-none min-h-[120px] resize-none"
                  placeholder="Escribe tu opinión sobre esta película..."
                  value={reviewComment}
                  onChange={(e) =>
                    setReviewComment(e.target.value)
                  }
                />
              </div>

              {/* Botón de enviar */}
              <button
                className="w-full rounded-lg bg-purple-600 px-6 py-3 text-white font-medium transition-all hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-white/50"
                onClick={handleAddReview}
                disabled={
                  reviewRating === 0 ||
                  reviewComment.trim() === ""
                }
              >
                {reviewRating === 0 ||
                reviewComment.trim() === ""
                  ? "Completa tu calificación y comentario"
                  : "Publicar Reseña"}
              </button>
            </div>
          )}

          {/* Mensaje para usuarios no autenticados */}
          {!isAuthenticated && (
            <div className="mt-8 rounded-lg bg-zinc-800 p-6 border-2 border-zinc-700 text-center">
              <p className="text-white/70">
                <button
                  onClick={onOpenLogin}
                  className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                >
                  Inicia sesión
                </button>{" "}
                para dejar tu reseña y calificación
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Suggestion Modal */}
      {showSuggestionModal && currentUser && onSuggestChange && (
        <SuggestionModal
          movie={movie}
          onClose={() => setShowSuggestionModal(false)}
          onSubmit={(suggestion) => {
            onSuggestChange(movie.id, suggestion);
            setShowSuggestionModal(false);
          }}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}