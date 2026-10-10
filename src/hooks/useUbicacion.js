import { useCallback } from "react";

export function useUbicacion() {
  const obtenerUbicacion = useCallback(
    () =>
      new Promise((resolve) => {
        if (!("geolocation" in navigator)) {
          resolve(null);
          return;
        }

        let terminado = false;
        const finalizar = (resultado) => {
          if (terminado) return;
          terminado = true;
          resolve(resultado);
        };

        const temporizador = window.setTimeout(() => finalizar(null), 8000);

        try {
          navigator.geolocation.getCurrentPosition(
            (posicion) => {
              window.clearTimeout(temporizador);
              finalizar({
                lat: posicion.coords.latitude,
                lng: posicion.coords.longitude,
                precision: posicion.coords.accuracy,
              });
            },
            () => {
              window.clearTimeout(temporizador);
              finalizar(null);
            },
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
          );
        } catch {
          window.clearTimeout(temporizador);
          finalizar(null);
        }
      }),
    [],
  );

  return { obtenerUbicacion };
}
