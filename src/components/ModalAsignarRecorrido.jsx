import { Camera, Check, X } from "lucide-react";

export default function ModalAsignarRecorrido({ foto, recorrido, guardando, error, onGuardar, onCancelar }) {
  return <div className="modal-capa" role="dialog" aria-modal="true" aria-labelledby="titulo-asignar-recorrido">
    <section className="modal-panel modal-recorrido-panel">
      <div className="flex items-start justify-between gap-3">
        <div><p className="eyebrow">Nuevo registro de Pokédex</p><h2 id="titulo-asignar-recorrido">Recorrido {recorrido.codigo}</h2><p>{recorrido.descripcion}</p></div>
        <button type="button" className="boton-cerrar" onClick={onCancelar} disabled={guardando} aria-label="Cancelar"><X size={18} /></button>
      </div>
      <img className="foto-ruta-confirmacion" src={foto} alt={`Foto para el recorrido ${recorrido.codigo}`} />
      {error && <p className="ruta-error" role="alert">{error}</p>}
      <button type="button" className="ruta-confirmar" disabled={guardando} onClick={onGuardar}>
        {guardando ? <><span className="ruta-spinner" /> Guardando foto…</> : <><Check size={19} /> Agregar a mi Pokédex</>}
      </button>
      <button type="button" className="ruta-cancelar" disabled={guardando} onClick={onCancelar}>Volver</button>
    </section>
  </div>;
}
