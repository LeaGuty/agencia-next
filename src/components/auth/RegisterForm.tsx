'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import Link from 'next/link';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client' as 'agent' | 'client',
    dni: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validación de contraseña: 6+ caracteres, Mayúscula, Minúscula y Número
  const validatePassword = (pass: string) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasDigit = /\d/.test(pass);
    return pass.length >= 6 && hasUpperCase && hasLowerCase && hasDigit;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(formData.password)) {
      return setError('La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.');
    }

    setLoading(true);
    try {
      await authService.register(formData);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-600">Crear Cuenta</h2>
            <p className="text-gray-500 mt-2">Regístrate en el sistema de la agencia</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nombre Completo</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-black"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">DNI / RUT (Identificación)</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-black"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                placeholder="12.345.678-9"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-black"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-black"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
              <p className="text-[10px] text-gray-500 mt-1">Mín. 6 caracteres, incluye Mayúscula y Número.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Tipo de Usuario (Rol)</label>
              <select
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              >
                <option value="client">Cliente (Pasajero)</option>
                <option value="agent">Agente (Administrador)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Procesando...' : 'Registrar Cuenta'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}