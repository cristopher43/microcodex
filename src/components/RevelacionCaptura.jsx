import Confeti from "./Confeti.jsx";
import { rarezaSegura } from "../data/rarezas.js";

const tipoConfeti = {
  Épica: "normal",
  Legendaria: "dorado",
};

export default function RevelacionCaptura({ bus, captura, onCerrar }) {
  const rareza = rarezaSegura(bus.rareza);
  const clasePorRareza = { Común: "comun", Rara: "rara", Épica: "epica", Legendaria: "legendaria" };
  const colorClase = "revelacion-" + clasePorRareza[bus.rareza];

  return (
    <div className={"modal-capa revelacion-capa " + colorClase} role="dialog" aria-modal="true" aria-labelledby="revelacion-titulo">
      {(bus.rareza === "Épica" || bus.rareza === "Legendaria") && (
        <Confeti
          tipo={tipoConfeti[bus.rareza]}
          cantidad={bus.rareza === "Legendaria" ? 120 : 72}
          duracion={bus.rareza === "Legendaria" ? 4200 : 2600}
        />
      )}
      {bus.rareza === "Legendaria" && <div className="rayos-dorados" aria-hidden="true" />}
      <section className="revelacion-contenido">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-zinc-300">Nueva captura</p>
        <div className="carta-revelacion mt-5">
          <div className="carta-revelacion-interior">
            <img src={captura.foto} alt={"Foto revelada de " + bus.nombre} className="h-full w-full rounded-3xl object-cover" />
          </div>
        </div>
        {bus.rareza === "Legendaria" && <p className="texto-legendaria mt-5">¡LEGENDARIA!</p>}
        <h2 id="revelacion-titulo" className="mt-4 text-2xl font-black text-white">{bus.nombre}</h2>
        <span className="etiqueta-revelada mt-3 inline-flex" style={{ color: rareza.color, borderColor: rareza.color }}>
          {rareza.etiqueta}
        </span>
        <button type="button" onClick={onCerrar} className="boton-revelacion mt-7 rounded-2xl px-7 py-4 font-black text-zinc-950">
          ¡A la colección!
        </button>
      </section>
    </div>
  );
}
