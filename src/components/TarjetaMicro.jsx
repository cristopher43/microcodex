import { rarezaSegura } from "../data/rarezas.js";
import { BusFront } from "lucide-react";
import GlareHover from "./reactbits/GlareHover.jsx";

export default function TarjetaMicro({ bus, captura, modoPadres, onAbrir, animar = false, indice = 0 }) {
  const capturada = Boolean(captura);
  const rareza = capturada ? rarezaSegura(bus.rareza) : null;

  return (
    <button
      type="button"
      className={"tarjeta-micro group relative w-full overflow-hidden rounded-2xl border text-left transition-transform active:scale-[0.98] " + (capturada ? rareza.clase : "tarjeta-desconocida") + (animar ? " anim-aparecer" : "")}
      style={animar ? { animationDelay: Math.min(indice * 32, 480) + "ms" } : undefined}
      onClick={onAbrir}
      aria-label={capturada ? bus.nombre + ", " + bus.rareza : "Micro desconocida, zona " + bus.zona}
    >
      <GlareHover className="tarjeta-brillo" glareColor={capturada ? rareza.color : "#ffca21"}>
      {capturada ? (
        <>
          <div className="aspect-[4/3] overflow-hidden bg-zinc-800">
            <img
              src={captura.foto}
              alt={"Fotografía de " + bus.nombre}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-3">
            <span className="mb-1 inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide" style={{ color: rareza.color, backgroundColor: rareza.color + "22" }}>
              {rareza.etiqueta}
            </span>
            <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-zinc-100">{bus.nombre}</h3>
            <p className="mt-1 text-[11px] text-zinc-500">{bus.zona}</p>
            {modoPadres && bus.verificar && <span className="mt-2 inline-block text-[10px] font-semibold text-amber-300">Por confirmar</span>}
          </div>
        </>
      ) : (
        <div className="flex min-h-[190px] flex-col items-center justify-center p-3 text-center">
          <BusFront className="icono-desconocido mb-3" size={42} strokeWidth={1.8} aria-hidden="true" />
          <span className="text-sm font-bold tracking-wide text-zinc-300">Desconocida</span>
          <span className="mt-2 rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-400">{bus.zona}</span>
          {modoPadres && bus.verificar && <span className="mt-2 text-[10px] font-semibold text-amber-300">Por confirmar</span>}
        </div>
      )}
      </GlareHover>
    </button>
  );
}
