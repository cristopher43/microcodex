import { useMemo, useState } from "react";
import { Camera, Check, Search } from "lucide-react";
import { FECHA_GTFS_RECORRIDOS, RECORRIDOS } from "../data/recorridos.js";

const RAREZAS = ["Común", "Raro", "Épico", "Legendario"];
// Servicios con terminales o zonas locales del eje Peñalolén y comunas colindantes.
const CODIGOS_ZONA_PENALOLEN = new Set([
  "103", "106", "114", "124", "322", "323", "425", "429", "E17",
  "506", "506E", "506V", "507", "507C", "508", "510", "511", "513",
  "514", "514C", "516", "517", "518", "519",
]);

function hashEstable(codigo) {
  let hash = 2166136261;
  for (const caracter of codigo) hash = Math.imul(hash ^ caracter.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function esRecorridoLocal(ruta) {
  const codigo = ruta.codigo.toLocaleUpperCase("es-CL");
  const texto = `${ruta.descripcion} ${ruta.familia}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-CL");
  return ruta.familia === "Locales D" || CODIGOS_ZONA_PENALOLEN.has(codigo) || /penalolen|lo hermida|antupiren|las torres|las pircas|quilin|av\. grecia|alto macul|san luis de macul/.test(texto);
}

const CODIGOS_LEGENDARIOS_FIJOS = new Set(["510", "516", "519"]);
const recorridosLocalesParaSorteo = RECORRIDOS.filter((ruta) => esRecorridoLocal(ruta) && !CODIGOS_LEGENDARIOS_FIJOS.has(ruta.codigo.toLocaleUpperCase("es-CL")))
  .sort((a, b) => hashEstable(a.codigo) - hashEstable(b.codigo) || a.codigo.localeCompare(b.codigo, "es-CL"));
const recorridosGlobalesParaSorteo = RECORRIDOS.filter((ruta) => !esRecorridoLocal(ruta) && !CODIGOS_LEGENDARIOS_FIJOS.has(ruta.codigo.toLocaleUpperCase("es-CL")))
  .sort((a, b) => hashEstable(a.codigo) - hashEstable(b.codigo) || a.codigo.localeCompare(b.codigo, "es-CL"));
const CODIGOS_LEGENDARIOS = new Set([
  ...CODIGOS_LEGENDARIOS_FIJOS,
  ...recorridosLocalesParaSorteo.slice(0, 8).map((ruta) => ruta.codigo.toLocaleUpperCase("es-CL")),
  ...recorridosGlobalesParaSorteo.slice(0, 19).map((ruta) => ruta.codigo.toLocaleUpperCase("es-CL")),
]);

function rarezaLocalEstable(codigo) {
  const sorteo = hashEstable(codigo) % 100;
  if (sorteo < 45) return "Común";
  if (sorteo < 75) return "Raro";
  return "Épico";
}

function prepararRecorrido(ruta) {
  const codigo = ruta.codigo.toLocaleUpperCase("es-CL");
  const texto = `${ruta.descripcion} ${ruta.familia}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-CL");
  const esPenalolen = esRecorridoLocal(ruta);
  let rareza = "Común";
  if (CODIGOS_LEGENDARIOS.has(codigo)) rareza = "Legendario";
  else if (esPenalolen) rareza = rarezaLocalEstable(codigo);
  else if (/[EN]$/.test(codigo) || /expreso|nocturno/.test(texto)) rareza = "Épico";
  else if (/[CV]$/.test(codigo)) rareza = "Raro";
  return { ...ruta, rareza, esPenalolen };
}

export default function VistaRecorridos({ recorridos, capturas, cargando, error, onCapturar }) {
  const [busqueda, setBusqueda] = useState("");
  const [familia, setFamilia] = useState("Todas");
  const [estado, setEstado] = useState("todas");
  const [rareza, setRareza] = useState("Todas");
  const [zona, setZona] = useState("Todas");
  const recorridosConCategoria = useMemo(() => recorridos.map(prepararRecorrido), [recorridos]);
  const capturaPorId = useMemo(() => Object.fromEntries(capturas.map((item) => [item.recorridoId, item])), [capturas]);
  const familias = useMemo(() => ["Todas", ...new Set(recorridosConCategoria.map((item) => item.familia))], [recorridosConCategoria]);
  const recorridosFiltrados = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase("es-CL");
    return recorridosConCategoria.filter((ruta) => {
      const capturada = Boolean(capturaPorId[ruta.id]);
      return (!consulta || `${ruta.codigo} ${ruta.descripcion} ${ruta.familia}`.toLocaleLowerCase("es-CL").includes(consulta)) &&
        (familia === "Todas" || ruta.familia === familia) &&
        (rareza === "Todas" || ruta.rareza === rareza) &&
        (zona === "Todas" || (zona === "Peñalolén" ? ruta.esPenalolen : !ruta.esPenalolen)) &&
        (estado === "todas" || (estado === "capturadas" ? capturada : !capturada));
    });
  }, [busqueda, capturaPorId, estado, familia, recorridosConCategoria, rareza, zona]);
  const totalCapturados = capturas.length;

  return (
    <section className="vista-recorridos" aria-labelledby="titulo-recorridos">
      <div className="resumen-coleccion ruta-resumen">
        <div className="resumen-coleccion-cabecera">
          <strong>{totalCapturados} <span>/ {recorridos.length} recorridos</span></strong>
          <span>{recorridos.length ? Math.round(totalCapturados / recorridos.length * 100) : 0}% completo</span>
        </div>
        <div className="barra-progreso" role="progressbar" aria-label="Progreso de recorridos" aria-valuemin="0" aria-valuemax={recorridos.length} aria-valuenow={totalCapturados}>
          <div className="barra-progreso-valor" style={{ width: `${recorridos.length ? totalCapturados / recorridos.length * 100 : 0}%` }} />
        </div>
        <p>Fotografía cada servicio para completar tu álbum. Catálogo DTPM actualizado el {new Date(`${FECHA_GTFS_RECORRIDOS}T12:00:00`).toLocaleDateString("es-CL")}.</p>
      </div>

      <label className="ruta-busqueda"><Search size={19} aria-hidden="true" /><span className="sr-only">Buscar recorrido</span>
        <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar código, destino o zona…" />
      </label>
      <div className="ruta-filtros" aria-label="Filtros de recorridos">
        <label>Mostrar
          <select value={estado} onChange={(event) => setEstado(event.target.value)}>
            <option value="todas">Todos ({recorridos.length})</option>
            <option value="faltantes">Por fotografiar ({recorridos.length - totalCapturados})</option>
            <option value="capturadas">Fotografiados ({totalCapturados})</option>
          </select>
        </label>
        <label>Familia
          <select value={familia} onChange={(event) => setFamilia(event.target.value)}>
            {familias.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>Rareza
          <select value={rareza} onChange={(event) => setRareza(event.target.value)}>
            <option value="Todas">Todas las rarezas</option>
            {RAREZAS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>Zona
          <select value={zona} onChange={(event) => setZona(event.target.value)}>
            <option value="Todas">Todas las zonas</option>
            <option value="Peñalolén">Local · Peñalolén</option>
            <option value="Otras">Otras comunas</option>
          </select>
        </label>
      </div>
      <div className="resumen-rareza-recorridos" aria-label="Categorías de rareza">
        {RAREZAS.map((item) => <span className={`rareza-ruta-chip rareza-ruta-${item.toLocaleLowerCase("es-CL").replace("é", "e")}`} key={item}>{item}<strong>{recorridosConCategoria.filter((ruta) => ruta.rareza === item).length}</strong></span>)}
        <span className="rareza-ruta-chip rareza-ruta-local">Local · Peñalolén<strong>{recorridosConCategoria.filter((ruta) => ruta.esPenalolen).length}</strong></span>
      </div>
      {error && <p className="ruta-error" role="alert">{error}</p>}
      {cargando ? <p className="ruta-vacio" role="status">Cargando tus fotos…</p> : (
        <div className="grilla-recorridos">
          {recorridosFiltrados.map((ruta) => {
            const captura = capturaPorId[ruta.id];
            return <article className="tarjeta-recorrido" key={ruta.id}>
              <div className="ruta-imagen" style={{ "--ruta-color": ruta.color, "--ruta-texto": ruta.colorTexto }}>
                {captura ? <img src={captura.fotoUrl} alt={`Micro del recorrido ${ruta.codigo}`} /> : <div className="ruta-placeholder" aria-label="Aún no hay foto"><span>{ruta.codigo}</span><small>Tu foto aparecerá aquí</small></div>}
                <span className="ruta-badge">{ruta.familia}</span>
                <span className={`ruta-rareza ruta-rareza-${ruta.rareza.toLocaleLowerCase("es-CL").replace("é", "e")}`}>{ruta.rareza}</span>
                {ruta.esPenalolen && <span className="ruta-localidad">Local · Peñalolén</span>}
                {captura && <span className="ruta-check" aria-label="Recorrido fotografiado"><Check size={16} /></span>}
              </div>
              <div className="ruta-contenido">
                <h3>{ruta.codigo}</h3>
                <p>{ruta.descripcion}</p>
                <label className="ruta-capturar">
                  <Camera size={17} aria-hidden="true" />{captura ? "Cambiar foto" : "Fotografiar recorrido"}
                  <input type="file" accept="image/*" capture="environment" onChange={(event) => {
                    const archivo = event.target.files?.[0];
                    event.target.value = "";
                    if (archivo) onCapturar(archivo, ruta);
                  }} aria-label={`${captura ? "Cambiar foto" : "Fotografiar"} del recorrido ${ruta.codigo}`} />
                </label>
              </div>
            </article>;
          })}
          {recorridosFiltrados.length === 0 && <p className="ruta-vacio">No encontramos recorridos con esa búsqueda o filtros.</p>}
        </div>
      )}
    </section>
  );
}
