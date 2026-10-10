import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { rarezaSegura } from "../data/rarezas.js";
import MiniMapa from "./MiniMapa.jsx";

function fechaLegible(valor) {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "Fecha no disponible";
  const dia = new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long" }).format(fecha);
  const hora = new Intl.DateTimeFormat("es-CL", { hour: "2-digit", minute: "2-digit" }).format(fecha);
  return dia.charAt(0).toLocaleUpperCase("es-CL") + dia.slice(1) + ", " + hora;
}

export default function ModalDetalle({ bus, captura, onCerrar, onLiberar, modoPadres = false }) {
  const [confirmar, setConfirmar] = useState(false);
  const rareza = rarezaSegura(bus.rareza);

  return (
    <div className="modal-capa" role="dialog" aria-modal="true" aria-labelledby="detalle-titulo">
      <section className="modal-panel modal-detalle-panel">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-300">Ficha de captura</p>
            <h2 id="detalle-titulo" className="mt-1 text-xl font-black text-white">{bus.nombre}</h2>
          </div>
          <button type="button" className="boton-cerrar" onClick={onCerrar} aria-label="Cerrar detalle"><X size={18} /></button>
        </div>

        <img src={captura.foto} alt={"Fotografía de " + bus.nombre} className="foto-detalle mt-4 w-full rounded-2xl object-cover" />

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="etiqueta-rareza" style={{ color: rareza.color, backgroundColor: rareza.color + "22" }}>{rareza.etiqueta}</span>
          <span className="etiqueta-simple">{bus.tipo}</span>
          <span className="etiqueta-simple">{bus.zona}</span>
        </div>
        {modoPadres && bus.verificar && <p className="mt-2 text-xs font-semibold text-amber-300">Por confirmar</p>}

        <dl className="mt-4 space-y-2 rounded-2xl bg-zinc-900 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">Cazada el</dt>
            <dd className="text-right font-medium text-zinc-200">{fechaLegible(captura.fecha)}</dd>
          </div>
          {captura.recorrido && (
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">Recorrido</dt>
              <dd className="font-semibold text-zinc-200">{captura.recorrido}</dd>
            </div>
          )}
        </dl>

        {captura.coordenadas ? (
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Lugar de la captura</p>
            <MiniMapa coordenadas={captura.coordenadas} />
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-zinc-900 px-4 py-3 text-xs text-zinc-500">
            Esta captura se guardó sin ubicación.
          </p>
        )}

        {confirmar ? (
          <div className="mt-5 rounded-2xl border border-red-500/40 bg-red-950/40 p-4">
            <p className="text-sm font-semibold text-red-100">¿Liberar esta micro y borrar su fotografía?</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => onLiberar(bus.id)} className="boton-peligro rounded-xl px-3 py-3 text-sm font-bold">Sí, liberar</button>
              <button type="button" onClick={() => setConfirmar(false)} className="boton-secundario rounded-xl px-3 py-3 text-sm font-semibold">Volver</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmar(true)} className="boton-peligro mt-5 w-full rounded-xl px-4 py-3 font-bold">
            <Trash2 size={17} aria-hidden="true" /> Liberar y volver a fotografiar
          </button>
        )}
        <button type="button" onClick={onCerrar} className="boton-secundario mt-2 w-full rounded-xl px-4 py-3 font-semibold">
          Cerrar
        </button>
      </section>
    </div>
  );
}
