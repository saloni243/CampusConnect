import React, { useState, useEffect } from 'react';
import {
  Building2,
  Globe,
  MapPin,
  Upload,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  Briefcase,
  Camera,
} from 'lucide-react';
import { companyApi } from '../../api';
import { getAssetUrl } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';

export const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    website: '',
    industry: '',
    location: '',
  });

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await companyApi.getCompanyProfile();
      if (res.success && res.company) {
        setCompany(res.company);
        setFormData({
          companyName: res.company.companyName || '',
          description: res.company.description || '',
          website: res.company.website || '',
          industry: res.company.industry || '',
          location: res.company.location || '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch company profile');
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
      const res = await companyApi.updateCompanyProfile(formData);
      if (res.success) {
        setCompany(res.company);
        showFeedback('Company profile details saved successfully!', 'success');
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to update company profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('Please select a valid image file (PNG, JPG, SVG).', 'error');
      return;
    }

    const data = new FormData();
    data.append('logo', file);

    try {
      setIsUploadingLogo(true);
      const res = await companyApi.uploadLogo(data);
      if (res.success) {
        fetchProfile();
        showFeedback('Company logo updated successfully!', 'success');
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to upload logo image', 'error');
    } finally {
      setIsUploadingLogo(false);
      e.target.value = '';
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading company credentials..." className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchProfile} />;
  }

  const logoUrl = company?.logo?.url ? getAssetUrl(company.logo.url) : null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Title & Verification Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Company Profile</h1>
          <p className="text-sm text-slate-500">
            Maintain corporate identification, brand assets, and contact coordinates
          </p>
        </div>

        {company?.isVerified ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-sm self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Recruiter Partner
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shadow-sm self-start sm:self-auto">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Verification Pending Approval
          </span>
        )}
      </div>

      {/* Verification explanatory banner */}
      {!company?.isVerified && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Pending TPO Admin Approval: </span>
            <p className="leading-relaxed">
              Your company profile is under review by the Training & Placement Officer (TPO). Once verified, you will be authorized to publish job drives and invite candidates.
            </p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Logo & Brand Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-3 shadow-sm">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={company?.companyName || 'Company Logo'}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-12 h-12 text-slate-300" />
              )}
            </div>

            <label
              className={`absolute bottom-0 right-0 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md transition-colors ${
                isUploadingLogo ? 'opacity-50 pointer-events-none' : ''
              }`}
              title="Change logo"
            >
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">{company?.companyName}</h3>
            <p className="text-xs text-slate-400">{company?.industry || 'Industry unspecified'}</p>
            {company?.location && (
              <p className="text-xs text-slate-500 flex items-center justify-center gap-1 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{company.location}</span>
              </p>
            )}
          </div>

          <div className="w-full pt-2">
            <label
              className={`cursor-pointer block text-center py-2.5 px-4 rounded-xl text-xs font-bold border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors w-full ${
                isUploadingLogo ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <span>{isUploadingLogo ? 'Uploading Logo...' : logoUrl ? 'Change Logo Image' : 'Upload Company Logo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            <p className="text-[10px] text-slate-400 mt-2">
              PNG, JPG, WebP or SVG format (Max 2MB)
            </p>
          </div>

          {company?.website && (
            <div className="w-full pt-2 border-t border-slate-100">
              <a
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit Official Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Profile Edit Form */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Corporate Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Company Legal Name *
              </label>
              <input
                type="text"
                required
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Company Overview & Mission
              </label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Overview of company offerings, values, and campus culture..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Official Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="e.g. Information Technology / Fintech"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Corporate Headquarters / Office Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/20"
              >
                {isSubmitting ? 'Saving Profile...' : 'Save Company Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
