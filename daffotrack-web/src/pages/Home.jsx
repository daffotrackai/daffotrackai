import { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  BookOpen, Bot, Bell, TrendingUp, Sparkles, Clock,
  ArrowRight, ChevronRight, Menu, X, Terminal, Cpu,
  GraduationCap, ShieldCheck, Award, BookMarked,
  MessageSquareCode, Zap, Sun, Moon
} from 'lucide-react';
import PageTopBar from '../components/PageTopBar';
import AppLogo from '../components/AppLogo';
import { useTheme } from '../lib/ThemeContext';

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { drawerOpen, setDrawerOpen } = useOutletContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('advisor');
  const [activeSection, setActiveSection] = useState('');
  const [simulatedChat, setSimulatedChat] = useState([
    { sender: 'user', text: 'How do I maintain my semester waiver at DIU?' },
    { sender: 'ai', text: 'To maintain your waiver, DIU policy requires you to complete a minimum of 12 credits in the previous semester with a GPA of 3.00 or higher (no "F" or "I" grades). The waiver rate is based on your CGPA: 3.80–3.89 gives 40%, 3.90–3.99 gives 60%, and a perfect 4.00 grants a 100% tuition fee waiver!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollContainer = document.querySelector('main');

    const onScroll = () => {
      if (scrollContainer) {
        setScrolled(scrollContainer.scrollTop > 20);
        if (scrollContainer.scrollTop < 100) {
          setActiveSection('');
        }
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', onScroll);
    }

    // Scroll Spy Logic
    const sections = ['features', 'sandbox', 'diu-rules', 'about'];
    const observerOptions = {
      root: scrollContainer,
      rootMargin: '-10% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', onScroll);
      }
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
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

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      // Find the scrollable container (the main tag in MainLayout)
      const container = element.closest('main');
      if (container) {
        const top = element.offsetTop - 80;
        container.scrollTo({
          top,
          behavior: 'smooth'
        });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-main) text-(--text-main) selection:bg-teal-500/20 selection:text-teal-500">
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[500px] bg-teal-500/6 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-[600px] right-0 w-[500px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${scrolled ? 'bg-(--bg-header) backdrop-blur-xl py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <AppLogo size="lg" className="group-hover:scale-110 transition-transform" />
            <div>
              <span className={`text-[17px] font-bold tracking-tight text-(--text-main)`}>DaffoTrack <span className="text-teal-500">AI</span></span>
              <span className="block text-[9px] text-(--text-muted) font-semibold tracking-widest uppercase">by Metamorph X</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-white/5 dark:bg-white/5 light:bg-black/5 p-1 rounded-2xl border border-(--border-main)">
            {[
              { id: 'features', label: 'Features' },
              { id: 'sandbox', label: 'Live Demo' },
              { id: 'diu-rules', label: 'DIU Guides' },
              { id: 'about', label: 'About' }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, `#${item.id}`)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  activeSection === item.id
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                    : 'text-(--text-muted) hover:text-(--text-main) hover:bg-white/5'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-(--border-main) bg-white/5 dark:bg-white/5 light:bg-black/5 flex items-center justify-center text-(--text-muted) hover:text-teal-500 hover:border-teal-500/20 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Link to="/login" className="text-sm font-semibold text-(--text-muted) hover:text-(--text-main) transition-colors">Sign In</Link>
            <Link to="/login" className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-teal-500 text-white font-bold text-sm hover:bg-teal-400 transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]">
              Launch App <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-(--text-muted)">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Divider bar under the header */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-(--border-main) to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-(--bg-card) backdrop-blur-xl border-b border-(--border-main) px-4 pt-3 pb-5 space-y-1 animate-in slide-in-from-top-4 duration-300">
            {[
              { id: 'features', label: 'Features' },
              { id: 'sandbox', label: 'Live Demo' },
              { id: 'diu-rules', label: 'DIU Guides' },
              { id: 'about', label: 'About' }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => { setIsMobileMenuOpen(false); scrollToSection(e, `#${item.id}`); }}
                className={`block py-2.5 px-3 text-sm rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-teal-500/10 text-teal-500 font-bold'
                    : 'text-(--text-muted) hover:text-teal-500 hover:bg-white/5'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-(--border-main)">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 py-2.5 text-sm text-(--text-muted) bg-white/5 rounded-xl font-medium"
              >
                {theme === 'light' ? <><Moon className="w-4 h-4" /> Dark Mode</> : <><Sun className="w-4 h-4" /> Light Mode</>}
              </button>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 text-sm text-(--text-muted) bg-white/5 rounded-xl font-medium">Sign In</Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 text-sm text-white bg-teal-500 rounded-xl font-bold">Launch App</Link>
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
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                <span className="text-[11px] font-bold text-teal-500 uppercase tracking-widest">Premier AI Portal for DIU Students</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[1.05] text-(--text-main)">
                Your Smart<br />
                <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
                  Academic
                </span><br />
                Companion.
              </h1>

              <p className="text-(--text-muted) text-lg leading-relaxed max-w-lg">
                AI-driven academic insights built for Daffodil International University. Track CGPA, forecast attendance, and solve complex DIU policy questions in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/login" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-teal-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(45,212,191,0.55)] hover:bg-teal-400 transition-all">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#features" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 border border-(--border-main) hover:bg-white/8 text-(--text-main) font-semibold text-sm transition-all">
                  See Features
                </a>
              </div>

              {/* Stats */}
              <div className="pt-6 border-t border-(--border-main) grid grid-cols-3 gap-6">
                {[['98.4%','Advisor Accuracy'],['Instant','Policy Lookup'],['Free','Open Platform']].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-(--text-main) tracking-tight">{val}</p>
                    <p className="text-xs text-(--text-muted) mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-4 bg-teal-500/8 rounded-3xl blur-2xl" />
              <div className="relative bg-(--bg-card) border border-(--border-main) rounded-2xl shadow-2xl overflow-hidden">
                {/* Browser bar */}
                <div className="bg-(--bg-main) border-b border-(--border-main) px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-teal-500/8 border border-teal-500/15 px-3 py-1 rounded-md">
                    <Terminal className="w-3 h-3 text-teal-500" />
                    <span className="text-[10px] text-teal-500 font-mono">DAFFOTRACK-PORTAL_V4</span>
                  </div>
                  <div className="w-8" />
                </div>

                <div className="p-5 space-y-4">
                  {/* CGPA bar */}
                  <div className="bg-(--bg-main) border border-(--border-main) rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider">CGPA Projection</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Safe
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-(--text-main)">3.92</span>
                      <span className="text-sm text-teal-500 font-semibold flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> +0.12 this term
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-(--text-muted) mt-1.5">
                      <span>Min (3.80)</span><span>Target</span><span>Max (4.00)</span>
                    </div>
                  </div>

                  {/* AI bubble */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/25 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-teal-500" />
                    </div>
                    <div className="bg-(--bg-main) border border-(--border-main) rounded-xl rounded-tl-none p-3 text-xs text-(--text-main) leading-relaxed">
                      <span className="block text-[10px] font-bold text-teal-500 mb-1">DaffoTrack AI</span>
                      You need 14 more attendance counts in <span className="font-bold">CSE226</span> to meet the 75% eligibility threshold. Don't miss Monday's lecture!
                    </div>
                  </div>

                  {/* Alert */}
                  <div className="flex items-center gap-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-3 py-2.5 text-[11px] text-amber-600 dark:text-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                    <span>Makeup registration deadline is tomorrow at 4:00 PM!</span>
                  </div>
                </div>

                <div className="bg-(--bg-main)/60 border-t border-(--border-main) py-2 px-4 text-center">
                  <span className="text-[10px] text-(--text-muted)">Synchronized with DIU Smart Portal API • 100% Secure</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-(--bg-card) text-(--text-main) relative border-t border-(--border-main)">
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-(--bg-main) to-(--bg-card) pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-(--bg-main) pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full mb-4">
              <Zap className="w-3.5 h-3.5 text-teal-500" />
              <span className="text-xs font-bold text-teal-500 uppercase tracking-wider">What DaffoTrack Does</span>
            </div>
            <h2 className="text-4xl font-black text-(--text-main) tracking-tight mb-4">Built for DIU. Designed for Excellence.</h2>
            <p className="text-(--text-muted) text-lg">Purpose-built AI tools configured around Daffodil's semester framework, policies, and regulations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: 'CGPA Tracking & Prediction', desc: 'Log midterm results, quizzes, and continuous grades. Instantly predicts your final CGPA and shows optimal target grades.', link: 'How it calculates', path: '/planner' },
              { icon: Bot, title: '24/7 AI Advisor Bot', desc: 'A personalized smart tutor trained on DIU syllabus catalogs, credit rules, prerequisites, and registration procedures.', link: 'Try AI Sandbox', path: '/chat' },
              { icon: Bell, title: 'DIU Smart Policy Guide', desc: 'Instant guidance on Grade Improvement, Retakes, Makeup Midterms, Semester Drop, and tuition fee waivers.', link: 'View policies', path: '/policies' },
              { icon: Clock, title: '75% Attendance Predictor', desc: 'Track how many absences are left before losing exam eligibility. Stay alerted before falling below critical levels.', link: 'Check calculator', path: '/planner' }
            ].map(({ icon: Icon, title, desc, link, path }) => (
              <div key={title} className="group bg-(--bg-surface) hover:bg-(--bg-main) rounded-2xl p-6 border border-(--border-main) hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-(--text-main) mb-2">{title}</h3>
                <p className="text-(--text-muted) text-sm leading-relaxed flex-1">{desc}</p>
                <Link to={path} className="mt-5 pt-4 border-t border-(--border-main) flex items-center text-xs font-bold text-(--text-muted) group-hover:text-teal-500 transition-colors">
                  {link} <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

          {/* Privacy banner */}
          <div className="mt-12 bg-(--bg-surface) border border-(--border-main) rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <h4 className="text-base font-bold text-(--text-main) flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-500" /> Privacy & Academic Integrity
              </h4>
              <p className="text-sm text-(--text-muted)">DaffoTrack AI does not require your actual portal credentials. All calculation engines run locally, secure and isolated.</p>
            </div>
            <Link to="/login" className="whitespace-nowrap px-6 py-3 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-400 transition-all">
              Connect Securely
            </Link>
          </div>
        </div>
      </section>

      {/* SANDBOX */}
      <section id="sandbox" className="py-24 bg-(--bg-main) border-t border-(--border-main) relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Presets */}
            <div className="lg:col-span-5 space-y-7">
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                <span className="text-[11px] font-bold text-teal-500 uppercase tracking-widest">Interactive Playground</span>
              </div>
              <h2 className="text-4xl font-black text-(--text-main) tracking-tight">Try the Live AI Sandbox</h2>
              <p className="text-(--text-muted) text-base leading-relaxed">Click any preset below. Watch the AI interpret DIU academic policy in real time.</p>

              <div className="space-y-2.5 pt-2">
                {[
                  { key: 'advisor', icon: Bot, category: 'Academic Advisor', label: '6th Sem Course Recommendation' },
                  { key: 'cgpa', icon: BookOpen, category: 'GPA and Grades', label: 'Retake vs. Grade Improvement' },
                  { key: 'policy', icon: Bell, category: 'Exam Protocols', label: 'Makeup Midterm Procedure' }
                ].map(({ key, icon: Icon, category, label }) => (
                  <button key={key} onClick={() => handlePresetClick(key)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${activeTab === key
                      ? 'bg-teal-500/8 border-teal-500/40 shadow-[0_0_20px_rgba(45,212,191,0.1)]'
                      : 'bg-transparent border-(--border-main) hover:bg-white/3'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeTab === key ? 'bg-teal-500/20 text-teal-500' : 'bg-white/5 text-(--text-muted)'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-(--text-muted) uppercase tracking-wider">{category}</span>
                        <span className="text-sm font-semibold text-(--text-main)">{label}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-colors ${activeTab === key ? 'text-teal-500' : 'text-slate-400'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Chat window */}
            <div className="lg:col-span-7">
              <div className="bg-(--bg-card) border border-(--border-main) rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[460px]">
                <div className="bg-(--bg-main) px-5 py-4 border-b border-(--border-main) flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-500">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-(--bg-main)" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-(--text-main)">DaffoTrack AI Engine</p>
                      <p className="text-[10px] text-teal-500 font-mono">MODEL-DIU-SWE_V4.2 • ONLINE</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[10px] text-teal-500 font-mono">Sandbox</span>
                  </div>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {simulatedChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 border whitespace-pre-line text-sm leading-relaxed ${msg.sender === 'user'
                        ? 'bg-teal-500/10 text-(--text-main) border-teal-500/20 rounded-tr-none'
                        : 'bg-(--bg-main) text-(--text-main) border-(--border-main) rounded-tl-none'}`}>
                        <span className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${msg.sender === 'user' ? 'text-teal-500' : 'text-teal-500'}`}>
                          {msg.sender === 'user' ? 'You' : 'DaffoTrack AI'}
                        </span>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-(--bg-main) border border-(--border-main) rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                        {[0, 150, 300].map(d => <span key={d} className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-(--bg-main) border-t border-(--border-main) shrink-0 flex items-center justify-between">
                  <span className="text-xs text-(--text-muted) italic">Select a preset to simulate...</span>
                  <Link to="/chat" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 text-white font-bold text-xs hover:bg-teal-400 transition-all">
                    Full Live Chat <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIU POLICY CARDS */}
      <section id="diu-rules" className="py-24 bg-(--bg-main) border-t border-(--border-main) relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl font-black text-(--text-main) tracking-tight mb-4">Master DIU's Complex Policies</h2>
            <p className="text-(--text-muted) text-base">Popular rules pre-parsed by Metamorph X's custom-built algorithms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Award, color: 'emerald', title: 'Tuition Waiver Eligibility', desc: 'Unlock up to 100% discount. Requires registration of 12+ credits, SGPA ≥ 3.00, and zero failed or incomplete courses in the previous consecutive term.' },
              { icon: BookMarked, color: 'amber', title: 'Grade Improvement Limit', desc: 'Allowed for any course with grade B- or below. Retaking is permitted once per course, and only the highest grade is updated in the final CGPA calculator.' },
              { icon: ShieldCheck, color: 'rose', title: 'Midterm Makeup Criteria', desc: 'Application must be filed within 3 days of missed examination with authorized proof. Non-refundable BDT 1,000 makeup fees apply.' }
            ].map(({ icon: Icon, color, title, desc, code }) => {
              const colors = {
                emerald: { bg: 'bg-emerald-500/8', text: 'text-emerald-500', border: 'border-emerald-500/15' },
                amber: { bg: 'bg-amber-500/8', text: 'text-amber-500', border: 'border-amber-500/15' },
                rose: { bg: 'bg-rose-500/8', text: 'text-rose-500', border: 'border-rose-500/15' }
              }[color];
              return (
                <div key={title} className="bg-(--bg-card) border border-(--border-main) p-6 rounded-2xl hover:border-teal-500/25 transition-all group space-y-4">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-(--text-main)">{title}</h3>
                  <p className="text-sm text-(--text-muted) leading-relaxed">{desc}</p>
                  <div className={`inline-block text-[10px] font-mono ${colors.text} bg-white/4 border ${colors.border} py-1 px-2.5 rounded-md`}>{code}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-(--bg-main) border-t border-(--border-main)">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <span className="inline-block text-xs font-bold text-teal-500 tracking-widest uppercase bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full">
            Crafted by Metamorph X
          </span>
          <h2 className="text-4xl font-black text-(--text-main) tracking-tight">Bridging AI Innovation and Academic Success</h2>
          <p className="text-(--text-muted) text-lg leading-relaxed">
            Metamorph X is a forward-thinking group of elite student engineers at Daffodil International University. We specialize in next-generation AI interfaces that simplify complex university frameworks.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {[[GraduationCap,'For DIU Students','indigo'],[Cpu,'Self-Refined AI Hub','emerald']].map(([Icon, label, c]) => (
              <div key={label} className="flex items-center gap-2 bg-(--bg-card) border border-(--border-main) px-5 py-2.5 rounded-xl">
                <Icon className={`w-4 h-4 text-${c}-500`} />
                <span className="text-sm font-semibold text-(--text-main)">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-(--border-main) relative overflow-hidden bg-gradient-to-r from-teal-500/10 via-(--bg-main) to-indigo-500/10">
        <div className="absolute inset-0 bg-radial-gradient from-teal-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-(--text-main)">
            Ready to Accelerate Your<br />
            <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">Academic Journey?</span>
          </h2>
          <p className="text-(--text-muted) text-lg max-w-2xl mx-auto">Sign up to configure your personal DIU academic planner, calculate projections, and leverage our AI advisor.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/login" className="px-8 py-4 rounded-xl bg-teal-500 text-white font-black text-base shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(45,212,191,0.55)] hover:bg-teal-400 transition-all">
              Get Started Free
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 border border-(--border-main) hover:bg-white/8 font-semibold text-(--text-main) text-base transition-all">
              Sign In to DaffoTrack
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-(--bg-card) border-t border-(--border-main) py-10 text-(--text-muted) text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-7 border-b border-(--border-main)">
            <div className="flex items-center gap-3">
              <AppLogo size="sm" />
              <div>
                <span className="font-bold text-(--text-main) text-sm">DaffoTrack AI</span>
                <span className="block text-[9px] text-(--text-muted) uppercase tracking-widest">by Metamorph X</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold">
              {[['#features','Features'],['#sandbox','AI Sandbox'],['#diu-rules','DIU Rules'],['#about','About']].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => scrollToSection(e, href)}
                  className="hover:text-teal-500 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} DaffoTrack AI. Crafted with passion by <a href="https://metamorph-x.github.io/portfolio/" target="_blank" rel="noopener noreferrer" className="text-(--text-main) font-bold hover:text-teal-500 transition-colors">Metamorph X</a>.</p>
            <p className="text-(--text-muted) text-center sm:text-right">
              <a href="https://daffodilvarsity.edu.bd/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500 transition-colors">
                Officially affiliated with DIU.
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
