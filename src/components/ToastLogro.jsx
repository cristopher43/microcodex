import { useEffect } from "react";
import { X } from "lucide-react";
import IconoLogro from "./IconoLogro.jsx";

export default function ToastLogro({ logro, onCerrar }) {
  useEffect(() => {
    const temporizador = window.setTimeout(onCerrar, 3600);
    return () => window.clearTimeout(temporizador);
  }, [logro, onCerrar]);

  if (!logro) return null;

  return (
    <div className="toast-logro" role="status" aria-live="polite">
      <span className="toast-logro-icono" aria-hidden="true"><IconoLogro nombre={logro.icono} size={22} strokeWidth={2} /></span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">¡Logro desbloqueado!</p>
        <p className="mt-1 text-sm font-black text-white">{logro.nombre}</p>
        <p className="mt-1 text-xs text-zinc-300">{logro.descripcion}</p>
      </div>
      <button type="button" onClick={onCerrar} className="ml-auto self-start text-zinc-300" aria-label="Cerrar aviso"><X size={17} /></button>
    </div>
  );
}
