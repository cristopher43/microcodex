import BotonCamara from "./BotonCamara.jsx";
import LogoMicros from "./LogoMicros.jsx";
import ClickSpark from "./reactbits/ClickSpark.jsx";
import { ArrowRight, Award, BusFront, Camera, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { rarezaSegura } from "../data/rarezas.js";

const RAREZAS = [
  { id: "Común", plural: "Comunes" },
  { id: "Rara", plural: "Raras" },
  { id: "Épica", plural: "Épicas" },
  { id: "Legendaria", plural: "Legendarias" },
];

function fechaCorta(valor) {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "Fecha desconocida";
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short" }).format(fecha);
}

export default function VistaInicio({
  buses,
  capturas,
  logrosDesbloqueados,
  onCapturar,
  onCompleta,
  onCambiarMapa,
  onAbrirDetalle,
}) {
  const total = buses.length;
  const porcentaje = total ? Math.round((capturas.length / total) * 100) : 0;
  const porRareza = Object.fromEntries(
    RAREZAS.map(({ id: rareza }) => [
      rareza,
      capturas.filter((captura) => buses.find((bus) => bus.id === captura.busId)?.rareza === rareza).length,
    ]),
  );
  const ultimaCaptura = [...capturas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
  const ultimoBus = ultimaCaptura ? buses.find((bus) => bus.id === ultimaCaptura.busId) : null;
  const cantidadUbicadas = capturas.filter(
    (captura) => Number.isFinite(captura.coordenadas?.lat) && Number.isFinite(captura.coordenadas?.lng),
  ).length;

  return (
    <section className="vista-seccion vista-inicio anim-aparecer" aria-labelledby="titulo-inicio">
      <div className="inicio-saludo">
        <div>
          <p className="eyebrow">Tu aventura urbana</p>
          <h1 id="titulo-inicio">¡A descubrir micros!</h1>
          <p className="texto-secundario">Cada recorrido puede sumar una nueva a tu colección.</p>
        </div>
        <span className="sello-inicio"><LogoMicros className="sello-micros" /></span>
      </div>

      <div className="inicio-grid">
        <article className="tarjeta-captura">
          <div className="captura-icono" aria-hidden="true"><Camera size={31} strokeWidth={2.1} /></div>
          <div>
            <p className="captura-etiqueta">Registro de campo</p>
            <h2>¿Viste una micro?</h2>
            <p>Tómale una foto y agrégala a tu MicroDex.</p>
          </div>
          <ClickSpark className="captura-click-spark" sparkColor="#fff6bd" sparkRadius={20} sparkSize={9} sparkCount={10}>
            <BotonCamara
              variante="amarillo"
              etiqueta="Capturar micro"
              bloqueado={capturas.length >= total}
              onArchivo={onCapturar}
              onCompleta={onCompleta}
            />
          </ClickSpark>
        </article>

        <article className="tarjeta-progreso" aria-label="Progreso de la colección">
          <div className="progreso-cabecera">
            <div>
              <p className="eyebrow">Tu álbum</p>
              <h2>MicroDex urbano</h2>
            </div>
            <span className="progreso-porcentaje">{porcentaje}%</span>
          </div>
          <div className="progreso-cifras">
            <strong>{capturas.length} <span>/ {total}</span></strong>
            <span>{total - capturas.length} por descubrir</span>
          </div>
          <div className="barra-progreso" role="progressbar" aria-label="Progreso de la colección" aria-valuemin="0" aria-valuemax={total} aria-valuenow={capturas.length}>
            <div className="barra-progreso-valor" style={{ width: porcentaje + "%" }} />
          </div>
          <div className="resumen-rarezas">
            {RAREZAS.map(({ id: rareza, plural }) => {
              const estilo = rarezaSegura(rareza);
              return (
                <div className="rareza-resumen" key={rareza} style={{ "--rareza": estilo.color }}>
                  <span className="rareza-punto" />
                  <strong>{porRareza[rareza]}</strong>
                  <span>{plural}</span>
                </div>
              );
            })}
          </div>
        </article>
      </div>

      <div className="inicio-metricas" aria-label="Resumen de actividad">
        <article className="metrica-card">
          <span className="metrica-icono metrica-roja" aria-hidden="true"><BusFront size={19} /></span>
          <span><strong>{capturas.length}</strong><small>capturas</small></span>
        </article>
        <article className="metrica-card">
          <span className="metrica-icono metrica-amarilla" aria-hidden="true"><Award size={19} /></span>
          <span><strong>{Object.keys(logrosDesbloqueados).length}</strong><small>logros</small></span>
        </article>
        <button type="button" className="metrica-card metrica-enlace" onClick={onCambiarMapa}>
          <span className="metrica-icono metrica-azul" aria-hidden="true"><MapPin size={19} /></span>
          <span><strong>{cantidadUbicadas}</strong><small>en el mapa</small></span>
          <ArrowRight className="metrica-flecha" size={19} aria-hidden="true" />
        </button>
      </div>

      {ultimoBus && ultimaCaptura ? (
        <section className="actividad-reciente" aria-labelledby="titulo-actividad">
          <div className="seccion-cabecera">
            <div>
              <p className="eyebrow">Tu última incorporación</p>
              <h2 id="titulo-actividad">Actividad reciente</h2>
            </div>
            <span className="estado-nuevo">Más reciente</span>
          </div>
          <button type="button" className="tarjeta-actividad" onClick={() => onAbrirDetalle(ultimoBus)}>
            <img src={ultimaCaptura.foto} alt={"Foto de " + ultimoBus.nombre} loading="lazy" />
            <span className="actividad-datos">
              <span className="etiqueta-rareza-inicio" style={{ "--rareza": rarezaSegura(ultimoBus.rareza).color }}>{rarezaSegura(ultimoBus.rareza).etiqueta}</span>
              <strong>{ultimoBus.nombre}</strong>
              <small>{ultimoBus.zona} · {fechaCorta(ultimaCaptura.fecha)}</small>
            </span>
            <ChevronRight className="actividad-flecha" size={22} aria-hidden="true" />
          </button>
        </section>
      ) : (
        <div className="inicio-vacio">
          <Sparkles size={24} strokeWidth={2} aria-hidden="true" />
          <div><strong>Tu primera captura te espera</strong><p>Cuando fotografíes una micro, aparecerá aquí.</p></div>
        </div>
      )}
    </section>
  );
}
