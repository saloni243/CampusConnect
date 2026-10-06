import axiosInstance from './axiosInstance';

export const notificationApi = {
  getNotifications: async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axiosInstance.put(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationApi;
