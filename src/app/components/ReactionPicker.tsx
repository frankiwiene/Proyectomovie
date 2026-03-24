import { useState } from "react";
import { ReactionType } from "@/app/types/movie";

interface ReactionPickerProps {
  onReact: (type: ReactionType) => void;
  currentUserReaction?: ReactionType | null;
  disabled?: boolean;
}

const reactionEmojis: Record<
  ReactionType,
  { emoji: JSX.Element; label: string; color: string }
> = {
  meh: {
    emoji: (
      <img
        src="https://i.imgur.com/B895YRK.png"
        alt="meh"
        className="w-6 h-6 inline-block"
      />
    ),
    label: "Meh",
    color: "text-gray-400",
  },
  love: {
    emoji: (
      <img
        src="https://i.imgur.com/0zJNsac.png"
        alt="love"
        className="w-6 h-6 inline-block"
      />
    ),
    label: "Me encanta",
    color: "text-gray-400",
  },
  haha: {
    emoji: (
      <img
        src="https://i.imgur.com/LiH3wcF.png"
        alt="haha"
        className="w-6 h-6 inline-block"
      />
    ),
    label: "Me divierte",
    color: "text-gray-400",
  },
  wow: {
    emoji: (
      <img
        src="https://i.imgur.com/wDdAzmo.png"
        alt="Wow"
        className="w-6 h-6 inline-block"
      />
    ),
    label: "Dececpión",
    color: "text-gray-400",
  },
  sad: {
    emoji: (
      <img
        src="https://i.imgur.com/XnGf7dH.png"
        alt="sad"
        className="w-6 h-6 inline-block"
      />
    ),
    label: "Triste",
    color: "text-gray-400",
  },
  angry: {
    emoji: (
      <img
        src="https://i.imgur.com/sOBuhbq.png"
        alt="angry"
        className="w-6 h-6 inline-block"
      />
    ),
    label: "Me enoja",
    color: "text-gray-400",
  },
};

export function ReactionPicker({
  onReact,
  currentUserReaction,
  disabled = false,
}: ReactionPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleReaction = (type: ReactionType) => {
    onReact(type);
    setShowPicker(false);
  };

  const renderEmoji = (
    emoji: JSX.Element,
    size: "base" | "large" = "base",
  ) => {
    return (
      <img
        src={emoji.props.src}
        alt={emoji.props.alt}
        className={
          size === "large" ? "w-7 h-7" : "w-6 h-6 inline-block"
        }
      />
    );
  };

  return (
    <div className="relative">
      {/* Boton principal */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all ${
          currentUserReaction
            ? `${reactionEmojis[currentUserReaction].color} bg-zinc-700/50`
            : "bg-zinc-700/50 text-white/70 hover:bg-zinc-700 hover:text-white"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {currentUserReaction ? (
          renderEmoji(reactionEmojis[currentUserReaction].emoji)
        ) : (
          <span className="text-base">😊</span>
        )}
        <span className="text-xs">
          {currentUserReaction
            ? reactionEmojis[currentUserReaction].label
            : "Reaccionar"}
        </span>
      </button>

      {/* Picker de reacciones */}
      {showPicker && !disabled && (
        <>
          {/* Overlay para cerrar */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />

          {/* Panel de reacciones */}
          <div className="absolute bottom-full left-0 mb-2 z-50 bg-zinc-800 rounded-lg shadow-2xl border border-zinc-700 p-2 flex gap-1">
            {(
              Object.keys(reactionEmojis) as ReactionType[]
            ).map((type) => (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all hover:bg-zinc-700 hover:scale-110 ${
                  currentUserReaction === type
                    ? "bg-zinc-700 scale-105"
                    : ""
                }`}
                title={reactionEmojis[type].label}
              >
                {renderEmoji(
                  reactionEmojis[type].emoji,
                  "large",
                )}
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {reactionEmojis[type].label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export { reactionEmojis };