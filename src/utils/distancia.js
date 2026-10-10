const RADIANES = Math.PI / 180;
const RADIO_TIERRA_METROS = 6371000;

export function distanciaMetros(puntoA, puntoB) {
  if (!puntoA || !puntoB) return Infinity;

  const lat1 = Number(puntoA.lat) * RADIANES;
  const lat2 = Number(puntoB.lat) * RADIANES;
  const diferenciaLat = (Number(puntoB.lat) - Number(puntoA.lat)) * RADIANES;
  const diferenciaLng = (Number(puntoB.lng) - Number(puntoA.lng)) * RADIANES;

  const a =
    Math.sin(diferenciaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(diferenciaLng / 2) ** 2;

  return RADIO_TIERRA_METROS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
