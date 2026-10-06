import axiosInstance from './axiosInstance';

export const companyApi = {
  getCompanies: async () => {
    const response = await axiosInstance.get('/company');
    return response.data;
  },

  searchCompanies: async (keyword) => {
    const response = await axiosInstance.get('/company/search/company', {
      params: { keyword },
    });
    return response.data;
  },

  getCompanyProfile: async () => {
    const response = await axiosInstance.get('/company/profile');
    return response.data;
  },

  updateCompanyProfile: async (data) => {
    const response = await axiosInstance.put('/company/profile', data);
    return response.data;
  },

  uploadLogo: async (formData) => {
    const response = await axiosInstance.put('/company/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await axiosInstance.get(`/company/${id}`);
    return response.data;
  },
};

export default companyApi;
