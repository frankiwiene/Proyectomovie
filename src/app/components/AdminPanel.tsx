import { useState } from "react";
import { X, Upload, Plus } from "lucide-react";
import { Movie, StreamingPlatform } from "@/app/types/movie";

interface AdminPanelProps {
  onClose: () => void;
  onAddMovie: (movie: Omit<Movie, "id">) => void;
}

const availableGenres = [
  "Acción",
  "Drama",
  "Ciencia Ficción",
  "Comedia",
  "Terror",
  "Romance",
];

const availablePlatforms: StreamingPlatform[] = [
  "Netflix",
  "Prime Video",
  "HBO",
];

export function AdminPanel({ onClose, onAddMovie }: AdminPanelProps) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState(availableGenres[0]);
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState("");
  const [platforms, setPlatforms] = useState<StreamingPlatform[]>([]);

  const handlePlatformToggle = (platform: StreamingPlatform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (platforms.length === 0) {
      alert("Debes seleccionar al menos una plataforma de streaming");
      return;
    }

    const newMovie: Omit<Movie, "id"> = {
      title,
      year: parseInt(year),
      genre,
      description,
      poster,
      platforms,
      reviews: [],
    };

    onAddMovie(newMovie);
    
    // Reset form
    setTitle("");
    setYear("");
    setGenre(availableGenres[0]);
    setDescription("");
    setPoster("");
    setPlatforms([]);
    
    alert("¡Película agregada exitosamente!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-4xl bg-zinc-900 rounded-lg flex flex-col max-h-[90vh]">
        {/* Header fijo */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 p-6 rounded-t-lg flex-shrink-0">
          <div>
            <h2 className="text-white text-2xl">Panel de Administrador</h2>
            <p className="text-white/60 text-sm mt-1">
              Agrega una nueva película a la base de datos
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulario con scroll */}
        <div className="overflow-y-auto flex-1 px-6">
          <form onSubmit={handleSubmit} className="py-6 space-y-6">
            {/* Título y Año */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white mb-2">
                  Título de la película *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Inception"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Año *</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="2024"
                  min="1900"
                  max="2100"
                  required
                />
              </div>
            </div>

            {/* Género */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Género *</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {availableGenres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* URL del Poster */}
            <div>
              <label className="block text-white mb-2">URL de la imagen *</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={poster}
                  onChange={(e) => setPoster(e.target.value)}
                  className="flex-1 rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/poster.jpg"
                  required
                />
                <button
                  type="button"
                  className="rounded-lg bg-zinc-800 px-4 py-3 text-white transition-colors hover:bg-zinc-700"
                  title="Subir imagen"
                >
                  <Upload size={20} />
                </button>
              </div>
              {poster && (
                <div className="mt-3">
                  <p className="text-white/60 text-sm mb-2">Vista previa:</p>
                  <img
                    src={poster}
                    alt="Preview"
                    className="h-40 w-auto rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x450?text=Error";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-white mb-2">Descripción *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                placeholder="Escribe una descripción detallada de la película..."
                required
              />
            </div>

            {/* Plataformas de Streaming */}
            <div>
              <label className="block text-white mb-3">
                Disponible en (selecciona al menos una) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {availablePlatforms.map((platform) => (
                  <label
                    key={platform}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      platforms.includes(platform)
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={platforms.includes(platform)}
                      onChange={() => handlePlatformToggle(platform)}
                      className="h-5 w-5 rounded accent-purple-500"
                    />
                    <span className="text-white">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t border-zinc-800">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700"
              >
                <Plus size={20} />
                Agregar Película
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-zinc-800 px-6 py-3 text-white transition-colors hover:bg-zinc-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}