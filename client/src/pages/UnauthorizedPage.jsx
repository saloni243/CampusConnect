import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboard } from '../utils/authUtils';

export const UnauthorizedPage = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    return getRoleDashboard(user?.role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Access Restricted</h1>
        <p className="mt-2 text-sm text-slate-500">
          You do not have permission to view this section with your current{' '}
          <span className="font-semibold text-slate-700 capitalize">
            {user?.role || 'guest'}
          </span>{' '}
          account role.
        </p>

        <div className="mt-6">
          <Link
            to={getDashboardLink()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
