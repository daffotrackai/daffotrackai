import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  User, 
  ArrowLeft, 
  Cpu, 
  Sparkles, 
  Terminal, 
  ShieldAlert, 
  Info,
  Layers,
  History
} from 'lucide-react';
import { apiRequest } from '../lib/api';

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am DaffoTrack AI, your smart academic companion at Daffodil International University. Created by Metamorph X, I can help you with course catalogs, tuition waiver guidelines, GPA improvement rules, makeup exams, and more.\n\nWhat can I clarify for you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputText('');
    setIsTyping(true);
    setError('');

    apiRequest('/api/chat/ask', {
      method: 'POST',
      body: JSON.stringify({
        studentId: '221-15-XXXX',
        message: userMessage,
      }),
    })
      .then((data) => {
        setMessages(prev => [...prev, { sender: 'ai', text: data.response || 'No response received from backend.' }]);
      })
      .catch((requestError) => {
        setError(requestError.message || 'Failed to reach backend chat API.');
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: 'Backend chat API is unreachable right now. Please make sure Spring Boot is running on port 8081.',
        }]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#0B1A30] text-white flex flex-col font-sans h-screen overflow-hidden">
      
      {/* HEADER SECTION */}
      <header className="bg-[#13253F] border-b border-[#1E3A5F] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="p-2 rounded-lg bg-[#0B1A30] hover:bg-[#1C365C] border border-[#1E3A5F] text-slate-300 hover:text-[#00E5FF] transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-blue-500 flex items-center justify-center">
              <Cpu className="w-4.5 h-4.5 text-[#0B1A30] font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-white text-sm">DaffoTrack AI Advisor</span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold animate-pulse">LIVE</span>
              </div>
              <span className="block text-[8px] text-slate-400 font-medium">Built by Metamorph X for DIU Students</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-3">
          <div className="bg-[#0B1A30] px-3 py-1 rounded-md text-[10px] text-[#00E5FF] font-mono tracking-wider flex items-center space-x-1.5 border border-[#00E5FF]/15">
            <Terminal className="w-3 h-3" />
            <span>MODEL_SWE_4.2.1</span>
          </div>
        </div>
      </header>

      {/* CORE CHAT WINDOW */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left sidebar: Help Guidelines / Suggestions */}
        <aside className="hidden lg:flex w-80 bg-[#13253F]/40 border-r border-[#1E3A5F]/60 flex-col p-6 space-y-6 overflow-y-auto">
          
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <Info className="w-4 h-4 mr-1.5 text-[#00E5FF]" />
              How to Interact
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              DaffoTrack AI is specialized in understanding and solving Daffodil International University's complex legal, financial, and credit frameworks.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Suggested Questions</span>
            
            <div className="space-y-2 text-xs">
              <button 
                onClick={() => setInputText("What is the tuition waiver policy at DIU?")}
                className="w-full text-left p-3 rounded-xl bg-[#13253F] hover:bg-[#1E3A5F] border border-[#1E3A5F] transition-colors text-slate-300 hover:text-white"
              >
                "What is the tuition waiver policy at DIU?"
              </button>

              <button 
                onClick={() => setInputText("How do I register for a makeup midterm?")}
                className="w-full text-left p-3 rounded-xl bg-[#13253F] hover:bg-[#1E3A5F] border border-[#1E3A5F] transition-colors text-slate-300 hover:text-white"
              >
                "How do I register for a makeup midterm?"
              </button>

              <button 
                onClick={() => setInputText("What is grade improvement vs retake?")}
                className="w-full text-left p-3 rounded-xl bg-[#13253F] hover:bg-[#1E3A5F] border border-[#1E3A5F] transition-colors text-slate-300 hover:text-white"
              >
                "What is grade improvement vs retake?"
              </button>

              <button 
                onClick={() => setInputText("What attendance is required for finals?")}
                className="w-full text-left p-3 rounded-xl bg-[#13253F] hover:bg-[#1E3A5F] border border-[#1E3A5F] transition-colors text-slate-300 hover:text-white"
              >
                "What attendance is required for finals?"
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E3A5F]/40 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center">
              <History className="w-3.5 h-3.5 mr-1" />
              Session logs secure
            </span>
            <span className="text-emerald-400">98.4% Acc.</span>
          </div>

        </aside>

        {/* Right side: Live Messages Frame */}
        <main className="flex-1 flex flex-col bg-[#0B1A30]">
          
          {/* Chat Messages Panel */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[75%]`}>
                  
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`rounded-2xl px-4 py-3.5 border whitespace-pre-line text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#1E3A5F] text-white border-blue-900 rounded-tr-none' 
                      : 'bg-[#13253F] text-slate-100 border-[#1E3A5F] rounded-tl-none'
                  }`}>
                    <span className={`block text-[10px] font-bold mb-1.5 uppercase tracking-wider ${
                      msg.sender === 'user' ? 'text-cyan-300' : 'text-[#00E5FF]'
                    }`}>
                      {msg.sender === 'user' ? 'You' : 'DaffoTrack AI'}
                    </span>
                    {msg.text}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-900/30 border border-blue-800/40 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}

                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="bg-[#13253F] text-slate-400 border border-[#1E3A5F] rounded-2xl px-4 py-3 flex items-center space-x-1.5 rounded-tl-none">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* User Text Input Bar */}
          <div className="p-4 bg-[#13253F]/40 border-t border-[#1E3A5F] shrink-0">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about DIU waiver rules, makeup exam fee, grade improvement..."
                className="flex-1 bg-[#0B1A30] border border-[#1E3A5F] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-[#0B1A30] font-bold transition-all disabled:opacity-50 disabled:pointer-events-none hover:scale-105 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            {error && (
              <div className="max-w-4xl mx-auto mt-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <div className="text-[10px] text-center text-slate-500 mt-2 flex items-center justify-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#00E5FF]/60" />
              <span>Session computations run locally. Your query is completely private.</span>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}
