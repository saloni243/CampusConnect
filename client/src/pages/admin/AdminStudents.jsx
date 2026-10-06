import React, { useState, useEffect } from 'react';
import { Search, Users, Mail, Phone, GraduationCap, X, FileText, Briefcase } from 'lucide-react';
import { adminApi } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');

  // Details Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = keyword.trim()
        ? await adminApi.searchStudents(keyword.trim())
        : await adminApi.getAllStudents();

      if (res.success && Array.isArray(res.students)) {
        setStudents(res.students);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleViewDetails = async (id) => {
    try {
      setIsModalLoading(true);
      const res = await adminApi.getStudentById(id);
      if (res.success && res.student) {
        setSelectedStudent(res.student);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch student details');
    } finally {
      setIsModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enrolled Students Directory</h1>
          <p className="text-sm text-slate-500">Search and review registered student academic profiles</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          />
        </form>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading student records..." className="py-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchStudents} />
      ) : students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="No student profiles match your search criteria."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-400">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">PRN / Roll No</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Profile Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{st.user?.name || 'Student'}</div>
                      <div className="text-xs text-slate-400">{st.user?.email}</div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div>PRN: {st.prn || 'N/A'}</div>
                      <div>Roll: {st.rollNumber || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-700">
                      {st.branch || 'Not specified'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 text-xs">
                      {st.cgpa ? st.cgpa.toFixed(2) : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          st.profileCompleted
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {st.profileCompletion || 0}% Complete
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleViewDetails(st._id)}
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

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedStudent.user?.name}</h2>
                <p className="text-sm text-slate-500">{selectedStudent.user?.email}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Academic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Academic Profile</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">Branch: {selectedStudent.branch || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-slate-400 font-bold text-xs text-center flex items-center justify-center">#</span>
                    <span>PRN: {selectedStudent.prn || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-slate-400 font-bold text-xs text-center flex items-center justify-center">R</span>
                    <span>Roll No: {selectedStudent.rollNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>CGPA: <span className="font-bold text-slate-800">{selectedStudent.cgpa || 'N/A'}</span></span>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Personal Details</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{selectedStudent.phone || 'Phone not provided'}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-semibold text-slate-500">Skills: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedStudent.skills?.length > 0 ? (
                        selectedStudent.skills.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                            {sk}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedStudent.resume?.url && (
              <div className="pt-4 border-t">
                <a href={selectedStudent.resume.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-colors">
                  <FileText className="w-4 h-4" />
                  View Resume
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
