import API from "./api"; 

export const getFranchiseEnquiries = () => {
  return API.get("/franchise");
};

export const updateFranchiseStatus = (id, status) => {
  return API.patch(`/franchise/${id}/status`, { status });
};