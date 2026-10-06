import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Trash2,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  X,
} from 'lucide-react';
import { applicationApi, jobApi } from '../../api';
import { formatPackage, formatDate } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import JobDetailsModal from '../../components/jobs/JobDetailsModal';

export const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionAlert, setActionAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cancel dialog state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Job Details Modal
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await applicationApi.getMyApplications();
      if (res.success && Array.isArray(res.applications)) {
        setApplications(res.applications);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      setIsCancelling(true);
      setActionAlert(null);
      const jobId = cancelTarget.job?._id || cancelTarget.job;
      const res = await applicationApi.cancelApplication(jobId);
      if (res.success) {
        setApplications((prev) => prev.filter((app) => (app.job?._id || app.job) !== jobId));
        setActionAlert({
          text: 'Application cancelled successfully.',
          type: 'success',
        });
      }
    } catch (err) {
      setActionAlert({
        text: err.response?.data?.message || 'Failed to cancel application',
        type: 'error',
      });
    } finally {
      setIsCancelling(false);
      setCancelTarget(null);
    }
  };

  const handleOpenJobDetails = async (job) => {
    if (!job) return;
    try {
      // If full job object with skills/branches already loaded:
      if (job.skills && job.eligibleBranches) {
        setSelectedJob(job);
      } else {
        const jobId = typeof job === 'string' ? job : job._id;
        const res = await jobApi.getJobById(jobId);
        if (res.success && res.job) {
          setSelectedJob(res.job);
        } else {
          setSelectedJob(job);
        }
      }
    } catch {
      setSelectedJob(job);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Fetching your submitted applications..." className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchApplications} />;
  }

  const statuses = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  const filteredApplications = applications.filter((app) => {
    const matchesTab = activeTab === 'All' || app.status === activeTab;
    const title = app.job?.title?.toLowerCase() || '';
    const company = app.company?.companyName?.toLowerCase() || '';
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || title.includes(query) || company.includes(query);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Applications</h1>
          <p className="text-sm text-slate-500">
            Track and monitor the status of all your recruitment drives in real-time
          </p>
        </div>

        {applications.length > 0 && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 self-start sm:self-auto">
            {applications.length} Total {applications.length === 1 ? 'Application' : 'Applications'}
          </div>
        )}
      </div>

      {actionAlert && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center justify-between border animate-in fade-in duration-200 ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionAlert.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{actionAlert.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionAlert(null)}
            className="text-xs font-bold uppercase text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {statuses.map((status) => {
            const count =
              status === 'All'
                ? applications.length
                : applications.filter((a) => a.status === status).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setActiveTab(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === status ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by role title or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications submitted yet"
          description="Browse available job openings from the Explore Jobs page and start applying."
        />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title="No matching applications"
          description="No applications found for the selected status or search query."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-xs uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="py-4 px-6">Job Role</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Package</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => {
                  const jobId = app.job?._id || app.job;
                  const canCancel = app.status === 'Applied';

                  return (
                    <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {app.job?.title || 'Job Position'}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-700">
                        {app.company?.companyName || 'Company'}
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {app.job?.location || 'Campus / Office'}
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-600">
                        {formatPackage(app.job?.package)}
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {formatDate(app.appliedAt || app.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <Badge status={app.status} />
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {app.job && (
                          <button
                            type="button"
                            onClick={() => handleOpenJobDetails(app.job)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                            title="View Job Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        )}

                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(app)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                            title="Cancel Application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Cancel Application</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to withdraw your application for{' '}
                <span className="font-semibold text-slate-700">
                  {cancelTarget.job?.title || 'this position'}
                </span>{' '}
                at{' '}
                <span className="font-semibold text-slate-700">
                  {cancelTarget.company?.companyName || 'the company'}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Keep Application
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-sm"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onApply={() => {}}
        isApplied={true}
        isApplying={false}
      />
    </div>
  );
};

export default StudentApplications;
