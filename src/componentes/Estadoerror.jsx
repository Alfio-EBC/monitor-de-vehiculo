import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function EstadoError({ mensaje, alReintentar }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-[#080808] rounded-2xl shadow-2xl border border-[#00ffc2]/10 max-w-md mx-auto my-12">
      <div className="p-4 bg-[#00ffc2]/10 rounded-full text-[#00ffc2] mb-4 animate-bounce">
        <AlertTriangle size={40} />
      </div>
      
      <h2 className="text-xl font-bold text-white mb-2">
        Conexión Interrumpida
      </h2>
      
      <p className="text-sm text-slate-400 mb-6">
        {mensaje || "No pudimos conectar con el servidor. Esto puede deberse a credenciales inválidas o restricciones de red."}
      </p>
      
      <button
        onClick={alReintentar}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ffc2] hover:bg-[#00e0aa] text-[#080808] font-extrabold rounded-lg shadow-[0_0_15px_rgba(0,255,194,0.15)] transition-all transform active:scale-95 cursor-pointer"
        aria-label="Reintentar conectar a la API"
      >
        <RefreshCw size={16} />
        Reintentar Conexión
      </button>
    </div>
  );
}