import { useMemo, useState } from "react";
import { BusFront, Check, Search, X } from "lucide-react";
import { RECORRIDOS } from "../data/recorridos.js";

export default function ModalAsignar({ foto, busesDisponibles, onAsignar, onCancelar, guardando = false, errorAlmacenamiento = "", modoPadres = false }) {
  const [busquedaRuta, setBusquedaRuta] = useState("");
  const [recorridoElegido, setRecorridoElegido] = useState(null);
  const [busquedaMicro, setBusquedaMicro] = useState("");

  const rutasEncontradas = useMemo(() => {
    const consulta = busquedaRuta.trim().toLocaleLowerCase("es-CL");
    if (!consulta || recorridoElegido) return [];
    return RECORRIDOS.filter((ruta) => `${ruta.codigo} ${ruta.descripcion} ${ruta.familia}`.toLocaleLowerCase("es-CL").includes(consulta)).slice(0, 6);
  }, [busquedaRuta, recorridoElegido]);

  const microsEncontradas = useMemo(() => {
    const consulta = busquedaMicro.trim().toLocaleLowerCase("es-CL");
    return busesDisponibles.filter((bus) => !consulta || `${bus.nombre} ${bus.tipo} ${bus.zona}`.toLocaleLowerCase("es-CL").includes(consulta));
  }, [busquedaMicro, busesDisponibles]);

  return (
    <div className="modal-capa modal-asignar-capa" role="dialog" aria-modal="true" aria-labelledby="titulo-asignar">
      <section className="modal-panel modal-asignar-panel modal-asignar-simple">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Paso 2 · Agregar a la Pokédex</p>
            <h2 id="titulo-asignar" className="mt-1 text-xl font-black">Identifica tu micro</h2>
            <p className="mt-1 text-sm text-slate-500">Primero elige el recorrido y después el modelo.</p>
          </div>
          <button type="button" className="boton-cerrar" onClick={onCancelar} disabled={guardando} aria-label="Cancelar captura"><X size={18} /></button>
        </div>

        <img src={foto} alt="Foto de la micro que vas a registrar" className="foto-asignar mt-4 w-full rounded-xl object-cover" />

        <div className="asignar-paso">
          <label className="asignar-etiqueta" htmlFor="buscar-recorrido-obligatorio">1. Selecciona el recorrido <span>Obligatorio</span></label>
          {recorridoElegido ? (
            <div className="recorrido-elegido">
              <span className="recorrido-elegido-codigo">{recorridoElegido.codigo}</span>
              <span className="recorrido-elegido-datos"><strong>{recorridoElegido.descripcion}</strong><small>{recorridoElegido.familia}</small></span>
              <button type="button" onClick={() => { setRecorridoElegido(null); setBusquedaRuta(""); }} disabled={guardando} aria-label="Cambiar recorrido">Cambiar</button>
            </div>
          ) : (
            <>
              <div className="asignar-busqueda"><Search size={18} aria-hidden="true" /><input id="buscar-recorrido-obligatorio" value={busquedaRuta} onChange={(evento) => setBusquedaRuta(evento.target.value)} placeholder="Código o destino (ej. 210, Puente Alto)" autoComplete="off" /></div>
              {rutasEncontradas.length > 0 && <div className="lista-recorridos-asignar" role="listbox" aria-label="Recorridos encontrados">
                {rutasEncontradas.map((ruta) => <button type="button" role="option" aria-selected="false" key={ruta.id} onClick={() => setRecorridoElegido(ruta)}>
                  <strong>{ruta.codigo}</strong><span>{ruta.descripcion}</span><small>{ruta.familia}</small>
                </button>)}
              </div>}
              {busquedaRuta.trim() && rutasEncontradas.length === 0 && <p className="asignar-ayuda">No encontramos ese servicio. Prueba con el código o destino.</p>}
              {!busquedaRuta.trim() && <p className="asignar-ayuda">Busca y selecciona uno de los 418 servicios oficiales de Santiago.</p>}
            </>
          )}
        </div>

        {recorridoElegido && <div className="asignar-paso">
          <label className="asignar-etiqueta" htmlFor="buscar-modelo-micro">2. Elige el modelo de micro</label>
          <div className="asignar-busqueda"><BusFront size={18} aria-hidden="true" /><input id="buscar-modelo-micro" value={busquedaMicro} onChange={(evento) => setBusquedaMicro(evento.target.value)} placeholder="Buscar modelo (ej. Foton, Scania)…" autoComplete="off" /></div>
          <div className="lista-opciones-asignacion lista-modelos-simple">
            {microsEncontradas.map((bus) => <button key={bus.id} type="button" onClick={() => onAsignar(bus, recorridoElegido)} disabled={guardando} className="opcion-micro">
              <span className="modelo-micro-icono"><BusFront size={18} aria-hidden="true" /></span>
              <span className="modelo-micro-datos"><strong>{bus.nombre}</strong><small>{bus.zona} · {bus.tipo}{modoPadres && bus.verificar ? " · Por confirmar" : ""}</small></span>
              <Check className="modelo-micro-check" size={18} aria-hidden="true" />
            </button>)}
            {microsEncontradas.length === 0 && <p className="asignar-ayuda">Ya registraste esos modelos o no hay coincidencias.</p>}
          </div>
        </div>}

        {errorAlmacenamiento && <p className="asignar-error" role="alert">{errorAlmacenamiento}</p>}
        {guardando && <p className="asignar-ayuda" role="status">Guardando captura…</p>}
        <button type="button" onClick={onCancelar} disabled={guardando} className="cancelar-asignacion mt-4 w-full rounded-xl px-4 py-3 font-semibold">Cancelar</button>
      </section>
    </div>
  );
}
