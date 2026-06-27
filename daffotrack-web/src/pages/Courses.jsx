import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle, BookOpenCheck, CheckCircle2, Plus, Save, Trash2, Search, X, Calendar } from 'lucide-react';
import PageTopBar from '../components/PageTopBar';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/session';
import useCurrentUserProfile from '../lib/useCurrentUserProfile';
import { useToast } from '../lib/ToastContext';

// Remove static SEMESTER_CATALOG and move logic inside component
const CURRENT_SEMESTER = (() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  if (month < 5) return `Spring ${year}`;
  if (month < 9) return `Summer ${year}`;
  return `Fall ${year}`;
})();

function gradeFromMarks(marks, credit) {
  const normalized = credit === 3.0 ? (marks / 115) * 100 : marks;
  if (normalized >= 80) return { letter: 'A+', point: 4.0, tone: 'text-emerald-500', status: 'Excellent' };
  if (normalized >= 75) return { letter: 'A', point: 3.75, tone: 'text-emerald-400', status: 'Strong' };
  if (normalized >= 70) return { letter: 'A-', point: 3.5, tone: 'text-cyan-500', status: 'Stable' };
  if (normalized >= 65) return { letter: 'B+', point: 3.25, tone: 'text-teal-500', status: 'Good' };
  if (normalized >= 60) return { letter: 'B', point: 3.0, tone: 'text-indigo-500', status: 'Waiver safe' };
  if (normalized >= 55) return { letter: 'B-', point: 2.75, tone: 'text-blue-500', status: 'Improve' };
  if (normalized >= 50) return { letter: 'C+', point: 2.5, tone: 'text-yellow-600', status: 'Risk' };
  if (normalized >= 40) return { letter: 'D', point: 2.0, tone: 'text-orange-500', status: 'High risk' };
  return { letter: 'F', point: 0, tone: 'text-red-500', status: 'Retake' };
}

function clamp(value, max) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return Math.max(0, Math.min(max, number));
}

function calculateTotal(course) {
  if (course.credit === 3.0) {
    return (course.mid || 0) + (course.quiz || 0) + (course.classTest || 0) + (course.assignment || 0) + (course.attendance || 0) + (course.presentation || 0) + (course.final || 0);
  }
  if (course.credit === 1.5) {
    return (course.labPerformance || 0) + (course.labReport || 0) + (course.attendance || 0) + (course.final || 0);
  }
  return (course.mid || 0) + (course.quiz || 0) + (course.assignment || 0) + (course.attendance || 0) + (course.final || 0);
}

export default function Courses() {
  const { drawerOpen, setDrawerOpen } = useOutletContext();
  const currentUser = useCurrentUserProfile();
  const { addToast } = useToast();

  const [courses, setCourses] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [showCatalog, setShowCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('All Semesters');

  const admissionYear = useMemo(() => {
    if (currentUser?.admissionDate) {
      return new Date(currentUser.admissionDate).getFullYear();
    }
    if (currentUser?.sessionYear) {
      const match = currentUser.sessionYear.match(/\d{4}/);
      if (match) return parseInt(match[0], 10);
    }
    return 2010; // Extreme fallback
  }, [currentUser]);

  const semesterCatalog = useMemo(() => {
    const currentYear = new Date().getFullYear() + 1; // Show one year ahead for planning
    const years = [];
    for (let y = currentYear; y >= admissionYear; y--) {
      years.push(`Fall ${y}`, `Summer ${y}`, `Spring ${y}`);
    }
    return years;
  }, [admissionYear]);

  const [loading, setLoading] = useState(Boolean(currentUser?.userId));
  const [savingId, setSavingId] = useState(null);
  const [isSavingAll, setIsSavingAll] = useState(false);
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
    return () => { ignore = true; };
  }, [currentUser?.userId]);

  const existingSemesters = useMemo(() => {
    const sems = new Set(courses.map(c => c.semesterName).filter(Boolean));
    return ['All Semesters', ...Array.from(sems).sort((a, b) => {
        // Sort semesters chronologically (desc)
        const [semA, yearA] = a.split(' ');
        const [semB, yearB] = b.split(' ');
        if (yearA !== yearB) return yearB - yearA;
        const order = { 'Fall': 3, 'Summer': 2, 'Spring': 1 };
        return order[semB] - order[semA];
    })];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSemester = semesterFilter === 'All Semesters' || !c.semesterName || c.semesterName === semesterFilter;
      const matchesSearch = !searchQuery ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSemester && matchesSearch;
    });
  }, [courses, semesterFilter, searchQuery]);

  const summary = useMemo(() => {
    const credits = filteredCourses.reduce((sum, course) => sum + Number(course.credit || 0), 0);
    const weighted = filteredCourses.reduce((sum, course) => {
      const total = calculateTotal(course);
      return sum + gradeFromMarks(total, course.credit).point * Number(course.credit || 0);
    }, 0);

    return {
      credits,
      semesterGpa: credits ? weighted / credits : 0,
      riskCount: filteredCourses.filter((course) => gradeFromMarks(calculateTotal(course), course.credit).point < 3).length,
    };
  }, [filteredCourses]);

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
      {
        id: `draft-${Date.now()}`,
        code: item.code,
        title: item.name,
        credit: item.credit,
        semesterName: semesterFilter === 'All Semesters' ? CURRENT_SEMESTER : semesterFilter,
        mid: 0, quiz: 0, classTest: 0, assignment: 0, attendance: 0, presentation: 0, final: 0,
        labPerformance: 0, labReport: 0,
        attendancePercent: 0, isDraft: true
      },
      ...items,
    ]);
    setShowCatalog(false);
  };

  const addManual = () => {
    setCourses((items) => [
      {
        id: `draft-${Date.now()}`,
        code: 'NEW-101',
        title: 'New Course',
        credit: 3,
        semesterName: semesterFilter === 'All Semesters' ? CURRENT_SEMESTER : semesterFilter,
        mid: 0, quiz: 0, classTest: 0, assignment: 0, attendance: 0, presentation: 0, final: 0,
        labPerformance: 0, labReport: 0,
        attendancePercent: 0, isDraft: true
      },
      ...items,
    ]);
  };

  const saveCourse = async (course) => {
    if (!currentUser?.userId) { setError('Please login before saving.'); return; }
    if (!course.semesterName || course.semesterName === '') {
      addToast('Please select a semester for ' + course.code, 'warning');
      return;
    }
    setSavingId(course.id);
    try {
      const path = course.isDraft
        ? `/api/courses?userId=${currentUser.userId}`
        : `/api/courses/${course.id}?userId=${currentUser.userId}`;
      const method = course.isDraft ? 'POST' : 'PUT';
      const saved = await apiRequest(path, { method, body: JSON.stringify(toApiCourse(course)) });
      setCourses((items) => items.map((item) => item.id === course.id ? fromApiCourse(saved) : item));
      addToast(`${course.code} saved successfully!`, 'success');
      return saved;
    } catch (err) {
      addToast('Failed to save ' + course.code, 'error');
    } finally { setSavingId(null); }
  };

  const saveAll = async () => {
    if (!currentUser?.userId) { setError('Please login before saving.'); return; }
    if (filteredCourses.length === 0) return;

    const invalidCourses = filteredCourses.filter(c => !c.semesterName || c.semesterName === '');
    if (invalidCourses.length > 0) {
      addToast(`Please select a semester for ${invalidCourses.length} course(s).`, 'warning');
      return;
    }

    setIsSavingAll(true);
    try {
      // Save all filtered courses that are visible
      // We process them sequentially or in parallel? Parallel is faster.
      await Promise.all(filteredCourses.map(c => {
         const path = c.isDraft
            ? `/api/courses?userId=${currentUser.userId}`
            : `/api/courses/${c.id}?userId=${currentUser.userId}`;
          const method = c.isDraft ? 'POST' : 'PUT';
          return apiRequest(path, { method, body: JSON.stringify(toApiCourse(c)) });
      }));

      // Refresh all courses from API to ensure sync
      const courseData = await apiRequest(`/api/courses?userId=${currentUser.userId}`);
      setCourses(courseData.map(fromApiCourse));
      addToast('All course records saved successfully!', 'success');
    } catch (err) {
      setError('Failed to save some courses. Please try again.');
    } finally {
      setIsSavingAll(false);
    }
  };

  const deleteCourse = async (course) => {
    if (course.isDraft) { setCourses((items) => items.filter((item) => item.id !== course.id)); return; }
    setSavingId(course.id);
    try {
      await apiRequest(`/api/courses/${course.id}?userId=${currentUser.userId}`, { method: 'DELETE' });
      setCourses((items) => items.filter((item) => item.id !== course.id));
    } catch (err) {} finally { setSavingId(null); }
  };

  return (
    <>
      <PageTopBar
        title="Comprehensive Course Records"
        subtitle="Manage all your academic semesters in one place"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-(--bg-main) text-(--text-main)">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Top Filter Bar */}
          <section className="bg-(--bg-card) border border-(--border-main) rounded-3xl p-5 shadow-sm">
             <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search by code or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-(--bg-main) border border-(--border-main) rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500/50"
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  <select
                    value={semesterFilter}
                    onChange={(e) => setSemesterFilter(e.target.value)}
                    className="flex-1 md:w-48 bg-(--bg-main) border border-(--border-main) rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500/50 font-bold"
                  >
                    {existingSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
             </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <SummaryCard
              icon={BookOpenCheck}
              label={semesterFilter === 'All Semesters' ? 'Total Credits' : `${semesterFilter} Credits`}
              value={summary.credits.toFixed(1)}
            />
            <SummaryCard
              icon={CheckCircle2}
              label={semesterFilter === 'All Semesters' ? 'Cumulative GPA' : `${semesterFilter} GPA`}
              value={summary.semesterGpa.toFixed(2)}
              tone="text-teal-500"
            />
            <SummaryCard
              icon={AlertTriangle}
              label="At-risk Courses"
              value={summary.riskCount}
              tone={summary.riskCount ? 'text-rose-500' : 'text-emerald-500'}
            />
          </div>

          <section className="rounded-3xl border border-(--border-main) bg-(--bg-card) overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-(--border-main) px-6 py-5">
              <div>
                <h2 className="text-lg font-black text-(--text-main) tracking-tight">Academic Records</h2>
                <p className="text-xs text-(--text-muted) font-medium mt-1">Focusing on: <span className="text-teal-500 font-bold">{semesterFilter}</span></p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowCatalog(true)}
                  className="flex-1 sm:flex-none flex h-11 items-center justify-center gap-2 rounded-2xl border border-teal-500/20 bg-teal-500/10 px-5 text-xs font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 hover:bg-teal-500/15 transition-all"
                >
                  <Search className="w-4 h-4" />
                  Catalog
                </button>
                <button
                  type="button"
                  onClick={addManual}
                  className="flex-1 sm:flex-none flex h-11 items-center justify-center gap-2 rounded-2xl border border-(--border-main) bg-(--bg-main) px-5 text-xs font-black uppercase tracking-widest text-(--text-main) hover:bg-teal-500/5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Manual
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-left text-sm">
                <thead className="bg-(--bg-main) text-[10px] font-black uppercase tracking-widest text-(--text-muted) border-b border-(--border-main)">
                  <tr>
                    <th className="px-6 py-4">Semester</th>
                    <th className="px-6 py-4">Course Details</th>
                    <th className="px-6 py-4">Credit</th>
                    <th className="px-6 py-4">Components & Marks</th>
                    <th className="px-6 py-4">Result</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--border-main)">
                  {filteredCourses.map((course) => {
                    const total = calculateTotal(course);
                    const grade = gradeFromMarks(total, course.credit);
                    return (
                      <tr key={course.id} className="text-(--text-main) hover:bg-(--bg-main)/50 transition-colors">
                        <td className="px-6 py-4 w-44">
                           <select
                            value={course.semesterName || ''}
                            onChange={(e) => updateCourse(course.id, 'semesterName', e.target.value)}
                            className="w-full bg-(--bg-main) border border-(--border-main) rounded-xl px-3 py-2 text-[11px] font-bold text-teal-600 dark:text-teal-400 focus:outline-none focus:border-teal-500/50"
                           >
                             <option value="">Select Semester</option>
                             {semesterCatalog.map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5 min-w-[200px]">
                            <div className="flex items-center gap-2">
                              <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg px-2 py-1">
                                <input
                                  value={course.code}
                                  onChange={(event) => updateCourse(course.id, 'code', event.target.value)}
                                  className="w-20 bg-transparent border-none p-0 text-[11px] font-black text-teal-600 dark:text-teal-400 focus:ring-0 placeholder:text-teal-500/30"
                                  placeholder="CODE"
                                />
                              </div>
                              <input
                                value={course.title}
                                onChange={(event) => updateCourse(course.id, 'title', event.target.value)}
                                className="flex-1 bg-transparent border-none p-0 text-xs font-bold text-(--text-main) focus:ring-0 placeholder:text-(--text-muted)/50"
                                placeholder="Course Title"
                              />
                            </div>
                            <div className="h-px bg-gradient-to-r from-(--border-main) to-transparent w-full" />
                          </div>
                        </td>
                        <td className="px-6 py-4 w-20">
                           <select
                            value={course.credit}
                            onChange={(e) => updateCourse(course.id, 'credit', Number(e.target.value))}
                            className="w-full bg-(--bg-main) border border-(--border-main) rounded-xl px-2 py-2 text-xs font-bold focus:outline-none"
                           >
                             <option value={3.0}>3.0</option>
                             <option value={1.5}>1.5</option>
                             <option value={2.0}>2.0</option>
                             <option value={1.0}>1.0</option>
                           </select>
                        </td>

                        <td className="px-6 py-4">
                           <div className="flex flex-wrap gap-2 py-1">
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
                             ) : (
                               <>
                                 <MarkInput label="Perf" val={course.labPerformance} max={25} onChange={(v) => updateCourse(course.id, 'labPerformance', v)} />
                                 <MarkInput label="Report" val={course.labReport} max={25} onChange={(v) => updateCourse(course.id, 'labReport', v)} />
                                 <MarkInput label="Attend" val={course.attendance} max={10} onChange={(v) => updateCourse(course.id, 'attendance', v)} />
                                 <MarkInput label="Final" val={course.final} max={40} onChange={(v) => updateCourse(course.id, 'final', v)} />
                               </>
                             )}
                           </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="text-center bg-(--bg-main) border border-(--border-main) rounded-2xl px-4 py-2 shadow-sm min-w-[70px]">
                               <p className={`text-xl font-black ${grade.tone}`}>{grade.letter}</p>
                               <p className="text-[8px] font-black uppercase text-(--text-muted) tracking-tighter">{total} Marks</p>
                             </div>
                             <div className="hidden xl:block">
                                <p className="text-[10px] font-black uppercase tracking-widest text-(--text-main)">{grade.point.toFixed(2)} pts</p>
                                <p className="text-[9px] font-bold text-(--text-muted) mt-1">{grade.status}</p>
                             </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => saveCourse(course)}
                              disabled={savingId === course.id}
                              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white transition-all shadow-sm border border-teal-500/20"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCourse(course)}
                              disabled={savingId === course.id}
                              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredCourses.length === 0 && (
                <div className="py-20 text-center space-y-3">
                   <div className="w-16 h-16 bg-(--bg-main) border border-(--border-main) rounded-3xl flex items-center justify-center mx-auto text-(--text-muted)">
                      <Search className="w-7 h-7" />
                   </div>
                   <p className="text-sm font-bold text-(--text-muted)">No courses found for the selected filter.</p>
                </div>
              )}
            </div>

            {filteredCourses.length > 0 && (
              <div className="px-6 py-6 bg-(--bg-main)/30 border-t border-(--border-main) flex justify-end">
                <button
                  type="button"
                  onClick={saveAll}
                  disabled={isSavingAll}
                  className="flex h-12 items-center justify-center gap-3 rounded-2xl bg-teal-500 text-white px-10 text-sm font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-teal-500/20 disabled:opacity-50 group"
                >
                  {isSavingAll ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  Save All Records
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Catalog Modal */}
      {showCatalog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-(--bg-card) border border-(--border-main) w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-8 py-6 border-b border-(--border-main) flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-(--text-main) tracking-tight">Course Catalog</h2>
                <p className="text-xs text-(--text-muted) font-medium mt-1">Search and instantly add standard DIU courses</p>
              </div>
              <button onClick={() => setShowCatalog(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-(--bg-main) border border-(--border-main) hover:bg-rose-500 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 border-b border-(--border-main) bg-(--bg-main)/30">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search by code or course name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-(--bg-main) border border-(--border-main) rounded-2xl pl-12 pr-4 py-4 text-sm text-(--text-main) focus:outline-none focus:border-teal-500/50 shadow-inner"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {catalog.filter(i => i.code.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                <button
                  key={item.id}
                  onClick={() => addFromCatalog(item)}
                  className="w-full text-left px-6 py-5 rounded-2xl hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-(--text-main) group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{item.code}</p>
                      <p className="text-xs text-(--text-muted) font-medium mt-1">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/20">
                        {item.credit} Credits
                      </span>
                      <Plus className="w-4 h-4 text-teal-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MarkInput({ label, val, max, onChange }) {
  return (
    <div className="flex flex-col gap-1 min-w-[50px]">
      <span className="text-[8px] font-black uppercase text-(--text-muted) px-1 tracking-tighter">{label}</span>
      <input
        type="number"
        min="0"
        max={max}
        value={val}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-(--bg-main) border border-(--border-main) rounded-xl px-1.5 py-2 text-[11px] font-black text-(--text-main) text-center focus:outline-none focus:border-teal-500/50 shadow-sm"
      />
      <span className="text-[8px] font-bold text-(--text-muted) opacity-40 text-center">/{max}</span>
    </div>
  );
}

function fromApiCourse(course) {
  return {
    id: course.id,
    code: course.code || '',
    title: course.title || '',
    credit: course.credit || 3,
    semesterName: course.semesterName || '',
    mid: course.midtermMarks || 0,
    quiz: course.quizMarks || 0,
    classTest: course.classTestMarks || 0,
    assignment: course.assignmentMarks || 0,
    attendance: course.attendanceMarks || 0,
    presentation: course.presentationMarks || 0,
    final: course.finalMarks || 0,
    labPerformance: course.labPerformanceMarks || 0,
    labReport: course.labReportMarks || 0,
    attendancePercent: course.attendancePercent || 0,
    isDraft: false,
  };
}

function toApiCourse(course) {
  return {
    code: course.code || 'NEW-000',
    title: course.title || 'Untitled Course',
    credit: course.credit || 3.0,
    semesterName: course.semesterName || '',
    midtermMarks: course.mid || 0,
    quizMarks: course.quiz || 0,
    classTestMarks: course.classTest || 0,
    assignmentMarks: course.assignment || 0,
    attendanceMarks: course.attendance || 0,
    presentationMarks: course.presentation || 0,
    finalMarks: course.final || 0,
    labPerformanceMarks: course.labPerformance || 0,
    labReportMarks: course.labReport || 0,
    attendancePercent: course.attendancePercent || 0,
  };
}

function SummaryCard({ icon: Icon, label, value, tone = 'text-(--text-main)' }) {
  return (
    <div className="bg-(--bg-card) border border-(--border-main) rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-widest text-(--text-muted)">{label}</p>
        <div className="w-9 h-9 rounded-2xl bg-(--bg-main) flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform">
           <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className={`mt-4 text-3xl font-black tracking-tighter ${tone}`}>{value}</p>
    </div>
  );
}
