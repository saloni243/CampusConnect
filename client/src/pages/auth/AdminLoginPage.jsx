import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // If already logged in as admin, redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Non-admin tried to access admin login — send them to their own dashboard
        if (user.role === 'student') navigate('/student/dashboard', { replace: true });
        else if (user.role === 'company') navigate('/company/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login(formData);
      const role = res.user?.role;

      if (role !== 'admin') {
        // Reject non-admin users who attempt admin login
        setError('Access denied. This login portal is restricted to TPO/Admin accounts only.');
        // Sign them out using the proper AuthContext method
        logout();
        return;
      }

      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Invalid credentials. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/40">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            TPO / Admin Portal
          </h2>
          <p className="mt-2 text-sm text-purple-300">
            Restricted access — Training &amp; Placement Office only
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Security badge */}
          <div className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900/40 border border-purple-700/40 text-xs text-purple-300">
            <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>
              This portal is for <strong className="text-purple-200">college TPO &amp; administrators</strong> only.
              Students and companies must use the{' '}
              <a href="/login" className="text-purple-300 underline hover:text-white">
                main login
              </a>.
            </span>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. tpo@college.edu"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all placeholder:text-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all placeholder:text-white/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 transition-all shadow-md shadow-purple-600/30"
            >
              {isLoading ? (
                'Authenticating...'
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-purple-500">
          Not an admin?{' '}
          <a href="/login" className="text-purple-400 hover:text-purple-300 underline transition-colors">
            Go to main login
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
