import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trophy, X } from "lucide-react";
import { BUSES } from "./data/buses.js";
import { comprimirImagen } from "./utils/comprimirImagen.js";
import { useCapturas } from "./hooks/useCapturas.js";
import { useUbicacion } from "./hooks/useUbicacion.js";
import { useSonido } from "./hooks/useSonido.js";
import Intro from "./components/Intro.jsx";
import Header from "./components/Header.jsx";
import Filtros from "./components/Filtros.jsx";
import Grilla from "./components/Grilla.jsx";
import BotonCamara from "./components/BotonCamara.jsx";
import BarraNavegacion from "./components/BarraNavegacion.jsx";
import ModalEscaner from "./components/ModalEscaner.jsx";
import ModalAsignar from "./components/ModalAsignar.jsx";
import RevelacionCaptura from "./components/RevelacionCaptura.jsx";
import ModalDetalle from "./components/ModalDetalle.jsx";
import VistaMapa from "./components/VistaMapa.jsx";
import VistaLogros from "./components/VistaLogros.jsx";
import VistaInicio from "./components/VistaInicio.jsx";
import ToastLogro from "./components/ToastLogro.jsx";
import Confeti from "./components/Confeti.jsx";
import ModoPadres from "./components/ModoPadres.jsx";

const FILTRO_INICIAL = { estado: "todas", tipo: "Todos", zona: "Todas", rareza: "Todas" };

function introPendiente() {
  try {
    return sessionStorage.getItem("microdex:intro:v1") !== "vista";
  } catch {
    return false;
  }
}

export default function App() {
  const {
    capturas,
    logros,
    errorAlmacenamiento,
    bytesUsados,
    registrarCaptura,
    actualizarCoordenadas,
    liberarCaptura,
    desbloquearLogros,
    restaurarDatos,
    borrarTodo,
    limpiarError,
  } = useCapturas();
  const { obtenerUbicacion } = useUbicacion();
  const { activado: sonidoActivado, alternar: alternarSonido, sonar } = useSonido();

  const [pestañaActiva, setPestañaActiva] = useState("inicio");
  const [filtro, setFiltro] = useState(FILTRO_INICIAL);
  const [mostrarIntro, setMostrarIntro] = useState(introPendiente);
  const [modoPadres, setModoPadres] = useState(false);
  const [escanerAbierto, setEscanerAbierto] = useState(false);
  const [escanerTerminado, setEscanerTerminado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [pendiente, setPendiente] = useState(null);
  const [asignarAbierto, setAsignarAbierto] = useState(false);
  const [revelacion, setRevelacion] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [aviso, setAviso] = useState("");
  const [colaLogros, setColaLogros] = useState([]);
  const [celebracionCompleta, setCelebracionCompleta] = useState(false);

  const contadorTitulo = useRef({ cantidad: 0, tiempo: 0 });
  const pendienteRef = useRef(null);
  const capturaPorId = useMemo(
    () => Object.fromEntries(capturas.map((captura) => [captura.busId, captura])),
    [capturas],
  );

  const terminarIntro = useCallback(() => {
    try {
      sessionStorage.setItem("microdex:intro:v1", "vista");
    } catch {
      // La presentación igual se cierra aunque la sesión no esté disponible.
    }
    setMostrarIntro(false);
  }, []);

  useEffect(() => {
    if (!aviso) return undefined;
    const temporizador = window.setTimeout(() => setAviso(""), 5200);
    return () => window.clearTimeout(temporizador);
  }, [aviso]);

  useEffect(() => {
    if (!escanerTerminado || !pendiente?.foto) return;
    setAsignarAbierto(true);
  }, [escanerTerminado, pendiente?.foto]);

  const iniciarCaptura = useCallback(
    async (archivo) => {
      setAviso("");
      limpiarError();
      setAsignarAbierto(false);
      setEscanerTerminado(false);
      setPendiente(null);
      setEscanerAbierto(true);

      const registroTemporal = { foto: null, coordenadas: null };
      pendienteRef.current = registroTemporal;

      registroTemporal.ubicacionPromise = obtenerUbicacion()
        .then((coordenadas) => {
          if (pendienteRef.current !== registroTemporal) return coordenadas;
          registroTemporal.coordenadas = coordenadas;
          setPendiente({ ...registroTemporal });
          return coordenadas;
        })
        .catch(() => null);

      try {
        const foto = await comprimirImagen(archivo);
        if (pendienteRef.current !== registroTemporal) return;
        registroTemporal.foto = foto;
        setPendiente({ ...registroTemporal });
      } catch (error) {
        pendienteRef.current = null;
        setEscanerAbierto(false);
        setEscanerTerminado(false);
        setAviso(error?.message || "No se pudo preparar la fotografía.");
      }
    },
    [limpiarError, obtenerUbicacion],
  );

  const terminarEscaner = useCallback(() => {
    setEscanerAbierto(false);
    setEscanerTerminado(true);
  }, []);

  const asignarBus = useCallback(
    (bus, recorrido) => {
      const registroTemporal = pendienteRef.current;
      if (!registroTemporal?.foto) return;
      setGuardando(true);
      const nuevaCaptura = {
        busId: bus.id,
        foto: registroTemporal.foto,
        fecha: new Date().toISOString(),
        coordenadas: registroTemporal.coordenadas,
        recorrido: recorrido || "",
      };

      const guardada = registrarCaptura(nuevaCaptura);
      if (!guardada) {
        setGuardando(false);
        return;
      }

      if (!nuevaCaptura.coordenadas && registroTemporal.ubicacionPromise) {
        registroTemporal.ubicacionPromise.then((coordenadas) => {
          if (!coordenadas) return;
          const capturasConUbicacion = actualizarCoordenadas(bus.id, nuevaCaptura.fecha, coordenadas);
          if (!capturasConUbicacion) return;
          const logrosGps = desbloquearLogros(capturasConUbicacion);
          if (logrosGps.length) {
            setColaLogros((actuales) => [...actuales, ...logrosGps]);
            if (logrosGps.some((logro) => logro.id === "coleccion-completa")) {
              setCelebracionCompleta(true);
            }
          }
        });
      }

      const capturasActualizadas = [...capturas, nuevaCaptura];
      const nuevosLogros = desbloquearLogros(capturasActualizadas);
      if (nuevosLogros.length) {
        setColaLogros((actuales) => [...actuales, ...nuevosLogros]);
        if (nuevosLogros.some((logro) => logro.id === "coleccion-completa")) {
          setCelebracionCompleta(true);
        }
      }

      const tipoSonido = bus.rareza === "Legendaria" ? "legendaria" : bus.rareza === "Épica" ? "epica" : "exito";
      sonar(tipoSonido);
      if ("vibrate" in navigator) navigator.vibrate(bus.rareza === "Legendaria" ? [50, 40, 90] : 45);

      setRevelacion({ bus, captura: nuevaCaptura });
      setGuardando(false);
      setAsignarAbierto(false);
      setEscanerTerminado(false);
      setPendiente(null);
      pendienteRef.current = null;
      setPestañaActiva("coleccion");
    },
    [actualizarCoordenadas, capturas, desbloquearLogros, registrarCaptura, sonar],
  );

  const cancelarAsignacion = useCallback(() => {
    pendienteRef.current = null;
    setGuardando(false);
    setPendiente(null);
    setAsignarAbierto(false);
    setEscanerTerminado(false);
  }, []);

  const abrirDetalle = useCallback(
    (bus) => {
      const captura = capturaPorId[bus.id];
      if (captura) setDetalle({ bus, captura });
    },
    [capturaPorId],
  );

  const liberar = useCallback(
    (busId) => {
      const liberada = liberarCaptura(busId);
      if (liberada) {
        setDetalle(null);
        setAviso("Micro liberada. Ya puedes fotografiarla de nuevo.");
      }
    },
    [liberarCaptura],
  );

  const cerrarRevelacion = useCallback(() => setRevelacion(null), []);

  const cerrarToastLogro = useCallback(() => {
    setColaLogros((actuales) => actuales.slice(1));
  }, []);

  const cerrarCelebracion = useCallback(() => setCelebracionCompleta(false), []);

  const toqueTitulo = useCallback(() => {
    const ahora = Date.now();
    const anterior = contadorTitulo.current;
    const cantidad = ahora - anterior.tiempo > 1800 ? 1 : anterior.cantidad + 1;
    contadorTitulo.current = { cantidad, tiempo: ahora };

    if (cantidad >= 5) {
      setModoPadres((actual) => !actual);
      contadorTitulo.current = { cantidad: 0, tiempo: 0 };
      setAviso(modoPadres ? "Modo Padres desactivado." : "Modo Padres activado.");
    }
  }, [modoPadres]);

  const busesFiltrados = useMemo(
    () =>
      BUSES.filter((bus) => {
        const captura = capturaPorId[bus.id];
        if (filtro.estado === "capturadas" && !captura) return false;
        if (filtro.estado === "faltantes" && captura) return false;
        if (filtro.tipo !== "Todos" && bus.tipo !== filtro.tipo) return false;
        if (filtro.zona !== "Todas" && bus.zona !== filtro.zona) return false;
        if (filtro.rareza !== "Todas" && (!captura || bus.rareza !== filtro.rareza)) return false;
        return true;
      }),
    [capturaPorId, filtro],
  );

  const busesDisponibles = useMemo(
    () => BUSES.filter((bus) => !capturaPorId[bus.id]),
    [capturaPorId],
  );

  const restaurar = useCallback(
    (respaldo) => {
      const correcto = restaurarDatos(respaldo);
      if (correcto) setAviso("Respaldo restaurado correctamente.");
      return correcto;
    },
    [restaurarDatos],
  );

  const borrarTodoConfirmado = useCallback(() => {
    const correcto = borrarTodo();
    if (correcto) {
      setAviso("Colección borrada.");
      setModoPadres(false);
    }
  }, [borrarTodo]);

  return (
    <div className="app-shell min-h-screen">
        <Header
          capturas={capturas.length}
          total={BUSES.length}
          bytesUsados={bytesUsados}
          onTituloToque={toqueTitulo}
          sonidoActivado={sonidoActivado}
          onAlternarSonido={alternarSonido}
        />

        <main className={"app-main mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8 " + (pestañaActiva === "inicio" ? "app-main-inicio" : "")}>
        {(aviso || errorAlmacenamiento) && (
          <div className={"aviso-app rounded-xl border px-4 py-3 text-sm " + (errorAlmacenamiento ? "aviso-error" : "aviso-normal")} role={errorAlmacenamiento ? "alert" : "status"}>
            <div className="flex items-start justify-between gap-3">
              <span>{errorAlmacenamiento || aviso}</span>
              <button
                type="button"
                className="shrink-0 text-lg leading-5 text-zinc-400"
                onClick={() => {
                  setAviso("");
                  limpiarError();
                }}
                aria-label="Cerrar aviso"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <div key={pestañaActiva} className="anim-tab">
          {pestañaActiva === "coleccion" && (
            <section aria-labelledby="titulo-coleccion">
              <div className="mb-4">
                <p className="eyebrow">Tu álbum</p>
                <h2 id="titulo-coleccion" className="titulo-seccion">Colección</h2>
              </div>
              <div className="resumen-coleccion">
                <div className="resumen-coleccion-cabecera">
                  <strong>{capturas.length} <span>/ {BUSES.length} micros</span></strong>
                  <span>{BUSES.length ? Math.round((capturas.length / BUSES.length) * 100) : 0}% completo</span>
                </div>
                <div className="barra-progreso" role="progressbar" aria-label="Progreso de la colección" aria-valuemin="0" aria-valuemax={BUSES.length} aria-valuenow={capturas.length}>
                  <div className="barra-progreso-valor" style={{ width: (BUSES.length ? (capturas.length / BUSES.length) * 100 : 0) + "%" }} />
                </div>
                <p>{BUSES.length - capturas.length} por descubrir · toca una tarjeta para ver su ficha</p>
              </div>
              <Filtros filtro={filtro} onChange={setFiltro} />
              <Grilla
                buses={busesFiltrados}
                capturaPorId={capturaPorId}
                modoPadres={modoPadres}
                onAbrir={abrirDetalle}
              />
            </section>
          )}
          {pestañaActiva === "inicio" && (
            <VistaInicio
              buses={BUSES}
              capturas={capturas}
              logrosDesbloqueados={logros}
              onCapturar={iniciarCaptura}
              onCompleta={() => setAviso("Tu colección está completa. Libera una micro desde su ficha para volver a fotografiarla.")}
              onCambiarMapa={() => setPestañaActiva("mapa")}
              onAbrirDetalle={abrirDetalle}
            />
          )}
          {pestañaActiva === "mapa" && <VistaMapa capturas={capturas} obtenerUbicacion={obtenerUbicacion} onAbrir={abrirDetalle} />}
          {pestañaActiva === "logros" && <VistaLogros logrosDesbloqueados={logros} />}
        </div>

        {modoPadres && (
          <ModoPadres
            capturas={capturas}
            logros={logros}
            onRestaurar={restaurar}
            onBorrarTodo={borrarTodoConfirmado}
          />
        )}
        </main>

      <div className="barra-inferior-fija">
        <div className="barra-inferior-interior mx-auto w-full max-w-6xl">
          {pestañaActiva !== "inicio" && (
            <div className="barra-accion-camara">
              <BotonCamara
                bloqueado={capturas.length >= BUSES.length}
                onArchivo={iniciarCaptura}
                onCompleta={() => setAviso("Tu colección está completa. Libera una micro desde su ficha para volver a fotografiarla.")}
              />
            </div>
          )}
          <BarraNavegacion activa={pestañaActiva} onCambiar={setPestañaActiva} />
        </div>
      </div>

      {mostrarIntro && <Intro onTerminar={terminarIntro} />}
      {escanerAbierto && (
        <ModalEscaner
          onCompletar={terminarEscaner}
          onBip={sonar}
        />
      )}
      {asignarAbierto && pendiente?.foto && (
        <ModalAsignar
          foto={pendiente.foto}
          busesDisponibles={busesDisponibles}
          onAsignar={asignarBus}
          onCancelar={cancelarAsignacion}
          guardando={guardando}
          errorAlmacenamiento={errorAlmacenamiento}
          modoPadres={modoPadres}
        />
      )}
      {detalle && (
        <ModalDetalle
          bus={detalle.bus}
          captura={detalle.captura}
          modoPadres={modoPadres}
          onCerrar={() => setDetalle(null)}
          onLiberar={liberar}
        />
      )}
      {revelacion && (
        <RevelacionCaptura
          bus={revelacion.bus}
          captura={revelacion.captura}
          onCerrar={cerrarRevelacion}
        />
      )}
      {colaLogros.length > 0 && !revelacion && (
        <ToastLogro logro={colaLogros[0]} onCerrar={cerrarToastLogro} />
      )}
      {celebracionCompleta && !revelacion && (
        <div className="celebracion-completa" role="dialog" aria-modal="true" aria-labelledby="coleccion-completa-titulo">
          <Confeti cantidad={120} duracion={9000} tipo="dorado" continuo />
          <div className="relative z-10 text-center">
            <Trophy className="mx-auto text-amber-300" size={58} strokeWidth={1.8} aria-hidden="true" />
            <h2 id="coleccion-completa-titulo" className="mt-4 text-3xl font-black text-amber-200">¡Colección completa!</h2>
            <p className="mt-2 text-zinc-200">Capturaste todas las micros del catálogo.</p>
            <button type="button" onClick={cerrarCelebracion} className="boton-revelacion mt-6 rounded-xl px-6 py-3 font-black text-zinc-950">¡Qué buena!</button>
          </div>
        </div>
      )}
    </div>
  );
}
