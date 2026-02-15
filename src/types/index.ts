// src/types/index.ts

export interface User {
  id: string;
  email: string;
  // Agrega más campos si tu backend devuelve nombre, rol, etc.
}

export interface AuthResponse {
  token: string;
  user: {       
    id: string;
    email: string;
  };
}

export interface TravelRequest {
  id: string;
  userId: string;
  destination: string;
  date: string; // O Date si lo transformamos
  status: 'pending' | 'confirmed' | 'cancelled'; // Limitamos los textos posibles
}