import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Bot,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  User as UserIcon,
  RotateCcw,
  HelpCircle,
  Code2,
  Crown,
  Mic,
  MicOff,
} from 'lucide-react';
import { ChatMessage, User } from '../types';
import { getStoredGroqKey } from '../lib/groqStorage';

interface HelpDeskAgentProps {
  user: User | null;
}

const FAQ_SUGGESTIONS = [
  'How do I write an effective prompt for v0 or Midjourney?',
  'What are the token limits for Free vs Pro tiers?',
  'How do I toggle Owner Mode to manage plans?',
  'Can I pay membership via GPay/UPI (9045459699)?',
];

export const HelpDeskAgent: React.FC<HelpDeskAgentProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello ${user ? user.name : 'Creator'}! 👋 I am your PromptCraft AI Assistant.\n\nHow can I help you today with prompt engineering, site layout customization, or membership tier questions? You can speak or type your question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [voicePlayback, setVoicePlayback] = useState<boolean>(true);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Speech Recognition for Help Desk
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let text = '';
        for (let i = 0; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        if (text.trim()) {
          setInputMessage(text);
        }
      };

      rec.onend = () => {
        setIsListeningMic(false);
      };

      rec.onerror = () => {
        setIsListeningMic(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleMicListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListeningMic) {
      recognitionRef.current.stop();
      setIsListeningMic(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListeningMic(true);
      } catch (err) {
        console.error('Failed starting mic:', err);
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && voicePlayback) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const groqKey = getStoredGroqKey();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(groqKey ? { 'x-groq-api-key': groqKey } : {}),
        },
        body: JSON.stringify({
          message: query,
          groqApiKey: groqKey,
          userContext: {
            name: user?.name,
            tier: user?.plan,
            isAdmin: user?.isAdmin,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Support agent service error');
      }

      const data = await res.json();
      const replyText = data.reply || "I'm currently unable to process that request.";

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);

      if (voicePlayback) {
        speakText(replyText);
      }
    } catch (err) {
      console.error('Help desk chat error:', err);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          text: 'I am experiencing a temporary connection hiccup. Please try asking again in a moment!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#0a0a0a] border border-zinc-800 p-6 rounded-2xl shadow-2xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-semibold text-white">AI Help Desk Support</h1>
              <span className="text-[10px] font-mono uppercase tracking-widest bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                ONLINE • GEMINI AI
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Instant design consultation, prompt crafting advice, and platform assistance.
            </p>
          </div>
        </div>

        {/* Voice Playback Toggle */}
        <button
          onClick={() => setVoicePlayback(!voicePlayback)}
          className={`px-4 py-2 rounded-xl text-xs font-mono border transition flex items-center gap-2 ${
            voicePlayback
              ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
              : 'bg-[#111111] border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          {voicePlayback ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
          <span>Voice Responses {voicePlayback ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Main Chat Box */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl p-6 flex flex-col h-[520px]">
        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-sans text-xs">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-xl p-4 leading-relaxed whitespace-pre-line shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-[#111111] border border-zinc-800 text-zinc-200'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[9px] font-mono mt-1 text-right ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-zinc-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt="User"
                  className="w-8 h-8 rounded-lg object-cover border border-zinc-700 shrink-0"
                />
              )}
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
              </div>
              <div className="bg-[#111111] border border-zinc-800 p-3 rounded-xl text-xs text-zinc-400 font-mono">
                PromptCraft Agent thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick FAQ Chips */}
        <div className="pt-4 border-t border-zinc-800/80 mb-3 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0">Preset Queries:</span>
          {FAQ_SUGGESTIONS.map((faq, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(faq)}
              className="text-[11px] bg-[#111111] hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-3 py-1 rounded-lg whitespace-nowrap transition shrink-0"
            >
              {faq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Speak or type your question for AI help..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="w-full bg-[#111111] border border-zinc-800 rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-medium"
            />
            <button
              type="button"
              onClick={toggleMicListening}
              className={`absolute right-2 top-2 p-1.5 rounded-lg transition ${
                isListeningMic
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/50'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title={isListeningMic ? 'Listening... Speak now' : 'Click to Speak'}
            >
              {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
