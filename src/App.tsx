import React, { useEffect, useState, useRef } from "react";
import { GoogleVoice, GeneratedNarration, PresetScript } from "./types";
import { Header } from "./components/Header";
import { VoiceCard } from "./components/VoiceCard";
import { ScriptEditor } from "./components/ScriptEditor";
import { StudioControls } from "./components/StudioControls";
import { AudioPlayer } from "./components/AudioPlayer";
import { NarrationHistory } from "./components/NarrationHistory";
import {
  Mic,
  Loader2,
  AlertCircle,
  Sparkles,
  Volume2,
  Layers,
  CheckCircle2,
  Radio,
} from "lucide-react";

const DEFAULT_VOICES: GoogleVoice[] = [
  {
    id: "Kore",
    name: "Kore",
    gender: "Feminino",
    language: "Multilíngue (Excelente em PT-BR)",
    tone: "Clara, gentil, suave e expressiva",
    avatarColor: "from-rose-500 to-pink-600",
    description: "Voz natural e articulada com entonação suave. Ideal para audiolivros, tutoriais didáticos, podcasts e narração corporativa.",
    tags: ["Audiolivros", "Corporativo", "Clareza", "Calma"],
    sampleText: "Olá! Eu sou a Kore, uma das vozes de inteligência artificial do Google. Minha entonação é suave e natural, ideal para narrar audiolivros e vídeos didáticos.",
    suggestedStyles: [
      { label: "Narradora Suave e Natural", prompt: "Clear, warm, natural Portuguese narration with gentle and friendly cadence" },
      { label: "Locutora Corporativa", prompt: "Professional, articulate, corporate presenter with confident clarity" },
      { label: "Meditação e Relaxamento", prompt: "Very calm, soothing, soft-spoken narrator with gentle pauses" },
    ],
  },
  {
    id: "Charon",
    name: "Charon",
    gender: "Masculino",
    language: "Multilíngue (Excelente em PT-BR)",
    tone: "Grave, profundo, imponente e cinematográfico",
    avatarColor: "from-amber-600 to-stone-800",
    description: "Voz barítono ressonante com grande autoridade e presença dramática. Perfeita para documentários, trailers e suspense.",
    tags: ["Documentários", "Cinematográfico", "Grave", "Autoridade"],
    sampleText: "Nas profundezas do oceano, segredos milenares aguardam em silêncio. Eu sou a voz Charon, gravada com a profundidade do cinema.",
    suggestedStyles: [
      { label: "Narrador de Documentário", prompt: "Deep, resonant, philosophical documentary narrator in natural Portuguese" },
      { label: "Trailer Cinematográfico", prompt: "Dramatic, intense, epic movie trailer voiceover with powerful presence" },
      { label: "Suspense e Mistério", prompt: "Low, solemn, mysterious storytelling tone with slow deliberate cadence" },
    ],
  },
  {
    id: "Puck",
    name: "Puck",
    gender: "Masculino",
    language: "Multilíngue (Excelente em PT-BR)",
    tone: "Jovem, animado, comunicativo e ágil",
    avatarColor: "from-blue-500 to-indigo-600",
    description: "Voz moderna, vibrante e amigável. Perfeita para vídeos do YouTube, podcasts descontraídos, games e vlogs.",
    tags: ["YouTube", "Podcasts", "Jovem", "Enérgico"],
    sampleText: "Fala galera! Aqui é a voz Puck. Se você precisa de energia, dinamismo e uma pegada jovem para o seu canal do YouTube, você achou!",
    suggestedStyles: [
      { label: "Apresentador de YouTube", prompt: "Enthusiastic, energetic, modern creator voiceover in Portuguese with lively pacing" },
      { label: "Host de Podcast Descontraído", prompt: "Conversational, casual, engaging podcast host tone" },
      { label: "Gamer e Entretenimento", prompt: "Fast-paced, upbeat, exciting delivery with high energy" },
    ],
  },
  {
    id: "Fenrir",
    name: "Fenrir",
    gender: "Masculino",
    language: "Multilíngue (Excelente em PT-BR)",
    tone: "Firme, confiante, enérgico e persuasivo",
    avatarColor: "from-red-600 to-amber-700",
    description: "Voz marcante e comercial com ótima projeção. Excelente para publicidade, promoções de rádio/TV e chamadas para ação.",
    tags: ["Comerciais", "Publicidade", "Marcante", "Persuasivo"],
    sampleText: "Atenção consumidor! Esta é a voz Fenrir, criada sob medida para comerciais de rádio, campanhas publicitárias e grandes lançamentos.",
    suggestedStyles: [
      { label: "Comercial de TV e Rádio", prompt: "Dynamic, punchy, persuasive commercial voiceover with broadcast clarity" },
      { label: "Manifesto de Marca", prompt: "Inspirational, bold, confident brand manifesto narrator" },
      { label: "Ação e Vendas", prompt: "Urgent, driving, confident announcer" },
    ],
  },
  {
    id: "Zephyr",
    name: "Zephyr",
    gender: "Feminino",
    language: "Multilíngue (Excelente em PT-BR)",
    tone: "Brilhante, moderna, articulada e amigável",
    avatarColor: "from-emerald-500 to-teal-700",
    description: "Voz limpa, contemporânea e cheia de frescor. Ideal para reels, TikTok, campanhas publicitárias e tecnologia.",
    tags: ["Reels & TikTok", "Comercial Moderno", "Frescor", "Articulada"],
    sampleText: "Dá só uma olhada nessa novidade! Eu sou a Zephyr, perfeita para criar conteúdos dinâmicos que engajam seus seguidores nas redes sociais.",
    suggestedStyles: [
      { label: "Criadora de Conteúdo Digital", prompt: "Bright, friendly, trendy social media influencer voice in natural Portuguese" },
      { label: "Anúncio Promocional", prompt: "Upbeat, crisp, engaging advertising narrator" },
      { label: "Instrutora Didática", prompt: "Clear, pleasant, structured e-learning educator" },
    ],
  },
  {
    id: "Aoede",
    name: "Aoede",
    gender: "Feminino",
    language: "Multilíngue (Excelente em PT-BR)",
    tone: "Calorosa, poética, acolhedora e inspiradora",
    avatarColor: "from-purple-500 to-violet-700",
    description: "Voz musical e emotiva, com modulação suave e intimista. Ótima para poesias, contos, mensagens motivacionais e reflexões.",
    tags: ["Histórias", "Emocionante", "Poesia", "Acolhedora"],
    sampleText: "Feche os olhos e respire fundo. Eu sou Aoede, e estou aqui para dar vida e sensibilidade às palavras mais bonitas da sua imaginação.",
    suggestedStyles: [
      { label: "Contadora de Histórias", prompt: "Expressive, warm, magical storyteller voice in Portuguese" },
      { label: "Mensagem Emocionante", prompt: "Heartfelt, sincere, touching narration with emotional depth" },
      { label: "Reflexão Filosófica", prompt: "Calm, thoughtful, poetic cadence with gentle breaths" },
    ],
  },
];

const INITIAL_TEXT =
  "Bem-vindo ao VozStudio! Transforme qualquer ideia em narrações realistas com a inteligência artificial do Google. Escolha sua voz favorita, personalize o estilo de interpretação e dê vida imediata aos seus projetos.";

export default function App() {
  const [voices, setVoices] = useState<GoogleVoice[]>(DEFAULT_VOICES);
  const [selectedVoice, setSelectedVoice] = useState<GoogleVoice>(DEFAULT_VOICES[0]);
  const [text, setText] = useState<string>(INITIAL_TEXT);
  const [stylePrompt, setStylePrompt] = useState<string>(
    "Natural, warm Brazilian Portuguese speaker with engaging cadence"
  );
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.8-flash-lite-tts");
  const [ambientTrack, setAmbientTrack] = useState<string>("none");
  const [ambientVolume, setAmbientVolume] = useState<number>(0.15);

  const [activeTab, setActiveTab] = useState<"generator" | "history">("generator");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Active playing narration
  const [activeNarration, setActiveNarration] = useState<GeneratedNarration | null>(null);

  // History in localStorage
  const [history, setHistory] = useState<GeneratedNarration[]>(() => {
    try {
      const stored = localStorage.getItem("vozstudio_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Previewing sample voice
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const playerSectionRef = useRef<HTMLDivElement | null>(null);

  // Fetch voices catalog on mount
  useEffect(() => {
    fetch("/api/voices")
      .then((r) => r.json())
      .then((data) => {
        if (data.voices && Array.isArray(data.voices) && data.voices.length > 0) {
          setVoices(data.voices);
        }
      })
      .catch((err) => {
        console.warn("Usando catálogo de vozes embutido:", err);
      });
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("vozstudio_history", JSON.stringify(history));
    } catch (e) {
      console.error("Falha ao salvar histórico no localStorage:", e);
    }
  }, [history]);

  // Handle Preset Script application
  const handleApplyPreset = (preset: PresetScript) => {
    setText(preset.text);
    const matchedVoice = voices.find((v) => v.id === preset.recommendedVoice);
    if (matchedVoice) {
      setSelectedVoice(matchedVoice);
    }
    if (preset.style) {
      setStylePrompt(preset.style);
    }
    setSuccessToast(`Roteiro "${preset.title}" carregado com a voz ${preset.recommendedVoice}!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Handle AI Text Enhancement
  const handleEnhanceText = async (action: string) => {
    if (!text.trim()) return;
    setIsEnhancing(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/tts/enhance-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, action }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Não foi possível aprimorar o roteiro.");
      }
      setText(data.enhancedText);
      setSuccessToast("Roteiro aprimorado com sucesso pela IA!");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Falha ao aprimorar roteiro.");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Preview audio toggle
  const handleTogglePreview = async (voice: GoogleVoice) => {
    if (previewingVoiceId === voice.id) {
      // Stop preview
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      setPreviewingVoiceId(null);
      return;
    }

    // Stop existing
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }

    setPreviewingVoiceId(voice.id);
    setIsPreviewLoading(true);

    try {
      const response = await fetch("/api/tts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: voice.sampleText,
          voice: voice.id,
          style: voice.suggestedStyles?.[0]?.prompt || "Clear, natural Portuguese narrator",
          model: "gemini-3.8-flash-lite-tts",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Falha na pré-visualização de áudio.");
      }

      const byteCharacters = atob(data.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: data.mimeType || "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);

      const audio = new Audio(audioUrl);
      previewAudioRef.current = audio;
      audio.onended = () => {
        setPreviewingVoiceId(null);
        URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
    } catch (err: any) {
      console.warn("Erro ao gerar preview com Gemini TTS, tentando fala do navegador:", err);
      // Fallback: Web Speech API
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(voice.sampleText);
        utterance.lang = "pt-BR";
        utterance.onend = () => setPreviewingVoiceId(null);
        utterance.onerror = () => setPreviewingVoiceId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setErrorMessage("Não foi possível reproduzir a amostra desta voz.");
        setPreviewingVoiceId(null);
      }
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Main Speech Generation
  const handleGenerateNarration = async () => {
    if (!text.trim()) {
      setErrorMessage("Por favor, digite ou selecione um texto para a narração.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    // Stop any sample preview
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
      setPreviewingVoiceId(null);
    }

    try {
      const response = await fetch("/api/tts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          voice: selectedVoice.id,
          style: stylePrompt,
          model: selectedModel,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erro desconhecido na geração de fala.");
      }

      const title =
        text.trim().slice(0, 35) + (text.trim().length > 35 ? "..." : "");

      const newNarration: GeneratedNarration = {
        id: "narration-" + Date.now(),
        title,
        text: text.trim(),
        voice: selectedVoice.name,
        model: data.model || selectedModel,
        style: stylePrompt,
        audioBase64: data.audioBase64,
        mimeType: data.mimeType || "audio/wav",
        createdAt: Date.now(),
        characterCount: text.trim().length,
      };

      setActiveNarration(newNarration);
      setHistory((prev) => [newNarration, ...prev]);

      setSuccessToast(
        `Narração com a voz ${selectedVoice.name} gerada com sucesso em alta definição!`
      );
      setTimeout(() => setSuccessToast(null), 3500);

      // Scroll to player
      setTimeout(() => {
        playerSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      console.error("Erro na chamada de geração:", err);
      setErrorMessage(
        err.message ||
          "Não foi possível sintetizar a narração. Verifique a chave de API ou tente novamente."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete narration from history
  const handleDeleteNarration = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeNarration?.id === id) {
      setActiveNarration(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Deseja realmente limpar todo o histórico de narrações salvas?")) {
      setHistory([]);
      setActiveNarration(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setActiveTab("history")}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/90 text-white shadow-2xl backdrop-blur-md border border-emerald-400/40 text-xs sm:text-sm font-medium animate-bounce-once">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-rose-200">
                  Atenção ao gerar narração:
                </strong>
                <span>{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 font-bold px-2 py-0.5"
            >
              ×
            </button>
          </div>
        )}

        {/* Tab 1: Voice Studio Generator */}
        {activeTab === "generator" && (
          <div className="flex flex-col gap-8">
            {/* Hero / Studio Intro */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Gerador de Voz Google • Síntese Neural Ultra Realista
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Crie narrações profissionais em áudio com as vozes de alta fidelidade do Google
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                  Converta textos em falas naturais, ajuste o tom de interpretação (documentário, YouTube, comercial, audiolivro) e exporte o arquivo <strong className="text-indigo-300">WAV 24kHz</strong> pronto para suas produções de vídeo e áudio.
                </p>
              </div>
            </div>

            {/* Step 1: Voice Picker */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/30">
                    1
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>Escolha a Voz do Google</span>
                      <span className="text-xs font-normal text-indigo-400">
                        ({voices.length} vozes disponíveis)
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Clique em "Ouvir demonstração" para testar antes de gravar
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                    <Radio className="w-3 h-3 text-emerald-400" />
                    Voz selecionada:{" "}
                    <strong className="text-indigo-300 font-semibold">
                      {selectedVoice.name} ({selectedVoice.gender})
                    </strong>
                  </span>
                </div>
              </div>

              {/* Grid of Voice Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {voices.map((voice) => (
                  <VoiceCard
                    key={voice.id}
                    voice={voice}
                    isSelected={selectedVoice.id === voice.id}
                    onSelect={(v) => setSelectedVoice(v)}
                    onSelectStyle={(stylePromptStr) => setStylePrompt(stylePromptStr)}
                    isPreviewPlaying={previewingVoiceId === voice.id}
                    isPreviewLoading={isPreviewLoading && previewingVoiceId === voice.id}
                    onTogglePreview={handleTogglePreview}
                  />
                ))}
              </div>
            </section>

            {/* Step 2: Script Input & AI Polish */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/30">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">
                    Roteiro e Texto para Locução
                  </h2>
                  <p className="text-xs text-slate-400">
                    Escreva o roteiro ou selecione um modelo pronto para audiolivro, documentário ou canal
                  </p>
                </div>
              </div>

              <ScriptEditor
                text={text}
                setText={setText}
                onApplyPreset={handleApplyPreset}
                onEnhanceText={handleEnhanceText}
                isEnhancing={isEnhancing}
              />
            </section>

            {/* Step 3: Direction, Style & Ambient Sound */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/30">
                  3
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">
                    Direção de Arte e Efeitos
                  </h2>
                  <p className="text-xs text-slate-400">
                    Defina o tom de interpretação e adicione trilha de fundo se desejar
                  </p>
                </div>
              </div>

              <StudioControls
                stylePrompt={stylePrompt}
                setStylePrompt={setStylePrompt}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                ambientTrack={ambientTrack}
                setAmbientTrack={setAmbientTrack}
                ambientVolume={ambientVolume}
                setAmbientVolume={setAmbientVolume}
              />
            </section>

            {/* Big Action Button: Generate Speech */}
            <div className="flex flex-col items-center justify-center pt-2">
              <button
                type="button"
                onClick={handleGenerateNarration}
                disabled={isGenerating || !text.trim()}
                className="w-full sm:w-auto min-w-[340px] px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-98 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-base shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-500/50 flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sintetizando Voz do Google...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 fill-current" />
                    <span>Gerar Narração com Voz {selectedVoice.name}</span>
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Powered by Google Gemini 3.8 Neural Audio • Exportação direta em WAV 24kHz
              </p>
            </div>

            {/* Step 4: Audio Player & Waveform Visualizer */}
            <section ref={playerSectionRef} className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-600/30">
                  4
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>Estúdio de Reprodução e Download</span>
                    {activeNarration && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Áudio Pronto
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ouça sua narração, visualize a forma de onda e faça o download
                  </p>
                </div>
              </div>

              <AudioPlayer narration={activeNarration} />
            </section>
          </div>
        )}

        {/* Tab 2: History & Saved Narrations */}
        {activeTab === "history" && (
          <div className="flex flex-col gap-6">
            <NarrationHistory
              history={history}
              activeNarrationId={activeNarration?.id || null}
              onSelectNarration={(item) => {
                setActiveNarration(item);
                setActiveTab("generator");
                setTimeout(() => {
                  playerSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              onDeleteNarration={handleDeleteNarration}
              onClearHistory={handleClearHistory}
            />

            {/* Active player on history page if an audio is loaded */}
            {activeNarration && (
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  Player da Narração Selecionada:
                </h3>
                <AudioPlayer narration={activeNarration} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            VozStudio • Gerador de Voz do Google com Inteligência Artificial
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Google Gemini TTS</span>
            <span>•</span>
            <span>WAV Studio 24kHz</span>
            <span>•</span>
            <span>Português Brasileiro</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
