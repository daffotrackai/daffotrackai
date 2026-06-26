import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Award, BookOpen, Clock, Bell, Sliders, CheckCircle,
  AlertTriangle, Target, Sparkles, Bot, User, ChevronRight, Calculator, FileText, Zap, GraduationCap
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/session';
import PageTopBar from '../components/PageTopBar';

export default function Dashboard() {
  const currentUser = getCurrentUser();
  // MainLayout থেকে ড্রয়ারের স্টেট রিসিভ করা হচ্ছে
  const { drawerOpen, setDrawerOpen } = useOutletContext();
  
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState('');

  // Live Grade Predictor States
  const [midterm, setMidterm] = useState(20);
  const [quiz, setQuiz] = useState(12);
  const [assignment, setAssignment] = useState(8);
  const [attendance, setAttendance] = useState(10);
  const [finalExam, setFinalExam] = useState(30);
  const totalMarks = midterm + quiz + assignment + attendance + finalExam;

  useEffect(() => {
    let mounted = true;
    const summaryPath = currentUser?.userId
      ? `/api/dashboard/summary?userId=${currentUser.userId}`
      : '/api/dashboard/summary';

    apiRequest(summaryPath)
      .then(data => { if (mounted) setSummary(data); })
      .catch(err => { if (mounted) setSummaryError(err.message || 'Failed to load summary.'); })
      .finally(() => { if (mounted) setLoadingSummary(false); });
      
    return () => { mounted = false; };
  }, [currentUser?.userId]);

  const getDIUGrade = (marks) => {
    if (marks >= 80) return { grade: 'A+', points: 4.00, label: 'Outstanding', ring: 'ring-emerald-500/40', text: 'text-emerald-500', bg: 'bg-emerald-500/10', bar: 'from-emerald-400 to-teal-400' };
    if (marks >= 75) return { grade: 'A',  points: 3.75, label: 'Excellent',   ring: 'ring-emerald-400/30', text: 'text-emerald-400', bg: 'bg-emerald-400/10', bar: 'from-emerald-300 to-cyan-400' };
    if (marks >= 70) return { grade: 'A-', points: 3.50, label: 'Very Good',   ring: 'ring-cyan-500/30',   text: 'text-cyan-500',   bg: 'bg-cyan-500/10',   bar: 'from-cyan-400 to-indigo-400' };
    if (marks >= 65) return { grade: 'B+', points: 3.25, label: 'Good',        ring: 'ring-teal-500/30',   text: 'text-teal-500',   bg: 'bg-teal-500/10',   bar: 'from-teal-400 to-blue-400' };
    if (marks >= 60) return { grade: 'B',  points: 3.00, label: 'Satisfactory',ring: 'ring-indigo-500/30', text: 'text-indigo-500', bg: 'bg-indigo-500/10', bar: 'from-indigo-400 to-blue-500' };
    if (marks >= 55) return { grade: 'B-', points: 2.75, label: 'Average',     ring: 'ring-blue-500/30',   text: 'text-blue-500',   bg: 'bg-blue-500/10',   bar: 'from-blue-400 to-slate-400' };
    if (marks >= 50) return { grade: 'C+', points: 2.50, label: 'Below Avg',   ring: 'ring-yellow-500/30', text: 'text-yellow-500', bg: 'bg-yellow-500/10', bar: 'from-yellow-400 to-orange-400' };
    if (marks >= 45) return { grade: 'C',  points: 2.25, label: 'Poor',        ring: 'ring-amber-500/30',  text: 'text-amber-500',  bg: 'bg-amber-500/10',  bar: 'from-amber-500 to-orange-500' };
    if (marks >= 40) return { grade: 'D',  points: 2.00, label: 'Very Poor',   ring: 'ring-orange-500/30', text: 'text-orange-500', bg: 'bg-orange-500/10', bar: 'from-orange-500 to-red-500' };
    return               { grade: 'F',  points: 0.00, label: 'Fail',         ring: 'ring-red-500/30',    text: 'text-red-500',    bg: 'bg-red-500/10',    bar: 'from-red-600 to-rose-500' };
  };

  const gradeInfo = getDIUGrade(totalMarks);
  const cgpa = summary?.cgpa?.toFixed?.(2) ?? '0.00';
  const cgpaPercent = ((parseFloat(cgpa) / 4.0) * 100).toFixed(0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <>
      <PageTopBar
        title="Academic Dashboard"
        subtitle="CGPA, attendance and grade predictor"
        backLabel="Home"
        backTo="/"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      {/* Main Content Area - Standardized layout */}
      <main className="flex-1 overflow-y-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 bg-(--bg-main) text-(--text-main)">
        <div className="max-w-7xl mx-auto space-y-7">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-(--border-main)">
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
              <h1 className="text-2xl font-black text-(--text-main) flex items-center gap-2 tracking-tight">
                {getGreeting()}, {summary?.studentName || currentUser?.fullName || 'Student'}! <Sparkles className="w-5 h-5 text-teal-400" />
              </h1>
              <p className="text-xs text-(--text-muted) mt-1">{summary?.department || currentUser?.department || 'Daffodil International University'}</p>
            </div>
            <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-3 py-2 rounded-xl shadow-[0_0_15px_rgba(45,212,191,0.1)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400">{summary?.syncStatus || 'SYNC ACTIVE'}</span>
            </div>
          </div>

          {summaryError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-500 animate-bounce">
              {summaryError}
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: 'Overall CGPA', icon: Award,
                value: loadingSummary ? '—' : `${cgpa} / 4.00`,
                sub: summary?.waiverStatus || 'Waiver Data Loading...',
                subColor: 'text-teal-500',
                accent: 'border-teal-500/30',
                glow: 'shadow-teal-500/10',
                bar: { w: cgpaPercent, color: 'from-teal-500 via-cyan-500 to-indigo-500' }
              },
              {
                label: 'Completed Credits', icon: BookOpen,
                value: loadingSummary ? '—' : `${summary?.completedCredits ?? 0}`,
                sub: `Total required: ${summary?.totalCredits ?? 139} credits`,
                subColor: 'text-(--text-muted)',
                accent: 'border-indigo-500/20',
                glow: 'shadow-indigo-500/10',
                bar: { w: Math.round(((summary?.completedCredits ?? 0) / (summary?.totalCredits ?? 139)) * 100), color: 'from-indigo-500 to-purple-500' }
              },
              {
                label: 'Attendance Rate', icon: Clock,
                value: loadingSummary ? '—' : `${summary?.attendance?.toFixed(1) ?? 0}%`,
                sub: '>75% required for finals',
                subColor: 'text-emerald-500',
                accent: 'border-emerald-500/20',
                glow: 'shadow-emerald-500/10',
                bar: { w: summary?.attendance ?? 0, color: 'from-emerald-400 to-teal-500' }
              },
              {
                label: 'Pending Backlogs', icon: Bell,
                value: loadingSummary ? '—' : `${summary?.backlogs ?? 0}`,
                sub: summary?.backlogs > 0 ? 'Action required immediately' : 'All clear',
                subColor: summary?.backlogs > 0 ? 'text-rose-500' : 'text-emerald-500',
                accent: summary?.backlogs > 0 ? 'border-rose-500/30' : 'border-amber-500/20',
                glow: summary?.backlogs > 0 ? 'shadow-rose-500/10' : 'shadow-amber-500/10',
                bar: { w: summary?.backlogs > 0 ? 100 : 0, color: summary?.backlogs > 0 ? 'from-rose-500 to-red-600' : 'from-amber-400 to-orange-500' }
              },
            ].map(({ label, icon: Icon, value, sub, subColor, accent, glow, bar }, idx) => (
              <div key={label}
                className={`bg-(--bg-surface) border ${accent} rounded-2xl p-6 space-y-4 hover:shadow-xl ${glow} transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-(--text-muted) font-bold uppercase tracking-widest">{label}</span>
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-(--border-main) flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                   <p className="text-3xl font-black text-(--text-main) tracking-tighter leading-none">{value}</p>
                   <div className="mt-4 h-2 bg-white/5 dark:bg-white/5 light:bg-black/5 rounded-full overflow-hidden p-[1px]">
                     <div className={`h-full bg-gradient-to-r ${bar.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${bar.w}%` }} />
                   </div>
                </div>
                <p className={`text-[10px] font-bold tracking-wide ${subColor}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Predictor + Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

            {/* Sliders Area */}
            <div className="lg:col-span-7 bg-(--bg-surface) border border-(--border-main) rounded-2xl p-6 sm:p-8 space-y-7 shadow-sm animate-in fade-in slide-in-from-left-6 duration-1000">
              <div className="flex items-center justify-between pb-5 border-b border-(--border-main)">
                <div className="space-y-1">
                   <h3 className="text-sm font-black text-(--text-main) flex items-center gap-2 uppercase tracking-tight">
                     <Sliders className="w-4 h-4 text-teal-500" /> Live Grade Predictor
                   </h3>
                   <p className="text-[10px] text-(--text-muted) font-medium italic">Simulate your results based on DIU official rubric</p>
                </div>
                <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-lg shadow-sm">
                  V4.2 READY
                </span>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Midterm Exam', max: 25, val: midterm, set: setMidterm, icon: Target },
                  { label: 'Quizzes & CTs', max: 15, val: quiz, set: setQuiz, icon: Award },
                  { label: 'Assignments', max: 10, val: assignment, set: setAssignment, icon: FileText },
                  { label: 'Attendance', max: 10, val: attendance, set: setAttendance, icon: Clock },
                  { label: 'Final Exam', max: 40, val: finalExam, set: setFinalExam, icon: GraduationCap },
                ].map(({ label, max, val, set, icon: Icon }) => (
                  <div key={label} className="group">
                    <div className="flex justify-between items-center text-xs mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-white/5 border border-(--border-main) flex items-center justify-center text-(--text-muted) group-hover:text-teal-500 group-hover:border-teal-500/30 transition-all">
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="text-(--text-muted) font-bold uppercase tracking-widest text-[10px]">{label}</span>
                      </div>
                      <div className="bg-white/5 px-2 py-0.5 rounded-md border border-(--border-main)">
                        <span className="font-black text-teal-500">{val}</span>
                        <span className="text-(--text-muted) font-normal ml-1">/ {max}</span>
                      </div>
                    </div>
                    <div className="relative h-2.5 bg-white/5 dark:bg-white/5 light:bg-black/5 rounded-full overflow-visible border border-(--border-main)/50">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 rounded-full transition-all shadow-[0_0_10px_rgba(45,212,191,0.2)]"
                        style={{ width: `${(val / max) * 100}%` }}
                      />
                      <input
                        type="range" min={0} max={max} value={val}
                        onChange={e => set(Number(e.target.value))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-(--border-main) grid grid-cols-3 text-center gap-4">
                {[
                  ['TOTAL MARKS', `${totalMarks} / 100`, 'text-teal-500'],
                  ['GPA POINTS', `${gradeInfo.points.toFixed(2)}`, 'text-indigo-500'],
                  ['PERCENTAGE', `${totalMarks}%`, 'text-cyan-500'],
                ].map(([k, v, c]) => (
                  <div key={k} className="bg-(--bg-main) rounded-2xl py-4 border border-(--border-main) shadow-sm hover:border-teal-500/20 transition-colors">
                    <p className="text-[9px] font-bold text-(--text-muted) mb-1 tracking-widest">{k}</p>
                    <p className={`text-lg font-black ${c}`}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-5 flex flex-col gap-6 animate-in fade-in slide-in-from-right-6 duration-1000">
              
              {/* Grade card */}
              <div className={`bg-(--bg-surface) border border-(--border-main) rounded-3xl p-8 flex flex-col gap-6 flex-1 relative overflow-hidden shadow-xl shadow-black/5`}>
                <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-[80px] pointer-events-none ${gradeInfo.bg} opacity-50`} />

                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[10px] text-(--text-muted) font-black uppercase tracking-widest">Projected Standing</span>
                  <div className="p-2 rounded-xl bg-white/5 border border-(--border-main)">
                    <Target className="w-4 h-4 text-teal-500" />
                  </div>
                </div>

                <div className="flex items-center gap-7 relative z-10">
                  <div className={`w-28 h-28 rounded-3xl flex flex-col items-center justify-center ring-4 ${gradeInfo.ring} ${gradeInfo.bg} shadow-2xl transition-all duration-500 hover:scale-105`}>
                    <span className={`text-5xl font-black ${gradeInfo.text} tracking-tighter`}>{gradeInfo.grade}</span>
                    <span className={`text-[10px] font-black uppercase ${gradeInfo.text} opacity-70 mt-1 tracking-widest`}>{gradeInfo.label}</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest">Merit Points</p>
                    <p className={`text-4xl font-black ${gradeInfo.text} tracking-tight`}>{gradeInfo.points.toFixed(2)}</p>
                    <div className="pt-2">
                       <div className="flex justify-between text-[9px] font-bold text-(--text-muted) mb-1.5 uppercase">
                         <span>Mastery</span>
                         <span>{totalMarks}%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 dark:bg-white/5 light:bg-black/5 rounded-full overflow-hidden p-[1px]">
                         <div className={`h-full bg-gradient-to-r ${gradeInfo.bar} rounded-full transition-all duration-700 ease-out`} style={{ width: `${totalMarks}%` }} />
                       </div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl p-5 text-xs leading-relaxed border relative z-10 transition-colors duration-500 ${
                  gradeInfo.points >= 3.0
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  <div className="flex items-center gap-2 font-black uppercase tracking-widest mb-2 text-[10px]">
                    {gradeInfo.points >= 3.0
                      ? <><CheckCircle className="w-3.5 h-3.5" /> Waiver Status: Secure</>
                      : <><AlertTriangle className="w-3.5 h-3.5" /> Waiver Status: At Risk</>
                    }
                  </div>
                  <p className="font-medium opacity-90">
                    {gradeInfo.points >= 3.0
                      ? 'You are performing within the elite threshold for DIU tuition waivers. Keep this momentum for the final exam!'
                      : 'Current simulation falls below the 3.00 GPA waiver baseline. We recommend increasing your Final Exam target by 5-10%.'
                    }
                  </p>
                </div>

                <Link to="/chat" className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:-translate-y-0.5 active:translate-y-0 relative z-10">
                   Consult AI Advisor <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick actions - improved with labels */}
              <div className="bg-(--bg-card) border border-(--border-main) rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 px-2">
                   <h4 className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">Direct Access</h4>
                   <Zap className="w-3 h-3 text-amber-500 animate-pulse" />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { to: '/chat', label: 'AI Chat', icon: Bot, color: 'text-teal-500', bg: 'bg-teal-500/10' },
                    { to: '/courses', label: 'Courses', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { to: '/planner', label: 'Planner', icon: Calculator, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { to: '/policies', label: 'Rules', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { to: '/profile', label: 'Profile', icon: User, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                  ].map(({ to, label, icon: Icon, color, bg }) => (
                    <Link key={to} to={to}
                      className="flex flex-col items-center gap-2 group">
                      <div className={`h-11 w-11 flex items-center justify-center rounded-2xl ${bg} ${color} group-hover:scale-110 active:scale-95 transition-all shadow-sm border border-transparent group-hover:border-teal-500/20`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black text-(--text-muted) uppercase tracking-tighter group-hover:text-(--text-main) transition-colors text-center">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
