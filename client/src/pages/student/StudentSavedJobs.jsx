import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  MapPin,
  Building2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { jobApi, applicationApi } from '../../api';
import { formatPackage, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import JobDetailsModal from '../../components/jobs/JobDetailsModal';

export const StudentSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [savedRes, appRes] = await Promise.all([
        jobApi.getSavedJobs(),
        applicationApi.getMyApplications().catch(() => ({ applications: [] })),
      ]);

      if (savedRes.success && Array.isArray(savedRes.jobs)) {
        setSavedJobs(savedRes.jobs);
      }

      if (appRes?.success && Array.isArray(appRes.applications)) {
        const ids = new Set(
          appRes.applications.map((app) => (typeof app.job === 'string' ? app.job : app.job?._id))
        );
        setAppliedJobIds(ids);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch saved jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      await jobApi.removeSavedJob(jobId);
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
      setMessage({ text: 'Job removed from saved wishlist', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to remove saved job', type: 'error' });
    }
  };

  const handleApply = async (jobId) => {
    try {
      setIsApplying(true);
      const res = await applicationApi.applyJob(jobId);
      if (res.success) {
        setAppliedJobIds((prev) => new Set([...prev, jobId]));
        setMessage({
          text: 'Application submitted successfully! You can track it in My Applications.',
          type: 'success',
        });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to submit application',
        type: 'error',
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Fetching your saved jobs..." className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Saved Jobs</h1>
          <p className="text-sm text-slate-500">Your bookmarked placement drives and opportunities</p>
        </div>

        {savedJobs.length > 0 && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 self-start sm:self-auto">
            {savedJobs.length} Saved {savedJobs.length === 1 ? 'Job' : 'Jobs'}
          </div>
        )}
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center justify-between border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage({ text: '', type: '' })}
            className="text-xs font-bold uppercase text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs"
          description="Bookmark interesting job drives from the Explore Jobs page to review and apply later."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedJobs.map((job) => {
            const isApplied = appliedJobIds.has(job._id);
            const isDeadlinePassed = new Date() > new Date(job.lastDate);
            const isInactive = job.isActive === false;

            return (
              <div
                key={job._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        {job.company?.companyName || 'Corporate Partner'}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{job.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(job._id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="font-bold text-emerald-600">
                        {formatPackage(job.package)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Batch {job.batch}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        Deadline: {formatDate(job.lastDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  {isApplied ? (
                    <div className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Applied</span>
                    </div>
                  ) : isInactive ? (
                    <div className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 text-center cursor-not-allowed">
                      Job Inactive
                    </div>
                  ) : isDeadlinePassed ? (
                    <div className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 text-center cursor-not-allowed">
                      Deadline Passed
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isApplying}
                      onClick={() => handleApply(job._id)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
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

export default StudentSavedJobs;
