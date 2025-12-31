import API from './api';

// Razorpay Init
export const createRazorpayOrder = (amount) => {
  return API.post('/orders/razorpay/init', { amount });
};

// Create Order
export const createPreOrder = (orderData) => {
  return API.post('/orders/create', orderData);
};

// Get Single Order (for ActiveOrderFloating & TrackOrder )
export const fetchOrderById = (id) => {
  return API.get(`/orders/${id}`);
};