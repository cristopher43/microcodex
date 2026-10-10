import { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ArrowRight, BusFront, ChevronRight, LocateFixed, MapPinned, Search, X } from "lucide-react";
import L from "leaflet";
import { BUS_POR_ID } from "../data/buses.js";
import { rarezaSegura } from "../data/rarezas.js";
import { distanciaMetros } from "../utils/distancia.js";

const ICONO_MICRO_MAPA = renderToStaticMarkup(<BusFront size={20} strokeWidth={2.1} aria-hidden="true" />);

function fechaCorta(valor) {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(fecha);
}

function esReciente(captura) {
  const fecha = new Date(captura.fecha).getTime();
  return Number.isFinite(fecha) && Date.now() - fecha <= 7 * 24 * 60 * 60 * 1000;
}

export default function VistaMapa({ capturas, obtenerUbicacion, onAbrir }) {
  const contenedorRef = useRef(null);
  const mapaRef = useRef(null);
  const pinesRef = useRef(null);
  const ubicacionActualRef = useRef(null);
  const seleccionAnteriorRef = useRef(null);
  const [inicializado, setInicializado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [estadoGps, setEstadoGps] = useState("inactivo");

  const ubicadas = useMemo(
    () => capturas.filter((captura) => Number.isFinite(captura.coordenadas?.lat) && Number.isFinite(captura.coordenadas?.lng)),
    [capturas],
  );
  const coincidencias = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase("es-CL");
    return ubicadas.filter((captura) => {
      const bus = BUS_POR_ID[captura.busId];
      if (!bus) return false;
      const texto = [bus.nombre, bus.tipo, bus.zona, bus.rareza].join(" ").toLocaleLowerCase("es-CL");
      if (termino && !texto.includes(termino)) return false;
      if (filtro === "cercanas" && (!ubicacionActual || distanciaMetros(ubicacionActual, captura.coordenadas) > 500)) return false;
      if (filtro === "especiales" && bus.rareza === "Común") return false;
      if (filtro === "recientes" && !esReciente(captura)) return false;
      return true;
    });
  }, [ubicadas, busqueda, filtro, ubicacionActual]);
  const seleccionada = coincidencias.find((captura) => captura.busId === seleccionadaId) || coincidencias[0] || null;
  const busSeleccionado = seleccionada ? BUS_POR_ID[seleccionada.busId] : null;
  const distanciaSeleccionada = ubicacionActual && seleccionada
    ? distanciaMetros(ubicacionActual, seleccionada.coordenadas)
    : null;

  useEffect(() => {
    if (!contenedorRef.current || mapaRef.current) return undefined;

    const mapa = L.map(contenedorRef.current, { zoomControl: false }).setView([-33.45, -70.67], 12);
    L.control.zoom({ position: "topright" }).addTo(mapa);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);

    mapaRef.current = mapa;
    pinesRef.current = L.layerGroup().addTo(mapa);
    const ajuste = window.setTimeout(() => {
      mapa.invalidateSize();
      setInicializado(true);
    }, 80);

    return () => {
      window.clearTimeout(ajuste);
      mapa.remove();
      mapaRef.current = null;
      pinesRef.current = null;
      ubicacionActualRef.current = null;
    };
  }, []);

  useEffect(() => {
    const mapa = mapaRef.current;
    const pines = pinesRef.current;
    if (!inicializado || !mapa || !pines) return;

    pines.clearLayers();
    for (const captura of coincidencias) {
      const bus = BUS_POR_ID[captura.busId];
      if (!bus) continue;
      const esSeleccionada = seleccionada?.busId === captura.busId;
      const rareza = rarezaSegura(bus.rareza);
      const icono = L.divIcon({
        className: "microdex-marker-wrapper",
        html: '<span class="pin-micro ' + (esSeleccionada ? "pin-seleccionado" : "") + '" style="--pin-color:' + rareza.color + '"><span aria-hidden="true">' + ICONO_MICRO_MAPA + '</span></span>',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });
      const marcador = L.marker([captura.coordenadas.lat, captura.coordenadas.lng], { icon: icono });
      marcador.on("click", () => setSeleccionadaId(captura.busId));
      marcador.addTo(pines);
    }

    if (seleccionada && seleccionAnteriorRef.current !== seleccionada.busId) {
      const centro = [seleccionada.coordenadas.lat, seleccionada.coordenadas.lng];
      mapa.panTo(centro, { animate: true, duration: 0.35 });
      seleccionAnteriorRef.current = seleccionada.busId;
    } else if (coincidencias.length === 0 && ubicadas.length === 0) {
      mapa.setView([-33.45, -70.67], 12, { animate: false });
      seleccionAnteriorRef.current = null;
    } else if (!seleccionada) {
      seleccionAnteriorRef.current = null;
    }

    if (ubicacionActual && !ubicacionActualRef.current) {
      ubicacionActualRef.current = L.circleMarker([ubicacionActual.lat, ubicacionActual.lng], {
        radius: 9,
        color: "#ffffff",
        weight: 4,
        fillColor: "#1684f8",
        fillOpacity: 1,
      }).addTo(mapa);
    } else if (ubicacionActual && ubicacionActualRef.current) {
      ubicacionActualRef.current.setLatLng([ubicacionActual.lat, ubicacionActual.lng]);
    }
  }, [coincidencias, inicializado, seleccionada, ubicadas.length, ubicacionActual]);

  async function centrarEnMiUbicacion() {
    if (estadoGps === "cargando") return;
    setEstadoGps("cargando");
    const posicion = await obtenerUbicacion();
    if (!posicion) {
      setEstadoGps("error");
      return;
    }
    setUbicacionActual(posicion);
    setEstadoGps("listo");
    mapaRef.current?.setView([posicion.lat, posicion.lng], 15, { animate: true });
  }

  const filtros = [
    { id: "todas", etiqueta: "Todas", cantidad: ubicadas.length },
    { id: "cercanas", etiqueta: "Cerca de mí", cantidad: ubicadas.filter((captura) => ubicacionActual && distanciaMetros(ubicacionActual, captura.coordenadas) <= 500).length, deshabilitado: !ubicacionActual },
    { id: "especiales", etiqueta: "Especiales", cantidad: ubicadas.filter((captura) => BUS_POR_ID[captura.busId]?.rareza !== "Común").length },
    { id: "recientes", etiqueta: "Últimos 7 días", cantidad: ubicadas.filter(esReciente).length },
  ];

  return (
    <section className="vista-seccion vista-mapa anim-aparecer" aria-labelledby="titulo-mapa">
      <div className="mapa-cabecera">
        <div>
          <p className="eyebrow">Explora tus recorridos</p>
          <h2 id="titulo-mapa" className="titulo-seccion">Mapa de capturas</h2>
          <p className="texto-secundario">{ubicadas.length} {ubicadas.length === 1 ? "micro con ubicación" : "micros con ubicación"}</p>
        </div>
        <button type="button" className="gps-estado" onClick={centrarEnMiUbicacion} disabled={estadoGps === "cargando"}>
          <span className={"gps-punto " + (estadoGps === "listo" ? "gps-punto-activo" : "")} />
          {estadoGps === "listo" ? "GPS listo" : estadoGps === "cargando" ? "Buscando…" : "Mi ubicación"}
        </button>
      </div>

      <label className="busqueda-mapa">
        <Search size={20} strokeWidth={2.3} aria-hidden="true" />
        <input
          type="search"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Buscar micro, tipo o zona…"
          aria-label="Buscar capturas en el mapa"
        />
        {busqueda && <button type="button" onClick={() => setBusqueda("")} aria-label="Limpiar búsqueda"><X size={16} /></button>}
      </label>

      <div className="filtros-mapa" role="group" aria-label="Filtrar capturas del mapa">
        {filtros.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            className={"filtro-mapa " + (filtro === opcion.id ? "filtro-mapa-activo" : "")}
            aria-pressed={filtro === opcion.id}
            disabled={opcion.deshabilitado}
            onClick={() => setFiltro(opcion.id)}
          >
            <span>{opcion.etiqueta}</span><small>{opcion.cantidad}</small>
          </button>
        ))}
      </div>

      <div className="mapa-marco">
        <div ref={contenedorRef} className="mapa-principal" aria-label="Mapa de OpenStreetMap con las ubicaciones de tus capturas" />
        <div className={"mapa-estado-gps " + (estadoGps === "listo" ? "mapa-estado-gps-activo" : "")}>
          <span className="gps-punto" />
          {estadoGps === "listo" ? "Ubicación actual" : "Ubicación bajo demanda"}
        </div>
        <button type="button" className="mapa-centrar" onClick={centrarEnMiUbicacion} disabled={estadoGps === "cargando"} aria-label="Centrar mapa en mi ubicación">
          {estadoGps === "cargando" ? <span className="mapa-cargando" aria-hidden="true">…</span> : <LocateFixed size={23} strokeWidth={2.3} aria-hidden="true" />}
        </button>
        {coincidencias.length === 0 && (
          <div className="mapa-sin-resultados">
            <MapPinned size={30} strokeWidth={1.8} aria-hidden="true" />
            <strong>{ubicadas.length ? "No hay resultados para este filtro" : "Aún no hay capturas en el mapa"}</strong>
            <p>{ubicadas.length ? "Prueba otra búsqueda o filtro." : "Al fotografiar una micro con ubicación disponible, su pin aparecerá aquí."}</p>
          </div>
        )}
        <a className="mapa-atribucion" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
          Mapa © OpenStreetMap contributors
        </a>
      </div>

      {busSeleccionado && seleccionada && (
        <article className="ficha-mapa">
          <div className="ficha-mapa-asa" aria-hidden="true" />
          <div className="ficha-mapa-cabecera">
            <img src={seleccionada.foto} alt={"Foto de " + busSeleccionado.nombre} loading="lazy" />
            <div className="ficha-mapa-datos">
              <span className="etiqueta-mapa-rareza" style={{ "--rareza": rarezaSegura(busSeleccionado.rareza).color }}>{rarezaSegura(busSeleccionado.rareza).etiqueta}</span>
              <strong>{busSeleccionado.nombre}</strong>
              <small>{busSeleccionado.tipo} · {busSeleccionado.zona}</small>
            </div>
            <button type="button" className="ficha-mapa-flecha" onClick={() => onAbrir(busSeleccionado)} aria-label={"Ver ficha de " + busSeleccionado.nombre}><ChevronRight size={22} aria-hidden="true" /></button>
          </div>
          <div className="ficha-mapa-detalles">
            <div><small>Capturada</small><strong>{fechaCorta(seleccionada.fecha)}</strong></div>
            <div><small>Distancia</small><strong>{distanciaSeleccionada === null ? "GPS opcional" : distanciaSeleccionada < 1000 ? Math.round(distanciaSeleccionada) + " m" : (distanciaSeleccionada / 1000).toFixed(1) + " km"}</strong></div>
            <div><small>Estado</small><strong>Guardada</strong></div>
          </div>
          <button type="button" className="boton-ficha-mapa" onClick={() => onAbrir(busSeleccionado)}>Ver ficha en MicroDex <ArrowRight size={17} aria-hidden="true" /></button>
        </article>
      )}
      {estadoGps === "error" && <p className="aviso-gps-mapa" role="status">No se pudo obtener tu ubicación. Puedes seguir viendo las ubicaciones guardadas.</p>}
    </section>
  );
}
