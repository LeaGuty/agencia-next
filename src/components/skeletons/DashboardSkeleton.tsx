// src/components/skeletons/DashboardSkeleton.tsx
export default function DashboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Título Skeleton */}
      <div className="h-8 bg-gray-300 rounded w-1/3 mb-6 animate-pulse"></div>
      
      {/* Formulario Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>
      </div>

      {/* Lista de Tarjetas Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-8"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="mt-4 flex justify-end gap-2">
               <div className="h-8 bg-gray-300 rounded w-20"></div>
               <div className="h-8 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}