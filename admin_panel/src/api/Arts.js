import API from "./api";

export const fetchAdminArts = (params = {}) =>
  API.get("/admin/arts", { params });

export const fetchArtMoods = () =>
  API.get("/admin/arts/moods");

export const createAdminArt = (data) =>
  API.post("/admin/arts", data);

export const updateAdminArt = (id, data) =>
  API.put(`/admin/arts/${id}`, data);

export const deleteAdminArt = (id) =>
  API.delete(`/admin/arts/${id}`);

export const fetchArtOptions = async () => {
  try {
    const response = await API.get("/admin/arts/options");
    return response.data;
  } catch (error) {
    console.error("Error fetching art options:", error);
    return { 
      mediums: [], 
      styles: [], 
      locations: [], 
      moods: [] 
    };
  }
};