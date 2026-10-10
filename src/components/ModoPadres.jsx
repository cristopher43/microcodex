import { useState } from "react";
import Respaldo from "./Respaldo.jsx";

export default function ModoPadres({ capturas, logros, onRestaurar, onBorrarTodo }) {
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  return (
    <aside className="modo-padres mt-5 rounded-3xl border border-amber-400/40 bg-zinc-950/95 p-4 shadow-xl" aria-labelledby="titulo-padres">
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Área protegida</p>
        <h2 id="titulo-padres" className="mt-1 text-lg font-black text-white">Modo Padres</h2>
        <p className="mt-1 text-xs text-zinc-400">Aquí puedes administrar el respaldo y revisar datos por confirmar.</p>
      </div>

      <Respaldo capturas={capturas} logros={logros} onRestaurar={onRestaurar} />

      {confirmarBorrado ? (
        <div className="mt-3 rounded-xl border border-red-500/50 bg-red-950/50 p-3">
          <p className="text-sm font-bold text-red-100">¿Borrar todas las fotos y los logros guardados?</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={onBorrarTodo} className="boton-peligro rounded-lg px-3 py-3 text-xs font-black">Sí, borrar todo</button>
            <button type="button" onClick={() => setConfirmarBorrado(false)} className="boton-secundario rounded-lg px-3 py-3 text-xs font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirmarBorrado(true)} className="boton-peligro mt-3 w-full rounded-xl px-4 py-3 text-sm font-bold">
          Borrar todo
        </button>
      )}
    </aside>
  );
}
