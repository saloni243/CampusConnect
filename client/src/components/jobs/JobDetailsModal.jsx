import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { formatPackage, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export const JobDetailsModal = ({
  job,
  isOpen,
  onClose,
  onApply,
  isApplied = false,
  isApplying = false,
}) => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  if (!isOpen || !job) return null;

  const isDeadlinePassed = new Date() > new Date(job.lastDate);
  const isInactive = job.isActive === false;
  const canApply = !isApplied && !isDeadlinePassed && !isInactive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {job.company?.companyName || 'Corporate Partner'}
              </span>
              {isInactive ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Inactive
                </span>
              ) : isDeadlinePassed ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Deadline Passed
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Hiring
                </span>
              )}
              {isApplied && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Applied
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
              <span className="font-bold text-emerald-600 text-sm">
                {formatPackage(job.package)}
              </span>
              {job.company?.website && (
                <a
                  href={job.company.website.startsWith('http') ? job.company.website : `https://${job.company.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 underline"
                >
                  <span>Company Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Key Eligibility Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Compensation
              </span>
              <span className="text-sm font-bold text-emerald-600 mt-1 block">
                {formatPackage(job.package)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Min. CGPA
              </span>
              <span className="text-sm font-bold text-slate-800 mt-1 block">
                {job.minimumCGPA ? `${job.minimumCGPA} CGPA` : 'No Cutoff'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Eligible Batch
              </span>
              <span className="text-sm font-bold text-slate-800 mt-1 block">
                {job.batch} Passing
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Deadline
              </span>
              <span className="text-sm font-bold text-slate-800 mt-1 block">
                {formatDate(job.lastDate)}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Role Description
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              {job.description || 'No detailed description provided by the recruiter.'}
            </div>
          </div>

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-700 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Eligible Branches */}
          {job.eligibleBranches && job.eligibleBranches.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Eligible Departments / Branches
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.eligibleBranches.map((branch, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {branch}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Company About */}
          {job.company?.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                About {job.company.companyName}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {job.company.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          {isStudent && (
            <div className="flex items-center gap-3">
              {isApplied ? (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Already Applied
                </div>
              ) : isDeadlinePassed ? (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold">
                  <Clock className="w-4 h-4" />
                  Applications Closed
                </div>
              ) : isInactive ? (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  Job Inactive
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isApplying}
                  onClick={() => onApply && onApply(job._id)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  {isApplying ? 'Submitting Application...' : 'Apply for this Job'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
