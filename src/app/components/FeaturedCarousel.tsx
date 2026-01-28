import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Movie } from "@/app/types/movie";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface FeaturedCarouselProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export function FeaturedCarousel({ movies, onMovieClick }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className="relative h-[500px] cursor-pointer"
        onClick={() => onMovieClick(currentMovie)}
      >
        <ImageWithFallback
          src={currentMovie.poster}
          alt={currentMovie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-2xl">
            <h2 className="text-white text-4xl mb-3">{currentMovie.title}</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400" size={24} />
                <span className="text-white text-xl">{currentMovie.rating}/10</span>
              </div>
              <span className="text-white/70 text-lg">{currentMovie.year}</span>
              <span className="text-white/70 text-lg">{currentMovie.genre}</span>
            </div>
            <p className="text-white/90 text-lg line-clamp-2">
              {currentMovie.description}
            </p>
            <button className="mt-6 rounded-lg bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700">
              Ver detalles
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrevious();
        }}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70 hover:scale-110"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70 hover:scale-110"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
