// src/components/dashboard/CreateRequestForm.tsx
'use client'; // Importante: Componente de cliente

import { useState } from 'react';
import { createRequest } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function CreateRequestForm() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !date) return;

    setLoading(true);
    try {
      await createRequest(destination, date);
      setDestination('');
      setDate('');
      // Truco clave de SSR: Refrescamos la ruta para que el servidor vuelva a pedir los datos
      router.refresh(); 
    } catch (error) {
      alert('Error al crear la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Nueva Solicitud</h3>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Ej. París, Francia"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 h-10"
        >
          {loading ? '...' : 'Crear'}
        </button>
      </form>
    </div>
  );
}