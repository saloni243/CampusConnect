import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  FileCheck,
  Bookmark,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertCircle,
  Percent,
  CheckCheck,
  Hourglass,
  XCircle,
} from 'lucide-react';
import { dashboardApi, statisticsApi, applicationApi, jobApi } from '../../api';
import { formatPackage, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import JobDetailsModal from '../../components/jobs/JobDetailsModal';

export const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Job Details Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [dashRes, statsRes, appRes] = await Promise.all([
        dashboardApi.getStudentDashboard(),
        statisticsApi.getStudentStatistics().catch(() => ({ statistics: null })),
        applicationApi.getMyApplications().catch(() => ({ applications: [] })),
      ]);

      if (dashRes.success) {
        setDashboard(dashRes.dashboard);
      }
      if (statsRes?.success && statsRes.statistics) {
        setStats(statsRes.statistics);
      }
      if (appRes?.success && Array.isArray(appRes.applications)) {
        const ids = new Set(
          appRes.applications.map((app) => (typeof app.job === 'string' ? app.job : app.job?._id))
        );
        setAppliedJobIds(ids);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to fetch student dashboard data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApply = async (jobId) => {
    try {
      setIsApplying(true);
      setActionAlert(null);
      const res = await applicationApi.applyJob(jobId);
      if (res.success) {
        setAppliedJobIds((prev) => new Set([...prev, jobId]));
        setActionAlert({ text: 'Application submitted successfully!', type: 'success' });
        // Refresh dashboard counters
        fetchDashboardData();
      }
    } catch (err) {
      setActionAlert({
        text: err.response?.data?.message || 'Failed to submit application',
        type: 'error',
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading placement dashboard..." className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-700/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-sm text-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            Campus Placement Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to CampusConnect
          </h1>
          <p className="text-sm text-indigo-100 max-w-xl">
            Track active drives, submit job applications, and accelerate your engineering & technology career.
          </p>
        </div>

        {/* Profile Completion Widget */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[240px] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Profile Completion</span>
            <span>{dashboard?.profileCompletion || 0}%</span>
          </div>
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${dashboard?.profileCompletion || 0}%` }}
            />
          </div>
          <Link
            to="/student/profile"
            className="text-[11px] inline-flex items-center gap-1 text-indigo-200 hover:text-white transition-colors"
          >
            <span>Update academic records & resume</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {actionAlert && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center justify-between border ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{actionAlert.text}</span>
          <button
            type="button"
            onClick={() => setActionAlert(null)}
            className="text-xs font-bold uppercase text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Placement Statistics Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Student Placement Statistics
            </h2>
            <p className="text-xs text-slate-500">Real-time breakdown of your placement progress & offer stats</p>
          </div>
          {stats?.placementPercentage !== undefined && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold">
              <span>Placement Rate:</span>
              <span className="text-sm font-extrabold">{stats.placementPercentage}%</span>
            </div>
          )}
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Applied</span>
              <FileCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">
              {stats?.totalApplications ?? dashboard?.appliedJobs ?? 0}
            </p>
            <span className="text-[11px] text-slate-400">Applications submitted</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700">Selected / Offers</span>
              <CheckCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-700 mt-2">
              {stats?.selected ?? 0}
            </p>
            <span className="text-[11px] text-emerald-600/80">Placement offers received</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700">Shortlisted</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-purple-700 mt-2">
              {stats?.shortlisted ?? 0}
            </p>
            <span className="text-[11px] text-purple-600/80">Shortlisted drives</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700">Under Review</span>
              <Hourglass className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-amber-700 mt-2">
              {stats?.underReview ?? 0}
            </p>
            <span className="text-[11px] text-amber-600/80">In recruiter pipeline</span>
          </div>
        </div>

        {/* Compensation Highlights if offered */}
        {Boolean(stats?.highestPackage || stats?.averagePackage) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Highest Package Secured
                </span>
                <p className="text-2xl font-black text-emerald-800 mt-1">
                  {stats.highestPackage} LPA
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                Max
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Average Package
                </span>
                <p className="text-2xl font-black text-indigo-800 mt-1">
                  {stats.averagePackage} LPA
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                Avg
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Directory Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/student/jobs"
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:border-indigo-200 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Available Jobs</p>
            <p className="text-2xl font-bold text-slate-800">{dashboard?.availableJobs ?? 0}</p>
          </div>
        </Link>

        <Link
          to="/student/applications"
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:border-indigo-200 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Applied Jobs</p>
            <p className="text-2xl font-bold text-slate-800">{dashboard?.appliedJobs ?? 0}</p>
          </div>
        </Link>

        <Link
          to="/student/saved-jobs"
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:border-indigo-200 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Saved Wishlist</p>
            <p className="text-2xl font-bold text-slate-800">{dashboard?.savedJobs ?? 0}</p>
          </div>
        </Link>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Companies</p>
            <p className="text-2xl font-bold text-slate-800">{dashboard?.companies ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Recently Posted Jobs Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Recently Posted Jobs</h2>
            <p className="text-xs text-slate-500">Active recruitment opportunities matching campus guidelines</p>
          </div>
          <Link
            to="/student/jobs"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!dashboard?.latestJobs || dashboard.latestJobs.length === 0 ? (
          <EmptyState
            title="No jobs posted yet"
            description="Active recruitment drives will appear here once corporate partners post."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {dashboard.latestJobs.map((job) => {
              const isApplied = appliedJobIds.has(job._id);
              const isDeadlinePassed = new Date() > new Date(job.lastDate);

              return (
                <div
                  key={job._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 rounded-2xl px-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-800">
                        {job.title}
                      </h3>
                      {isApplied && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Applied
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {job.company?.companyName || 'Corporate Partner'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="font-semibold text-emerald-600">
                        {formatPackage(job.package)}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3" />
                        Deadline: {formatDate(job.lastDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Details
                    </button>

                    {isApplied ? (
                      <div className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Applied
                      </div>
                    ) : isDeadlinePassed ? (
                      <div className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 cursor-not-allowed">
                        Closed
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApply(job._id)}
                        disabled={isApplying}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors shadow-sm"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onApply={(id) => {
          handleApply(id);
          setSelectedJob(null);
        }}
        isApplied={selectedJob ? appliedJobIds.has(selectedJob._id) : false}
        isApplying={isApplying}
      />
    </div>
  );
};

export default StudentDashboard;
