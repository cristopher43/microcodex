import { useEffect, useRef } from "react";
import L from "leaflet";

const ICONO_PIN = L.divIcon({
  className: "microdex-marker-wrapper",
  html: '<span class="microdex-marker"></span>',
  iconSize: [26, 38],
  iconAnchor: [13, 38],
});

export default function MiniMapa({ coordenadas }) {
  const contenedorRef = useRef(null);
  const mapaRef = useRef(null);

  useEffect(() => {
    if (!contenedorRef.current || !coordenadas) return undefined;

    const mapa = L.map(contenedorRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      attributionControl: true,
    }).setView([coordenadas.lat, coordenadas.lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);

    L.marker([coordenadas.lat, coordenadas.lng], { icon: ICONO_PIN }).addTo(mapa);
    mapaRef.current = mapa;

    const ajustar = window.setTimeout(() => mapa.invalidateSize(), 80);
    return () => {
      window.clearTimeout(ajustar);
      mapa.remove();
      mapaRef.current = null;
    };
  }, [coordenadas]);

  if (!coordenadas) return null;

  return (
    <div
      ref={contenedorRef}
      className="mini-mapa overflow-hidden rounded-xl border border-zinc-700"
      role="img"
      aria-label="Mapa de la ubicación de la captura"
    />
  );
}
