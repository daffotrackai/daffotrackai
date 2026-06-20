import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Bot,
    Bell,
    TrendingUp,
    Sparkles,
    Clock,
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    Menu,
    X,
    Terminal,
    Cpu,
    GraduationCap,
    ShieldCheck,
    HelpCircle,
    Play,
    Award,
    BookMarked,
    MessageSquareCode
} from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('advisor');
    const [simulatedChat, setSimulatedChat] = useState([
        { sender: 'user', text: 'How do I maintain my semester waiver at DIU?' },
        { sender: 'ai', text: 'To maintain your waiver, DIU policy requires you to complete a minimum of 12 credits in the previous semester with a GPA of 3.00 or higher (no "F" or "I" grades). The waiver rate is based on your CGPA: 3.80-3.89 gives 40%, 3.90-3.99 gives 60%, and a perfect 4.00 grants a 100% tuition fee waiver!' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Chat sandbox presets
    const chatPresets = {
        advisor: {
            question: "Which courses should I choose for 6th semester SWE?",
            messages: [
                { sender: 'user', text: "Which courses should I choose for 6th semester Software Engineering?" },
                { sender: 'ai', text: "For SWE 6th semester, the recommended track focus is on Software Architecture, Web Engineering, and Enterprise Systems. To maintain a balanced workload: pair 2 high-intensity coding labs with 1 theoretical course and 1 general elective. Make sure you complete SWE 311 (Software Engineering) as it's a prerequisite for your Capstone Project next semester!" }
            ]
        },
        cgpa: {
            question: "What's the effect of a Retake vs. Improvement?",
            messages: [
                { sender: 'user', text: "What is the difference between Retake and Grade Improvement at DIU?" },
                { sender: 'ai', text: "Under DIU rules: \n\n1. Retake: Applicable if you got an 'F' grade. You must register again, pay standard credit fees, and your new grade completely replaces the 'F' in CGPA calculation.\n2. Grade Improvement: If you got B- or below, you can retake to improve. The higher grade is counted towards CGPA, but the history of the previous attempt remains on the transcript." }
            ]
        },
        policy: {
            question: "I missed my Midterm. What is the Makeup exam procedure?",
            messages: [
                { sender: 'user', text: "I missed my Midterm exam due to sickness. What is the procedure now?" },
                { sender: 'ai', text: "Don't panic! For Midterm absences: \n\n1. Collect a medical certificate or formal proof. \n2. Apply to your Head of Department (HoD) within 3 working days of the missed exam. \n3. Upon approval, register for the 'Makeup Midterm Exam' at the office. \nNote: DIU usually charges a makeup fee of BDT 1,000 per course unless waived under special medical emergencies approved by the Dean." }
            ]
        }
    };

    const handlePresetClick = (key) => {
        setActiveTab(key);
        setIsTyping(true);
        setSimulatedChat([{ sender: 'user', text: chatPresets[key].question }]);

        setTimeout(() => {
            setSimulatedChat([
                { sender: 'user', text: chatPresets[key].question },
                { sender: 'ai', text: chatPresets[key].messages[1].text }
            ]);
            setIsTyping(false);
        }, 1200);
    };

    // Scroll tracking to change navbar design
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0B1A30] text-white selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">

            {/* GLOWING AMBIENT LIGHTS (Tailwind v4) */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#00E5FF]/10 to-transparent rounded-full filter blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full filter blur-3xl pointer-events-none -z-10" />

            {/* HEADER / NAVIGATION */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-[#0B1A30]/90 backdrop-blur-md border-b border-[#1E3A5F]/40 py-3 shadow-lg'
                    : 'bg-transparent py-5'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-blue-600 p-[2px] shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                                <div className="w-full h-full bg-[#0B1A30] rounded-[10px] flex items-center justify-center">
                                    <Cpu className="w-5 h-5 text-[#00E5FF]" />
                                </div>
                            </div>
                            <div>
                                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00E5FF] bg-clip-text text-transparent">
                                    DaffoTrack <span className="font-extrabold text-[#00E5FF]">AI</span>
                                </span>
                                <span className="block text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
                                    by Metamorph X
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-[#00E5FF] transition-colors">Features</a>
                            <a href="#sandbox" className="text-sm font-medium text-slate-300 hover:text-[#00E5FF] transition-colors">Interactive Demo</a>
                            <a href="#diu-rules" className="text-sm font-medium text-slate-300 hover:text-[#00E5FF] transition-colors">DIU Guides</a>
                            <a href="#about" className="text-sm font-medium text-slate-300 hover:text-[#00E5FF] transition-colors">About</a>
                        </nav>

                        {/* Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link to="/login" className="relative group overflow-hidden rounded-full bg-[#00E5FF] px-6 py-2 text-sm font-semibold text-[#0B1A30] transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] hover:scale-105">
                                <span className="relative z-10 flex items-center gap-1.5">
                                    Launch App <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </div>

                        {/* Mobile Menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg text-slate-300 hover:text-white focus:outline-none"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu panel */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-[#0B1A30]/95 backdrop-blur-xl border-b border-[#1E3A5F]/80 px-4 pt-4 pb-6 space-y-4">
                        <a
                            href="#features"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-base font-medium text-slate-300 hover:text-[#00E5FF] py-2"
                        >
                            Features
                        </a>
                        <a
                            href="#sandbox"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-base font-medium text-slate-300 hover:text-[#00E5FF] py-2"
                        >
                            Interactive Demo
                        </a>
                        <a
                            href="#diu-rules"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-base font-medium text-slate-300 hover:text-[#00E5FF] py-2"
                        >
                            DIU Guides
                        </a>
                        <a
                            href="#about"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-base font-medium text-slate-300 hover:text-[#00E5FF] py-2"
                        >
                            About
                        </a>
                        <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-center py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white bg-slate-800/40"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-center py-2.5 rounded-lg text-base font-medium text-[#0B1A30] bg-[#00E5FF] font-semibold"
                            >
                                Launch App
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col justify-center overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                        {/* Left Column: Copy & Actions */}
                        <div className="lg:col-span-7 flex flex-col text-left space-y-6 md:space-y-8">
                            {/* Promo tag */}
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-900/40 to-[#00E5FF]/10 border border-[#00E5FF]/20 px-3.5 py-1.5 rounded-full w-fit">
                                <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                                <span className="text-xs font-semibold text-[#00E5FF] uppercase tracking-wider">
                                    The Premier Smart Portal for Daffodil International University
                                </span>
                            </div>

                            {/* Bold Title */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                                Your Smart <br className="hidden sm:inline" />
                                <span className="bg-gradient-to-r from-[#00E5FF] via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                                    Academic Companion
                                </span> <br />
                                at DIU.
                            </h1>

                            {/* Brief Subtitle */}
                            <p className="text-slate-300 text-lg md:text-xl max-w-xl font-light leading-relaxed">
                                Unlock high-fidelity AI-driven insights customized for Daffodil International University. Effortlessly track your CGPA, forecast attendance hurdles, and solve complex university academic policy hurdles in seconds.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-cyan-500 text-[#0B1A30] font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.7)] hover:scale-105 transition-all duration-300"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5 ml-2.5" />
                                </Link>

                                <a
                                    href="#features"
                                    className="flex items-center justify-center px-8 py-4 rounded-xl bg-[#142847]/80 hover:bg-[#1C365C] border border-[#1E3A5F] text-white font-semibold transition-all duration-300"
                                >
                                    Learn More
                                </a>
                            </div>

                            {/* Trust markers / Stats Badges */}
                            <div className="pt-4 border-t border-[#1E3A5F]/50 grid grid-cols-3 gap-4">
                                <div>
                                    <h4 className="text-2xl font-bold text-white tracking-tight">98.4%</h4>
                                    <p className="text-xs text-slate-400 mt-1">Advisor Accuracy</p>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-white tracking-tight">Instant</h4>
                                    <p className="text-xs text-slate-400 mt-1">DIU Policy Lookup</p>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-white tracking-tight">No Fees</h4>
                                    <p className="text-xs text-slate-400 mt-1">Open Source Platform</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Premium High-Tech Dashboard Mockup */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative mx-auto max-w-[420px] lg:max-w-none group">
                                {/* Background glowing rings */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 to-indigo-500/20 rounded-2xl filter blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Dashboard Frame */}
                                <div className="relative bg-[#13253F] border border-[#1E3A5F] rounded-2xl shadow-2xl overflow-hidden">

                                    {/* Top Bar (Browser style) */}
                                    <div className="bg-[#0B1A30]/80 border-b border-[#1E3A5F] px-4 py-3.5 flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                        </div>
                                        <div className="bg-[#142847] px-3 py-1 rounded-md text-[10px] text-[#00E5FF] font-mono tracking-wider flex items-center space-x-1.5 border border-[#00E5FF]/10">
                                            <Terminal className="w-3 h-3" />
                                            <span>DAFFOTRACK-CONSOLE_V4.0</span>
                                        </div>
                                        <span className="w-4" />
                                    </div>

                                    {/* Body Content */}
                                    <div className="p-5 space-y-5">
                                        {/* CGPA Card Module */}
                                        <div className="bg-[#0B1A30]/50 rounded-xl p-4 border border-blue-900/30">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xs font-semibold uppercase text-slate-400">Current CGPA Projection</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center">
                                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 animate-pulse" />
                                                    Safe
                                                </span>
                                            </div>
                                            <div className="flex items-baseline space-x-2">
                                                <h3 className="text-3xl font-extrabold text-white">3.92</h3>
                                                <span className="text-sm text-[#00E5FF] font-semibold flex items-center">
                                                    <TrendingUp className="w-4 h-4 mr-0.5" />
                                                    +0.12 this term
                                                </span>
                                            </div>
                                            <div className="w-full bg-[#142847] h-2 rounded-full mt-3 overflow-hidden">
                                                <div className="bg-gradient-to-r from-[#00E5FF] to-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
                                            </div>
                                            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                                                <span>Min Waiver (3.80)</span>
                                                <span>Current Target</span>
                                                <span>Perfect (4.00)</span>
                                            </div>
                                        </div>

                                        {/* AI Advisor Response Bubble Mockup */}
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0 mt-0.5">
                                                    <Bot className="w-4 h-4" />
                                                </div>
                                                <div className="bg-[#142847]/90 rounded-r-xl rounded-bl-xl p-3 border border-[#1E3A5F] text-xs leading-relaxed text-slate-200">
                                                    <span className="font-bold text-[#00E5FF] block mb-1">DaffoTrack AI</span>
                                                    "You need 14 additional attendance counts in SWE-312 to meet the 75% final eligibility threshold. Try not to miss classes next Monday!"
                                                </div>
                                            </div>

                                            {/* Notification alerts */}
                                            <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 text-[11px] text-amber-300">
                                                <Clock className="w-3.5 h-3.5 mr-1 text-amber-400 animate-pulse shrink-0" />
                                                <span>Makeup registration deadline is tomorrow at 4:00 PM!</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Info inside Frame */}
                                    <div className="bg-[#0B1A30]/40 py-2.5 px-4 text-center border-t border-[#1E3A5F]">
                                        <span className="text-[10px] text-slate-400">
                                            Synchronized with DIU Smart Portal API • 100% Secure
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CORE FEATURES SECTION */}
            <section id="features" className="py-24 bg-white text-slate-900 relative">
                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#0B1A30] to-white pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                            <span className="text-xs font-semibold text-[#0B1A30] tracking-wide uppercase">
                                What DaffoTrack AI Does
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1A30] tracking-tight">
                            Designed Exclusively for DIU Academic Excellence
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Empower your college journey with purpose-built AI tools configured specifically around Daffodil's semester framework, policies, and regulations.
                        </p>
                    </div>

                    {/* Grid Layout of Features (Tailwind v4) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {/* Feature Card 1: CGPA Track */}
                        <div className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#00E5FF] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-[#0B1A30] flex items-center justify-center text-[#00E5FF] mb-5 shadow-lg group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0B1A30] mb-3">
                                    CGPA Tracking & Prediction
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Log midterm results, quizzes, and continuous grades. DaffoTrack instantly predicts your final CGPA and shows optimal target grades.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#0B1A30] group-hover:text-cyan-600 cursor-pointer">
                                Learn how it calculates <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>

                        {/* Feature Card 2: AI Advisor */}
                        <div className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#00E5FF] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-[#0B1A30] flex items-center justify-center text-[#00E5FF] mb-5 shadow-lg group-hover:scale-110 transition-transform">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0B1A30] mb-3">
                                    24/7 AI Advisor Bot
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    A personalized smart tutor trained directly on DIU syllabus catalogs, credit rules, prerequisites, and registration prerequisites.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#0B1A30] group-hover:text-cyan-600 cursor-pointer">
                                Try AI Sandbox below <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>

                        {/* Feature Card 3: Missing Exam / Waiver Policies */}
                        <div className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#00E5FF] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-[#0B1A30] flex items-center justify-center text-[#00E5FF] mb-5 shadow-lg group-hover:scale-110 transition-transform">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0B1A30] mb-3">
                                    DIU Smart Policy Guide
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Instant guidance on complex policies like Grade Improvement, Retakes, Makeup Midterms, Semester Drop, and tuition fee waivers.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#0B1A30] group-hover:text-cyan-600 cursor-pointer">
                                View policy guidelines <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>

                        {/* Feature Card 4: Attendance forecaster */}
                        <div className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#00E5FF] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-[#0B1A30] flex items-center justify-center text-[#00E5FF] mb-5 shadow-lg group-hover:scale-110 transition-transform">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0B1A30] mb-3">
                                    75% Attendance Predictor
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Track how many lecture absents are left before losing exam eligibility. Stay alerted prior to falling below critical academic levels.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#0B1A30] group-hover:text-cyan-600 cursor-pointer">
                                Check calculator <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>

                    </div>

                    {/* Quick statement on privacy */}
                    <div className="mt-16 bg-[#0B1A30] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 max-w-xl">
                            <h4 className="text-lg font-bold flex items-center">
                                <ShieldCheck className="w-5 h-5 text-[#00E5FF] mr-2" />
                                Your Privacy and Academic Integrity Matter
                            </h4>
                            <p className="text-sm text-slate-300">
                                DaffoTrack AI does not require your actual student portal credentials. All calculation engines run locally, secure and isolated inside your browser.
                            </p>
                        </div>
                        <Link to="/login" className="whitespace-nowrap px-6 py-3 rounded-lg bg-[#00E5FF] text-[#0B1A30] font-bold hover:scale-105 transition-all text-sm">
                            Connect Securely
                        </Link>
                    </div>

                </div>
            </section>

            {/* INTERACTIVE SANDBOX SECTION */}
            <section id="sandbox" className="py-24 bg-[#13253F]/40 border-t border-b border-[#1E3A5F]/40 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Left side: Pitch */}
                        <div className="lg:col-span-5 space-y-6 text-left">
                            <div className="inline-flex items-center space-x-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-3 py-1 rounded-full">
                                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                                <span className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-wider">Interactive Playground</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                Try the Live AI Assistant Sandbox
                            </h2>
                            <p className="text-slate-300 text-base leading-relaxed">
                                Click any of the frequent question presets below. Watch our specialized AI interpret and process DIU academic regulatory codes in real time, delivering clear, actionable, simplified layouts.
                            </p>

                            {/* Presets List */}
                            <div className="space-y-3 pt-4">
                                <button
                                    onClick={() => handlePresetClick('advisor')}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${activeTab === 'advisor'
                                            ? 'bg-gradient-to-r from-[#1A3152] to-[#13253F] border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                                            : 'bg-transparent border-[#1E3A5F]/40 hover:bg-[#1A3152]/30'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${activeTab === 'advisor' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-slate-800 text-slate-400'}`}>
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-400">Academic Advisor</span>
                                            <span className="text-sm font-semibold text-white">6th Sem Course Recommendation</span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 ${activeTab === 'advisor' ? 'text-[#00E5FF]' : 'text-slate-500'}`} />
                                </button>

                                <button
                                    onClick={() => handlePresetClick('cgpa')}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${activeTab === 'cgpa'
                                            ? 'bg-gradient-to-r from-[#1A3152] to-[#13253F] border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                                            : 'bg-transparent border-[#1E3A5F]/40 hover:bg-[#1A3152]/30'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${activeTab === 'cgpa' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-slate-800 text-slate-400'}`}>
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-400">GPA and Grades</span>
                                            <span className="text-sm font-semibold text-white">Retake vs. Grade Improvement</span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 ${activeTab === 'cgpa' ? 'text-[#00E5FF]' : 'text-slate-500'}`} />
                                </button>

                                <button
                                    onClick={() => handlePresetClick('policy')}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${activeTab === 'policy'
                                            ? 'bg-gradient-to-r from-[#1A3152] to-[#13253F] border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                                            : 'bg-transparent border-[#1E3A5F]/40 hover:bg-[#1A3152]/30'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${activeTab === 'policy' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-slate-800 text-slate-400'}`}>
                                            <Bell className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-400">Exam Protocols</span>
                                            <span className="text-sm font-semibold text-white">Procedure for Makeup Midterms</span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 ${activeTab === 'policy' ? 'text-[#00E5FF]' : 'text-slate-500'}`} />
                                </button>
                            </div>

                        </div>

                        {/* Right side: Mock Console/Chat */}
                        <div className="lg:col-span-7">
                            <div className="bg-[#0B1A30] rounded-2xl border border-[#1E3A5F] overflow-hidden shadow-2xl flex flex-col h-[480px]">

                                {/* Header of Chat */}
                                <div className="bg-[#13253F] px-5 py-4 border-b border-[#1E3A5F] flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-9 h-9 rounded-full bg-[#00E5FF]/20 flex items-center justify-center border border-[#00E5FF]/40 text-[#00E5FF]">
                                                <Bot className="w-5 h-5" />
                                            </div>
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#0B1A30]" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">DaffoTrack AI Engine</h4>
                                            <p className="text-[10px] text-[#00E5FF] font-mono">MODEL-DIU-SWE_V4.2 • ONLINE</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                                        <span className="text-xs text-[#00E5FF] font-mono">Sandbox Environment</span>
                                    </div>
                                </div>

                                {/* Messages Panel */}
                                <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-sm">
                                    {simulatedChat.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 border whitespace-pre-line ${msg.sender === 'user'
                                                    ? 'bg-[#1E3A5F] text-white border-blue-900'
                                                    : 'bg-[#13253F] text-slate-100 border-[#1E3A5F]'
                                                }`}>
                                                <span className={`block text-[10px] font-bold mb-1 uppercase ${msg.sender === 'user' ? 'text-cyan-300' : 'text-[#00E5FF]'
                                                    }`}>
                                                    {msg.sender === 'user' ? 'You' : 'DaffoTrack AI'}
                                                </span>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-[#13253F] text-slate-400 border border-[#1E3A5F] rounded-2xl px-4 py-3 flex items-center space-x-1.5">
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Simulated Input Area */}
                                <div className="p-4 bg-[#13253F]/60 border-t border-[#1E3A5F] flex items-center justify-between">
                                    <span className="text-xs text-slate-400 italic">
                                        Select a preset question on the left to simulate...
                                    </span>
                                    <Link to="/chat" className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-[#00E5FF] text-[#0B1A30] font-bold text-xs hover:scale-105 transition-all">
                                        <span>Full Live Chat</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* DIU POLICY HIGHLIGHTS SECTION */}
            <section id="diu-rules" className="py-24 bg-[#0B1A30] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Master DIU's Complex Policies
                        </h2>
                        <p className="text-slate-400 text-base">
                            Say goodbye to administrative confusion. Check out these popular rules pre-parsed by Metamorph X's custom-built algorithms.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Rule card 1 */}
                        <div className="bg-[#13253F]/60 border border-[#1E3A5F]/80 p-6 rounded-2xl space-y-4 hover:border-[#00E5FF]/40 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                <Award className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Tuition Waiver Eligibility</h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Unlock up to 100% discount. Requires registration of 12+ credits, SGPA &ge; 3.00, and zero failed or incomplete courses in the previous consecutive term.
                            </p>
                            <div className="text-[11px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 py-1 px-2.5 rounded w-fit">
                                REG_CLAUSE_7.2
                            </div>
                        </div>

                        {/* Rule card 2 */}
                        <div className="bg-[#13253F]/60 border border-[#1E3A5F]/80 p-6 rounded-2xl space-y-4 hover:border-[#00E5FF]/40 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                <BookMarked className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Grade Improvement Limit</h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Allowed for any course with grade B- or below. Retaking is permitted once per course, and only the highest grade is updated in the final CGPA calculator.
                            </p>
                            <div className="text-[11px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 py-1 px-2.5 rounded w-fit">
                                ACAD_REG_4.12
                            </div>
                        </div>

                        {/* Rule card 3 */}
                        <div className="bg-[#13253F]/60 border border-[#1E3A5F]/80 p-6 rounded-2xl space-y-4 hover:border-[#00E5FF]/40 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Midterm Makeup Criteria</h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Application must be filed within 3 days of missed examination with an authorized medical or emergency proof. Non-refundable BDT 1,000 makeup fees apply.
                            </p>
                            <div className="text-[11px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 py-1 px-2.5 rounded w-fit">
                                EXAM_POL_11.5
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* METAMORPH X BRAND SHOWCASE SECTION */}
            <section id="about" className="py-24 bg-gradient-to-b from-[#13253F]/40 to-[#0B1A30] border-t border-[#1E3A5F]/40 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

                    <div className="max-w-3xl mx-auto space-y-4">
                        <span className="text-xs font-bold text-[#00E5FF] tracking-wider uppercase bg-[#00E5FF]/10 px-4 py-1.5 rounded-full">
                            Crafted with Precision by Metamorph X
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Bridging AI Innovation and Academic Success
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed font-light">
                            Metamorph X is a forward-thinking group of elite student engineers and researchers at Daffodil International University. We specialize in building next-generation AI interfaces that simplify complex university frameworks, empowering students to study smart, and track their performance effortlessly.
                        </p>
                    </div>

                    <div className="inline-flex flex-wrap items-center justify-center gap-6 pt-6">
                        <div className="flex items-center space-x-2 bg-[#13253F] px-4 py-2.5 rounded-xl border border-[#1E3A5F]">
                            <MessageSquareCode className="w-5 h-5 text-[#00E5FF]" />
                            <span className="text-sm font-semibold">100% LLM Engineered</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-[#13253F] px-4 py-2.5 rounded-xl border border-[#1E3A5F]">
                            <GraduationCap className="w-5 h-5 text-indigo-400" />
                            <span className="text-sm font-semibold">For DIU Students</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-[#13253F] px-4 py-2.5 rounded-xl border border-[#1E3A5F]">
                            <Cpu className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-semibold">Self-Refined AI Hub</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* FINAL CALL TO ACTION */}
            <section className="py-20 relative overflow-hidden bg-gradient-to-r from-blue-900/20 via-[#0B1A30] to-blue-900/20 border-t border-[#1E3A5F]/50">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Ready to Accelerate Your <br />
                        <span className="bg-gradient-to-r from-[#00E5FF] via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Academic Journey?</span>
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light">
                        Sign up now to configure your personal DIU academic planner, calculate projections, forecast class attendance thresholds, and leverage our chatbot tutor.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-cyan-500 text-[#0B1A30] font-extrabold text-base shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] hover:scale-105 transition-all duration-300"
                        >
                            Get Started for Free
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#142847] border border-[#1E3A5F] hover:bg-[#1C365C] font-semibold text-white transition-all text-base"
                        >
                            Sign In to DaffoTrack
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#071120] border-t border-[#1E3A5F]/30 py-12 text-slate-400 text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#1E3A5F]/20">
                        {/* Logo in Footer */}
                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-blue-500 flex items-center justify-center">
                                <Cpu className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-white tracking-wide">DaffoTrack AI</span>
                                <span className="block text-[9px] text-slate-500 font-bold uppercase">by Metamorph X</span>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-semibold">
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <a href="#sandbox" className="hover:text-white transition-colors">AI Sandbox</a>
                            <a href="#diu-rules" className="hover:text-white transition-colors">DIU Academic Rules</a>
                            <a href="#about" className="hover:text-white transition-colors">Team Metamorph X</a>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
                        <p className="text-center sm:text-left">
                            &copy; {new Date().getFullYear()} DaffoTrack AI. All Rights Reserved. Crafted with passion by <span className="text-white font-semibold">Metamorph X</span>.
                        </p>
                        <p className="text-center sm:text-right text-slate-500 leading-relaxed">
                            DaffoTrack AI is an independent project and is not officially affiliated with Daffodil International University (DIU).
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}
