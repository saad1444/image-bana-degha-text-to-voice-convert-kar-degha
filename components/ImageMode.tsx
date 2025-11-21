import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Sparkles, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';

export const ImageMode: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "3:4">('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const base64Image = await generateImage(prompt, aspectRatio);
      setGeneratedImage(base64Image);
    } catch (error) {
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-6 gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          Image Generator
        </h2>
        <p className="text-slate-400">Create stunning visuals with Gemini 2.5 Flash Image.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Controls */}
        <div className="w-full lg:w-1/3 space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-fit">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city on Mars, neon lights, cinematic style..."
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {(['1:1', '16:9', '3:4'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`p-2 text-sm rounded-lg border transition-all ${
                    aspectRatio === ratio
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate
              </>
            )}
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center relative overflow-hidden min-h-[400px]">
          {generatedImage ? (
            <div className="relative group w-full h-full flex items-center justify-center bg-black">
              <img 
                src={generatedImage} 
                alt="Generated Art" 
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <a 
                   href={generatedImage} 
                   download={`gemini-art-${Date.now()}.png`}
                   className="bg-slate-900/80 backdrop-blur text-white p-2 rounded-lg hover:bg-white hover:text-black transition-colors flex items-center gap-2 text-sm font-medium"
                 >
                   <Download className="w-4 h-4" />
                   Download
                 </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto">
                <ImageIcon className="w-8 h-8 opacity-50" />
              </div>
              <p>Your imagination appears here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
