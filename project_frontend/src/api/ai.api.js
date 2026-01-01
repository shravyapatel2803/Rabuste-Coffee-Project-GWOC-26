import api from './api'; 

export const getAIFilters = () => {
  return api.get('/ai/filters');
};

export const getRecommendations = (preferences) => {
  return api.post('/ai/recommend', preferences);
};

export const chatWithAI = (query) => {
  return api.post('/ai/chat', { query });
};

export const getArtPairing = (coffeeId) => {
  return api.get(`/ai/pair-art/${coffeeId}`);
};

