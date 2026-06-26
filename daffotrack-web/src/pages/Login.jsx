import { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Shield, User, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { setCurrentUser } from '../lib/session';
import PageTopBar from '../components/PageTopBar';
import AppLogo from '../components/AppLogo';

export default function Login() {
  const navigate = useNavigate();
  // MainLayout থেকে ড্রয়ারের স্টেট রিসিভ করা হচ্ছে
  const { drawerOpen, setDrawerOpen } = useOutletContext(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, guest: false }),
      });
      setCurrentUser(response);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: '', password: '', guest: true }),
      });
      setCurrentUser(response);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Guest login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTopBar
        title="Sign In"
        subtitle="Access your DaffoTrack student profile"
        backLabel="Home"
        backTo="/"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      {/* Ambient glows (পেজের নিজস্ব ডিজাইন তাই রেখে দেওয়া হলো) */}
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[400px] bg-teal-500/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[400px] h-[300px] bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* pt-24 যোগ করা হয়েছে যাতে টপ-বারের নিচে না ঢোকে */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 relative z-10 bg-(--bg-main) text-(--text-main)">
        
        {/* Logo & brand */}
        <div className="flex flex-col items-center mb-8">
          <AppLogo size="2xl" className="mb-5" />
          <h1 className="text-2xl font-black tracking-tight text-(--text-main)">DaffoTrack AI Portal</h1>
          <p className="mt-1 text-xs text-(--text-muted) font-semibold tracking-widest uppercase">by Metamorph X</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md">
          <div className="bg-(--bg-card) border border-(--border-main) rounded-2xl shadow-2xl shadow-black/10 p-8">

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                  DIU Student Email
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
                  <input
                    type="email"
                    required
                    placeholder="student@diu.edu.bd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-(--bg-main) border border-(--border-main) rounded-xl text-sm text-(--text-main) placeholder-(--text-muted) focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                    Portal Password
                  </label>
                  <a href="#" className="text-xs text-teal-500 hover:text-teal-400 transition-colors font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-(--bg-main) border border-(--border-main) rounded-xl text-sm text-(--text-main) placeholder-(--text-muted) focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-main) transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-xs text-red-500">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-teal-500 hover:bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Sign In with DIU Portal <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-(--border-main)" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-(--bg-card) text-xs text-(--text-muted) font-semibold tracking-wider uppercase">
                  Or continue as guest
                </span>
              </div>
            </div>

            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-semibold text-(--text-muted) bg-white/5 border border-(--border-main) hover:bg-white/10 hover:text-(--text-main) transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              Explore as Guest / Sandbox User
            </button>

            <p className="mt-5 text-center text-xs text-(--text-muted)">
              New user?{' '}
              <Link to="/register" className="font-semibold text-teal-500 hover:text-teal-400 transition-colors">
                Create a profile here
              </Link>
            </p>
          </div>

          {/* Back link */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-(--text-muted) hover:text-teal-500 transition-colors">
              ← Back to Landing Page
            </Link>
          </div>

          {/* Trust badge */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-teal-500/60" />
            <span>Local calculations only. No portal data stored.</span>
          </div>
        </div>
      </main>
    </>
  );
}
