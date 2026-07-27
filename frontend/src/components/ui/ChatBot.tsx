'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare, X, Send, Bot, User, Sparkles, RefreshCw,
  ShoppingBag, Tag, Truck, HelpCircle, ChevronDown, CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isRAG?: boolean;
}

const QUICK_PROMPTS = [
  { label: '🎟️ Active Coupons', query: 'What active discount coupon codes are available?' },
  { label: '🚚 Delivery Policy', query: 'What are the delivery charges and shipping time?' },
  { label: '🌾 Basmati Rice', query: 'Tell me about India Gate Basmati Rice price and stock' },
  { label: '📞 Contact Support', query: 'How can I contact customer support?' },
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: `👋 Namaste! Welcome to **Kirana Store**! \n\nI am your **Gemini AI Shopping Assistant**. I can help you search products, check discounts, delivery charges, and store policies.\n\nHow can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRAG: true,
      },
    ]);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });

      if (!res.ok) {
        throw new Error('Failed to reach chat server');
      }

      const data = await res.json();
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I'm here to help you shop! Ask me anything about our products or policies.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRAG: true,
      };

      setMessages((prev) => [...prev, botReply]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error('ChatBot request error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Kirana AI Assistant:**\n\nI'm having trouble connecting right now, but you can browse our active deals or contact support at **support@kiranastore.com**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `👋 Chat reset! I am your **Kirana AI Shopping Assistant**. How can I help you find fresh groceries today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRAG: true,
      },
    ]);
  };

  // Helper to format text with Markdown bold and internal links
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="space-y-1 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Process markdown links [Title](/path)
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          const parts = [];
          let lastIndex = 0;
          let match;

          while ((match = linkRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              parts.push(line.substring(lastIndex, match.index));
            }
            parts.push(
              <Link
                key={match.index}
                href={match[2]}
                onClick={() => setIsOpen(false)}
                className="font-medium text-emerald-700 underline hover:text-emerald-900 inline-flex items-center gap-0.5"
              >
                {match[1]}
              </Link>
            );
            lastIndex = match.index + match[0].length;
          }
          if (lastIndex < line.length) {
            parts.push(line.substring(lastIndex));
          }

          const processedContent = parts.length > 0 ? parts : [line];

          // Process bold formatting **text**
          const renderBold = (items: (string | React.ReactNode)[]) => {
            return items.map((item, i) => {
              if (typeof item !== 'string') return item;
              const segments = item.split(/\*\*(.*?)\*\*/g);
              return segments.map((seg, j) =>
                j % 2 === 1 ? <strong key={j} className="font-semibold text-slate-900">{seg}</strong> : seg
              );
            });
          };

          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');

          return (
            <div key={idx} className={isBullet ? 'pl-2 text-slate-700 font-normal' : ''}>
              {renderBold(processedContent)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Kirana AI Chat"
          className="relative group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        >
          {/* Animated pulse ring */}
          <span className="absolute -inset-0.5 rounded-full bg-emerald-400 opacity-75 blur animate-pulse group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

          <div className="relative flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-md">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="hidden sm:inline font-semibold text-sm tracking-wide pr-1">
              Ask Kirana AI
            </span>
            <Sparkles className="h-4 w-4 text-amber-300 animate-bounce hidden sm:inline" />

            {/* Unread Badge */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                !
              </span>
            )}
          </div>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="flex flex-col w-[92vw] sm:w-[400px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 flex items-center justify-between shadow-md relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Bot className="h-5 w-5 text-emerald-100" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-800" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base leading-tight">Kirana AI Assistant</h3>
                  <span className="bg-emerald-500/30 text-emerald-100 text-[10px] font-medium px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-amber-300" /> Gemini RAG
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-300" /> Ready to help 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-slate-50 border-b border-slate-200/60 p-2.5 overflow-x-auto flex gap-2 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt.query)}
                disabled={isLoading}
                className="whitespace-nowrap text-xs font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-full shadow-sm transition-all flex items-center gap-1"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl shadow-sm text-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    renderFormattedText(msg.text)
                  )}

                  <div
                    className={`mt-1 text-[10px] text-right ${
                      msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-slate-200/80 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Gemini AI searching store RAG base...</span>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, coupons, delivery..."
                disabled={isLoading}
                className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Powered by Gemini 1.5 & RAG</span>
              <span>Kirana Store Assistant</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
