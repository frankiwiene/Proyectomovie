import { useState } from "react";
import {
  X,
  Upload,
  Plus,
  Edit,
  Play,
  Video,
} from "lucide-react";
import { Movie, PlatformEntry } from "@/app/types/movie";

interface AdminPanelProps {
  onClose: () => void;
  onAddMovie: (movie: Omit<Movie, "id">) => void;
  onEditMovie?: (
    movieId: string,
    movie: Omit<Movie, "id">,
  ) => void;
  movieToEdit?: Movie | null;
  availableGenres?: string[];
  availablePlatforms?: string[];
  onAddGenre?: (genre: string) => void;
  onAddPlatform?: (platform: string) => void;
}

const defaultGenres = [
  "Acción",
  "Drama",
  "Ciencia Ficción",
  "Comedia",
  "Terror",
  "Romance",
];

const defaultPlatforms: string[] = [
  "Netflix",
  "Prime Video",
  "HBO",
  "Disney +",
  "Crunchy Roll",
  "Apple Tv",
];

function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Direct video file (mp4, webm, ogg)
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
    return url; // handled separately as <video> tag
  }

  return null;
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export function AdminPanel({
  onClose,
  onAddMovie,
  onEditMovie,
  movieToEdit,
  availableGenres = defaultGenres,
  availablePlatforms = defaultPlatforms,
  onAddGenre,
  onAddPlatform,
}: AdminPanelProps) {
  const [title, setTitle] = useState(movieToEdit?.title || "");
  const [englishTitle, setEnglishTitle] = useState(
    movieToEdit?.englishTitle || "",
  );
  const [year, setYear] = useState(
    movieToEdit?.year?.toString() || "",
  );
  const [genre, setGenre] = useState(
    movieToEdit?.genre || availableGenres[0],
  );
  const [description, setDescription] = useState(
    movieToEdit?.description || "",
  );
  const [poster, setPoster] = useState(
    movieToEdit?.poster || "",
  );
  const [platforms, setPlatforms] = useState<PlatformEntry[]>(
    movieToEdit?.platforms || [],
  );
  const [videoUrl, setVideoUrl] = useState(
    (movieToEdit as any)?.videoUrl || "",
  );
  const [duration, setDuration] = useState(
    movieToEdit?.duration || "",
  );
  const [classification, setClassification] = useState(
    movieToEdit?.classification || "",
  );
  const [videoError, setVideoError] = useState(false);

  const [showGenreInput, setShowGenreInput] = useState(false);
  const [newGenre, setNewGenre] = useState("");
  const [showPlatformInput, setShowPlatformInput] = useState(false);
  const [newPlatform, setNewPlatform] = useState("");

  const embedUrl = getEmbedUrl(videoUrl);
  const directVideo = embedUrl && isDirectVideo(videoUrl);

  const handlePlatformToggle = (platformName: string) => {
    setPlatforms((prev) => {
      const exists = prev.find((p) => p.name === platformName);
      if (exists) return prev.filter((p) => p.name !== platformName);
      return [...prev, { name: platformName, type: "subscription" }];
    });
  };

  const handlePlatformTypeChange = (
    platformName: string,
    type: "subscription" | "rental",
  ) => {
    setPlatforms((prev) =>
      prev.map((p) => p.name === platformName ? { ...p, type } : p),
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
      englishTitle,
      year: parseInt(year),
      genre,
      description,
      poster,
      platforms,
      reviews: [],
      ...(duration && { duration }),
      ...(classification && { classification }),
      ...(videoUrl && { videoUrl }),
    } as any;

    if (movieToEdit) {
      onEditMovie!(movieToEdit.id, newMovie);
    } else {
      onAddMovie(newMovie);
    }

    setTitle("");
    setEnglishTitle("");
    setYear("");
    setGenre(availableGenres[0]);
    setDescription("");
    setPoster("");
    setPlatforms([]);
    setDuration("");
    setClassification("");
    setVideoUrl("");

    alert(
      movieToEdit
        ? "¡Película actualizada exitosamente!"
        : "¡Película agregada exitosamente!",
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-4xl bg-zinc-900 rounded-lg flex flex-col max-h-[90vh]">
        {/* Header fijo */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 p-6 rounded-t-lg flex-shrink-0">
          <div>
            <h2 className="text-white text-2xl">
              {movieToEdit
                ? "Editar Película"
                : "Panel de Reseña"}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {movieToEdit
                ? "Modifica la información de la película"
                : "Agrega una nueva película a la base de datos"}
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
          <form
            onSubmit={handleSubmit}
            className="py-6 space-y-6"
          >
            {/* Título, Año y Duración */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <label className="block text-white mb-2">
                  Año *
                </label>
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

              <div>
                <label className="block text-white mb-2">
                  Duración
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: 2h 28min"
                />
              </div>
            </div>

            {/* Clasificación */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white mb-2">
                  Clasificación
                </label>
                <select
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Sin clasificar</option>
                  <option value="G">G — Todo público</option>
                  <option value="PG">PG — Guía parental</option>
                  <option value="PG-13">PG-13 — Mayores de 13</option>
                  <option value="R">R — Mayores de 17</option>
                  <option value="NC-17">NC-17 — Solo adultos</option>
                  <option value="ATP">ATP — Apta todo público</option>
                  <option value="+7">+7 años</option>
                  <option value="+13">+13 años</option>
                  <option value="+16">+16 años</option>
                  <option value="+18">+18 años</option>
                </select>
              </div>
            </div>

            {/* Título en inglés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white mb-2">
                  Título en inglés
                </label>
                <input
                  type="text"
                  value={englishTitle}
                  onChange={(e) => setEnglishTitle(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Inception"
                />
              </div>
            </div>

            {/* Género */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">
                  Género *
                </label>
                <div className="flex gap-2">
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="flex-1 rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {availableGenres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {onAddGenre && (
                    <button
                      type="button"
                      onClick={() => setShowGenreInput(!showGenreInput)}
                      className="rounded-lg bg-zinc-800 px-4 py-3 text-white transition-colors hover:bg-zinc-700"
                      title="Agregar nueva categoría"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
                {showGenreInput && onAddGenre && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value)}
                      placeholder="Nueva categoría..."
                      className="flex-1 rounded-lg bg-zinc-800 px-4 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newGenre.trim()) {
                          onAddGenre(newGenre.trim());
                          setGenre(newGenre.trim());
                          setNewGenre("");
                          setShowGenreInput(false);
                          alert("¡Categoría agregada exitosamente!");
                        }
                      }}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                    >
                      Agregar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* URL del Poster */}
            <div>
              <label className="block text-white mb-2">
                URL de la imagen *
              </label>
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
                  <p className="text-white/60 text-sm mb-2">
                    Vista previa:
                  </p>
                  <img
                    src={poster}
                    alt="Preview"
                    className="h-40 w-auto rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x450?text=Error";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-white mb-2">
                Descripción *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                placeholder="Escribe una descripción detallada de la película..."
                required
              />
            </div>

            {/* ── NUEVO: URL del Vídeo ── */}
            <div>
              <label className="block text-white mb-2 flex items-center gap-2">
                <Video size={18} className="text-purple-400" />
                URL del vídeo{" "}
                <span className="text-white/40 text-sm font-normal">
                  (opcional)
                </span>
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  setVideoError(false);
                }}
                className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://youtube.com/watch?v=... · Vimeo · .mp4 directo"
              />
              <p className="text-white/40 text-xs mt-1">
                Soporta: YouTube, Vimeo y archivos de vídeo
                directos (.mp4, .webm)
              </p>

              {/* Vista previa del vídeo */}
              {videoUrl && (
                <div className="mt-4">
                  <p className="text-white/60 text-sm mb-2 flex items-center gap-1">
                    <Play size={14} />
                    Vista previa del vídeo:
                  </p>

                  {videoError ? (
                    <div className="flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 h-48 text-white/40 text-sm gap-2">
                      <Video size={20} />
                      No se pudo cargar el vídeo. Verifica la
                      URL.
                    </div>
                  ) : embedUrl && !directVideo ? (
                    /* YouTube / Vimeo embed */
                    <div
                      className="relative w-full rounded-lg overflow-hidden bg-black"
                      style={{ paddingTop: "56.25%" }}
                    >
                      <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Video preview"
                        onError={() => setVideoError(true)}
                      />
                    </div>
                  ) : directVideo ? (
                    /* Archivo de vídeo directo */
                    <video
                      src={embedUrl!}
                      controls
                      className="w-full rounded-lg bg-black max-h-72"
                      onError={() => setVideoError(true)}
                    />
                  ) : (
                    <div className="flex items-center justify-center rounded-lg bg-zinc-800 border border-dashed border-zinc-600 h-48 text-white/40 text-sm gap-2">
                      <Video size={20} />
                      URL no reconocida. Usa YouTube, Vimeo o un
                      .mp4 directo.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Plataformas de Streaming */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white">
                  Disponible en (selecciona al menos una) *
                </label>
                {onAddPlatform && (
                  <button
                    type="button"
                    onClick={() => setShowPlatformInput(!showPlatformInput)}
                    className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5 text-white text-sm transition-colors hover:bg-zinc-700"
                  >
                    <Plus size={16} />
                    Nueva plataforma
                  </button>
                )}
              </div>

              {showPlatformInput && onAddPlatform && (
                <div className="mb-3 flex gap-2">
                  <input
                    type="text"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    placeholder="Nombre de la plataforma..."
                    className="flex-1 rounded-lg bg-zinc-800 px-4 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPlatform.trim()) {
                        onAddPlatform(newPlatform.trim());
                        setNewPlatform("");
                        setShowPlatformInput(false);
                        alert("¡Plataforma agregada exitosamente!");
                      }
                    }}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                  >
                    Agregar
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {availablePlatforms.map((platformName) => {
                  const selected = platforms.find((p) => p.name === platformName);
                  return (
                    <div
                      key={platformName}
                      className={`rounded-lg border-2 p-3 transition-all ${
                        selected
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => handlePlatformToggle(platformName)}
                      >
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() => handlePlatformToggle(platformName)}
                          className="h-5 w-5 rounded accent-purple-500"
                        />
                        <span className="text-white">{platformName}</span>
                      </div>
                      {selected && (
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handlePlatformTypeChange(platformName, "subscription")}
                            className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                              selected.type === "subscription"
                                ? "bg-purple-600 text-white"
                                : "bg-zinc-700 text-white/50 hover:bg-zinc-600"
                            }`}
                          >
                            Suscripción
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlatformTypeChange(platformName, "rental")}
                            className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                              selected.type === "rental"
                                ? "bg-amber-600 text-white"
                                : "bg-zinc-700 text-white/50 hover:bg-zinc-600"
                            }`}
                          >
                            Renta
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t border-zinc-800">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700"
              >
                {movieToEdit ? (
                  <>
                    <Edit size={20} />
                    Actualizar Película
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Agregar Película
                  </>
                )}
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