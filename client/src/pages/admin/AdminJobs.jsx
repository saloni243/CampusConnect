import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, MapPin, Trash2, Power, Calendar, Info, X, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminApi } from '../../api';
import { formatPackage, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

import ConfirmModal from '../../components/common/ConfirmModal';

export const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Details Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminApi.getAllJobs();
      if (res.success && Array.isArray(res.jobs)) {
        setJobs(res.jobs);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await adminApi.toggleJobStatus(id);
      if (res.success && res.job) {
        setJobs((prev) =>
          prev.map((j) => (j._id === id ? { ...j, isActive: res.job.isActive } : j))
        );
        if (selectedJob && selectedJob._id === id) {
          setSelectedJob(prev => ({...prev, isActive: res.job.isActive}));
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle job status');
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      await adminApi.deleteJob(deleteTargetId);
      setJobs((prev) => prev.filter((j) => j._id !== deleteTargetId));
      if (selectedJob && selectedJob._id === deleteTargetId) {
        setSelectedJob(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setIsModalLoading(true);
      const res = await adminApi.getJobById(id);
      if (res.success && res.job) {
        setSelectedJob(res.job);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch job details');
    } finally {
      setIsModalLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading placement drives..." className="py-20" /> ;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchJobs} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Placement Drives Directory</h1>
        <p className="text-sm text-slate-500">Supervise, activate/deactivate, and audit campus recruitment drives</p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No placement drives found"
          description="Posted placement jobs will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                      {job.company?.companyName || 'Company'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        job.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button onClick={() => handleViewDetails(job._id)} className="text-slate-400 hover:text-indigo-600">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="font-bold text-emerald-600">
                      {formatPackage(job.package)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Deadline: {formatDate(job.lastDate)}
                    </span>
                    <span>Batch {job.batch}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(job._id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    job.isActive
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{job.isActive ? 'Deactivate' : 'Activate'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTargetId(job._id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Job Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Placement Drive"
        message="Are you sure you want to permanently delete this placement drive? All associated student applications will be affected."
        confirmText="Delete Drive"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteJob}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  {selectedJob.company?.companyName}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  {selectedJob.title}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedJob.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {selectedJob.isActive ? 'Active' : 'Inactive'}
                  </span>
                </h2>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Package</span>
                <span className="font-bold text-emerald-600">{formatPackage(selectedJob.package)}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Location</span>
                <span className="font-medium text-slate-800">{selectedJob.location}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Deadline</span>
                <span className="font-medium text-slate-800">{formatDate(selectedJob.lastDate)}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Batch</span>
                <span className="font-medium text-slate-800">{selectedJob.batch}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-2">Job Description</h3>
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-2">Requirements</h3>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedJob._id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  selectedJob.isActive
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{selectedJob.isActive ? 'Deactivate Drive' : 'Activate Drive'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
