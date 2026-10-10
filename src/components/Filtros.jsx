import { TIPOS_BUS, ZONAS_BUS } from "../data/buses.js";
import { RAREZAS } from "../data/rarezas.js";

function GrupoChips({ titulo, valores, activo, alElegir, colorActivo = false }) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{titulo}</p>
      <div className="fila-chips flex gap-2 overflow-x-auto pb-1">
        {valores.map((valor) => (
          <button
            key={valor.id}
            type="button"
            onClick={() => alElegir(valor.id)}
            aria-pressed={activo === valor.id}
            className={"chip-filtro shrink-0 rounded-full border px-3 py-2 text-xs font-semibold " + (activo === valor.id ? (colorActivo && valor.color ? "border-transparent text-zinc-950" : "border-red-400 bg-red-500/15 text-red-100") : "border-zinc-700 bg-zinc-900/70 text-zinc-400")}
            style={activo === valor.id && colorActivo && valor.color ? { backgroundColor: valor.color } : undefined}
          >
            {valor.etiqueta}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Filtros({ filtro, onChange }) {
  const cambiar = (campo, valor) => {
    if (campo === "rareza" && valor !== "Todas") {
      onChange({ ...filtro, estado: "capturadas", rareza: valor });
      return;
    }
    if (campo === "estado" && valor === "faltantes") {
      onChange({ ...filtro, estado: valor, rareza: "Todas" });
      return;
    }
    onChange({ ...filtro, [campo]: valor });
  };
  const estados = [
    { id: "todas", etiqueta: "Todas" },
    { id: "capturadas", etiqueta: "Capturadas" },
    { id: "faltantes", etiqueta: "Faltantes" },
  ];
  const tipos = [{ id: "Todos", etiqueta: "Todos los tipos" }, ...TIPOS_BUS.map((valor) => ({ id: valor, etiqueta: valor }))];
  const zonas = [{ id: "Todas", etiqueta: "Todas las zonas" }, ...ZONAS_BUS.map((valor) => ({ id: valor, etiqueta: valor }))];
  const rarezas = [{ id: "Todas", etiqueta: "Todas" }, ...Object.keys(RAREZAS).map((valor) => ({ id: valor, etiqueta: valor, color: RAREZAS[valor].color }))];

  return (
    <section aria-label="Filtros de colección" className="mb-4 filtros-ui">
      <GrupoChips titulo="Estado" valores={estados} activo={filtro.estado} alElegir={(valor) => cambiar("estado", valor)} />
      <GrupoChips titulo="Tipo de micro" valores={tipos} activo={filtro.tipo} alElegir={(valor) => cambiar("tipo", valor)} />
      <GrupoChips titulo="Zona" valores={zonas} activo={filtro.zona} alElegir={(valor) => cambiar("zona", valor)} />
      <GrupoChips
        titulo="Rareza · solo capturadas"
        valores={rarezas}
        activo={filtro.rareza}
        alElegir={(valor) => cambiar("rareza", valor)}
        colorActivo
      />
    </section>
  );
}
