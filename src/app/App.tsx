import { useState, useMemo, useEffect } from "react";
import { MovieCard } from "@/app/components/MovieCard";
import { MovieModal } from "@/app/components/MovieModal";
import { FeaturedCarousel } from "@/app/components/FeaturedCarousel";
import { Navbar } from "@/app/components/Navbar";
import { LoginModal } from "@/app/components/LoginModal";
import { AdminPanel } from "@/app/components/AdminPanel";
import { Movie, Review, ReactionType } from "@/app/types/movie";
import { supabase } from "@/lib/supabase";
import {
  fetchMovies,
  insertMovie,
  updateMovie,
  updateMovieRating,
  insertReview,
  deleteReview,
  updateReviewLikes,
  updateReviewReactions,
  reportReview,
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "@/lib/movieService";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [selectedMovie, setSelectedMovie] =
    useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("Todas");
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] =
    useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] =
    useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(
    null,
  );
  const [availableGenres, setAvailableGenres] = useState<string[]>([
    "Acción",
    "Drama",
    "Ciencia Ficción",
    "Comedia",
    "Terror",
    "Romance",
  ]);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([
    "Netflix",
    "Prime Video",
    "HBO",
    "Disney +",
    "Crunchy Roll",
    "Apple Tv",
  ]);

  useEffect(() => {
    // Escuchar cambios de autenticación (login, confirmación de correo, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
          const user = session.user;
          const email = user.email ?? "";
          const name = user.user_metadata?.name || email.split("@")[0];
          setIsAuthenticated(true);
          setUserName(name);
          setIsAdmin(email.toLowerCase().includes("admin"));
          setUserId(user.id);
          fetchFavorites(user.id)
            .then((movieIds) => {
              setFavorites((prev) => {
                const favMovies = movies.filter((m) => movieIds.includes(m.id));
                return favMovies.length > 0 ? favMovies : prev;
              });
            })
            .catch(() => {});
        }
        if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setUserName("");
          setFavorites([]);
          setIsAdmin(false);
          setUserId(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [movies]);

  useEffect(() => {
    // Restaurar sesión activa al recargar la página
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const email = user.email ?? "";
        const name = user.user_metadata?.name || email.split("@")[0];
        setIsAuthenticated(true);
        setUserName(name);
        setIsAdmin(email.toLowerCase().includes("admin"));
        setUserId(user.id);

        // Cargar favoritos del usuario
        fetchFavorites(user.id)
          .then((movieIds) => {
            // Los favoritos se cruzan con las películas una vez que carguen
            setUserId(user.id); // se usará en el efecto de películas
            return movieIds;
          })
          .catch((err) => console.error("Error cargando favoritos:", err));
      }
    });

    fetchMovies()
      .then((data) => {
        setMovies(data);
        // Cargar favoritos cruzados con películas reales
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            fetchFavorites(session.user.id)
              .then((movieIds) => {
                const favMovies = data.filter((m) => movieIds.includes(m.id));
                setFavorites(favMovies);
              })
              .catch((err) => console.error("Error cargando favoritos:", err));
          }
        });
      })
      .catch((err) => console.error("Error cargando películas:", err))
      .finally(() => setLoadingMovies(false));
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert('Error al iniciar sesión: ' + error.message);
      throw error;
    }

    const uid = data.user.id;
    setIsAuthenticated(true);
    setUserName(data.user?.email?.split('@')[0] || '');
    setIsAdmin(email.toLowerCase().includes('admin'));
    setUserId(uid);

    // Cargar favoritos guardados
    fetchFavorites(uid)
      .then((movieIds) => {
        const favMovies = movies.filter((m) => movieIds.includes(m.id));
        setFavorites(favMovies);
      })
      .catch((err) => console.error("Error cargando favoritos:", err));
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      alert('Error al registrarse: ' + error.message);
      throw error;
    }

    if (data.user) {
      setIsAuthenticated(true);
      setUserName(name);
      setIsAdmin(email.toLowerCase().includes('admin'));
      setUserId(data.user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserName("");
    setFavorites([]);
    setIsAdmin(false);
    setUserId(null);
  };

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some((fav) => fav.id === movie.id);

    // Actualizar UI inmediatamente
    setFavorites((prev) =>
      isFavorite ? prev.filter((fav) => fav.id !== movie.id) : [...prev, movie],
    );

    // Persistir en Supabase si el usuario está autenticado
    if (userId) {
      const persist = isFavorite
        ? removeFavorite(userId, movie.id)
        : addFavorite(userId, movie.id);
      persist.catch((err) => console.error("Error guardando favorito:", err));
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    try {
      await supabase.from("movies").delete().eq("id", movieId);
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
    } catch (err) {
      console.error("Error al eliminar película:", err);
      alert("No se pudo eliminar la película. Intenta de nuevo.");
    }
  };

  const handleAddMovie = async (newMovie: Omit<Movie, "id">) => {
    try {
      const { reviews: _reviews, rating: _rating, ...movieData } = newMovie;
      const created = await insertMovie(movieData);
      setMovies((prev) => [...prev, created]);
    } catch (err) {
      console.error("Error al agregar película:", err);
      alert("No se pudo guardar la película. Intenta de nuevo.");
    }
  };

  const handleEditMovie = async (
    movieId: string,
    updatedMovie: Omit<Movie, "id">,
  ) => {
    try {
      const { reviews: _reviews, rating: _rating, ...movieData } = updatedMovie;
      await updateMovie(movieId, movieData);

      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId
            ? { ...updatedMovie, id: movieId, reviews: movie.reviews, rating: movie.rating }
            : movie,
        ),
      );

      setSelectedMovie((prevSelected) => {
        if (prevSelected && prevSelected.id === movieId) {
          const movie = movies.find((m) => m.id === movieId);
          if (movie) {
            return { ...updatedMovie, id: movieId, reviews: movie.reviews, rating: movie.rating };
          }
        }
        return prevSelected;
      });

      setMovieToEdit(null);
    } catch (err) {
      console.error("Error al editar película:", err);
      alert("No se pudo actualizar la película. Intenta de nuevo.");
    }
  };

  const handleDeleteReview = async (
    movieId: string,
    reviewId: string,
  ) => {
    try {
      await deleteReview(reviewId);
      // Recalcular y guardar el nuevo rating en Supabase
      const movie = movies.find((m) => m.id === movieId);
      if (movie) {
        const remaining = movie.reviews.filter((r) => r.id !== reviewId);
        const newRating = remaining.length > 0
          ? Math.round((remaining.reduce((a, r) => a + r.rating, 0) / remaining.length) * 10) / 10
          : 0;
        await updateMovieRating(movieId, newRating);
      }
    } catch (err) {
      console.error("Error al eliminar reseña:", err);
    }

    setMovies((prevMovies) => {
      return prevMovies.map((movie) => {
        if (movie.id === movieId) {
          const updatedReviews = movie.reviews.filter(
            (r) => r.id !== reviewId,
          );

          // Recalcular rating
          let newRating = 0;
          if (updatedReviews.length > 0) {
            const averageRating =
              updatedReviews.reduce(
                (acc, rev) => acc + rev.rating,
                0,
              ) / updatedReviews.length;
            newRating = Math.round(averageRating * 10) / 10;
          }

          return {
            ...movie,
            reviews: updatedReviews,
            rating: newRating,
          };
        }
        return movie;
      });
    });

    // Actualizar selectedMovie para reflejar los cambios inmediatamente
    setSelectedMovie((prevSelected) => {
      if (prevSelected && prevSelected.id === movieId) {
        const movie = movies.find((m) => m.id === movieId);
        if (movie) {
          const updatedReviews = movie.reviews.filter(
            (r) => r.id !== reviewId,
          );
          let newRating = 0;
          if (updatedReviews.length > 0) {
            const averageRating =
              updatedReviews.reduce(
                (acc, rev) => acc + rev.rating,
                0,
              ) / updatedReviews.length;
            newRating = Math.round(averageRating * 10) / 10;
          }

          return {
            ...movie,
            reviews: updatedReviews,
            rating: newRating,
          };
        }
      }
      return prevSelected;
    });
  };

  const handleAddReview = async (
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
  ) => {
    try {
      const savedReview = await insertReview(movieId, review);

      // Calcular nuevo rating con la reseña guardada
      const movie = movies.find((m) => m.id === movieId);
      const updatedReviews = movie ? [...movie.reviews, savedReview] : [savedReview];
      const roundedRating = Math.round(
        (updatedReviews.reduce((a, r) => a + r.rating, 0) / updatedReviews.length) * 10,
      ) / 10;
      await updateMovieRating(movieId, roundedRating);

      setMovies((prevMovies) =>
        prevMovies.map((m) => {
          if (m.id === movieId) {
            const reviews = [...m.reviews, savedReview];
            const rating = Math.round(
              (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10,
            ) / 10;
            return { ...m, reviews, rating };
          }
          return m;
        }),
      );

      setSelectedMovie((prevSelected) => {
        if (prevSelected && prevSelected.id === movieId) {
          const reviews = [...prevSelected.reviews, savedReview];
          const rating = Math.round(
            (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10,
          ) / 10;
          return { ...prevSelected, reviews, rating };
        }
        return prevSelected;
      });
    } catch (err) {
      console.error("Error al agregar reseña:", err);
      alert("No se pudo guardar la reseña. Intenta de nuevo.");
    }
  };

  const handleLikeReview = (
    movieId: string,
    reviewId: string,
    userName: string,
  ) => {
    const computeLike = (review: Review) => {
      const hasLiked = review.likedBy.includes(userName);
      const hasDisliked = review.dislikedBy.includes(userName);
      if (hasLiked) {
        return { ...review, likes: review.likes - 1, likedBy: review.likedBy.filter((u) => u !== userName) };
      }
      if (hasDisliked) {
        return { ...review, likes: review.likes + 1, dislikes: review.dislikes - 1, likedBy: [...review.likedBy, userName], dislikedBy: review.dislikedBy.filter((u) => u !== userName) };
      }
      return { ...review, likes: review.likes + 1, likedBy: [...review.likedBy, userName] };
    };

    // Persistir en Supabase (en background)
    const movie = movies.find((m) => m.id === movieId);
    const review = movie?.reviews.find((r) => r.id === reviewId);
    if (review) {
      const updated = computeLike(review);
      updateReviewLikes(reviewId, updated.likes, updated.dislikes, updated.likedBy, updated.dislikedBy)
        .catch((err) => console.error("Error al guardar like:", err));
    }

    setMovies((prevMovies) =>
      prevMovies.map((m) =>
        m.id === movieId
          ? { ...m, reviews: m.reviews.map((r) => r.id === reviewId ? computeLike(r) : r) }
          : m,
      ),
    );

    setSelectedMovie((prev) =>
      prev && prev.id === movieId
        ? { ...prev, reviews: prev.reviews.map((r) => r.id === reviewId ? computeLike(r) : r) }
        : prev,
    );
  };

  const handleDislikeReview = (
    movieId: string,
    reviewId: string,
    userName: string,
  ) => {
    const computeDislike = (review: Review) => {
      const hasLiked = review.likedBy.includes(userName);
      const hasDisliked = review.dislikedBy.includes(userName);
      if (hasDisliked) {
        return { ...review, dislikes: review.dislikes - 1, dislikedBy: review.dislikedBy.filter((u) => u !== userName) };
      }
      if (hasLiked) {
        return { ...review, likes: review.likes - 1, dislikes: review.dislikes + 1, likedBy: review.likedBy.filter((u) => u !== userName), dislikedBy: [...review.dislikedBy, userName] };
      }
      return { ...review, dislikes: review.dislikes + 1, dislikedBy: [...review.dislikedBy, userName] };
    };

    // Persistir en Supabase (en background)
    const movie = movies.find((m) => m.id === movieId);
    const review = movie?.reviews.find((r) => r.id === reviewId);
    if (review) {
      const updated = computeDislike(review);
      updateReviewLikes(reviewId, updated.likes, updated.dislikes, updated.likedBy, updated.dislikedBy)
        .catch((err) => console.error("Error al guardar dislike:", err));
    }

    setMovies((prevMovies) =>
      prevMovies.map((m) =>
        m.id === movieId
          ? { ...m, reviews: m.reviews.map((r) => r.id === reviewId ? computeDislike(r) : r) }
          : m,
      ),
    );

    setSelectedMovie((prev) =>
      prev && prev.id === movieId
        ? { ...prev, reviews: prev.reviews.map((r) => r.id === reviewId ? computeDislike(r) : r) }
        : prev,
    );
  };

  const handleReportReview = (
    movieId: string,
    reviewId: string,
    userName: string,
  ) => {
    const movie = movies.find((m) => m.id === movieId);
    const review = movie?.reviews.find((r) => r.id === reviewId);
    if (review && !review.reportedBy.includes(userName)) {
      const newReportedBy = [...review.reportedBy, userName];
      reportReview(reviewId, true, newReportedBy)
        .catch((err) => console.error("Error al reportar reseña:", err));
    }

    const applyReport = (review: Review) => {
      if (review.id === reviewId && !review.reportedBy.includes(userName)) {
        return { ...review, reported: true, reportedBy: [...review.reportedBy, userName] };
      }
      return review;
    };

    setMovies((prevMovies) =>
      prevMovies.map((m) =>
        m.id === movieId ? { ...m, reviews: m.reviews.map(applyReport) } : m,
      ),
    );

    setSelectedMovie((prev) =>
      prev && prev.id === movieId
        ? { ...prev, reviews: prev.reviews.map(applyReport) }
        : prev,
    );
  };

  const handleAddGenre = (genre: string) => {
    if (!availableGenres.includes(genre)) {
      setAvailableGenres((prev) => [...prev, genre]);
    }
  };

  const handleAddPlatform = (platform: string) => {
    if (!availablePlatforms.includes(platform)) {
      setAvailablePlatforms((prev) => [...prev, platform]);
    }
  };

  const handleSuggestChange = (
    movieId: string,
    suggestion: {
      type: "title" | "synopsis" | "platform";
      content: string;
      userName: string;
    },
  ) => {
    // En producción, esto enviaría la sugerencia a un backend
    // Por ahora solo la mostramos en consola
    console.log("Sugerencia recibida:", {
      movieId,
      movieTitle: movies.find((m) => m.id === movieId)?.title,
      ...suggestion,
    });

    // Podrías almacenar las sugerencias en el estado para que el admin las revise
    // Por ejemplo: setSuggestions(prev => [...prev, { movieId, ...suggestion }])
  };

  const handleReaction = (
    movieId: string,
    reviewId: string,
    reactionType: ReactionType,
    userName: string,
  ) => {
    const computeReaction = (review: Review): Review => {
      const currentReactions = review.reactions || [];
      const userReactionIndex = currentReactions.findIndex((r) => r.users.includes(userName));

      let newReactions;
      if (userReactionIndex !== -1) {
        const existing = currentReactions[userReactionIndex];
        if (existing.type === reactionType) {
          // Quitar misma reacción
          newReactions = currentReactions
            .map((r) => r.type === reactionType ? { ...r, users: r.users.filter((u) => u !== userName) } : r)
            .filter((r) => r.users.length > 0);
        } else {
          // Cambiar a nueva reacción
          const without = currentReactions
            .map((r) => ({ ...r, users: r.users.filter((u) => u !== userName) }))
            .filter((r) => r.users.length > 0);
          const exists = without.find((r) => r.type === reactionType);
          newReactions = exists
            ? without.map((r) => r.type === reactionType ? { ...r, users: [...r.users, userName] } : r)
            : [...without, { type: reactionType, users: [userName] }];
        }
      } else {
        // Primera reacción del usuario
        const exists = currentReactions.find((r) => r.type === reactionType);
        newReactions = exists
          ? currentReactions.map((r) => r.type === reactionType ? { ...r, users: [...r.users, userName] } : r)
          : [...currentReactions, { type: reactionType, users: [userName] }];
      }

      return { ...review, reactions: newReactions };
    };

    // Persistir en Supabase (en background)
    const movie = movies.find((m) => m.id === movieId);
    const review = movie?.reviews.find((r) => r.id === reviewId);
    if (review) {
      const updated = computeReaction(review);
      updateReviewReactions(reviewId, updated.reactions)
        .catch((err) => console.error("Error al guardar reacción:", err));
    }

    setMovies((prevMovies) =>
      prevMovies.map((m) =>
        m.id === movieId
          ? { ...m, reviews: m.reviews.map((r) => r.id === reviewId ? computeReaction(r) : r) }
          : m,
      ),
    );

    setSelectedMovie((prev) =>
      prev && prev.id === movieId
        ? { ...prev, reviews: prev.reviews.map((r) => r.id === reviewId ? computeReaction(r) : r) }
        : prev,
    );
  };

  const filteredMovies = useMemo(() => {
    let base = showFavorites
      ? favorites
      : selectedCategory === "Todas"
        ? movies
        : movies.filter((movie) => movie.genre === selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(
        (movie) =>
          movie.title.toLowerCase().includes(q) ||
          (movie.englishTitle?.toLowerCase().includes(q)) ||
          movie.genre.toLowerCase().includes(q),
      );
    }

    return base;
  }, [selectedCategory, showFavorites, favorites, movies, searchQuery]);

  const displayTitle = showFavorites
    ? "Mis Favoritos"
    : selectedCategory === "Todas"
      ? "Todas las Películas"
      : selectedCategory;

  const categoryImages: Record<string, string> = {
    Acción: "https://i.imgur.com/OFCoxfO.png",
    Drama: "https://i.imgur.com/gUdDVw5.png",
    "Ciencia Ficción": "https://i.imgur.com/ShQZ8Yp.png",
    Comedia: "https://i.imgur.com/H7X42ox.png",
    Terror: "https://i.imgur.com/Rokf9tN.png",
    Romance: "https://i.imgur.com/NMdZhPx.png",
  };

  if (loadingMovies) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-white/60 text-lg">Cargando películas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="relative z-50 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className={`flex items-center justify-between ${!showFavorites && selectedCategory !== "Todas" ? "h-32 sm:h-36" : "h-24 sm:h-20"}`}>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setSelectedCategory("Todas"); setShowFavorites(false); }}
                className="cursor-pointer focus:outline-none"
              >
                {!showFavorites && selectedCategory !== "Todas" ? (
                  categoryImages[selectedCategory] ? (
                    <img
                      src={categoryImages[selectedCategory]}
                      alt={selectedCategory}
                      className="w-20 h-20 sm:w-32 sm:h-32 object-cover object-top rounded-lg hover:opacity-80 transition-opacity"
                    />
                  ) : null
                ) : (
                  <img
                    src="https://i.imgur.com/MwsN8l5.png"
                    alt="Filmario logo"
                    className="w-27 h-27 object-contain hover:opacity-80 transition-opacity"
                  />
                )}
              </button>
              <div className="flex flex-col justify-center">
                <img
                  src="https://i.imgur.com/gk58ecS.png"
                  alt="Filmario"
                  className="h-8 sm:h-10 w-auto object-contain"
                />
                <p className="text-white/60 text-xs sm:text-sm mt-1 hidden sm:block">
                  Descubre, califica y comparte tus películas
                  favoritas
                </p>
              </div>
            </div>

            <Navbar
              onCategorySelect={(category) => {
                setSelectedCategory(category);
                setShowFavorites(false);
              }}
              onShowFavorites={() => setShowFavorites(true)}
              onLoginClick={() => setIsLoginModalOpen(true)}
              onAdminClick={() => setIsAdminPanelOpen(true)}
              onSearch={setSearchQuery}
              favorites={favorites}
              isAuthenticated={isAuthenticated}
              userName={userName}
              onLogout={handleLogout}
              availableGenres={availableGenres}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Carousel - Only show when not filtering or searching */}
        {!showFavorites && selectedCategory === "Todas" && !searchQuery.trim() && (
          <div className="mb-12">
            <h2 className="text-white text-2xl mb-4">
              Destacadas
            </h2>
            <FeaturedCarousel
              movies={[...movies]
                .filter((m) => m.rating > 0)
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .concat(
                  // Si hay menos de 2 con rating, completa con el resto para no dejar vacío
                  [...movies]
                    .filter((m) => m.rating === 0)
                    .slice(0, Math.max(0, 2 - movies.filter((m) => m.rating > 0).length))
                )
              }
              onMovieClick={(movie) => setSelectedMovie(movie)}
            />
          </div>
        )}

        <div className="mb-8">
          {!showFavorites && selectedCategory !== "Todas" ? (
            <div className="text-center">
              <h2
                className="text-white text-3xl sm:text-5xl mb-4"
                style={{ fontFamily: "Yerk, sans-serif" }}
              >
                {displayTitle}
              </h2>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-white text-2xl sm:text-4xl mb-2">
                  {displayTitle}
                </h2>
                <p className="text-white/60 text-sm sm:text-lg">
                  {showFavorites
                    ? `Tienes ${favorites.length} película${favorites.length !== 1 ? "s" : ""} en favoritos`
                    : "Haz click en cualquier película para ver su descripción y reseñas"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-white/50 text-lg">
              {showFavorites
                ? "No tienes películas en favoritos"
                : "No hay películas en esta categoría"}
            </p>
          </div>
        )}
      </main>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFavorite={favorites.some(
            (fav) => fav.id === selectedMovie.id,
          )}
          onToggleFavorite={() => toggleFavorite(selectedMovie)}
          isAuthenticated={isAuthenticated}
          currentUser={userName}
          onAddReview={handleAddReview}
          onDeleteReview={handleDeleteReview}
          isAdmin={isAdmin}
          onEditMovie={() => {
            setMovieToEdit(selectedMovie);
            setIsAdminPanelOpen(true);
            setSelectedMovie(null);
          }}
          onLikeReview={handleLikeReview}
          onDislikeReview={handleDislikeReview}
          onReportReview={handleReportReview}
          onReaction={handleReaction}
          onSuggestChange={handleSuggestChange}
          onDeleteMovie={handleDeleteMovie}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {/* Admin Panel */}
      {isAdminPanelOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminPanelOpen(false);
            setMovieToEdit(null);
          }}
          onAddMovie={handleAddMovie}
          onEditMovie={handleEditMovie}
          movieToEdit={movieToEdit}
          availableGenres={availableGenres}
          availablePlatforms={availablePlatforms}
          onAddGenre={handleAddGenre}
          onAddPlatform={handleAddPlatform}
        />
      )}
    </div>
  );
}
