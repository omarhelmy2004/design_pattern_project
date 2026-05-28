import api from './api';

export const createCheckIn = async (userId, moodScore, notes = '') => {
  try {
    const response = await api.post('/checkins', {
      moodScore,
      notes
    }, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create check-in');
  }
};

export const getUserCheckIns = async (userId, page = 0, size = 10) => {
  try {
    const response = await api.get(`/checkins/user/${userId}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch check-ins');
  }
};

export const getCurrentStreak = async (userId) => {
  try {
    const response = await api.get(`/checkins/user/${userId}/streak`);
    return response.data.streak;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch streak');
  }
};

export const getTodayCheckIn = async (userId) => {
  try {
    const response = await api.get(`/checkins/user/${userId}/today`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 204) {
      return null;
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch today\'s check-in');
  }
};
