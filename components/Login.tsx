import React, { useState } from 'react';
import { ArrowLeft, User, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { loginUser, changePassword, ApiError } from '../services/api';

interface LoginProps {
  onLogin: (role: 'admin' | 'partner') => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Change State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempUser, setTempUser] = useState<any>(null);
  const [changeSuccess, setChangeSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please enter both username/email and password.');
      setLoading(false);
      return;
    }

    try {
      // API Login
      const response = await loginUser({ email, password });

      // Check if password change is required
      if (response.user?.requiresPasswordChange) {
        setTempUser({ ...response.user, currentPassword: password, token: response.token });
        setShowPasswordChange(true);
        setLoading(false);
        return;
      }

      // Determine role from response or default to partner
      const role = (response.user?.role as 'admin' | 'partner') || 'partner';

      // Save session
      localStorage.setItem('token', response.token || '');
      localStorage.setItem('user', JSON.stringify(response.user));

      onLogin(role);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (newPassword === tempUser.currentPassword) {
      setError('New password must be different from the temporary password.');
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        userId: tempUser.id,
        currentPassword: tempUser.currentPassword,
        newPassword: newPassword
      });

      setChangeSuccess(true);

      // Short delay for visual feedback then login automatically
      setTimeout(() => {
        // Save session
        localStorage.setItem('token', tempUser.token || '');
        const updatedUser = { ...tempUser };
        delete updatedUser.currentPassword;
        delete updatedUser.token;
        updatedUser.requiresPasswordChange = false;
        localStorage.setItem('user', JSON.stringify(updatedUser));

        onLogin((updatedUser.role as any) || 'partner');
      }, 1500);

    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (showPasswordChange) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:32px_32px] opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md bg-[#171717]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl scale-in-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                <Lock className="text-orange-500" size={32} />
              </div>
            </div>

            <h2 className="text-2xl font-display font-bold text-white text-center mb-2">Security Update</h2>
            <p className="text-slate-400 text-center mb-8 text-sm leading-relaxed">
              Welcome, <span className="text-white font-bold">{tempUser?.firstName || 'User'}</span>! For security purposes, please set a new password for your account before proceeding.
            </p>

            {changeSuccess ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center animate-pulse">
                <CheckCircle2 className="text-green-500 mx-auto mb-3" size={40} />
                <p className="text-green-400 font-bold">Password Updated!</p>
                <p className="text-green-500/60 text-xs mt-1">Redirecting to dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">New Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                      placeholder="••••••••"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-red-400 text-sm bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Secure My Account'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="p-6 text-center text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
          &copy; 2024 NetVoya Enterprise Encryption Suite
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:32px_32px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          disabled={loading}
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-[#171717]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-8">
            <img
              src="https://res.cloudinary.com/drzid08rg/image/upload/d91fcd24-8cf6-4adf-b9df-7312622185a8_ihpxqo.png"
              alt="NetVoya"
              className="h-16 w-auto object-contain"
            />
          </div>

          <h2 className="text-2xl font-display font-bold text-white text-center mb-2">Welcome Back</h2>
          <p className="text-slate-500 text-center mb-8 text-sm">Sign in to manage your eSIM inventory.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-slate-500">Username or Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                  placeholder="Username or email"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-slate-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account? <span className="text-orange-500 cursor-pointer hover:underline" onClick={onBack}>Register</span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 text-center text-xs text-slate-600 font-mono text-center">
        &copy; 2024 NetVoya Enterprise. Secured by 256-bit encryption.
      </div>
    </div>
  );
};

export default Login;
