// src/components/dashboard/RequestActions.tsx
'use client';

import { deleteRequest } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RequestActions({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta solicitud?')) return;
    
    setIsDeleting(true);
    try {
      await deleteRequest(id);
      router.refresh(); // Recargamos la data del servidor
    } catch (error) {
      alert('Error al eliminar');
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-4 flex gap-2 justify-end">
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors"
      >
        {isDeleting ? 'Borrando...' : 'Eliminar'}
      </button>
      {/* Aquí podrías agregar un botón de Editar que abra un modal */}
    </div>
  );
}