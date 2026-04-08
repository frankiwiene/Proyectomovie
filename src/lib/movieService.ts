import { supabase } from "./supabase";
import { Movie, Review, ReactionType } from "@/app/types/movie";

// ─── MOVIES ──────────────────────────────────────────────────────────────────

export async function fetchMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select(`*, reviews(*)`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(dbMovieToMovie);
}

export async function insertMovie(
  movie: Omit<Movie, "id" | "reviews" | "rating">
): Promise<Movie> {
  const { data, error } = await supabase
    .from("movies")
    .insert({
      title: movie.title,
      english_title: movie.englishTitle ?? null,
      poster: movie.poster,
      year: movie.year,
      description: movie.description,
      genre: movie.genre,
      platforms: movie.platforms,
      duration: movie.duration ?? null,
      classification: movie.classification ?? null,
      video_url: (movie as any).videoUrl ?? null,
      rating: 0,
    })
    .select(`*, reviews(*)`)
    .single();

  if (error) throw error;
  return dbMovieToMovie(data);
}

export async function updateMovie(
  id: string,
  movie: Omit<Movie, "id" | "reviews" | "rating">
): Promise<void> {
  const { error } = await supabase
    .from("movies")
    .update({
      title: movie.title,
      english_title: movie.englishTitle ?? null,
      poster: movie.poster,
      year: movie.year,
      description: movie.description,
      genre: movie.genre,
      platforms: movie.platforms,
      duration: movie.duration ?? null,
      classification: movie.classification ?? null,
      video_url: (movie as any).videoUrl ?? null,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function updateMovieRating(
  id: string,
  rating: number
): Promise<void> {
  const { error } = await supabase
    .from("movies")
    .update({ rating })
    .eq("id", id);

  if (error) throw error;
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

export async function insertReview(
  movieId: string,
  review: Omit<Review, "id" | "date" | "likes" | "dislikes" | "likedBy" | "dislikedBy" | "reported" | "reportedBy">
): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      movie_id: movieId,
      user_name: review.userName,
      rating: review.rating,
      comment: review.comment,
      date: new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      likes: 0,
      dislikes: 0,
      liked_by: [],
      disliked_by: [],
      reactions: review.reactions ?? [],
      reported: false,
      reported_by: [],
    })
    .select()
    .single();

  if (error) throw error;
  return dbReviewToReview(data);
}

export async function deleteReview(reviewId: string): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) throw error;
}

export async function updateReviewLikes(
  reviewId: string,
  likes: number,
  dislikes: number,
  likedBy: string[],
  dislikedBy: string[]
): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .update({ likes, dislikes, liked_by: likedBy, disliked_by: dislikedBy })
    .eq("id", reviewId);

  if (error) throw error;
}

export async function updateReviewReactions(
  reviewId: string,
  reactions: Review["reactions"]
): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .update({ reactions })
    .eq("id", reviewId);

  if (error) throw error;
}

export async function reportReview(
  reviewId: string,
  reported: boolean,
  reportedBy: string[]
): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .update({ reported, reported_by: reportedBy })
    .eq("id", reviewId);

  if (error) throw error;
}

// ─── FAVORITES ───────────────────────────────────────────────────────────────

export async function fetchFavorites(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("movie_id")
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? []).map((row: any) => row.movie_id);
}

export async function addFavorite(userId: string, movieId: string): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, movie_id: movieId });

  if (error) throw error;
}

export async function removeFavorite(userId: string, movieId: string): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("movie_id", movieId);

  if (error) throw error;
}

// ─── MAPPERS (DB → App) ───────────────────────────────────────────────────────

function dbMovieToMovie(row: any): Movie {
  return {
    id: row.id,
    title: row.title,
    englishTitle: row.english_title ?? undefined,
    poster: row.poster,
    year: row.year,
    rating: row.rating ?? 0,
    description: row.description,
    genre: row.genre,
    platforms: (row.platforms ?? []).map((p: any) => {
      if (typeof p === "string") {
        // Intentar parsear si es un JSON string como '{"name":"Netflix","type":"subscription"}'
        try {
          const parsed = JSON.parse(p);
          if (parsed.name) return parsed;
        } catch {}
        // Si no es JSON, es un nombre de plataforma simple
        return { name: p, type: "subscription" };
      }
      return p;
    }),
    duration: row.duration ?? undefined,
    classification: row.classification ?? undefined,
    videoUrl: row.video_url ?? undefined,
    reviews: (row.reviews ?? []).map(dbReviewToReview),
  } as Movie & { videoUrl?: string };
}

function dbReviewToReview(row: any): Review {
  return {
    id: row.id,
    userName: row.user_name,
    rating: row.rating,
    comment: row.comment,
    date: row.date,
    likes: row.likes ?? 0,
    dislikes: row.dislikes ?? 0,
    likedBy: row.liked_by ?? [],
    dislikedBy: row.disliked_by ?? [],
    reactions: row.reactions ?? [],
    reported: row.reported ?? false,
    reportedBy: row.reported_by ?? [],
  };
}
