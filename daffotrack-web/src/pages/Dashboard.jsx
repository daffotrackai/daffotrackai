import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Award, BookOpen, Clock, Bell, Sliders, CheckCircle,
  AlertTriangle, Target, Sparkles, Bot, User, ChevronRight, Calculator, FileText
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
  }, []);

  const getDIUGrade = (marks) => {
    if (marks >= 80) return { grade: 'A+', points: 4.00, label: 'Outstanding', ring: 'ring-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-500/10', bar: 'from-emerald-400 to-teal-400' };
    if (marks >= 75) return { grade: 'A',  points: 3.75, label: 'Excellent',   ring: 'ring-emerald-400/30', text: 'text-emerald-300', bg: 'bg-emerald-400/10', bar: 'from-emerald-300 to-cyan-400' };
    if (marks >= 70) return { grade: 'A-', points: 3.50, label: 'Very Good',   ring: 'ring-cyan-500/30',   text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   bar: 'from-cyan-400 to-indigo-400' };
    if (marks >= 65) return { grade: 'B+', points: 3.25, label: 'Good',        ring: 'ring-teal-500/30',   text: 'text-teal-400',   bg: 'bg-teal-500/10',   bar: 'from-teal-400 to-blue-400' };
    if (marks >= 60) return { grade: 'B',  points: 3.00, label: 'Satisfactory',ring: 'ring-indigo-500/30', text: 'text-indigo-400', bg: 'bg-indigo-500/10', bar: 'from-indigo-400 to-blue-500' };
    if (marks >= 55) return { grade: 'B-', points: 2.75, label: 'Average',     ring: 'ring-blue-500/30',   text: 'text-blue-400',   bg: 'bg-blue-500/10',   bar: 'from-blue-400 to-slate-400' };
    if (marks >= 50) return { grade: 'C+', points: 2.50, label: 'Below Avg',   ring: 'ring-yellow-500/30', text: 'text-yellow-400', bg: 'bg-yellow-500/10', bar: 'from-yellow-400 to-orange-400' };
    if (marks >= 45) return { grade: 'C',  points: 2.25, label: 'Poor',        ring: 'ring-amber-500/30',  text: 'text-amber-500',  bg: 'bg-amber-500/10',  bar: 'from-amber-500 to-orange-500' };
    if (marks >= 40) return { grade: 'D',  points: 2.00, label: 'Very Poor',   ring: 'ring-orange-500/30', text: 'text-orange-500', bg: 'bg-orange-500/10', bar: 'from-orange-500 to-red-500' };
    return               { grade: 'F',  points: 0.00, label: 'Fail',         ring: 'ring-red-500/30',    text: 'text-red-500',    bg: 'bg-red-500/10',    bar: 'from-red-600 to-rose-500' };
  };

  const gradeInfo = getDIUGrade(totalMarks);
  const cgpa = summary?.cgpa?.toFixed?.(2) ?? '3.88';
  const cgpaPercent = ((parseFloat(cgpa) / 4.0) * 100).toFixed(0);

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
      <main className="flex-1 overflow-y-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-7">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/6">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                Welcome back! <Sparkles className="w-5 h-5 text-teal-400" />
              </h1>
              <p className="text-xs text-slate-500 mt-1">Software Engineering · Daffodil International University</p>
            </div>
            <div className="flex items-center gap-2 bg-teal-500/8 border border-teal-500/20 px-3 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-teal-400">DIU API SYNC ACTIVE</span>
            </div>
          </div>

          {summaryError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs text-red-400">
              {summaryError}
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Overall CGPA', icon: Award,
                value: loadingSummary ? '—' : `${cgpa} / 4.00`,
                sub: summary?.waiverStatus || '40% Waiver Active',
                subColor: 'text-teal-400',
                accent: 'border-teal-500/20',
                bar: { w: cgpaPercent, color: 'from-teal-500 to-cyan-400' }
              },
              {
                label: 'Completed Credits', icon: BookOpen,
                value: loadingSummary ? '—' : `${summary?.completedCredits ?? 78}`,
                sub: `Total required: ${summary?.totalCredits ?? 139} credits`,
                subColor: 'text-slate-500',
                accent: 'border-indigo-500/15',
                bar: { w: Math.round(((summary?.completedCredits ?? 78) / (summary?.totalCredits ?? 139)) * 100), color: 'from-indigo-400 to-purple-500' }
              },
              {
                label: 'Attendance Rate', icon: Clock,
                value: loadingSummary ? '—' : `${summary?.attendance ?? 86.2}%`,
                sub: '>75% required for finals',
                subColor: 'text-emerald-400',
                accent: 'border-emerald-500/15',
                bar: { w: summary?.attendance ?? 86.2, color: 'from-emerald-400 to-teal-400' }
              },
              {
                label: 'Pending Backlogs', icon: Bell,
                value: loadingSummary ? '—' : `${summary?.backlogs ?? 0}`,
                sub: 'All registered exams cleared',
                subColor: 'text-slate-500',
                accent: 'border-amber-500/15',
                bar: { w: 0, color: 'from-amber-400 to-orange-400' }
              },
            ].map(({ label, icon: Icon, value, sub, subColor, accent, bar }) => (
              <div key={label} className={`bg-[#0a1525] border ${accent} rounded-2xl p-5 space-y-3 hover:shadow-lg transition-all`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{label}</span>
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-2xl font-black text-white tracking-tight">{value}</p>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${bar.color} rounded-full transition-all duration-700`} style={{ width: `${bar.w}%` }} />
                </div>
                <p className={`text-[10px] font-medium ${subColor}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Predictor + Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Sliders Area */}
            <div className="lg:col-span-7 bg-[#0a1525] border border-white/6 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-400" /> Live Grade Predictor
                </h3>
                <span className="text-[10px] font-mono text-slate-600 bg-white/3 border border-white/6 px-2.5 py-1 rounded-lg">
                  DIU_SWE v4.0
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag sliders to simulate your marks. Grade letter and GPA points update instantly using DIU's official grading rubric.
              </p>

              <div className="space-y-5">
                {[
                  { label: 'Midterm Exam', max: 25, val: midterm, set: setMidterm },
                  { label: 'Quizzes & Class Tests', max: 15, val: quiz, set: setQuiz },
                  { label: 'Assignments & Presentations', max: 10, val: assignment, set: setAssignment },
                  { label: 'Attendance Record', max: 10, val: attendance, set: setAttendance },
                  { label: 'Final Semester Exam', max: 40, val: finalExam, set: setFinalExam },
                ].map(({ label, max, val, set }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-300 font-medium">{label}</span>
                      <span className="font-bold text-teal-400">{val} <span className="text-slate-600 font-normal">/ {max}</span></span>
                    </div>
                    <div className="relative h-2 bg-white/5 rounded-full overflow-visible">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${(val / max) * 100}%` }}
                      />
                      <input
                        type="range" min={0} max={max} value={val}
                        onChange={e => set(Number(e.target.value))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 grid grid-cols-3 text-center gap-3">
                {[
                  ['Total Marks', `${totalMarks} / 100`],
                  ['Grade Points', `${gradeInfo.points.toFixed(2)} / 4.00`],
                  ['Percentage', `${totalMarks}%`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-white/3 rounded-xl py-3 border border-white/5">
                    <p className="text-[10px] text-slate-500 mb-1">{k}</p>
                    <p className="text-sm font-black text-white">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              
              {/* Grade card */}
              <div className={`bg-[#0a1525] border border-white/6 rounded-2xl p-6 flex flex-col gap-5 flex-1 relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none ${gradeInfo.bg} opacity-40`} />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Projected Grade</span>
                  <Target className="w-4 h-4 text-slate-600" />
                </div>

                <div className="flex items-center gap-5">
                  <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center ring-2 ${gradeInfo.ring} ${gradeInfo.bg} shadow-xl`}>
                    <span className={`text-4xl font-black ${gradeInfo.text}`}>{gradeInfo.grade}</span>
                    <span className={`text-[10px] font-bold ${gradeInfo.text} opacity-80 mt-0.5`}>{gradeInfo.label}</span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-400">Grade Points</p>
                    <p className={`text-2xl font-black ${gradeInfo.text}`}>{gradeInfo.points.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">Score: <span className="text-white font-bold">{totalMarks}/100</span></p>
                    <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden mt-2">
                      <div className={`h-full bg-gradient-to-r ${gradeInfo.bar} rounded-full transition-all duration-500`} style={{ width: `${totalMarks}%` }} />
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl p-3.5 text-xs leading-relaxed border ${
                  gradeInfo.points >= 3.0
                    ? 'bg-emerald-500/6 border-emerald-500/15 text-emerald-300'
                    : 'bg-amber-500/6 border-amber-500/15 text-amber-300'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {gradeInfo.points >= 3.0
                      ? <><CheckCircle className="w-3.5 h-3.5" /> Waiver Safe</>
                      : <><AlertTriangle className="w-3.5 h-3.5" /> Waiver at Risk</>
                    }
                  </div>
                  {gradeInfo.points >= 3.0
                    ? 'This grade meets the minimum 3.00 GPA requirement for semester waivers. Excellent academic standing!'
                    : 'Scoring below B (3.00 GP) may jeopardize your waiver eligibility. Try boosting final exam marks to compensate.'
                  }
                </div>

                <Link to="/chat" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/7 text-xs font-semibold text-slate-300 transition-all">
                  Consult AI Advisor Bot <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                </Link>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { to: '/chat', icon: Bot, label: 'AI Chat', sub: 'Ask policy questions', color: 'teal' },
                  { to: '/courses', icon: BookOpen, label: 'Courses', sub: 'Track course marks', color: 'cyan' },
                  { to: '/planner', icon: Calculator, label: 'Planner', sub: 'Target CGPA path', color: 'emerald' },
                  { to: '/policies', icon: FileText, label: 'Policies', sub: 'DIU rule center', color: 'amber' },
                  { to: '/profile', icon: User, label: 'Profile', sub: 'View student info', color: 'indigo' },
                ].map(({ to, icon: Icon, label, sub, color }) => (
                  <Link key={to} to={to}
                    className={`bg-[#0a1525] border border-${color}-500/15 rounded-2xl p-4 hover:border-${color}-500/35 hover:bg-${color}-500/5 transition-all group`}>
                    <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-4 h-4 text-${color}-400`} />
                    </div>
                    <p className="text-xs font-bold text-white">{label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
                  </Link>
                ))}
              </div>

              {/* Alert */}
              <div className="flex items-start gap-3 bg-amber-500/6 border border-amber-500/20 rounded-xl p-4">
                <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-amber-300">Waiver Renewal in 3 Days</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Fall 2026 tuition waiver applications open soon. Clear all "I" (Incomplete) grades before submission.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
