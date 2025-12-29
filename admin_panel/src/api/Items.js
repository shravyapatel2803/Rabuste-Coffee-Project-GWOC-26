import API from "./api";

export const fetchAdminItems = (params = {}) =>
  API.get("/admin/items", { params });

export const fetchItemCategories = () =>
  API.get("/admin/items/categories");

export const fetchItemTypes = () =>
  API.get("/admin/items/types");


export const fetchAdminItemById = (id) =>
  API.get(`/admin/items/${id}`);

export const createAdminItem = (data) =>
  API.post("/admin/items", data);

export const updateAdminItem = (id, data) =>
  API.put(`/admin/items/${id}`, data);

export const deleteAdminItem = (id) =>
  API.delete(`/admin/items/${id}`);
