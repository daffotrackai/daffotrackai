import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle, BookOpenCheck, CheckCircle2, Plus, Save, Trash2 } from 'lucide-react';
import PageTopBar from '../components/PageTopBar';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/session';

function gradeFromMarks(marks) {
  if (marks >= 80) return { letter: 'A+', point: 4.0, tone: 'text-emerald-400', status: 'Excellent' };
  if (marks >= 75) return { letter: 'A', point: 3.75, tone: 'text-emerald-300', status: 'Strong' };
  if (marks >= 70) return { letter: 'A-', point: 3.5, tone: 'text-cyan-400', status: 'Stable' };
  if (marks >= 65) return { letter: 'B+', point: 3.25, tone: 'text-teal-400', status: 'Good' };
  if (marks >= 60) return { letter: 'B', point: 3.0, tone: 'text-indigo-400', status: 'Waiver safe' };
  if (marks >= 55) return { letter: 'B-', point: 2.75, tone: 'text-yellow-400', status: 'Improve' };
  if (marks >= 50) return { letter: 'C+', point: 2.5, tone: 'text-amber-400', status: 'Risk' };
  if (marks >= 40) return { letter: 'D', point: 2.0, tone: 'text-orange-400', status: 'High risk' };
  return { letter: 'F', point: 0, tone: 'text-red-400', status: 'Retake' };
}

function clamp(value, max) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return Math.max(0, Math.min(max, number));
}

export default function Courses() {
  const { drawerOpen, setDrawerOpen } = useOutletContext();
  const currentUser = getCurrentUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(Boolean(currentUser?.userId));
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser?.userId) return;

    let ignore = false;
    setLoading(true);
    apiRequest(`/api/courses?userId=${currentUser.userId}`)
      .then((data) => {
        if (ignore) return;
        setCourses(data.map(fromApiCourse));
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Unable to load courses.');
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
      const marks = course.mid + course.quiz + course.assignment + course.attendance + course.final;
      return sum + gradeFromMarks(marks).point * Number(course.credit || 0);
    }, 0);

    return {
      credits,
      semesterGpa: credits ? weighted / credits : 0,
      riskCount: courses.filter((course) => gradeFromMarks(course.mid + course.quiz + course.assignment + course.attendance + course.final).point < 3).length,
    };
  }, [courses]);

  const updateCourse = (id, field, value) => {
    const maxByField = { credit: 6, mid: 25, quiz: 15, assignment: 10, attendance: 10, final: 40 };
    setCourses((items) => items.map((course) => (
      course.id === id
        ? { ...course, [field]: field in maxByField ? clamp(value, maxByField[field]) : value }
        : course
    )));
  };

  const addCourse = () => {
    setCourses((items) => [
      ...items,
      { id: `draft-${Date.now()}`, code: 'NEW-101', title: 'New Course', credit: 3, mid: 0, quiz: 0, assignment: 0, attendance: 0, final: 0, attendancePercent: 0, isDraft: true },
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

  return (
    <>
      <PageTopBar
        title="Course Tracker"
        subtitle="Track marks, credits, risk and projected semester GPA"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#060e1a]">
        <div className="max-w-7xl mx-auto space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-xl border border-white/8 bg-[#0a1525] px-4 py-3 text-xs text-slate-400">
              Loading course data from database...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard icon={BookOpenCheck} label="Registered Credits" value={summary.credits.toFixed(0)} />
            <SummaryCard icon={CheckCircle2} label="Projected SGPA" value={summary.semesterGpa.toFixed(2)} tone="text-teal-400" />
            <SummaryCard icon={AlertTriangle} label="At-risk Courses" value={summary.riskCount} tone={summary.riskCount ? 'text-amber-400' : 'text-emerald-400'} />
          </div>

          <section className="rounded-2xl border border-white/8 bg-[#0a1525] overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-white/6 px-5 py-4">
              <div>
                <h1 className="text-sm font-bold text-white">Semester Courses</h1>
                <p className="mt-1 text-xs text-slate-500">DIU grading: Mid 25, Quiz 15, Assignment 10, Attendance 10, Final 40.</p>
              </div>
              <button
                type="button"
                onClick={addCourse}
                className="flex h-10 items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/10 px-3 text-xs font-bold text-teal-400 hover:bg-teal-500/15"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="bg-white/3 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    {['Course', 'Credit', 'Mid', 'Quiz', 'Assign', 'Attend', 'Final', 'Total', 'Grade', ''].map((heading) => (
                      <th key={heading} className="px-4 py-3 font-bold">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {courses.map((course) => {
                    const total = course.mid + course.quiz + course.assignment + course.attendance + course.final;
                    const grade = gradeFromMarks(total);
                    return (
                      <tr key={course.id} className="text-slate-300">
                        <td className="px-4 py-4">
                          <input value={course.code} onChange={(event) => updateCourse(course.id, 'code', event.target.value)} className="w-28 rounded-lg border border-white/8 bg-[#060e1a] px-2 py-2 text-xs font-bold text-white outline-none focus:border-teal-500/40" />
                          <input value={course.title} onChange={(event) => updateCourse(course.id, 'title', event.target.value)} className="mt-2 w-full rounded-lg border border-white/8 bg-[#060e1a] px-2 py-2 text-xs text-slate-300 outline-none focus:border-teal-500/40" />
                        </td>
                        {[
                          ['credit', 6],
                          ['mid', 25],
                          ['quiz', 15],
                          ['assignment', 10],
                          ['attendance', 10],
                          ['final', 40],
                        ].map(([field, max]) => (
                          <td key={field} className="px-4 py-4">
                            <input
                              type="number"
                              min="0"
                              max={max}
                              value={course[field]}
                              onChange={(event) => updateCourse(course.id, field, event.target.value)}
                              className="w-16 rounded-lg border border-white/8 bg-[#060e1a] px-2 py-2 text-xs text-white outline-none focus:border-teal-500/40"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-4 font-black text-white">{total}</td>
                        <td className="px-4 py-4">
                          <p className={`text-lg font-black ${grade.tone}`}>{grade.letter}</p>
                          <p className="text-[10px] text-slate-500">{grade.status}</p>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => saveCourse(course)}
                            disabled={savingId === course.id}
                            className="mr-2 rounded-lg border border-teal-500/20 bg-teal-500/10 p-2 text-teal-400 hover:bg-teal-500/15 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCourse(course)}
                            disabled={savingId === course.id}
                            className="rounded-lg border border-red-500/15 bg-red-500/8 p-2 text-red-400 hover:bg-red-500/15"
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
    </>
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
    assignment: course.assignmentMarks,
    attendance: course.attendanceMarks,
    final: course.finalMarks,
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
    assignmentMarks: course.assignment,
    attendanceMarks: course.attendance,
    finalMarks: course.final,
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
