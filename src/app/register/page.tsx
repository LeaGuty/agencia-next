// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/api'; // Importamos la nueva función
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data: any) => {
    setError('');
    setLoading(true);

    try {
      await register(data.name, data.email, data.password);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 relative bg-background-light overflow-hidden">
        {/* Decoración de fondo (reutilizada para coherencia) */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
            <RegisterForm 
                onSubmit={handleRegister} 
                isLoading={loading} 
                error={error} 
            />
        </div>
    </div>
  );
}