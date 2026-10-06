import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Calendar,
  Bookmark,
  CheckCircle2,
  GraduationCap,
  Clock,
  AlertCircle,
  X,
  ExternalLink,
  Info,
} from 'lucide-react';
import { jobApi, applicationApi } from '../../api';
import { formatPackage, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import JobDetailsModal from '../../components/jobs/JobDetailsModal';

export const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  // Job Details Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    location: '',
    minPackage: '',
    branch: '',
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Run API calls concurrently: jobs, saved jobs, applied jobs
      let jobsPromise;
      if (searchKeyword.trim()) {
        jobsPromise = jobApi.searchJobs(searchKeyword.trim());
      } else if (filters.location || filters.minPackage || filters.branch) {
        jobsPromise = jobApi.filterJobs(filters);
      } else {
        jobsPromise = jobApi.getJobs();
      }

      const [jobsRes, savedRes, appRes] = await Promise.all([
        jobsPromise,
        jobApi.getSavedJobs().catch(() => ({ jobs: [] })),
        applicationApi.getMyApplications().catch(() => ({ applications: [] })),
      ]);

      if (jobsRes.success && Array.isArray(jobsRes.jobs)) {
        setJobs(jobsRes.jobs);
      }

      if (savedRes?.success && Array.isArray(savedRes.jobs)) {
        const ids = new Set(savedRes.jobs.map((j) => (typeof j === 'string' ? j : j._id)));
        setSavedJobIds(ids);
      }

      if (appRes?.success && Array.isArray(appRes.applications)) {
        const appliedIds = new Set(
          appRes.applications.map((app) => (typeof app.job === 'string' ? app.job : app.job?._id))
        );
        setAppliedJobIds(appliedIds);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleApply = async (jobId) => {
    try {
      setIsApplying(true);
      setActionMessage({ text: '', type: '' });
      const res = await applicationApi.applyJob(jobId);
      if (res.success) {
        // Prevent duplicate application UI: immediately update local set
        setAppliedJobIds((prev) => new Set([...prev, jobId]));
        setActionMessage({
          text: 'Application submitted successfully! Track your status in My Applications.',
          type: 'success',
        });
      }
    } catch (err) {
      setActionMessage({
        text: err.response?.data?.message || 'Failed to submit application',
        type: 'error',
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleToggleSave = async (jobId) => {
    const isSaved = savedJobIds.has(jobId);
    try {
      if (isSaved) {
        await jobApi.removeSavedJob(jobId);
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await jobApi.saveJob(jobId);
        setSavedJobIds((prev) => new Set([...prev, jobId]));
      }
    } catch (err) {
      console.error('Error toggling saved job:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Explore Jobs</h1>
          <p className="text-sm text-slate-500">
            Browse and apply to active campus placement and recruitment opportunities
          </p>
        </div>
      </div>

      {actionMessage.text && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center justify-between border animate-in fade-in duration-200 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage({ text: '', type: '' })}
            className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title (e.g. Software Engineer)..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-20 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs w-28 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="Min LPA"
            value={filters.minPackage}
            onChange={(e) => setFilters((prev) => ({ ...prev, minPackage: e.target.value }))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs w-24 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Branch (e.g. CSE)"
            value={filters.branch}
            onChange={(e) => setFilters((prev) => ({ ...prev, branch: e.target.value }))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs w-32 focus:outline-none focus:border-indigo-500"
          />
          {(filters.location || filters.minPackage || filters.branch || searchKeyword) && (
            <button
              type="button"
              onClick={() => {
                setFilters({ location: '', minPackage: '', branch: '' });
                setSearchKeyword('');
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <LoadingSpinner message="Searching placement drives..." className="py-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs matching your criteria"
          description="Try broadening your search term or clearing the active filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => {
            const isSaved = savedJobIds.has(job._id);
            const isApplied = appliedJobIds.has(job._id);
            const isDeadlinePassed = new Date() > new Date(job.lastDate);
            const isInactive = job.isActive === false;

            return (
              <div
                key={job._id}
                className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between hover:shadow-md transition-all ${
                  isInactive || isDeadlinePassed ? 'border-slate-200/80 bg-slate-50/40' : 'border-slate-100'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header: Company, Title, Badges, Bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                          {job.company?.companyName || 'Corporate Partner'}
                        </span>
                        {/* Status badges */}
                        {isInactive ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            Inactive
                          </span>
                        ) : isDeadlinePassed ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            Expired
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            Active
                          </span>
                        )}
                        {isApplied && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Applied
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {job.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSave(job._id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isSaved
                          ? 'bg-amber-50 text-amber-600'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save job'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Job Metadata Grid: Package, Location, Min CGPA, Batch, Last Date */}
                  <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="font-bold text-emerald-600 text-sm">
                        {formatPackage(job.package)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-50">
                      <div>
                        <span className="text-slate-400 block">Min CGPA:</span>
                        <span className="font-semibold text-slate-700">
                          {job.minimumCGPA ? `${job.minimumCGPA} CGPA` : 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Eligible Batch:</span>
                        <span className="font-semibold text-slate-700">{job.batch} Passout</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        Deadline: {formatDate(job.lastDate)}
                      </span>
                    </div>
                  </div>

                  {/* Skills preview */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-semibold self-center">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Eligible Branches preview */}
                  {job.eligibleBranches && job.eligibleBranches.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <span className="text-slate-400">Branches:</span>
                      <span className="font-medium text-slate-700 truncate">
                        {job.eligibleBranches.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Buttons: View Details & Apply */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  {/* Prevent duplicate application UI / Check inactive or expired */}
                  {isApplied ? (
                    <div className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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

      {/* View Job Details Modal */}
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

export default StudentJobs;
