import React from "react";
import { GeneratedNarration } from "../types";
import {
  History,
  Trash2,
  Play,
  Download,
  Calendar,
  Volume2,
  FileAudio,
} from "lucide-react";

interface NarrationHistoryProps {
  history: GeneratedNarration[];
  activeNarrationId: string | null;
  onSelectNarration: (item: GeneratedNarration) => void;
  onDeleteNarration: (id: string) => void;
  onClearHistory: () => void;
}

export const NarrationHistory: React.FC<NarrationHistoryProps> = ({
  history,
  activeNarrationId,
  onSelectNarration,
  onDeleteNarration,
  onClearHistory,
}) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  const handleDownload = (item: GeneratedNarration) => {
    try {
      const byteCharacters = atob(item.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: item.mimeType || "audio/wav" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `narracao-${item.voice.toLowerCase()}-${item.id.slice(0, 6)}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Falha ao baixar áudio do histórico:", e);
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Biblioteca de Narrações
            </h2>
            <p className="text-xs text-slate-400">
              {history.length}{" "}
              {history.length === 1 ? "áudio gerado" : "áudios gerados"} salvos nesta sessão
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar Histórico
          </button>
        )}
      </div>

      {/* History Items */}
      {history.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2">
          <FileAudio className="w-8 h-8 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">
            Nenhuma narração gerada ainda
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            Gere uma narração no estúdio para salvar e ter acesso rápido a downloads e reprodução instantânea.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-[550px] overflow-y-auto pr-1">
          {history.map((item) => {
            const isActive = item.id === activeNarrationId;
            return (
              <div
                key={item.id}
                onClick={() => onSelectNarration(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isActive
                    ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10"
                    : "bg-slate-950/50 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Info & Transcript */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Volume2 className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-slate-100 truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                        Voz {item.voice}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic">
                      "{item.text}"
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span>•</span>
                      <span>{item.characterCount} caracteres</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNarration(item);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    {isActive ? "No Player" : "Carregar"}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
                    title="Baixar arquivo WAV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNarration(item.id);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition-all"
                    title="Excluir da biblioteca"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
