import React, { useState } from "react";
import {
  Sliders,
  Music,
  Cpu,
  Volume2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { ambientPlayer } from "../utils/ambientAudio";

interface StudioControlsProps {
  stylePrompt: string;
  setStylePrompt: (style: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  ambientTrack: string;
  setAmbientTrack: (track: string) => void;
  ambientVolume: number;
  setAmbientVolume: (vol: number) => void;
}

const STYLE_PRESETS = [
  {
    label: "🎙️ Natural e Equilibrado",
    prompt: "Natural, clear, well-paced Portuguese speaker with engaging cadence",
  },
  {
    label: "🔥 Enérgico de YouTube",
    prompt: "Enthusiastic, energetic, modern creator voiceover in Portuguese with lively pacing",
  },
  {
    label: "🎬 Trailer & Cinematográfico",
    prompt: "Dramatic, intense, epic movie trailer voiceover with powerful presence and deep pauses",
  },
  {
    label: "📣 Comercial & Persuasivo",
    prompt: "Dynamic, punchy, persuasive commercial voiceover with broadcast radio clarity",
  },
  {
    label: "📖 Audiolivro Calmo",
    prompt: "Warm, gentle, articulate storytelling narrator with peaceful cadence",
  },
  {
    label: "🧘 Meditação & Sussurrado",
    prompt: "Very calm, soothing, soft-spoken narrator with slow breathing pauses",
  },
];

const AMBIENT_OPTIONS = [
  { id: "none", name: "Sem Trilha (Apenas Voz)" },
  { id: "lofi", name: "☕ Lo-Fi Chill Acústico" },
  { id: "rain", name: "🌧️ Chuva & Tempestade Leve" },
  { id: "cinematic", name: "🌌 Drone Cinematográfico" },
  { id: "zen", name: "✨ Harmonia Zen 432Hz" },
];

export const StudioControls: React.FC<StudioControlsProps> = ({
  stylePrompt,
  setStylePrompt,
  selectedModel,
  setSelectedModel,
  ambientTrack,
  setAmbientTrack,
  ambientVolume,
  setAmbientVolume,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleAmbientChange = (trackId: string) => {
    setAmbientTrack(trackId);
    if (trackId === "none") {
      ambientPlayer.stop();
    } else {
      ambientPlayer.play(trackId, ambientVolume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setAmbientVolume(newVol);
    ambientPlayer.setVolume(newVol);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Direção de Voz e Personalização
            </h2>
            <p className="text-xs text-slate-400">
              Ajuste o tom dramático, o modelo de síntese e a ambiência sonora
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          {isAdvancedOpen ? (
            <>
              Menos opções <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Configurações do Estúdio <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Style selector chips */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Estilo de Interpretação / Entonação:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setStylePrompt(preset.prompt)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                stylePrompt === preset.prompt
                  ? "bg-indigo-600/30 border-indigo-500 text-indigo-200 font-medium"
                  : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom style prompt field */}
        <input
          type="text"
          value={stylePrompt}
          onChange={(e) => setStylePrompt(e.target.value)}
          placeholder="Ex: Voz enérgica com tom descontraído e risos leves..."
          className="mt-1 w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none"
        />
      </div>

      {/* Advanced Studio options */}
      {isAdvancedOpen && (
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TTS Model selector */}
          <div className="flex flex-col gap-2 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Modelo de Voz do Google:
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setSelectedModel("gemini-3.8-flash-lite-tts")}
                className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                  selectedModel === "gemini-3.8-flash-lite-tts"
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-200"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="font-semibold text-slate-100 flex items-center justify-between">
                  <span>Gemini 3.8 Flash Lite TTS</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    Recomendado
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Velocidade ultra rápida, pronúncia límpida e natural a 24kHz.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedModel("gemini-3.8-flash-tts")}
                className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                  selectedModel === "gemini-3.8-flash-tts"
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-200"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="font-semibold text-slate-100">
                  Gemini 3.8 Flash TTS
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Modelo insignia para modulações dramáticas e roteiros complexos.
                </p>
              </button>
            </div>
          </div>

          {/* Ambient Music Mixer */}
          <div className="flex flex-col gap-2 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-cyan-400" />
                Trilha Sonora de Fundo (Mixer):
              </label>
              {ambientTrack !== "none" && (
                <span className="text-[10px] text-cyan-400 font-semibold uppercase animate-pulse">
                  Tocando
                </span>
              )}
            </div>

            <select
              value={ambientTrack}
              onChange={(e) => handleAmbientChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
            >
              {AMBIENT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>

            {/* Volume slider for ambient music */}
            {ambientTrack !== "none" && (
              <div className="mt-2 flex items-center gap-3">
                <Volume2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.01"
                  value={ambientVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-400 font-mono w-8 text-right">
                  {Math.round((ambientVolume / 0.4) * 100)}%
                </span>
              </div>
            )}

            <p className="text-[11px] text-slate-500">
              Mixe música de fundo suave ao reproduzir sua narração para simular um podcast ou comercial de rádio.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
