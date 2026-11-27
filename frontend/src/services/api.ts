import axios from "axios";
import type { Resource } from "../types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("biblioteca-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiService = {
  register: async (data: { name: string; email: string; password: string }) =>
    (await api.post("/auth/register", data)).data,
  login: async (data: { email: string; password: string }) =>
    (await api.post("/auth/login", data)).data,
  list: async (resource: Resource) => (await api.get(`/${resource}`)).data as Record<string, unknown>[],
  create: async (resource: Resource, data: Record<string, unknown>) =>
    (await api.post(`/${resource}`, data)).data,
  update: async (resource: Resource, id: number, data: Record<string, unknown>) =>
    (await api.put(`/${resource}/${id}`, data)).data,
  remove: async (resource: Resource, id: number) => api.delete(`/${resource}/${id}`),
};
