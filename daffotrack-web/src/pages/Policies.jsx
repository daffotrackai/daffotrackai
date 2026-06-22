import { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { BookOpen, FileText, GraduationCap, MessageSquare, Search, ShieldCheck, WalletCards } from 'lucide-react';
import PageTopBar from '../components/PageTopBar';

const policies = [
  {
    category: 'Waiver',
    icon: WalletCards,
    title: 'Tuition Waiver Eligibility',
    code: 'FIN-WVR-01',
    summary: 'Maintain at least 12 credits, SGPA 3.00+, and no F, I or W grades for semester waiver safety.',
    points: ['3.80-3.89 can qualify for 40% waiver.', '3.90-3.99 can qualify for 60% waiver.', '4.00 can qualify for 100% waiver.'],
  },
  {
    category: 'Exams',
    icon: FileText,
    title: 'Makeup Exam Request',
    code: 'EXM-MKP-03',
    summary: 'Apply within 3 working days with valid evidence and department approval.',
    points: ['Collect written approval from the Head of Department.', 'Submit the application and payment through the required office.', 'Keep medical or emergency documents ready.'],
  },
  {
    category: 'Attendance',
    icon: ShieldCheck,
    title: 'Final Exam Attendance Requirement',
    code: 'ATT-FNL-75',
    summary: 'Students should maintain at least 75% attendance in each course to sit for semester final exams.',
    points: ['Track attendance per course, not only semester average.', 'Low attendance should be discussed with the course teacher early.', 'Medical absence needs documentary support.'],
  },
  {
    category: 'Grades',
    icon: GraduationCap,
    title: 'Retake and Grade Improvement',
    code: 'GRD-IMP-04',
    summary: 'F grades require retake. B- or lower grades may be improved where departmental rules allow.',
    points: ['Retake clears failed coursework.', 'Improvement is useful when a weak grade harms CGPA.', 'Confirm offering and registration dates before planning.'],
  },
  {
    category: 'Courses',
    icon: BookOpen,
    title: 'Course Registration Planning',
    code: 'CRS-REG-02',
    summary: 'Pick credits based on workload, prerequisite sequence, CGPA target and waiver constraints.',
    points: ['Avoid overload when multiple lab courses are present.', 'Prioritize prerequisite courses for graduation flow.', 'Keep at least 12 credits when waiver eligibility matters.'],
  },
];

export default function Policies() {
  const { drawerOpen, setDrawerOpen } = useOutletContext();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(policies.map((policy) => policy.category))];
  const filteredPolicies = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return policies.filter((policy) => {
      const categoryMatches = category === 'All' || policy.category === category;
      const textMatches = !needle || [policy.category, policy.title, policy.code, policy.summary, ...policy.points]
        .join(' ')
        .toLowerCase()
        .includes(needle);
      return categoryMatches && textMatches;
    });
  }, [category, query]);

  return (
    <>
      <PageTopBar
        title="DIU Policy Center"
        subtitle="Context-bound rules for AI advisor and student planning"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-(--bg-main) text-(--text-main)">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="rounded-2xl border border-(--border-main) bg-(--bg-card) p-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <label className="relative block">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-muted)" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search waiver, makeup, attendance, retake..."
                    className="w-full rounded-xl border border-(--border-main) bg-(--bg-main) py-3 pl-11 pr-4 text-sm text-(--text-main) outline-none placeholder:text-(--text-muted) focus:border-teal-500/50"
                  />
                </label>
              </div>
              <div className="lg:col-span-5 flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                      category === item
                        ? 'border-teal-500/30 bg-teal-500/15 text-teal-500'
                        : 'border-(--border-main) bg-(--bg-main) text-(--text-muted) hover:text-(--text-main)'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {filteredPolicies.map(({ category: policyCategory, icon: Icon, title, code, summary, points }) => (
              <article key={code} className="rounded-2xl border border-(--border-main) bg-(--bg-card) p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-lg border border-(--border-main) bg-(--bg-main) px-2 py-1 text-[10px] font-mono text-(--text-muted)">{code}</span>
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-teal-500">{policyCategory}</p>
                <h2 className="mt-1 text-base font-black text-(--text-main)">{title}</h2>
                <p className="mt-3 text-xs leading-relaxed text-(--text-muted)">{summary}</p>
                <div className="mt-4 space-y-2">
                  {points.map((point) => (
                    <p key={point} className="flex gap-2 text-xs leading-relaxed text-(--text-muted)">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                      {point}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-teal-500/20 bg-teal-500/10 p-5">
            <div>
              <p className="text-sm font-bold text-(--text-main)">Need a personalized answer?</p>
              <p className="mt-1 text-xs text-(--text-muted)">Open AI Advisor and ask with your CGPA, credits, course code or policy topic.</p>
            </div>
            <Link
              to="/chat"
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 text-sm font-bold text-white hover:bg-teal-400"
            >
              <MessageSquare className="h-4 w-4" />
              Ask AI
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
