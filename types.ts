export enum AppMode {
  CHAT = 'chat',
  IMAGE = 'image',
  SPEECH = 'speech'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string for user uploads
  isError?: boolean;
}

export interface TTSConfig {
  voiceName: string;
  text: string;
}

export interface ImageGenConfig {
  prompt: string;
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
}
