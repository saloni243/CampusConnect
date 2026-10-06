import axiosInstance from './axiosInstance';

export const statisticsApi = {
  getStudentStatistics: async () => {
    const response = await axiosInstance.get('/statistics');
    return response.data;
  },

  getCompanyStatistics: async () => {
    const response = await axiosInstance.get('/statistics/company');
    return response.data;
  },

  getOverallStatistics: async () => {
    const response = await axiosInstance.get('/statistics/overall');
    return response.data;
  },

  getMonthlyAnalytics: async () => {
    const response = await axiosInstance.get('/statistics/monthly');
    return response.data;
  },
};

export default statisticsApi;
