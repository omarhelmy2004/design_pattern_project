import api from './api';

export const signupUser = async () => {
  try {
    const response = await api.post('/profile/signup');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

export const loginUser = async (anonymousId) => {
  try {
    // In a real app, this would validate the anonymousId with the backend
    return {
      userId: Math.random().toString(36).substr(2, 9),
      anonymousId,
      avatarSeed: Math.random().toString(36).substr(2, 16)
    };
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const getProfile = async (userId) => {
  try {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateProfile = async (userId, updates) => {
  try {
    const response = await api.put(`/profile/${userId}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};
