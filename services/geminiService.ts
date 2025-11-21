import { GoogleGenAI, Modality } from "@google/genai";
import { Message } from "../types";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Chat & Vision ---

export const sendMessage = async (
  prompt: string,
  imageBase64?: string | null,
  history?: Message[]
): Promise<string> => {
  const ai = getClient();
  const parts: any[] = [];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg', // Assuming JPEG for simplicity in this demo
        data: imageBase64.split(',')[1] // Remove data URL prefix
      }
    });
  }

  parts.push({ text: prompt });

  // Note: For true chat history, we would construct the 'contents' array with previous turns.
  // For this simple demo, we are doing single-turn request-response or implicit history via prompt concatenation if needed,
  // but to keep it clean we'll use generateContent in a stateless manner or simple history.
  // Let's stick to a simple single-turn with context for now to minimize token usage in demo.
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
    });
    return response.text || "No response text generated.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

// --- Image Generation ---

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        }
      }
    });

    // Extract image from parts
    for (const part of response.candidates![0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

// --- Text to Speech ---

export const generateSpeech = async (text: string, voiceName: string): Promise<string> => {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName as any },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data generated");
    
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};
