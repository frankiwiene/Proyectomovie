import { useState } from "react";
import { User, Heart, Menu, X } from "lucide-react";
import { Movie } from "@/app/types/movie";

interface NavbarProps {
  onCategorySelect: (category: string) => void;
  onShowFavorites: () => void;
  onLoginClick: () => void;
  favorites: Movie[];
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
}

const categories = [
  "Todas",
  "Acción",
  "Drama",
  "Ciencia Ficción",
  "Comedia",
  "Terror",
  "Romance",
];

export function Navbar({
  onCategorySelect,
  onShowFavorites,
  onLoginClick,
  favorites,
  isAuthenticated,
  userName,
  onLogout,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* Categories Menu */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-white transition-colors hover:bg-zinc-700"
        >
          <Menu size={20} />
          <span className="hidden sm:inline">Menú</span>
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 top-12 z-50 w-56 rounded-lg bg-zinc-800 shadow-lg border border-zinc-700">
              <div className="p-2">
                <div className="px-3 py-2 text-xs text-white/50 uppercase">
                  Categorías
                </div>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategorySelect(category);
                      setIsMenuOpen(false);
                    }}
                    className="w-full rounded-md px-3 py-2 text-left text-white transition-colors hover:bg-zinc-700"
                  >
                    {category}
                  </button>
                ))}
                <div className="my-2 h-px bg-zinc-700" />
                <button
                  onClick={() => {
                    onShowFavorites();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-white transition-colors hover:bg-zinc-700"
                >
                  <Heart size={16} className="text-red-500" />
                  <span>Favoritos</span>
                  {favorites.length > 0 && (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Menu */}
      <div className="relative">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
            >
              <User size={20} />
              <span className="hidden sm:inline">{userName}</span>
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-48 rounded-lg bg-zinc-800 shadow-lg border border-zinc-700">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-white border-b border-zinc-700">
                      {userName}
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-white transition-colors hover:bg-zinc-700"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            <User size={20} />
            <span className="hidden sm:inline">Iniciar sesión</span>
          </button>
        )}
      </div>
    </div>
  );
}
