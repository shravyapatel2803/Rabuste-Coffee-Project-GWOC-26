import API from "./api";

export const getUserItems = (params = {}) =>
  API.get("/items", { params });

export const getUserItemBySlug = (slug) => {
  if (!slug) throw new Error("ITEM_SLUG_REQUIRED");
  return API.get(`/items/${slug}`);
};

export const getUserCategories = () =>
  API.get("/items/categories");

export const getUserTypes = () =>
  API.get("/items/types");
