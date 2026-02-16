'use client';

import { useState, useEffect } from 'react';
import { travelService, authService } from '@/services/api';
import { User } from '@/types';

interface CreateRequestFormProps {
  onSuccess: () => void;
}

export default function CreateRequestForm({ onSuccess }: CreateRequestFormProps) {
  const [clients, setClients] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    dni: '',
    passengerName: '',
    origin: '',
    destination: '',
    tripType: 'turismo' as 'negocios' | 'turismo' | 'otros',
    linkedUserId: '',
    linkedUserName: '',
    departureDate: '',
    returnDate: '',
    status: 'pendiente' as 'pendiente' | 'en_proceso' | 'finalizada'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar lista de clientes para el buscador/selector
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await authService.getClients();
        setClients(data);
      } catch (err) {
        console.error('Error al cargar clientes', err);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // El backend generará el ID 1118... y la fecha de registro automáticamente
      await travelService.create(formData);
      setFormData({
        dni: '',
        passengerName: '',
        origin: '',
        destination: '',
        tripType: 'turismo',
        linkedUserId: '',
        linkedUserName: '',
        departureDate: '',
        returnDate: '',
        status: 'pendiente'
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // Al seleccionar un cliente del buscador, autocompletamos su nombre y DNI
  const handleClientChange = (userId: string) => {
    const selectedClient = clients.find(c => c.id === userId);
    if (selectedClient) {
      setFormData({
        ...formData,
        linkedUserId: selectedClient.id,
        linkedUserName: selectedClient.name,
        passengerName: selectedClient.name,
        dni: selectedClient.dni || ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Nueva Solicitud de Viaje</h3>
      
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buscador de Clientes Registrados */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Asociar a Cliente Registrado (Búsqueda)</label>
          <select
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:ring-blue-500"
            value={formData.linkedUserId}
            onChange={(e) => handleClientChange(e.target.value)}
          >
            <option value="">Seleccione un cliente...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.dni})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">DNI Pasajero</label>
          <input
            type="text"
            required
            readOnly
            className="mt-1 block w-full rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-gray-500"
            value={formData.dni}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Pasajero</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            value={formData.passengerName}
            onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Origen</label>
          <input
            type="text"
            required
            placeholder="Ej: Santiago, Chile"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Destino</label>
          <input
            type="text"
            required
            placeholder="Ej: Madrid, España"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Viaje</label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            value={formData.tripType}
            onChange={(e) => setFormData({ ...formData, tripType: e.target.value as any })}
          >
            <option value="turismo">Turismo</option>
            <option value="negocios">Negocios</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Estado de la Solicitud</label>
          <div className="mt-2 flex space-x-4">
            {['pendiente', 'en_proceso', 'finalizada'].map((status) => (
              <label key={status} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{status.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha y Hora Salida</label>
          <input
            type="datetime-local"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            value={formData.departureDate}
            onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha y Hora Regreso</label>
          <input
            type="datetime-local"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            value={formData.returnDate}
            onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
      >
        {loading ? 'Registrando...' : 'Registrar Solicitud'}
      </button>
    </form>
  );
}