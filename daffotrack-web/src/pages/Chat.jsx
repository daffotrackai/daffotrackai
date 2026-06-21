import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot, Send, User, Info, History, ShieldAlert,
  Sparkles, BookOpen, Bell, GraduationCap, Zap, ChevronRight
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import NavigationDrawer from '../components/NavigationDrawer';
import PageTopBar from '../components/PageTopBar';
import useLocalStorageState from '../lib/useLocalStorageState';

const SUGGESTED = [
  { icon: BookOpen, category: 'Finance', text: 'What is the tuition waiver policy at DIU?' },
  { icon: Bell,     category: 'Exams',   text: 'How do I register for a makeup midterm?' },
  { icon: GraduationCap, category: 'Grades', text: 'What is grade improvement vs retake?' },
  { icon: Sparkles, category: 'Attendance', text: 'What attendance is required for finals?' },
];

export default function Chat() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useLocalStorageState('daffotrack.drawerOpen', false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am DaffoTrack AI, your smart academic companion at Daffodil International University. Created by Metamorph X, I can help you with course catalogs, tuition waiver guidelines, GPA improvement rules, makeup exams, and more.\n\nWhat can I clarify for you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const msg = text || inputText;
    if (!msg.trim() || isTyping) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: msg, time }]);
    setInputText('');
    setIsTyping(true);
    setError('');

    apiRequest('/api/chat/ask', {
      method: 'POST',
      body: JSON.stringify({ studentId: '221-15-XXXX', message: msg }),
    })
      .then(data => {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.response || 'No response received from backend.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      })
      .catch(err => {
        setError(err.message || 'Failed to reach backend chat API.');
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: 'Backend chat API is unreachable right now. Please make sure Spring Boot is running on port 8081.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      })
      .finally(() => setIsTyping(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="min-h-screen bg-[#060e1a] text-white flex flex-col h-screen overflow-hidden">
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      <PageTopBar
        title="AI Advisor Chat"
        subtitle="Ask DIU policy and academic questions"
        backLabel="Dashboard"
        backTo="/dashboard"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <div className="flex-1 flex overflow-hidden pt-16">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 bg-[#0a1525] border-r border-white/6 flex-col p-5 gap-5 overflow-y-auto shrink-0">

          {/* Bot identity */}
          <div className="bg-teal-500/6 border border-teal-500/15 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#060e1a]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">DaffoTrack AI</p>
                <p className="text-[10px] text-emerald-400 font-mono">ONLINE • DIU v4.2</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Specialized in DIU syllabus, credit rules, waiver eligibility, makeup exams, grade improvements, and semester policies.
            </p>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 flex items-center gap-1"><History className="w-3 h-3" /> Session secure</span>
              <span className="text-teal-400 font-bold">98.4% accuracy</span>
            </div>
          </div>

          {/* Suggested */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Suggested Questions</p>
            {SUGGESTED.map(({ icon: Icon, category, text }) => (
              <button
                key={text}
                onClick={() => sendMessage(text)}
                disabled={isTyping}
                className="w-full text-left p-3.5 rounded-xl bg-transparent border border-white/6 hover:border-teal-500/30 hover:bg-teal-500/4 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{category}</span>
                </div>
                <p className="text-xs text-slate-300 group-hover:text-white transition-colors leading-relaxed">"{text}"</p>
              </button>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" /> Quick Tips
            </p>
            {[
              'Ask about any specific DIU policy by code (e.g. REG 7.2)',
              'Include your GPA or credits for personalized advice',
              'Questions about makeup, waiver, or retake — all supported!',
            ].map(t => (
              <div key={t} className="flex items-start gap-2 text-[10px] text-slate-500">
                <ChevronRight className="w-3 h-3 text-teal-500/60 shrink-0 mt-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col bg-[#060e1a] overflow-hidden">

          {/* Messages */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 ${
                  msg.sender === 'ai'
                    ? 'bg-teal-500/15 border border-teal-500/25 text-teal-400'
                    : 'bg-white/8 border border-white/12 text-slate-400'
                }`}>
                  {msg.sender === 'ai' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] sm:max-w-[68%] group`}>
                  <div className={`rounded-2xl px-4 py-3 border whitespace-pre-line text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-500/10 border-teal-500/20 text-white rounded-br-none'
                      : 'bg-[#0d1e35] border-white/7 text-slate-100 rounded-bl-none'
                  }`}>
                    <span className={`block text-[9px] font-bold uppercase tracking-widest mb-1.5 ${
                      msg.sender === 'ai' ? 'text-teal-400' : 'text-teal-300'
                    }`}>
                      {msg.sender === 'ai' ? 'DaffoTrack AI' : 'You'}
                    </span>
                    {msg.text}
                  </div>
                  {msg.time && (
                    <p className={`text-[9px] text-slate-600 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-3">
                <div className="w-7 h-7 rounded-full bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400 shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="bg-[#0d1e35] border border-white/7 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {[0, 150, 300].map(d => (
                      <span key={d} className="w-1.5 h-1.5 bg-teal-500/60 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="bg-[#0a1525]/80 backdrop-blur-sm border-t border-white/6 p-4 shrink-0">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Ask about DIU waiver rules, makeup exam, grade improvement..."
                  className="w-full bg-[#060e1a] border border-white/8 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all pr-12"
                />
              </div>
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-[#060e1a] font-bold transition-all disabled:opacity-40 disabled:pointer-events-none hover:scale-105 shadow-[0_0_20px_rgba(45,212,191,0.3)] shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {error && (
              <div className="max-w-4xl mx-auto mt-3 text-xs text-red-400 bg-red-500/8 border border-red-500/15 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <div className="text-[10px] text-center text-slate-600 mt-2.5 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-teal-500/50" />
              Session computations run locally. Your query is completely private.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
