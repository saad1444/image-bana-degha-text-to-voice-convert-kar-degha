import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessage } from '../services/geminiService';
import { Send, Image as ImageIcon, Trash2, User, Bot, Loader2, X } from 'lucide-react';

export const ChatMode: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: "Hello! I'm powered by Gemini 2.5 Flash. I can answer questions, analyze images, and help you with tasks. How can I assist you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const responseText = await sendMessage(userMsg.text, userMsg.image);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ id: 'welcome', role: 'model', text: "Chat cleared. How can I help you now?" }]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Chat & Vision</h2>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="User upload" 
                  className="max-w-[300px] rounded-lg border border-slate-700 shadow-lg mb-2" 
                />
              )}
              <div 
                className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : msg.isError 
                      ? 'bg-red-900/20 text-red-200 border border-red-800 rounded-tl-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                }`}
              >
                {msg.text || (msg.image ? "Analyze this image." : "")}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-5 h-5 text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-slate-400 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        {selectedImage && (
          <div className="mb-2 flex items-center gap-2 bg-slate-800 w-fit px-3 py-2 rounded-lg border border-slate-700">
            <img src={selectedImage} alt="Preview" className="w-8 h-8 rounded object-cover" />
            <span className="text-xs text-slate-300">Image selected</span>
            <button onClick={() => setSelectedImage(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-end gap-3 relative">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-indigo-400 transition-colors border border-slate-700"
            title="Upload Image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message Gemini..."
              className="w-full bg-transparent text-white p-3 min-h-[48px] max-h-[120px] resize-none outline-none text-sm"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-900/20"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};
