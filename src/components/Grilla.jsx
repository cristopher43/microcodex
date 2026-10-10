import { useEffect, useRef } from "react";
import TarjetaMicro from "./TarjetaMicro.jsx";

export default function Grilla({ buses, capturaPorId, modoPadres, onAbrir }) {
  const vistos = useRef(new Set());
  const nuevos = new Set(buses.filter((bus) => !vistos.current.has(bus.id)).map((bus) => bus.id));

  useEffect(() => {
    for (const bus of buses) vistos.current.add(bus.id);
  }, [buses]);

  return (
    <div className="grilla-buses grid grid-cols-2 gap-3 sm:grid-cols-3">
      {buses.map((bus, indice) => {
        return (
          <TarjetaMicro
            key={bus.id}
            bus={bus}
            captura={capturaPorId[bus.id]}
            modoPadres={modoPadres}
            onAbrir={() => onAbrir(bus)}
            animar={nuevos.has(bus.id)}
            indice={indice}
          />
        );
      })}
      {buses.length === 0 && (
        <p className="col-span-full rounded-2xl border border-dashed border-zinc-700 p-6 text-center text-sm text-zinc-400">
          No hay micros para estos filtros. Prueba otra combinación.
        </p>
      )}
    </div>
  );
}
