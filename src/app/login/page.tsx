// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/api';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    try {
      // 1. Llamamos al servicio de login real
      await login(credentials.email, credentials.password);
      
      // 2. Redirección forzada para asegurar que el SSR lea la cookie
      window.location.href = "/dashboard"; 
    } catch (err) {
      setError('Credenciales inválidas o error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 relative bg-background-light overflow-hidden">
        {/* Decoración de fondo idéntica a tu diseño original */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        {/* Componente del formulario */}
        <div className="relative z-10">
            <LoginForm 
                onSubmit={handleLogin} 
                isLoading={loading} 
                error={error} 
            />
        </div>
    </div>
  );
}