import api from './api'; 

export const fetchAdminOrders = (filters) => {
  return api.get('/orders/all', { params: filters });
};

export const updateOrderStatusApi = (id, data) => {
  return api.put(`/orders/update/${id}`, data);
};

export const fetchOrderById = (id) => {
  return api.get(`/orders/${id}`);
};