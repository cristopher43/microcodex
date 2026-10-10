import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { TIPOS_BUS, ZONAS_BUS } from "../data/buses.js";

function chips(valores, actual, alElegir) {
  return (
    <div className="fila-chips flex gap-2 overflow-x-auto py-1">
      {valores.map((valor) => (
        <button
          key={valor}
          type="button"
          className={"chip-asignacion shrink-0 rounded-full border px-3 py-2 text-xs font-semibold " + (actual === valor ? "chip-asignacion-activo" : "")}
          aria-pressed={actual === valor}
          onClick={() => alElegir(actual === valor ? "" : valor)}
        >
          {valor}
        </button>
      ))}
    </div>
  );
}

export default function ModalAsignar({ foto, busesDisponibles, onAsignar, onCancelar, guardando = false, errorAlmacenamiento = "", modoPadres = false }) {
  const [busqueda, setBusqueda] = useState("");
  const [zona, setZona] = useState("");
  const [tipo, setTipo] = useState("");
  const [recorrido, setRecorrido] = useState("");

  const opciones = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase("es-CL");
    return busesDisponibles.filter((bus) =>
      bus.nombre.toLocaleLowerCase("es-CL").includes(consulta) &&
      (!zona || bus.zona === zona) &&
      (!tipo || bus.tipo === tipo),
    );
  }, [busqueda, busesDisponibles, zona, tipo]);

  return (
    <div className="modal-capa modal-asignar-capa" role="dialog" aria-modal="true" aria-labelledby="titulo-asignar">
      <section className="modal-panel modal-asignar-panel">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-300">Paso 2 · Identificación</p>
            <h2 id="titulo-asignar" className="mt-1 text-xl font-black text-white">¡Micro identificada!</h2>
            <p className="mt-1 text-sm text-zinc-400">¿A qué modelo corresponde la foto?</p>
          </div>
          <button type="button" className="boton-cerrar" onClick={onCancelar} disabled={guardando} aria-label="Cancelar captura"><X size={18} /></button>
        </div>

        <img src={foto} alt="Foto comprimida de la micro que vas a registrar" className="foto-asignar mt-4 w-full rounded-xl object-cover" />

        <label className="mt-4 block text-sm font-semibold text-zinc-200" htmlFor="buscar-micro">Buscar por nombre</label>
        <input
          id="buscar-micro"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          className="campo-texto mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white"
          placeholder="Ej. Foton, trolebús..."
          autoComplete="off"
        />

        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Zona</p>
          {chips(ZONAS_BUS, zona, setZona)}
        </div>
        <div className="mt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tipo</p>
          {chips(TIPOS_BUS, tipo, setTipo)}
        </div>

        <label className="mt-4 block text-sm font-semibold text-zinc-200" htmlFor="recorrido-micro">
          Recorrido <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <input
          id="recorrido-micro"
          value={recorrido}
          onChange={(evento) => setRecorrido(evento.target.value)}
          className="campo-texto mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white"
          placeholder="Ej. 210, B20"
          maxLength={24}
        />

        <div className="lista-opciones-asignacion mt-4 space-y-2 overflow-y-auto pr-1">
          {opciones.map((bus) => (
            <button
              key={bus.id}
              type="button"
              onClick={() => onAsignar(bus, recorrido.trim())}
              disabled={guardando}
              className="opcion-micro min-h-16 w-full rounded-xl border px-4 py-3 text-left transition-transform active:scale-[0.99]"
            >
              <span className="block text-sm font-bold text-zinc-100">{bus.nombre}</span>
              <span className="mt-1 block text-xs text-zinc-400">{bus.zona} · {bus.tipo}</span>
              {modoPadres && bus.verificar && <span className="mt-2 block text-[10px] font-semibold text-amber-300">Por confirmar</span>}
            </button>
          ))}
          {opciones.length === 0 && (
            <p className="rounded-xl bg-zinc-900 p-4 text-center text-sm text-zinc-400">
              No hay micros disponibles con esos filtros.
            </p>
          )}
        </div>

        {errorAlmacenamiento && (
          <p className="mt-3 rounded-xl border border-amber-400/40 bg-amber-950/50 p-3 text-xs leading-5 text-amber-100" role="alert">
            {errorAlmacenamiento}
          </p>
        )}
        {guardando && <p className="mt-3 text-center text-xs text-zinc-400" role="status">Guardando captura...</p>}
        <button type="button" onClick={onCancelar} disabled={guardando} className="cancelar-asignacion mt-4 w-full rounded-xl px-4 py-3 font-semibold">
          Cancelar
        </button>
      </section>
    </div>
  );
}
