import { BusFront, Home, MapPinned, Medal } from "lucide-react";

const pestañas = [
  { id: "inicio", etiqueta: "Inicio", icono: Home },
  { id: "mapa", etiqueta: "Mapa", icono: MapPinned },
  { id: "coleccion", etiqueta: "MicroDex", icono: BusFront },
  { id: "logros", etiqueta: "Logros", icono: Medal },
];

export default function BarraNavegacion({ activa, onCambiar }) {
  return (
    <nav aria-label="Navegación principal" className="navegacion-principal">
      {pestañas.map((pestaña) => {
        const Icono = pestaña.icono;
        return (
          <button
            key={pestaña.id}
            type="button"
            onClick={() => onCambiar(pestaña.id)}
            aria-current={activa === pestaña.id ? "page" : undefined}
            className={"enlace-navegacion " + (activa === pestaña.id ? "enlace-activo" : "")}
          >
            <span className="navegacion-icono" aria-hidden="true"><Icono size={19} strokeWidth={2.2} /></span>
            <span>{pestaña.etiqueta}</span>
          </button>
        );
      })}
    </nav>
  );
}
