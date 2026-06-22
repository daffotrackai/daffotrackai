import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle, BookOpenCheck, CheckCircle2, Plus, Save, Trash2, Search, X } from 'lucide-react';
import PageTopBar from '../components/PageTopBar';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/session';

function gradeFromMarks(marks, credit) {
  // If credit is 3.0, we normalize 115 to 100 for grading if needed,
  // but usually DIU uses 100. Since user requested specific values summing to 115,
  // I will normalize to 100 for the grade letter calculation.
  const normalized = credit === 3.0 ? (marks / 115) * 100 : marks;

  if (normalized >= 80) return { letter: 'A+', point: 4.0, tone: 'text-emerald-400', status: 'Excellent' };
  if (normalized >= 75) return { letter: 'A', point: 3.75, tone: 'text-emerald-300', status: 'Strong' };
  if (normalized >= 70) return { letter: 'A-', point: 3.5, tone: 'text-cyan-400', status: 'Stable' };
  if (normalized >= 65) return { letter: 'B+', point: 3.25, tone: 'text-teal-400', status: 'Good' };
  if (normalized >= 60) return { letter: 'B', point: 3.0, tone: 'text-indigo-400', status: 'Waiver safe' };
  if (normalized >= 55) return { letter: 'B-', point: 2.75, tone: 'text-yellow-400', status: 'Improve' };
  if (normalized >= 50) return { letter: 'C+', point: 2.5, tone: 'text-amber-400', status: 'Risk' };
  if (normalized >= 40) return { letter: 'D', point: 2.0, tone: 'text-orange-400', status: 'High risk' };
  return { letter: 'F', point: 0, tone: 'text-red-400', status: 'Retake' };
}

function clamp(value, max) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return Math.max(0, Math.min(max, number));
}

function calculateTotal(course) {
  if (course.credit === 3.0) {
    return course.mid + course.quiz + course.classTest + course.assignment + course.attendance + course.presentation + course.final;
  }
  if (course.credit === 1.5) {
    return course.labPerformance + course.labReport + course.attendance + course.final;
  }
  return course.mid + course.quiz + course.assignment + course.attendance + course.final;
}

export default function Courses() {
  const { drawerOpen, setDrawerOpen } = useOutletContext();
  const currentUser = getCurrentUser();

  const [courses, setCourses] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [showCatalog, setShowCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(Boolean(currentUser?.userId));
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser?.userId) return;

    let ignore = false;
    setLoading(true);

    Promise.all([
      apiRequest(`/api/courses?userId=${currentUser.userId}`),
      apiRequest('/api/catalog')
    ])
      .then(([courseData, catalogData]) => {
        if (ignore) return;
        setCourses(courseData.map(fromApiCourse));
        setCatalog(catalogData);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Unable to load data.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [currentUser?.userId]);

  const summary = useMemo(() => {
    const credits = courses.reduce((sum, course) => sum + Number(course.credit || 0), 0);
    const weighted = courses.reduce((sum, course) => {
      const total = calculateTotal(course);
      return sum + gradeFromMarks(total, course.credit).point * Number(course.credit || 0);
    }, 0);

    return {
      credits,
      semesterGpa: credits ? weighted / credits : 0,
      riskCount: courses.filter((course) => gradeFromMarks(calculateTotal(course), course.credit).point < 3).length,
    };
  }, [courses]);

  const updateCourse = (id, field, value) => {
    const maxByField = {
      credit: 6, mid: 25, quiz: 15, classTest: 15, assignment: 10,
      attendance: 10, presentation: 10, final: 40,
      labPerformance: 30, labReport: 30
    };

    setCourses((items) => items.map((course) => (
      course.id === id
        ? { ...course, [field]: field in maxByField ? clamp(value, maxByField[field]) : value }
        : course
    )));
  };

  const addFromCatalog = (item) => {
    setCourses((items) => [
      ...items,
      {
        id: `draft-${Date.now()}`,
        code: item.code,
        title: item.name,
        credit: item.credit,
        mid: 0, quiz: 0, classTest: 0, assignment: 0, attendance: 0, presentation: 0, final: 0,
        labPerformance: 0, labReport: 0,
        attendancePercent: 0, isDraft: true
      },
    ]);
    setShowCatalog(false);
    setSearchQuery('');
  };

  const addManual = () => {
    setCourses((items) => [
      ...items,
      {
        id: `draft-${Date.now()}`,
        code: 'NEW-101',
        title: 'New Course',
        credit: 3,
        mid: 0, quiz: 0, classTest: 0, assignment: 0, attendance: 0, presentation: 0, final: 0,
        labPerformance: 0, labReport: 0,
        attendancePercent: 0, isDraft: true
      },
    ]);
  };

  const saveCourse = async (course) => {
    if (!currentUser?.userId) {
      setError('Please login before saving course data.');
      return;
    }

    setSavingId(course.id);
    setError('');
    try {
      const path = course.isDraft
        ? `/api/courses?userId=${currentUser.userId}`
        : `/api/courses/${course.id}?userId=${currentUser.userId}`;
      const method = course.isDraft ? 'POST' : 'PUT';
      const saved = await apiRequest(path, { method, body: JSON.stringify(toApiCourse(course)) });
      setCourses((items) => items.map((item) => item.id === course.id ? fromApiCourse(saved) : item));
    } catch (err) {
      setError(err.message || 'Unable to save course.');
    } finally {
      setSavingId(null);
    }
  };

  const deleteCourse = async (course) => {
    if (course.isDraft) {
      setCourses((items) => items.filter((item) => item.id !== course.id));
      return;
    }

    setSavingId(course.id);
    setError('');
    try {
      await apiRequest(`/api/courses/${course.id}?userId=${currentUser.userId}`, { method: 'DELETE' });
      setCourses((items) => items.filter((item) => item.id !== course.id));
    } catch (err) {
      setError(err.message || 'Unable to delete course.');
    } finally {
      setSavingId(null);
    }
  };

  const filteredCatalog = catalog.filter(item =>
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageTopBar
        title="Course Tracker"
        subtitle="Track marks, credits, risk and projected semester GPA"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-(--bg-main) text-(--text-main)">
        <div className="max-w-7xl mx-auto space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs text-red-500">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-xl border border-(--border-main) bg-(--bg-card) px-4 py-3 text-xs text-(--text-muted)">
              Loading course data from database...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard icon={BookOpenCheck} label="Registered Credits" value={summary.credits.toFixed(1)} />
            <SummaryCard icon={CheckCircle2} label="Projected SGPA" value={summary.semesterGpa.toFixed(2)} tone="text-teal-500" />
            <SummaryCard icon={AlertTriangle} label="At-risk Courses" value={summary.riskCount} tone={summary.riskCount ? 'text-amber-500' : 'text-emerald-500'} />
          </div>

          <section className="rounded-2xl border border-(--border-main) bg-(--bg-card) overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-(--border-main) px-5 py-4">
              <div>
                <h1 className="text-sm font-bold text-(--text-main)">Semester Courses</h1>
                <p className="mt-1 text-[10px] text-(--text-muted)">
                  Theory (3.0): Mid 25, Quiz 15, CT 15, Assign 5, Attend 7, Pres 8, Final 40. <br/>
                  Lab (1.5): Lab Perf 25, Lab Report 25, Attend 10, Final 40.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatalog(true)}
                  className="flex h-10 items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/10 px-3 text-xs font-bold text-teal-500 hover:bg-teal-500/15"
                >
                  <Search className="w-4 h-4" />
                  Catalog
                </button>
                <button
                  type="button"
                  onClick={addManual}
                  className="flex h-10 items-center gap-2 rounded-xl border border-(--border-main) bg-(--bg-main) px-3 text-xs font-bold text-(--text-main) hover:bg-teal-500/5"
                >
                  <Plus className="w-4 h-4" />
                  Manual
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-(--text-muted)">
                  <tr>
                    <th className="px-4 py-3 font-bold w-48">Course</th>
                    <th className="px-4 py-3 font-bold w-20">Credit</th>
                    <th className="px-4 py-3 font-bold" colSpan={7}>Grading Components</th>
                    <th className="px-4 py-3 font-bold">Total</th>
                    <th className="px-4 py-3 font-bold">Grade</th>
                    <th className="px-4 py-3 font-bold w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--border-main)">
                  {courses.map((course) => {
                    const total = calculateTotal(course);
                    const grade = gradeFromMarks(total, course.credit);
                    return (
                      <tr key={course.id} className="text-(--text-main)">
                        <td className="px-4 py-4">
                          <input value={course.code} onChange={(event) => updateCourse(course.id, 'code', event.target.value)} className="w-full rounded-lg border border-(--border-main) bg-(--bg-main) px-2 py-2 text-xs font-bold text-(--text-main) outline-none focus:border-teal-500/40" />
                          <input value={course.title} onChange={(event) => updateCourse(course.id, 'title', event.target.value)} className="mt-2 w-full rounded-lg border border-(--border-main) bg-(--bg-main) px-2 py-2 text-[10px] text-(--text-muted) outline-none focus:border-teal-500/40" />
                        </td>
                        <td className="px-4 py-4">
                           <select
                            value={course.credit}
                            onChange={(e) => updateCourse(course.id, 'credit', Number(e.target.value))}
                            className="w-16 rounded-lg border border-(--border-main) bg-(--bg-main) px-2 py-2 text-xs text-(--text-main) outline-none focus:border-teal-500/40"
                           >
                             <option value={3.0}>3.0</option>
                             <option value={1.5}>1.5</option>
                             <option value={2.0}>2.0</option>
                             <option value={1.0}>1.0</option>
                           </select>
                        </td>

                        {/* Dynamic Marks Columns */}
                        <td className="px-4 py-4" colSpan={7}>
                           <div className="flex flex-wrap gap-2">
                             {course.credit === 3.0 ? (
                               <>
                                 <MarkInput label="Mid" val={course.mid} max={25} onChange={(v) => updateCourse(course.id, 'mid', v)} />
                                 <MarkInput label="Quiz" val={course.quiz} max={15} onChange={(v) => updateCourse(course.id, 'quiz', v)} />
                                 <MarkInput label="CT" val={course.classTest} max={15} onChange={(v) => updateCourse(course.id, 'classTest', v)} />
                                 <MarkInput label="Assign" val={course.assignment} max={5} onChange={(v) => updateCourse(course.id, 'assignment', v)} />
                                 <MarkInput label="Attend" val={course.attendance} max={7} onChange={(v) => updateCourse(course.id, 'attendance', v)} />
                                 <MarkInput label="Pres" val={course.presentation} max={8} onChange={(v) => updateCourse(course.id, 'presentation', v)} />
                                 <MarkInput label="Final" val={course.final} max={40} onChange={(v) => updateCourse(course.id, 'final', v)} />
                               </>
                             ) : course.credit === 1.5 ? (
                               <>
                                 <MarkInput label="Perf" val={course.labPerformance} max={25} onChange={(v) => updateCourse(course.id, 'labPerformance', v)} />
                                 <MarkInput label="Report" val={course.labReport} max={25} onChange={(v) => updateCourse(course.id, 'labReport', v)} />
                                 <MarkInput label="Attend" val={course.attendance} max={10} onChange={(v) => updateCourse(course.id, 'attendance', v)} />
                                 <MarkInput label="Final" val={course.final} max={40} onChange={(v) => updateCourse(course.id, 'final', v)} />
                               </>
                             ) : (
                               <>
                                 <MarkInput label="Mid" val={course.mid} max={25} onChange={(v) => updateCourse(course.id, 'mid', v)} />
                                 <MarkInput label="Quiz" val={course.quiz} max={15} onChange={(v) => updateCourse(course.id, 'quiz', v)} />
                                 <MarkInput label="Assign" val={course.assignment} max={10} onChange={(v) => updateCourse(course.id, 'assignment', v)} />
                                 <MarkInput label="Attend" val={course.attendance} max={10} onChange={(v) => updateCourse(course.id, 'attendance', v)} />
                                 <MarkInput label="Final" val={course.final} max={40} onChange={(v) => updateCourse(course.id, 'final', v)} />
                               </>
                             )}
                           </div>
                        </td>

                        <td className="px-4 py-4 font-black text-(--text-main)">{total}</td>
                        <td className="px-4 py-4">
                          <p className={`text-lg font-black ${grade.tone}`}>{grade.letter}</p>
                          <p className="text-[10px] text-(--text-muted)">{grade.status}</p>
                        </td>
                        <td className="px-4 py-4 flex gap-1">
                          <button
                            type="button"
                            onClick={() => saveCourse(course)}
                            disabled={savingId === course.id}
                            title="Save"
                            className="rounded-lg border border-teal-500/20 bg-teal-500/10 p-2 text-teal-500 hover:bg-teal-500/15 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCourse(course)}
                            disabled={savingId === course.id}
                            title="Delete"
                            className="rounded-lg border border-red-500/15 bg-red-500/8 p-2 text-red-500 hover:bg-red-500/15"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Course Catalog Modal */}
      {showCatalog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-(--bg-card) border border-(--border-main) w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-(--border-main) flex items-center justify-between">
              <h2 className="text-lg font-bold text-(--text-main)">Course Catalog</h2>
              <button onClick={() => setShowCatalog(false)} className="p-1 rounded-lg hover:bg-white/5 text-(--text-muted)">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-(--border-main)">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search by code or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-(--bg-main) border border-(--border-main) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--text-main) focus:outline-none focus:border-teal-500/50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredCatalog.map(item => (
                <button
                  key={item.id}
                  onClick={() => addFromCatalog(item)}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-teal-500/10 border border-transparent transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-(--text-main) group-hover:text-teal-500">{item.code}</p>
                      <p className="text-xs text-(--text-muted)">{item.name}</p>
                    </div>
                    <span className="text-[10px] font-bold text-teal-500/60 bg-teal-500/5 px-2 py-0.5 rounded border border-teal-500/10">
                      {item.credit} CR
                    </span>
                  </div>
                </button>
              ))}
              {filteredCatalog.length === 0 && (
                <div className="py-12 text-center text-(--text-muted) text-sm">
                  No courses found matching "{searchQuery}"
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-(--border-main) text-[10px] text-center text-(--text-muted)">
              Select a course to instantly add it to your tracker.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MarkInput({ label, val, max, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-bold uppercase text-slate-600 px-1">{label}</span>
      <input
        type="number"
        min="0"
        max={max}
        value={val}
        onChange={(e) => onChange(e.target.value)}
        className="w-14 rounded-lg border border-white/8 bg-[#060e1a] px-1.5 py-1.5 text-[11px] text-white outline-none focus:border-teal-500/40 text-center"
      />
      <span className="text-[8px] text-slate-700 text-center">/{max}</span>
    </div>
  );
}

function fromApiCourse(course) {
  return {
    id: course.id,
    code: course.code,
    title: course.title,
    credit: course.credit,
    mid: course.midtermMarks,
    quiz: course.quizMarks,
    classTest: course.classTestMarks,
    assignment: course.assignmentMarks,
    attendance: course.attendanceMarks,
    presentation: course.presentationMarks,
    final: course.finalMarks,
    labPerformance: course.labPerformanceMarks,
    labReport: course.labReportMarks,
    attendancePercent: course.attendancePercent || course.attendanceMarks * 10,
    isDraft: false,
  };
}

function toApiCourse(course) {
  return {
    code: course.code,
    title: course.title,
    credit: course.credit,
    midtermMarks: course.mid,
    quizMarks: course.quiz,
    classTestMarks: course.classTest,
    assignmentMarks: course.assignment,
    attendanceMarks: course.attendance,
    presentationMarks: course.presentation,
    finalMarks: course.final,
    labPerformanceMarks: course.labPerformance,
    labReportMarks: course.labReport,
    attendancePercent: course.attendancePercent || course.attendance * 10,
  };
}

function SummaryCard({ icon: Icon, label, value, tone = 'text-white' }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0a1525] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-slate-600" />
      </div>
      <p className={`mt-3 text-2xl font-black ${tone}`}>{value}</p>
    </div>
  );
}
