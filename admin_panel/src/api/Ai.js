import api from './api'; 

 
export const getRecommendations = (data) => api.post('/ai/recommend', data);
export const getArtPairing = (id) => api.get(`/ai/pair-art/${id}`);
export const chatWithAI = (query) => api.post('/ai/chat', { query });

export const getAIConfig = () => {
  return api.get('/ai/admin/config');
};

export const updateAIConfig = (data) => {
  return api.put('/ai/admin/config', data);
};

export const getAllQAs = () => {
  return api.get('/ai/admin/qa');
};

export const createQA = (data) => {
  return api.post('/ai/admin/qa', data);
};

export const updateQA = (id, data) => {
  return api.put(`/ai/admin/qa/${id}`, data);
};

export const deleteQA = (id) => {
  return api.delete(`/ai/admin/qa/${id}`);
};