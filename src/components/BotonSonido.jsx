import { Volume2, VolumeX } from "lucide-react";

export default function BotonSonido({ activado, onClick }) {
  return (
    <button
      type="button"
      className="boton-icono h-11 w-11 shrink-0 rounded-xl border border-zinc-700 bg-zinc-900 text-xl focus-visible:outline"
      onClick={onClick}
      aria-label={activado ? "Silenciar sonidos" : "Activar sonidos"}
      aria-pressed={activado}
      title={activado ? "Silenciar sonidos" : "Activar sonidos"}
    >
      {activado ? <Volume2 size={19} aria-hidden="true" /> : <VolumeX size={19} aria-hidden="true" />}
    </button>
  );
}
