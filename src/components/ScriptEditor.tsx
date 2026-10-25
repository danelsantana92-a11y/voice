import React, { useState } from "react";
import { PRESET_SCRIPTS } from "../data/presets";
import { PresetScript } from "../types";
import {
  FileText,
  Clock,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Wand2,
  Loader2,
  BookOpen,
  Megaphone,
  Globe,
  Video,
  Flame,
} from "lucide-react";

interface ScriptEditorProps {
  text: string;
  setText: (text: string) => void;
  onApplyPreset: (preset: PresetScript) => void;
  onEnhanceText: (action: string) => Promise<void>;
  isEnhancing: boolean;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "Megaphone":
      return <Megaphone className="w-3.5 h-3.5 text-amber-400" />;
    case "Globe":
      return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
    case "Video":
      return <Video className="w-3.5 h-3.5 text-red-400" />;
    case "BookOpen":
      return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
    case "Sparkles":
      return <Sparkles className="w-3.5 h-3.5 text-violet-400" />;
    case "Flame":
      return <Flame className="w-3.5 h-3.5 text-orange-400" />;
    default:
      return <FileText className="w-3.5 h-3.5 text-indigo-400" />;
  }
};

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  text,
  setText,
  onApplyPreset,
  onEnhanceText,
  isEnhancing,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedEnhanceAction, setSelectedEnhanceAction] = useState<string | null>(null);

  // Stats calculation
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Average speaking pace: ~135 words per minute (2.25 words per second)
  const estimatedSeconds = Math.ceil(wordCount / 2.25);
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const rem = seconds % 60;
    return `${mins}m ${rem}s`;
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnhance = async (action: string) => {
    setSelectedEnhanceAction(action);
    await onEnhanceText(action);
    setSelectedEnhanceAction(null);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header and Presets */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Roteiro da Narração
              </h2>
              <p className="text-xs text-slate-400">
                Digite ou cole o texto que as vozes do Google devem narrar
              </p>
            </div>
          </div>

          {/* Stats badge */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/50">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Tempo estimado:{" "}
              <strong className="text-slate-200">
                {wordCount > 0 ? formatDuration(estimatedSeconds) : "0s"}
              </strong>
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/50">
              <strong className="text-slate-200">{wordCount}</strong> palavras •{" "}
              <strong className="text-slate-200">{charCount}</strong> caracteres
            </span>
          </div>
        </div>

        {/* Script Presets Quick Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Roteiros Prontos:
          </span>
          {PRESET_SCRIPTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 hover:border-indigo-500/50 transition-all whitespace-nowrap flex-shrink-0"
            >
              {getCategoryIcon(preset.icon)}
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite ou cole aqui o seu texto para ser narrado pelas vozes do Google... Exemplo: 'Olá a todos! Sejam muito bem-vindos ao episódio de hoje.'"
          rows={6}
          className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-4 text-slate-100 placeholder-slate-500 text-sm md:text-base leading-relaxed transition-all resize-y min-h-[160px] outline-none"
        />

        {/* Floating actions (copy / clear) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          {text && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
                title="Copiar texto"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setText("")}
                className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-rose-900/50 text-slate-300 hover:text-rose-300 transition-all text-xs"
                title="Limpar texto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* AI Script Polish & Rhythm Tools */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/70">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium text-slate-300">Assistente de Locução com IA:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            disabled={!text.trim() || isEnhancing}
            onClick={() => handleEnhance("narration_friendly")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Adiciona pontuações e pausas ideais para respiração e ritmo de locução"
          >
            {isEnhancing && selectedEnhanceAction === "narration_friendly" ? (
              <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
            ) : (
              <Sparkles className="w-3 h-3 text-indigo-400" />
            )}
            Pontuar para Locução
          </button>

          <button
            type="button"
            disabled={!text.trim() || isEnhancing}
            onClick={() => handleEnhance("dramatic")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isEnhancing && selectedEnhanceAction === "dramatic" ? (
              <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
            ) : null}
            Tom Dramático
          </button>

          <button
            type="button"
            disabled={!text.trim() || isEnhancing}
            onClick={() => handleEnhance("commercial")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isEnhancing && selectedEnhanceAction === "commercial" ? (
              <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
            ) : null}
            Tom Comercial
          </button>

          <button
            type="button"
            disabled={!text.trim() || isEnhancing}
            onClick={() => handleEnhance("documentary")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isEnhancing && selectedEnhanceAction === "documentary" ? (
              <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
            ) : null}
            Documentário
          </button>
        </div>
      </div>
    </div>
  );
};
