export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'client';
  dni?: string; // RUT formateado
  avatar?: string;
}

export interface TravelRequest {
  id: string;             // ID correlativo (ej: 1118) generado por el backend
  dni: string;           // DNI/RUT del pasajero
  passengerName: string; // Nombre del pasajero
  origin: string;        // Ciudad de origen
  destination: string;   // Ciudad de destino
  tripType: 'negocios' | 'turismo' | 'otros';
  linkedUserId: string;   // ID del usuario cliente en el sistema
  linkedUserName: string; // Nombre del cliente (para el buscador)
  departureDate: string;  // Fecha y hora de salida
  returnDate: string;     // Fecha y hora de regreso
  registrationDate: string; // Fecha de registro (automática)
  status: 'pendiente' | 'en_proceso' | 'finalizada';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}