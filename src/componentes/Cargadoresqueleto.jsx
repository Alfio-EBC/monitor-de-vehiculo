import React from 'react';

export default function CargadorEsqueleto() {
  return (
    <div 
      className="absolute inset-0 w-full h-[100dvh] overflow-hidden bg-slate-100 dark:bg-slate-950 animate-pulse pointer-events-none z-50" 
      aria-hidden="true"
    >
      <header className="w-full flex items-center justify-between bg-[#04050a]/90 p-3 md:px-6 shadow-lg">
        <div className="flex items-center gap-3">
          {/* Logo simulado */}
          <div className="w-20 h-8 bg-slate-800 rounded-lg"></div>
          <div className="w-px h-6 bg-slate-800" />
          {/* Texto de cabecera simulado */}
          <div className="space-y-1">
            <div className="w-24 h-3 bg-slate-800 rounded"></div>
            <div className="w-16 h-2 bg-slate-700 rounded"></div>
          </div>
        </div>
        {/* Botón modo oscuro simulado */}
        <div className="w-9 h-9 bg-slate-800 rounded-xl"></div>
      </header>

      {/* Esqueleto del Mapa de Fondo */}
      <div className="absolute inset-0 w-full h-full bg-slate-200 dark:bg-slate-900 z-0"></div>

      {/*  Esqueleto de la Capa de Interfaz (Paneles Flotantes) */}
      <div className="absolute bottom-0 left-0 right-0 md:bottom-4 md:left-4 z-20 w-full md:max-w-[340px] flex flex-col justify-end p-4 md:p-0 gap-3">
        
        {/* Simulación de Pestañas Móviles */}
        <div className="flex md:hidden bg-slate-200 dark:bg-[#04050a]/90 p-1 rounded-xl gap-2 border border-slate-300 dark:border-slate-800">
          <div className="flex-1 h-7 bg-slate-300 dark:bg-slate-800 rounded-lg"></div>
          <div className="flex-1 h-7 bg-slate-300 dark:bg-slate-800 rounded-lg"></div>
        </div>

        {/* Panel simulado (Simula el buscador, botón país y la lista interna) */}
        <div className="bg-white/95 dark:bg-[#04050a]/95 border border-slate-200 dark:border-[#00ffc2]/20 rounded-2xl p-3 shadow-xl w-full flex flex-col h-[280px] md:h-[260px] gap-3">
          {/* Cabecera del panel flotante */}
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          
          {/* Buscador simulado */}
          <div className="w-full h-7 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
          
          {/* Selector de país simulado */}
          <div className="w-full h-7 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>

          {/* Items de lista simulados */}
          <div className="space-y-2 overflow-hidden flex-1">
            <div className="w-full h-6 bg-slate-100 dark:bg-slate-800/50 rounded"></div>
            <div className="w-5/6 h-6 bg-slate-100 dark:bg-slate-800/50 rounded"></div>
            <div className="w-full h-6 bg-slate-100 dark:bg-slate-800/50 rounded"></div>
          </div>
        </div>

      </div>
    </div>
  );
}