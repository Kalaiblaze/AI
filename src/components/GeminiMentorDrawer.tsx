import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageSquare, Bot, User } from 'lucide-react';
import { NeatPillarData } from '../engine/nexusNeatEngine';
import { generateDynamicMentorFallback } from '../engine/mentorReplyEngine';

export interface ChatTurn {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface GeminiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePillarData: NeatPillarData;
}

const QUICK_PROMPTS = [
  'Hi Boss!',
  'Give me a sharp question to ask in meetings',
  'Why did the legacy incumbent crash here?',
  'Deep-dive the real engineering & supply chain bottleneck'
];

export const GeminiMentorDrawer: React.FC<GeminiMentorDrawerProps> = ({
  isOpen,
  onClose,
  activePillarData
}) => {
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `Vanakkam Boss! Welcome to the war room. Say hi, ask for a tactical meeting question, or pick any deep-dive angle on ${activePillarData.shortName}—namma template illama direct-ah real mechanics pesuvom.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userTurn: ChatTurn = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const nextHistory = [...messages, userTurn];
    setMessages(nextHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
          activePillarName: activePillarData.shortName,
          activeHeadline: activePillarData.headline
        })
      });

      const data = await response.json();
      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'Fallback to dynamic mentor engine');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ]);
    } catch {
      const dynamicReply = generateDynamicMentorFallback(
        trimmed,
        activePillarData
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: dynamicReply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gemini-mentor-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-lg bg-[#0D1017] border-l border-white/[0.07] h-full flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.07] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="gemini-mentor-title"
                className="font-display text-lg font-bold text-white flex items-center gap-2"
              >
                <span>FUTIFY Carbon Mentor</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 font-mono text-[9px] font-bold text-rose-300">
                  &lt;0.5s FLASH
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Elite Pattern Recognition Professor · Flash-to-Carbon
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Mentor Chat"
            className="p-2 rounded-lg bg-[#06070A] border border-white/[0.07] text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((turn) => {
            const isUser = turn.role === 'user';
            return (
              <div
                key={turn.id}
                className={`flex items-start gap-3 ${
                  isUser ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    isUser
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                      : 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={`max-w-[84%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-cyan-400 text-slate-950 font-medium'
                      : 'bg-[#06070A] border border-white/[0.07] text-slate-100'
                  }`}
                >
                  <p>{turn.text}</p>
                  <span
                    className={`block text-[11px] mt-2 ${
                      isUser ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {turn.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono pl-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing intent &amp; mechanics...</span>
            </div>
          )}
          <div ref={scrollEndRef} />
        </div>

        {/* Footer Input & Quick Prompts */}
        <div className="p-5 border-t border-white/[0.07] bg-[#06070A] space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="px-3 py-1.5 rounded-lg bg-[#0D1017] hover:bg-white/[0.06] border border-white/[0.07] text-xs text-slate-300 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
            <label htmlFor="mentor-chat-input" className="sr-only">
              Ask the Pattern Recognition Mentor
            </label>
            <input
              id="mentor-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Say hi, ask for a meeting question, or deep-dive ${activePillarData.shortName}...`}
              className="flex-1 rounded-lg bg-[#0D1017] border border-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              aria-label="Send chat message"
              className="px-4 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 font-semibold transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
};
