import axiosInstance from './axiosInstance';

export const dashboardApi = {
  getStudentDashboard: async () => {
    const response = await axiosInstance.get('/dashboard');
    return response.data;
  },

  getCompanyDashboard: async () => {
    const response = await axiosInstance.get('/dashboard/company');
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  },
};

export default dashboardApi;
