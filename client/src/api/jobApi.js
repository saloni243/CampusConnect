import axiosInstance from './axiosInstance';

export const jobApi = {
  getJobs: async () => {
    const response = await axiosInstance.get('/jobs');
    return response.data;
  },

  searchJobs: async (keyword) => {
    const response = await axiosInstance.get('/jobs/search/jobs', {
      params: { keyword },
    });
    return response.data;
  },

  filterJobs: async (filters = {}) => {
    const response = await axiosInstance.get('/jobs/filter/jobs', {
      params: filters,
    });
    return response.data;
  },

  getCompanyJobs: async () => {
    const response = await axiosInstance.get('/jobs/company/my-jobs');
    return response.data;
  },

  getSavedJobs: async () => {
    const response = await axiosInstance.get('/jobs/saved');
    return response.data;
  },

  getJobById: async (id) => {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await axiosInstance.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await axiosInstance.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await axiosInstance.delete(`/jobs/${id}`);
    return response.data;
  },

  saveJob: async (jobId) => {
    const response = await axiosInstance.post(`/jobs/save/${jobId}`);
    return response.data;
  },

  removeSavedJob: async (jobId) => {
    const response = await axiosInstance.delete(`/jobs/saved/${jobId}`);
    return response.data;
  },
};

export default jobApi;
