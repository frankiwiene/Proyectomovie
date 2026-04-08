import { useState } from "react";
import { User, Heart, Menu, X, Shield, Search } from "lucide-react";
import { Movie } from "@/app/types/movie";

interface NavbarProps {
  onCategorySelect: (category: string) => void;
  onShowFavorites: () => void;
  onLoginClick: () => void;
  onAdminClick: () => void;
  onSearch: (query: string) => void;
  favorites: Movie[];
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
  availableGenres?: string[];
}

const defaultCategoryImages: Record<string, string> = {
  Acción: "https://i.imgur.com/OFCoxfO.png",
  Drama: "https://i.imgur.com/gUdDVw5.png",
  "Ciencia Ficción": "https://i.imgur.com/ShQZ8Yp.png",
  Comedia: "https://i.imgur.com/H7X42ox.png",
  Terror: "https://i.imgur.com/Rokf9tN.png",
  Romance: "https://i.imgur.com/NMdZhPx.png",
};

export function Navbar({
  onCategorySelect,
  onShowFavorites,
  onLoginClick,
  onAdminClick,
  onSearch,
  favorites,
  isAuthenticated,
  userName,
  onLogout,
  availableGenres = [
    "Acción",
    "Drama",
    "Ciencia Ficción",
    "Comedia",
    "Terror",
    "Romance",
  ],
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [menuButtonRef, setMenuButtonRef] =
    useState<HTMLButtonElement | null>(null);
  const [userButtonRef, setUserButtonRef] =
    useState<HTMLButtonElement | null>(null);

  const categories = [
    {
      name: "Todas",
      image: null,
      emoji: "🎬",
    },
    ...availableGenres.map((genre) => ({
      name: genre,
      image: defaultCategoryImages[genre] || null,
      emoji: null,
    })),
  ];

  const getMenuPosition = () => {
    if (!menuButtonRef) return {};
    const rect = menuButtonRef.getBoundingClientRect();
    const menuWidth = Math.min(288, window.innerWidth - 16);
    const right = window.innerWidth - rect.right;
    return {
      top: rect.bottom + 8,
      right: Math.max(8, right),
      width: menuWidth,
    };
  };

  const getUserMenuPosition = () => {
    if (!userButtonRef) return {};
    const rect = userButtonRef.getBoundingClientRect();
    const right = window.innerWidth - rect.right;
    return {
      top: rect.bottom + 8,
      right: Math.max(8, right),
    };
  };

  return (
    <div className="flex items-center gap-4">
      {/* Categories Menu */}
      <div className="relative">
        <button
          ref={setMenuButtonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-white transition-colors hover:bg-zinc-700"
        >
          <Menu size={20} />
          <span className="hidden sm:inline">Menú</span>
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsMenuOpen(false)}
            />
            <div
              className="fixed z-[9999] max-h-[70vh] overflow-y-auto rounded-xl bg-zinc-900 shadow-2xl border border-zinc-700"
              style={getMenuPosition()}
            >
              <div className="p-3">
                <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-widest">
                  Categorías
                </div>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      onCategorySelect(category.name);
                      setIsMenuOpen(false);
                    }}
                    className="group w-full rounded-lg overflow-hidden mb-1.5 last:mb-0 transition-all hover:scale-[1.02] hover:shadow-lg focus:outline-none"
                  >
                    <div className="relative flex items-center gap-3 px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                      {/* Thumbnail image */}
                      <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 shadow-md bg-zinc-700 flex items-center justify-center">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : category.emoji ? (
                          <span className="text-2xl">
                            {category.emoji}
                          </span>
                        ) : (
                          <span className="text-2xl">📁</span>
                        )}
                      </div>
                      {/* Text */}
                      <div className="flex items-center gap-2 flex-1 text-left">
                        <span className="text-white font-medium text-sm">
                          {category.name}
                        </span>
                      </div>
                      {/* Arrow indicator */}
                      <svg
                        className="w-4 h-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
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

      {/* Buscador */}
      <div className="relative flex items-center">
        <Search size={16} className="absolute left-3 text-white/40 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar..."
          onChange={(e) => onSearch(e.target.value)}
          className="bg-zinc-700/60 text-white placeholder-white/30 text-sm rounded-lg pl-8 pr-3 py-2 w-32 sm:w-48 outline-none focus:ring-1 focus:ring-purple-500 focus:bg-zinc-700 transition-all"
        />
      </div>

      {/* User Menu */}
      <div className="relative">
        {isAuthenticated ? (
          <>
            <button
              ref={setUserButtonRef}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
            >
              <User size={20} />
              <span className="hidden sm:inline">
                {userName}
              </span>
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-[9998]"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div
                  className="fixed z-[9999] w-48 rounded-lg bg-zinc-800 shadow-xl border border-zinc-700"
                  style={getUserMenuPosition()}
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-white border-b border-zinc-700">
                      {userName}
                    </div>
                    <button
                      onClick={() => {
                        onAdminClick();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-white transition-colors hover:bg-zinc-700"
                    >
                      <Shield
                        size={16}
                        className="text-blue-500"
                      />
                      <span>Crear Reseña</span>
                    </button>
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
            <span className="hidden sm:inline">
              Iniciar sesión
            </span>
          </button>
        )}
      </div>
    </div>
  );
}