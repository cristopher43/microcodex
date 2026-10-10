import { useCallback, useRef, useState } from "react";

const CLAVE_SONIDO = "microdex:sonido";

function leerPreferencia() {
  try {
    return localStorage.getItem(CLAVE_SONIDO) !== "silencio";
  } catch {
    return true;
  }
}

export function useSonido() {
  const [activado, setActivado] = useState(leerPreferencia);
  const contextoRef = useRef(null);

  const alternar = useCallback(() => {
    setActivado((actual) => {
      const siguiente = !actual;
      try {
        localStorage.setItem(CLAVE_SONIDO, siguiente ? "activo" : "silencio");
      } catch {
        // La preferencia sigue funcionando durante esta sesión.
      }
      return siguiente;
    });
  }, []);

  const sonar = useCallback(
    (tipo = "bip") => {
      if (!activado || typeof window === "undefined") return;

      try {
        const AudioContexto = window.AudioContext || window.webkitAudioContext;
        if (!AudioContexto) return;
        if (!contextoRef.current) contextoRef.current = new AudioContexto();
        const contexto = contextoRef.current;
        if (contexto.state === "suspended") contexto.resume();

        const notas =
          tipo === "legendaria"
            ? [523.25, 659.25, 783.99, 1046.5]
            : tipo === "epica"
              ? [440, 554.37, 659.25]
              : tipo === "exito"
                ? [660, 880]
                : [740];

        const inicio = contexto.currentTime;
        notas.forEach((frecuencia, indice) => {
          const oscilador = contexto.createOscillator();
          const volumen = contexto.createGain();
          const cuando = inicio + indice * (tipo === "bip" ? 0 : 0.12);
          oscilador.type = tipo === "bip" ? "sine" : "triangle";
          oscilador.frequency.setValueAtTime(frecuencia, cuando);
          volumen.gain.setValueAtTime(0.0001, cuando);
          volumen.gain.exponentialRampToValueAtTime(0.11, cuando + 0.025);
          volumen.gain.exponentialRampToValueAtTime(0.0001, cuando + 0.19);
          oscilador.connect(volumen);
          volumen.connect(contexto.destination);
          oscilador.start(cuando);
          oscilador.stop(cuando + 0.21);
        });
      } catch {
        // El sonido es decorativo: si el navegador lo bloquea, el juego continúa.
      }
    },
    [activado],
  );

  return { activado, alternar, sonar };
}
