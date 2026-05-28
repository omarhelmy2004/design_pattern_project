import api from './api';

export const getPublicCircles = async (page = 0, size = 10) => {
  try {
    const response = await api.get('/circles', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch circles');
  }
};

export const getCirclesByTopic = async (topic, page = 0, size = 10) => {
  try {
    const response = await api.get(`/circles/topic/${topic}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch circles');
  }
};

export const getCircle = async (circleId) => {
  try {
    const response = await api.get(`/circles/${circleId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch circle');
  }
};

export const createCircle = async (name, description, topic, isPublic) => {
  try {
    const response = await api.post('/circles', {
      name,
      description,
      topic,
      isPublic
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create circle');
  }
};

export const joinCircle = async (userId, circleId) => {
  try {
    await api.post(`/circles/${circleId}/join`, {}, {
      params: { userId }
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to join circle');
  }
};

export const leaveCircle = async (userId, circleId) => {
  try {
    await api.delete(`/circles/${circleId}/leave`, {
      params: { userId }
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to leave circle');
  }
};

export const getCircleMessages = async (circleId, page = 0, size = 20) => {
  try {
    const response = await api.get(`/circles/${circleId}/messages`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
};

export const postMessage = async (userId, circleId, content) => {
  try {
    const response = await api.post(`/circles/${circleId}/messages`, {
      content
    }, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to post message');
  }
};

export const getUserCircles = async (userId) => {
  try {
    const response = await api.get(`/circles/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user circles');
  }
};
