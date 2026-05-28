import api from './api';

export const getGlobalVents = async (page = 0, size = 10) => {
  try {
    const response = await api.get('/vents', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vents');
  }
};

export const createVent = async (userId, content, circleId = null) => {
  try {
    const response = await api.post('/vents', {
      content,
      circleId
    }, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create vent');
  }
};

export const getVent = async (ventId) => {
  try {
    const response = await api.get(`/vents/${ventId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vent');
  }
};

export const deleteVent = async (ventId, userId) => {
  try {
    await api.delete(`/vents/${ventId}`, {
      params: { userId }
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete vent');
  }
};

export const addReaction = async (ventId, userId, reactionType) => {
  try {
    const response = await api.post(`/vents/${ventId}/reactions`, {
      reactionType
    }, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add reaction');
  }
};

export const removeReaction = async (ventId, userId, reactionType) => {
  try {
    await api.delete(`/vents/${ventId}/reactions`, {
      params: { userId, reactionType }
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove reaction');
  }
};

export const getVentReactions = async (ventId) => {
  try {
    const response = await api.get(`/vents/${ventId}/reactions`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reactions');
  }
};
