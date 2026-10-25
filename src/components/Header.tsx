import React from "react";
import { Mic2, Sparkles, Volume2, History, Radio } from "lucide-react";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  activeTab: "generator" | "history";
  setActiveTab: (tab: "generator" | "history") => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Mic2 className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
                VozStudio
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
                Vozes do Google
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Estúdio de Text-to-Speech com IA Google Gemini • WAV 24kHz
            </p>
          </div>
        </div>

        {/* Navigation & actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="inline-flex p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab("generator")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "generator"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              Estúdio de Gravação
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <History className="w-4 h-4" />
              Biblioteca
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-indigo-500/30 text-indigo-300 font-bold">
                  {historyCount}
                </span>
              )}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.8 Neural TTS</span>
          </div>
        </div>
      </div>
    </header>
  );
};
