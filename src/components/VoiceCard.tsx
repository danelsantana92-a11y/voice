import React from "react";
import { GoogleVoice } from "../types";
import { Play, Square, Check, Volume2, Sparkles, Loader2 } from "lucide-react";

interface VoiceCardProps {
  voice: GoogleVoice;
  isSelected: boolean;
  onSelect: (voice: GoogleVoice) => void;
  onSelectStyle?: (stylePrompt: string) => void;
  isPreviewPlaying: boolean;
  isPreviewLoading: boolean;
  onTogglePreview: (voice: GoogleVoice) => void;
}

export const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  isSelected,
  onSelect,
  onSelectStyle,
  isPreviewPlaying,
  isPreviewLoading,
  onTogglePreview,
}) => {
  return (
    <div
      onClick={() => onSelect(voice)}
      className={`relative group rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
        isSelected
          ? "bg-gradient-to-b from-indigo-950/70 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/15 ring-2 ring-indigo-500/30"
          : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Selected marker */}
      {isSelected && (
        <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white shadow-md">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}

      {/* Header with avatar & info */}
      <div className="flex items-start gap-3.5">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${voice.avatarColor} p-0.5 shadow-md flex-shrink-0 flex items-center justify-center`}
        >
          <div className="w-full h-full bg-slate-950/40 rounded-[10px] flex items-center justify-center text-white font-bold text-lg">
            {voice.name[0]}
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">
              {voice.name}
            </h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {voice.gender}
            </span>
          </div>
          <p className="text-xs text-indigo-400 font-medium mt-0.5 line-clamp-1">
            {voice.tone}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
        {voice.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {voice.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Sample phrase button & style chips */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePreview(voice);
            }}
            disabled={isPreviewLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isPreviewPlaying
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
            }`}
          >
            {isPreviewLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Carregando áudio...</span>
              </>
            ) : isPreviewPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Pausar demonstração</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
                <span>Ouvir demonstração</span>
              </>
            )}
          </button>

          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-slate-500" />
            Voz Google
          </span>
        </div>

        {/* Quick Style presets for this voice */}
        {voice.suggestedStyles && voice.suggestedStyles.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {voice.suggestedStyles.map((style) => (
              <button
                key={style.label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(voice);
                  if (onSelectStyle) onSelectStyle(style.prompt);
                }}
                title={style.prompt}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800/50 hover:bg-indigo-950 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-300 border border-slate-800 transition-all flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                {style.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
