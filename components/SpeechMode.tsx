import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData, playAudioBuffer } from '../services/audioUtils';
import { Mic, Play, Loader2, Volume2, Check } from 'lucide-react';

const VOICES = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];

export const SpeechMode: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    
    try {
      // 1. Get Base64 Audio from Gemini
      const base64Audio = await generateSpeech(text, selectedVoice);
      
      // 2. Initialize Audio Context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext({ sampleRate: 24000 });
      
      // 3. Decode Base64 to Bytes
      const audioBytes = decode(base64Audio);
      
      // 4. Decode PCM Bytes to AudioBuffer
      const audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
      
      // 5. Play
      setIsPlaying(true);
      await playAudioBuffer(audioBuffer);
      
      // Reset playing state after duration (approximate)
      setTimeout(() => {
        setIsPlaying(false);
      }, audioBuffer.duration * 1000);

    } catch (error) {
      console.error("Playback failed", error);
      alert("Could not generate or play speech.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto p-6">
      <div className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Text to Speech</h2>
          <p className="text-slate-400">Experience Gemini 2.5's natural voice capabilities.</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300 flex items-center justify-between">
              <span>Enter Text</span>
              <span className="text-xs text-slate-500">{text.length} chars</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something for Gemini to say..."
              className="w-full h-40 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-3">
             <label className="text-sm font-medium text-slate-300">Select Voice</label>
             <div className="flex flex-wrap gap-3">
               {VOICES.map(voice => (
                 <button
                   key={voice}
                   onClick={() => setSelectedVoice(voice)}
                   className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all ${
                     selectedVoice === voice
                       ? 'bg-cyan-900/30 border-cyan-500 text-cyan-300'
                       : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                   }`}
                 >
                   {voice}
                   {selectedVoice === voice && <Check className="w-3 h-3" />}
                 </button>
               ))}
             </div>
          </div>

          <button
            onClick={handleSpeak}
            disabled={!text.trim() || isLoading || isPlaying}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-cyan-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating Audio...
              </>
            ) : isPlaying ? (
              <>
                <Volume2 className="w-6 h-6 animate-pulse" />
                Playing...
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" />
                Speak Now
              </>
            )}
          </button>
        </div>
        
        <div className="text-center text-xs text-slate-600">
          Powered by gemini-2.5-flash-preview-tts
        </div>
      </div>
    </div>
  );
};
