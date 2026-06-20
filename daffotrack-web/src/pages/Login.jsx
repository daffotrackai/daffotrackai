import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cpu, ArrowRight, Shield, User, Lock, Sparkles } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { setCurrentUser } from '../lib/session';
import NavigationDrawer from '../components/NavigationDrawer';

export default function Login() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          guest: false,
        }),
      });
      setCurrentUser(response);
      navigate('/profile');
    } catch (requestError) {
      setError(requestError.message || 'Login failed. Please try again.');
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
        body: JSON.stringify({
          email: '',
          password: '',
          guest: true,
        }),
      });
      setCurrentUser(response);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.message || 'Guest login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1A30] text-white flex flex-col justify-center relative px-4 sm:px-6 lg:px-8">
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      {/* Glow Ambient Lights */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-[#00E5FF]/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        {/* Back Link */}
        <Link to="/" className="absolute -top-12 left-0 text-xs font-semibold text-slate-400 hover:text-[#00E5FF] flex items-center transition-colors">
          &larr; Back to Landing Page
        </Link>

        {/* Branding Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-blue-600 p-[2px] shadow-lg mb-4">
            <div className="w-full h-full bg-[#0B1A30] rounded-[14px] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-[#00E5FF]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00E5FF] bg-clip-text text-transparent">
            DaffoTrack AI Portal
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 font-semibold tracking-wider uppercase">
            by Metamorph X
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#13253F] border border-[#1E3A5F] py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                DIU Student Email
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="student@diu.edu.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-[#0B1A30] border border-[#1E3A5F] rounded-xl text-sm placeholder-slate-500 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Portal Password
                </label>
                <div className="text-xs">
                  <a href="#" className="font-semibold text-[#00E5FF] hover:text-cyan-400 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-[#0B1A30] border border-[#1E3A5F] rounded-xl text-sm placeholder-slate-500 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-[#0B1A30] bg-[#00E5FF] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#0B1A30] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In with DIU Portal
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1E3A5F]/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-[#13253F] text-slate-400 font-semibold tracking-wider">
                  Or bypass authentication
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-[#0B1A30] hover:bg-[#1C365C] border border-[#1E3A5F] hover:text-white transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#00E5FF] mr-2" />
                Explore as Guest / Sandbox User
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400">
            New user?{' '}
            <Link to="/register" className="font-semibold text-[#00E5FF] hover:text-cyan-300">
              Create a profile here
            </Link>
          </div>

        </div>

        {/* Footer Policy Badge */}
        <div className="mt-6 flex items-center justify-center text-center text-xs text-slate-400 space-x-1.5">
          <Shield className="w-4 h-4 text-[#00E5FF]/80" />
          <span>Local calculations only. No portal data stored.</span>
        </div>
      </div>
    </div>
  );
}
