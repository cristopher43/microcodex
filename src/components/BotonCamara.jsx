import { useRef, useState } from "react";
import { ArrowRight, Camera } from "lucide-react";

export default function BotonCamara({ bloqueado, onArchivo, onCompleta, variante = "roja", etiqueta = "Cazar micro" }) {
  const inputRef = useRef(null);
  const [destello, setDestello] = useState(false);

  const elegir = () => {
    if (bloqueado) {
      onCompleta();
      return;
    }
    inputRef.current?.click();
  };

  const recibirArchivo = (evento) => {
    const archivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!archivo) return;

    setDestello(true);
    window.setTimeout(() => setDestello(false), 420);
    onArchivo(archivo);
  };

  const claseVariante = variante === "amarillo" ? "boton-camara-amarillo" : "boton-camara-rojo";

  return (
    <>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={recibirArchivo}
        aria-label="Elegir una foto de una micro"
      />
      <button
        type="button"
        className={"boton-camara relative w-full overflow-hidden rounded-2xl px-4 py-4 text-base font-black transition-transform active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 " + claseVariante + " " + (destello ? "boton-flash" : "")}
        onClick={elegir}
      >
        <span className="destello-camara" aria-hidden="true" />
        <Camera size={21} strokeWidth={2.5} aria-hidden="true" />
        <span>{etiqueta}</span>
        <ArrowRight size={20} strokeWidth={2.7} aria-hidden="true" />
      </button>
      {destello && <span className="flash-pantalla" aria-hidden="true" />}
    </>
  );
}
