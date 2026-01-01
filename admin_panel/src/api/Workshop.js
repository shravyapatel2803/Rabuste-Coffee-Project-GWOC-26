import api from './api'; 

export const getAllWorkshops = () => {
  return api.get('/admin/workshops');
};

export const createWorkshop = (formData) => {
  return api.post('/admin/workshops', formData);
};

export const updateWorkshop = (id, formData) => {
  return api.put(`/admin/workshops/${id}`, formData);
};

export const deleteWorkshop = (id) => {
  return api.delete(`/admin/workshops/${id}`);
};

export const getRegistrations = (id) => {
  return api.get(`/admin/workshops/${id}/registrations`);
};