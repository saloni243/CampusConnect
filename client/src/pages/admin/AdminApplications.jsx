import React, { useState, useEffect } from 'react';
import { FileText, Filter, X, Building2, User, Mail, Phone, Calendar, Briefcase, GraduationCap } from 'lucide-react';
import { adminApi } from '../../api';
import { formatPackage, formatDate } from '../../utils/formatters';
import { APPLICATION_STATUS } from '../../utils/constants';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [selectedStatus, setSelectedStatus] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');

  // Details Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {};
      if (selectedStatus) params.status = selectedStatus;

      const res = await adminApi.getAllApplications(params);
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
  }, [selectedStatus]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  const handleViewDetails = async (id) => {
    try {
      setIsModalLoading(true);
      const res = await adminApi.getApplicationById(id);
      if (res.success && res.application) {
        setSelectedApp(res.application);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch application details');
    } finally {
      setIsModalLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const sName = app.student?.user?.name?.toLowerCase() || '';
    const sEmail = app.student?.user?.email?.toLowerCase() || '';
    const cName = app.company?.companyName?.toLowerCase() || app.job?.company?.companyName?.toLowerCase() || '';

    const matchesStudent = !studentFilter.trim() || sName.includes(studentFilter.toLowerCase().trim()) || sEmail.includes(studentFilter.toLowerCase().trim());
    const matchesCompany = !companyFilter.trim() || cName.includes(companyFilter.toLowerCase().trim());

    return matchesStudent && matchesCompany;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Candidate Applications</h1>
          <p className="text-sm text-slate-500">Cross-department tracking of student placement applications</p>
        </div>

        <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Company name..."
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="pl-9 pr-3 py-1.5 w-40 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Student name..."
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className="pl-9 pr-3 py-1.5 w-40 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-slate-400 ml-1" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              {Object.values(APPLICATION_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading all applications..." className="py-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchApplications} />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications found"
          description="There are no applications submitted matching this filter."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-400">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Applied Position</th>
                  <th className="py-3 px-4">Recruiter</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {app.student?.user?.name || 'Student Candidate'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {app.student?.user?.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {app.job?.title || 'Unknown Position'}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-indigo-600">
                      {app.company?.companyName || 'Company'}
                    </td>
                    <td className="py-3 px-4 text-xs font-bold text-emerald-600">
                      {formatPackage(app.job?.package)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleViewDetails(app._id)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Application Details</h2>
                <p className="text-sm text-slate-500">Submitted on {formatDate(selectedApp.createdAt || selectedApp.appliedAt)}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Student Profile</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{selectedApp.student?.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{selectedApp.student?.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{selectedApp.student?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>{selectedApp.student?.branch || 'Branch N/A'} • CGPA: {selectedApp.student?.cgpa || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Job Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Job Details</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{selectedApp.job?.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-indigo-600 font-semibold">{selectedApp.company?.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-600">{formatPackage(selectedApp.job?.package)}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-semibold text-slate-500">Current Status: </span>
                    <Badge status={selectedApp.status} />
                  </div>
                </div>
              </div>
            </div>

            {selectedApp.resume?.url && (
              <div className="pt-4 border-t">
                <a href={selectedApp.resume.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-colors">
                  <FileText className="w-4 h-4" />
                  View Applicant Resume
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
