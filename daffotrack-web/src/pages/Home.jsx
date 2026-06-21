import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Bot, Bell, TrendingUp, Sparkles, Clock,
  ArrowRight, ChevronRight, Menu, X, Terminal, Cpu,
  GraduationCap, ShieldCheck, Award, BookMarked,
  MessageSquareCode, Zap, Star
} from 'lucide-react';
import NavigationDrawer from '../components/NavigationDrawer';
import PageTopBar from '../components/PageTopBar';
import useLocalStorageState from '../lib/useLocalStorageState';

export default function Home() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useLocalStorageState('daffotrack.drawerOpen', false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('advisor');
  const [simulatedChat, setSimulatedChat] = useState([
    { sender: 'user', text: 'How do I maintain my semester waiver at DIU?' },
    { sender: 'ai', text: 'To maintain your waiver, DIU policy requires you to complete a minimum of 12 credits in the previous semester with a GPA of 3.00 or higher (no "F" or "I" grades). The waiver rate is based on your CGPA: 3.80–3.89 gives 40%, 3.90–3.99 gives 60%, and a perfect 4.00 grants a 100% tuition fee waiver!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const chatPresets = {
    advisor: {
      question: 'Which courses should I choose for 6th semester SWE?',
      answer: 'For SWE 6th semester, focus on Software Architecture, Web Engineering, and Enterprise Systems. Pair 2 high-intensity coding labs with 1 theoretical course and 1 general elective. Make sure you complete SWE 311 (Software Engineering) — it\'s a prerequisite for your Capstone Project next semester!'
    },
    cgpa: {
      question: "What's the effect of a Retake vs. Improvement?",
      answer: "Under DIU rules:\n\n1. Retake: Applicable if you got an 'F' grade. Register again, pay standard credit fees, and your new grade completely replaces the 'F' in CGPA.\n2. Grade Improvement: If you got B- or below, you can retake to improve. The higher grade counts towards CGPA, but the previous attempt remains on the transcript."
    },
    policy: {
      question: 'I missed my Midterm. What is the Makeup exam procedure?',
      answer: "Don't panic! For Midterm absences:\n\n1. Collect a medical certificate or formal proof.\n2. Apply to your Head of Department within 3 working days of the missed exam.\n3. Upon approval, register for the 'Makeup Midterm Exam' at the office.\n\nNote: DIU charges a makeup fee of BDT 1,000 per course unless waived under special medical emergencies approved by the Dean."
    }
  };

  const handlePresetClick = (key) => {
    setActiveTab(key);
    setIsTyping(true);
    setSimulatedChat([{ sender: 'user', text: chatPresets[key].question }]);
    setTimeout(() => {
      setSimulatedChat([
        { sender: 'user', text: chatPresets[key].question },
        { sender: 'ai', text: chatPresets[key].answer }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#060e1a] text-white selection:bg-teal-500/20 selection:text-teal-300">
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      <PageTopBar
        title="DaffoTrack AI"
        subtitle="Smart academic companion for DIU students"
        showBack={false}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[500px] bg-teal-500/6 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-[600px] right-0 w-[500px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#060e1a]/90 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 p-[1.5px] shadow-[0_0_20px_rgba(45,212,191,0.35)]">
              <div className="w-full h-full bg-[#060e1a] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-4.5 h-4.5 text-teal-400" />
              </div>
            </div>
            <div>
              <span className="text-[17px] font-bold tracking-tight text-white">DaffoTrack <span className="text-teal-400">AI</span></span>
              <span className="block text-[9px] text-slate-500 font-semibold tracking-widest uppercase">by Metamorph X</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['#features', '#sandbox', '#diu-rules', '#about'].map((href, i) => (
              <a key={href} href={href} className="text-sm text-slate-400 hover:text-teal-400 transition-colors font-medium">
                {['Features', 'Live Demo', 'DIU Guides', 'About'][i]}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <Link to="/login" className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-teal-500 text-[#060e1a] font-bold text-sm hover:bg-teal-400 transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]">
              Launch App <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0a1525]/98 backdrop-blur-xl border-b border-white/5 px-4 pt-3 pb-5 space-y-1">
            {[['#features','Features'],['#sandbox','Live Demo'],['#diu-rules','DIU Guides'],['#about','About']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm text-slate-300 hover:text-teal-400 rounded-lg hover:bg-white/5 transition-all">{label}</a>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-white/5">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 text-sm text-slate-300 bg-white/5 rounded-xl font-medium">Sign In</Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 text-sm text-[#060e1a] bg-teal-500 rounded-xl font-bold">Launch App</Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">

            {/* Copy */}
            <div className="lg:col-span-6 space-y-7">
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-widest">Premier AI Portal for DIU Students</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[1.05] text-white">
                Your Smart<br />
                <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Academic
                </span><br />
                Companion.
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                AI-driven academic insights built for Daffodil International University. Track CGPA, forecast attendance, and solve complex DIU policy questions in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/login" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-teal-500 text-[#060e1a] font-bold text-sm shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(45,212,191,0.55)] hover:bg-teal-400 transition-all">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#features" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 text-white font-semibold text-sm transition-all">
                  See Features
                </a>
              </div>

              {/* Stats */}
              <div className="pt-6 border-t border-white/6 grid grid-cols-3 gap-6">
                {[['98.4%','Advisor Accuracy'],['Instant','Policy Lookup'],['Free','Open Platform']].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-white tracking-tight">{val}</p>
                    <p className="text-xs text-slate-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-4 bg-teal-500/8 rounded-3xl blur-2xl" />
              <div className="relative bg-[#0d1e35] border border-white/8 rounded-2xl shadow-2xl overflow-hidden">
                {/* Browser bar */}
                <div className="bg-[#080f1c] border-b border-white/6 px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-teal-500/8 border border-teal-500/15 px-3 py-1 rounded-md">
                    <Terminal className="w-3 h-3 text-teal-400" />
                    <span className="text-[10px] text-teal-400 font-mono">DAFFOTRACK-PORTAL_V4</span>
                  </div>
                  <div className="w-8" />
                </div>

                <div className="p-5 space-y-4">
                  {/* CGPA bar */}
                  <div className="bg-white/3 border border-white/6 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CGPA Projection</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />Safe
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">3.92</span>
                      <span className="text-sm text-teal-400 font-semibold flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> +0.12 this term
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>Min (3.80)</span><span>Target</span><span>Max (4.00)</span>
                    </div>
                  </div>

                  {/* AI bubble */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/25 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    <div className="bg-[#0d1e35] border border-white/8 rounded-xl rounded-tl-none p-3 text-xs text-slate-200 leading-relaxed">
                      <span className="block text-[10px] font-bold text-teal-400 mb-1">DaffoTrack AI</span>
                      You need 14 more attendance counts in SWE-312 to meet the 75% eligibility threshold. Don't miss Monday's lecture!
                    </div>
                  </div>

                  {/* Alert */}
                  <div className="flex items-center gap-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-3 py-2.5 text-[11px] text-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                    <span>Makeup registration deadline is tomorrow at 4:00 PM!</span>
                  </div>
                </div>

                <div className="bg-[#080f1c]/60 border-t border-white/5 py-2 px-4 text-center">
                  <span className="text-[10px] text-slate-500">Synchronized with DIU Smart Portal API • 100% Secure</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white text-slate-900 relative">
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#060e1a] to-white pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full mb-4">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">What DaffoTrack Does</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Built for DIU. Designed for Excellence.</h2>
            <p className="text-slate-500 text-lg">Purpose-built AI tools configured around Daffodil's semester framework, policies, and regulations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: 'CGPA Tracking & Prediction', desc: 'Log midterm results, quizzes, and continuous grades. Instantly predicts your final CGPA and shows optimal target grades.', link: 'How it calculates' },
              { icon: Bot, title: '24/7 AI Advisor Bot', desc: 'A personalized smart tutor trained on DIU syllabus catalogs, credit rules, prerequisites, and registration procedures.', link: 'Try AI Sandbox' },
              { icon: Bell, title: 'DIU Smart Policy Guide', desc: 'Instant guidance on Grade Improvement, Retakes, Makeup Midterms, Semester Drop, and tuition fee waivers.', link: 'View policies' },
              { icon: Clock, title: '75% Attendance Predictor', desc: 'Track how many absences are left before losing exam eligibility. Stay alerted before falling below critical levels.', link: 'Check calculator' }
            ].map(({ icon: Icon, title, desc, link }) => (
              <div key={title} className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-400/50 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-[#060e1a] flex items-center justify-center text-teal-400 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{desc}</p>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-slate-700 group-hover:text-teal-600 transition-colors">
                  {link} <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Privacy banner */}
          <div className="mt-12 bg-[#060e1a] rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" /> Privacy & Academic Integrity
              </h4>
              <p className="text-sm text-slate-400">DaffoTrack AI does not require your actual portal credentials. All calculation engines run locally, secure and isolated.</p>
            </div>
            <Link to="/login" className="whitespace-nowrap px-6 py-3 rounded-xl bg-teal-500 text-[#060e1a] font-bold text-sm hover:bg-teal-400 transition-all">
              Connect Securely
            </Link>
          </div>
        </div>
      </section>

      {/* SANDBOX */}
      <section id="sandbox" className="py-24 bg-[#060e1a] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Presets */}
            <div className="lg:col-span-5 space-y-7">
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-widest">Interactive Playground</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Try the Live AI Sandbox</h2>
              <p className="text-slate-400 text-base leading-relaxed">Click any preset below. Watch the AI interpret DIU academic policy in real time.</p>

              <div className="space-y-2.5 pt-2">
                {[
                  { key: 'advisor', icon: Bot, category: 'Academic Advisor', label: '6th Sem Course Recommendation' },
                  { key: 'cgpa', icon: BookOpen, category: 'GPA and Grades', label: 'Retake vs. Grade Improvement' },
                  { key: 'policy', icon: Bell, category: 'Exam Protocols', label: 'Makeup Midterm Procedure' }
                ].map(({ key, icon: Icon, category, label }) => (
                  <button key={key} onClick={() => handlePresetClick(key)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${activeTab === key
                      ? 'bg-teal-500/8 border-teal-500/40 shadow-[0_0_20px_rgba(45,212,191,0.1)]'
                      : 'bg-transparent border-white/6 hover:bg-white/3'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeTab === key ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 text-slate-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{category}</span>
                        <span className="text-sm font-semibold text-white">{label}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-colors ${activeTab === key ? 'text-teal-400' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Chat window */}
            <div className="lg:col-span-7">
              <div className="bg-[#0a1525] border border-white/8 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[460px]">
                <div className="bg-[#060e1a] px-5 py-4 border-b border-white/6 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#060e1a]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">DaffoTrack AI Engine</p>
                      <p className="text-[10px] text-teal-400 font-mono">MODEL-DIU-SWE_V4.2 • ONLINE</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[10px] text-teal-400 font-mono">Sandbox</span>
                  </div>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {simulatedChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 border whitespace-pre-line text-sm leading-relaxed ${msg.sender === 'user'
                        ? 'bg-teal-500/10 text-white border-teal-500/20 rounded-tr-none'
                        : 'bg-[#0d1e35] text-slate-100 border-white/8 rounded-tl-none'}`}>
                        <span className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${msg.sender === 'user' ? 'text-teal-400' : 'text-teal-400'}`}>
                          {msg.sender === 'user' ? 'You' : 'DaffoTrack AI'}
                        </span>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#0d1e35] border border-white/8 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                        {[0, 150, 300].map(d => <span key={d} className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-[#060e1a]/60 border-t border-white/5 shrink-0 flex items-center justify-between">
                  <span className="text-xs text-slate-500 italic">Select a preset to simulate...</span>
                  <Link to="/chat" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 text-[#060e1a] font-bold text-xs hover:bg-teal-400 transition-all">
                    Full Live Chat <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIU POLICY CARDS */}
      <section id="diu-rules" className="py-24 bg-[#04090f] border-t border-white/4 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">Master DIU's Complex Policies</h2>
            <p className="text-slate-400 text-base">Popular rules pre-parsed by Metamorph X's custom-built algorithms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Award, color: 'emerald', title: 'Tuition Waiver Eligibility', desc: 'Unlock up to 100% discount. Requires registration of 12+ credits, SGPA ≥ 3.00, and zero failed or incomplete courses in the previous consecutive term.', code: 'REG_CLAUSE_7.2' },
              { icon: BookMarked, color: 'amber', title: 'Grade Improvement Limit', desc: 'Allowed for any course with grade B- or below. Retaking is permitted once per course, and only the highest grade is updated in the final CGPA calculator.', code: 'ACAD_REG_4.12' },
              { icon: ShieldCheck, color: 'rose', title: 'Midterm Makeup Criteria', desc: 'Application must be filed within 3 days of missed examination with authorized proof. Non-refundable BDT 1,000 makeup fees apply.', code: 'EXAM_POL_11.5' }
            ].map(({ icon: Icon, color, title, desc, code }) => {
              const colors = {
                emerald: { bg: 'bg-emerald-500/8', text: 'text-emerald-400', border: 'border-emerald-500/15' },
                amber: { bg: 'bg-amber-500/8', text: 'text-amber-400', border: 'border-amber-500/15' },
                rose: { bg: 'bg-rose-500/8', text: 'text-rose-400', border: 'border-rose-500/15' }
              }[color];
              return (
                <div key={title} className="bg-[#0a1525]/60 border border-white/6 p-6 rounded-2xl hover:border-teal-500/25 transition-all group space-y-4">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                  <div className={`inline-block text-[10px] font-mono ${colors.text} bg-white/4 border ${colors.border} py-1 px-2.5 rounded-md`}>{code}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-[#060e1a] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <span className="inline-block text-xs font-bold text-teal-400 tracking-widest uppercase bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full">
            Crafted by Metamorph X
          </span>
          <h2 className="text-4xl font-black text-white tracking-tight">Bridging AI Innovation and Academic Success</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Metamorph X is a forward-thinking group of elite student engineers at Daffodil International University. We specialize in next-generation AI interfaces that simplify complex university frameworks.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {[[MessageSquareCode,'100% LLM Engineered','teal'],[GraduationCap,'For DIU Students','indigo'],[Cpu,'Self-Refined AI Hub','emerald']].map(([Icon, label, c]) => (
              <div key={label} className="flex items-center gap-2 bg-white/4 border border-white/8 px-5 py-2.5 rounded-xl">
                <Icon className={`w-4 h-4 text-${c}-400`} />
                <span className="text-sm font-semibold text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden bg-gradient-to-r from-teal-900/15 via-[#060e1a] to-indigo-900/15">
        <div className="absolute inset-0 bg-radial-gradient from-teal-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Ready to Accelerate Your<br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Academic Journey?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Sign up to configure your personal DIU academic planner, calculate projections, and leverage our AI advisor.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/login" className="px-8 py-4 rounded-xl bg-teal-500 text-[#060e1a] font-black text-base shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(45,212,191,0.55)] hover:bg-teal-400 transition-all">
              Get Started Free
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 font-semibold text-white text-base transition-all">
              Sign In to DaffoTrack
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#03070d] border-t border-white/4 py-10 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-7 border-b border-white/4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-[#060e1a]" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">DaffoTrack AI</span>
                <span className="block text-[9px] text-slate-600 uppercase tracking-widest">by Metamorph X</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold">
              {[['#features','Features'],['#sandbox','AI Sandbox'],['#diu-rules','DIU Rules'],['#about','About']].map(([href, label]) => (
                <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
              ))}
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} DaffoTrack AI. Crafted with passion by <span className="text-white font-semibold">Metamorph X</span>.</p>
            <p className="text-slate-600 text-center sm:text-right">Independent project — not officially affiliated with DIU.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
