import React from 'react';

export default function CargadorEsqueleto() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)] animate-pulse" aria-hidden="true">
      {/* Esqueleto del Panel Lateral */}
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
      {/* Esqueleto del Mapa */}
      <div className="lg:col-span-2 bg-slate-200 dark:bg-slate-800 rounded-xl h-full"></div>
    </div>
  );
}