import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { adminApi, statisticsApi } from '../../api';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';

export const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [dashRes, monthlyRes] = await Promise.all([
        adminApi.getDashboard(),
        statisticsApi.getMonthlyAnalytics().catch(() => ({ analytics: [] })),
      ]);

      if (dashRes.success) setDashboard(dashRes.dashboard);
      if (monthlyRes?.success && Array.isArray(monthlyRes.analytics)) {
        setMonthlyAnalytics(monthlyRes.analytics);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch admin dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading placement cell overview..." className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAdminData} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-purple-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-sm text-purple-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            TPO Placement Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Placement Command Center
          </h1>
          <p className="text-sm text-purple-100 max-w-xl">
            Monitor college-wide placement drives, verify corporate recruiters, audit candidate applications, and publish campus announcements.
          </p>
        </div>

        <Link
          to="/admin/companies"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-purple-950 bg-white hover:bg-slate-100 transition-colors shadow-sm self-start md:self-auto"
        >
          <span>Verify Companies</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Enrolled Students</p>
            <p className="text-2xl font-bold text-slate-800">{dashboard?.totalStudents ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Recruiters</p>
            <p className="text-2xl font-bold text-slate-800">{dashboard?.totalCompanies ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Companies</p>
            <p className="text-2xl font-bold text-amber-600">{dashboard?.pendingCompanies ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Drives</p>
            <p className="text-2xl font-bold text-slate-800">{dashboard?.totalJobs ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Drives</p>
            <p className="text-2xl font-bold text-indigo-600">{dashboard?.activeJobs ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-bold text-slate-800">{dashboard?.totalApplications ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 lg:col-span-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Students Selected</p>
            <p className="text-2xl font-bold text-emerald-700">{dashboard?.selectedStudents ?? 0}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {dashboard?.totalApplications > 0
                ? `${Math.round((dashboard.selectedStudents / dashboard.totalApplications) * 100)}% selection rate`
                : 'No applications yet'}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Analytics Visualizer */}
      {monthlyAnalytics.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Monthly Placement Application Trends
              </h2>
              <p className="text-xs text-slate-500">Distribution of candidate applications across academic cycles</p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 pt-2">
            {monthlyAnalytics.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100 space-y-1"
              >
                <div className="text-[11px] font-bold text-slate-400 uppercase">{item.month}</div>
                <div className="text-base font-extrabold text-indigo-600">{item.applications}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity: Companies & Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Companies */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Recruiters</h2>
            <Link to="/admin/companies" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {dashboard?.recentCompanies?.map((comp) => (
              <div key={comp._id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs sm:text-sm text-slate-800">
                    {comp.companyName}
                  </div>
                  <div className="text-xs text-slate-400">{comp.industry || comp.location || 'Company'}</div>
                </div>
                <div>
                  {comp.isVerified ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Placement Jobs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Placement Drives</h2>
            <Link to="/admin/jobs" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {dashboard?.recentJobs?.map((job) => (
              <div key={job._id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs sm:text-sm text-slate-800">{job.title}</div>
                  <div className="text-xs text-slate-400">{job.company?.companyName || 'Company'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-600">₹{job.package} LPA</div>
                  <div className="text-[10px] text-slate-400">{formatDate(job.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
