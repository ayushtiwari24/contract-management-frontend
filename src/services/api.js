import axios from "axios";

// Backend URL for local testing
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://contract-management-backend.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api`, // This ensures /api prefix is added only once
  headers: { "Content-Type": "application/json" },
});

export const getContracts = (params) => api.get("/contracts", { params });
export const createContract = (data) => api.post("/contracts", data);
export const updateContract = (id, data) => api.put(`/contracts/${id}`, data);
export const deleteContract = (id) => api.delete(`/contracts/${id}`);

export default api;
