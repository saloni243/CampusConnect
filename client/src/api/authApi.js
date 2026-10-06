import axiosInstance from './axiosInstance';

export const authApi = {
  /**
   * Register a new student or company user
   * @param {Object} data - { name, email, password, role }
   */
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  /**
   * Log in user
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
};

export default authApi;
