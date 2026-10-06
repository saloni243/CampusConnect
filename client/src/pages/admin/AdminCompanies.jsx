import React, { useState, useEffect } from 'react';
import { Search, Building2, CheckCircle2, Globe, MapPin, ShieldCheck, X, FileText, Info } from 'lucide-react';
import { adminApi } from '../../api';
import { getAssetUrl } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);

  // Details Modal
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = keyword.trim()
        ? await adminApi.searchCompanies(keyword.trim())
        : await adminApi.getAllCompanies();

      if (res.success && Array.isArray(res.companies)) {
        setCompanies(res.companies);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch companies');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  const handleVerify = async (id) => {
    try {
      setVerifyingId(id);
      const res = await adminApi.verifyCompany(id);
      if (res.success) {
        setCompanies((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isVerified: true } : c))
        );
        if (selectedCompany && selectedCompany._id === id) {
           setSelectedCompany(prev => ({...prev, isVerified: true}));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setVerifyingId(id + '_reject');
      const res = await adminApi.rejectCompany(id);
      if (res.success) {
        setCompanies((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isVerified: false } : c))
        );
        if (selectedCompany && selectedCompany._id === id) {
          setSelectedCompany(prev => ({...prev, isVerified: false}));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setIsModalLoading(true);
      const res = await adminApi.getCompanyById(id);
      if (res.success && res.company) {
        setSelectedCompany(res.company);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch company details');
    } finally {
      setIsModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Corporate Recruiters Directory</h1>
          <p className="text-sm text-slate-500">Audit company credentials and approve placement posting authorization</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by recruiter or user..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          />
        </form>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading recruiter records..." className="py-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCompanies} />
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies found"
          description="No registered companies match your search."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {c.logo?.url ? (
                        <img
                          src={getAssetUrl(c.logo.url)}
                          alt={c.companyName}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                        {c.companyName}
                      </h3>
                      <p className="text-xs text-slate-400">{c.industry || 'Corporate Partner'}</p>
                    </div>
                  </div>
                  <button onClick={() => handleViewDetails(c._id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {c.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                {c.isVerified ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Partner
                    </span>
                    <button
                      type="button"
                      disabled={verifyingId === c._id + '_reject'}
                      onClick={() => handleReject(c._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition-colors"
                    >
                      {verifyingId === c._id + '_reject' ? 'Revoking...' : 'Revoke'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <button
                      type="button"
                      disabled={verifyingId === c._id}
                      onClick={() => handleVerify(c._id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {verifyingId === c._id ? 'Verifying...' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      disabled={verifyingId === c._id + '_reject'}
                      onClick={() => handleReject(c._id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition-colors"
                    >
                      {verifyingId === c._id + '_reject' ? '...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Company Details Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedCompany.logo?.url ? (
                    <img
                      src={getAssetUrl(selectedCompany.logo.url)}
                      alt={selectedCompany.companyName}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {selectedCompany.companyName}
                    {selectedCompany.isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  </h2>
                  <p className="text-sm text-slate-500">{selectedCompany.industry || 'Corporate Partner'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCompany(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Company Overview</h3>
              <p className="text-sm text-slate-600 whitespace-pre-line">
                {selectedCompany.description || 'No description provided by the company.'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span><span className="font-semibold text-slate-700">Location: </span>{selectedCompany.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span><span className="font-semibold text-slate-700">Website: </span>
                      {selectedCompany.website ? (
                        <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                          {selectedCompany.website}
                        </a>
                      ) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
              {selectedCompany.isVerified ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </span>
                  <button
                    type="button"
                    disabled={verifyingId === selectedCompany._id + '_reject'}
                    onClick={() => handleReject(selectedCompany._id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition-colors"
                  >
                    {verifyingId === selectedCompany._id + '_reject' ? 'Revoking...' : 'Revoke Verification'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={verifyingId === selectedCompany._id + '_reject'}
                    onClick={() => handleReject(selectedCompany._id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition-colors"
                  >
                    {verifyingId === selectedCompany._id + '_reject' ? '...' : 'Reject'}
                  </button>
                  <button
                    type="button"
                    disabled={verifyingId === selectedCompany._id}
                    onClick={() => handleVerify(selectedCompany._id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {verifyingId === selectedCompany._id ? 'Verifying...' : 'Approve & Verify Company'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;
