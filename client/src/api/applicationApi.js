import axiosInstance from './axiosInstance';

export const applicationApi = {
  applyJob: async (jobId) => {
    const response = await axiosInstance.post(`/applications/apply/${jobId}`);
    return response.data;
  },

  cancelApplication: async (jobId) => {
    const response = await axiosInstance.delete(`/applications/cancel/${jobId}`);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await axiosInstance.get('/applications/my-applications');
    return response.data;
  },

  getApplicationStatus: async (jobId) => {
    const response = await axiosInstance.get(`/applications/status/${jobId}`);
    return response.data;
  },

  getApplicants: async (jobId) => {
    const response = await axiosInstance.get(`/applications/job/${jobId}/applicants`);
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await axiosInstance.put(`/applications/status/${applicationId}`, { status });
    return response.data;
  },
};

export default applicationApi;
