import { LOGROS } from "../data/logros.js";
import { CircleCheck, LockKeyhole } from "lucide-react";
import IconoLogro from "./IconoLogro.jsx";

export default function VistaLogros({ logrosDesbloqueados }) {
  const cantidad = Object.keys(logrosDesbloqueados).length;

  return (
    <section className="vista-seccion anim-aparecer" aria-labelledby="titulo-logros">
      <div className="mb-4">
        <p className="eyebrow">Tu progreso</p>
        <h2 id="titulo-logros" className="titulo-seccion">Logros</h2>
        <p className="texto-secundario">{cantidad} de {LOGROS.length} desbloqueados</p>
      </div>

      <div className="space-y-3">
        {LOGROS.map((logro) => {
          const desbloqueado = logrosDesbloqueados[logro.id];
          return (
            <button
              key={logro.id}
              type="button"
              className={"tarjeta-logro flex w-full items-center gap-3 rounded-2xl border p-4 text-left " + (desbloqueado ? "logro-desbloqueado" : "logro-bloqueado")}
              onClick={(evento) => {
                if (!desbloqueado) {
                  evento.currentTarget.classList.remove("candado-sacudida");
                  void evento.currentTarget.offsetWidth;
                  evento.currentTarget.classList.add("candado-sacudida");
                }
              }}
              aria-label={desbloqueado ? logro.nombre + ": desbloqueado" : logro.nombre + ": bloqueado"}
            >
              <span className={"insignia-logro flex h-12 w-12 shrink-0 items-center justify-center rounded-xl " + (desbloqueado ? "" : "insignia-bloqueada")} aria-hidden="true">
                {desbloqueado ? <IconoLogro nombre={logro.icono} size={23} strokeWidth={2} /> : <LockKeyhole size={21} strokeWidth={2} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="nombre-logro block font-bold">{logro.nombre}</span>
                <span className="mt-1 block text-xs leading-5 texto-secundario">{logro.descripcion}</span>
              </span>
              {desbloqueado && <span className="text-emerald-500" aria-label="Desbloqueado"><CircleCheck size={18} /></span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
