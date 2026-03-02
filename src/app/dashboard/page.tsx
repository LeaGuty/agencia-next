'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { travelService } from '@/services/api';
import { TravelRequest, User } from '@/types';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Lazy loading: el formulario usa APIs del navegador (localStorage), por eso ssr: false
const CreateRequestForm = dynamic(
  () => import('@/components/dashboard/CreateRequestForm'),
  {
    loading: () => (
      <div className="h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-gray-500">
        {/* placeholder while loading */}
      </div>
    ),
    ssr: false,
  }
);

export default function DashboardPage() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<TravelRequest[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadData = async () => {
    setLoading(true);
    try {
      // Delay artificial para mostrar el skeleton de carga al usuario
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const data = await travelService.getAll();
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadData();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (confirm(t('dashboard.requests.deleteConfirm'))) {
      await travelService.delete(id);
      loadData();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) return <DashboardSkeleton />;

  const statusColors: Record<string, string> = {
    finalizada: 'bg-green-100 text-green-700',
    en_proceso: 'bg-amber-100 text-amber-700',
    pendiente: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-600">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-500 text-sm">
            {t('dashboard.welcome')},{' '}
            <span className="font-bold">{user?.name}</span>
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs uppercase">
              {user?.role === 'agent'
                ? t('dashboard.roles.agent')
                : t('dashboard.roles.client')}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
          >
            {t('dashboard.logout')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Solo agentes pueden crear solicitudes */}
        {user?.role === 'agent' && (
          <div className="lg:col-span-1">
            <CreateRequestForm onSuccess={loadData} />
          </div>
        )}

        {/* Tabla de solicitudes */}
        <div
          className={
            user?.role === 'agent' ? 'lg:col-span-2' : 'lg:col-span-3'
          }
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-700">
                {t('dashboard.requests.title')}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {user?.role === 'agent' && (
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">
                        {t('dashboard.table.id')}
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">
                      {t('dashboard.table.passenger')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">
                      {t('dashboard.table.route')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">
                      {t('dashboard.table.status')}
                    </th>
                    {user?.role === 'agent' && (
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">
                        {t('dashboard.table.actions')}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      {user?.role === 'agent' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-blue-600">
                          #{req.id}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          {req.passengerName}
                        </div>
                        <div className="text-xs text-gray-500">{req.dni}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {req.origin} → {req.destination}
                        </div>
                        <div className="text-[10px] text-blue-500 font-bold uppercase">
                          {t(`dashboard.tripTypes.${req.tripType}`)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            statusColors[req.status] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {t(`dashboard.statuses.${req.status}`)}
                        </span>
                      </td>
                      {user?.role === 'agent' && (
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDelete(req.id)}
                            className="text-red-500 hover:text-red-700 font-bold transition-colors"
                          >
                            {t('dashboard.table.delete')}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {requests.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-gray-400 italic">
                    {t('dashboard.requests.empty')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
