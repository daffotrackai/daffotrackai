import { useNavigate, useRouteError, Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle, Sparkles, Terminal } from 'lucide-react';
import AppLogo from '../components/AppLogo';

export default function ErrorPage() {
  let error;
  try {
    error = useRouteError();
  } catch (e) {
    error = null;
  }

  const navigate = useNavigate();

  const is404 = !error || error?.status === 404;

  return (
    <div className="min-h-screen bg-(--bg-main) text-(--text-main) flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* ── Ambient Background Glows ── */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* ── Main Content ── */}
      <div className="max-w-2xl w-full text-center relative z-10 space-y-8">

        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <AppLogo size="2xl" />
          <div className="h-1 w-12 bg-gradient-to-r from-transparent via-teal-500 to-transparent mt-2" />
        </div>

        {/* Visual Error Code */}
        <div className="relative inline-block animate-in zoom-in-95 duration-500">
           <h1 className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter opacity-10 select-none">
             {is404 ? '404' : 'ERR'}
           </h1>
        </div>

        {/* Messaging */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            {is404 ? "Oops! This page is lost." : "Something went wrong."}
          </h2>
          <p className="text-(--text-muted) text-base max-w-md mx-auto leading-relaxed">
            {is404
              ? "The academic records you are looking for might have been moved or doesn't exist anymore."
              : "An unexpected error occurred. Our team at Metamorph X has been notified."}
          </p>
        </div>

        {/* Technical Details (Subtle) */}
        <div className="flex items-center justify-center gap-2 bg-white/5 dark:bg-white/5 light:bg-black/5 border border-(--border-main) rounded-xl px-4 py-2.5 max-w-xs mx-auto animate-in fade-in duration-1000 delay-500">
           <Terminal className="w-3.5 h-3.5 text-teal-500" />
           <code className="text-[10px] font-mono text-(--text-muted) uppercase tracking-widest">
             {error?.statusText || error?.message || 'Unknown Execution Error'}
           </code>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-(--bg-card) border border-(--border-main) hover:bg-white/5 text-(--text-main) font-bold text-sm transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-teal-500 text-white font-black text-sm shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:bg-teal-400 transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center animate-in fade-in duration-1000 delay-700">
         <p className="text-[10px] text-(--text-muted) font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
           <Sparkles className="w-3 h-3 text-teal-500" />
           System Guard by Metamorph X
         </p>
      </div>

    </div>
  );
}
