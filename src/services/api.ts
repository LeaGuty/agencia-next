import Cookies from 'js-cookie';
import { AuthResponse, TravelRequest } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const getAuthHeaders = (token?: string) => {
  const authToken = token || Cookies.get('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': authToken ? `Bearer ${authToken}` : '',
  };
};

// --- AUTH SERVICES ---

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Error en login');
  
  const response = await res.json();
  
  // CORRECCIÓN: Detectamos si la respuesta viene envuelta en "data"
  const payload = response.data || response;

  if (payload.token) {
    // Guardamos con path root para que sea visible en /dashboard
    Cookies.set('token', payload.token, { expires: 1, path: '/' }); 
    if (payload.userId) Cookies.set('userId', payload.userId, { path: '/' });

    return {
        token: payload.token,
        user: { id: payload.userId, email: payload.email }
    };
  } else {
    throw new Error('Respuesta del servidor sin token válido');
  }
};

export const logout = () => {
  Cookies.remove('token', { path: '/' }); // Importante borrar con el mismo path
  Cookies.remove('userId', { path: '/' });
  window.location.href = '/login';
};

export const register = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
     const errorData = await res.json();
     throw new Error(errorData.message || 'Error en el registro');
  }
  
  return res.json();
};

export const loginWithGitHub = async (code: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/github`, { // Asumiendo que tu backend escucha en /auth/github
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('GitHub auth error:', res.status, errorData);
    throw new Error(errorData.message || 'Error al autenticar con GitHub');
  }

  const response = await res.json();
  const payload = response.data || response;

  if (payload.token) {
    Cookies.set('token', payload.token, { expires: 1, path: '/' });
    if (payload.userId) Cookies.set('userId', payload.userId, { path: '/' });
    
    return {
        token: payload.token,
        user: { id: payload.userId, email: payload.email }
    };
  } else {
    throw new Error('No se recibió token de GitHub');
  }
};

// --- REQUESTS SERVICES ---

export const getRequests = async (serverToken?: string): Promise<TravelRequest[]> => {
  const res = await fetch(`${API_URL}/requests`, {
    method: 'GET',
    headers: getAuthHeaders(serverToken),
    cache: 'no-store', 
  });

  if (!res.ok) {
      if (res.status === 401) return [];
      throw new Error('Error al obtener solicitudes');
  }

  // Nota: Si tu endpoint de requests TAMBIÉN envuelve en "data", 
  // habría que hacer lo mismo aquí. Asumimos por ahora que devuelve el array directo.
  return res.json();
};

export const createRequest = async (destination: string, date: string) => {
  const res = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ destination, date }),
  });

  if (!res.ok) throw new Error('Error al crear solicitud');
  return res.json();
};

export const deleteRequest = async (id: string) => {
  const res = await fetch(`${API_URL}/requests/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Error al eliminar solicitud');
  return res.json();
};