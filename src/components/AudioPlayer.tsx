import React, { useEffect, useRef, useState } from "react";
import { GeneratedNarration } from "../types";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Repeat,
  Share2,
  Check,
  Disc3,
} from "lucide-react";

interface AudioPlayerProps {
  narration: GeneratedNarration | null;
  onNarrationEnded?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ narration }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Audio URL from Base64
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!narration?.audioBase64) {
      setAudioUrl(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    try {
      // Decode base64 to Blob URL for fast standard HTML5 Audio playback
      const byteCharacters = atob(narration.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: narration.mimeType || "audio/wav" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Auto play on new generation
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {
            // Autoplay may be restricted in some browsers
          });
        }
      }, 150);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.error("Erro ao decodificar áudio base64:", e);
    }
  }, [narration]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Download Audio as WAV file
  const handleDownload = () => {
    if (!audioUrl || !narration) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    const safeTitle = narration.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 30);
    a.download = `narracao-google-${narration.voice.toLowerCase()}-${safeTitle || "audio"}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = () => {
    if (!narration) return;
    navigator.clipboard.writeText(narration.text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Waveform canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    const barCount = 48;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 8;
        if (isPlaying) {
          // Dynamic wave formula when playing
          const progress = duration > 0 ? currentTime / duration : 0;
          const currentBarProgress = i / barCount;
          const isPassed = currentBarProgress <= progress;

          const wave1 = Math.sin(phase + i * 0.25) * 20;
          const wave2 = Math.cos(phase * 1.5 + i * 0.4) * 15;
          const baseHeight = 16 + Math.abs(wave1 + wave2);
          barHeight = Math.max(6, Math.min(height - 10, baseHeight));

          // Gradient color: highlighted if already played
          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          if (isPassed) {
            gradient.addColorStop(0, "#4f46e5");
            gradient.addColorStop(1, "#38bdf8");
          } else {
            gradient.addColorStop(0, "#1e293b");
            gradient.addColorStop(1, "#6366f1");
          }
          ctx.fillStyle = gradient;
        } else {
          // Idle state wave
          const wave = Math.sin(i * 0.2) * 12 + 16;
          barHeight = Math.max(6, wave);
          ctx.fillStyle = "#334155";
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.12;
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime, duration]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!narration) {
    return (
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500">
          <Disc3 className="w-7 h-7 text-indigo-400/50 animate-spin-slow" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-300 text-sm">
            Pronto para gravar sua narração
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Escolha uma voz do Google acima, escreva o texto e clique em "Gerar Narração" para ouvir a voz ultrarrealista.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl shadow-indigo-500/10 flex flex-col gap-4">
      {/* Audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          loop={isLooping}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
        />
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Narração Ativa:</span>
              <span className="text-indigo-400 font-semibold">
                Voz {narration.voice} (Google)
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Formato WAV Studio • 24.000 Hz Mono • Gemini TTS
            </p>
          </div>
        </div>

        {/* Actions (Download / Copy text) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            title="Copiar texto da narração"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copiado!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Copiar Texto
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar Áudio (.wav)
          </button>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
        <canvas
          ref={canvasRef}
          width={700}
          height={64}
          className="w-full h-16 rounded cursor-pointer"
          onClick={togglePlay}
        />

        {/* Progress Timeline */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 w-10">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-400 w-10 text-right">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Control Bar: Play / Pause / Speeds / Loop / Volume */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        {/* Playback buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            title={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            title="Voltar ao início"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2.5 rounded-full transition-all ${
              isLooping
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-400"
            }`}
            title="Repetir em loop"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Speed selectors */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          {[0.8, 1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleSpeedChange(rate)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                playbackRate === rate
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Transcript preview */}
      <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 text-xs text-slate-300 leading-relaxed max-h-24 overflow-y-auto">
        <span className="text-slate-500 font-semibold mr-1.5">Texto narrado:</span>
        "{narration.text}"
      </div>
    </div>
  );
};
