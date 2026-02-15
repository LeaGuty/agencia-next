import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRequests } from '@/services/api';
import CreateRequestForm from '@/components/dashboard/CreateRequestForm';
import RequestActions from '@/components/dashboard/RequestActions';

export default async function DashboardPage() {
  // 1. Obtener cookie del servidor (Ahora con await)
  const cookieStore = await cookies(); 
  const token = cookieStore.get('token')?.value;

  // 2. Si no hay token, fuera de aquí
  if (!token) {
    redirect('/login');
  }

  // 3. Obtener datos (esto tardará 3 segundos por tu backend)
  const requests = await getRequests(token);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Solicitudes</h1>
          <form action={async () => {
            'use server';
            const { cookies } = require('next/headers');
            // También aquí necesitamos await si usas la versión nueva
            const store = await cookies(); 
            store.delete('token');
            redirect('/login');
          }}>
            <button className="text-gray-600 hover:text-red-600 font-medium">
              Cerrar Sesión
            </button>
          </form>
        </div>

        {/* Formulario (Cliente) */}
        <CreateRequestForm />

        {/* Lista de Resultados (Renderizada en Servidor) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-10">
              No tienes solicitudes de viaje pendientes.
            </p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{req.destination}</h2>
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${req.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      req.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'}`}>
                    {req.status === 'pending' ? 'Pendiente' : req.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Fecha:</span> {req.date}
                </p>
                <p className="text-xs text-gray-400">ID: {req.id.slice(0, 8)}...</p>

                <RequestActions id={req.id} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}