'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/api';
import Cookies from 'js-cookie';

export default function GitHubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Procesando autenticación...');
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get('code');

    if (code) {
      // Limpiar sesión previa para evitar colisión de datos entre usuarios
      Cookies.remove('token', { path: '/' });
      Cookies.remove('userId', { path: '/' });

      authService.loginWithGitHub(code)
        .then(() => {
          window.location.href = '/dashboard';
        })
        .catch((error: unknown) => {
          console.error('GitHub auth error:', error);
          setStatus('Error al autenticar con GitHub. Intenta nuevamente.');
          setTimeout(() => router.push('/login'), 3000);
        });
    } else {
      setStatus('No se recibió código de GitHub.');
      setTimeout(() => router.push('/login'), 3000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">{status}</p>
      </div>
    </div>
  );
}