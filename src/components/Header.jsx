import { Star } from "lucide-react";
import BotonSonido from "./BotonSonido.jsx";
import LogoMicros from "./LogoMicros.jsx";

function formatoBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function Header({
  capturas,
  total,
  bytesUsados,
  onTituloToque,
  sonidoActivado,
  onAlternarSonido,
}) {
  return (
    <header className="header-microdex">
      <div className="header-interior">
        <div className="marca-grupo">
          <span className="marca-micros-envoltura"><LogoMicros className="marca-micros" /></span>
          <div className="marca-texto">
            <button
              type="button"
              className="titulo-microdex"
              onClick={onTituloToque}
              aria-label="MicroDex - toca cinco veces para opciones familiares"
            >
              MicroDex <span>/ Sistema Red</span>
            </button>
            <p><span className="estado-luz" /> Exploración urbana</p>
          </div>
        </div>
        <div className="header-acciones">
          {capturas >= 30 && <span className="uso-almacenamiento" title="Espacio usado aprox.">{formatoBytes(bytesUsados)}</span>}
          <span className="contador-header" aria-label={capturas + " de " + total + " micros registradas"}>
            <Star size={13} fill="currentColor" aria-hidden="true" /> {capturas}<small>/{total}</small>
          </span>
          <BotonSonido activado={sonidoActivado} onClick={onAlternarSonido} />
        </div>
      </div>
    </header>
  );
}
