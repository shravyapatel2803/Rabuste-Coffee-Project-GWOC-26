import API from "./api";

export const fetchAdminItems = (params) =>
  API.get("/admin/items", { params });

export const deleteAdminItem = (id) =>
  API.delete(`/admin/items/${id}`);

export const createAdminItem = (data) =>
  API.post("/admin/items", data);

export const updateAdminItem = (id, data) =>
  API.put(`/admin/items/${id}`, data);

export const fetchAdminCategories = () =>
  API.get("/admin/items/categories");

export const fetchAdminTypes = () =>
  API.get("/admin/items/types");

export const fetchAdminRoastTypes = () =>
  API.get("/admin/items/roast-types");
