import API from "./api";


export const fetchPublicArts = (params = {}) =>
  API.get("/art", { params });

export const fetchArtBySlug = (slug) =>
  API.get(`/art/${slug}`);


export const fetchArtMoods = () =>
  API.get("/art/meta/moods");

export const fetchArtStyles = () =>
  API.get("/art/meta/styles");
