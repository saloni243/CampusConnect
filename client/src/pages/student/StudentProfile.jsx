import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  FileText,
  Upload,
  Download,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Camera,
  Link as LinkIcon,
  Phone,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { studentApi } from '../../api';
import { getAssetUrl } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import ConfirmModal from '../../components/common/ConfirmModal';

export const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: null,
  });

  const [formData, setFormData] = useState({
    prn: '',
    rollNumber: '',
    branch: '',
    year: '',
    cgpa: 0,
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
  });

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await studentApi.getProfile();
      if (res.success && res.student) {
        setStudent(res.student);
        setFormData({
          prn: res.student.prn || '',
          rollNumber: res.student.rollNumber || '',
          branch: res.student.branch || '',
          year: res.student.year || '',
          cgpa: res.student.cgpa || 0,
          phone: res.student.phone || '',
          address: res.student.address || '',
          linkedin: res.student.linkedin || '',
          github: res.student.github || '',
          portfolio: res.student.portfolio || '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch student profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await studentApi.updateProfile({
        ...formData,
        cgpa: Number(formData.cgpa) || 0,
      });
      if (res.success) {
        setStudent(res.student);
        showFeedback('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showFeedback('Please select a valid PDF file.', 'error');
      return;
    }

    const data = new FormData();
    data.append('file', file);

    try {
      setIsUploadingResume(true);
      let res;
      if (student?.resume?.url) {
        res = await studentApi.replaceResume(data);
      } else {
        res = await studentApi.uploadResume(data);
      }
      if (res.success) {
        fetchProfile();
        showFeedback('Resume uploaded successfully!', 'success');
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to upload resume (PDF only, max 5MB)', 'error');
    } finally {
      setIsUploadingResume(false);
      e.target.value = '';
    }
  };

  const handleDeleteResume = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Resume',
      message: 'Are you sure you want to remove your uploaded resume? You will need to re-upload before applying to jobs that require it.',
      confirmText: 'Remove Resume',
      onConfirm: async () => {
        try {
          await studentApi.deleteResume();
          fetchProfile();
          showFeedback('Resume removed', 'success');
        } catch (err) {
          showFeedback(err.response?.data?.message || 'Failed to delete resume', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('profile', file);

    try {
      setIsUploadingPhoto(true);
      let res;
      if (student?.profilePicture?.url) {
        res = await studentApi.replaceProfilePic(data);
      } else {
        res = await studentApi.uploadProfilePic(data);
      }
      if (res.success) {
        fetchProfile();
        showFeedback('Profile picture updated!', 'success');
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to upload profile photo', 'error');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Profile Photo',
      message: 'Are you sure you want to remove your profile photo?',
      confirmText: 'Remove Photo',
      onConfirm: async () => {
        try {
          await studentApi.deleteProfilePic();
          fetchProfile();
          showFeedback('Profile photo removed', 'success');
        } catch (err) {
          showFeedback('Failed to remove profile photo', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      const res = await studentApi.addSkill(newSkill.trim());
      if (res.success) {
        setStudent((prev) => ({ ...prev, skills: res.skills }));
        setNewSkill('');
        showFeedback('Skill added!', 'success');
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to add skill', 'error');
    }
  };

  const handleDeleteSkill = (idx, skillName) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Skill',
      message: `Are you sure you want to remove "${skillName || 'this skill'}" from your profile?`,
      confirmText: 'Remove Skill',
      onConfirm: async () => {
        try {
          const res = await studentApi.deleteSkill(idx);
          if (res.success) {
            setStudent((prev) => ({ ...prev, skills: res.skills }));
            showFeedback('Skill removed', 'success');
          }
        } catch (err) {
          showFeedback('Failed to delete skill', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your student profile..." className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchProfile} />;
  }

  const profilePicUrl = student?.profilePicture?.url
    ? getAssetUrl(student.profilePicture.url)
    : null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header with completion meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Profile</h1>
          <p className="text-sm text-slate-500">
            Maintain your academic credentials, technical skills, and placement resume
          </p>
        </div>

        {/* Profile Completion Meter */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-slate-700 font-semibold">
              <span>Profile Score:</span>
              <span className="text-indigo-600 font-bold">{student?.profileCompletion || 0}%</span>
            </div>
            <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${student?.profileCompletion || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

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

      {/* Grid: Details & Side widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          {/* User Avatar + Name header */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt={student?.user?.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-indigo-400" />
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 truncate">
                  {student?.user?.name || 'Student Name'}
                </h2>
                {profilePicUrl && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">{student?.user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Student Account
                </span>
                {student?.branch && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {student.branch}
                  </span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Academic & Identification Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    PRN (Permanent Reg. No.)
                  </label>
                  <input
                    type="text"
                    name="prn"
                    value={formData.prn}
                    onChange={handleInputChange}
                    placeholder="e.g. 72019284H"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    College Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. CS-402"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Branch / Department
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Academic Year / Batch
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g. 2026 or Final Year"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Cumulative CGPA (scale of 10)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    placeholder="e.g. 8.75"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Phone / Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Current Residential Address
              </label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g. Pune, Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Social and Portfolios */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-600" />
                Professional Profiles & Portfolio
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Personal Portfolio
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/20"
            >
              {isSubmitting ? 'Saving Details...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right Col: Resume & Skills */}
        <div className="space-y-6">
          {/* Resume Upload Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Placement Resume (PDF)
            </h3>

            {student?.resume?.url ? (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {student.resume.filename || 'Student_Resume.pdf'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteResume}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getAssetUrl(student.resume.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-center inline-flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View / Preview</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">
                  Upload your verified resume (PDF format, max 5MB)
                </p>
              </div>
            )}

            <div>
              <label
                className={`cursor-pointer block text-center py-2.5 px-4 rounded-xl text-xs font-bold border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors ${
                  isUploadingResume ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <span>
                  {isUploadingResume
                    ? 'Uploading...'
                    : student?.resume?.url
                    ? 'Replace PDF Resume'
                    : 'Choose PDF File'}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Technical Skills Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Technical & Domain Skills
            </h3>

            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. React.js, Python, SQL"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {student?.skills && student.skills.length > 0 ? (
                student.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(idx, skill)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete skill"
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No technical skills added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDanger={true}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default StudentProfile;
