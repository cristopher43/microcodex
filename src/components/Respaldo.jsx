import { useRef, useState } from "react";
import { descargarRespaldo, validarRespaldo } from "../utils/respaldo.js";

export default function Respaldo({ capturas, logros, onRestaurar }) {
  const inputRef = useRef(null);
  const [respaldoPendiente, setRespaldoPendiente] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const leerArchivo = async (evento) => {
    const archivo = evento.target.files?.[0];
    evento.target.value = "";
    setMensaje("");
    setRespaldoPendiente(null);
    if (!archivo) return;

    try {
      const datos = JSON.parse(await archivo.text());
      const resultado = validarRespaldo(datos);
      if (!resultado.valido) {
        setMensaje(resultado.mensaje);
        return;
      }
      setRespaldoPendiente(resultado.datos);
    } catch {
      setMensaje("No se pudo leer el archivo JSON.");
    }
  };

  const confirmarRestauracion = () => {
    if (!respaldoPendiente) return;
    const correcto = onRestaurar(respaldoPendiente);
    if (correcto) {
      setMensaje("Respaldo restaurado.");
      setRespaldoPendiente(null);
    } else {
      setMensaje("No hay espacio suficiente para restaurar este respaldo.");
    }
  };

  return (
    <section className="respaldo-panel rounded-2xl border border-zinc-700 bg-zinc-900/80 p-4">
      <h3 className="font-bold text-zinc-100">Respaldo de la colección</h3>
      <p className="mt-1 text-xs leading-5 text-zinc-400">
        Guarda tus fotos y logros en un archivo para recuperarlos si cambias de dispositivo o se llena el almacenamiento.
      </p>
      <button type="button" onClick={() => descargarRespaldo(capturas, logros)} className="boton-secundario mt-3 w-full rounded-xl px-4 py-3 text-sm font-bold">
        Guardar respaldo
      </button>
      <input ref={inputRef} type="file" accept="application/json,.json" className="sr-only" onChange={leerArchivo} />
      <button type="button" onClick={() => inputRef.current?.click()} className="boton-secundario mt-2 w-full rounded-xl px-4 py-3 text-sm font-bold">
        Restaurar respaldo
      </button>

      {respaldoPendiente && (
        <div className="mt-3 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3">
          <p className="text-sm font-semibold text-amber-100">
            El archivo contiene {respaldoPendiente.capturas.length} capturas y {Object.keys(respaldoPendiente.logros).length} logros.
          </p>
          <p className="mt-1 text-xs text-amber-200/80">Al continuar, reemplazará los datos guardados en este dispositivo.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={confirmarRestauracion} className="boton-peligro rounded-lg px-2 py-3 text-xs font-bold">Reemplazar datos</button>
            <button type="button" onClick={() => setRespaldoPendiente(null)} className="boton-secundario rounded-lg px-2 py-3 text-xs font-bold">Cancelar</button>
          </div>
        </div>
      )}
      {mensaje && <p className="mt-3 text-xs text-zinc-300" role="status">{mensaje}</p>}
    </section>
  );
}
