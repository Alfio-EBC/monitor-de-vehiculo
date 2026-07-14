import React, { useState, useEffect } from "react";
import { Sun, Moon, Radio, Car, Search } from "lucide-react";
import EstadoError from "./componentes/Estadoerror";
import VistaMapa from "./componentes/Vistamapa";
import TarjetaTelemetria from "./componentes/TarjetaTelemetria";
import logoSimon from "./imagenes/logo-simon-movilidad.svg";

const API_BASE = "https://demo4.traccar.org/api";

const CIUDADES_SEMILLA = [
  { pais: "Colombia", ciudad: "Bogotá", lat: 4.6097, lon: -74.0817 },
  { pais: "Colombia", ciudad: "Medellín", lat: 6.2442, lon: -75.5812 },
  { pais: "Colombia", ciudad: "Cali", lat: 3.4516, lon: -76.532 },
  { pais: "Colombia", ciudad: "Ibagué", lat: 4.4389, lon: -75.2322 },
  { pais: "Perú", ciudad: "Lima", lat: -12.0464, lon: -77.0428 },
  { pais: "Argentina", ciudad: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
  { pais: "Chile", ciudad: "Santiago", lat: -33.4489, lon: -70.6693 },
  { pais: "México", ciudad: "CDMX", lat: 19.4326, lon: -99.1332 },
  { pais: "España", ciudad: "Madrid", lat: 40.4168, lon: -3.7038 },
];

export default function App() {
  const [paisSeleccionado, setPaisSeleccionado] = useState("Todos");
  const [modoOscuro, setModoOscuro] = useState(() => {
    const guardado = localStorage.getItem("theme");
    return guardado ? guardado === "dark" : true;
  });

  const [tabActiva, setTabActiva] = useState("flota");
  window.tabActiva = tabActiva;
  window.setTabActiva = setTabActiva;

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [dispositivos, setDispositivos] = useState([]);
  const [idDispositivoSeleccionado, setIdDispositivoSeleccionado] = useState("");
  const [posicionActual, setPosicionActual] = useState(null);

  const [datosEstructurados, setDatosEstructurados] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [cargandoFiltro, setCargandoFiltro] = useState(false);

  useEffect(() => {
    const raiz = window.document.documentElement;
    if (modoOscuro) {
      raiz.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      raiz.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [modoOscuro]);

  const cambiarPaisConEfecto = (pais) => {
    if (pais === paisSeleccionado) return;
    setCargandoFiltro(true);
    setPaisSeleccionado(pais);
    setTimeout(() => {
      setCargandoFiltro(false);
    }, 300);
  };

  const inicializarRastreador = async () => {
    setCargando(true);
    setError(null);

    try {
      const email = "demo@traccar.org";
      const password = "demo";
      const tokenAuth = btoa(`${email}:${password}`);

      const respuestaAuth = await fetch(`${API_BASE}/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Basic ${tokenAuth}`,
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        credentials: "include",
      });

      if (!respuestaAuth.ok) throw new Error(`Error de autenticación.`);

      const respuestaDispositivos = await fetch(`${API_BASE}/devices`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${tokenAuth}`,
        },
        credentials: "include",
      });

      if (!respuestaDispositivos.ok)
        throw new Error("No se recuperaron dispositivos.");

      const datosDispositivos = await respuestaDispositivos.json();
      const listaFlotaMasiva = [...datosDispositivos];
      const posicionesMasivas = [];

      for (let i = 0; i < 40; i++) {
        const semilla = CIUDADES_SEMILLA[i % CIUDADES_SEMILLA.length];
        const idFalso = 100000 + i;

        listaFlotaMasiva.push({
          id: idFalso,
          name: `Vehículo Comercial #${i + 10}`,
          status: Math.random() > 0.3 ? "online" : "offline",
          lastUpdate: new Date().toISOString(),
        });

        const desvioLat = (Math.random() - 0.5) * 0.005;
        const desvioLon = (Math.random() - 0.5) * 0.005;

        const rumbosPlanoUrbano = [0, 45, 90, 135, 180, 225, 270, 315];
        const rumboSimulado = rumbosPlanoUrbano[i % rumbosPlanoUrbano.length];

        posicionesMasivas.push({
          deviceId: idFalso,
          latitude: semilla.lat + desvioLat,
          longitude: semilla.lon + desvioLon,
          course: rumboSimulado,
          speed: Math.floor(Math.random() * 50) + 10,
          attributes: { ignición: true },
          pais: semilla.pais,
          ciudad: semilla.ciudad,
        });
      }

      setDispositivos(listaFlotaMasiva);
      window.posicionesFlotaCompleta = posicionesMasivas;

      if (posicionesMasivas.length > 0) {
        const primerDispositivoConMapa = posicionesMasivas[0].deviceId.toString();
        setIdDispositivoSeleccionado(primerDispositivoConMapa);

        // CORREGIDO: Inicializamos posicionActual de forma directa sin latCamara alterada
        setPosicionActual(posicionesMasivas[0]);
      } else if (listaFlotaMasiva.length > 0) {
        setIdDispositivoSeleccionado(listaFlotaMasiva[0].id.toString());
      }

      const estructuraGeografica = {};
      posicionesMasivas.forEach((pos) => {
        if (!estructuraGeografica[pos.pais]) {
          estructuraGeografica[pos.pais] = {};
        }
        if (!estructuraGeografica[pos.pais][pos.ciudad]) {
          estructuraGeografica[pos.pais][pos.ciudad] = [];
        }
        estructuraGeografica[pos.pais][pos.ciudad].push(pos);
      });

      setDatosEstructurados(estructuraGeografica);
      setCargando(false);
    } catch (err) {
      setError(err.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    inicializarRastreador();
  }, []);

  // CORREGIDO: Evita re-renders innecesarios y elimina totalmente la compensación manual de latitud
  useEffect(() => {
    if (!idDispositivoSeleccionado) return;

    const actualizarPosicionActivo = () => {
      if (window.posicionesFlotaCompleta) {
        const posEncontrada = window.posicionesFlotaCompleta.find(
          (p) => p.deviceId.toString() === idDispositivoSeleccionado.toString(),
        );
        if (posEncontrada) {
          setPosicionActual((prev) => {
            // Si el vehículo, las coordenadas, el rumbo y la velocidad son exactamente iguales, no actualizamos el estado
            if (
              prev &&
              prev.deviceId.toString() === posEncontrada.deviceId.toString() &&
              prev.latitude === posEncontrada.latitude &&
              prev.longitude === posEncontrada.longitude &&
              prev.course === posEncontrada.course &&
              prev.speed === posEncontrada.speed
            ) {
              return prev;
            }
            return posEncontrada;
          });
        }
      }
    };

    actualizarPosicionActivo();
    const intervalo = setInterval(actualizarPosicionActivo, 4000);
    return () => clearInterval(intervalo);
  }, [idDispositivoSeleccionado]);

  const dispositivoActivo = dispositivos.find(
    (d) => d.id.toString() === idDispositivoSeleccionado.toString(),
  );

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* MAPA */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <VistaMapa posicion={posicionActual} />
      </div>

      {/* CAPA DE INTERFAZ */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between" role="main">
        <header className="w-full flex items-center justify-between pointer-events-auto bg-[#04050a]/90 backdrop-blur-md border-x-0 border-t-0 border-b border-slate-200 dark:border-[#00FFC2]/20 p-3 md:px-6 rounded-none shadow-lg transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <img
                src={logoSimon}
                alt="Logo Simón Movilidad"
                className="w-21 h-8 object-contain"
              />
              
              <div className="w-px h-6 bg-slate-800" aria-hidden="true" />

              <div>
                <h1 className="text-sm font-bold tracking-tight leading-none mb-1 text-white">
                  Sala de Control
                </h1>
                <p className="text-[10px] text-slate-400">
                  Logística de Flotas
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setModoOscuro(!modoOscuro)}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#00ffc2]/30 bg-white dark:bg-[#04050a] hover:bg-slate-50 dark:hover:bg-[#00ffc2]/10 hover:border-slate-300 dark:hover:border-[#00ffc2] transition-all duration-300 cursor-pointer"
          >
            {modoOscuro ? (
              <Sun size={16} className="text-emerald-500 dark:text-[#00FFC2]" />
            ) : (
              <Moon size={16} className="text-emerald-500 dark:text-[#00FFC2]" />
            )}
          </button>
        </header>

        {/* PANTALLA DE CARGA */}
        {cargando && (
          <div className="absolute inset-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center gap-4 pointer-events-auto z-50">
            <div className="p-5 bg-slate-950 rounded-full border border-[#00FFC2]/30 shadow-xl animate-bounce text-[#00FFC2]">
              <Car size={32} />
            </div>
            <span className="text-xs font-bold tracking-wide uppercase text-slate-700 dark:text-cyan-400">
              Sincronizando Sistema...
            </span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-4">
            <EstadoError message={error} onRetry={inicializarRastreador} />
          </div>
        )}

        {!cargando && !error && (
          <div className="absolute bottom-0 left-0 right-0 md:bottom-4 md:left-4 z-20 pointer-events-none w-full md:max-w-[340px] flex flex-col justify-end p-4 md:p-0">
            
            {/* Pestañas exclusivo para Móviles */}
            <div className="flex md:hidden bg-slate-100 dark:bg-[#04050a]/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 mb-2 pointer-events-auto shadow-md">
              <button
                onClick={() => window.setTabActiva?.("flota")}
                className={`flex-1 py-1.5 text-center text-[10px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                  (window.tabActiva || "flota") === "flota"
                    ? "bg-[#00FFC2] text-slate-950 shadow"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                vehículos ({dispositivos.length})
              </button>
              <button
                onClick={() => window.setTabActiva?.("telemetria")}
                className={`flex-1 py-1.5 text-center text-[10px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                  window.tabActiva === "telemetria"
                    ? "bg-[#00FFC2] text-slate-950 shadow"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Telemetría
              </button>
            </div>

            <div className="flex flex-col gap-3 pointer-events-auto max-h-[60vh] md:max-h-[75vh]">
              
              <section
                className={`bg-white/95 dark:bg-[#04050a]/95 backdrop-blur-md border border-slate-200 dark:border-[#00ffc2]/20 rounded-2xl p-3 shadow-xl w-full flex flex-col h-[280px] md:h-[260px] overflow-hidden transition-all duration-300 ${
                  (window.tabActiva || "flota") === "flota" ? "flex" : "hidden md:flex"
                }`}
                aria-label="Panel de vehículos"
              >
                <div className="flex flex-col gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Car
                        size={14}
                        className="text-emerald-500 dark:text-[#00FFC2]"
                      />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Vehículos monitoreados
                      </h2>
                    </div>
                    <span className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                      {dispositivos.length} Uds
                    </span>
                  </div>

                  <div className="relative w-full">
                    <Search
                      size={12}
                      className="absolute left-2.5 top-2 text-slate-500 dark:text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Filtrar..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-8 pr-3 py-1 bg-slate-100 border border-slate-200 dark:border-none dark:bg-slate-800 rounded-xl text-xs font-semibold focus:outline-none text-slate-800 placeholder-slate-500 dark:text-white dark:placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Desplegable países */}
                <div className="relative mb-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                     const parent = e.currentTarget.parentElement;
                      const menu = parent.querySelector('.dropdown-menu');
                      if (menu) {
                        const isHidden = menu.classList.contains('hidden');
                        menu.classList.toggle('hidden', !isHidden);
                        e.currentTarget.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
                      }
                    }}
                    aria-haspopup="listbox"
                    aria-expanded="false"
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl border text-[10px] font-extrabold uppercase transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FFC2] ${
                      paisSeleccionado !== "Todos"
                        ? "border-emerald-500 dark:border-[#00FFC2] bg-emerald-50 dark:bg-[#00FFC2]/15 text-emerald-800 dark:text-[#00FFC2]"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {paisSeleccionado === "Todos" ? "Filtrar por País" : `País: ${paisSeleccionado}`}
                    </span>
                    <span className="text-[8px]">▼</span>
                  </button>

                  <div className="dropdown-menu hidden absolute left-0 right-0 mt-1 bg-white dark:bg-[#04050a] border border-slate-200 dark:border-[#00FFC2]/30 rounded-xl shadow-2xl z-30 max-h-36 overflow-y-auto">
                    <button
                      onClick={(e) => {
                        cambiarPaisConEfecto("Todos");
                        e.currentTarget.parentElement.classList.add('hidden');
                      }}
                      className={`w-full text-left px-3 py-2 text-[10px] font-extrabold uppercase hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                        paisSeleccionado === "Todos"
                          ? "bg-[#00FFC2] text-slate-950"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      Todos
                    </button>
                    {Object.keys(datosEstructurados).map((pais) => (
                      <button
                        key={pais}
                        onClick={(e) => {
                          cambiarPaisConEfecto(pais);
                          e.currentTarget.parentElement.classList.add('hidden');
                        }}
                        className={`w-full text-left px-3 py-2 text-[10px] font-extrabold uppercase border-t border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                          paisSeleccionado === pais
                            ? "bg-[#00FFC2] text-slate-950"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {pais}
                      </button>
                    ))}
                  </div>
                </div>

                {cargandoFiltro ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2 text-emerald-600 dark:text-[#00FFC2]">
                    <div className="p-2 bg-emerald-500/10 dark:bg-[#00FFC2]/10 rounded-full border border-emerald-500/20 dark:border-[#00FFC2]/20 animate-bounce">
                      <Car size={16} />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest animate-pulse">
                      Filtrando...
                    </span>
                  </div>
                ) : (
                  <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                    {Object.entries(datosEstructurados)
                      .filter(
                        ([pais]) =>
                          paisSeleccionado === "Todos" ||
                          paisSeleccionado === pais,
                      )
                      .map(([pais, ciudades]) => (
                        <div key={pais} className="space-y-1">
                          <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500">
                            📍 {pais}
                          </h3>

                          {Object.entries(ciudades)
                            .filter(
                              ([ciudad]) =>
                                ciudad
                                  .toLowerCase()
                                  .includes(busqueda.toLowerCase()) ||
                                pais
                                  .toLowerCase()
                                  .includes(busqueda.toLowerCase()),
                            )
                            .map(([ciudad, carros]) => (
                              <div
                                key={ciudad}
                                className="flex flex-col gap-1 pl-1"
                              >
                                <div className="flex items-center justify-between p-1 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
                                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                    {ciudad}
                                  </span>
                                  <span className="bg-emerald-100 dark:bg-[#00FFC2]/15 text-emerald-800 dark:text-[#00FFC2] text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                    {carros.length}
                                  </span>
                                </div>

                                <div className="pl-1 space-y-0.5 max-h-24 overflow-y-auto">
                                  {carros.map((carro) => {
                                    const dispositivoInfo = dispositivos.find(
                                      (d) =>
                                        d.id.toString() ===
                                        carro.deviceId.toString(),
                                    );
                                    const estaActivo =
                                      idDispositivoSeleccionado.toString() ===
                                      carro.deviceId.toString();

                                    return (
                                      <button
                                        key={carro.deviceId}
                                        onClick={() => {
                                          setIdDispositivoSeleccionado(carro.deviceId.toString());
                                          if (window.innerWidth < 768) {
                                            window.setTabActiva?.("telemetria");
                                          }
                                        }}
                                        className={`w-full flex items-center justify-between text-[10px] p-1 rounded hover:bg-emerald-50/50 dark:hover:bg-[#00FFC2]/5 text-left transition-colors cursor-pointer ${estaActivo ? "bg-emerald-500/10 dark:bg-[#00FFC2]/10 text-emerald-700 dark:text-[#00FFC2] font-extrabold border border-emerald-500/20 dark:border-[#00FFC2]/20" : "text-slate-500 dark:text-slate-400"}`}
                                      >
                                        <span className="truncate">
                                          🚘{" "}
                                          {dispositivoInfo
                                            ? dispositivoInfo.name
                                            : `Unidad #${carro.deviceId}`}
                                        </span>
                                        <span className="text-[9px] opacity-80">
                                          {carro.speed} km/h
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                )}
              </section>

              {/* Panel telemetria */}
              <div className={`w-full flex-shrink-0 ${
                window.tabActiva === "telemetria" ? "block" : "hidden md:block"
              }`}>
                <TarjetaTelemetria
                  dispositivoActivo={dispositivoActivo}
                  posicionActual={posicionActual}
                />
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}