import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { ChatMode } from './components/ChatMode';
import { ImageMode } from './components/ImageMode';
import { SpeechMode } from './components/SpeechMode';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden selection:bg-indigo-500/30">
      {/* Sidebar */}
      <Navigation currentMode={mode} setMode={setMode} />

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20">
        {/* Content Renderer */}
        <div className="flex-1 h-full overflow-hidden">
          {mode === AppMode.CHAT && <ChatMode />}
          {mode === AppMode.IMAGE && <ImageMode />}
          {mode === AppMode.SPEECH && <SpeechMode />}
        </div>
      </main>
    </div>
  );
};

export default App;
