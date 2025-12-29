import API from "./api";

/* GET ALL */
export const fetchAdminArts = (params) =>
  API.get("/admin/art", { params });

/* GET SINGLE */
export const fetchAdminArtById = (id) =>
  API.get(`/admin/art/${id}`);

/* CREATE */
export const createAdminArt = (data) =>
  API.post("/admin/art", data);

/* UPDATE */
export const updateAdminArt = (id, data) =>
  API.put(`/admin/art/${id}`, data);

/* DELETE */
export const deleteAdminArt = (id) =>
  API.delete(`/admin/art/${id}`);

/* METADATA */
export const fetchAdminArtStyles = () =>
  API.get("/admin/art/meta/styles");

export const fetchAdminArtMoods = () =>
  API.get("/admin/art/meta/moods");

export const fetchAdminArtDisplayLocations = () =>
  API.get("/admin/art/meta/display-locations");
