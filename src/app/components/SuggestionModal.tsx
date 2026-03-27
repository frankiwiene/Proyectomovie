import { useState } from "react";
import { X, AlertCircle, Film, Tv, FileText } from "lucide-react";
import { Movie } from "@/app/types/movie";

interface SuggestionModalProps {
  movie: Movie;
  onClose: () => void;
  onSubmit: (suggestion: {
    type: "title" | "synopsis" | "platform";
    content: string;
    userName: string;
  }) => void;
  currentUser: string;
}

export function SuggestionModal({
  movie,
  onClose,
  onSubmit,
  currentUser,
}: SuggestionModalProps) {
  const [suggestionType, setSuggestionType] = useState<
    "title" | "synopsis" | "platform"
  >("synopsis");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit({
        type: suggestionType,
        content: content.trim(),
        userName: currentUser,
      });
      alert("¡Gracias por tu sugerencia! Será revisada por un administrador.");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/80 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-zinc-900 rounded-lg my-8 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-6 flex-shrink-0">
          <div>
            <h2 className="text-white text-2xl mb-1">
              Sugerir cambios
            </h2>
            <p className="text-white/60 text-sm">
              Para: {movie.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Tipo de sugerencia */}
          <div>
            <label className="block text-white mb-3">
              ¿Qué deseas sugerir? *
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setSuggestionType("title")}
                className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all text-left ${
                  suggestionType === "title"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                <Film size={24} className="text-purple-400" />
                <div>
                  <p className="text-white font-medium">
                    Título incorrecto
                  </p>
                  <p className="text-white/60 text-sm">
                    El título de la película no es el correcto
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSuggestionType("synopsis")}
                className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all text-left ${
                  suggestionType === "synopsis"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                <FileText size={24} className="text-blue-400" />
                <div>
                  <p className="text-white font-medium">
                    Sinopsis incorrecta
                  </p>
                  <p className="text-white/60 text-sm">
                    La descripción no corresponde o tiene errores
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSuggestionType("platform")}
                className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all text-left ${
                  suggestionType === "platform"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                <Tv size={24} className="text-green-400" />
                <div>
                  <p className="text-white font-medium">
                    Nueva plataforma
                  </p>
                  <p className="text-white/60 text-sm">
                    Encontré la película en otra plataforma de streaming
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Contenido de la sugerencia */}
          <div>
            <label className="block text-white mb-2">
              {suggestionType === "title" && "Título correcto *"}
              {suggestionType === "synopsis" && "Sinopsis correcta *"}
              {suggestionType === "platform" &&
                "¿En qué plataforma la encontraste? *"}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] resize-none"
              placeholder={
                suggestionType === "title"
                  ? "Escribe el título correcto de la película..."
                  : suggestionType === "synopsis"
                    ? "Escribe la sinopsis correcta..."
                    : "Indica el nombre de la plataforma (ej: Apple TV+, Paramount+, etc.)"
              }
            />
          </div>

          {/* Información adicional */}
          <div className="flex items-start gap-3 rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
            <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-400 font-medium mb-1">
                Información importante
              </p>
              <p className="text-white/70">
                Tu sugerencia será revisada por un administrador. Si es aprobada,
                se actualizará la información de la película.
              </p>
            </div>
          </div>

        </div>

        {/* Botones - Fixed at bottom */}
        <div className="flex gap-3 p-6 border-t border-zinc-800 flex-shrink-0 bg-zinc-900">
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="flex-1 rounded-lg bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-white/50"
          >
            Enviar sugerencia
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-6 py-3 text-white transition-colors hover:bg-zinc-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
