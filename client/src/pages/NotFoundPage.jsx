import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NotFoundPage = () => {
  const { isAuthenticated, user } = useAuth();

  const getHomeLink = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'company') return '/company/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">404 Error</span>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to={getHomeLink()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
