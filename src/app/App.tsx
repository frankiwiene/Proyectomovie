import { useState } from "react";
import { Film } from "lucide-react";
import { MovieCard } from "@/app/components/MovieCard";
import { MovieModal } from "@/app/components/MovieModal";
import { FeaturedCarousel } from "@/app/components/FeaturedCarousel";
import { movies } from "@/app/data/movies";
import { Movie } from "@/app/types/movie";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Film className="text-purple-500" size={32} />
            <h1 className="text-white text-3xl">CineReseñas</h1>
          </div>
          <p className="text-white/60 mt-2">
            Descubre, califica y comparte tus películas favoritas
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Carousel */}
        <div className="mb-12">
          <h2 className="text-white text-2xl mb-4">Destacadas</h2>
          <FeaturedCarousel 
            movies={movies} 
            onMovieClick={(movie) => setSelectedMovie(movie)}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-white text-2xl mb-2">Todas las Películas</h2>
          <p className="text-white/60">
            Haz click en cualquier película para ver su descripción y reseñas
          </p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => setSelectedMovie(movie)}
            />
          ))}
        </div>
      </main>

      {/* Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}