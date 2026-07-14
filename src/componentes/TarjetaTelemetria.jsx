import React from "react";
import { Radio, Car, Gauge, Clock } from "lucide-react";

export default function TarjetaTelemetria({ dispositivoActivo, posicionActual }) {
  if (!dispositivoActivo) {
    return (
      <div className="bg-white/95 dark:bg-[#04050a]/95 backdrop-blur-md border border-slate-200 dark:border-[#00ffc2]/20 rounded-2xl p-4 shadow-xl text-center">
        <p className="text-xs text-slate-500">No hay telemetría disponible</p>
      </div>
    );
  }

  const esOnline = dispositivoActivo.status === "online";

  return (
    <section
      className="bg-white/95 dark:bg-[#04050a]/95 backdrop-blur-md border border-slate-200 dark:border-[#00ffc2]/20 rounded-2xl p-3 shadow-xl w-full flex flex-col gap-2 transition-all duration-300"
      aria-label="Telemetría del activo seleccionado"
    >
      {/* CABECERA DE LA TARJETA */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Telemetría del Activo
        </h2>
        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
          esOnline 
            ? "bg-emerald-500/10 text-emerald-700 dark:bg-[#00FFC2]/15 dark:text-[#00FFC2]" 
            : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
        }`}>
          {dispositivoActivo.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3 p-1.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/50">
          <div className="p-2 bg-emerald-500/10 dark:bg-[#00FFC2]/10 rounded-lg text-emerald-600 dark:text-[#00FFC2]">
            <Car size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Vehículo
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
              {dispositivoActivo.name}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 p-1.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/50">
          <div className="p-2 bg-emerald-500/10 dark:bg-[#00FFC2]/10 rounded-lg text-emerald-600 dark:text-[#00FFC2]">
            <Radio size={14} />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Conexión
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {esOnline ? "Conectado" : "Desconectado"}
            </p>
          </div>
        </div>
        {/*Velocidad */}
        <div className="flex items-center gap-3 p-1.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/50">
          <div className="p-2 bg-emerald-500/10 dark:bg-[#00FFC2]/10 rounded-lg text-emerald-600 dark:text-[#00FFC2]">
            <Gauge size={14} />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Velocidad
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {posicionActual ? `${posicionActual.speed} km/h` : "---"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-1.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/50">
          <div className="p-2 bg-emerald-500/10 dark:bg-[#00FFC2]/10 rounded-lg text-emerald-600 dark:text-[#00FFC2]">
            <Clock size={14} />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Último Reporte
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {posicionActual 
                ? new Date(dispositivoActivo.lastUpdate).toLocaleTimeString() 
                : "---"
              }
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}