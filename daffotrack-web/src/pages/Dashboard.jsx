import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Cpu, 
  User, 
  TrendingUp, 
  BookOpen, 
  Bell, 
  LogOut, 
  Award, 
  HelpCircle, 
  ChevronRight, 
  Sliders, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  Sparkles,
  Bot
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/session';
import NavigationDrawer from '../components/NavigationDrawer';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState('');
  const [profileSummary, setProfileSummary] = useState(null);
  
  // Interactive GPA Predictor state
  const [midterm, setMidterm] = useState(20); // out of 25
  const [quiz, setQuiz] = useState(12); // out of 15
  const [assignment, setAssignment] = useState(8); // out of 10
  const [attendance, setAttendance] = useState(10); // out of 10
  const [finalExam, setFinalExam] = useState(30); // out of 40

  const totalMarks = midterm + quiz + assignment + attendance + finalExam;

  useEffect(() => {
    let isMounted = true;

    apiRequest('/api/dashboard/summary')
      .then((data) => {
        if (isMounted) {
          setSummary(data);
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setSummaryError(requestError.message || 'Failed to load dashboard summary.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingSummary(false);
        }
      });

    if (currentUser?.userId) {
      apiRequest(`/api/users/${currentUser.userId}`)
        .then((data) => {
          if (isMounted) {
            setProfileSummary(data);
          }
        })
        .catch(() => {
          // fallback to dashboard summary data
        });
    }

    return () => {
      isMounted = false;
    };
  }, [currentUser?.userId]);

  // DIU grading system
  const getDIUGrade = (marks) => {
    if (marks >= 80) return { grade: 'A+', points: 4.00, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (marks >= 75) return { grade: 'A', points: 3.75, color: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30' };
    if (marks >= 70) return { grade: 'A-', points: 3.50, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    if (marks >= 65) return { grade: 'B+', points: 3.25, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' };
    if (marks >= 60) return { grade: 'B', points: 3.00, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    if (marks >= 55) return { grade: 'B-', points: 2.75, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (marks >= 50) return { grade: 'C+', points: 2.50, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
    if (marks >= 45) return { grade: 'C', points: 2.25, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
    if (marks >= 40) return { grade: 'D', points: 2.00, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' };
    return { grade: 'F', points: 0.00, color: 'text-red-500 bg-red-500/10 border-red-500/30' };
  };

  const { grade, points, color } = getDIUGrade(totalMarks);

  return (
    <div className="min-h-screen bg-[#0B1A30] text-white flex flex-col md:flex-row font-sans">
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#13253F] border-r border-[#1E3A5F] flex flex-col shrink-0">
        {/* Branding */}
        <div className="p-6 border-b border-[#1E3A5F] flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-blue-500 flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.3)]">
            <Cpu className="w-4.5 h-4.5 text-[#0B1A30] font-bold" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wide text-base">DaffoTrack AI</span>
            <span className="block text-[8px] text-[#00E5FF] font-semibold uppercase tracking-wider">by Metamorph X</span>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-5 border-b border-[#1E3A5F]/60 bg-[#0B1A30]/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">{profileSummary?.fullName || summary?.studentName || 'Guest DIU Student'}</h4>
              <p className="text-[10px] text-slate-400">ID: {profileSummary?.studentId || summary?.studentId || '221-15-XXXX'} ({profileSummary?.department || summary?.department || 'SWE'})</p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#0B1A30]/75 border border-[#1E3A5F] text-[#00E5FF] text-xs font-bold transition-all">
            <TrendingUp className="w-4 h-4" />
            <span>Academic Dashboard</span>
          </button>
          
          <Link to="/chat" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/30 text-xs font-medium transition-all">
            <Bot className="w-4 h-4 text-[#00E5FF]" />
            <span>AI Advisor Chat</span>
          </Link>

          <Link to="/profile" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/30 text-xs font-medium transition-all">
            <User className="w-4 h-4 text-[#00E5FF]" />
            <span>My Profile</span>
          </Link>

          <a href="/#diu-rules" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/30 text-xs font-medium transition-all">
            <BookOpen className="w-4 h-4 text-[#00E5FF]" />
            <span>DIU Academic Policies</span>
          </a>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#1E3A5F]">
          <Link to="/" className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 space-y-8">
        
        {/* TOP STATUS ROW */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1E3A5F]/40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center">
              Welcome back! <Sparkles className="w-5 h-5 text-[#00E5FF] ml-2 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400">Department of Software Engineering • Daffodil International University</p>
          </div>
          
          <div className="flex items-center space-x-3 bg-[#13253F] p-2.5 rounded-xl border border-[#1E3A5F]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">{summary?.syncStatus || 'DIU API SYNC ACTIVE'}</span>
          </div>
        </div>

        {summaryError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {summaryError}
          </div>
        )}

        {/* OVERVIEW STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#13253F] border border-[#1E3A5F] p-5 rounded-xl space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Overall CGPA</span>
              <Award className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="text-2xl font-extrabold">{loadingSummary ? 'Loading...' : `${summary?.cgpa?.toFixed?.(2) ?? '3.88'} / 4.00`}</div>
            <p className="text-[10px] text-[#00E5FF]">Eligibility: {summary?.waiverStatus || '40% Waiver'}</p>
          </div>

          <div className="bg-[#13253F] border border-[#1E3A5F] p-5 rounded-xl space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Completed Credits</span>
              <BookOpen className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="text-2xl font-extrabold">{loadingSummary ? 'Loading...' : `${summary?.completedCredits ?? 78.0} Credits`}</div>
            <p className="text-[10px] text-slate-400">Total Req: {summary?.totalCredits ?? 139.0} Credits</p>
          </div>

          <div className="bg-[#13253F] border border-[#1E3A5F] p-5 rounded-xl space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Class Attendance</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">{loadingSummary ? 'Loading...' : `${summary?.attendance ?? 86.2}%`}</div>
            <p className="text-[10px] text-emerald-400">Safe (&gt; 75% required)</p>
          </div>

          <div className="bg-[#13253F] border border-[#1E3A5F] p-5 rounded-xl space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Missing Exams / Backlogs</span>
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400">{loadingSummary ? 'Loading...' : `${summary?.backlogs ?? 0} Backlogs`}</div>
            <p className="text-[10px] text-slate-400">All registered exams passed</p>
          </div>

        </div>

        {/* DYNAMIC TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Interactive Sliders GPA Predictor (7 Cols) */}
          <div className="lg:col-span-7 bg-[#13253F] border border-[#1E3A5F] rounded-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#1E3A5F]/60 pb-4">
              <h3 className="text-base font-bold text-white flex items-center">
                <Sliders className="w-5 h-5 text-[#00E5FF] mr-2" />
                Live Course Grade Predictor
              </h3>
              <span className="text-[10px] bg-[#0B1A30] border border-[#1E3A5F] px-2 py-1 rounded text-slate-400 font-mono">
                DIU_CALC_SWE_4.0
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Use these interactive sliders to calculate final grade points for any individual course. Adjust midterms, quizzes, and see the grade letter shift immediately.
            </p>

            <div className="space-y-4 pt-2">
              {/* Midterm */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Midterm Exam Score (Max 25)</span>
                  <span className="text-[#00E5FF] font-bold">{midterm} / 25</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="25" 
                  value={midterm} 
                  onChange={(e) => setMidterm(Number(e.target.value))} 
                  className="w-full accent-[#00E5FF] bg-[#0B1A30] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Quiz & Assessment */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Quizzes, Class Test & Class Performance (Max 15)</span>
                  <span className="text-[#00E5FF] font-bold">{quiz} / 15</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="15" 
                  value={quiz} 
                  onChange={(e) => setQuiz(Number(e.target.value))} 
                  className="w-full accent-[#00E5FF] bg-[#0B1A30] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Assignments / presentation */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Presentations & Hand-in Assignments (Max 10)</span>
                  <span className="text-[#00E5FF] font-bold">{assignment} / 10</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={assignment} 
                  onChange={(e) => setAssignment(Number(e.target.value))} 
                  className="w-full accent-[#00E5FF] bg-[#0B1A30] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Attendance */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Continuous Attendance Record (Max 10)</span>
                  <span className="text-[#00E5FF] font-bold">{attendance} / 10</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={attendance} 
                  onChange={(e) => setAttendance(Number(e.target.value))} 
                  className="w-full accent-[#00E5FF] bg-[#0B1A30] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Final Exam */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Semester Final Examination Target (Max 40)</span>
                  <span className="text-[#00E5FF] font-bold">{finalExam} / 40</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  value={finalExam} 
                  onChange={(e) => setFinalExam(Number(e.target.value))} 
                  className="w-full accent-[#00E5FF] bg-[#0B1A30] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

            </div>

          </div>

          {/* Right: Dynamic Grading Result & Mini-Advising Box (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Realtime Grade Card */}
            <div className="bg-[#13253F] border border-[#1E3A5F] rounded-2xl p-6 flex flex-col justify-between flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 rounded-full filter blur-2xl pointer-events-none" />
              
              <div className="space-y-4">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Calculated Course Grade</span>
                
                <div className="flex items-center space-x-6">
                  {/* Big Grade Box */}
                  <div className={`w-24 h-24 rounded-2xl border flex flex-col items-center justify-center font-extrabold text-4xl ${color} shadow-lg shadow-black/10`}>
                    {grade}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-white">Points: <span className="text-[#00E5FF]">{points.toFixed(2)} / 4.00</span></div>
                    <div className="text-xs text-slate-300">Marks: <span className="text-white font-bold">{totalMarks} / 100</span></div>
                    <div className="text-[10px] text-slate-400 leading-tight">DIU Continuous Assessment System v4.0</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E3A5F]/50">
                  <div className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-1.5" />
                    Waiver Security Check:
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {points >= 3.00 
                      ? "Excellent! This course grade maintains your minimum 3.00 requirement for scholarship waivers. Keep up the high standards." 
                      : "Warning! Getting below B (3.00 GP) may risk losing your consecutive term waiver. Try raising your final exam target to compensate."}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/chat" className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#0B1A30] hover:bg-[#1E3A5F] border border-[#1E3A5F] text-xs font-semibold text-slate-300 transition-all">
                  <span>Consult AI Advisor Bot</span>
                  <ChevronRight className="w-4 h-4 text-[#00E5FF]" />
                </Link>
              </div>
            </div>

            {/* AI Warning widget */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start space-x-3">
              <Bot className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-amber-300">Waiver Renewal Deadline</h5>
                <p className="text-[10px] text-slate-300 mt-1">
                  Tuition waiver applications for Fall 2026 open in 3 days. Make sure your previous CGPA is locked and any "Incomplete" grades have been cleared.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
