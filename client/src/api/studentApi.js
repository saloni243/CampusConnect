import axiosInstance from './axiosInstance';

export const studentApi = {
  getProfile: async () => {
    const response = await axiosInstance.get('/students/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.put('/students/profile', data);
    return response.data;
  },

  uploadResume: async (formData) => {
    const response = await axiosInstance.post('/students/upload-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  replaceResume: async (formData) => {
    const response = await axiosInstance.put('/students/replace-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteResume: async () => {
    const response = await axiosInstance.delete('/students/delete-resume');
    return response.data;
  },

  previewResume: async () => {
    const response = await axiosInstance.get('/students/preview-resume');
    return response.data;
  },

  downloadResume: async () => {
    const response = await axiosInstance.get('/students/download-resume', {
      responseType: 'blob',
    });
    return response.data;
  },

  uploadProfilePic: async (formData) => {
    const response = await axiosInstance.post('/students/upload-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  replaceProfilePic: async (formData) => {
    const response = await axiosInstance.put('/students/replace-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteProfilePic: async () => {
    const response = await axiosInstance.delete('/students/delete-profile');
    return response.data;
  },

  getSkills: async () => {
    const response = await axiosInstance.get('/students/skills');
    return response.data;
  },

  addSkill: async (skill) => {
    const response = await axiosInstance.post('/students/skills', { skill });
    return response.data;
  },

  updateSkill: async (index, skill) => {
    const response = await axiosInstance.put(`/students/skills/${index}`, { skill });
    return response.data;
  },

  deleteSkill: async (index) => {
    const response = await axiosInstance.delete(`/students/skills/${index}`);
    return response.data;
  },
};

export default studentApi;
