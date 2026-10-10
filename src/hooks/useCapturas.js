import { useCallback, useMemo, useRef, useState } from "react";
import { BUSES } from "../data/buses.js";
import { LOGROS } from "../data/logros.js";

const CLAVE_DATOS = "microdex:datos:v1";

function leerDatos() {
  try {
    const texto = localStorage.getItem(CLAVE_DATOS);
    if (!texto) return { capturas: [], logros: {} };

    const datos = JSON.parse(texto);
    if (!datos || !Array.isArray(datos.capturas) || !datos.logros || typeof datos.logros !== "object" || Array.isArray(datos.logros)) {
      return { capturas: [], logros: {} };
    }

    const idsValidos = new Set(BUSES.map((bus) => bus.id));
    const idsGuardados = new Set();
    return {
      capturas: datos.capturas.filter((captura) => {
        if (
          !captura ||
          !idsValidos.has(captura.busId) ||
          idsGuardados.has(captura.busId) ||
          typeof captura.foto !== "string" ||
          !captura.foto.startsWith("data:image/") ||
          typeof captura.fecha !== "string" ||
          Number.isNaN(new Date(captura.fecha).getTime())
        ) {
          return false;
        }
        idsGuardados.add(captura.busId);
        return true;
      }),
      logros: datos.logros,
    };
  } catch {
    return { capturas: [], logros: {} };
  }
}

export function useCapturas() {
  const [datos, setDatos] = useState(leerDatos);
  const [errorAlmacenamiento, setErrorAlmacenamiento] = useState("");
  const datosRef = useRef(datos);

  const persistir = useCallback((siguiente) => {
    try {
      localStorage.setItem(CLAVE_DATOS, JSON.stringify(siguiente));
      datosRef.current = siguiente;
      setDatos(siguiente);
      setErrorAlmacenamiento("");
      return true;
    } catch {
      setErrorAlmacenamiento(
        "No hay espacio suficiente para guardar esta captura. Guarda un respaldo y libera algunas fotos.",
      );
      return false;
    }
  }, []);

  const registrarCaptura = useCallback(
    (captura) => {
      if (datos.capturas.some((item) => item.busId === captura.busId)) return false;
      return persistir({ ...datos, capturas: [...datos.capturas, captura] });
    },
    [datos, persistir],
  );

  const actualizarCoordenadas = useCallback((busId, fecha, coordenadas) => {
    const actuales = datosRef.current;
    let actualizada = false;
    const capturas = actuales.capturas.map((captura) => {
      if (captura.busId !== busId || captura.fecha !== fecha || captura.coordenadas) return captura;
      actualizada = true;
      return { ...captura, coordenadas };
    });
    if (!actualizada || !persistir({ ...actuales, capturas })) return null;
    return capturas;
  }, [persistir]);

  const liberarCaptura = useCallback(
    (busId) => persistir({ ...datos, capturas: datos.capturas.filter((captura) => captura.busId !== busId) }),
    [datos, persistir],
  );

  const desbloquearLogros = useCallback(
    (capturasEvaluadas = datosRef.current.capturas) => {
      const actuales = datosRef.current;
      const logros = { ...actuales.logros };
      const nuevos = [];

      for (const logro of LOGROS) {
        if (!logros[logro.id] && logro.cumple(capturasEvaluadas, BUSES)) {
          const desbloqueo = { fecha: new Date().toISOString() };
          logros[logro.id] = desbloqueo;
          nuevos.push({ ...logro, fecha: desbloqueo.fecha });
        }
      }

      if (nuevos.length > 0) persistir({ ...actuales, capturas: capturasEvaluadas, logros });
      return nuevos;
    },
    [persistir],
  );

  const restaurarDatos = useCallback(
    (restaurados) => {
      const idsValidos = new Set(BUSES.map((bus) => bus.id));
      const idsRestaurados = new Set();
      const capturas = restaurados.capturas.filter((captura) => {
        if (!idsValidos.has(captura.busId) || idsRestaurados.has(captura.busId)) return false;
        idsRestaurados.add(captura.busId);
        return true;
      });
      return persistir({ capturas, logros: restaurados.logros });
    },
    [persistir],
  );

  const borrarTodo = useCallback(() => persistir({ capturas: [], logros: {} }), [persistir]);

  const bytesUsados = useMemo(() => new Blob([JSON.stringify(datos)]).size, [datos]);

  return {
    capturas: datos.capturas,
    logros: datos.logros,
    errorAlmacenamiento,
    bytesUsados,
    registrarCaptura,
    actualizarCoordenadas,
    liberarCaptura,
    desbloquearLogros,
    restaurarDatos,
    borrarTodo,
    limpiarError: () => setErrorAlmacenamiento(""),
  };
}
