import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI client (server-side only)
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Available Google Voices catalog with rich metadata for narration
const GOOGLE_VOICES = [
  {
    id: "Kore",
    name: "Kore",
    gender: "Feminino",
    language: "Multilíngue (Excelente em PT-BR)",
    tone: "Clara, gentil, suave e expressiva",
    avatarColor: "from-rose-500 to-pink-600",
    description: "Voz natural e articulada com entonação suave. Ideal para audiolivros, tutoriais didáticos, podcasts e narração corporativa.",
    tags: ["Audiolivros", "Corporativo", "Clareza", "Calma"],
    sampleText: "Bem-vindo ao gerador de voz. Esta é a voz Kore, ideal para narrar suas histórias com naturalidade e elegância.",
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
    sampleText: "Em um planeta de infinitas possibilidades, a voz humana se torna o instrumento mais poderoso da narrativa.",
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
    sampleText: "E aí, pessoal! Sejam muito bem-vindos ao canal! Hoje nós vamos transformar qualquer texto em uma narração incrível.",
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
    sampleText: "Atenção! Chegou a oportunidade que você estava esperando. Inovação, velocidade e qualidade sem igual.",
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
    sampleText: "Olha só essa novidade incrível que acabou de chegar! Agora você pode criar suas narrações com inteligência artificial em segundos.",
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
    sampleText: "Feche os olhos por um instante e respire fundo. Toda grande jornada começa com uma pequena centelha de imaginação.",
    suggestedStyles: [
      { label: "Contadora de Histórias", prompt: "Expressive, warm, magical storyteller voice in Portuguese" },
      { label: "Mensagem Emocionante", prompt: "Heartfelt, sincere, touching narration with emotional depth" },
      { label: "Reflexão Filosófica", prompt: "Calm, thoughtful, poetic cadence with gentle breaths" },
    ],
  },
];

// Endpoint: List available voices
app.get("/api/voices", (_req, res) => {
  res.json({ voices: GOOGLE_VOICES });
});

// Endpoint: Health check & config status
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Endpoint: Generate Speech using Gemini TTS
app.post("/api/tts/generate", async (req, res) => {
  try {
    const { text, voice = "Kore", style, model = "gemini-3.8-flash-lite-tts" } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "O texto para narração é obrigatório." });
    }

    const trimmedText = text.trim();
    if (trimmedText.length > 5000) {
      return res.status(400).json({
        error: "O texto excede o limite recomendado de 5.000 caracteres por narração.",
      });
    }

    const ai = getGenAIClient();

    // Build speech metadata style
    const speechMetadata = style && typeof style === "string" && style.trim().length > 0
      ? { style: style.trim() }
      : { style: "Natural, expressive Portuguese speaker with clear pronunciation" };

    // Select valid model: 'gemini-3.8-flash-lite-tts' or 'gemini-3.8-flash-tts'
    const chosenModel = model === "gemini-3.8-flash-tts"
      ? "gemini-3.8-flash-tts"
      : "gemini-3.8-flash-lite-tts";

    const response = await ai.models.generateContent({
      model: chosenModel,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: trimmedText,
              speechMetadata,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const candidatePart = response.candidates?.[0]?.content?.parts?.[0];
    const base64Audio = candidatePart?.inlineData?.data;
    const mimeType = candidatePart?.inlineData?.mimeType || "audio/wav";

    if (!base64Audio) {
      throw new Error("Não foi possível gerar o áudio. A resposta da API não conteve dados de áudio.");
    }

    return res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType,
      voice,
      textLength: trimmedText.length,
      model: chosenModel,
    });
  } catch (error: any) {
    console.error("Erro na síntese de voz Gemini TTS:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Ocorreu um erro ao gerar a narração com a voz selecionada.",
    });
  }
});

// Endpoint: AI Script Assistant (Polish text, adjust rhythm, adapt tone)
app.post("/api/tts/enhance-text", async (req, res) => {
  try {
    const { text, action } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "O texto é obrigatório." });
    }

    const ai = getGenAIClient();

    let instruction = "Melhore a pontuação e cadência do texto para ser narrado em voz alta de forma natural e fluida.";

    switch (action) {
      case "narration_friendly":
        instruction =
          "Otimize o texto para leitura em voz alta por um narrador profissional: ajuste pontuações (vírgulas, reticências, pontos) para respiração natural, desfaça frases excessivamente longas e garanta que números ou siglas sejam lidos perfeitamente em Português do Brasil.";
        break;
      case "dramatic":
        instruction =
          "Reescreva e enriqueça o texto para uma narração dramática, cinematográfica e envolvente, digna de trailer ou documentário épico. Mantenha em Português do Brasil.";
        break;
      case "commercial":
        instruction =
          "Reescreva o texto com estilo de comercial de alta energia: cativante, persuasivo, com chamadas de ação marcantes e ritmo dinâmico para publicidade.";
        break;
      case "documentary":
        instruction =
          "Adapte o texto para o estilo de narração de documentário (tipo BBC/National Geographic): tom calmo, reflexivo, elegante, com pausas bem colocadas.";
        break;
      case "translate_pt":
        instruction =
          "Traduza e adapte este texto para Português do Brasil de forma coloquial e natural para narração em áudio, evitando construções robotizadas.";
        break;
    }

    const prompt = `Você é um diretor de dublagem e roteirista profissional de locução de áudio.
${instruction}

Instruções estritas:
- Retorne APENAS o texto pronto para ser lido pelo narrador.
- NÃO inclua explicações, comentários, aspas ao redor ou introduções ("Aqui está o texto:").
- O texto resultante deve ser lido diretamente pelo gerador de voz.

Texto original:
${text.trim()}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const enhancedText = response.text?.trim() || text;

    return res.json({
      success: true,
      enhancedText,
    });
  } catch (error: any) {
    console.error("Erro no aprimoramento de roteiro:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Não foi possível aprimorar o roteiro no momento.",
    });
  }
});

// Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[VozStudio Server] Running on http://0.0.0.0:${PORT}`);
});
