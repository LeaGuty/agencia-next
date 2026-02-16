'use client';

import { travelService } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface RequestActionsProps {
  requestId: string;
  onDeleteSuccess: () => void;
}

export default function RequestActions({ requestId, onDeleteSuccess }: RequestActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await travelService.delete(requestId);
      onDeleteSuccess();
    } catch (error) {
      alert('Error al eliminar la solicitud');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-900 text-sm font-medium disabled:text-red-300"
      >
        {isDeleting ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  );
}