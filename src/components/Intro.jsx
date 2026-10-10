import { useEffect, useRef } from "react";
import LogoMicros from "./LogoMicros.jsx";

export default function Intro({ onTerminar }) {
  const terminarRef = useRef(onTerminar);
  terminarRef.current = onTerminar;

  useEffect(() => {
    const temporizador = window.setTimeout(() => terminarRef.current?.(), 2600);
    return () => window.clearTimeout(temporizador);
  }, []);

  return (
    <div
      className="intro-juego"
      role="button"
      tabIndex={0}
      aria-label="Omitir presentación. MicroDex, creada por Cristopher."
      onClick={onTerminar}
      onKeyDown={(evento) => {
        if (evento.key === "Enter" || evento.key === " ") onTerminar();
      }}
    >
      <div className="intro-contenido">
        <span className="intro-ruta" aria-hidden="true" />
        <LogoMicros className="intro-micro" etiqueta="Tres micros urbanas de Chile: roja, azul y amarilla" />
        <p className="intro-titulo">MicroDex</p>
        <p className="intro-subtitulo">Sistema Red · Chile</p>
        <div className="intro-autor" aria-label="MicroDex creada por Cristopher">
          <span className="intro-sello" aria-hidden="true">C</span>
          <span className="intro-credito">
            <small>Una aventura creada por</small>
            <strong>Cristopher</strong>
          </span>
        </div>
      </div>
      <span className="sr-only">Toca para continuar</span>
    </div>
  );
}
