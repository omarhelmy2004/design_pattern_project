import api from './api';

export const chatWithCompanion = async (userId, message) => {
  try {
    const response = await api.post('/companion/chat', {
      message
    }, {
      params: { userId }
    });
    return response.data.response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to chat with companion');
  }
};

export const getCompanionHistory = async (userId, page = 0, size = 50) => {
  try {
    const response = await api.get(`/companion/history/${userId}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch history');
  }
};

export const clearCompanionHistory = async (userId) => {
  try {
    await api.delete(`/companion/history/${userId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to clear history');
  }
};
