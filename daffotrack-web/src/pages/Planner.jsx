import { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Calculator, GraduationCap, Target, TrendingUp, AlertTriangle, MessageSquare } from 'lucide-react';
import PageTopBar from '../components/PageTopBar';

const plans = [
  { label: 'Conservative', sgpa: 3.25, note: 'Stable improvement with safer workload' },
  { label: 'Target', sgpa: 3.6, note: 'Balanced path toward stronger waiver eligibility' },
  { label: 'Aggressive', sgpa: 3.85, note: 'High-performance route for top waiver brackets' },
];

function numberValue(value) {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}

export default function Planner() {
  const { drawerOpen, setDrawerOpen } = useOutletContext();
  const [currentCgpa, setCurrentCgpa] = useState(3.35);
  const [completedCredits, setCompletedCredits] = useState(72);
  const [nextCredits, setNextCredits] = useState(15);
  const [targetCgpa, setTargetCgpa] = useState(3.5);

  const result = useMemo(() => {
    const currentQuality = numberValue(currentCgpa) * numberValue(completedCredits);
    const targetQuality = numberValue(targetCgpa) * (numberValue(completedCredits) + numberValue(nextCredits));
    const requiredSgpa = numberValue(nextCredits) ? (targetQuality - currentQuality) / numberValue(nextCredits) : 0;
    const capped = Math.max(0, Math.min(4, requiredSgpa));
    const possible = requiredSgpa <= 4;

    return {
      requiredSgpa,
      capped,
      possible,
      afterConservative: ((currentQuality + plans[0].sgpa * nextCredits) / (completedCredits + nextCredits)) || 0,
      afterTarget: ((currentQuality + plans[1].sgpa * nextCredits) / (completedCredits + nextCredits)) || 0,
      afterAggressive: ((currentQuality + plans[2].sgpa * nextCredits) / (completedCredits + nextCredits)) || 0,
    };
  }, [currentCgpa, completedCredits, nextCredits, targetCgpa]);

  return (
    <>
      <PageTopBar
        title="Academic Planner"
        subtitle="Plan target CGPA, waiver safety and next semester workload"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#060e1a]">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 rounded-2xl border border-white/8 bg-[#0a1525] p-6">
              <div className="flex items-center gap-3 border-b border-white/6 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-400">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white">Target CGPA Calculator</h1>
                  <p className="text-xs text-slate-500">Estimate what SGPA you need next semester.</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Current CGPA" value={currentCgpa} setValue={setCurrentCgpa} min={0} max={4} step={0.01} />
                <Field label="Completed Credits" value={completedCredits} setValue={setCompletedCredits} min={0} max={160} step={1} />
                <Field label="Next Semester Credits" value={nextCredits} setValue={setNextCredits} min={1} max={24} step={1} />
                <Field label="Target CGPA" value={targetCgpa} setValue={setTargetCgpa} min={0} max={4} step={0.01} />
              </div>

              <div className={`mt-6 rounded-2xl border p-5 ${result.possible ? 'border-teal-500/20 bg-teal-500/8' : 'border-red-500/20 bg-red-500/8'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Required SGPA</p>
                    <p className={`mt-2 text-4xl font-black ${result.possible ? 'text-teal-400' : 'text-red-400'}`}>
                      {result.requiredSgpa.toFixed(2)}
                    </p>
                  </div>
                  {result.possible ? <Target className="h-10 w-10 text-teal-400" /> : <AlertTriangle className="h-10 w-10 text-red-400" />}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  {result.possible
                    ? 'This target is reachable with the selected credit load. Keep every course at or above the required average.'
                    : 'This target is above the 4.00 SGPA limit. Lower the target CGPA or spread the plan across more credits.'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="rounded-2xl border border-white/8 bg-[#0a1525] p-6">
                <div className="flex items-center justify-between border-b border-white/6 pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-white">Scenario Planning</h2>
                    <p className="mt-1 text-xs text-slate-500">Compare next-semester outcomes before course registration.</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan, index) => {
                    const values = [result.afterConservative, result.afterTarget, result.afterAggressive];
                    return (
                      <div key={plan.label} className="rounded-2xl border border-white/7 bg-white/3 p-4">
                        <p className="text-xs font-bold text-white">{plan.label}</p>
                        <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{plan.note}</p>
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-600">Next SGPA</p>
                            <p className="mt-1 text-xl font-black text-teal-400">{plan.sgpa.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-slate-600">New CGPA</p>
                            <p className="mt-1 text-xl font-black text-white">{values[index].toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionCard
                  icon={GraduationCap}
                  title="Waiver Guardrail"
                  body="For scholarship safety, keep semester SGPA at 3.00+ and avoid F, I or W grades."
                />
                <Link to="/chat" className="rounded-2xl border border-teal-500/20 bg-teal-500/8 p-5 transition-all hover:bg-teal-500/12">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-teal-400" />
                    <p className="text-sm font-bold text-white">Ask AI for a study plan</p>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    Send your target and weak courses to DaffoTrack AI for a focused weekly plan.
                  </p>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function Field({ label, value, setValue, min, max, step }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => setValue(Number(event.target.value))}
        className="mt-2 w-full rounded-xl border border-white/8 bg-[#060e1a] px-4 py-3 text-sm font-bold text-white outline-none focus:border-teal-500/50"
      />
    </label>
  );
}

function ActionCard({ icon: Icon, title, body }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0a1525] p-5">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-teal-400" />
        <p className="text-sm font-bold text-white">{title}</p>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">{body}</p>
    </div>
  );
}
