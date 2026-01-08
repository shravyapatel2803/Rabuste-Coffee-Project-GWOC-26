import API from "./api"; 

export const createFranchiseEnquiry = (data) => {
  return API.post("/franchise", data);
};