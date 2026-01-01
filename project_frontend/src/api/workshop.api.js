import API from './api'

export const getAllWorkshops = () => {
  return API.get('/workshops');
};

export const getWorkshopBySlug = (slug) => {
  return API.get(`/workshops/${slug}`);
};

export const registerForWorkshop = (registrationData) => {
  return API.post('/workshops/register', registrationData);
};