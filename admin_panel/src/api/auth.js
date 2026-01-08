import API from "./api";

export const loginAdmin = (credentials) => API.post("/auth/login", credentials);
export const getMe = () => API.get("/auth/me");
export const createAdmin = (data) => API.post("/auth/create", data);
export const forgotPasswordAPI = (email) => API.post("/auth/forgot-password", { email });
export const changePasswordAPI = (data) => API.put("/auth/change-password", data);