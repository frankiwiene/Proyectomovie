import { useState, useMemo } from "react";
import { Film } from "lucide-react";
import { MovieCard } from "@/app/components/MovieCard";
import { MovieModal } from "@/app/components/MovieModal";
import { FeaturedCarousel } from "@/app/components/FeaturedCarousel";
import { Navbar } from "@/app/components/Navbar";
import { LoginModal } from "@/app/components/LoginModal";
import { AdminPanel } from "@/app/components/AdminPanel";
import { movies as initialMovies } from "@/app/data/movies";
import { Movie, Review } from "@/app/types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [selectedMovie, setSelectedMovie] =
    useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("Todas");
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] =
    useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Simulación de login - en producción esto se conectaría con un backend
    setIsAuthenticated(true);
    setUserName(email.split("@")[0]);
    // Simular que el usuario es admin si el email contiene "admin"
    setIsAdmin(email.toLowerCase().includes("admin"));
  };

  const handleRegister = (
    name: string,
    email: string,
    password: string,
  ) => {
    // Simulación de registro - en producción esto se conectaría con un backend
    setIsAuthenticated(true);
    setUserName(name);
    // Simular que el usuario es admin si el email contiene "admin"
    setIsAdmin(email.toLowerCase().includes("admin"));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    setFavorites([]);
    setIsAdmin(false);
  };

  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const isFavorite = prev.some(
        (fav) => fav.id === movie.id,
      );
      if (isFavorite) {
        return prev.filter((fav) => fav.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const handleAddMovie = (newMovie: Omit<Movie, "id">) => {
    const movieWithId: Movie = {
      ...newMovie,
      id: (movies.length + 1).toString(),
      rating: 0, // Inicia en 0, se calculará con las reseñas
    };
    setMovies((prev) => [...prev, movieWithId]);
  };

  const handleEditMovie = (movieId: string, updatedMovie: Omit<Movie, "id">) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId
          ? {
              ...updatedMovie,
              id: movieId,
              // Mantener las reseñas y el rating existente
              reviews: movie.reviews,
              rating: movie.rating,
            }
          : movie
      )
    );

    // Actualizar selectedMovie si está abierto
    setSelectedMovie((prevSelected) => {
      if (prevSelected && prevSelected.id === movieId) {
        const movie = movies.find((m) => m.id === movieId);
        if (movie) {
          return {
            ...updatedMovie,
            id: movieId,
            reviews: movie.reviews,
            rating: movie.rating,
          };
        }
      }
      return prevSelected;
    });

    setMovieToEdit(null);
  };

  const handleDeleteReview = (movieId: string, reviewId: string) => {
    setMovies((prevMovies) => {
      return prevMovies.map((movie) => {
        if (movie.id === movieId) {
          const updatedReviews = movie.reviews.filter((r) => r.id !== reviewId);

          // Recalcular rating
          let newRating = 0;
          if (updatedReviews.length > 0) {
            const averageRating =
              updatedReviews.reduce((acc, rev) => acc + rev.rating, 0) /
              updatedReviews.length;
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
          const updatedReviews = movie.reviews.filter((r) => r.id !== reviewId);
          let newRating = 0;
          if (updatedReviews.length > 0) {
            const averageRating =
              updatedReviews.reduce((acc, rev) => acc + rev.rating, 0) /
              updatedReviews.length;
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

  const handleAddReview = (movieId: string, review: Omit<Review, "id" | "date" | "likes" | "dislikes" | "likedBy" | "dislikedBy" | "reported" | "reportedBy">) => {
    setMovies((prevMovies) => {
      return prevMovies.map((movie) => {
        if (movie.id === movieId) {
          // Crear la nueva reseña con ID y fecha
          const newReview: Review = {
            ...review,
            id: (movie.reviews.length + 1).toString(),
            date: new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            reported: false,
            reportedBy: [],
          };

          // Agregar la reseña
          const updatedReviews = [...movie.reviews, newReview];

          // Calcular el nuevo promedio de rating
          const averageRating = updatedReviews.reduce((acc, rev) => acc + rev.rating, 0) / updatedReviews.length;
          const roundedRating = Math.round(averageRating * 10) / 10; // Redondear a 1 decimal

          return {
            ...movie,
            reviews: updatedReviews,
            rating: roundedRating
          };
        }
        return movie;
      });
    });

    // Actualizar selectedMovie para reflejar los cambios inmediatamente
    setSelectedMovie((prevSelected) => {
      if (prevSelected && prevSelected.id === movieId) {
        const movie = movies.find(m => m.id === movieId);
        if (movie) {
          const newReview: Review = {
            ...review,
            id: (movie.reviews.length + 1).toString(),
            date: new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            reported: false,
            reportedBy: [],
          };
          const updatedReviews = [...movie.reviews, newReview];
          const averageRating = updatedReviews.reduce((acc, rev) => acc + rev.rating, 0) / updatedReviews.length;
          const roundedRating = Math.round(averageRating * 10) / 10;

          return {
            ...movie,
            reviews: updatedReviews,
            rating: roundedRating
          };
        }
      }
      return prevSelected;
    });
  };

  const handleLikeReview = (movieId: string, reviewId: string, userName: string) => {
    setMovies((prevMovies) => {
      return prevMovies.map((movie) => {
        if (movie.id === movieId) {
          const updatedReviews = movie.reviews.map((review) => {
            if (review.id === reviewId) {
              const hasLiked = review.likedBy.includes(userName);
              const hasDisliked = review.dislikedBy.includes(userName);
              
              // Si ya dio like, quitar el like
              if (hasLiked) {
                return {
                  ...review,
                  likes: review.likes - 1,
                  likedBy: review.likedBy.filter((user) => user !== userName),
                };
              }
              
              // Si había dado dislike, quitarlo y dar like
              if (hasDisliked) {
                return {
                  ...review,
                  likes: review.likes + 1,
                  dislikes: review.dislikes - 1,
                  likedBy: [...review.likedBy, userName],
                  dislikedBy: review.dislikedBy.filter((user) => user !== userName),
                };
              }
              
              // Dar like por primera vez
              return {
                ...review,
                likes: review.likes + 1,
                likedBy: [...review.likedBy, userName],
              };
            }
            return review;
          });
          
          return {
            ...movie,
            reviews: updatedReviews,
          };
        }
        return movie;
      });
    });

    // Actualizar selectedMovie
    setSelectedMovie((prevSelected) => {
      if (prevSelected && prevSelected.id === movieId) {
        const updatedReviews = prevSelected.reviews.map((review) => {
          if (review.id === reviewId) {
            const hasLiked = review.likedBy.includes(userName);
            const hasDisliked = review.dislikedBy.includes(userName);
            
            if (hasLiked) {
              return {
                ...review,
                likes: review.likes - 1,
                likedBy: review.likedBy.filter((user) => user !== userName),
              };
            }
            
            if (hasDisliked) {
              return {
                ...review,
                likes: review.likes + 1,
                dislikes: review.dislikes - 1,
                likedBy: [...review.likedBy, userName],
                dislikedBy: review.dislikedBy.filter((user) => user !== userName),
              };
            }
            
            return {
              ...review,
              likes: review.likes + 1,
              likedBy: [...review.likedBy, userName],
            };
          }
          return review;
        });
        
        return {
          ...prevSelected,
          reviews: updatedReviews,
        };
      }
      return prevSelected;
    });
  };

  const handleDislikeReview = (movieId: string, reviewId: string, userName: string) => {
    setMovies((prevMovies) => {
      return prevMovies.map((movie) => {
        if (movie.id === movieId) {
          const updatedReviews = movie.reviews.map((review) => {
            if (review.id === reviewId) {
              const hasLiked = review.likedBy.includes(userName);
              const hasDisliked = review.dislikedBy.includes(userName);
              
              // Si ya dio dislike, quitar el dislike
              if (hasDisliked) {
                return {
                  ...review,
                  dislikes: review.dislikes - 1,
                  dislikedBy: review.dislikedBy.filter((user) => user !== userName),
                };
              }
              
              // Si había dado like, quitarlo y dar dislike
              if (hasLiked) {
                return {
                  ...review,
                  likes: review.likes - 1,
                  dislikes: review.dislikes + 1,
                  likedBy: review.likedBy.filter((user) => user !== userName),
                  dislikedBy: [...review.dislikedBy, userName],
                };
              }
              
              // Dar dislike por primera vez
              return {
                ...review,
                dislikes: review.dislikes + 1,
                dislikedBy: [...review.dislikedBy, userName],
              };
            }
            return review;
          });
          
          return {
            ...movie,
            reviews: updatedReviews,
          };
        }
        return movie;
      });
    });

    // Actualizar selectedMovie
    setSelectedMovie((prevSelected) => {
      if (prevSelected && prevSelected.id === movieId) {
        const updatedReviews = prevSelected.reviews.map((review) => {
          if (review.id === reviewId) {
            const hasLiked = review.likedBy.includes(userName);
            const hasDisliked = review.dislikedBy.includes(userName);
            
            if (hasDisliked) {
              return {
                ...review,
                dislikes: review.dislikes - 1,
                dislikedBy: review.dislikedBy.filter((user) => user !== userName),
              };
            }
            
            if (hasLiked) {
              return {
                ...review,
                likes: review.likes - 1,
                dislikes: review.dislikes + 1,
                likedBy: review.likedBy.filter((user) => user !== userName),
                dislikedBy: [...review.dislikedBy, userName],
              };
            }
            
            return {
              ...review,
              dislikes: review.dislikes + 1,
              dislikedBy: [...review.dislikedBy, userName],
            };
          }
          return review;
        });
        
        return {
          ...prevSelected,
          reviews: updatedReviews,
        };
      }
      return prevSelected;
    });
  };

  const handleReportReview = (movieId: string, reviewId: string, userName: string) => {
    setMovies((prevMovies) => {
      return prevMovies.map((movie) => {
        if (movie.id === movieId) {
          const updatedReviews = movie.reviews.map((review) => {
            if (review.id === reviewId) {
              // Solo permitir reportar una vez por usuario
              if (!review.reportedBy.includes(userName)) {
                return {
                  ...review,
                  reported: true,
                  reportedBy: [...review.reportedBy, userName],
                };
              }
            }
            return review;
          });
          
          return {
            ...movie,
            reviews: updatedReviews,
          };
        }
        return movie;
      });
    });

    // Actualizar selectedMovie
    setSelectedMovie((prevSelected) => {
      if (prevSelected && prevSelected.id === movieId) {
        const updatedReviews = prevSelected.reviews.map((review) => {
          if (review.id === reviewId) {
            if (!review.reportedBy.includes(userName)) {
              return {
                ...review,
                reported: true,
                reportedBy: [...review.reportedBy, userName],
              };
            }
          }
          return review;
        });
        
        return {
          ...prevSelected,
          reviews: updatedReviews,
        };
      }
      return prevSelected;
    });
  };

  const filteredMovies = useMemo(() => {
    if (showFavorites) {
      return favorites;
    }
    if (selectedCategory === "Todas") {
      return movies;
    }
    return movies.filter(
      (movie) => movie.genre === selectedCategory,
    );
  }, [selectedCategory, showFavorites, favorites, movies]);

  const displayTitle = showFavorites
    ? "Mis Favoritos"
    : selectedCategory === "Todas"
      ? "Todas las Películas"
      : selectedCategory;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="relative z-50 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="text-purple-500" size={32} />
              <div>
                <h1 className="text-white text-3xl" style={{ fontFamily: 'Yerk, sans-serif' }}>
                 Filmario 
                </h1>
                <p className="text-white/60 text-sm mt-1">
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
              favorites={favorites}
              isAuthenticated={isAuthenticated}
              userName={userName}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Carousel - Only show when not filtering */}
        {!showFavorites && selectedCategory === "Todas" && (
          <div className="mb-12">
            <h2 className="text-white text-2xl mb-4">
              Destacadas
            </h2>
            <FeaturedCarousel
              movies={movies}
              onMovieClick={(movie) => setSelectedMovie(movie)}
            />
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-white text-2xl mb-2">
            {displayTitle}
          </h2>
          <p className="text-white/60">
            {showFavorites
              ? `Tienes ${favorites.length} película${
                  favorites.length !== 1 ? "s" : ""
                } en favoritos`
              : "Haz click en cualquier película para ver su descripción y reseñas"}
          </p>
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
        />
      )}
    </div>
  );
}