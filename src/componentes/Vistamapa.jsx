import React, { useEffect, useState, useRef } from "react";
import { MapContainer, Marker, useMap, ZoomControl } from "react-leaflet";
import { Layers, Map, Mountain, Moon, Target } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import miAutoSvgRaw from "../imagenes/mi-auto.svg?raw";

// 1. COMPONENTE PARA CONTROLAR EL CENTRADO INTELIGENTE POR PÍXELES
function CambiarVista({ centro, idVehiculo }) {
  const mapa = useMap();
  const ultimoIdCentrado = useRef(null);
  useEffect(() => {
    if (centro && centro[0] && centro[1]) {
      if (ultimoIdCentrado.current !== idVehiculo) {
        const zoomActual = mapa.getZoom();

        const puntoProyecto = mapa.project([centro[0], centro[1]], zoomActual);
        const esMovil = window.innerWidth < 768;
        const compensacionPixeles = esMovil ? 120 : 50;

        const puntoCompensado = L.point(
          puntoProyecto.x,
          puntoProyecto.y + compensacionPixeles,
        );
        const coordenadaCompensada = mapa.unproject(
          puntoCompensado,
          zoomActual,
        );

        mapa.setView(coordenadaCompensada, zoomActual, {
          animate: true,
          duration: 0.5,
        });

        ultimoIdCentrado.current = idVehiculo;
      }
    }
  }, [centro[0], centro[1], idVehiculo, mapa]);

  return null;
}

// 2. COMPONENTE PARA LA TRANSICIÓN SUAVE ENTRE CAPAS (FADE EFFECT)
function CapaConFade({ url, attribution }) {
  const mapa = useMap();
  const capaRef = useRef(null);

  useEffect(() => {
    if (!mapa) return;

    const nuevaCapa = L.tileLayer(url, { attribution });

    if (capaRef.current) {
      nuevaCapa.setOpacity(0);
      nuevaCapa.addTo(mapa);

      const capaVieja = capaRef.current;
      capaRef.current = nuevaCapa;

      let opacidad = 0;
      const intervalo = setInterval(() => {
        opacidad += 0.1;
        if (opacidad >= 1) {
          nuevaCapa.setOpacity(1);
          mapa.removeLayer(capaVieja);
          clearInterval(intervalo);
        } else {
          nuevaCapa.setOpacity(opacidad);
          capaVieja.setOpacity(1 - opacidad);
        }
      }, 30);
    } else {
      nuevaCapa.addTo(mapa);
      capaRef.current = nuevaCapa;
    }
  }, [url, mapa]);

  return null;
}

// 3. GENERADOR DEL ICONO PERSONALIZADO DEL VEHÍCULO
const crearIconoAutomovil = (rumbo = 0, velocidad = 0) => {
  const estaEnMovimiento = velocidad > 0;
  const colorTuBase = "#00bb9b";
  const colorOscuroFondo = "#131b44";

  const svgProcesado = miAutoSvgRaw.replace(
    "<svg",
    `<svg class="w-7 h-7 ${estaEnMovimiento ? "animate-pulse" : ""}" style="fill: ${colorOscuroFondo};"`,
  );

  return L.divIcon({
    html: `
      <div class="flex items-center justify-center rounded-full"
           style="width: 48px; height: 48px; background-color: ${colorTuBase}; box-shadow: 0 0 16px ${colorTuBase}; transform: rotate(${rumbo}deg); transform-origin: center center; transition: transform 0.4s ease-in-out;">
        
        <div class="w-10 h-10 rounded-full flex items-center justify-center border border-white/30" 
             style="background: ${colorTuBase};">
          
          <div class="w-full h-full flex items-center justify-center relative">
            
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute -top-1" style="overflow: visible;">
              <path d="M12 1L15 4.5H13.2V6.5H10.8V4.5H9L12 1Z" 
                    fill="${colorOscuroFondo}" 
                    stroke="${colorTuBase}" 
                    stroke-width="1" 
                    stroke-linejoin="round" />
            </svg>

            ${svgProcesado}

          </div>
        </div>
      </div>
    `,
    className: "bg-transparent border-none shadow-none",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

const MAPAS_DISPONIBLES = {
  vial: {
    nombre: "Mapa Vial",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap",
    icon: Map,
  },
  satelital: {
    nombre: "Satélite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
    icon: Layers,
  },
  topografico: {
    nombre: "Topográfico",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap",
    icon: Mountain,
  },
  oscuro: {
    nombre: "Modo Oscuro",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO",
    icon: Moon,
  },
};

export default function VistaMapa({ posicion }) {
  const coordenadaReal = posicion
    ? [posicion.latitude, posicion.longitude]
    : [4.6097, -74.0817];

  const [capaActiva, setCapaActiva] = useState(() => {
    return document.documentElement.classList.contains("dark")
      ? "oscuro"
      : "vial";
  });

  const [menuAbierto, setMenuAbierto] = useState(false);

  const mapaRef = useRef(null);

  useEffect(() => {
    const observador = new MutationObserver(() => {
      const esOscuro = document.documentElement.classList.contains("dark");
      setCapaActiva(esOscuro ? "oscuro" : "vial");
    });

    observador.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observador.disconnect();
  }, []);

  const centrarMapaManual = () => {
    const mapa = mapaRef.current;
    if (!mapa || !coordenadaReal) return;

    const zoomActual = mapa.getZoom();
    const puntoProyecto = mapa.project(coordenadaReal, zoomActual);
    const esMovil = window.innerWidth < 768;
    const compensacionPixeles = esMovil ? 120 : 50;

    const puntoCompensado = L.point(
      puntoProyecto.x,
      puntoProyecto.y + compensacionPixeles,
    );
    const coordenadaCompensada = mapa.unproject(puntoCompensado, zoomActual);

    mapa.setView(coordenadaCompensada, zoomActual, {
      animate: true,
      duration: 0.5,
    });
  };

  return (
    <div className="w-full h-full relative">
{/* 🟢 CORREGIDO: El desplegable de capas ahora se renderiza por encima del botón de centrar */}
      <div className="absolute top-24 right-4 md:right-6 z-[100] pointer-events-auto flex flex-col items-end gap-2">
        

        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-expanded={menuAbierto}
          aria-label="Cambiar tipo de mapa o capas"
          className="flex items-center gap-2 p-3 bg-white/95 dark:bg-[#04050a]/95 backdrop-blur-md border border-slate-200 dark:border-[#00FFC2]/30 rounded-xl shadow-xl text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-[#00FFC2]/10 hover:border-slate-300 dark:hover:border-[#00FFC2] transition-all active:scale-95 duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FFC2]"
        >
          <Layers size={16} className="text-emerald-600 dark:text-[#00FFC2]" aria-hidden="true" />
          <span>Capas del Mapa</span>
        </button>

        <div className={`grid grid-cols-2 gap-2 p-3 bg-white/95 dark:bg-[#04050a]/95 backdrop-blur-md border border-slate-200 dark:border-[#00FFC2]/20 rounded-2xl shadow-2xl w-64 transition-all duration-300 transform origin-top-right ${
          menuAbierto ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none absolute'
        }`}>
          {Object.entries(MAPAS_DISPONIBLES).map(([id, info]) => {
            const IconoComponente = info.icon;
            const activo = capaActiva === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setCapaActiva(id);
                  setMenuAbierto(false);
                }}
                aria-pressed={activo}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center gap-1.5 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FFC2] ${
                  activo 
                    ? 'border-emerald-500 dark:border-[#00FFC2] bg-emerald-50/50 dark:bg-[#00FFC2]/10 text-emerald-700 dark:text-[#00FFC2] font-bold scale-105 shadow-md' 
                    : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 text-xs'
                }`}
              >
                <IconoComponente 
                  size={18} 
                  className={activo ? 'text-emerald-600 dark:text-[#00FFC2]' : 'text-slate-400 dark:text-slate-500'} 
                  aria-hidden="true" 
                />
                <span className="text-[11px] font-medium tracking-tight">{info.nombre}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={centrarMapaManual}
          aria-label="Centrar vista en el vehículo activo"
          className="flex items-center justify-center p-3 bg-white/95 dark:bg-[#04050a]/95 backdrop-blur-md border border-slate-200 dark:border-[#00FFC2]/30 rounded-xl shadow-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#00FFC2]/10 hover:border-slate-300 dark:hover:border-[#00FFC2] transition-all active:scale-95 duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FFC2]"
        >
          <Target size={16} className="text-emerald-600 dark:text-[#00FFC2]" aria-hidden="true" />
        </button>

      </div>
      {/* CONTENEDOR NATIVO DEL MAPA */}
      <MapContainer
        center={coordenadaReal}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false}
        ref={mapaRef} 
      >
        <CapaConFade
          url={MAPAS_DISPONIBLES[capaActiva].url}
          attribution={MAPAS_DISPONIBLES[capaActiva].attribution}
        />

        <ZoomControl position="bottomright" />
        <CambiarVista
          centro={coordenadaReal}
          idVehiculo={posicion ? posicion.deviceId : null}
        />

        {posicion && (
          <Marker
            position={coordenadaReal}
            alt="Ubicación y rumbo actual del vehículo"
            icon={crearIconoAutomovil(
              posicion.course || 0,
              posicion.speed || 0,
            )}
          />
        )}
      </MapContainer>
    </div>
  );
}
