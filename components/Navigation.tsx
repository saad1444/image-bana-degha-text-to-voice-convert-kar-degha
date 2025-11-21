import React from 'react';
import { AppMode } from '../types';
import { MessageSquare, Image, Mic, Terminal } from 'lucide-react';

interface NavigationProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { id: AppMode.CHAT, label: 'Chat & Vision', icon: MessageSquare, color: 'text-indigo-400' },
    { id: AppMode.IMAGE, label: 'Image Gen', icon: Image, color: 'text-purple-400' },
    { id: AppMode.SPEECH, label: 'Text to Speech', icon: Mic, color: 'text-cyan-400' },
  ];

  return (
    <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Terminal className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">MindSpark</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              currentMode === item.id
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentMode === item.id ? item.color : ''}`} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
          <p className="text-xs text-slate-400 font-medium mb-1">Model Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-300">Gemini 2.5 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
