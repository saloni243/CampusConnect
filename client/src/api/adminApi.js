import axiosInstance from './axiosInstance';

export const adminApi = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  },

  getAllStudents: async () => {
    const response = await axiosInstance.get('/admin/students');
    return response.data;
  },

  searchStudents: async (keyword) => {
    const response = await axiosInstance.get('/admin/students/search', {
      params: { keyword },
    });
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await axiosInstance.get(`/admin/students/${id}`);
    return response.data;
  },

  getAllCompanies: async () => {
    const response = await axiosInstance.get('/admin/companies');
    return response.data;
  },

  searchCompanies: async (keyword) => {
    const response = await axiosInstance.get('/admin/companies/search', {
      params: { keyword },
    });
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await axiosInstance.get(`/admin/companies/${id}`);
    return response.data;
  },

  verifyCompany: async (id) => {
    const response = await axiosInstance.put(`/admin/companies/${id}/verify`);
    return response.data;
  },

  rejectCompany: async (id) => {
    const response = await axiosInstance.put(`/admin/companies/${id}/reject`);
    return response.data;
  },

  getAllJobs: async () => {
    const response = await axiosInstance.get('/admin/jobs');
    return response.data;
  },

  getJobById: async (id) => {
    const response = await axiosInstance.get(`/admin/jobs/${id}`);
    return response.data;
  },

  toggleJobStatus: async (id) => {
    const response = await axiosInstance.put(`/admin/jobs/${id}/status`);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await axiosInstance.delete(`/admin/jobs/${id}`);
    return response.data;
  },

  getAllApplications: async (filters = {}) => {
    const response = await axiosInstance.get('/admin/applications', {
      params: filters,
    });
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await axiosInstance.get(`/admin/applications/${id}`);
    return response.data;
  },

  createAnnouncement: async (data) => {
    const response = await axiosInstance.post('/admin/announcements', data);
    return response.data;
  },

  getAllAnnouncements: async () => {
    const response = await axiosInstance.get('/admin/announcements');
    return response.data;
  },

  getAnnouncementById: async (id) => {
    const response = await axiosInstance.get(`/admin/announcements/${id}`);
    return response.data;
  },

  deleteAnnouncement: async (id) => {
    const response = await axiosInstance.delete(`/admin/announcements/${id}`);
    return response.data;
  },
};

export default adminApi;
