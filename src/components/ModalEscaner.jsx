import { useEffect, useRef, useState } from "react";
import { BusFront } from "lucide-react";

export default function ModalEscaner({ onCompletar, onBip }) {
  const [fase, setFase] = useState(0);
  const [numeros, setNumeros] = useState(["08", "42", "19", "76"]);
  const bipRef = useRef(onBip);
  bipRef.current = onBip;
  const texto = fase === 0 ? "Iniciando escáner..." : "Analizando chasis e IA de Red Movilidad...";

  useEffect(() => {
    const cambiarFase = window.setTimeout(() => setFase(1), 720);
    const completar = window.setTimeout(onCompletar, 3000);
    const cambiarNumeros = window.setInterval(
      () => setNumeros(Array.from({ length: 4 }, () => String(Math.floor(Math.random() * 90 + 10)))),
      180,
    );
    bipRef.current?.("bip");
    if ("vibrate" in navigator) navigator.vibrate([25, 35, 25]);

    return () => {
      window.clearTimeout(cambiarFase);
      window.clearTimeout(completar);
      window.clearInterval(cambiarNumeros);
    };
  }, [onCompletar]);

  return (
    <div className="modal-capa escaner-capa" role="dialog" aria-modal="true" aria-labelledby="titulo-escaner">
      <div className="escaner-panel">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-red-300">MicroDex Vision</p>
        <h2 id="titulo-escaner" className="texto-escaner text-2xl font-black text-white" aria-live="polite">
          <span aria-hidden="true">
            {Array.from(texto).map((letra, indice) => (
              letra === " " ? " " : (
                <span key={indice} className="texto-escaner-letra" style={{ animationDelay: Math.min(indice * 12, 420) + "ms" }}>
                  {letra}
                </span>
              )
            ))}
          </span>
          <span className="sr-only">{texto}</span>
        </h2>
        <div className="escaner-marco mt-8">
          <span className="escaner-esquina esquina-1" />
          <span className="escaner-esquina esquina-2" />
          <span className="escaner-esquina esquina-3" />
          <span className="escaner-esquina esquina-4" />
          <span className="linea-escaner" />
          <div className="escaner-numeros" aria-hidden="true">
            {numeros.map((numero, indice) => <span key={indice}>{numero}</span>)}
          </div>
          <BusFront className="escaner-bus" size={42} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div className="mt-7 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div className="barra-escaner h-full rounded-full bg-red-500" />
        </div>
        <p className="mt-3 text-sm text-zinc-400" aria-live="polite">
          {fase === 0 ? "Buscando señal..." : "Comparando detalles visuales..."}
        </p>
      </div>
    </div>
  );
}
