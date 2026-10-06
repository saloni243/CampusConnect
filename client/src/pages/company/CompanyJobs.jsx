import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  Calendar,
  MapPin,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  Search,
  Check,
  Filter,
} from 'lucide-react';
import { jobApi, applicationApi, companyApi } from '../../api';
import { formatPackage, formatDate, getAssetUrl } from '../../utils/formatters';
import { APPLICATION_STATUS } from '../../utils/constants';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import JobDetailsModal from '../../components/jobs/JobDetailsModal';
import ConfirmModal from '../../components/common/ConfirmModal';

export const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewDetailsJob, setViewDetailsJob] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Applicants drawer / modal
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantFilterStatus, setApplicantFilterStatus] = useState('All');
  const [applicantSearch, setApplicantSearch] = useState('');

  // New job form state
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    package: '',
    skills: '',
    eligibleBranches: '',
    minimumCGPA: 0,
    batch: new Date().getFullYear(),
    lastDate: '',
  });

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
  };

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [jobsRes, compRes] = await Promise.all([
        jobApi.getCompanyJobs(),
        companyApi.getCompanyProfile().catch(() => ({ company: null })),
      ]);

      if (jobsRes.success && Array.isArray(jobsRes.jobs)) {
        setJobs(jobsRes.jobs);
      }
      if (compRes?.success) {
        setCompany(compRes.company);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch company jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!company?.isVerified) {
      showFeedback('Company must be verified by TPO administrator to post jobs.', 'error');
      return;
    }

    try {
      setIsSubmittingJob(true);
      const payload = {
        ...newJob,
        package: Number(newJob.package),
        minimumCGPA: Number(newJob.minimumCGPA) || 0,
        batch: Number(newJob.batch),
        skills: newJob.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        eligibleBranches: newJob.eligibleBranches
          .split(',')
          .map((b) => b.trim())
          .filter(Boolean),
      };

      const res = await jobApi.createJob(payload);
      if (res.success) {
        setShowCreateModal(false);
        setNewJob({
          title: '',
          description: '',
          location: '',
          jobType: 'Full-time',
          package: '',
          skills: '',
          eligibleBranches: '',
          minimumCGPA: 0,
          batch: new Date().getFullYear(),
          lastDate: '',
        });
        showFeedback('Job drive published successfully!', 'success');
        fetchJobs();
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to create job drive', 'error');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleToggleJobStatus = async (job) => {
    try {
      const nextStatus = !job.isActive;
      const res = await jobApi.updateJob(job._id, { isActive: nextStatus });
      if (res.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === job._id ? { ...j, isActive: nextStatus } : j))
        );
        showFeedback(`Job drive is now ${nextStatus ? 'Active' : 'Inactive'}`, 'success');
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to update job status', 'error');
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      await jobApi.deleteJob(deleteTargetId);
      setJobs((prev) => prev.filter((j) => j._id !== deleteTargetId));
      showFeedback('Job drive deleted successfully', 'success');
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to delete job', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const handleOpenApplicants = async (job) => {
    setSelectedJobForApplicants(job);
    setLoadingApplicants(true);
    setApplicantFilterStatus('All');
    setApplicantSearch('');
    try {
      const res = await applicationApi.getApplicants(job._id);
      if (res.success && Array.isArray(res.applications)) {
        setApplicants(res.applications);
      }
    } catch (err) {
      console.error('Failed to fetch applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await applicationApi.updateApplicationStatus(appId, newStatus);
      if (res.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
        showFeedback(`Applicant status updated to "${newStatus}" and notified!`, 'success');
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your recruitment drives..." className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchJobs} />;
  }

  const isVerified = company?.isVerified;

  // Filtered applicants
  const filteredApplicants = applicants.filter((app) => {
    const matchesStatus =
      applicantFilterStatus === 'All' || app.status === applicantFilterStatus;
    const name = app.student?.user?.name?.toLowerCase() || '';
    const email = app.student?.user?.email?.toLowerCase() || '';
    const branch = app.student?.branch?.toLowerCase() || '';
    const q = applicantSearch.toLowerCase().trim();
    const matchesSearch = !q || name.includes(q) || email.includes(q) || branch.includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Job Postings</h1>
          <p className="text-sm text-slate-500">
            Create, publish, activate/deactivate, and evaluate student applicants
          </p>
        </div>

        <button
          type="button"
          disabled={!isVerified}
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20 self-start sm:self-auto"
          title={!isVerified ? 'TPO Admin verification required to publish jobs' : 'Post Job Drive'}
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job Drive</span>
        </button>
      </div>

      {/* Verification warning if unverified */}
      {!isVerified && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Posting Disabled: </span>
            Your corporate account is awaiting approval from the college Placement Officer. Once verified, you can immediately post drives and receive applications.
          </div>
        </div>
      )}

      {feedback.text && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center justify-between border animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ text: '', type: '' })}
            className="text-xs font-bold uppercase text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Jobs Directory Grid */}
      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No recruitment drives posted yet"
          description={
            isVerified
              ? 'Click "Post New Job Drive" to launch your campus placement process.'
              : 'You will be able to publish drives once your recruiter profile is approved.'
          }
          actionLabel={isVerified ? 'Post Job Drive' : undefined}
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => {
            const isDeadlinePassed = new Date() > new Date(job.lastDate);

            return (
              <div
                key={job._id}
                className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between hover:shadow-md transition-all ${
                  !job.isActive ? 'border-slate-200 bg-slate-50/50' : 'border-slate-100'
                }`}
              >
                <div className="space-y-4">
                  {/* Header: Title, Active toggle, Delete */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            job.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {isDeadlinePassed && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Expired
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
                        {job.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Activate / Deactivate Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleJobStatus(job)}
                        className={`p-1.5 rounded-xl transition-colors ${
                          job.isActive
                            ? 'text-emerald-600 hover:bg-emerald-50'
                            : 'text-slate-400 hover:bg-slate-200'
                        }`}
                        title={job.isActive ? 'Deactivate Job' : 'Activate Job'}
                      >
                        {job.isActive ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(job._id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

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

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-400 block">Min CGPA:</span>
                        <span className="font-semibold text-slate-700">
                          {job.minimumCGPA ? `${job.minimumCGPA} CGPA` : 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Target Batch:</span>
                        <span className="font-semibold text-slate-700">{job.batch} Passout</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-50">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        Deadline: {formatDate(job.lastDate)}
                      </span>
                    </div>
                  </div>

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
                </div>

                {/* Footer Buttons: View Details & View Applicants */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewDetailsJob(job)}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Specs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenApplicants(job)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>View Applicants</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Job */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Post New Campus Drive</h2>
                <p className="text-xs text-slate-500">
                  Publish a new placement recruitment opening for students
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Job Position Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graduate Software Engineer (Frontend / Backend)"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Role Description & Expectations *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain role responsibilities, tech stack, and evaluation process..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Work Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune / Bangalore / Hybrid"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Annual Package (LPA) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    placeholder="e.g. 8.5"
                    value={newJob.package}
                    onChange={(e) => setNewJob({ ...newJob, package: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Target Batch Year *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2026"
                    value={newJob.batch}
                    onChange={(e) => setNewJob({ ...newJob, batch: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={newJob.lastDate}
                    onChange={(e) => setNewJob({ ...newJob, lastDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Minimum CGPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="e.g. 7.0"
                    value={newJob.minimumCGPA}
                    onChange={(e) => setNewJob({ ...newJob, minimumCGPA: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Eligible Branches (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="CSE, IT, ECE"
                    value={newJob.eligibleBranches}
                    onChange={(e) => setNewJob({ ...newJob, eligibleBranches: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Required Technical Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Java, Python, React, SQL, Git"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingJob}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isSubmittingJob ? 'Publishing...' : 'Publish Job Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Job Details / Specs */}
      <JobDetailsModal
        job={viewDetailsJob}
        isOpen={Boolean(viewDetailsJob)}
        onClose={() => setViewDetailsJob(null)}
        onApply={() => {}}
        isApplied={false}
      />

      {/* Modal / Drawer: Applicants Review */}
      {selectedJobForApplicants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Candidate Evaluation
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {applicants.length} Total {applicants.length === 1 ? 'Applicant' : 'Applicants'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Applicants for {selectedJobForApplicants.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobForApplicants(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and Search Bar for Applicants */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                {['All', ...Object.values(APPLICATION_STATUS)].map((status) => {
                  const count =
                    status === 'All'
                      ? applicants.length
                      : applicants.filter((a) => a.status === status).length;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setApplicantFilterStatus(status)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        applicantFilterStatus === status
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{status}</span>
                      <span className="text-[10px] font-bold opacity-80">({count})</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate name or email..."
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {loadingApplicants ? (
              <LoadingSpinner message="Fetching applicants list..." className="py-16" />
            ) : filteredApplicants.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No applicants found"
                description={
                  applicantFilterStatus !== 'All' || applicantSearch
                    ? 'No candidates match the selected filter or search query.'
                    : 'Eligible students who apply for this job will appear here.'
                }
              />
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase font-bold text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Student Candidate</th>
                      <th className="py-3 px-4">Branch & CGPA</th>
                      <th className="py-3 px-4">Skills</th>
                      <th className="py-3 px-4">Resume</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Update Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplicants.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            {app.student?.user?.name || 'Student Candidate'}
                          </div>
                          <div className="text-xs text-slate-400">{app.student?.user?.email}</div>
                          {app.student?.phone && (
                            <div className="text-[11px] text-slate-400">{app.student.phone}</div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-xs">
                          <div className="font-semibold text-slate-700">
                            {app.student?.branch || 'N/A'}
                          </div>
                          <div className="text-slate-500">
                            CGPA: <strong className="text-slate-800">{app.student?.cgpa || 0}</strong>
                          </div>
                          {app.student?.year && (
                            <div className="text-[11px] text-slate-400">Batch {app.student.year}</div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {app.student?.skills && app.student.skills.length > 0 ? (
                              app.student.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">No skills listed</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {app.student?.resume?.url ? (
                            <a
                              href={getAssetUrl(app.student.resume.url)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View PDF</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Not uploaded</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge status={app.status} />
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                            className="text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-colors cursor-pointer"
                          >
                            {Object.values(APPLICATION_STATUS).map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Job */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Job Drive"
        message="Are you sure you want to permanently delete this job drive? All student applications for this position will also be affected."
        confirmText="Delete Drive"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteJob}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

export default CompanyJobs;
