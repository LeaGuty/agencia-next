import axios from 'axios';
import { AuthResponse, TravelRequest, User } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir el token JWT en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData: any): Promise<any> => {
    // Ahora enviamos el objeto completo que incluye el DNI
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  // NUEVO: Obtener lista de clientes para el Agente
  getClients: async (): Promise<User[]> => {
    const response = await api.get('/auth/clients');
    return response.data;
  },
  loginWithGitHub: async (code: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/github', { code });
    return response.data;
  }
};

export const travelService = {
  getAll: async (): Promise<TravelRequest[]> => {
    const response = await api.get('/requests');
    return response.data;
  },
  create: async (request: Omit<TravelRequest, 'id' | 'registrationDate'>): Promise<TravelRequest> => {
    const response = await api.post('/requests', request);
    return response.data;
  },
  // NUEVO: Modificar solicitud
  update: async (id: string, request: Partial<TravelRequest>): Promise<TravelRequest> => {
    const response = await api.put(`/requests/${id}`, request);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/requests/${id}`);
  }
};

export default api;