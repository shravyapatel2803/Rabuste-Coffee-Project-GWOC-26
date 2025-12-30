import API from "./api";

export const fetchPublicArts = (params = {}) =>
  API.get("/arts", { params });

export const fetchPublicArtBySlug = (slug) =>
  API.get(`/arts/${slug}`);

export const recordArtView = (slug) => {
  return API.patch(`/arts/${slug}/view`);
};