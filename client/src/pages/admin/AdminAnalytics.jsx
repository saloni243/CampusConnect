import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  FileText,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Award,
} from 'lucide-react';
import { adminApi, statisticsApi } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';

const StatCard = ({ icon: Icon, label, value, sub, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value ?? 0}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export const AdminAnalytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [overall, setOverall] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [dashRes, overallRes, monthlyRes] = await Promise.all([
        adminApi.getDashboard(),
        statisticsApi.getOverallStatistics().catch(() => ({ statistics: null })),
        statisticsApi.getMonthlyAnalytics().catch(() => ({ analytics: [] })),
      ]);

      if (dashRes.success) setDashboard(dashRes.dashboard);
      if (overallRes?.success && overallRes.statistics) setOverall(overallRes.statistics);
      if (monthlyRes?.success && Array.isArray(monthlyRes.analytics)) setMonthly(monthlyRes.analytics);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <LoadingSpinner message="Loading placement analytics..." className="py-20" />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const stats = overall || dashboard;
  const totalApps = stats?.totalApplications ?? 0;
  const selected = dashboard?.selectedStudents ?? 0;
  const selectionRate = totalApps > 0 ? Math.round((selected / totalApps) * 100) : 0;
  const verificationRate =
    (stats?.totalCompanies ?? 0) > 0
      ? Math.round(
          (((stats?.totalCompanies ?? 0) - (dashboard?.pendingCompanies ?? 0)) /
            (stats?.totalCompanies ?? 1)) *
            100
        )
      : 0;

  const maxApps = monthly.length > 0 ? Math.max(...monthly.map((m) => m.applications), 1) : 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/10 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">
            Reports &amp; Analytics
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Placement Analytics Dashboard
        </h1>
        <p className="text-sm text-indigo-100 mt-1 max-w-xl">
          Comprehensive statistics on student placements, company recruitments, and drive performance.
        </p>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          Key Performance Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Students" value={stats?.totalStudents} color="purple" />
          <StatCard icon={Building2} label="Total Companies" value={stats?.totalCompanies} color="blue" sub={`${dashboard?.pendingCompanies ?? 0} pending verification`} />
          <StatCard icon={Briefcase} label="Total Drives" value={stats?.totalJobs} color="indigo" sub={`${stats?.activeJobs ?? dashboard?.activeJobs ?? 0} currently active`} />
          <StatCard icon={FileText} label="Total Applications" value={totalApps} color="amber" />
          <StatCard icon={CheckCircle} label="Students Selected" value={selected} color="emerald" sub={`${selectionRate}% selection rate`} />
          <StatCard icon={Activity} label="Active Drives" value={stats?.activeJobs ?? dashboard?.activeJobs} color="indigo" />
          <StatCard icon={Building2} label="Pending Verifications" value={dashboard?.pendingCompanies} color="amber" />
          <StatCard icon={Award} label="Company Verification Rate" value={`${verificationRate}%`} color="emerald" />
        </div>
      </div>

      {/* Monthly Application Trend */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Monthly Application Trend</h2>
        </div>

        {monthly.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">No application data available yet.</div>
        ) : (
          <div className="space-y-3">
            {monthly.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-8 text-xs font-bold text-slate-500 text-right flex-shrink-0">
                  {item.month}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-7 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                    style={{ width: `${Math.round((item.applications / maxApps) * 100)}%` }}
                  >
                    <span className="text-white text-[10px] font-bold">{item.applications}</span>
                  </div>
                </div>
                <span className="w-8 text-xs font-bold text-indigo-600 flex-shrink-0">
                  {item.applications}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Status Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Company Verification Status</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-sm text-slate-700">Verified Companies</span>
              </div>
              <span className="font-bold text-emerald-700">
                {(stats?.totalCompanies ?? 0) - (dashboard?.pendingCompanies ?? 0)}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all"
                style={{ width: `${verificationRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-sm text-slate-700">Pending Verification</span>
              </div>
              <span className="font-bold text-amber-700">{dashboard?.pendingCompanies ?? 0}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className="bg-amber-400 h-3 rounded-full transition-all"
                style={{ width: `${100 - verificationRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Placement Success Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Placement Success Overview</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Applications Received</span>
              <span className="font-bold text-slate-800">{totalApps}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Students Selected</span>
              <span className="font-bold text-emerald-700">{selected}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Overall Selection Rate</span>
              <span className="font-bold text-indigo-700">{selectionRate}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 mt-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-4 rounded-full transition-all"
                style={{ width: `${selectionRate}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 text-center">
              {selectionRate >= 50
                ? '🎉 Excellent placement performance!'
                : selectionRate >= 25
                ? '📈 Good progress — keep driving placements.'
                : '📋 More drives needed to improve placement rate.'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Students placed */}
      {dashboard?.recentStudents?.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Recently Enrolled Students
          </h2>
          <div className="divide-y divide-slate-100">
            {dashboard.recentStudents.map((st) => (
              <div key={st._id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-slate-800">{st.user?.name || 'Student'}</div>
                  <div className="text-xs text-slate-400">{st.user?.email}</div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.profileCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {st.profileCompletion || 0}% complete
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
