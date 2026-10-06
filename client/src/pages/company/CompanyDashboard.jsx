import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  TrendingUp,
  Percent,
  Clock,
  Plus,
  Eye,
} from 'lucide-react';
import { dashboardApi, companyApi, statisticsApi } from '../../api';
import { formatDate, getAssetUrl } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export const CompanyDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats] = useState(null);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [dashRes, compRes, statsRes] = await Promise.all([
        dashboardApi.getCompanyDashboard(),
        companyApi.getCompanyProfile().catch(() => ({ company: null })),
        statisticsApi.getCompanyStatistics().catch(() => ({ statistics: null })),
      ]);

      if (dashRes.success) setDashboard(dashRes.dashboard);
      if (compRes?.success) setCompany(compRes.company);
      if (statsRes?.success && statsRes.statistics) setStats(statsRes.statistics);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch company dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading recruiter dashboard..." className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboard} />;
  }

  const isVerified = company?.isVerified;
  const logoUrl = company?.logo?.url ? getAssetUrl(company.logo.url) : null;

  const totalApps = stats?.totalApplications ?? dashboard?.totalApplications ?? 0;
  const selectedCount = stats?.selectedCandidates ?? dashboard?.selectedCandidates ?? 0;
  const selectionRate = totalApps > 0 ? Math.round((selectedCount / totalApps) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Verification Warning Alert if unverified */}
      {!isVerified ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Pending TPO Admin Verification: </span>
            <p className="text-xs text-amber-800 leading-relaxed">
              Your company recruiter profile is pending review by the college Training & Placement Cell.
              Posting active recruitment drives is disabled until your company is verified by the administrator.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong className="font-semibold">Verified Recruiter:</strong> Your corporate organization is authorized to publish active placement drives.
            </span>
          </div>
          <Link to="/company/profile" className="font-bold text-emerald-700 hover:underline">
            View Credentials
          </Link>
        </div>
      )}

      {/* Top Banner with Company Logo */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-700/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2.5 flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={company?.companyName || 'Company'}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-10 h-10 text-indigo-400" />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-sm text-indigo-100">
              <Building2 className="w-3.5 h-3.5" />
              Recruiter Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {company?.companyName || 'Corporate Recruiter'}
            </h1>
            <p className="text-sm text-indigo-100 max-w-xl">
              Manage your placement drives, evaluate campus student applicants, and select top engineering talent.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <Link
            to="/company/jobs"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-900 bg-white hover:bg-slate-100 transition-colors shadow-sm"
          >
            <span>Manage Drives</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recruitment Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Drives</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {stats?.totalJobs ?? dashboard?.totalJobs ?? 0}
          </p>
          <span className="text-[11px] text-slate-400">Total job postings</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Drives</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">
            {stats?.activeJobs ?? dashboard?.activeJobs ?? 0}
          </p>
          <span className="text-[11px] text-slate-400">Receiving applications</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Inactive Drives</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <p className="text-2xl font-extrabold text-slate-600 mt-2">
            {stats?.inactiveJobs ?? dashboard?.inactiveJobs ?? 0}
          </p>
          <span className="text-[11px] text-slate-400">Paused or closed</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Applicants</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-purple-700 mt-2">{totalApps}</p>
          <span className="text-[11px] text-slate-400">Total submissions</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Selected</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">{selectedCount}</p>
          <span className="text-[11px] text-emerald-600/80">{selectionRate}% selection rate</span>
        </div>
      </div>

      {/* Recent Candidate Applications */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Candidate Applications</h2>
            <p className="text-xs text-slate-500">Students who recently applied to your corporate job drives</p>
          </div>
          <Link
            to="/company/jobs"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
          >
            <span>Manage All in Drives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!dashboard?.latestApplications || dashboard.latestApplications.length === 0 ? (
          <EmptyState
            title="No candidate applications yet"
            description="Student applications submitted to your active placement drives will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Job Role</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboard.latestApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {app.student?.user?.name || 'Student Candidate'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {app.student?.user?.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {app.job?.title || 'Job Position'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/company/jobs"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Evaluate</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
