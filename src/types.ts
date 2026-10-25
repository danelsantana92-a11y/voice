export interface GoogleVoice {
  id: string;
  name: string;
  gender: string;
  language: string;
  tone: string;
  avatarColor: string;
  description: string;
  tags: string[];
  sampleText: string;
  suggestedStyles: Array<{
    label: string;
    prompt: string;
  }>;
}

export interface GeneratedNarration {
  id: string;
  title: string;
  text: string;
  voice: string;
  model: string;
  style: string;
  audioBase64: string;
  mimeType: string;
  createdAt: number;
  duration?: number;
  characterCount: number;
}

export interface PresetScript {
  id: string;
  title: string;
  category: string;
  icon: string;
  recommendedVoice: string;
  style: string;
  text: string;
}
