import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://contract-management-backend.onrender.com/api",
});

export const getContracts = (params) => api.get("/contracts", { params });
export const createContract = (data) => api.post("/contracts", data);
export const updateContract = (id, data) => api.put(`/contracts/${id}`, data);
export const deleteContract = (id) => api.delete(`/contracts/${id}`);

export default api;
