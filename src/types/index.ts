export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'client';
  dni?: string;
  avatar?: string;
}

export interface TravelRequest {
  id: string;
  dni: string;
  passengerName: string;
  origin: string;
  destination: string;
  tripType: 'negocios' | 'turismo' | 'otros';
  linkedUserId: string;
  linkedUserName: string;
  departureDate: string;
  returnDate: string;
  registrationDate: string; // Generada automáticamente por el backend
  status: 'pendiente' | 'en_proceso' | 'finalizada';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}